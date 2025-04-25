// Theme Toggle with localStorage persistence
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to toggle theme
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Apply saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.add('fa-sun');
        icon.classList.remove('fa-moon');
    }
}

// Initialize theme
applySavedTheme();

// Add click event listener
themeToggle.addEventListener('click', toggleTheme);

// Save Schedule Functionality
const saveScheduleBtn = document.querySelector('.save-schedule');
const scheduleInputs = {
    weekdayBedtime: document.getElementById('weekday-bedtime'),
    weekdayWaketime: document.getElementById('weekday-waketime'),
    weekendBedtime: document.getElementById('weekend-bedtime'),
    weekendWaketime: document.getElementById('weekend-waketime')
};

saveScheduleBtn.addEventListener('click', () => {
    const schedule = {
        weekday: {
            bedtime: scheduleInputs.weekdayBedtime.value,
            waketime: scheduleInputs.weekdayWaketime.value
        },
        weekend: {
            bedtime: scheduleInputs.weekendBedtime.value,
            waketime: scheduleInputs.weekendWaketime.value
        }
    };

    // Validate inputs
    if (!validateSchedule(schedule)) {
        showNotification('Please fill in all time fields');
        return;
    }

    // Save to localStorage
    localStorage.setItem('sleepSchedule', JSON.stringify(schedule));
    showNotification('Schedule saved successfully!');
});

// Load saved schedule
function loadSavedSchedule() {
    const savedSchedule = localStorage.getItem('sleepSchedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        scheduleInputs.weekdayBedtime.value = schedule.weekday.bedtime;
        scheduleInputs.weekdayWaketime.value = schedule.weekday.waketime;
        scheduleInputs.weekendBedtime.value = schedule.weekend.bedtime;
        scheduleInputs.weekendWaketime.value = schedule.weekend.waketime;
    }
}

// Validation helper
function validateSchedule(schedule) {
    return schedule.weekday.bedtime && 
           schedule.weekday.waketime && 
           schedule.weekend.bedtime && 
           schedule.weekend.waketime;
}

// Notification helper
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedSchedule();
});

// Handle reminder toggles
const reminderToggles = document.querySelectorAll('.toggle input');
reminderToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        const reminderType = e.target.closest('.preference-card').querySelector('h3').textContent;
        if (isEnabled) {
            showNotification(`${reminderType} enabled`);
        } else {
            showNotification(`${reminderType} disabled`);
        }
    });
});