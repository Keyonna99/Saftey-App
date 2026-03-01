const warning = document.getElementById("warning");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const emergencyBtn = document.getElementById("emergencyBtn");

let monitoring = false;

function showWarning(message) {
  warning.textContent = message;
  warning.classList.remove("hidden");

  if (navigator.vibrate) {
    navigator.vibrate(500);
  }

  setTimeout(() => {
    warning.classList.add("hidden");
  }, 3000);
}

function startMonitoring() {
  if (monitoring) return;

  monitoring = true;
  statusText.textContent = "Monitoring active...";

  // Motion Detection
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", (event) => {
      const acc = event.accelerationIncludingGravity;

      if (acc) {
        const movement = Math.abs(acc.x) + Math.abs(acc.y);

        if (movement > 30) {
          showWarning("⚠️ Sudden movement detected!");
        }
      }
    });
  }

  // Tilt Detection
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      const beta = event.beta;

      if (beta > 45) {
        showWarning("⚠️ LOOK UP — You're looking down!");
      }
    });
  }
}

startBtn.addEventListener("click", () => {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          startMonitoring();
        }
      })
      .catch(console.error);
  } else {
    startMonitoring();
  }
});

emergencyBtn.addEventListener("click", () => {
  showWarning("🚨 Emergency Alert Activated!");
  alert("Emergency alert triggered (simulation).");
});