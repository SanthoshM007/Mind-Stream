const searchForm = document.getElementById("search-form"); 
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Theme toggler elements
const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

async function searchYouTube(query) {
  const API_KEY = "AIzaSyApwTHC7dSeNotJymLkaUPb6cLAKNKACKY";
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${API_KEY}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Failed to fetch search results from YouTube API.");
  }

  const json = await response.json();
  return json.items;
}

function displayResults(results) {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = "";

  results.forEach((result) => {
    const videoId = result.id.videoId;
    const title = result.snippet.title;
    const thumbnail = result.snippet.thumbnails.medium.url;

    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
      <div class="thumbnail-container">
        <img src="${thumbnail}" alt="${title}" />
      </div>
      <h3 class="result-title">${title}</h3>
    `;

    resultItem.addEventListener('click', () => {
      const mainVideo = document.getElementById('main-video');
      const currentVideoSrc = mainVideo.src;

      // Store the current video in the history container
      if (currentVideoSrc) {
        const historyContainer = document.getElementById('video-history');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
          <iframe width="200" height="113" src="${currentVideoSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
        historyContainer.appendChild(historyItem);
      }

      // Update the main video with the selected video
      mainVideo.src = `https://www.youtube.com/embed/${videoId}`;
    });

    searchResults.appendChild(resultItem);
  });
}

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('search-input').value;
  const results = await searchYouTube(query);
  displayResults(results);
});

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('search-input').value;
  const results = await searchYouTube(query);
  displayResults(results);
});
document.addEventListener("DOMContentLoaded", () => {
  const contentTypesInput = prompt("Please enter the types of content you are interested in (separated by commas):");
  const contentTypes = contentTypesInput ? contentTypesInput.split(',').map(type => type.trim().toLowerCase()) : [];

  if (contentTypes.length > 0) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();

      const isDistracted = !contentTypes.some(type => query.includes(type));
      if (isDistracted) {
        alert("You are distracted! Please focus on the content types you are interested in.");
        searchResults.innerHTML = "";
        return;
      }

      searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

      try {
        const results = await searchYouTube(query);

        if (results.length === 0) {
          searchResults.innerHTML = "<p>No results found.</p>";
        } else {
          displayResults(results);
        }
      } catch (error) {
        console.error(error);
        searchResults.innerHTML = "<p>An error occurred while searching. Please try again later.</p>";
      }
    });
  } else {
    alert("You must enter at least one content type to proceed.");
  }

  // Event listener for the theme toggler
  themeToggler.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
      themeToggler.textContent = "Light";
      themeToggler.style.background = "#fff";
      themeToggler.style.color = "#333";
    } else {
      themeToggler.textContent = "Dark";
      themeToggler.style.border = "2px solid #ccc";
      themeToggler.style.color = "#333";
    }
  });
});
