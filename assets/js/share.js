const ICONS = {
  share: '<i class="fas fa-link"></i>',
  whatsapp: '<i class="fab fa-whatsapp"></i>',
  telegram: '<i class="fab fa-telegram-plane"></i>',
  shareMobile: '<i class="fa-thin fa-share-alt"></i>',
};

function handleDetailsToggle(event) {
  const sections = document.querySelectorAll("details");
  const clickedSection = event.target.closest("details");

  if (!clickedSection.hasAttribute("open")) {
    history.pushState({}, "", `#${clickedSection.id}`);
  } else {
    history.pushState({}, "", "#");
  }

  sections.forEach((section) => {
    if (section !== clickedSection) {
      // Don't close the one being toggled by the user.
      section.removeAttribute("open");
    }
  });
}

function bindDetailsToggleEvent() {
  const sectionsSummaries = document.querySelectorAll("details summary");
  sectionsSummaries.forEach((section) => {
    section.addEventListener("click", handleDetailsToggle);
  });
}

function appendButton(element, id, iconClass, iconHTML) {
  const btn = document.createElement("span");
  btn.classList.add(iconClass);
  btn.setAttribute("data-index", id);
  btn.innerHTML = iconHTML;
  element.appendChild(btn);
}

function initializeShareButtons() {
  const sections = document.querySelectorAll("details");
  sections.forEach(async (section) => {
    const shareContainer = document.createElement("div");
    const category = section.querySelector("h2").innerText;
    shareContainer.classList.add("share-container");
    const text = document.createElement("span");
    text.textContent = `ניתן לשתף ישירות את הקטגוריה ${category} באמצעות`;
    shareContainer.appendChild(text);

    const siteUrl = new URL(window.location.href);

    if (navigator.share) {
      // add share button for mobile - only if supported
      const shareData = {
        title: "לינק לישראל - כל אתרי הסיוע למלחמה במקום אחד 🇮🇱",
        text: category,
        url: `${siteUrl.origin}#${section.id}`,
      };

      const btn = document.createElement("span");
      btn.classList.add("share-btn");
      btn.innerHTML = ICONS.shareMobile;
      shareContainer.appendChild(btn);
      btn.addEventListener("click", async () => {
        try {
          await navigator.share(shareData);
          resultPara.textContent = "MDN shared successfully";
        } catch (err) {
          resultPara.textContent = `Error: ${err}`;
        }
      });
    } else {
      appendButton(shareContainer, section.id, "share-btn", ICONS.share);
      appendButton(shareContainer, section.id, "whatsapp-btn", ICONS.whatsapp);
      appendButton(shareContainer, section.id, "telegram-btn", ICONS.telegram);
    }

    const summaryElement = section.querySelector(".links-section-content");
    summaryElement.prepend(shareContainer);
  });
}

function openSectionFromHash() {
  if (location.hash) {
    const sectionToOpen = document.querySelector(location.hash);
    if (sectionToOpen && sectionToOpen.tagName === "DETAILS") {
      sectionToOpen.setAttribute("open", "");
    }
  }
}

function addShareButtonListeners() {
  const shareBtns = document.querySelectorAll(".share-btn");
  const siteUrl = new URL(window.location.href);

  shareBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sectionUrl = `${siteUrl.origin}#${btn.getAttribute("data-index")}`;

      navigator.clipboard.writeText(sectionUrl);
      btn.innerHTML = "Copied";

      setTimeout(() => {
        btn.innerHTML = ICONS.share;
      }, 2000);
    });
  });
}

function addExternalShareListeners(externalService) {
  const btns = document.querySelectorAll(`.${externalService}-btn`);
  const siteUrl = new URL(window.location.href);

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sectionUrl = encodeURIComponent(`${siteUrl.origin}#${btn.getAttribute("data-index")}`);
      const shareUrls = {
        whatsapp: `https://api.whatsapp.com/send?text=${sectionUrl}`,
        telegram: `https://t.me/share/url?url=${sectionUrl}`,
      };

      window.open(shareUrls[externalService]);
    });
  });
}

function scrollToSectionInView() {
  const url = new URL(window.location.href);
  const sectionId = url.hash;
  if (sectionId) {
    const sections = document.querySelectorAll("details");
    const clickedSection = document.querySelector(sectionId);

    sections.forEach((section) => {
      if (section !== clickedSection) {
        // Don't close the one being toggled by the user.
        section.removeAttribute("open");
      }
    });

    if (clickedSection) {
      clickedSection.scrollIntoView({ behavior: "smooth" });
      clickedSection.setAttribute("open", "");
    }
  } else {
    const sections = document.querySelectorAll("details");

    sections.forEach((section) => {
      section.removeAttribute("open");
    });
  }
}

window.addEventListener(
  "load",
  () => {
    console.log("DOM fully loaded and parsed");
    initializeShareButtons();
    openSectionFromHash();
    addShareButtonListeners();
    addExternalShareListeners("whatsapp");
    addExternalShareListeners("telegram");
    scrollToSectionInView();
    bindDetailsToggleEvent(); // Call the new function.

    window.addEventListener("hashchange", scrollToSectionInView);
  },
  false
);
