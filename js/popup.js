function save() {
    var select = document.getElementById('lang');
    var lang = select.children[select.selectedIndex].value;
    var items = {'lang': lang};
    chrome.storage.sync.set(items);
}

// Restores select box state to saved value from localStorage.
function restore() {
    chrome.storage.sync.get('lang', (items) => {
        var lang = items['lang'] || null;
        var select = document.getElementById('lang');
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.value == lang) {
                child.selected = 'true';
                break;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restore();
    document.getElementById('lang').addEventListener('change', () => {
        save();
    });
});
