document.addEventListener("DOMContentLoaded", function() {

    if (window.location.hostname === 'localhost') {
      return
    } 
      
    // Select all the collapsible components on your page
    const collapsibles = document.querySelectorAll(".links-section");

    const links = document.querySelectorAll("a");
  
    // Add a click event listener to each collapsible component
    collapsibles.forEach(collapsible => {
  
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

    // Add a click event listener to each link component
    links.forEach(link => {
    
      link.addEventListener("click", function() {
    
          // Track the event using Mixpanel
          mixpanel.track(`${link.id} link clicked`, {
            component_id: link.id, // You can also use other identifiers
          });
        });
      });
  });
  