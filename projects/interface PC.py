import sys
import serial
import serial.tools.list_ports
import csv
from datetime import datetime
from collections import deque
from PySide6.QtWidgets import (QApplication, QMainWindow, QVBoxLayout, QWidget,
                               QPushButton, QHBoxLayout, QLabel, QComboBox,
                               QLineEdit, QGroupBox, QFileDialog, QMessageBox,
                               QGridLayout)
from PySide6.QtCore import QTimer, Qt
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure


class PHMonitorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Station de Contrôle pH Professionnelle")
        self.resize(1000, 850)

        # --- Données et État ---
        self.max_points = 100
        self.data_history = []  # Pour la sauvegarde CSV complète
        self.data_ph_in = deque(maxlen=self.max_points)
        self.data_ph_out = deque(maxlen=self.max_points)
        self.data_flow_in = deque(maxlen=self.max_points)    # Débit entrée (L/min)
        self.data_flow_out = deque(maxlen=self.max_points)   # Débit sortie (L/min)
        self.data_cond_in = deque(maxlen=self.max_points)    # Conductivité entrée (µS/cm)
        self.data_cond_out = deque(maxlen=self.max_points)   # Conductivité sortie (µS/cm)
        self.ser = None

        # --- UI Setup ---
        self.init_ui()

        # --- Timer ---
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_data)

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)

        # 1. Barre de Configuration (Port & Étalonnage)
        config_layout = QHBoxLayout()

        # Groupe Connexion
        conn_group = QGroupBox("Connexion Série")
        conn_layout = QHBoxLayout()
        self.combo_ports = QComboBox()
        self.refresh_ports()
        self.btn_connect = QPushButton("Connecter")
        self.btn_connect.clicked.connect(self.toggle_connection)
        conn_layout.addWidget(QLabel("Port :"))
        conn_layout.addWidget(self.combo_ports)
        conn_layout.addWidget(self.btn_connect)
        conn_group.setLayout(conn_layout)

        # Groupe Étalonnage
        calib_group = QGroupBox("Étalonnage (Valeurs brutes Arduino)")
        calib_layout = QGridLayout()
        self.input_v7 = QLineEdit("512")  # Valeur par défaut
        self.input_v4 = QLineEdit("620")
        self.input_flow_factor = QLineEdit("1.0")  # 1.0 = valeur déjà en L/min
        self.input_cond_factor = QLineEdit("1.0")  # 1.0 = valeur déjà en µS/cm
        calib_layout.addWidget(QLabel("Valeur à pH 7 :"), 0, 0)
        calib_layout.addWidget(self.input_v7, 0, 1)
        calib_layout.addWidget(QLabel("Valeur à pH 4 :"), 0, 2)
        calib_layout.addWidget(self.input_v4, 0, 3)
        calib_layout.addWidget(QLabel("Facteur débit :"), 1, 0)
        calib_layout.addWidget(self.input_flow_factor, 1, 1)
        calib_layout.addWidget(QLabel("Facteur conductivité :"), 1, 2)
        calib_layout.addWidget(self.input_cond_factor, 1, 3)
        calib_group.setLayout(calib_layout)

        config_layout.addWidget(conn_group)
        config_layout.addWidget(calib_group)
        main_layout.addLayout(config_layout)

        # 2. Graphique (pH, Débit, Conductivité - axe X partagé, Entrée/Sortie sur chacun)
        self.canvas = FigureCanvas(Figure(figsize=(8, 6)))
        main_layout.addWidget(self.canvas)
        self.ax, self.ax_flow, self.ax_cond = self.canvas.figure.subplots(
            3, 1, sharex=True)
        self.line_in, = self.ax.plot([], [], 'b-', label="Entrée", lw=1.5)
        self.line_out, = self.ax.plot([], [], 'r-', label="Sortie", lw=1.5)
        self.line_flow_in, = self.ax_flow.plot([], [], 'b-', label="Entrée", lw=1.5)
        self.line_flow_out, = self.ax_flow.plot([], [], 'r-', label="Sortie", lw=1.5)
        self.line_cond_in, = self.ax_cond.plot([], [], 'b-', label="Entrée", lw=1.5)
        self.line_cond_out, = self.ax_cond.plot([], [], 'r-', label="Sortie", lw=1.5)
        self.setup_plot()

        # 3. Barre d'outils basse (Actions)
        action_layout = QHBoxLayout()
        self.btn_save = QPushButton("Exporter en .CSV")
        self.btn_save.clicked.connect(self.save_to_csv)
        self.label_valeurs = QLabel(
            "pH Entrée: -- | pH Sortie: --\n"
            "Débit Entrée: -- L/min | Débit Sortie: -- L/min\n"
            "Conductivité Entrée: -- µS/cm | Conductivité Sortie: -- µS/cm")
        self.label_valeurs.setStyleSheet("font-weight: bold; font-size: 14px;")

        action_layout.addWidget(self.label_valeurs)
        action_layout.addStretch()
        action_layout.addWidget(self.btn_save)
        main_layout.addLayout(action_layout)

    def setup_plot(self):
        # pH
        self.ax.set_ylim(0, 14)
        self.ax.set_xlim(0, self.max_points)
        self.ax.set_ylabel("pH")
        # Débit
        self.ax_flow.set_ylim(0, 10)
        self.ax_flow.set_ylabel("Débit (L/min)")
        # Conductivité
        self.ax_cond.set_ylim(0, 1000)
        self.ax_cond.set_ylabel("Cond. (µS/cm)")

        for axis in (self.ax, self.ax_flow, self.ax_cond):
            axis.legend(loc='upper right')
            axis.grid(True, alpha=0.3)
        self.canvas.figure.tight_layout()

    def refresh_ports(self):
        self.combo_ports.clear()
        ports = [p.device for p in serial.tools.list_ports.comports()]
        self.combo_ports.addItems(ports)

    def toggle_connection(self):
        if self.ser is None or not self.ser.is_open:
            try:
                port = self.combo_ports.currentText()
                self.ser = serial.Serial(port, 9600, timeout=0.1)
                self.timer.start(100)
                self.btn_connect.setText("Déconnecter")
                self.btn_connect.setStyleSheet("background-color: #ffcccc")
            except Exception as e:
                QMessageBox.critical(self, "Erreur", f"Impossible d'ouvrir le port : {e}")
        else:
            self.timer.stop()
            self.ser.close()
            self.btn_connect.setText("Connecter")
            self.btn_connect.setStyleSheet("")

    def calculate_ph(self, raw_value):
        try:
            v7 = float(self.input_v7.text())
            v4 = float(self.input_v4.text())
            pente = (7.0 - 4.0) / (v7 - v4)
            offset = 7.0 - (pente * v7)
            return round((pente * raw_value) + offset, 2)
        except:
            return 0.0

    def calculate_flow(self, raw_value):
        """Débit en L/min = valeur brute x facteur d'étalonnage (entrée et sortie)."""
        try:
            return round(raw_value * float(self.input_flow_factor.text()), 2)
        except:
            return 0.0

    def calculate_conductivity(self, raw_value):
        """Conductivité en µS/cm = valeur brute x facteur d'étalonnage (entrée et sortie)."""
        try:
            return round(raw_value * float(self.input_cond_factor.text()), 1)
        except:
            return 0.0

    @staticmethod
    def autoscale_from_zero(axis, series, minimum_top):
        """Ajuste l'axe Y de 0 jusqu'au max des courbes (+10 % de marge)."""
        values = [v for s in series for v in s]
        top = max(values) * 1.1 if values else minimum_top
        axis.set_ylim(0, max(top, minimum_top))

    def update_data(self):
        if self.ser and self.ser.in_waiting > 0:
            try:
                line = self.ser.readline().decode('utf-8').strip()
                # On attend 6 valeurs brutes séparées par une virgule depuis l'Arduino :
                # pH entrée, pH sortie, débit entrée, débit sortie,
                # conductivité entrée, conductivité sortie
                (raw_ph_in, raw_ph_out,
                 raw_flow_in, raw_flow_out,
                 raw_cond_in, raw_cond_out) = map(float, line.split(','))

                ph_in = self.calculate_ph(raw_ph_in)
                ph_out = self.calculate_ph(raw_ph_out)
                flow_in = self.calculate_flow(raw_flow_in)
                flow_out = self.calculate_flow(raw_flow_out)
                cond_in = self.calculate_conductivity(raw_cond_in)
                cond_out = self.calculate_conductivity(raw_cond_out)

                # Stockage
                timestamp = datetime.now().strftime("%H:%M:%S")
                self.data_ph_in.append(ph_in)
                self.data_ph_out.append(ph_out)
                self.data_flow_in.append(flow_in)
                self.data_flow_out.append(flow_out)
                self.data_cond_in.append(cond_in)
                self.data_cond_out.append(cond_out)
                self.data_history.append([timestamp, ph_in, ph_out,
                                          flow_in, flow_out,
                                          cond_in, cond_out])

                # Update UI
                self.label_valeurs.setText(
                    f"pH Entrée: {ph_in:.2f} | pH Sortie: {ph_out:.2f}\n"
                    f"Débit Entrée: {flow_in:.2f} L/min | Débit Sortie: {flow_out:.2f} L/min\n"
                    f"Conductivité Entrée: {cond_in:.1f} µS/cm | "
                    f"Conductivité Sortie: {cond_out:.1f} µS/cm")
                x = range(len(self.data_ph_in))
                self.line_in.set_data(x, list(self.data_ph_in))
                self.line_out.set_data(x, list(self.data_ph_out))
                self.line_flow_in.set_data(x, list(self.data_flow_in))
                self.line_flow_out.set_data(x, list(self.data_flow_out))
                self.line_cond_in.set_data(x, list(self.data_cond_in))
                self.line_cond_out.set_data(x, list(self.data_cond_out))
                self.autoscale_from_zero(self.ax_flow,
                                         (self.data_flow_in, self.data_flow_out), 10)
                self.autoscale_from_zero(self.ax_cond,
                                         (self.data_cond_in, self.data_cond_out), 1000)
                self.canvas.draw()
            except:
                pass

    def save_to_csv(self):
        if not self.data_history:
            QMessageBox.warning(self, "Attention", "Aucune donnée à enregistrer.")
            return

        path, _ = QFileDialog.getSaveFileName(self, "Sauvegarder les données", "", "CSV Files (*.csv)")
        if path:
            with open(path, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(["Heure", "pH Entrée", "pH Sortie",
                                 "Débit Entrée (L/min)", "Débit Sortie (L/min)",
                                 "Conductivité Entrée (µS/cm)", "Conductivité Sortie (µS/cm)"])
                writer.writerows(self.data_history)
            QMessageBox.information(self, "Succès", "Données exportées avec succès.")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = PHMonitorApp()
    window.show()
    sys.exit(app.exec())
