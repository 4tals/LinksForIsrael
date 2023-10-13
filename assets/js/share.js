const ICONS = {
  share: '<i class="fas fa-link"></i>',
  whatsapp: '<i class="fab fa-whatsapp"></i>',
  telegram: '<i class="fab fa-telegram-plane"></i>',
};


function handleDetailsToggle(event) {
  const sections = document.querySelectorAll('details');
  const clickedSection = event.target.closest('details');

  if (!clickedSection.hasAttribute('open')) {
    history.pushState({}, '', `#${clickedSection.id}`);
  } else {
    history.pushState({}, '', '#');
  }

  sections.forEach((section) => {
    if (section !== clickedSection) { // Don't close the one being toggled by the user.
      section.removeAttribute('open');
    }
  });
}

function bindDetailsToggleEvent() {
  const sectionsSummaries = document.querySelectorAll('details summary');
  sectionsSummaries.forEach((section) => {
    section.addEventListener('click', handleDetailsToggle);
  });
}


function appendButton(element, iconClass, iconHTML) {
  const btn = document.createElement("span");
  btn.classList.add(iconClass);
  btn.setAttribute("data-index", element.parentElement.parentElement.id);
  btn.innerHTML = iconHTML;
  element.appendChild(btn);
}

function initializeShareButtons() {
  const sections = document.querySelectorAll("details");
  sections.forEach((section) => {
    const h2Element = section.querySelector("h2");

    appendButton(h2Element, "share-btn", ICONS.share);
    appendButton(h2Element, "whatsapp-btn", ICONS.whatsapp);
    appendButton(h2Element, "telegram-btn", ICONS.telegram);
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
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      section.setAttribute("open", "");
    }
  }
}

window.addEventListener(
  "DOMContentLoaded",
  () => {
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
