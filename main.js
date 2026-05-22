(() => {
  const data = window.ChoDesignData || {};
  const orderUrl = data.orderUrl || "https://cracked.st/ChoDesign";
  const supportsHover = window.matchMedia("(hover: hover)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function setOrderLinks() {
    qsa('a[href="https://cracked.st/ChoDesign"]').forEach((link) => {
      link.href = orderUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function createImg(item, alt) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = alt || item.title || "ChoDesign portfolio asset";
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      img.style.opacity = "0";
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = item.title || "Preview unavailable";
      img.parentElement?.appendChild(fallback);
    }, { once: true });
    return img;
  }

  function openPreview(item) {
    const modal = qs("#previewModal");
    const modalImage = qs("#modalImage");
    const modalTitle = qs("#modalTitle");
    const modalCategory = qs("#modalCategory");

    if (!modal || !modalImage || !modalTitle || !modalCategory) return;

    modalImage.src = item.src;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalCategory.textContent = item.category;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    const modal = qs("#previewModal");
    const modalImage = qs("#modalImage");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (modalImage) modalImage.removeAttribute("src");
  }

  function makeAssetCard(item, type) {
    const card = document.createElement("article");
    card.className = `asset-card ${type}-card tilt-card`;
    card.tabIndex = 0;

    const media = document.createElement("div");
    media.className = "media";
    media.appendChild(createImg(item, `${item.title} — ${item.category}`));

    const info = document.createElement("div");
    info.className = "asset-info";
    info.innerHTML = `
      <span>${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <b class="open-link" aria-hidden="true">↗</b>
    `;

    card.append(media, info);
    card.addEventListener("click", () => openPreview(item));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(item);
      }
    });

    return card;
  }

  function makeWorkCard(item) {
    const card = document.createElement("article");
    card.className = `work-card tilt-card ${item.className || ""}`;
    card.tabIndex = 0;
    card.appendChild(createImg(item, `${item.title} featured work`));

    const info = document.createElement("div");
    info.className = "work-info";
    info.innerHTML = `
      <span>${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.type === "thread" ? "Contained sales thread preview" : item.type === "signature" ? "Updated motion signature" : "Premium portfolio piece"}</p>
    `;

    card.appendChild(info);
    card.addEventListener("click", () => openPreview(item));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(item);
      }
    });
    return card;
  }

  function renderPortfolio() {
    const featuredGrid = qs("#featuredGrid");
    const logosGrid = qs("#logosGrid");
    const threadsGrid = qs("#threadsGrid");
    const signaturesGrid = qs("#signaturesGrid");
    const rotatorTrack = qs("#rotatorTrack");

    if (featuredGrid) {
      (data.featured || []).forEach((item) => featuredGrid.appendChild(makeWorkCard(item)));
    }

    if (logosGrid) {
      (data.logos || []).forEach((item) => logosGrid.appendChild(makeAssetCard(item, "logo")));
    }

    if (threadsGrid) {
      (data.threads || []).forEach((item) => threadsGrid.appendChild(makeAssetCard(item, "thread")));
    }

    if (signaturesGrid) {
      (data.signatures || []).forEach((item) => signaturesGrid.appendChild(makeAssetCard(item, "signature")));
    }

    if (rotatorTrack) {
      const rotatorItems = [...(data.logos || []), ...(data.signatures || [])];
      [...rotatorItems, ...rotatorItems].forEach((item) => {
        const mini = document.createElement("div");
        mini.className = "mini-card";
        mini.appendChild(createImg(item, `${item.title} rotating preview`));
        rotatorTrack.appendChild(mini);
      });
    }
  }

  function initLenis() {
    if (reducedMotion || !window.Lenis) return;

    const lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const target = qs(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -84 });
        document.body.classList.remove("menu-open");
        qs("[data-menu-toggle]")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initHeader() {
    const header = qs("[data-header]");
    const menuToggle = qs("[data-menu-toggle]");
    const navLinks = qsa(".primary-nav a");
    const sections = navLinks
      .map((link) => qs(link.getAttribute("href")))
      .filter(Boolean);

    const onScroll = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);

      let active = sections[0]?.id;
      const marker = window.scrollY + 160;
      sections.forEach((section) => {
        if (section.offsetTop <= marker) active = section.id;
      });

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${active}`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    menuToggle?.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        menuToggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initReveal() {
    const elements = qsa(".reveal");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
  }

  function initDecode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$%#&";
    const headings = qsa(".decode");

    headings.forEach((node) => {
      const finalText = node.dataset.decode || node.textContent.trim();
      node.textContent = finalText;
      node.dataset.done = "false";
    });

    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const decode = (node) => {
      if (node.dataset.done === "true") return;
      node.dataset.done = "true";

      const finalText = node.dataset.decode || node.textContent.trim();
      let iteration = 0;

      const interval = setInterval(() => {
        node.textContent = finalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return finalText[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= finalText.length) {
          clearInterval(interval);
          node.textContent = finalText;
        }

        iteration += 1 / 2;
      }, 28);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) decode(entry.target);
      });
    }, { threshold: 0.7 });

    headings.forEach((node) => observer.observe(node));
  }

  function initTiltCards() {
    if (!supportsHover || reducedMotion) return;

    qsa(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -7;
        const ry = ((x / rect.width) - 0.5) * 7;
        card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }

  function initMagnetic() {
    if (!supportsHover || reducedMotion) return;

    qsa(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = (x - rect.width / 2) * 0.13;
        const dy = (y - rect.height / 2) * 0.13;
        element.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
        element.style.setProperty("--my", `${(y / rect.height) * 100}%`);
        element.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
        element.style.removeProperty("--mx");
        element.style.removeProperty("--my");
      });
    });
  }

  function initModal() {
    const modal = qs("#previewModal");
    const close = qs("[data-modal-close]");

    close?.addEventListener("click", closePreview);
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) closePreview();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePreview();
    });
  }

  function initButtonReflection() {
    qsa(".btn").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        button.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  function boot() {
    qs("#year").textContent = new Date().getFullYear();
    setOrderLinks();
    renderPortfolio();
    initLenis();
    initHeader();
    initReveal();
    initDecode();
    initTiltCards();
    initMagnetic();
    initModal();
    initButtonReflection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
