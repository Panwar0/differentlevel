let currentPage = 1;
let currentQuery = '';

async function searchVideos() {
    currentQuery = document.getElementById('searchInput').value;
    currentPage = 1;
    const response = await fetch(`/search?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`);
    const data = await response.json();
    displayVideos(data.videos);
}

function displayVideos(videos) {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '';
    
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="${video.thumbnail}" class="thumbnail" onclick="purify('${video.id}')">
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.channel}</p>
                <span>${video.duration}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

async function loadMore() {
    currentPage++;
    const response = await fetch(`/search?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`);
    const data = await response.json();
    addMoreVideos(data.videos);
}

function addMoreVideos(videos) {
    const container = document.getElementById('videoContainer');
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="${video.thumbnail}" class="thumbnail" onclick="purify('${video.id}')">
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.channel}</p>
                <span>${video.duration}</span>
            </div>
        `;
        container.appendChild(card);
    });
}
// Show loading state
function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

// Hide loading state
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Show error message
function showError() {
    document.getElementById('errorMessage').style.display = 'block';
}

// Update search function
async function searchVideos() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    showLoader();
    currentQuery = query;
    currentPage = 1;

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`);
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        displayVideos(data.videos);
        document.getElementById('loadMore').style.display = 'block';
    } catch (error) {
        showError();
        console.error('Search error:', error);
    } finally {
        hideLoader();
    }
}
