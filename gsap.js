
// gsap.registerPlugin(ScrollTrigger);

// gsap.utils.toArray(".product__link").forEach((item, i) => {
//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: item,
//       start: "top 85%",
//       once: true, 
//       // only animate once
//     }
//   });

  // delay each item based on its index
//   tl.fromTo(item, 
//     { opacity: 0, y: 20 },
//     { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: i * 0.2 }
//   );
// });



// gsap.set(".hero__section", {
//   opacity: 0,
//   y: 100
// });




// gsap.from(".hero__section", {
//   scrollTrigger: {
//     trigger: ".hero__section",
//     start: "top 85%",
//   },
//   y: 100,
//   opacity: 0,
//   duration: 1,
//   ease: "power2.out",
// })