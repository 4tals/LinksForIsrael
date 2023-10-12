document.addEventListener("DOMContentLoaded", function() {
    // Select all the collapsible components on your page
    const collapsibles = document.querySelectorAll(".links-section");
  
    // Add a click event listener to each collapsible component
    collapsibles.forEach(collapsible => {
    //   const button = collapsible.querySelector(".collapsible-button");
  
    collapsible.addEventListener("click", function() {
        // Check if the collapsible component is being opened
        const isOpen = collapsible.classList.contains("open");
  
        // Track the event using Mixpanel
        mixpanel.track(`${collapsible.id} Opened`, {
          component_id: collapsible.id, // You can also use other identifiers
          is_open: !isOpen, // True if opened, false if closed
        });
      });
    });
  });
  