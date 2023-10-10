(() => {
  const iconShare = '<i class="fas fa-link"></i>';

  // Get all sections and add the share button
  const sections = document.querySelectorAll("details");
  sections.forEach((section, index) => {
    const h2Element = section.querySelector("h2");
    const shareBtn = document.createElement("span");
    shareBtn.classList.add("share-btn");
    shareBtn.setAttribute("data-index", h2Element.parentElement.parentElement.id);
    shareBtn.innerHTML = iconShare; 
    h2Element.appendChild(shareBtn);
  });

  // Open section if user opens the webpage with #specificSectionTag
  if (location.hash) {
    const sectionToOpen = document.querySelector(location.hash);
    if (sectionToOpen && sectionToOpen.tagName === 'DETAILS') {
      sectionToOpen.setAttribute('open', '');
    }
  }

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
})();
