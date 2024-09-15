document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const remindersTable = document.getElementById("remindersTable");
  const addReminderBtn = document.getElementById("addReminderBtn");
  const reminderFormModal = document.getElementById("reminderFormModal");
  const reminderForm = document.getElementById("reminderForm");
  const modalBackground = document.querySelector(".modal-background");
  const closeModalBtns = document.querySelectorAll(
    ".modal-close, .cancel-button",
  );

  // State variables
  let reminders = [];
  let isEditing = false;
  let editingIndex = null;

  // Functions for managing reminders
  function loadReminders() {
    const storedReminders = localStorage.getItem("reminders");
    if (storedReminders) {
      reminders = JSON.parse(storedReminders);
      renderReminders();
    }
  }

  function renderReminders() {
    remindersTable.innerHTML = "";
    reminders.forEach((reminder, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${reminder.time}</td>
        <td>${reminder.message}</td>
        <td>${reminder.duration ? Math.round(reminder.duration / 60000) : ""}</td>
        <td>${reminder.icon || ""}</td>
        <td>${reminder.flashing ? "Yes" : "No"}</td>
        <td>${reminder.color || ""}</td>
        <td>
          <button class="button is-small is-info edit-button" data-index="${index}">Edit</button>
          <button class="button is-small is-danger delete-button" data-index="${index}">Delete</button>
        </td>
      `;

      remindersTable.appendChild(row);
    });
  }

  function updateRemindersInStorage() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
  }

  // Functions for managing the reminder form modal
  function showReminderForm() {
    reminderForm.reset();
    isEditing = false;
    editingIndex = null;
    reminderFormModal.classList.add("is-active");
  }

  function hideReminderForm() {
    reminderFormModal.classList.remove("is-active");
  }

  // Functions for editing and deleting reminders
  function editReminder(index) {
    const reminder = reminders[index];
    isEditing = true;
    editingIndex = index;

    reminderForm.time.value = reminder.time;
    reminderForm.message.value = reminder.message;
    reminderForm.duration.value = reminder.duration
      ? Math.round(reminder.duration / 60000)
      : "";
    reminderForm.icon.value = reminder.icon || "";
    reminderForm.flashing.checked = reminder.flashing;
    reminderForm.color.value = reminder.color || "";

    reminderFormModal.classList.add("is-active");
  }

  function deleteReminder(index) {
    if (confirm("Are you sure you want to delete this reminder?")) {
      reminders.splice(index, 1);
      updateRemindersInStorage();
    }
  }

  // Function for saving reminders
  function saveReminder(event) {
    event.preventDefault();

    const formData = new FormData(reminderForm);
    const newReminder = {
      time: formData.get("time"),
      message: formData.get("message"),
      duration: parseInt(formData.get("duration")) * 60000 || null, // Convert minutes to milliseconds
      icon: formData.get("icon") || null,
      flashing: formData.get("flashing") === "on",
      color: formData.get("color") || null,
    };

    if (isEditing && editingIndex !== null) {
      reminders[editingIndex] = newReminder;
    } else {
      reminders.push(newReminder);
    }

    updateRemindersInStorage();
    hideReminderForm();
  }

  // Event Listeners
  addReminderBtn.addEventListener("click", showReminderForm);
  closeModalBtns.forEach((btn) =>
    btn.addEventListener("click", hideReminderForm),
  );
  modalBackground.addEventListener("click", hideReminderForm);
  reminderForm.addEventListener("submit", saveReminder);

  remindersTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-button")) {
      const index = event.target.dataset.index;
      editReminder(index);
    } else if (event.target.classList.contains("delete-button")) {
      const index = event.target.dataset.index;
      deleteReminder(index);
    }
  });

  // Initial load
  loadReminders();
});
