

function clearResultsList() {
    var searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
}


function searchResultClicked(aElement) {
    const overlayElement = document.getElementById('searchOverlay');
    const overlayElementWeb = document.getElementById('searchOverlayWeb');
    const searchInputWeb = document.getElementById('searchInputWeb');
    const searchInput = document.getElementById('searchInput');

    const linkId = aElement.id;
    const targetElement = document.getElementById(linkId);

    overlayElement.classList.remove("active");
    overlayElementWeb.classList.remove("active");
    searchInputWeb.value = '';
    searchInput.value = '';

    window.location.hash = `#${linkId}`;
    // const detailsElement = targetElement.parentElement.parentElement.parentElement.parentElement.parentElement
    
    // const xpathExpression = `//p[@id='${linkId}']/ancestor::details[0]`;
    // const result = document.evaluate(xpathExpression, document, null, XPathResult.ANY_TYPE, null);
    // const detailsElement = result.iterateNext();
    // detailsElement.setAttribute('open', true);
    setTimeout(()=>window.scrollBy(0, -280), 0);
}

function displaySearchResults(results, links) {

    var searchResults = document.getElementById('search-results');
    var searchResultsWeb = document.getElementById('search-results-web');
    var searchResultsDiv = document.getElementById('searchResultsDiv');

    if (results.length) { // Are there any results?

        searchResultsDiv.classList.add("active");
        var appendString = '';

        for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = links[results[i].ref];

            let title = item.displayName || item.shortDescription

            appendString += '<li><div class="searchResultItem"><span class="searchResultTitle">' + title + '</span>';

            const siteUrl = new URL(window.location.href);
            const permalink = `${siteUrl.origin}#${item.name}`

            appendString += `<div class="searchResultLinks"><a href="${item.url}">קח אותי ליוזמה</a> / <a onclick="searchResultClicked(${item.name})">עוד מידע</a></div></div></li>`;
            
        }

        searchResults.innerHTML = appendString;
        searchResultsWeb.innerHTML = appendString;
    } else {
        searchResults.innerHTML = '<li>No results found</li>';
        searchResultsWeb.innerHTML = '<li>No results found</li>';
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
    else {
        clearResultsList()
    }
}

 

document.addEventListener("DOMContentLoaded", function() {

    prepareIndex();
    const mobileSearchButton = document.getElementById("mobileSearchButton");
    const overlayElement = document.getElementById('searchOverlay');
    const overlayElementWeb = document.getElementById('searchOverlayWeb');
    const searchInput = document.getElementById('searchInput');
    const searchInputWeb = document.getElementById('searchInputWeb');
    const searchDiv = document.getElementById('searchDiv');
    var searchResultsDiv = document.getElementById('searchResultsDiv');

    mobileSearchButton.addEventListener("click", function() {
        overlayElement.classList.add("active");
    });

    searchInputWeb.addEventListener("input", function(event) {
        
        const searchTerm = event.target.value;

        if (searchTerm) {
            overlayElementWeb.classList.add("active");
        }
        else {
            overlayElementWeb.classList.remove("active");
        }
        search(searchTerm)
    });
    
    searchInput.addEventListener("input", function(event) {
        const searchTerm = event.target.value;
        search(searchTerm)
    });

    searchInput.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();
    });
    
    searchDiv.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();
    });

    // searchResultsDiv.addEventListener("click", function(event) {

    //     event.preventDefault();
    //     event.stopPropagation();
    // });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            overlayElement.classList.remove("active");
            overlayElementWeb.classList.remove("active");
            const searchInputWeb = document.getElementById('searchInputWeb');
            const searchInput = document.getElementById('searchInput');
            searchInputWeb.value = '';
            searchInput.value = '';
        }
    });
    
    overlayElement.addEventListener("click", function() {
        overlayElement.classList.remove("active");
    });
    
})