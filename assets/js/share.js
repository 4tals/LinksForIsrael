(() => {
  //get all section add the share button
  const sections = document.querySelectorAll("details");
  sections.forEach((section, index) => {
    const h2Element = section.querySelector("h2");
    const shareBtn = document.createElement("span");
    shareBtn.classList.add("share-btn");
    shareBtn.setAttribute("data-index", index + 1);
    shareBtn.innerHTML = 'Copy and Share <i class="fas fa-share"></i>';
    h2Element.appendChild(shareBtn);
  });

  //get all share button
  const shareBtns = document.querySelectorAll(".share-btn");
  //get site url
  const siteUrl = window.location.href;
  // add event listener to all share button
  shareBtns.forEach((shareBtn) => {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = e.target.getAttribute("data-index");
      const sectionUrl = `${siteUrl}#section${index}`;
      //copy section url to clipboard
      navigator.clipboard.writeText(sectionUrl);
      //show copy text next to share button
      const copyText = document.createElement("span");
      copyText.classList.add("copy-text");
      e.target.innerHTML = "Copied";
      shareBtn.appendChild(copyText);
      //remove copy text after 2 seconds
      setTimeout(() => {
        e.target.innerHTML = 'Copy and Share <i class="fas fa-share"></i>';
      }, 2000);
    });
  });
})();
