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

// Sleep Calculator
const calculateBtn = document.querySelector('.calculate-btn');
const sleepResults = document.getElementById('sleep-results');

calculateBtn.addEventListener('click', () => {
    const wakeTime = document.getElementById('wake-time').value;
    const sleepDuration = document.getElementById('sleep-duration').value;

    if (!wakeTime || !sleepDuration) {
        alert('Please fill in all fields');
        return;
    }

    // Calculate optimal bedtime
    const wakeDateTime = new Date(`2024-01-01T${wakeTime}`);
    const bedDateTime = new Date(wakeDateTime.getTime() - (sleepDuration * 60 * 60 * 1000));
    
    const bedTime = bedDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    sleepResults.innerHTML = `
        <div class="result-card">
            <h3>Your Optimal Sleep Schedule</h3>
            <p>Bedtime: ${bedTime}</p>
            <p>Wake time: ${wakeDateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}</p>
            <p>Sleep duration: ${sleepDuration} hours</p>
        </div>
    `;
});

// Sample Sleep Data Chart
const ctx = document.getElementById('sleepChart').getContext('2d');
const sleepChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Hours of Sleep',
            data: [7.5, 6.8, 8.2, 7.0, 6.5, 8.5, 9.0],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 12,
                ticks: {
                    stepSize: 2
                }
            }
        }
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});