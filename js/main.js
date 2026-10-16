/* ============================================================
   MOTEUR DU PORTFOLIO — vous n'avez normalement pas besoin
   de modifier ce fichier. Toutes les infos sont dans data.js
   ============================================================ */

(function () {
  const d = PORTFOLIO_DATA;
  const currentYear = new Date().getFullYear();

  /* ---------- Utilitaires ---------- */
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  };

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  /* ---------- 1. Métadonnées de page ---------- */
  document.title = `${d.site.firstName} ${d.site.lastName} — ${d.site.title}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      `Portfolio de ${d.site.firstName} ${d.site.lastName}, ${d.site.title}. ${d.hero.bio}`
    );
  }

  /* ---------- 2. Navbar ---------- */
  const navLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Projets", href: "#projets" },
    { label: "À propos", href: "#a-propos" },
    { label: "Contact", href: "#contact" },
  ];

  const navbarBrand = document.getElementById("navbar-brand");
  navbarBrand.innerHTML = `<span class="brand-name">${escapeHtml(
    d.site.firstName
  )}</span> <span class="brand-sep">— ${escapeHtml(
    d.site.title.split(" ").slice(-2).join(" ")
  )}</span>`;

  const desktopNav = document.getElementById("navbar-links");
  const mobileNav = document.getElementById("mobile-nav-links");
  navLinks.forEach((link) => {
    const li = el("li");
    const btn = el("button", "nav-link", escapeHtml(link.label));
    btn.dataset.href = link.href;
    li.appendChild(btn);
    desktopNav.appendChild(li);

    const mobileBtn = el("button", "mobile-nav-link", escapeHtml(link.label));
    mobileBtn.dataset.href = link.href;
    mobileNav.appendChild(mobileBtn);
  });

  function scrollToSection(href) {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  document.querySelectorAll("[data-href]").forEach((btn) => {
    btn.addEventListener("click", () => {
      scrollToSection(btn.dataset.href);
      document.getElementById("mobile-menu").classList.remove("open");
      document.getElementById("hamburger").setAttribute("aria-expanded", "false");
    });
  });

  navbarBrand.addEventListener("click", () => scrollToSection("#accueil"));

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburger.innerHTML = ICON_MENU;
  document.getElementById("scroll-arrow").innerHTML = ICON_ARROW_DOWN;
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.innerHTML = isOpen ? ICON_CLOSE : ICON_MENU;
  });

  // Si on agrandit la fenêtre (ou qu'on tourne une tablette) pendant que
  // le menu mobile est ouvert, on le referme pour éviter qu'il reste
  // coincé en plein écran sur un affichage desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 767 && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = ICON_MENU;
    }
  });

  /* ---------- 3. Hero ---------- */
  document.getElementById("hero-initials").textContent =
    d.site.firstName[0] + d.site.lastName[0];
  document.getElementById("hero-greeting").textContent = d.hero.greeting;
  document.getElementById("hero-firstname").textContent = d.site.firstName;
  document.getElementById("hero-lastname").textContent = d.site.lastName;
  document.getElementById("hero-title").textContent = d.site.title;
  document.getElementById("hero-bio").textContent = d.hero.bio;
  document.getElementById("hero-tagline").textContent = d.site.tagline;

  const tagsContainer = document.getElementById("hero-tags");
  d.hero.tags.forEach((tag) => {
    tagsContainer.appendChild(el("span", "pill", escapeHtml(tag)));
  });

  document.getElementById("btn-arrow").innerHTML = ICON_ARROW_UP_RIGHT;
  document
    .getElementById("btn-see-projects")
    .addEventListener("click", () => scrollToSection("#projets"));
  document
    .getElementById("btn-contact-me")
    .addEventListener("click", () => scrollToSection("#contact"));

  /* ---------- 4. Projets ---------- */
  const projectsList = document.getElementById("projects-list");
  d.projects.forEach((project, index) => {
    const num = String(index + 1).padStart(2, "0");
    const files = Array.isArray(project.files) ? project.files : [];
    const hasLink = project.link && project.link.trim() !== "";

    const resourceChips = [
      ...files.map((f) => {
        // Compatible avec les deux façons d'écrire un fichier :
        //   { path: "fichier.pdf", name: "Libellé affiché" }
        //   { name: "fichier.pdf", label: "Libellé affiché" }
        const fileName = f.path || f.name;
        const displayLabel = f.path ? (f.name || fileName) : (f.label || f.name);
        const href = `projects/${encodeURIComponent(fileName)}`;
        return `
        <a class="resource-chip" href="${href}" download>
          ${ICON_DOWNLOAD}<span>${escapeHtml(displayLabel)}</span>
        </a>`;
      }),
      ...(hasLink
        ? [
            `<a class="resource-chip resource-chip-link" href="${escapeHtml(
              project.link
            )}" target="_blank" rel="noopener noreferrer">
               ${ICON_ARROW_UP_RIGHT}<span>Voir le projet</span>
             </a>`,
          ]
        : []),
    ].join("");

    const card = el(
      "article",
      "project-card reveal",
      `
      <div class="project-card-inner">
        <span class="project-num">${num}</span>
        <div class="project-content">
          <div class="project-head">
            <h3>${escapeHtml(project.title)}</h3>
          </div>
          <p class="project-desc">${escapeHtml(project.description)}</p>
          <div class="project-tags">
            ${project.tags
              .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
              .join("")}
          </div>
          ${
            resourceChips
              ? `<div class="project-resources">${resourceChips}</div>`
              : ""
          }
        </div>
      </div>`
    );
    card.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
    projectsList.appendChild(card);
  });

  /* ---------- 5. À propos ---------- */
  document.getElementById("about-description").textContent = d.about.description;

  const eduContainer = document.getElementById("about-education");
  d.about.education.forEach((edu) => {
    eduContainer.appendChild(
      el(
        "div",
        "edu-row",
        `<span class="edu-degree">${escapeHtml(edu.degree)}</span>
         <span class="edu-school">${escapeHtml(edu.school)}</span>
         <span class="edu-year">${escapeHtml(edu.year)}</span>`
      )
    );
  });

  const interestsContainer = document.getElementById("about-interests");
  d.about.interests.forEach((interest) => {
    interestsContainer.appendChild(
      el("li", "interest-item", `<span class="dot"></span>${escapeHtml(interest)}`)
    );
  });

  const skillsContainer = document.getElementById("about-skills");
  d.about.skills.forEach((skill) => {
    skillsContainer.appendChild(
      el("span", `skill-pill skill-${skill.category}`, escapeHtml(skill.name))
    );
  });

  /* ---------- 6. Contact ---------- */
  document.getElementById("contact-subtitle").textContent = d.contact.subtitle;

  const contactItems = [
    {
      icon: ICON_MAIL,
      label: "Email",
      value: d.site.email,
      href: `mailto:${d.site.email}`,
      copyable: true,
    },
    {
      icon: ICON_PHONE,
      label: "Téléphone",
      value: d.site.phone,
      href: `tel:${d.site.phone.replace(/\s/g, "")}`,
      copyable: true,
    },
  ];

  const contactContainer = document.getElementById("contact-items");
  contactItems.forEach((item) => {
    const row = el(
      "a",
      "contact-row",
      `
      <div class="contact-icon">${item.icon}</div>
      <div class="contact-text">
        <p class="contact-label">${escapeHtml(item.label)}</p>
        <p class="contact-value">${escapeHtml(item.value)}</p>
      </div>
      ${
        item.copyable
          ? `<button class="copy-btn" aria-label="Copier ${escapeHtml(
              item.label
            )}">${ICON_COPY}</button>`
          : ""
      }`
    );
    row.href = item.href;
    if (item.href.startsWith("http")) {
      row.target = "_blank";
      row.rel = "noopener noreferrer";
    }
    if (item.copyable) {
      const copyBtn = row.querySelector(".copy-btn");
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard
          .writeText(item.value)
          .then(() => {
            copyBtn.innerHTML = ICON_CHECK;
            copyBtn.classList.add("copied");
            setTimeout(() => {
              copyBtn.innerHTML = ICON_COPY;
              copyBtn.classList.remove("copied");
            }, 2000);
          })
          .catch(() => {});
      });
    }
    contactContainer.appendChild(row);
  });

  /* ---------- 7. Formulaire de contact ---------- */
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const web3formsKey = d.contact.web3formsKey && d.contact.web3formsKey.trim();

    // --- Cas 1 : Web3Forms configuré → le message arrive directement
    // dans votre boîte mail, sans que le visiteur ne fasse quoi que ce soit
    if (web3formsKey) {
      try {
        submitBtn.disabled = true;
        const formData = new FormData(form);
        formData.append("access_key", web3formsKey);
        formData.append("subject", `Nouveau message depuis le portfolio de ${d.site.firstName} ${d.site.lastName}`);
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          showSubmitted();
        } else {
          submitBtn.disabled = false;
          alert("Une erreur est survenue. Merci de réessayer.");
        }
      } catch {
        submitBtn.disabled = false;
        alert("Une erreur est survenue. Merci de réessayer.");
      }
      return;
    }

    // --- Cas 2 : rien configuré → on ouvre le client mail du visiteur
    // (aucun setup requis, mais dépend d'un client mail installé côté visiteur)
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${d.site.email}?subject=${encodeURIComponent(
      "Message depuis le portfolio"
    )}&body=${body}`;
    showSubmitted();
  });

  function showSubmitted() {
    submitBtn.textContent = "Message envoyé ✓";
    submitBtn.classList.add("submitted");
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = "Envoyer";
      submitBtn.classList.remove("submitted");
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  }

  /* ---------- 8. Footer ---------- */
  document.getElementById("footer-name").textContent = `${d.site.firstName} ${d.site.lastName}`;
  document.getElementById("footer-year").textContent = currentYear;
  document.getElementById("footer-email").href = `mailto:${d.site.email}`;

  /* ---------- 9. Scroll spy (navbar active + glass on scroll) ---------- */
  const header = document.getElementById("site-header");
  const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

  function updateScrollState() {
    header.classList.toggle("scrolled", window.scrollY > 40);

    let active = sectionIds[0];
    for (const id of sectionIds) {
      const target = document.getElementById(id);
      if (target && target.getBoundingClientRect().top <= 120) active = id;
    }
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.href === `#${active}`);
    });

    // Scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    document.getElementById("scroll-progress").style.transform = `scaleX(${progress})`;
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  /* ---------- 10. Animations au défilement (reveal on scroll) ---------- */
  const revealTargets = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-40px" }
  );
  revealTargets.forEach((t) => io.observe(t));

  /* ---------- 11. Formes flottantes du hero ---------- */
  const shapesData = [
    { type: "circle", size: 320, x: "10%", y: "15%", opacity: 0.04, duration: 28 },
    { type: "circle", size: 200, x: "80%", y: "25%", opacity: 0.035, duration: 32 },
    { type: "rounded", size: 260, x: "70%", y: "60%", opacity: 0.03, duration: 35 },
    { type: "circle", size: 140, x: "20%", y: "70%", opacity: 0.045, duration: 24 },
    { type: "rounded", size: 180, x: "50%", y: "10%", opacity: 0.025, duration: 30 },
    { type: "circle", size: 100, x: "90%", y: "80%", opacity: 0.04, duration: 26 },
  ];
  const shapesContainer = document.getElementById("floating-shapes");
  shapesData.forEach((s, i) => {
    const shape = el("div", `shape shape-${s.type}`);
    shape.style.left = s.x;
    shape.style.top = s.y;
    shape.style.width = s.size + "px";
    shape.style.height = s.size + "px";
    shape.style.animationDuration = s.duration + "s";
    shape.style.animationDelay = i * 0.8 + "s";
    if (s.type === "circle") {
      shape.style.background = `radial-gradient(circle at 30% 30%, oklch(0.65 0.06 60 / ${s.opacity}), oklch(0.65 0.06 60 / ${s.opacity * 0.3}))`;
    } else {
      shape.style.background = `radial-gradient(circle at 70% 30%, oklch(0.55 0.08 50 / ${s.opacity}), oklch(0.55 0.08 50 / ${s.opacity * 0.2}))`;
    }
    shapesContainer.appendChild(shape);
  });
})();
