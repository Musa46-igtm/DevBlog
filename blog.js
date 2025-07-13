import { 
  postsCollection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  startAfter
} from './firebase.js';

// DOM Elements
const blogCardGroup = document.querySelector('.blog-card-group');
const showMoreBtn = document.querySelector('.show-more');

// Pagination variables
let lastVisible = null;
const postsPerPage = 4;
let allPosts = [];

// Your original search pages data
const pages = [
  {
    title: "Home",
    summary: "Main page of Musa's blog",
    link: "index.html"
  },
  {
    title: "About Me",
    summary: "Learn more about Musa and his skills",
    link: "about.html"
  },
  {
    title: "Contact",
    summary: "Ways to get in touch with Musa",
    link: "contact.html"
  },
  {
    title: "Database",
    summary: "Articles about database management",
    link: "data.html"
  },
  {
    title: "Accessibility",
    summary: "Posts about web accessibility (a11y)",
    link: "access.html"
  },
  {
    title: "Flutter Sdk",
    summary: "Learn Flutter",
    link: "flutter.html"
  },
  {
    title: "React Js",
    summary: "Learn React",
    link: "react.html"
  },
  {
    title: "AI & ML",
    summary: "Learn Ai Machinery",
    link: "Ai.html"
  },
  {
    title: "Cyber Security",
    summary: "Learn Cyber Security",
    link: "cyber.html"
  },
  {
    title: "Web Performance",
    summary: "Articles about optimizing web performance",
    link: "web.html"
  },
  {
    title: "Android Development",
    summary: "Posts about Android app development",
    link: "android.html"
  },
  {
    title: "Privacy Policy",
    summary: "Privacy notice for the blog",
    link: "privacy.html"
  },
  {
    title: "Terms of Use",
    summary: "Terms and conditions for using the blog",
    link: "terms.html"
  },
];

// Initialize the blog
document.addEventListener('DOMContentLoaded', async () => {
  await loadInitialPosts();
  setupSearch(); // Initialize your original search functionality
});

// Load initial set of posts (unchanged from working version)
async function loadInitialPosts() {
  try {
    const firstPageQuery = query(
      postsCollection, 
      orderBy('date', 'desc'), 
      limit(postsPerPage)
    );
    
    const snapshot = await getDocs(firstPageQuery);
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPosts(allPosts);
    
    if (snapshot.docs.length < postsPerPage) {
      showMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    blogCardGroup.innerHTML = `
      <div class="error-message">
        <p>Sorry, we couldn't load the posts. Please try again later.</p>
      </div>
    `;
  }
}

// Render posts to the DOM (unchanged from working version)
function renderPosts(posts) {
  if (posts.length === 0) {
    blogCardGroup.innerHTML = `
      <div class="no-posts">
        <p>No posts yet. Be the first to create one!</p>
      </div>
    `;
    return;
  }

  const postsHTML = posts.map(post => `
    <div class="blog-card" data-id="${post.id}">
      <div class="blog-card-banner">
        <img src="${post.image || './assets/images/blog-1.png'}" 
             alt="${post.title}" 
             class="blog-banner-img" 
             loading="lazy">
      </div>
      <div class="blog-content-wrapper">
        <button class="blog-topic text-tiny">${post.topic || 'Post'}</button>
        <h3 class="h3">
          <a href="post.html?id=${post.id}" 
             aria-label="Read ${post.title}" 
             style="color: inherit; text-decoration: none;">
            ${post.title}
          </a>
        </h3>
        <p class="blog-text">${post.body.slice(0, 150)}${post.body.length > 150 ? '...' : ''}</p>
        <div class="wrapper-flex">
          <div class="profile-wrapper">
            <img src="${post.authorImage || './assets/images/author.png'}" 
                 alt="${post.author || 'Musa'}" 
                 width="50" 
                 loading="lazy">
          </div>
          <div class="wrapper">
            <a href="#" class="h4">${post.author || 'Musa'}</a>
            <p class="text-sm">
              <time datetime="${new Date(post.date).toISOString()}">
                ${formatDate(post.date)}
              </time>
              <span class="separator"></span>
              <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
              <time>${calculateReadTime(post.body)} min read</time>
            </p>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Clear existing posts before rendering new ones
  blogCardGroup.innerHTML = postsHTML;
}

// Load more posts when "Show more" is clicked (unchanged)
async function loadMorePosts() {
  showMoreBtn.disabled = true;
  showMoreBtn.textContent = 'Loading...';
  
  try {
    const nextPageQuery = query(
      postsCollection,
      orderBy('date', 'desc'),
      startAfter(lastVisible),
      limit(postsPerPage)
    );
    
    const snapshot = await getDocs(nextPageQuery);
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allPosts = [...allPosts, ...newPosts];
    renderPosts(newPosts);
    
    if (snapshot.docs.length < postsPerPage) {
      showMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading more posts:', error);
    alert('Failed to load more posts. Please try again.');
  } finally {
    showMoreBtn.disabled = false;
    showMoreBtn.textContent = 'Show more';
  }
}

// Your original search implementation (exactly as you had it)
function setupSearch() {
  const searchBox = document.getElementById('searchBox');
  const searchResults = document.getElementById('searchResults');
  
  searchBox.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    
    // Clear results if search is empty
    if (!query) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }

    // Filter pages that match the query
    const results = pages.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query)
    );

    // Display results
    if (results.length) {
      searchResults.innerHTML = results.map(p => `
        <div class="search-result-item" style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:8px;">
          <a href="${p.link}" style="font-size:1.2rem; color:#007acc; text-decoration:none;">
            ${p.title}
          </a>
          <p style="font-size:0.9rem; color:#555; margin-top:0.5rem;">
            ${p.summary}
          </p>
        </div>
      `).join('');
      searchResults.style.display = 'block';
    } else {
      searchResults.innerHTML = `
        <div style="text-align:center; padding:1rem; color:#666;">
          No results found for "${query}"
        </div>
      `;
      searchResults.style.display = 'block';
    }
  });

  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest("#searchBox") && !e.target.closest("#searchResults")) {
      searchResults.style.display = 'none';
    }
  });
}

// Helper functions (unchanged)
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Event listeners (unchanged)
showMoreBtn.addEventListener('click', loadMorePosts);