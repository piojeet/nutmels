// use kaise karenge esme:
// Product state management
const state = {
  product: null,
  basePrice: 0,
  baseName: "",
  swiper: null,
};

// DOM helpers
const updateElements = (selector, value) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.innerText = value ?? "";
  });
};

const resolveMediaPath = (path) => {
  if (!path) return "";
  if (
    /^(https?:)?\/\//i.test(path) ||
    path.startsWith("/") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  if (path.startsWith("./")) {
    return `/${path.slice(2)}`;
  }
  return path;
};

const updateAttribute = (selector, attr, value) => {
  document.querySelectorAll(selector).forEach((el) => {
    const resolvedValue = attr === "src" ? resolveMediaPath(value) : value;
    el[attr] = resolvedValue ?? "";
  });
};

// Render block list with styled items
function renderBlockList(wrapperId, items = [], options = {}) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper || !Array.isArray(items) || !items.length) {
    if (wrapper) wrapper.innerHTML = "";
    return;
  }

  const { showMobilePercent = false, defaultPercent = "90%" } = options;

  wrapper.innerHTML = items
    .map((item) => {
      const text = typeof item === "string" ? item : item?.text ?? "";
      const percent =
        typeof item === "object" && item?.percent
          ? item.percent
          : defaultPercent;

      return `
    <div class="flex items-start py-3">
      <div class="text-[12px] md:text-[14px] xl:text-[18px] relative flex items-center justify-between w-full">
        <span class="absolute top-0 left-0 w-1 h-full bg-primaryColor"></span>
        <p class="lg:pl-8 pl-4 font-semibold lg:font-normal">${text}</p>
        ${showMobilePercent ? `<span class="lg:hidden">${percent}</span>` : ""}
      </div>
    </div>
  `;
    })
    .join("");
}

// Render simple lists with styling
function renderList(selector, items = []) {
  document.querySelectorAll(selector).forEach((el) => {
    el.innerHTML = Array.isArray(items)
      ? items
          .map(
            (item) =>
              `<li class="cursor-pointer transition-colors">${item}</li>`
          )
          .join("")
      : "";
  });
}

// Render package options as selectable list
function renderPackages(selector, packages = []) {
  document.querySelectorAll(selector).forEach((el) => {
    el.innerHTML = Array.isArray(packages)
      ? packages
          .map(
            (pkg) =>
              `<li class="cursor-pointer transition-colors list-none" data-price="${pkg.price}" data-size="${pkg.size}">${pkg.size}`
          )
          .join("")
      : "";
  });
}

// Initialize Swiper carousel
function initializeSwiper(product) {
  // Destroy previous instance
  if (state.swiper?.destroy) {
    state.swiper.destroy(true, true);
    state.swiper = null;
  }

  const hasMultipleSlides =
    Array.isArray(product?.media?.gallery) && product.media.gallery.length > 0;

  if (typeof Swiper !== "undefined") {
    state.swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: hasMultipleSlides,
      navigation: {
        nextEl: ".productimage-button-next",
        prevEl: ".productimage-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      keyboard: true,
      on: {
        init: function () {
          console.log("Swiper initialized with", this.slides.length, "slides");
        },
      },
    });
  }
}

// Build Swiper slides
function buildSwiperSlides(product) {
  const wrapper = document.getElementById("productSwiper");
  if (!wrapper) return;

  const slides = [];
  const imgClass =
    "z-10 w-full aspect-square md:w-[370px] 2xl:w-[400px] 5xl-lg:w-[600px] m-auto";

  // Add main image
  if (product?.media?.mainImage) {
    const mainImage = resolveMediaPath(product.media.mainImage);
    slides.push(`
      <div class="swiper-slide">
        <img src="${mainImage}" 
             alt="${product.basic.name}" 
             class="${imgClass}" />
      </div>
    `);
  }

  // Add gallery images
  if (Array.isArray(product?.media?.gallery)) {
    product.media.gallery.forEach((img) => {
      const galleryImage = resolveMediaPath(img);
      slides.push(`
        <div class="swiper-slide">
          <img src="${galleryImage}" 
               alt="${product.basic.name}" 
               class="${imgClass}" />
        </div>
      `);
    });
  }

  wrapper.innerHTML = slides.join("");
}

// Populate nutrition data
function populateNutrition(nutrition) {
  if (!nutrition) return;

  const fields = [
    "servingSize",
    "calories",
    "fat",
    "saturatedFat",
    "transFat",
    "cholesterol",
    "sodium",
    "carbohydrates",
    "dietaryFiber",
    "totalSugars",
    "protein",
    "vitaminD",
    "calcium",
    "iron",
    "potassium",
  ];

  fields.forEach((field) => {
    const data = nutrition[field];
    const value =
      data?.value ?? (field === "servingSize" ? nutrition[field] : "");
    const percent =
      data?.percent ??
      (field.includes("vitamin") ||
      field === "calcium" ||
      field === "iron" ||
      field === "potassium"
        ? "00 %"
        : "-");

    updateElements(`.${field.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value);

    if (data?.percent !== undefined) {
      updateElements(
        `.${field.replace(/([A-Z])/g, "-$1").toLowerCase()}-percent`,
        percent
      );
    }
  });

  // Render nutrition table
  document.querySelectorAll(".nutrition-table").forEach((el) => {
    el.innerHTML = `
      <table>
        <tr><th>Serving Size</th><td>${nutrition.servingSize ?? ""}</td></tr>
        <tr><th>Calories</th><td>${nutrition.calories?.value ?? ""}</td></tr>
        <tr><th>Fat</th><td>${nutrition.fat?.value ?? ""}</td></tr>
        <tr><th>Saturated Fat</th><td>${
          nutrition.saturatedFat?.value ?? ""
        }</td></tr>
        <tr><th>Trans Fat</th><td>${nutrition.transFat?.value ?? ""}</td></tr>
        <tr><th>Cholesterol</th><td>${
          nutrition.cholesterol?.value ?? ""
        }</td></tr>
        <tr><th>Sodium</th><td>${nutrition.sodium?.value ?? ""}</td></tr>
        <tr><th>Carbohydrates</th><td>${
          nutrition.carbohydrates?.value ?? ""
        }</td></tr>
        <tr><th>Dietary Fiber</th><td>${
          nutrition.dietaryFiber?.value ?? ""
        }</td></tr>
        <tr><th>Total Sugars</th><td>${
          nutrition.totalSugars?.value ?? ""
        }</td></tr>
        <tr><th>Protein</th><td>${nutrition.protein?.value ?? ""}</td></tr>
      </table>
    `;
  });
}

// Update price display
function updatePrice(quantity) {
  const total = state.basePrice * quantity;
  updateElements(".price", String(total));
  updateElements(".total-price", String(total));
}

// Update product title with variants
function updateProductTitle() {
  const variant =
    document.querySelector(".variants .active")?.innerText || "";

  const consumption =
    document.querySelector(".consumption-preference .active")?.innerText || "";


  let title = state.baseName;

  // if (consumption) title += ` - ${consumption}`;
  // if (variant) title += ` - ${variant}`;
  // if (packageSize) title += ` - ${packageSize}`;

  updateElements(".title", title);

  updateElements(".variant-select", variant);
  updateElements(".consumption-preference-select", consumption);
}


// Update price and size based on selected package
function updatePackagePrice(packageText) {
  const packageItem = document.querySelector(".packages .active");
  if (packageItem) {
    const price = packageItem.dataset.price;
    const size = packageItem.dataset.size;

    if (price) {
      state.basePrice = Number(price);
      const quantity =
        parseInt(document.querySelector(".quantity")?.value) || 1;
      updatePrice(quantity);
    }

    // Update default size display
    if (size) {
      updateElements(".default-size", size);
    }
  }
  updateProductTitle();
}

// Make list items selectable
function makeSelectable(selector, activeClass, onChange) {
  const items = document.querySelectorAll(`${selector} li`);
  if (!items.length) return;

  // Select first item by default
  items[0].classList.add(activeClass);
  onChange?.(items[0].innerText);

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove(activeClass));
      item.classList.add(activeClass);
      onChange?.(item.innerText);
    });
  });
}

// Add CSS for active state
const style = document.createElement("style");
style.textContent = `
  .active {
    color: #FAA61A !important;
  }
  .quantity {
    transition: color 160ms ease;
  }
  .quantity-animate-up {
    animation: quantitySlideUp 180ms ease;
  }
  .quantity-animate-down {
    animation: quantitySlideDown 180ms ease;
  }
  @keyframes quantitySlideUp {
    0% {
      transform: translateY(6px);
      opacity: 0.35;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes quantitySlideDown {
    0% {
      transform: translateY(-6px);
      opacity: 0.35;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Setup quantity controls
function setupQuantityControls() {
  const decreaseBtns = document.querySelectorAll(".decrease");
  const increaseBtns = document.querySelectorAll(".increase");
  const quantityInputs = document.querySelectorAll(".quantity");

  const updateQuantity = (delta) => {
    const animationClass =
      delta > 0 ? "quantity-animate-up" : "quantity-animate-down";
    quantityInputs.forEach((input) => {
      let value = parseInt(input.value) || 1;
      value = Math.max(1, value + delta);
      input.value = value;
      const isMobileVerticalControl = !!input.closest(".incdec.flex-col");
      if (isMobileVerticalControl) {
        input.classList.remove("quantity-animate-up", "quantity-animate-down");
        void input.offsetWidth;
        input.classList.add(animationClass);
      }
      updatePrice(value);
    });
  };

  increaseBtns.forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(1))
  );
  decreaseBtns.forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(-1))
  );
}

// Main product loader
async function loadProduct() {
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const id = params.get("id");

    if (!name || !id) {
      throw new Error("Missing product parameters (name or id)");
    }

    const res = await fetch("../products.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch products.json: ${res.status}`);
    }

    const products = await res.json();
    const product = products.find(p =>
  String(p.id) === String(id) &&
  (
    String(p.slug).toLowerCase() === String(name).toLowerCase() ||
    String(p.basic?.name).toLowerCase() === String(name).toLowerCase()
  )
);


    if (!product) {
      throw new Error("Product not found");
    }

    state.product = product;

    // Basic info
    updateElements(".title", product?.basic?.name);
    updateElements(".background-text", product?.basic?.backgroundText);
    updateElements(".category", product?.basic?.category);
    updateElements(".likes", product?.likes ?? "");

    // Store base name for title updates
    state.baseName = product?.basic?.name || "";

    // Buy info
    updateElements(".price", product?.buy?.defaultPrice);
    updateElements(".currency", product?.buy?.currency);
    updateElements(".default-qty", product?.buy?.defaultQty);
    // Set initial default size from first package
    const firstPackageSize =
      product?.buy?.packages?.[0]?.size || product?.buy?.defaultSize;
    updateElements(".default-size", firstPackageSize);

    // Media
    updateAttribute(".image", "src", product?.media?.mainImage);
    buildSwiperSlides(product);

    // Description and benefits
    renderBlockList("briefWrapper", product?.description?.brief);
    renderBlockList("ingredientWrapper", product?.description?.ingredients, {
      showMobilePercent: true,
    });
    renderBlockList("benefitsWrapper", product?.benefits?.list);
    renderBlockList("rdiWrapper", product?.benefits?.rdi);

    // Buy options
    renderList(".consumption-preference", product?.buy?.consumptionPreference);
    renderList(".variants", product?.buy?.variants);
    renderPackages(".packages", product?.buy?.packages);

    // Nutrition
    populateNutrition(product?.nutrition);

    // Setup price
    state.basePrice = Number(product?.buy?.defaultPrice) || 0;
    updatePrice(1);

    // Initialize Swiper after slides are added
    initializeSwiper(product);

    // Setup interactivity
    makeSelectable(".variants", "active", updateProductTitle);
    makeSelectable(".consumption-preference", "active", updateProductTitle);
    makeSelectable(".packages", "active", updatePackagePrice);

    console.log("Product loaded successfully:", product?.basic?.name);
  } catch (err) {
    console.error("Error loading product:", err);
    // Optional: Display error message to user
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Error Loading Product</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// Initialize on DOM load
setupQuantityControls();

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  return isNaN(id) ? null : id;
}

function initLikeHeartUI() {
  const id = getProductIdFromURL();
  if (!id) return;

  const likeBtn = document.querySelector(".like-btn");
  const countEl = document.querySelector(".likes-count");
  const heartBtn = document.querySelector(".heart-btn");

  // ✅ initial UI set
  if (likeBtn) {
    likeBtn.innerHTML = isLiked(id) ? ICONS.likeActive : ICONS.likeInactive;
  }

  if (countEl) {
    countEl.innerText = formatLikes(getLikes(id));
  }

  if (heartBtn) {
    const wishlist = getWishlist();
    const isWishlisted = wishlist.includes(id);

    heartBtn.classList.toggle("active", isWishlisted);
    heartBtn.innerHTML = isWishlisted ? ICONS.heartActive : ICONS.heartInactive;
  }

  // ✅ click events
  if (likeBtn) {
    likeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const liked = isLiked(id);
      let count = getLikes(id);

      if (liked) {
        setLiked(id, false);
        count = Math.max(0, count - 1);
        likeBtn.innerHTML = ICONS.likeInactive;
      } else {
        setLiked(id, true);
        count++;
        likeBtn.innerHTML = ICONS.likeActive;
      }

      setLikes(id, count);
      if (countEl) countEl.innerText = formatLikes(count);
    });
  }

  if (heartBtn) {
    heartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

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
    });
  }
}

initLikeHeartUI();
loadProduct();
