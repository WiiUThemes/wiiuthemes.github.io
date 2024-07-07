document.addEventListener('DOMContentLoaded', () => {
    const themes = document.querySelectorAll('.theme');
    
    themes.forEach(theme => {
        const themeId = theme.getAttribute('data-theme');
        fetch(`themes/${themeId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(themeData => {
                displayThemeData(theme, themeData);
            })
            .catch(error => {
                console.error(`Error fetching data for theme ${themeId}:`, error);
                // Optionally handle error display or fallback content
            });
    });

    fetch('creators.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Creators data:', data); // Log creators data to check if fetched correctly
            window.creators = data.creators || []; // Store creators globally for use in displayThemeData
        })
        .catch(error => console.error('Error fetching creators:', error));
});

function displayThemeData(themeElement, themeData) {
    console.log('Theme data:', themeData); // Log theme data to check if received correctly

    const downloadLinksHtml = themeData.downloadLinks.map(link => `
        <a href="${link.url}" target="_blank" class="download-link">Download</a>
    `).join('');

    themeElement.querySelector('.download-links').innerHTML = downloadLinksHtml;

    // Display creators if available
    if (themeData.createdBy && themeData.createdBy.length > 0) {
        const creatorsList = themeData.createdBy.map(creatorId => {
            const creator = window.creators.find(c => c.id === creatorId);
            return creator ? creator.displayName : '';
        }).join(', ');

        const creatorElement = themeElement.querySelector('.theme-creator');
        if (creatorElement) {
            creatorElement.textContent = `Created by: ${creatorsList}`;
        }
    }
}
