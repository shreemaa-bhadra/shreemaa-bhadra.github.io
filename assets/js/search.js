(function () {
  "use strict";

  let searchData = null;
  let searchIndex = [];

  const searchInput = document.getElementById("search-input");
  const searchSection = document.querySelector(".search-section");
  const searchResultsContainer = document.getElementById(
    "search-results-container",
  );
  const searchResults = document.getElementById("search-results");
  const searchResultsCount = document.getElementById("search-results-count");
  const searchClearBtn = document.getElementById("search-clear");
  const allPosts = document.getElementById("all-posts");
  const latestPostsHeading = document.getElementById("latest-posts-heading");

  if (!searchInput || !searchResults) return;

  // Load search data
  function loadSearchData() {
    fetch("/search.json")
      .then((response) => response.json())
      .then((data) => {
        searchData = data.posts;
        // Build search index
        searchIndex = searchData.map((post) => ({
          ...post,
          searchText: (
            (post.title || "") +
            " " +
            (post.content || "") +
            " " +
            (post.categories || []).join(" ") +
            " " +
            (post.tags || [])
          ).toLowerCase(),
        }));
      })
      .catch((error) => console.error("Error loading search data:", error));
  }

  // Perform search
  function performSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery || normalizedQuery.length < 2) {
      showAllPosts();
      return;
    }

    const queryTerms = normalizedQuery.split(/\s+/);

    const results = searchIndex.filter((post) => {
      return queryTerms.every((term) => post.searchText.includes(term));
    });

    displayResults(results, query);
  }

  // Show all posts (clear search)
  function showAllPosts() {
    searchResultsContainer.style.display = "none";
    if (allPosts) allPosts.style.display = "grid";
    if (latestPostsHeading) latestPostsHeading.style.display = "block";
    searchClearBtn.style.display = "none";
    if (searchSection) searchSection.classList.remove("has-search");
  }

  // Display search results using the same card layout as posts
  function displayResults(results, query) {
    searchClearBtn.style.display = "block";
    if (searchSection) searchSection.classList.add("has-search");

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-no-results-card"><p>No recipes found matching "' +
        escapeHtml(query) +
        '"</p><button onclick="clearSearch()" class="search-clear-link">Clear search</button></div>';
      searchResultsCount.textContent = "(0)";
      searchResultsContainer.style.display = "block";
      if (allPosts) allPosts.style.display = "none";
      if (latestPostsHeading) latestPostsHeading.style.display = "none";
      return;
    }

    searchResultsCount.textContent = "(" + results.length + ")";

    const html = results
      .map(
        (post) => `
      <article class="post-preview search-result-card">
        ${
          post.image
            ? `
        <div class="post-preview__thumb">
          <a href="${post.url}" class="post-preview__image-link">
            <img src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy" decoding="async" width="800" height="534" />
          </a>
        </div>
        `
            : ""
        }
        <div class="post-preview__body">
          <a class="post-preview__card" href="${post.url}">
            <time class="post-meta">${post.date || ""}</time>
            <h3 class="post-preview__title">${highlightText(post.title, query)}</h3>
          </a>
          ${post.summary ? `<p class="post-preview__summary">${post.summary}</p>` : ""}
          ${
            post.categories && post.categories.length
              ? `
            <div class="post-preview__categories">
              ${post.categories.map((cat) => `<span class="category-tag">${escapeHtml(cat)}</span>`).join("")}
            </div>
          `
              : ""
          }
        </div>
      </article>
    `,
      )
      .join("");

    searchResults.innerHTML = html;
    searchResultsContainer.style.display = "block";
    if (allPosts) allPosts.style.display = "none";
    if (latestPostsHeading) latestPostsHeading.style.display = "none";
  }

  // Highlight matching text
  function highlightText(text, query) {
    if (!text) return "";
    const terms = query.toLowerCase().trim().split(/\s+/);
    let highlighted = escapeHtml(text);
    terms.forEach((term) => {
      const regex = new RegExp("(" + escapeRegex(term) + ")", "gi");
      highlighted = highlighted.replace(regex, "<mark>$1</mark>");
    });
    return highlighted;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Clear search function (global for the button)
  window.clearSearch = function () {
    searchInput.value = "";
    showAllPosts();
    searchInput.focus();
  };

  // Event listeners
  let debounceTimer;
  searchInput.addEventListener("input", function (e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(e.target.value);
    }, 200);
  });

  // Clear button
  searchClearBtn.addEventListener("click", window.clearSearch);

  // Keyboard shortcuts
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      window.clearSearch();
    }
  });

  // Initialize
  loadSearchData();
  showAllPosts();
})();
