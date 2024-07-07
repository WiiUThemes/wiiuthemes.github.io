document.addEventListener('DOMContentLoaded', () => {
    fetchThemes();
    fetchCreators();
});

function fetchThemes() {
    fetch('themes.json') // Adjust the path as per your file structure
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(themesData => {
            console.log('Themes data:', themesData);
            displayThemes(themesData.themes);
        })
        .catch(error => console.error('Error fetching themes:', error));
}

function fetchCreators() {
    fetch('creators.json') // Adjust the path as per your file structure
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(creatorsData => {
            console.log('Creators data:', creatorsData);
            window.creators = creatorsData.creators || [];
            displayThemes(window.themes); // Display themes again after loading creators
        })
        .catch(error => console.error('Error fetching creators:', error));
}

function displayThemes(themes) {
    const themesContainer = document.querySelector('.theme-grid');
    themesContainer.innerHTML = ''; // Clear existing themes

    themes.forEach(theme => {
        const creatorsList = theme.createdBy.map(creatorId => {
            const creator = window.creators.find(c => c.id === creatorId);
            return creator ? creator.displayName : '';
        }).join(', ');

        const themeElement = document.createElement('div');
        themeElement.classList.add('theme');

        themeElement.innerHTML = `
            <img src="${theme.image}" alt="${theme.name}">
            <h2>${theme.name}</h2>
            <div class="download-links">
                <a href="${theme.downloadLinks[0].url}" target="_blank" class="download-link">${theme.downloadLinks[0].label}</a>
            </div>
            <p class="theme-creator">Created by: ${creatorsList}</p>
        `;

        themesContainer.appendChild(themeElement);
    });
}
