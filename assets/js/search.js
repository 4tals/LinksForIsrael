

function displaySearchResults(results, links) {

    var searchResults = document.getElementById('search-results');
    var searchResultsDiv = document.getElementById('searchResultsDiv');

    if (results.length) { // Are there any results?

        searchResultsDiv.classList.add("active");
        var appendString = '';

        for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = links[results[i].ref];
            appendString += '<li><a href="' + item.url + '"><h3>' + item.displayName + '</h3></a>';
            
            const description = item.shortDescription || item.description
            
            if (description.length > 150) {
                appendString += '<p>' + description.substring(0, 150) + '...</p></li>';
            }
            else {
                appendString += '<p>' + description + '</p></li>';
            }
            
        }

        searchResults.innerHTML = appendString;
    } else {
        searchResults.innerHTML = '<li>No results found</li>';
        searchResultsDiv.classList.remove("active");
    }
}

function prepareIndex() {

    let linksOnly = {}
    var idx = lunr(function () {

        this.use(lunr.multiLanguage('en', 'he'));

        this.field('displayName');
        this.field('description');
        this.field('shortDescription');

        window.israelLinks.forEach((category)=>{ // Add the data to lunr

            const CategoryEntry = {
                id: category.name,
                name: category.name,
                displayName: category.displayName,
                description: category.description,
                subCategories: category.subCategories,
            }

            // this.add(CategoryEntry);
            
            category.subCategories.forEach((subCategory)=>{
                const subCategoryEntry =  {
                    id: subCategory.name,
                    displayName: subCategory.displayName,
                }

                // this.add(subCategoryEntry);

                subCategoryEntry.links = subCategory.links.forEach((link)=> {
                    const linkEntry = {
                        id: link.name,
                        displayName: link.displayName,
                        shortDescription: link.shortDescription,
                        description: link.description
                    }

                    linksOnly[link.name] = link

                    // this.add(linkEntry);
                })

                // linksOnly = [...linksOnly, ...subCategory.links]
            })
        })

        Object.values(linksOnly).forEach((link)=> {
            const linkEntry = {
                id: link.name,
                displayName: link.displayName,
                shortDescription: link.shortDescription,
                description: link.description
            }
    
            this.add(linkEntry);
        })
    });

    window.linksOnly = linksOnly;
    window.idx = idx;

}

function search(searchTerm) {
    if (searchTerm) {
        var results = window.idx.search(`${searchTerm}*`);
        console.log("result")
        displaySearchResults(results, window.linksOnly);
    }

}

 

document.addEventListener("DOMContentLoaded", function() {

    prepareIndex();
    const mobileSearchButton = document.getElementById("mobileSearchButton");
    const overlayElement = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');

    mobileSearchButton.addEventListener("click", function() {
        overlayElement.classList.add("active");
    });

    searchInput.addEventListener("input", function(event) {
        const searchTerm = event.target.value;
        search(searchTerm)
    });
    
    // overlayElement.addEventListener("click", function() {
    //     overlayElement.classList.remove("active");
    // });
    
})