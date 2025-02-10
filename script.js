// Login Function
function checkLogin() {
    const accessCode = document.getElementById("accessCode").value;
    if (accessCode === "010625") {
        window.location.href = "logs.html";
    } else {
        document.getElementById("error-message").innerText = "Mali ka BOBO!";
    }
}

// Fetch and Display Logs
document.addEventListener("DOMContentLoaded", function () {
    const logContainer = document.getElementById("logContainer");

    if (logContainer) {
        fetch("/logs")
            .then(response => response.json())
            .then(data => {
                logContainer.innerHTML = "";
                data.forEach(log => {
                    const logElement = document.createElement("div");
                    logElement.innerHTML = `
                        <p>${log.text}</p>
                        <p>${log.date}</p>
                        <button onclick="deleteLog(${log.id})">Delete This Log</button>
                    `;
                    logContainer.appendChild(logElement);
                });
            })
            .catch(error => console.error("Error fetching logs:", error));
    }
});

// Delete Log
function deleteLog(logId) {
    fetch(`/delete-log/${logId}`, { method: "DELETE" })
        .then(() => location.reload())
        .catch(error => console.error("Error deleting log:", error));
}

// Delete All Logs
function deleteAllLogs() {
    if (!confirm("Are you sure you want to delete all logs?")) return;

    fetch("/delete-all-logs", { method: "DELETE" })
        .then(() => {
            document.getElementById("logContainer").innerHTML = "";
            alert("All logs deleted.");
        })
        .catch(error => console.error("Error deleting all logs:", error));
}
// Login Function
function checkLogin() {
    const accessCode = document.getElementById("accessCode").value;
    const errorMessage = document.getElementById("error-message");

    if (accessCode === "010625") {
        window.location.href = "logs.html";
    } else {
        errorMessage.innerText = "Mali ka bobo";
        errorMessage.style.color = "red"; // Ensure it's red
    }
}
const API_BASE = "http://localhost:3000"; // Ensure this is correct

function saveLog() {
    const text = document.getElementById("logText").value;
    const images = document.getElementById("logImages").files;
    const formData = new FormData();
    formData.append("text", text);
    formData.append("date", new Date().toISOString());

    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
    }

    fetch(`${API_BASE}/add-log`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(() => {
        alert("Log saved!");
        window.location.href = "all-logs.html"; // Redirect to logs
    })
    .catch(error => console.error("Error saving log:", error));
}
// Load logs from LocalStorage
document.addEventListener("DOMContentLoaded", function () {
    const logContainer = document.getElementById("logContainer");
    if (logContainer) {
        displayLogs();
    }
});

// Save new log to LocalStorage
function saveLog() {
    const text = document.getElementById("logText").value;
    const images = document.getElementById("logImages").files;
    const logs = JSON.parse(localStorage.getItem("logs")) || [];

    // Convert images to Base64
    const imageArray = [];
    if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            const reader = new FileReader();
            reader.readAsDataURL(images[i]);
            reader.onload = function () {
                imageArray.push(reader.result);
                if (imageArray.length === images.length) {
                    addLog(text, imageArray, logs);
                }
            };
        }
    } else {
        addLog(text, imageArray, logs);
    }
}

function addLog(text, images, logs) {
    const newLog = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleString(),
        images: images
    };

    logs.push(newLog);
    localStorage.setItem("logs", JSON.stringify(logs));
    alert("Log saved!");
    window.location.href = "logs.html";
}

// Display logs
function displayLogs() {
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    const logContainer = document.getElementById("logContainer");
    logContainer.innerHTML = "";

    logs.forEach(log => {
        const logElement = document.createElement("div");
        logElement.className = "log-item";
        logElement.innerHTML = `
            <p>${log.text}</p>
            <p>${log.date}</p>
            <div class="image-container">
                ${log.images.map(img => `<img src="${img}" class="log-image">`).join("")}
            </div>
            <button class="delete-btn" onclick="deleteLog(${log.id})">Delete This Log</button>
        `;
        logContainer.appendChild(logElement);
    });
}

// Delete a single log
function deleteLog(logId) {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs = logs.filter(log => log.id !== logId);
    localStorage.setItem("logs", JSON.stringify(logs));
    displayLogs();
}

// Delete all logs
function deleteAllLogs() {
    if (confirm("Are you sure you want to delete all logs?")) {
        localStorage.removeItem("logs");
        displayLogs();
    }
}
