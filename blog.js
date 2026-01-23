
const BLOG_ICONS = {
    heartActive: `<svg width="22" height="22" fill="#FAA61A" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.806 6.206a4.8 4.8 0 0 1 6.788 0L12 7.612l1.406-1.406a4.8 4.8 0 1 1 6.788 6.788L12 21.188l-8.194-8.194a4.8 4.8 0 0 1 0-6.788Z" clip-rule="evenodd"></path></svg>`,
    heartInactive: `<svg width="22" height="22" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.343 7.778a4.5 4.5 0 0 1 7.339-1.46L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.501 4.501 0 0 1-.975-4.904Z"></path></svg>`
  };
  
  // ✅ localStorage helpers
  function getBlogWishlist() {
    try {
      return JSON.parse(localStorage.getItem("blogWishlist") || "[]");
    } catch (e) {
      return [];
    }
  }
  
  function setBlogWishlist(list) {
    try {
      localStorage.setItem("blogWishlist", JSON.stringify(list));
    } catch (e) {}
  }
  
  function isBlogWishlisted(id) {
    return getBlogWishlist().includes(id);
  }
  
  function toggleBlogWishlist(id) {
    let list = getBlogWishlist();
  
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
    } else {
      list.push(id);
    }
  
    setBlogWishlist(list);
  }
  
  // ✅ Init all hearts on page
  function initBlogHearts() {
    const heartBtns = document.querySelectorAll(".blog-heart-btn");
  
    heartBtns.forEach((btn) => {
      const id = parseInt(btn.dataset.id);
      if (isNaN(id)) return;
  
      // initial UI
      btn.innerHTML = isBlogWishlisted(id)
        ? BLOG_ICONS.heartActive
        : BLOG_ICONS.heartInactive;
  
      // click event
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        toggleBlogWishlist(id);
  
        btn.innerHTML = isBlogWishlisted(id)
          ? BLOG_ICONS.heartActive
          : BLOG_ICONS.heartInactive;
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", initBlogHearts);
  