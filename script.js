// Selecting elements from the DOM
const taskForm = document.getElementById('taskForm');
const taskTable = document.getElementById('taskTable').querySelector('tbody');
const analyzeButton = document.getElementById('analyzeButton');
const analysisResult = document.getElementById('analysisResult');

// Function to add a task to the table
document.getElementById('addTaskButton').addEventListener('click', function(event) {
    // Your existing code to handle the task addition
	
    // Trigger confetti
    confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 }
    });
});

function addTaskToTable(task, taskId) {
	const row = document.createElement('tr');
	row.innerHTML = `
		<td>${task.time}</td>
		<td>${task.description}</td>
		<td>${task.urgent ? 'Yes' : 'No'}</td>
		<td>${task.important ? 'Yes' : 'No'}</td>
		<td>
			<button onclick="editTask(${taskId})">Edit</button>
			<button onclick="deleteTask(${taskId})">Delete</button>
		</td>
	`;
	taskTable.appendChild(row);
}

// Function to handle form submission
taskForm.onsubmit = function(event) {
    // Preventing the default form submission behavior
    event.preventDefault();

    // Creating a task object based on form inputs
    const task = {
		date: document.getElementById('dateInput').value,
        time: document.getElementById('timeInput').value,
        description: document.getElementById('task').value,
        urgent: document.getElementById('urgent').checked,
        important: document.getElementById('important').checked
    };

    // Adding the task to the table
    addTaskToTable(task);

    // Storing the task in local storage (to be implemented)
	storeTask(task);
};

// Function to calculate the Eisenhower matrix (to be implemented)

// Function to handle the 'Analyze Day' button click (to be implemented)
// Additional JavaScript code to extend the basic functionality

// Function to get tasks from local storage
function getStoredTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to store tasks in local storage
function storeTask(task) {
    const tasks = getStoredTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Modifying the form submission handler to store tasks
taskForm.onsubmit = function(event) {
    event.preventDefault();

    const task = {
        time: document.getElementById('timeInput').value,
        description: document.getElementById('task').value,
        urgent: document.getElementById('urgent').checked,
        important: document.getElementById('important').checked
    };

    addTaskToTable(task);
    storeTask(task); // Storing the task in local storage of the app
};

// Function to calculate and display the Eisenhower matrix
function calculateMatrix() {
    const tasks = getStoredTasks();
    let matrix = { urgentImportant: 0, urgentNotImportant: 0, notUrgentImportant: 0, notUrgentNotImportant: 0 };

    tasks.forEach(task => {
        if (task.urgent && task.important) matrix.urgentImportant++;
        else if (task.urgent && !task.important) matrix.urgentNotImportant++;
        else if (!task.urgent && task.important) matrix.notUrgentImportant++;
        else matrix.notUrgentNotImportant++;
    });

    analysisResult.innerHTML = `
        Urgent & Important: ${matrix.urgentImportant}<br>
        Urgent & Not Important: ${matrix.urgentNotImportant}<br>
        Not Urgent & Important: ${matrix.notUrgentImportant}<br>
        Not Urgent & Not Important: ${matrix.notUrgentNotImportant}
    `;
}

// Adding event listener to the 'Analyze Day' button
analyzeButton.addEventListener('click', calculateMatrix);

// Function to check and reset tasks daily
function dailyReset() {
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();

    if (lastReset !== today) {
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('lastReset', today);
        taskTable.innerHTML = ''; // Clearing the table
    }
}

// Function to perform a weekly analysis (to be implemented)
// ...

// Calling dailyReset on page load to check if a reset is needed
dailyReset();

// Loading tasks from local storage on page load
window.onload = function() {
    const tasks = getStoredTasks();
    tasks.forEach(task => addTaskToTable(task));
};

// JavaScript enhancements for theme toggle and delete/edit functionalities

// Theme toggle functionality
// const themeToggle = document.getElementById('themeToggle');
// themeToggle.onclick = function() {
    // if (document.body.getAttribute('data-theme') === 'dark') {
        // document.body.removeAttribute('data-theme');
    // } else {
        // document.body.setAttribute('data-theme', 'dark');
    // }
// };
document.getElementById('theme-toggle-checkbox').addEventListener('change', function() {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
});



// Function to delete a task
function deleteTask(taskId) {
    let tasks = getStoredTasks();
    tasks.splice(taskId, 1); // Remove the task with the given taskId
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage
    loadTasks(); // Reload tasks to update the table
}

// Function to load and display tasks from local storage
function loadTasks() {
    taskTable.innerHTML = ''; // Clear current tasks
    const tasks = getStoredTasks();
    tasks.forEach((task, index) => addTaskToTable(task, index));
}

// Function to edit a task
function editTask(taskId) {
    let tasks = getStoredTasks();
    let taskToEdit = tasks[taskId];

    // Set form values to the ones from taskToEdit
    document.getElementById('time').value = taskToEdit.time;
    document.getElementById('task').value = taskToEdit.description;
    document.getElementById('urgent').checked = taskToEdit.urgent;
    document.getElementById('important').checked = taskToEdit.important;

    // Update the form submission handler to edit the task
    taskForm.onsubmit = function(event) {
        event.preventDefault();

        // Update task details
        taskToEdit.time = document.getElementById('time').value;
        taskToEdit.description = document.getElementById('task').value;
        taskToEdit.urgent = document.getElementById('urgent').checked;
        taskToEdit.important = document.getElementById('important').checked;

        // Update tasks in local storage and reload tasks
        tasks[taskId] = taskToEdit;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();

        // Reset form submission handler to default
        taskForm.onsubmit = addTask;
    };
}

document.getElementById('bannerImage').addEventListener('click', function() {
    document.getElementById('taskManagerContent').style.display = 'block'; // Show the task manager content
    this.style.display = 'none'; // Hide the banner image
});

// Adjust addTask function to reset form submission handler after adding a task
function addTask(event) {
    // Existing code to add a task...

    // Reset form submission handler
    taskForm.onsubmit = addTask;
}

// Call loadTasks on window load to display stored tasks
window.onload = loadTasks;

function downloadTasksAsText() {
    const tasks = getStoredTasks(); // Assuming this function fetches your tasks
    let taskData = "Time, Task, Urgent?, Important?\n"; // Column headers

    tasks.forEach(task => {
        taskData += `${task.time}, ${task.description}, ${task.urgent ? 'Yes' : 'No'}, ${task.important ? 'Yes' : 'No'}\n`;
    });

    // Create a blob and trigger the download
    const blob = new Blob([taskData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tasks.txt';
    link.click();
    URL.revokeObjectURL(link.href);
}
function downloadTasksAsExcel() {
    const tasks = getStoredTasks(); // Fetch tasks
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Generate an Excel file and trigger the download
    XLSX.writeFile(workbook, 'tasks.xlsx');
}



document.addEventListener('DOMContentLoaded', function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('dateInput').value = today;
});

document.addEventListener('DOMContentLoaded', function() {
    var now = new Date();
    var hour = now.getHours();
    var roundedHour = hour.toString().padStart(2, '0'); // Ensure it's two digits

    var timeValue = roundedHour + ':00'; // Setting minutes to '00'
    document.getElementById('timeInput').value = timeValue;
});

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    // Perform operations after sign-in here.
    // ...
}
function init() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}

document.getElementById('analyzeButton').addEventListener('click', function() {
    const tasks = getStoredTasks(); // Replace this with your method of getting tasks
    const matrix = { 
        urgentImportant: [], 
        urgentNotImportant: [], 
        notUrgentImportant: [], 
        notUrgentNotImportant: [] 
    };

    tasks.forEach(task => {
        if (task.urgent && task.important) matrix.urgentImportant.push(task);
        else if (task.urgent && !task.important) matrix.urgentNotImportant.push(task);
        else if (!task.urgent && task.important) matrix.notUrgentImportant.push(task);
        else matrix.notUrgentNotImportant.push(task);
    });

    displayEisenhowerMatrix(matrix);
});

function displayEisenhowerMatrix(matrix) {
    const container = document.getElementById('eisenhowerMatrix');
    container.innerHTML = '';

    const quadrants = [
        { name: 'Urgent & Important', tasks: matrix.urgentImportant },
        { name: 'Urgent & Not Important', tasks: matrix.urgentNotImportant },
        { name: 'Not Urgent & Important', tasks: matrix.notUrgentImportant },
        { name: 'Not Urgent & Not Important', tasks: matrix.notUrgentNotImportant }
    ];

    quadrants.forEach(quadrant => {
        const div = document.createElement('div');
        div.className = 'matrix-quadrant';
        div.innerHTML = `<strong>${quadrant.name}</strong><ul>${quadrant.tasks.map(task => `<li>${task.description}</li>`).join('')}</ul>`;
        container.appendChild(div);
    });
}
