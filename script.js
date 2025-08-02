let classRoutine = {};

async function loadClassRoutine() {
    try {
        const response = await fetch('classRoutine.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        classRoutine = await response.json();
        console.log('Class routine loaded successfully');
        // Initialize the page after data is loaded
        initializePage();
    } catch (error) {
        console.error('Error loading class routine:', error);
        // Fallback: show error message
        document.getElementById('scheduleContent').innerHTML = 
            '<div class="no-classes">Error loading class schedule. Please check if classRoutine.json file exists.</div>';
    }
}
function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
}
function displayCurrentDay() {
    const currentDay = getCurrentDay();
    const dayName = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
    const currentDayElement = document.getElementById('currentDay');
    if (currentDayElement) {
        currentDayElement.textContent = `Today is ${dayName}`;
    }
}
function showDay(day) {
    if (!classRoutine || Object.keys(classRoutine).length === 0) {
        console.error('Class routine data not loaded yet');
        return;
    }
    const buttons = document.querySelectorAll('.day-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
    } else {
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase() === day) {
                btn.classList.add('active');
            }
        });
    }

    const dayData = classRoutine[day];
    const dayTitle = document.getElementById('dayTitle');
    const scheduleContent = document.getElementById('scheduleContent');

    if (!dayData) {
        console.error(`No data found for day: ${day}`);
        return;
    }

    dayTitle.textContent = dayData.day;

    if (dayData.offDay) {
        const reason = dayData.reason || "Off Day - No Classes Today!";
        scheduleContent.innerHTML = `<div class="off-day">🎉 ${reason} 🎉</div>`;
    } else if (dayData.classes && dayData.classes.length > 0) {
        let classesHTML = '';
        dayData.classes.forEach(classItem => {
            classesHTML += `
                <div class="class-item">
                    <div class="class-time">${classItem.time}</div>
                    <div class="class-subject">${classItem.subject}</div>
                    <div class="class-teacher">Teacher: ${classItem.teacher}</div>
                    <div class="class-room">📍 ${classItem.room}</div>
                </div>
            `;
        });
        scheduleContent.innerHTML = classesHTML;
    } else {
        scheduleContent.innerHTML = '<div class="no-classes">No classes scheduled for this day</div>';
    }
}
function initializePage() {
    displayCurrentDay();
    
    const currentDay = getCurrentDay();
    showDay(currentDay);
}
document.addEventListener('DOMContentLoaded', function() {
    loadClassRoutine();
});
setInterval(displayCurrentDay, 60000);