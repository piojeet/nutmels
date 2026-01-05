const swipe = document.getElementById("swipe");
    const handle = document.getElementById("handle");
    const progress = document.getElementById("progress");
    const label = document.getElementById("label");

    let isDragging = false;
    let startX, maxWidth;

    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag);

    function startDrag(e) {
      isDragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      maxWidth = swipe.offsetWidth - handle.offsetWidth - 4;
      handle.style.transition = "none";
      progress.style.transition = "none";

      // stop teaser animation while dragging
      handle.style.animation = "none";
    }

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag);

    function onDrag(e) {
      if (!isDragging) return;
      let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
      let moveX = Math.min(Math.max(0, clientX - swipe.getBoundingClientRect().left - handle.offsetWidth/2), maxWidth);
      handle.style.left = moveX + 4 + "px";
      progress.style.width = ((moveX + handle.offsetWidth) / swipe.offsetWidth) * 100 + "%";
    }

    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;

      let currentLeft = parseInt(handle.style.left) || 0;

      if (currentLeft > maxWidth * 0.85) {
        // Success
        handle.style.left = maxWidth + 4 + "px";
        progress.style.width = "100%";
        swipe.classList.add("success");
        label.textContent = "Payment Successful ✅";
        label.classList.add("success-text");

        // make arrow disappear
        setTimeout(() => {
          handle.classList.add("hide");
        }, 500);

      } else {
        // Snap back
        handle.style.transition = "left 0.3s ease";
        progress.style.transition = "width 0.3s ease";
        handle.style.left = "4px";
        progress.style.width = "0%";

        // restore teaser after a delay
        setTimeout(() => {
          handle.style.animation = "tease 2s infinite ease-in-out";
        }, 400);
      }
    }