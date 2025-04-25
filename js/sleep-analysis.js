// Theme Toggle and initial declarations
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const calculateBtn = document.querySelector('.calculate-btn');
const cycleResults = document.getElementById('cycle-results');

// Mode toggle setup
const modeButtons = document.querySelectorAll('.mode-btn');
const bedtimeInput = document.getElementById('bedtime-input');
const waketimeInput = document.getElementById('waketime-input');
let currentMode = 'bedtime';

// Function to toggle theme
function toggleTheme() {
    body.classList.toggle('dark-mode');
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
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize theme
applySavedTheme();

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Mode toggle event listeners
modeButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        
        if (currentMode === 'bedtime') {
            bedtimeInput.classList.remove('hidden');
            waketimeInput.classList.add('hidden');
        } else {
            bedtimeInput.classList.add('hidden');
            waketimeInput.classList.remove('hidden');
        }
    });
});

function calculateSchedule() {
    if (currentMode === 'bedtime') {
        calculateWakeTimes();
    } else {
        calculateBedTimes();
    }
}

function calculateWakeTimes() {
    const bedtime = document.getElementById('bedtime').value;
    const cycles = parseInt(document.getElementById('cycles').value);

    if (!bedtime || !cycles) {
        showNotification('Please fill in all fields');
        return;
    }

    const bedDateTime = new Date(`2024-01-01T${bedtime}`);
    bedDateTime.setMinutes(bedDateTime.getMinutes() + 14);
    
    const wakeTimes = [];
    let totalSleepTime = 0;
    
    for (let i = 1; i <= cycles; i++) {
        const wakeTime = new Date(bedDateTime.getTime() + (i * 90 * 60 * 1000));
        totalSleepTime = i * 90;
        
        wakeTimes.push({
            cycle: i,
            time: wakeTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            quality: getSleepQuality(totalSleepTime)
        });
    }

    displayResults(wakeTimes, totalSleepTime);
}

function calculateBedTimes() {
    const waketime = document.getElementById('waketime').value;
    const cycles = parseInt(document.getElementById('cycles').value);

    if (!waketime || !cycles) {
        showNotification('Please fill in all fields');
        return;
    }

    const wakeDateTime = new Date(`2024-01-01T${waketime}`);
    const totalSleepMinutes = cycles * 90;
    const bedDateTime = new Date(wakeDateTime.getTime() - (totalSleepMinutes * 60 * 1000) - (14 * 60 * 1000));
    
    const bedTime = bedDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    displayResults([{
        cycle: cycles,
        time: waketime,
        bedtime: bedTime,
        quality: getSleepQuality(totalSleepMinutes)
    }], totalSleepMinutes);
}

function getSleepQuality(minutes) {
    if (minutes < 270) return 'Not Enough Sleep';
    if (minutes < 360) return 'Minimum Sleep';
    if (minutes < 480) return 'Good Sleep';
    return 'Optimal Sleep';
}

function calculateSleepScore(cycles) {
    const totalMinutes = cycles * 90;
    if (totalMinutes < 270) return 40;
    if (totalMinutes < 360) return 60;
    if (totalMinutes < 480) return 80;
    return 100;
}

function displayResults(wakeTimes, totalSleepTime) {
    const sleepScore = calculateSleepScore(wakeTimes.length);
    
    cycleResults.innerHTML = `
        <div class="sleep-score-container">
            <div class="sleep-score">
                <svg class="progress-ring" width="120" height="120">
                    <circle class="progress-ring-circle" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
                </svg>
                <div class="sleep-score-text">
                    <span class="score">0</span>
                    <span class="label">Sleep Score</span>
                </div>
            </div>
        </div>
        <div class="summary-card">
            ${currentMode === 'bedtime' 
                ? `You'll sleep for ${Math.floor(totalSleepTime/60)}h ${totalSleepTime%60}m and wake up at ${wakeTimes[wakeTimes.length-1].time}`
                : `Go to bed at ${wakeTimes[0].bedtime} to wake up at ${wakeTimes[0].time}`
            }
        </div>
        <div class="wake-times">
            ${wakeTimes.map(({ cycle, time, quality }) => `
                <div class="wake-time-card" onclick="selectWakeTime('${time}')">
                    <span class="cycle-number">Cycle ${cycle}</span>
                    <span class="time">${time}</span>
                    <span class="quality-indicator ${quality.toLowerCase().replace(' ', '-')}">${quality}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    setTimeout(() => updateSleepScore(sleepScore), 100);
}

function updateSleepScore(score) {
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    document.querySelector('.score').textContent = score;
}

function selectWakeTime(time) {
    const cards = document.querySelectorAll('.wake-time-card');
    cards.forEach(card => {
        if (card.querySelector('.time').textContent === time) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    showNotification(`Wake time set to ${time}`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add event listener for calculate button
calculateBtn.addEventListener('click', calculateSchedule);