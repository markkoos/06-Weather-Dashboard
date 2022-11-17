var searchForm = document.getElementById(`search-form`);
var searchHistory = [];


function addtoHistory(event) {
    event.preventDefault();

    var searchInput = document.getElementById(`search-input`).value; 

    if (!searchInput) {
        window.prompt(`No search text found/entered!`);
        return;
    }

    var 
}