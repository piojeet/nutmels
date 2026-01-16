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

const updateAttribute = (selector, attr, value) => {
  document.querySelectorAll(selector).forEach((el) => {
    el[attr] = value ?? "";
  });
};

// Render block list with styled items
function renderBlockList(wrapperId, items = []) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper || !Array.isArray(items) || !items.length) {
    if (wrapper) wrapper.innerHTML = "";
    return;
  }

  wrapper.innerHTML = items
    .map(
      (text) => `
    <div class="flex items-start py-3">
      <div class="text-[12px] md:text-[14px] xl:text-[18px] relative">
        <span class="absolute top-0 left-0 w-1 h-full bg-primaryColor"></span>
        <p class="pl-8">${text}</p>
      </div>
    </div>
  `
    )
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
    "z-10 w-[140px] md:w-[370px] 2xl:w-[400px] 5xl-lg:w-[600px] m-auto";

  // Add main image
  if (product?.media?.mainImage) {
    slides.push(`
      <div class="swiper-slide">
        <img src="${product.media.mainImage}" 
             alt="${product.basic.name}" 
             class="${imgClass}" />
      </div>
    `);
  }

  // Add gallery images
  if (Array.isArray(product?.media?.gallery)) {
    product.media.gallery.forEach((img) => {
      slides.push(`
        <div class="swiper-slide">
          <img src="${img}" 
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
  const variant = document.querySelector(".variants .active")?.innerText || "";
  const consumption =
    document.querySelector(".consumption-preference .active")?.innerText || "";
  const packageSize =
    document.querySelector(".packages .active")?.innerText || "";

  let title = state.baseName;
  if (variant) title += ` - ${consumption}`;
  if (consumption) title += ` - ${variant}`;

  updateElements(".title", title);
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
`;
document.head.appendChild(style);

// Setup quantity controls
function setupQuantityControls() {
  const decreaseBtns = document.querySelectorAll(".decrease");
  const increaseBtns = document.querySelectorAll(".increase");
  const quantityInputs = document.querySelectorAll(".quantity");

  const updateQuantity = (delta) => {
    quantityInputs.forEach((input) => {
      let value = parseInt(input.value) || 1;
      value = Math.max(1, value + delta);
      input.value = value;
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
    renderBlockList("ingredientWrapper", product?.description?.ingredients);
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
loadProduct();
