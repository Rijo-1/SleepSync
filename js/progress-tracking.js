// Theme Toggle with localStorage persistence
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Chart Configuration
const chartConfig = {
    weeklyData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Hours of Sleep',
            data: [7.5, 8, 6.5, 7, 8.5, 9, 7.5],
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    qualityData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Sleep Quality (%)',
            data: [75, 82, 78, 85],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
        }]
    }
};

let weeklyChart = null;
let qualityChart = null;

function createCharts() {
    const weeklyChartCtx = document.getElementById('weeklyChart').getContext('2d');
    const qualityChartCtx = document.getElementById('qualityChart').getContext('2d');
    if (weeklyChart) weeklyChart.destroy();
    if (qualityChart) qualityChart.destroy();
    weeklyChart = new Chart(weeklyChartCtx, {
        type: 'line',
        data: chartConfig.weeklyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12,
                    grid: {
                        color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: { color: body.classList.contains('dark-mode') ? '#F9FAFB' : '#1F2937' }
                },
                x: {
                    grid: {
                        color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: { color: body.classList.contains('dark-mode') ? '#F9FAFB' : '#1F2937' }
                }
            }
        }
    });
    qualityChart = new Chart(qualityChartCtx, {
        type: 'line',
        data: chartConfig.qualityData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: { color: body.classList.contains('dark-mode') ? '#F9FAFB' : '#1F2937' }
                },
                x: {
                    grid: {
                        color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: { color: body.classList.contains('dark-mode') ? '#F9FAFB' : '#1F2937' }
                }
            }
        }
    });
}

function updateChartsTheme() {
    if (weeklyChart && qualityChart) {
        const isDark = body.classList.contains('dark-mode');
        const textColor = isDark ? '#F9FAFB' : '#1F2937';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        [weeklyChart, qualityChart].forEach(chart => {
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.plugins.legend.labels = { color: textColor };
            chart.update('none');
        });
    }
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    updateChartsTheme();
}

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

document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    createCharts();
    updateChartsTheme();
    themeToggle.addEventListener('click', () => {
        toggleTheme();
        updateChartsTheme();
    });
    loadJournalEntries();
});

// Journal Entry Functionality
const addEntryBtn = document.querySelector('.add-entry-btn');
const journalEntries = document.querySelector('.journal-entries');

function getMoodEmoji(mood) {
    switch (mood) {
        case 'Well Rested': return '😊';
        case 'Tired': return '😴';
        case 'Exhausted': return '😫';
        case 'Relaxed': return '😌';
        case 'Unsure': return '🤔';
        default: return '';
    }
}

function loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('sleepJournalEntries') || '[]');
    journalEntries.innerHTML = '';
    entries.forEach(entry => {
        const entryElement = createJournalEntry(entry);
        journalEntries.appendChild(entryElement);
    });
}

function saveJournalEntries() {
    const entries = [];
    document.querySelectorAll('.journal-card').forEach(card => {
        entries.push({
            id: card.dataset.id,
            date: card.querySelector('.journal-date').textContent,
            mood: card.querySelector('.mood-rating span').textContent,
            content: card.querySelector('textarea')?.value || card.querySelector('p')?.textContent
        });
    });
    localStorage.setItem('sleepJournalEntries', JSON.stringify(entries));
}

function createJournalEntry(entry = null) {
    const newEntry = document.createElement('div');
    const entryId = entry?.id || Date.now().toString();
    newEntry.className = 'journal-card fade-in';
    newEntry.dataset.id = entryId;
    const moodOptions = [
        { emoji: '😊', text: 'Well Rested' },
        { emoji: '😴', text: 'Tired' },
        { emoji: '😫', text: 'Exhausted' },
        { emoji: '😌', text: 'Relaxed' },
        { emoji: '🤔', text: 'Unsure' }
    ];
    newEntry.innerHTML = `
        <div class="journal-date">${entry?.date || new Date().toLocaleDateString()}</div>
        <div class="journal-content">
            <div class="mood-rating">
                <div class="mood-selector">
                    <span class="selected-mood">${entry ? `${getMoodEmoji(entry.mood)} ${entry.mood}` : '😊 Select Mood'}</span>
                    <div class="mood-dropdown">
                        ${moodOptions.map(mood => `
                            <div class="mood-option" data-mood="${mood.text}">
                                <span class="mood-emoji">${mood.emoji}</span>
                                <span class="mood-text">${mood.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${entry ? `<p>${entry.content}</p>` : `<textarea placeholder="How did you sleep?" rows="3"></textarea>`}
        </div>
        <button class="delete-entry" title="Delete entry">
            <i class="fas fa-trash"></i>
        </button>
    `;
    const moodSelector = newEntry.querySelector('.mood-selector');
    const selectedMood = moodSelector.querySelector('.selected-mood');
    const moodDropdown = moodSelector.querySelector('.mood-dropdown');
    moodSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        moodDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
        moodDropdown.classList.remove('show');
    });
    newEntry.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const mood = option.dataset.mood;
            const emoji = option.querySelector('.mood-emoji').textContent;
            selectedMood.textContent = `${emoji} ${mood}`;
            moodDropdown.classList.remove('show');
            saveJournalEntries();
        });
    });
    const deleteBtn = newEntry.querySelector('.delete-entry');
    deleteBtn.addEventListener('click', () => {
        newEntry.classList.remove('fade-in');
        newEntry.style.transition = 'opacity 0.3s';
        newEntry.style.opacity = '0';
        setTimeout(() => {
            newEntry.remove();
            saveJournalEntries();
        }, 300);
    });
    const textarea = newEntry.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('blur', () => {
            if (textarea.value.trim()) {
                const p = document.createElement('p');
                p.textContent = textarea.value;
                textarea.replaceWith(p);
                saveJournalEntries();
            }
        });
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textarea.blur();
            }
        });
    }
    return newEntry;
}

addEntryBtn.addEventListener('click', () => {
    const newEntry = createJournalEntry();
    journalEntries.insertBefore(newEntry, journalEntries.firstChild);
    saveJournalEntries();
});