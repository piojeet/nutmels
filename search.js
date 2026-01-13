document.querySelectorAll(".search-wrapper").forEach((wrap) => {
    const searchInput = wrap.querySelector("#searchInput");
    const suggests = wrap.querySelector("#suggests");
    const openBtns = document.querySelectorAll(".open-search");
    const outsideClose = document.querySelector(".outside-close");
  
    if (!searchInput || !suggests || !outsideClose) return;
  
    const popular = [
      "store location",
      "whatsapp",
      "phone",
      "shop",
      "blog",
      "scanner",
      "facebook",
      "instagram",
      "x",
    ];
  
    const allItems = [...suggests.querySelectorAll("p")].map((el) => ({
      text: el.textContent.toLowerCase(),
      el,
    }));
  
    const filterSuggestions = (query = "") => {
      const q = query.toLowerCase();
  
      allItems.forEach(({ text, el }) => {
        el.style.display = !q || text.includes(q) ? "block" : "none";
      });
  
      if (!q) return;
  
      allItems
        .filter(({ text }) => text.includes(q) && popular.includes(text))
        .forEach(({ el }) => suggests.prepend(el));
    };
  
    const show = () => {
      wrap.classList.remove("hidden");
      suggests.classList.remove("hidden");
      filterSuggestions(searchInput.value.trim());
      searchInput.focus();
    };
  
    const hide = () => {
      wrap.classList.add("hidden");
      suggests.classList.add("hidden");
    };
  
    const toggle = () => {
      wrap.classList.contains("hidden") ? show() : hide();
    };
  
    // ✅ default hidden
    hide();
  
    // ✅ open-contact (toggle)
    openBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
      });
    });
  
    // ✅ inside click should not close
    wrap.addEventListener("click", (e) => e.stopPropagation());
  
    // ✅ outside-close ke bahar click -> hide
    document.addEventListener("click", (e) => {
      const clickedInside = outsideClose.contains(e.target);
      if (!clickedInside) hide();
    });
  
    // ✅ filtering
    searchInput.addEventListener("input", () => {
      filterSuggestions(searchInput.value.trim());
    });
  
    searchInput.addEventListener("focus", () => {
      suggests.classList.remove("hidden");
      filterSuggestions(searchInput.value.trim());
    });
  });
  