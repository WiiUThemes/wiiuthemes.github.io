document.addEventListener('DOMContentLoaded', () => {
    const themeGrid = document.getElementById('theme-grid');

    function fetchThemeData(themeId) {
        return fetch(`themes/${themeId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            });
    }

    function fetchCreatorsData() {
        return fetch('creators.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            });
    }

    function displayThemeData(themeElement, themeData, creators) {
        const downloadLinksHtml = themeData.downloadLinks.map(link => `
            <a href="${link.url}" target="_blank" class="download-link">Download</a>
        `).join('');

        const creatorsList = themeData.createdBy.map(creatorId => {
            const creator = creators.find(c => c.id === creatorId);
            return creator ? `<img src="${creator.avatarUrl}" title="${creator.displayName}" alt="${creator.displayName}">` : '';
        }).join('');

        themeElement.innerHTML = `
            <img src="${themeData.image}" alt="${themeData.name}">
            <h2>${themeData.name}</h2>
            <div class="download-links">${downloadLinksHtml}</div>
            <div class="creator-avatars">${creatorsList}</div>
        `;

        themeGrid.appendChild(themeElement);
    }

    function loadThemes(creators) {
        fetch('themes/index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(themeIndex => {
                themeIndex.forEach(themeId => {
                    const themeElement = document.createElement('div');
                    themeElement.className = 'theme';
                    themeElement.setAttribute('data-theme', themeId);

                    fetchThemeData(themeId)
                        .then(themeData => {
                            displayThemeData(themeElement, themeData, creators);
                        })
                        .catch(error => {
                            console.error(`Error fetching data for theme ${themeId}:`, error);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching theme index:', error);
            });
    }

    fetchCreatorsData()
        .then(data => {
            window.creators = data.creators || [];
            loadThemes(window.creators);
        })
        .catch(error => {
            console.error('Error fetching creators:', error);
        });
});
