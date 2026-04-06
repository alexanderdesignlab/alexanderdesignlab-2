// Crossfade carousel for Animation page

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video");

      if (i === index) {
        slide.classList.add("active");
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else {
        slide.classList.remove("active");
        if (video) {
          video.pause();
        }
      }
    });
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  showSlide(currentIndex);
});
