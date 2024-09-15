// Constants
const DEFAULT_DURATION = 3600000; // 1 hour in milliseconds
const DEFAULT_REMINDER_COLOR = "#ff0000";

const icons = {
  sleep: "icons/sleep.svg",
  pill: "icons/pill.svg",
  food: "icons/food.svg",
};

// Wallpaper list
const dayWallpapers = ["wallpapers/day0.jpg", "wallpapers/day1.jpg"];
const nightWallpapers = ["wallpapers/night0.jpg", "wallpapers/night1.jpg"];

let currentWallpaperIndex = 0;

// Reminders Data
let reminders = [];

// Comforts
let comforts = [];

// Global variables
var messageTimeout = null;
var clicks = 0;

// DOM Elements
const settingsButton = document.getElementById("settings");
const dashboard = document.getElementById("dashboard");
const closeDashboardBtn = document.getElementById("closeDashboardBtn");

// Utility Functions
function isDayTime() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 6 && hour < 18;
}

// Wallpaper Functions
function changeWallpaper() {
  let wallpapers = isDayTime() ? dayWallpapers : nightWallpapers;
  currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
  document.body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
}

// Clock Functions
function updateClock() {
  const clock = document.getElementById("clock");
  const day = document.getElementById("day");
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clock.textContent = `${hours}:${minutes}:${seconds}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  day.textContent = `${days[now.getDay()]}, ${now.toLocaleDateString("en-US", options)}`;

  // Period of Day
  const periodOfDay = document.getElementById("periodOfDay");
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    periodOfDay.textContent = "Morning";
  } else if (hour >= 12 && hour < 17) {
    periodOfDay.textContent = "Afternoon";
  } else if (hour >= 17 && hour < 21) {
    periodOfDay.textContent = "Evening";
  } else {
    periodOfDay.textContent = "Night";
  }
}

// Reminder Functions
function loadReminders() {
  const storedReminders = localStorage.getItem("reminders");
  if (storedReminders) {
    reminders = JSON.parse(storedReminders);
    console.log("Reminders loaded:", reminders);
  }
  // Check for reminders after loading
  checkReminders();
}

function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
  checkReminders();
}

function checkReminders() {
  const now = new Date();
  reminders.forEach((reminder) => {
    var hour = parseInt(reminder.time.split(":")[0]);
    var minute = parseInt(reminder.time.split(":")[1]);
    var startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
    );
    var endTime = new Date(
      startTime.getTime() + (reminder.duration || DEFAULT_DURATION),
    );
    if (startTime <= now && now <= endTime) {
      showMessage(reminder);
    }
  });
}

function showMessage(reminder) {
  const messageContainer = document.getElementById("messageContainer");
  const message = document.getElementById("message");
  const messageTime = document.getElementById("messageTime");
  const messageImage = document.getElementById("messageImage");
  const reminderTime = reminder.time.split(":");
  const timeStr = `${reminderTime[0]}:${reminderTime[1]}`;

  message.textContent = reminder.message;
  messageTime.textContent = `Due: ${timeStr}`;
  document.body.classList.add("message-shown");

  if (reminder.icon) {
    messageImage.src = icons[reminder.icon];
    messageImage.style.display = "block";
  } else {
    messageImage.style.display = "none";
  }

  // Flashing border?
  if (reminder.flashing) {
    messageContainer.classList.add("flashing");
  } else {
    messageContainer.classList.remove("flashing");
  }
  // Play sound?
  if (reminder.color) {
    messageContainer.style.backgroundColor = reminder.color;
  } else {
    messageContainer.style.backgroundColor = DEFAULT_REMINDER_COLOR;
  }

  // Hide after duration
  if (messageTimeout !== null) {
    clearTimeout(messageTimeout);
  }
  messageTimeout = setTimeout(() => {
    document.body.classList.remove("message-shown");
  }, reminder.duration || DEFAULT_DURATION);
}

// Comfort Functions
function loadComforts() {
  const storedComforts = localStorage.getItem("comforts");
  if (storedComforts) {
    comforts = JSON.parse(storedComforts);
    console.log("Comforts loaded:", comforts);
  } else {
    // If no comforts in local storage, initialize with default values
    comforts = [
      "You matter",
      "Thinking of you",
      "Sending a hug",
      "We care about you",
      "You are loved",
      "In our hearts",
    ];
    saveComforts();
  }
}

function saveComforts() {
  localStorage.setItem("comforts", JSON.stringify(comforts));
}

function showComfort() {
  const comfortEl = document.getElementById("comfortMessage");
  const index = Math.floor(Math.random() * comforts.length);
  const comfort_message = comforts[index];

  // Random position and angle -30 to 30 degrees
  const angle = Math.floor(Math.random() * 61) - 30;
  var x = Math.floor(Math.random() * 10);
  if (Math.random() < 0.5) x = x + 80;
  const y = Math.floor(Math.random() * 81);
  comfortEl.style.left = `${x}vw`;
  comfortEl.style.top = `${y}vh`;
  comfortEl.style.transform = `rotate(${angle}deg)`;

  comfortEl.innerHTML = comfort_message;
  comfortEl.style.display = "block";
  comfortEl.style.opacity = 1;

  setTimeout(() => {
    comfortEl.style.opacity = 0;

    setTimeout(() => {
      comfortEl.style.display = "none";
    }, 5000);
  }, 45000);
}

// Event Listeners
document.addEventListener("click", function () {
  clicks++;
  if (clicks >= 5) {
    settingsButton.style.display = "block";
  }
});

settingsButton.addEventListener("click", function () {
  dashboard.style.display = "block";
});

closeDashboardBtn.addEventListener("click", function () {
  dashboard.style.display = "none";
});

// Initialization
loadReminders();
loadComforts();
changeWallpaper();
updateClock();

// Intervals
setInterval(changeWallpaper, 15 * 60 * 1000); // Change wallpaper every 15 minutes
setInterval(updateClock, 1000); // Update clock every second
setInterval(checkReminders, 60000); // Check reminders every minute
setInterval(showComfort, 60000); // Show comfort message every minute
