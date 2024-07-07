document.addEventListener('DOMContentLoaded', () => {
    fetch('creators.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Creators data:', data); // Log creators data to check if fetched correctly
            window.creators = data.creators || []; // Store creators globally for use in displayTheme
            fetchThemes();
        })
        .catch(error => {
            console.error('Error fetching creators:', error);
        });
});

function fetchThemes() {
    fetch('themes/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(themeIds => {
            themeIds.forEach(themeId => {
                fetch(`themes/${themeId}.json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(themeData => {
                        displayTheme(themeData);
                    })
                    .catch(error => {
                        console.error(`Error fetching theme ${themeId}:`, error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching theme index:', error);
        });
}

function displayTheme(themeData) {
    const themeGrid = document.querySelector('theme-grid');

    const creatorsList = themeData.createdBy.map(creatorId => {
        const creator = window.creators.find(c => c.id === creatorId);
        return creator ? creator.displayName : '';
    }).join(', ');

    const themeElement = document.createElement('div');
    themeElement.classList.add('theme');
    themeElement.setAttribute('data-theme', themeData.id);

    themeElement.innerHTML = `
        <img src="${themeData.image}" alt="${themeData.name}">
        <h2>${themeData.name}</h2>
        <div class="download-links">
            <a href="${themeData.downloadLinks[0].url}" target="_blank" class="download-link">Download</a>
        </div>
        <p class="theme-creator">Created by: ${creatorsList}</p>
    `;

    themeGrid.appendChild(themeElement);
}
