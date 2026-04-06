// Global media + image protection

// Disable right-click + long-press on protected images
document.addEventListener("contextmenu", function (e) {
  if (e.target.closest(".image-wrapper")) {
    e.preventDefault();
  }
});

document.addEventListener(
  "touchstart",
  function (e) {
    if (e.target.closest(".image-wrapper")) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Ensure all videos are muted + try to autoplay
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("video").forEach((v) => {
    v.muted = true;
    v.play().catch(() => {});
  });
});
