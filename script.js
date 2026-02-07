document.addEventListener("click", function (e) {
  // Delete button click
  if (e.target.closest(".delete-btn")) {
    const card = e.target.closest(".product-card");
    const modal = document.querySelector(".delete_box"); // modal common rakha hai
    const deleteBtn = modal.querySelector(".confirm_delete");
    const cancelBtn = modal.querySelector(".cancel_modle");

    // Show modal
    modal.style.display = "flex";

    if (card) {
      // Confirm delete
      deleteBtn.onclick = () => {
        card.remove();
        modal.style.display = "none";
      };

      // Cancel delete
      cancelBtn.onclick = () => {
        modal.style.display = "none";
      };
    }
  }
});

// Hover effect
document.querySelectorAll(".product-card").forEach((product) => {
  const nut = product.querySelector(".cartProductNut");
  const del = product.querySelector(".cartProductDelete");

  product.addEventListener("mouseover", () => {
    nut.style.display = "none";
    del.style.display = "inline-block";
  });

  product.addEventListener("mouseleave", () => {
    nut.style.display = "inline-block";
    del.style.display = "none";
  });
});

// ~~~~~~~~~~~~~~~ MOBILE NAV ~~~~~~~~~~~~~~~
document.addEventListener("DOMContentLoaded", function () {
  // Select elements for mobile navigation
  const mobNavBars = document.querySelectorAll(".mobNavBar");
  const buyNowBtn = document.querySelector(".buy-now") || {
    classList: { add() {}, remove() {} },
  };
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  mobNavBars.forEach((mobNavBar) => {
    const navMenu = mobNavBar.querySelector(".navMenu");
    const menuIcon = mobNavBar.querySelector(".fa-bars");
    const menuWhenOpenIcon = mobNavBar.querySelector(".menuWhenOpen");
    const mobNavLinks =
      mobNavBar.querySelector(".mobNavLinks") ||
      mobNavBar.parentElement?.querySelector(".mobNavLinks") ||
      document.querySelector(".mobNavLinks");
    const navSearchBtn = mobNavBar.querySelector(".navMenuBtn.navSearchBtn");
    const mobSearchContainer =
      mobNavBar.querySelector(".mobSearch") ||
      mobNavBar.parentElement?.querySelector(".mobSearch") ||
      document.querySelector(".mobSearch");
    const searchInput = mobNavBar.querySelector(".searchInput");
    const suggestionBox = mobNavBar.querySelector(".suggestions");

    let menuOpen = false;
    let linksVisible = false;
    let searchVisible = false;
    let isAnimating = false;
    let pendingState = null;
    let nudgeTimer = null;

    const applyDockState = (open) => {
      if (!isMobile()) return;
      if (open === menuOpen) return;
      if (isAnimating) {
        pendingState = open;
        return;
      }

      isAnimating = true;
      menuOpen = open;
      pendingState = null;

      if (open) {
        mobNavBar.classList.add("dock-open", "mobNavBarOpen");
        mobNavBar.classList.remove("dock-closing", "mobNavBarClose");
        mobNavBar.classList.remove("dock-nudge");
        if (menuIcon) {
          menuIcon.style.display = "none";
        }
        if (menuWhenOpenIcon) {
          menuWhenOpenIcon.style.display = "block";
        }
        buyNowBtn.classList.add("bottom-[80px]");
        buyNowBtn.classList.remove("pl-20");
      } else {
        mobNavBar.classList.add("dock-closing", "mobNavBarClose");
        mobNavBar.classList.remove("dock-open", "mobNavBarOpen");
        if (menuIcon) {
          menuIcon.style.display = "block";
        }
        if (menuWhenOpenIcon) {
          menuWhenOpenIcon.style.display = "none";
        }
        if (mobNavLinks) {
          mobNavLinks.classList.add("navLinksHidden");
          mobNavLinks.classList.remove("navLinksVisible");
        }
        buyNowBtn.classList.remove("bottom-[80px]");
        buyNowBtn.classList.add("pl-20");
        linksVisible = false;
      }
    };

    const scheduleNudge = () => {
      if (!isMobile()) return;
      if (nudgeTimer) return;
      nudgeTimer = setInterval(() => {
        if (!isMobile()) return;
        if (menuOpen || isAnimating) return;
        mobNavBar.classList.remove("dock-nudge");
        // retrigger animation
        void mobNavBar.offsetWidth;
        mobNavBar.classList.add("dock-nudge");
      }, 3000);
    };

    const clearNudge = () => {
      if (nudgeTimer) {
        clearInterval(nudgeTimer);
        nudgeTimer = null;
      }
      mobNavBar.classList.remove("dock-nudge");
    };

    scheduleNudge();

    mobNavBar.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;
      isAnimating = false;
      if (!menuOpen) {
        mobNavBar.classList.remove("dock-closing");
      }
      if (pendingState !== null && pendingState !== menuOpen) {
        const next = pendingState;
        pendingState = null;
        applyDockState(next);
      }
    });

    // Toggle menu visibility
    if (navMenu) {
      navMenu.addEventListener("click", function (event) {
        event.stopPropagation();

        applyDockState(!menuOpen);
        if (menuOpen) {
          clearNudge();
        } else {
          scheduleNudge();
        }
      });
    }

    // Allow tap on the closed dock itself (line) to open
    mobNavBar.addEventListener("click", function (event) {
      if (menuOpen || isAnimating || !isMobile()) return;
      if (event.target.closest(".navMenu")) return;
      event.stopPropagation();
      applyDockState(true);
      clearNudge();
    });

    // Toggle links visibility when clicking on menuWhenOpenIcon
    if (menuWhenOpenIcon) {
      menuWhenOpenIcon.addEventListener("click", function (event) {
        event.stopPropagation();

      // ⬅️ Agar search visible hai, to pehle hide karo
      if (searchVisible) {
        if (mobSearchContainer) {
          mobSearchContainer.classList.add("searchHidden");
          mobSearchContainer.classList.remove("searchVisible");
        }
        if (suggestionBox) {
          suggestionBox.classList.add("hidden");
          suggestionBox.classList.remove("visible");
        }
        buyNowBtn.classList.remove("-translate-y-16");
        buyNowBtn.classList.remove("-translate-y-52");
        searchVisible = false;
        if (searchInput) {
          searchInput.value = ""; // optional: input clear
        }
      }

      if (!linksVisible) {
        if (mobNavLinks) {
          mobNavLinks.classList.remove("navLinksHidden");
          mobNavLinks.classList.add("navLinksVisible");
        }
        if (mobSearchContainer) {
          mobSearchContainer.classList.add("searchHidden");
          mobSearchContainer.classList.remove("searchVisible");
        }
        buyNowBtn.classList.add("-translate-y-32");
        linksVisible = true;
      } else {
        if (mobNavLinks) {
          mobNavLinks.classList.add("navLinksHidden");
          mobNavLinks.classList.remove("navLinksVisible");
        }
        buyNowBtn.classList.remove("-translate-y-32");
        linksVisible = false;
      }
      });
    }
    // Toggle search visibility (only on the search button)
    if (navSearchBtn && mobSearchContainer) {
      navSearchBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        // Hide nav menu links if visible
        if (linksVisible) {
          if (mobNavLinks) {
            mobNavLinks.classList.add("navLinksHidden");
            mobNavLinks.classList.remove("navLinksVisible");
          }
          if (buyNowBtn) {
            buyNowBtn.classList.add("-translate-y-16");
            buyNowBtn.classList.remove("-translate-y-32");
          }
          linksVisible = false;
        }

        // Show or hide search container
        if (!searchVisible) {
          mobSearchContainer.classList.remove("searchHidden");
          mobSearchContainer.classList.add("searchVisible");
          if (mobNavLinks) {
            mobNavLinks.classList.add("navLinksHidden");
            mobNavLinks.classList.remove("navLinksVisible");
          }
          if (buyNowBtn) {
            buyNowBtn.classList.add("-translate-y-16");
          }
          searchVisible = true;
        } else {
          mobSearchContainer.classList.add("searchHidden");
          mobSearchContainer.classList.remove("searchVisible");
          if (suggestionBox) {
            suggestionBox.classList.add("hidden");
            suggestionBox.classList.remove("visible");
          }

          // Reset buyNowBtn position
          if (buyNowBtn) {
            buyNowBtn.classList.remove("-translate-y-16");
            buyNowBtn.classList.remove("-translate-y-52"); // reset large translate
          }
          searchVisible = false;

          // Optional: clear input so state is fresh
          if (searchInput) {
            searchInput.value = ""; // ensures next open is fresh
          }
        }
      });
    }

    // Show suggestions based on input
    if (searchInput && suggestionBox) {
      searchInput.addEventListener("input", function () {
        if (searchInput.value.trim() !== "") {
          suggestionBox.classList.remove("hidden");
          suggestionBox.classList.add("visible");
          buyNowBtn.classList.add("-translate-y-52");
          buyNowBtn.classList.remove("-translate-y-16"); // avoid conflict
        } else {
          suggestionBox.classList.add("hidden");
          suggestionBox.classList.remove("visible");
          buyNowBtn.classList.remove("-translate-y-52");

          // Agar search box visible hai to wapas -translate-y-16 lagao
          if (searchVisible) {
            buyNowBtn.classList.add("-translate-y-16");
          } else {
            buyNowBtn.classList.remove("-translate-y-16");
          }
        }
      });
    }

    // Close everything when clicking outside
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".mobNavBar")) {
        if (menuOpen || searchVisible) {
          applyDockState(false);
          if (mobNavLinks) {
            mobNavLinks.classList.add("navLinksHidden");
            mobNavLinks.classList.remove("navLinksVisible");
          }
          if (mobSearchContainer) {
            mobSearchContainer.classList.add("searchHidden");
            mobSearchContainer.classList.remove("searchVisible");
          }
          if (suggestionBox) {
            suggestionBox.classList.add("hidden");
            suggestionBox.classList.remove("visible");
          }
          buyNowBtn.classList.remove("-translate-y-32");
          buyNowBtn.classList.remove("-translate-y-52");
          buyNowBtn.classList.remove("-translate-y-16");
          buyNowBtn.classList.remove("bottom-[80px]");
          buyNowBtn.classList.add("pl-20");
          linksVisible = false;
          searchVisible = false;
        }
      }
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) {
        mobNavBar.classList.remove("dock-open", "dock-closing", "mobNavBarOpen");
        mobNavBar.classList.add("mobNavBarClose");
        if (menuIcon) {
          menuIcon.style.display = "block";
        }
        if (menuWhenOpenIcon) {
          menuWhenOpenIcon.style.display = "none";
        }
        menuOpen = false;
        linksVisible = false;
        searchVisible = false;
        isAnimating = false;
        pendingState = null;
        clearNudge();
      } else {
        scheduleNudge();
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
if (document.querySelectorAll(".slide").length > 0) {
  showSlides(slideIndex);
}

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

  if (!usersign || !passsign || !nextbtn || !backbtn) return;

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
// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".decrease").forEach((button) => {
//     button.addEventListener("click", function () {
//       let counter = this.nextElementSibling;
//       let value = parseInt(counter.value);
//       if (value > 1) {
//         counter.value = value - 1;
//       }
//     });
//   });

//   document.querySelectorAll(".increase").forEach((button) => {
//     button.addEventListener("click", function () {
//       let counter = this.previousElementSibling;
//       let value = parseInt(counter.value);
//       counter.value = value + 1;
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const contactSection = document.getElementById("contact");
  const contactIcon = document.querySelector(".contactIcon");
  if (!contactSection || !contactIcon) return;

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

