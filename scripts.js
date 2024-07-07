document.addEventListener('DOMContentLoaded', () => {
    fetch('creators.json')
        .then(response => response.json())
        .then(creatorsData => {
            window.creators = creatorsData.creators || [];
            loadThemes();
        })
        .catch(error => console.error('Error fetching creators:', error));
});

function loadThemes() {
    const themeGrid = document.getElementById('theme-grid');
    const themeIds = ['1', '2']; // Add more theme IDs as necessary

    themeIds.forEach(themeId => {
        fetch(`themes/${themeId}.json`)
            .then(response => response.json())
            .then(themeData => {
                const themeElement = createThemeElement(themeData);
                themeGrid.appendChild(themeElement);
            })
            .catch(error => console.error(`Error fetching data for theme ${themeId}:`, error));
    });
}

function createThemeElement(themeData) {
    const themeElement = document.createElement('div');
    themeElement.classList.add('theme');
    
    const creatorsList = themeData.createdBy.map(creatorId => {
        const creator = window.creators.find(c => c.id === creatorId);
        return creator ? creator.displayName : '';
    }).join(', ');

    themeElement.innerHTML = `
        <img src="${themeData.image}" alt="${themeData.name}">
        <h2>${themeData.name}</h2>
        <div class="download-links">
            <a href="${themeData.downloadLinks[0].url}" target="_blank" class="download-link">${themeData.downloadLinks[0].label}</a>
        </div>
        <p class="theme-creator">Created by: ${creatorsList}</p>
    `;

    return themeElement;
}
