// SVG Icons - Ek jagah define karo
const ICONS = {
  likeActive: `<svg width="22" class='!fill-gray-600' height="22" fill="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.4 12.6a1.8 1.8 0 1 1 3.6 0v7.2a1.8 1.8 0 0 1-3.6 0v-7.2Zm4.8-.2v6.516a2.4 2.4 0 0 0 1.327 2.148l.06.03a4.8 4.8 0 0 0 2.145.506h6.499a2.4 2.4 0 0 0 2.354-1.93l1.44-7.2a2.398 2.398 0 0 0-2.353-2.87H14.4V4.8A2.4 2.4 0 0 0 12 2.4a1.2 1.2 0 0 0-1.2 1.2v.8a4.8 4.8 0 0 1-.96 2.88L8.16 9.52a4.8 4.8 0 0 0-.96 2.88Z"></path></svg>`,
  likeInactive: `<svg width="22" height="22" fill="none" stroke="#8f8f8f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 10h4.764a2 2 0 0 1 1.789 2.894l-3.5 7A1.999 1.999 0 0 1 15.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20v-9l3.392-5.089A3.61 3.61 0 0 0 11 3.905c0-.5.405-.905.905-.905H12a2 2 0 0 1 2 2v5Zm0 0h-2"></path><path d="M7 20H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2.667"></path></svg>`,
  heartActive: `<svg width="22" height="22" fill="#e31b23" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.806 6.206a4.8 4.8 0 0 1 6.788 0L12 7.612l1.406-1.406a4.8 4.8 0 1 1 6.788 6.788L12 21.188l-8.194-8.194a4.8 4.8 0 0 1 0-6.788Z" clip-rule="evenodd"></path></svg>`,
  heartInactive: `<svg width="22" height="22" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.343 7.778a4.5 4.5 0 0 1 7.339-1.46L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.501 4.501 0 0 1-.975-4.904Z"></path></svg>`
};

// Storage helpers - localStorage use karenge
const storage = {
  getWishlist: () => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch (e) {
      console.error("Error reading wishlist:", e);
      return [];
    }
  },
  setWishlist: (list) => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(list));
    } catch (e) {
      console.error("Error saving wishlist:", e);
    }
  },
  
  getLikes: (id) => {
    try {
      return parseInt(localStorage.getItem(`likes_${id}`)) || 0;
    } catch (e) {
      return 0;
    }
  },
  setLikes: (id, count) => {
    try {
      localStorage.setItem(`likes_${id}`, count);
    } catch (e) {
      console.error("Error saving likes:", e);
    }
  },
  
  isLiked: (id) => {
    try {
      return localStorage.getItem(`liked_${id}`) === "true";
    } catch (e) {
      return false;
    }
  },
  setLiked: (id, val) => {
    try {
      localStorage.setItem(`liked_${id}`, val);
    } catch (e) {
      console.error("Error saving liked status:", e);
    }
  }
};

// Wishlist functions
const getWishlist = () => storage.getWishlist();
const setWishlist = (list) => storage.setWishlist(list);

// Like functions
const getLikes = (id) => storage.getLikes(id);
const setLikes = (id, count) => storage.setLikes(id, count);
const isLiked = (id) => storage.isLiked(id);
const setLiked = (id, val) => storage.setLiked(id, val);

// Format number helper
function formatLikes(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

// Convert product name to URL-friendly slug
function createSlug(name) {
  if (!name || typeof name !== 'string') return 'product';
  
  try {
    return String(name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product';
  } catch (e) {
    console.error("Error creating slug:", e);
    return 'product';
  }
}

// Product card HTML generator
function createProductCard(p) {
  try {
    // Validate product data
    if (!p || typeof p !== 'object') {
      console.warn('Invalid product object:', p);
      return '';
    }

    if (!p.id) {
      console.warn('Product missing ID:', p);
      return '';
    }

    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(p.id);
    
    // Get or initialize likes data from localStorage
    let likes = getLikes(p.id);
    if (likes === 0 && p.likes && !isNaN(p.likes)) {
      likes = p.likes;
      setLikes(p.id, likes);
    }
    
    const liked = isLiked(p.id);
    
    // Safely get product properties with fallbacks
    const productName = (p.basic && p.basic.name) ? String(p.basic.name) : 'Product';
    const productCategory = (p.basic && p.basic.category) ? String(p.basic.category) : '';
    const productImage = (p.media && p.media.mainImage) ? String(p.media.mainImage) : '';
    const productPrice = (p.buy && p.buy.defaultPrice) ? String(p.buy.defaultPrice) : '0';
    
    // Create URL-friendly slug from product name
    const slug = createSlug(productName);

    return `
      <a class="product" href="../pages/product.html?name=${slug}&id=${p.id}" data-category="${productCategory}"> 
        <div class="hover:bg-[#f5f5f5] duration-200 hover:shadow-md border border-transparent hover:border-solid hover:rounded-2xl p-3 relative group h-full hover:border-gray-300"> 
          <div class="border p-[.5rem] md:p-2 rounded-2xl bg-white"> 
            <div class="static w-fit mb-2 bg-gray-200 rounded-full py-1 px-3 text-[10px] md:text-[12px]"> 
              <p>Save ₹${productPrice}</p>
            </div> 
            <div class="w-full justify-center flex"> 
              <img src="${productImage}" alt="${productName}" class="w-[90%] md:w-[100%] object-cover p-1.5 max-h-[172px]" />
            </div>
            <div class="w-full flex items-center justify-between mt-2"> 
              <div class="flex scale-[.9] md:scale-[1] items-center static top-[7.8rem] md:top-44 left-[1.8rem] justify-center gap-2"> 
                <button class="like-btn" data-id="${p.id}">
                  ${liked ? ICONS.likeActive : ICONS.likeInactive}
                </button>
                <span class="likes-count" data-id="${p.id}">${formatLikes(likes)}</span>
              </div> 
              <button class="heart-btn ${isWishlisted ? "active" : ""}" data-id="${p.id}">
                ${isWishlisted ? ICONS.heartActive : ICONS.heartInactive}
              </button>
            </div> 
          </div> 
          <div class="text-gray-500 mt-2 items-center justify-center text-center"> 
            <h2 class="2xl:text-xl">${productName}</h2>
          </div> 
          <div class="justify-center mt-3 group-hover:opacity-100 flex opacity-0"> 
            <button class="border border-gray-400 text-xs rounded-md py-1 px-4 hover:bg-[#faa61a] hover:text-white hover:border-[#faa61a] duration-300">Select Option</button> 
          </div> 
        </div> 
      </a>
    `;
  } catch (error) {
    console.error("Error creating product card:", error, p);
    return '';
  }
}

// Like button toggle
function toggleLike(id) {
  try {
    const countEl = document.querySelector(`.likes-count[data-id="${id}"]`);
    const likeBtn = document.querySelector(`.like-btn[data-id="${id}"]`);
    
    if (!countEl || !likeBtn) return;
    
    const liked = isLiked(id);
    let count = getLikes(id);

    if (liked) {
      // Unlike
      setLiked(id, false);
      count = Math.max(0, count - 1);
      likeBtn.innerHTML = ICONS.likeInactive;
    } else {
      // Like
      setLiked(id, true);
      count++;
      likeBtn.innerHTML = ICONS.likeActive;
    }

    setLikes(id, count);
    countEl.innerText = formatLikes(count);
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

// Wishlist toggle
function toggleWishlist(id) {
  try {
    const heartBtn = document.querySelector(`.heart-btn[data-id="${id}"]`);
    if (!heartBtn) return;
    
    let wishlist = getWishlist();

    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((x) => x !== id);
      heartBtn.classList.remove("active");
      heartBtn.innerHTML = ICONS.heartInactive;
    } else {
      wishlist.push(id);
      heartBtn.classList.add("active");
      heartBtn.innerHTML = ICONS.heartActive;
    }

    setWishlist(wishlist);
  } catch (error) {
    console.error("Error toggling wishlist:", error);
  }
}

// Main function
async function loadProducts() {
  const container = document.querySelector(".products-wrapper");
  
  if (!container) {
    console.error("Products wrapper not found!");
    return;
  }
  
  try {
    const res = await fetch("../products.json");
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const products = await res.json();

    if (!Array.isArray(products)) {
      throw new Error("Products data is not an array");
    }

    console.log(`Loading ${products.length} products...`);

    // Generate all product cards (filter out invalid products)
    const validCards = products
      .map(createProductCard)
      .filter(card => card !== '');
    
    if (validCards.length === 0) {
      container.innerHTML = '<p class="text-center py-10">No products available</p>';
      return;
    }
    
    container.innerHTML = validCards.join("");

    // Event delegation
    container.addEventListener("click", (e) => {
      const likeBtn = e.target.closest(".like-btn");
      const heartBtn = e.target.closest(".heart-btn");

      if (likeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(likeBtn.dataset.id);
        if (!isNaN(id)) {
          toggleLike(id);
        }
        return;
      }

      if (heartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(heartBtn.dataset.id);
        if (!isNaN(id)) {
          toggleWishlist(id);
        }
      }
    });
    
    console.log(`Successfully loaded ${validCards.length} products`);
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML = '<p class="text-center py-10 text-red-500">Error loading products. Please try again.</p>';
  }
}

loadProducts();