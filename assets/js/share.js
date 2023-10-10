(() => {
  // Get all sections and add the share button
  const sections = document.querySelectorAll("details");
  sections.forEach((section, index) => {
    const h2Element = section.querySelector("h2");
    const shareBtn = document.createElement("span");
    shareBtn.classList.add("share-btn");
    shareBtn.setAttribute("data-index", h2Element.parentElement.parentElement.id);
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>'; // Updated this line
    h2Element.appendChild(shareBtn);
  });

  // Get all share buttons
  const shareBtns = document.querySelectorAll(".share-btn");
  // Get site url
  const siteUrl = new URL(window.location.href);
  // Add event listener to all share buttons
  shareBtns.forEach((shareBtn) => {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = e.target.closest(".share-btn").getAttribute("data-index"); // Updated this line for event delegation
      const sectionUrl = `${siteUrl.origin}#${index}`;
      // Copy section url to clipboard
      navigator.clipboard.writeText(sectionUrl);
      // Show "copied" text instead of share icon
      e.target.closest(".share-btn").innerHTML = "Copied"; // Updated this line for event delegation
      // Return to share icon after 2 seconds
      setTimeout(() => {
        e.target.closest(".share-btn").innerHTML = '<i class="fas fa-share-alt"></i>'; // Updated this line for event delegation
      }, 2000);
    });
  });
})();
