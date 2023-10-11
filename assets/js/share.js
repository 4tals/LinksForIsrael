(() => {
  const iconShare = '<i class="fas fa-link"></i>';
  const iconWhatsApp = '<i class="fab fa-whatsapp"></i>';
  const iconTelegram = '<i class="fab fa-telegram-plane"></i>';

  // Get all sections and add the share button
  const sections = document.querySelectorAll("details");
  sections.forEach((section, index) => {
    const h2Element = section.querySelector("h2");

    // Create share button
    const shareBtn = document.createElement("span");
    shareBtn.classList.add("share-btn");
    shareBtn.setAttribute("data-index", h2Element.parentElement.parentElement.id);
    shareBtn.innerHTML = iconShare;
    h2Element.appendChild(shareBtn);

    // Create WhatsApp button
    const whatsappBtn = document.createElement("span");
    whatsappBtn.classList.add("whatsapp-btn");
    whatsappBtn.setAttribute("data-index", h2Element.parentElement.parentElement.id);
    whatsappBtn.innerHTML = iconWhatsApp;
    h2Element.appendChild(whatsappBtn);

    // Create Telegram button
    const telegramBtn = document.createElement("span");
    telegramBtn.classList.add("telegram-btn");
    telegramBtn.setAttribute("data-index", h2Element.parentElement.parentElement.id);
    telegramBtn.innerHTML = iconTelegram;
    h2Element.appendChild(telegramBtn);
  });

  // Open section if user opens the webpage with #specificSectionTag
  if (location.hash) {
    const sectionToOpen = document.querySelector(location.hash);
    if (sectionToOpen && sectionToOpen.tagName === "DETAILS") {
      sectionToOpen.setAttribute("open", "");
    }
  }

  const whatsappBtns = document.querySelectorAll(".whatsapp-btn");
  const telegramBtns = document.querySelectorAll(".telegram-btn");

  // Get all share buttons
  const shareBtns = document.querySelectorAll(".share-btn");
  // Get site url
  const siteUrl = new URL(window.location.href);

  // Add event listener to all share buttons
  shareBtns.forEach((shareBtn) => {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Get the button directly using the 'currentTarget' property of the event
      const btn = e.currentTarget;

      const index = btn.getAttribute("data-index");
      const sectionUrl = `${siteUrl.origin}#${index}`;

      // Copy section url to clipboard
      navigator.clipboard.writeText(sectionUrl);

      // Show "copied" text instead of share icon
      btn.innerHTML = "Copied";

      // Return to share icon after 2 seconds
      setTimeout(() => {
        btn.innerHTML = iconShare;
      }, 2000);
    });
  });

  // check if shared url contains a section id and bring it into view
  const url = new URL(window.location.href);
  const sectionId = url.hash;
  if (sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Add event listener for WhatsApp buttons
  whatsappBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = btn.getAttribute("data-index");
      const sectionUrl = `${siteUrl.origin}#${index}`;
      window.open(`https://api.whatsapp.com/send?text=${sectionUrl}`);
    });
  });

  // Add event listener for Telegram buttons
  telegramBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = btn.getAttribute("data-index");
      const sectionUrl = `${siteUrl.origin}#${index}`;
      window.open(`https://t.me/share/url?url=${sectionUrl}`);
    });
  });

})();
