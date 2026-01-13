// --------------------
// Product State
// --------------------
const state = {
  product: null,
  basePrice: 0,
  baseName: '',
  swiper: null
};

// --------------------
// DOM Helpers
// --------------------
const updateElements = (selector, value = '') => {
  document.querySelectorAll(selector).forEach(el => {
    el.innerText = value;
  });
};

const updateAttribute = (selector, attr, value = '') => {
  document.querySelectorAll(selector).forEach(el => {
    el[attr] = value;
  });
};

// --------------------
// Render Helpers
// --------------------
function renderBlockList(wrapperId, items = []) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper || !Array.isArray(items) || !items.length) {
    if (wrapper) wrapper.innerHTML = '';
    return;
  }

  wrapper.innerHTML = items.map(text => `
    <div class="flex items-start py-3">
      <div class="text-[12px] md:text-[14px] xl:text-[18px] relative">
        <span class="absolute top-0 left-0 w-1 h-full bg-primaryColor"></span>
        <p class="pl-8">${text}</p>
      </div>
    </div>
  `).join('');
}

function renderList(selector, items = []) {
  document.querySelectorAll(selector).forEach(el => {
    el.innerHTML = Array.isArray(items)
      ? items.map(item => `<li class="cursor-pointer transition-colors">${item}</li>`).join('')
      : '';
  });
}

function renderPackages(selector, packages = []) {
  document.querySelectorAll(selector).forEach(el => {
    el.innerHTML = Array.isArray(packages)
      ? packages.map(pkg => `
          <li 
            class="cursor-pointer transition-colors list-none"
            data-price="${pkg.price}"
            data-size="${pkg.size}">
            ${pkg.size}
          </li>
        `).join('')
      : '';
  });
}

// --------------------
// Swiper
// --------------------
function initializeSwiper(product) {
  if (state.swiper?.destroy) {
    state.swiper.destroy(true, true);
    state.swiper = null;
  }

  const hasMultipleSlides =
    Array.isArray(product?.media?.gallery) &&
    product.media.gallery.length > 0;

  if (typeof Swiper === 'undefined') return;

  state.swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: hasMultipleSlides,
    navigation: {
      nextEl: '.productimage-button-next',
      prevEl: '.productimage-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    keyboard: true
  });
}

function buildSwiperSlides(product) {
  const wrapper = document.getElementById('productSwiper');
  if (!wrapper) return;

  const imgClass =
    'z-10 w-[140px] md:w-[370px] 2xl:w-[400px] 5xl-lg:w-[600px] m-auto';

  const slides = [];

  if (product?.media?.mainImage) {
    slides.push(`
      <div class="swiper-slide">
        <img src="${product.media.mainImage}" alt="${product.basic.name}" class="${imgClass}" />
      </div>
    `);
  }

  if (Array.isArray(product?.media?.gallery)) {
    product.media.gallery.forEach(img => {
      slides.push(`
        <div class="swiper-slide">
          <img src="${img}" alt="${product.basic.name}" class="${imgClass}" />
        </div>
      `);
    });
  }

  wrapper.innerHTML = slides.join('');
}

// --------------------
// Nutrition
// --------------------
function populateNutrition(nutrition) {
  if (!nutrition) return;

  const fields = [
    'servingSize','calories','fat','saturatedFat','transFat',
    'cholesterol','sodium','carbohydrates','dietaryFiber',
    'totalSugars','protein','vitaminD','calcium','iron','potassium'
  ];

  fields.forEach(field => {
    const data = nutrition[field];
    const value = data?.value ?? data ?? '';
    const percent = data?.percent ?? '-';

    const cls = `.${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    updateElements(cls, value);
    updateElements(`${cls}-percent`, percent);
  });
}

// --------------------
// Pricing
// --------------------
function updatePrice(quantity = 1) {
  const total = state.basePrice * quantity;
  updateElements('.price', total);
  updateElements('.total-price', total);
}

function updateProductTitle() {
  const variant = document.querySelector('.variants .active')?.innerText || '';
  const consumption = document.querySelector('.consumption-preference .active')?.innerText || '';

  let title = state.baseName;
  if (variant) title += ` - ${variant}`;
  if (consumption) title += ` - ${consumption}`;

  updateElements('.title', title);
}

function updatePackagePrice() {
  const pkg = document.querySelector('.packages .active');
  if (!pkg) return;

  const price = Number(pkg.dataset.price);
  const size = pkg.dataset.size;

  if (!isNaN(price)) {
    state.basePrice = price;
    const qty = parseInt(document.querySelector('.quantity')?.value) || 1;
    updatePrice(qty);
  }

  if (size) updateElements('.default-size', size);
  updateProductTitle();
}

// --------------------
// Selectable Lists
// --------------------
function makeSelectable(selector, activeClass, onChange) {
  const items = document.querySelectorAll(`${selector} li`);
  if (!items.length) return;

  items[0].classList.add(activeClass);
  onChange?.(items[0].innerText);

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove(activeClass));
      item.classList.add(activeClass);
      onChange?.(item.innerText);
    });
  });
}

// --------------------
// Quantity Controls
// --------------------
function setupQuantityControls() {
  const quantities = document.querySelectorAll('.quantity');

  const updateQty = delta => {
    quantities.forEach(input => {
      let val = parseInt(input.value) || 1;
      val = Math.max(1, val + delta);
      input.value = val;
      updatePrice(val);
    });
  };

  document.querySelectorAll('.increase')
    .forEach(btn => btn.addEventListener('click', () => updateQty(1)));

  document.querySelectorAll('.decrease')
    .forEach(btn => btn.addEventListener('click', () => updateQty(-1)));
}

// --------------------
// Loader
// --------------------
async function loadProduct() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const slug = params.get('name');
    if (!id || !slug) throw new Error('Missing product parameters');

    const res = await fetch('../products.json');
    if (!res.ok) throw new Error('Failed to load products');

    const products = await res.json();
    const product = products.find(p => String(p.id) === id && p.slug === slug);
    if (!product) throw new Error('Product not found');

    state.product = product;
    state.baseName = product.basic?.name || '';
    state.basePrice = Number(product.buy?.defaultPrice) || 0;

    updateElements('.title', state.baseName);
    updateElements('.background-text', product.basic?.backgroundText);
    updateElements('.category', product.basic?.category);
    updateElements('.likes', product.likes);

    updateElements('.currency', product.buy?.currency);
    updateElements('.default-qty', product.buy?.defaultQty);
    updateElements('.default-size', product.buy?.packages?.[0]?.size);

    buildSwiperSlides(product);
    initializeSwiper(product);

    renderBlockList('briefWrapper', product.description?.brief);
    renderBlockList('ingredientWrapper', product.description?.ingredients);
    renderBlockList('benefitsWrapper', product.benefits?.list);
    renderBlockList('rdiWrapper', product.benefits?.rdi);

    renderList('.variants', product.buy?.variants);
    renderList('.consumption-preference', product.buy?.consumptionPreference);
    renderPackages('.packages', product.buy?.packages);

    populateNutrition(product.nutrition);
    updatePrice(1);

    makeSelectable('.variants', 'active', updateProductTitle);
    makeSelectable('.consumption-preference', 'active', updateProductTitle);
    makeSelectable('.packages', 'active', updatePackagePrice);

  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div style="padding:20px;text-align:center">
        <h2>Error Loading Product</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// --------------------
setupQuantityControls();
loadProduct();
