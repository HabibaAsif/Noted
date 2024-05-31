const inputBox = document.getElementById("input-box");
const addButton = document.getElementById("add-btn");
const list = document.getElementById("list-container");
const searchButton = document.getElementById("search-btn");
const themeToggleButton = document.getElementById("theme-toggle");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        list.appendChild(li);
        inputBox.value = '';
        let span = document.createElement("span");
        span.innerHTML = "x";
        li.appendChild(span);
        saveData();
        updateTaskCount();
        updateBadge();
    }
}
function updateBadge() {
    const remainingTasks = document.querySelectorAll('li:not(.checked)').length;
    chrome.action.setBadgeText({ text: remainingTasks > 0 ? remainingTasks.toString() : '' });
}
function searchTasks() {
    const searchValue = inputBox.value.trim().toLowerCase();
    const tasks = list.getElementsByTagName("li");
    for (const task of tasks) {
        const taskName = task.innerHTML.toLowerCase();
        if (taskName.includes(searchValue)) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    }
}

list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
    updateTaskCount();
    updateBadge();
});

addButton.addEventListener("click", addTask);
searchButton.addEventListener("click", searchTasks);

function saveData() {
    localStorage.setItem("data", list.innerHTML);
}

function showTask() {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        list.innerHTML = savedData;
    }
    updateTaskCount();
    updateBadge();
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// Load theme from local storage or system preference
function loadTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        document.body.classList.toggle("dark", storedTheme === "dark");
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle("dark", prefersDark);
    }
    themeToggleButton.checked = document.body.classList.contains("dark");
}

themeToggleButton.addEventListener("click", toggleTheme);

function updateTaskCount() {
    const completedTasks = document.querySelectorAll('li.checked').length;
    const totalTasks = document.querySelectorAll('li').length;
    const remainingTasks = totalTasks - completedTasks;

    document.getElementById('completed-task-count').textContent = completedTasks;
    document.getElementById('remaining-task-count').textContent = remainingTasks;
}

window.addEventListener("load", () => {
    loadTheme();
    showTask();
    updateBadge();
});
