/* ============================================================
   DONNÉES DU PORTFOLIO — C'EST ICI QUE VOUS MODIFIEZ TOUT
   ============================================================
   Pas besoin de toucher au HTML, au CSS ou à main.js.
   Modifiez juste les valeurs ci-dessous, sauvegardez, et c'est
   pris en compte au rechargement de la page.
   ============================================================ */

const PORTFOLIO_DATA = {

  // ------------------------------------------------------------
  // 1. INFOS PRINCIPALES
  // ------------------------------------------------------------
  site: {
    firstName: "Adnane",
    lastName: "Atmani",
    title: "Eleve Ingénieur d'État en Génie Chimique",
    email: "adnanatmani22@gmail.com",
    phone: "+212 641664868",
  },

  // ------------------------------------------------------------
  // 2. SECTION D'ACCUEIL (HERO)
  // ------------------------------------------------------------
  hero: {
    greeting: "Bonjour, je suis",
    bio: "Passionné par les procédés industriels, les matériaux et la simulation, je suis actuellement à la recherche d'un stage de fin d'études (PFE) pour valider ma dernière année d'ingénieur .",
    tags: [
      "Process",
      "Materials",
      "Water Treatment",
    ],
  },

  // ------------------------------------------------------------
  // 3. PROJETS
  // ------------------------------------------------------------
  // Pour AJOUTER un projet : copiez un bloc { ... } en entier
  // (avec la virgule qui suit), collez-le à la suite des autres,
  // puis changez le contenu. L'ordre ici = l'ordre affiché.
  //
  // Deux façons de rendre un projet cliquable (choisissez UNE
  // des deux, laissez l'autre vide "") :
  //
  //   • "file"  → le nom d'un fichier que vous avez déposé dans
  //               le dossier /projects du dépôt (PDF, image,
  //               zip, vidéo...). Ex : "rapport-co2.pdf"
  //               Le visiteur clique et télécharge le fichier
  //               directement depuis votre site, pas de lien
  //               externe à créer ni à maintenir.
  //
  //   • "link"  → une URL complète vers un site externe
  //               (GitHub, démo en ligne, article...).
  //
  // Si les deux sont vides "", la carte n'est juste pas cliquable.
  // ------------------------------------------------------------
  projects: [
    {
      title: "Valorisation du CO₂ en méthanol",
      description:
        "Simulation du procédé de production de méthanol à partir de CO₂ et H₂ par une réaction d’hydrogénation, c’est-à-dire par l’addition d’hydrogène moléculaire sur le dioxyde de carbone, en présence de conditions spécifiques de température, pression et souvent d’un catalyseur ce dernier n'etant pas utilisé dans cette simulation dans le but de savoir la pureté et la consomation énergitique du procédés sans y avoir recours.",
      tags: ["Aspen Plus", "Simulation"],
      files: [
        { name: "simulation projet Co2", path: "simulation projet Co2.apwz" },
        { name: "Simulation co2", path: "Simulation co2.pdf" }
      ],
      link: "",   // ex: "https://github.com/..." (lien externe)
    },
    {
      title: "Essaie d'explication des 16h de repos du blé apres conditionement",
      description:
        "Modélisation du phenomene par un model simplifié qui à été utilisé comme source alimentant le DOE par plan Box-Bekhnen ayant 3 facteurs chacun a 3 niveau et avec l'humidité à instant t commme réponse. ce traibaille a été effectué dù au fait d'indiponibilité de materiel d'experimentation laboratoire",
      tags: [],
      files: [
        { name: "DOE BBD", path: "DOE BBD.xlsx" },
        { name: "Modele calculateur", path: "Modele calculateur.xlsm" },
        { name: "Model et DOE", path: "Model et DOE.pdf" }
      ],
      link: "",
    },
    {
      title: "Essaie d'amélioration simplifiée de qualité eau potable",
      description:
        "Après contamination par Aluminium dù au fait de saturation de charbon actif et par conséquent non adsorption et accumulation de l'exces de l'aluminium prevenant du coagulant AlSo4 , la resolution a été effectuer en changant la boue contannt le charbon actif et l'effectuation de test jar et chlore libre pour determiner les nouvelle dose a utilisé pour avoir une eau potable convenable aux normes imposées",
      tags: ["Water Treatment","Environmental"],
      files: [
        // ⚠️ Vérifiez le nom exact + l'extension du fichier que vous
        // déposerez dans /projects (ici on suppose un PDF)
        { name: "Essaie d'amélioration", path: "Essaie d'amélioration.pdf" },
      ],
      link: "",
    },
    {
      title: "Etude préliminaire des risques d'une minoterie basée selon la norme ISO 31000 ",
      description:
        "Applications des lignes derictives de la norme ISO 31000 pour les risques de la minoterie en commençant par identification  suivant des observations terrain et une check-list construite ,puis analyse par matrice de criticité ,Bow-tie et AMDEC pour finalement proposé des barriere préventive ainsi que protectrice en deux phases sous la supposition de presence d'une envelloppe de 200000 DH",
      tags: ["ISO"],
      files: [
        // ⚠️ Vérifiez le nom exact + l'extension du fichier
        { name: "Etude Préliminaire Gestion Risques ISO31000", path: "Etude Préliminaire Gestion Risques ISO31000.pdf" },
      ],
      link: "",
    },
    {
      title: "Formulation de schémas P&ID pour preuve de concept d'une proposition simplifiée de remplacement d'un pupitre à puossoirs ",
      description:
        " l'idée de modernisation du systéme manuelle de supervision à donner naissance à la formulation de schémas P&ID avec un document faisant l'inventaire des equipement ainsi qu'une explication courte de la logique globale et ceci pour prouver du concept",
      tags: ["P&ID"],
      files: [
        { name: "PID-100 Réception Pré-nettoyage", path: "PID-100 Réception Pré-nettoyage.pdf" },
        { name: "PID-200 Nettoyage", path: "PID-200 Nettoyage.pdf" },
        { name: "PID-300 Mouture", path: "PID-300 Mouture.pdf" },
        { name: "PID-400 Stockage Produit Fini", path: "PID-400 Stockage Produit Fini.pdf" }
      ],
      link: "",
    },
    {
      title: "Formulation d'une proposition d'augmentation de capacité analytique du laboratoire de la minoterie avec estimation budgétaire",
      description:
        "Etant donné que le laboratoire avait comme capacité d'analyse que 4 test cette proposition vise à en faire 15 soit 11 test de plus et ceci avec estimations budgétaire des machines (CAPEX) sous une enveloppe de 200000 DH hors coùt d'utilisation (OPEX) ",
      tags: [],
      files: [
        // ⚠️ Vérifiez le nom exact + l'extension du fichier
        { name: "Proposition Laboratoire", path: "Proposition Laboratoire.pdf" },
      ],
      link: "",
    },
  ],

  // ------------------------------------------------------------
  // 4. À PROPOS
  // ------------------------------------------------------------
  about: {
    description:
      "Élève-Ingénieur d'État en Génie Chimique, fasciné par la manière dont les procédés chimiques et les matériaux ont façonné le monde moderne.",
    education: [
      {
        degree: "Ingénieur d'État en Génie Chimique",
        school: "École Nationale Supérieure de Chimie de Kenitra",
        year: "2022 – 2027",
      },
    ],
    interests: [
      "Procédés industriels ",
      "énergie renouvelable",
      "Valorisation des déchets",
    ],
    // category doit être : "core", "technical" ou "specialized"
    // (change juste la couleur du badge)
    skills: [
      { name: "Génie chimique", category: "core" },
      { name: "Génie des procédés", category: "core" },
      { name: "Matériaux", category: "core" },
      { name: "Traitement de l'eau", category: "core" },
    ],
  },

  // ------------------------------------------------------------
  // 5. CONTACT
  // ------------------------------------------------------------
  contact: {
    subtitle:
      "N'hésitez pas à me contacter.",

    // ------------------------------------------------------------
    // RECEVOIR LES MESSAGES DU FORMULAIRE DIRECTEMENT PAR EMAIL
    // ------------------------------------------------------------
    // Un site GitHub Pages n'a pas de serveur : il faut donc un
    // minimum d'intermédiaire pour transformer "quelqu'un remplit
    // un formulaire" en "un email arrive dans ma boîte". Le plus
    // simple et gratuit, sans compte à créer :
    //
    //   1. Allez sur https://web3forms.com
    //   2. Entrez SEULEMENT votre adresse email, cliquez sur
    //      "Create Access Key"
    //   3. Copiez la clé reçue par email et collez-la ci-dessous
    //
    // C'est tout : les messages arriveront directement dans votre
    // boîte mail (l'adresse que vous avez entrée sur web3forms.com).
    //
    // Si vous laissez ce champ vide, le formulaire ouvrira à la
    // place le client mail du visiteur (mailto) avec le message
    // pré-rempli — ça marche sans rien configurer, mais ça dépend
    // du visiteur ayant un client mail installé.
    web3formsKey: "2c058531-0209-4f9c-b7f9-874519862dc0",
  },
};
