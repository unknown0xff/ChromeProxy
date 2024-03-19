document.addEventListener('DOMContentLoaded', () => {
    const proxyForm = document.getElementById('proxy-form');
    const proxyList = document.getElementById('proxy-list');

    // Load saved proxy settings
    chrome.storage.sync.get(null, (proxySettings) => {
        for (const [host, proxy] of Object.entries(proxySettings)) {
            addProxyToList(host, proxy);
        }
    });

    proxyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const host = document.getElementById('host').value;
        const proxy = document.getElementById('proxy').value;

        // Save proxy setting
        chrome.storage.sync.set({ [host]: proxy }, () => {
            addProxyToList(host, proxy);
            proxyForm.reset();
        });
    });

    function addProxyToList(host, proxy) {
        const listItem = document.createElement('li');
        listItem.innerText = `${host} -> ${proxy}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            chrome.storage.sync.remove(host, () => {
                listItem.remove();
            });
        });

        listItem.appendChild(deleteButton);
        proxyList.appendChild(listItem);
    }
});