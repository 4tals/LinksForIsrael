function displaySearchResults(results, links) {

    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = links[results[i].ref];
        appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
}

function search(searchTerm) {
    if (searchTerm) {
    
        var idx = lunr(function () {

            this.use(lunr.multiLanguage('en', 'he'));

            this.field('displayName');
            this.field('description');
            this.field('subCategories');

            window.israelLinks.forEach((category)=>{ // Add the data to lunr

                const CategoryEntry = {
                    id: category.name,
                    name: category.name,
                    displayName: category.displayName,
                    description: category.description,
                    subCategories: category.subCategories,
                }

                this.add(CategoryEntry);
                
                category.subCategories.forEach((subCategory)=>{
                    const subCategoryEntry =  {
                        id: subCategory.name,
                        displayName: subCategory.displayName,
                    }

                    this.add(subCategoryEntry);
    
                    subCategoryEntry.links = subCategory.links.forEach((link)=> {
                        const linkEntry = {
                            id: link.name,
                            displayName: link.displayName,
                            shortDescription: link.shortDescription,
                            description: link.description
                        }

                        this.add(linkEntry);
                    })
                })
            })
        });

        var results = idx.search(searchTerm);
        displaySearchResults(results, window.israelLinks);
    }

}

 

document.addEventListener("DOMContentLoaded", function() {

    const mobileSearchButton = document.getElementById("mobileSearchButton");
    const overlayElement = document.getElementById('searchOverlay');

    mobileSearchButton.addEventListener("click", function() {
        overlayElement.classList.add("active");
    });
    
    overlayElement.addEventListener("click", function() {
        overlayElement.classList.remove("active");
    });
    
})