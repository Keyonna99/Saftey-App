// ===== ELEMENT REFERENCES =====
const warning = document.getElementById("warning");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const movementBar = document.getElementById("movementBar");
const movementValue = document.getElementById("movementValue");
const sensitivitySlider = document.getElementById("sensitivitySlider");
const sensitivityValue = document.getElementById("sensitivityValue");

// ===== SETTINGS =====
let monitoring = false;
let movementThreshold = parseInt(sensitivitySlider.value);

// Display default slider value
sensitivityValue.textContent = movementThreshold;

// ===== SLIDER EVENT =====
sensitivitySlider.addEventListener("input", () => {
  movementThreshold = parseInt(sensitivitySlider.value);
  sensitivityValue.textContent = movementThreshold;
});

// ===== SHOW WARNING FUNCTION =====
function showWarning(message) {
  warning.textContent = message;
  warning.classList.remove("hidden");

  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate(300);
  }

  // Auto-hide warning after 2 seconds
  setTimeout(() => {
    warning.classList.add("hidden");
  }, 2000);
}

// ===== MOTION DETECTION =====
function handleMotion(event) {
  if (!monitoring) return;

  const x = event.acceleration?.x || 0;
  const y = event.acceleration?.y || 0;
  const z = event.acceleration?.z || 0;

  const movement = Math.abs(x) + Math.abs(y) + Math.abs(z);

  // Update movement meter
  let percent = Math.min(movement * 2, 100);
  movementBar.style.width = percent + "%";
  movementValue.textContent = movement.toFixed(2);

  // Change color + status
  if (percent < 40) {
    movementBar.style.background = "limegreen";
    statusText.textContent = "Calm";
  } else if (percent < 70) {
    movementBar.style.background = "orange";
    statusText.textContent = "Moderate Movement";
  } else {
    movementBar.style.background = "red";
    statusText.textContent = "High Activity";
  }

  // Trigger warning
  if (movement > movementThreshold) {
    showWarning("⚠️ High Movement Detected!");
  }
}

// ===== TILT DETECTION =====
function handleOrientation(event) {
  if (!monitoring) return;

  const beta = event.beta || 0;

  if (beta > 45) {
    showWarning("👀 Look Up! You're tilted downward.");
  }
}

// ===== START MONITORING =====
async function startMonitoring() {
  // iPhone permission check
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    try {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission !== "granted") {
        alert("Permission denied for motion sensors.");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  monitoring = true;
  statusText.textContent = "Monitoring...";
  startBtn.style.display = "none";

  window.addEventListener("devicemotion", handleMotion);
  window.addEventListener("deviceorientation", handleOrientation);
}

// ===== BUTTON EVENT =====
startBtn.addEventListener("click", startMonitoring);