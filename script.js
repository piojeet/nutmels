// ~~~~~~~~~~~~~~~ MOBILE NAV ~~~~~~~~~~~~~~~
document.addEventListener("DOMContentLoaded", function () {
  // Select elements for mobile navigation
  const mobNavBars = document.querySelectorAll(".mobNavBar");
  const navMenus = document.querySelectorAll(".navMenu");
  const menuIcons = document.querySelectorAll(".fa-bars");
  const menuWhenOpenIcons = document.querySelectorAll(".menuWhenOpen");
  const mobNavLinksList = document.querySelectorAll(".mobNavLinks");
  const navSearchBtns = document.querySelectorAll(".navSearchBtn");
  const mobSearchContainers = document.querySelectorAll(".mobSearch");
  const searchInputs = document.querySelectorAll(".searchInput");
  const suggestions = document.querySelectorAll(".suggestions");

  mobNavBars.forEach((mobNavBar, index) => {
    const navMenu = navMenus[index];
    const menuIcon = menuIcons[index];
    const menuWhenOpenIcon = menuWhenOpenIcons[index];
    const mobNavLinks = mobNavLinksList[index];
    const navSearchBtn = navSearchBtns[index];
    const mobSearchContainer = mobSearchContainers[index];
    const searchInput = searchInputs[index];
    const suggestionBox = suggestions[index];

    let menuOpen = false;
    let linksVisible = false;
    let searchVisible = false;

    // Toggle menu visibility
    navMenu.addEventListener("click", function (event) {
      event.stopPropagation();

      if (!menuOpen) {
        mobNavBar.classList.add("mobNavBarOpen");
        mobNavBar.classList.remove("mobNavBarClose");
        menuIcon.style.display = "none";
        menuWhenOpenIcon.style.display = "block";
        menuOpen = true;
      } else {
        mobNavBar.classList.add("mobNavBarClose");
        mobNavBar.classList.remove("mobNavBarOpen");
        menuIcon.style.display = "block";
        menuWhenOpenIcon.style.display = "none";
        mobNavLinks.classList.add("navLinksHidden");
        mobNavLinks.classList.remove("navLinksVisible");
        menuOpen = false;
        linksVisible = false;
      }
    });

    // Toggle links visibility when clicking on menuWhenOpenIcon
    menuWhenOpenIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      if (!linksVisible) {
        mobNavLinks.classList.remove("navLinksHidden");
        mobNavLinks.classList.add("navLinksVisible");
        linksVisible = true;
      } else {
        mobNavLinks.classList.add("navLinksHidden");
        mobNavLinks.classList.remove("navLinksVisible");
        linksVisible = false;
      }
    });

    // Toggle search visibility
    navSearchBtn.addEventListener("click", function (event) {
      event.stopPropagation();

      // Hide nav menu links if visible
      if (linksVisible) {
        mobNavLinks.classList.add("navLinksHidden");
        mobNavLinks.classList.remove("navLinksVisible");
        linksVisible = false;
      }

      // Show or hide search container
      if (!searchVisible) {
        mobSearchContainer.classList.remove("searchHidden");
        mobSearchContainer.classList.add("searchVisible");
        searchVisible = true;
      } else {
        mobSearchContainer.classList.add("searchHidden");
        mobSearchContainer.classList.remove("searchVisible");
        suggestionBox.classList.add("hidden");
        suggestionBox.classList.remove("visible");
        searchVisible = false;
      }
    });

    // Show suggestions based on input
    searchInput.addEventListener("input", function () {
      if (searchInput.value.trim() !== "") {
        suggestionBox.classList.remove("hidden");
        suggestionBox.classList.add("visible");
      } else {
        suggestionBox.classList.add("hidden");
        suggestionBox.classList.remove("visible");
      }
    });

    // Close everything when clicking outside
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".mobNavBar")) {
        if (menuOpen || searchVisible) {
          mobNavBar.classList.add("mobNavBarClose");
          mobNavBar.classList.remove("mobNavBarOpen");
          menuIcon.style.display = "block";
          menuWhenOpenIcon.style.display = "none";
          mobNavLinks.classList.add("navLinksHidden");
          mobNavLinks.classList.remove("navLinksVisible");
          mobSearchContainer.classList.add("searchHidden");
          mobSearchContainer.classList.remove("searchVisible");
          suggestionBox.classList.add("hidden");
          suggestionBox.classList.remove("visible");
          menuOpen = false;
          linksVisible = false;
          searchVisible = false;
        }
      }
    });
  });
});

// ~~~~~~~~~~~~~~~ STARS RATING ~~~~~~~~~~~~~~~
document.querySelectorAll(".stars").forEach((heart, index) => {
  heart.addEventListener("click", function () {
    const hearts = document.querySelectorAll(".stars");

    // Loop through all hearts and update their state based on the clicked one
    hearts.forEach((h, i) => {
      if (i <= index) {
        h.classList.remove("fa-regular");
        h.classList.add("fa-solid", "text-primaryColor");
      } else {
        h.classList.remove("fa-solid", "text-primaryColor");
        h.classList.add("fa-regular");
      }
    });
  });
});

// ~~~~~~~~~~~~~~~ SLIDESHOW ~~~~~~~~~~~~~~~
let slideIndex = 0;
showSlides(slideIndex);

function showSlides(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  // Handle wrap-around for slide index
  if (n >= slides.length) {
    slideIndex = 0;
  } else if (n < 0) {
    slideIndex = slides.length - 1;
  } else {
    slideIndex = n;
  }

  // Hide all slides and dots
  slides.forEach((slide, index) => {
    slide.style.display = "none";
    slide.classList.remove("active");
    dots[index].classList.remove("active");
  });

  // Show the current slide and highlight the corresponding dot
  slides[slideIndex].style.display = "flex";
  slides[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");
}

function nextSlide() {
  showSlides(slideIndex + 1);
}

function prevSlide() {
  showSlides(slideIndex - 1);
}

function currentSlide(n) {
  showSlides(n);
}

// ~~~~~~~~~~~~~~~ TABS ~~~~~~~~~~~~~~~
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all tab contents
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("show");
  }

  // Remove active class from all tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the current tab and add active class to the button
  document.getElementById(tabName).classList.add("show");
  evt.currentTarget.classList.add("active");
}

// ~~~~~~~~~~~~~~~ LOGIN PAGE TABS ~~~~~~~~~~~~~~~
function logopenTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all login tab contents
  tabcontent = document.getElementsByClassName("logcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("show");
  }

  // Remove active class from all login tab links
  tablinks = document.getElementsByClassName("loglinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the current tab and add active class to the button
  document.getElementById(tabName).classList.add("show");
  evt.currentTarget.classList.add("active");
}

// ~~~~~~~~~~~~~~~ LOGIN PAGE SWITCH ~~~~~~~~~~~~~~~
document.addEventListener("DOMContentLoaded", function () {
  const usersign = document.querySelector(".usersign");
  const passsign = document.querySelector(".passsign");
  const nextbtn = document.getElementById("nextbtn");
  const backbtn = document.getElementById("backbtn");

  usersign.style.display = "block"; // Initial state

  // Switch to password sign-in on next button click
  nextbtn.addEventListener("click", function () {
    usersign.style.display = "none";
    passsign.style.display = "block";
  });

  // Switch back to user sign-in on back button click
  backbtn.addEventListener("click", function () {
    passsign.style.display = "none";
    usersign.style.display = "block";
  });
});

//  ~~~~~~~~~~~~~~~ Tabs contact ~~~~~~~~~~~~~~~
function contactopenTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontact");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("show");
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("conlinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).classList.add("show");
  evt.currentTarget.classList.add("active");
}

//  ~~~~~~~~~~~~~~~ Cart ~~~~~~~~~~~~~~~
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", function () {
      let counter = this.nextElementSibling;
      let value = parseInt(counter.value);
      if (value > 1) {
        counter.value = value - 1;
      }
    });
  });

  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", function () {
      let counter = this.previousElementSibling;
      let value = parseInt(counter.value);
      counter.value = value + 1;
    });
  });
});

//  ~~~~~~~~~~~~~~~ Product Page ~~~~~~~~~~~~~~~

//product image slide btn
// const proButtons = document.querySelectorAll(".pro-button");
// const productSlides = document.querySelectorAll(".productSlides");
// const productbannerbtn1 = document.querySelectorAll(".productbannerbtn1");
// const productbannerbtn2 = document.querySelectorAll(".productbannerbtn2");

// productSlides.forEach((slide) => {
//   slide.addEventListener("mouseenter", () => {
//     proButtons.forEach((button) => {
//       button.style.display = "block";
//     });
//   });

//   slide.addEventListener("mouseleave", () => {
//     proButtons.forEach((button) => {
//       button.style.display = "none";
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const contactSection = document.getElementById("contact");
  const contactIcon = document.querySelector(".contactIcon");

  // Define the callback function that will run when the section comes into view
  const onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // The section is in view, do something
        console.log("Contact section is in view!");
        contactIcon.style.backgroundColor = "#F8A531";
        contactIcon.classList.add("fill-white-color");

        // You can perform any action you want here
        // For example, adding a class, fetching data, etc.
      } else {
        // The section is out of view, do something else
        contactIcon.style.backgroundColor = "";
        contactIcon.classList.remove("fill-white-color");
      }
    });
  };

  // Create an Intersection Observer instance
  const observer = new IntersectionObserver(onIntersection, {
    root: null, // Use the viewport as the root
    threshold: 0.1, // Trigger the callback when 10% of the section is visible
  });

  // Start observing the contact section
  observer.observe(contactSection);
});
function currentSlide(index) {
  var dots = document.querySelectorAll(".dot");
  dots.forEach(function (dot, i) {
    if (i === index) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

//  ~~~~~~~~~~~~~~~ Review ~~~~~~~~~~~~~~~
document.querySelectorAll(".fa-heart").forEach((heart, index) => {
  heart.addEventListener("click", function () {
    const hearts = document.querySelectorAll(".fa-heart");

    // Loop through all hearts
    hearts.forEach((h, i) => {
      if (i <= index) {
        // Set hearts up to and including the clicked one to solid and primary color
        h.classList.remove("fa-regular");
        h.classList.add("fa-solid", "text-primaryColor");
      } else {
        // Set remaining hearts to regular and default color
        h.classList.remove("fa-solid", "text-primaryColor");
        h.classList.add("fa-regular");
      }
    });
  });
});

//  ~~~~~~~~~~~~~~~ SwiperJS ~~~~~~~~~~~~~~~

