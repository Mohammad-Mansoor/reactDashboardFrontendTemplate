window.addEventListener("DOMContentLoaded", () => {
  console.log("Splash renderer ready ✅");

  window.electronAPI.on("loading-progress", (value) => {
    console.log("Progress:", value);

    const progress = document.getElementById("progress");
    const percent = document.getElementById("percent");

    if (progress && percent) {
      progress.style.width = value + "%";
      percent.innerText = value + "%";
    }
  });
});