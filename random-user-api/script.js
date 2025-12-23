// Random User API
const API_URL = 'https://randomuser.me/api/';

// Store all users
let allUsers = [];

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const userCountSelect = document.getElementById('userCount');
const genderSelect = document.getElementById('gender');
const cardsView = document.getElementById('cardsView');
const tableView = document.getElementById('tableView');
const tableBody = document.getElementById('tableBody');
const toggleBtns = document.querySelectorAll('.toggle-btn');

// Stats elements
const totalCountEl = document.getElementById('totalCount');
const maleCountEl = document.getElementById('maleCount');
const femaleCountEl = document.getElementById('femaleCount');

// Event Listeners
generateBtn.addEventListener('click', generateUsers);
clearBtn.addEventListener('click', clearAllUsers);

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
    });
});

// Generate Random Users
async function generateUsers() {
    const count = userCountSelect.value;
    const gender = genderSelect.value;
    
    showLoading();

    try {
        let url = `${API_URL}?results=${count}`;
        if (gender) {
            url += `&gender=${gender}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            allUsers = [...allUsers, ...data.results];
            displayUsers();
            updateStats();
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        showError();
    }
}

// Display users in current view
function displayUsers() {
    const activeView = document.querySelector('.toggle-btn.active').dataset.view;
    
    if (activeView === 'cards') {
        displayCardsView();
    } else {
        displayTableView();
    }
}

// Display Cards View
function displayCardsView() {
    if (allUsers.length === 0) {
        cardsView.innerHTML = '<div class="info-message">No users yet. Click "Generate Users" to add contacts</div>';
        return;
    }

    cardsView.innerHTML = allUsers.map((user, index) => {
        return `
            <div class="user-card">
                <div class="card-header">
                    <img src="${user.picture.large}" alt="${user.name.first}" class="user-photo">
                    <div class="user-name">${user.name.title} ${user.name.first} ${user.name.last}</div>
                    <div class="user-username">@${user.login.username}</div>
                </div>
                <div class="card-body">
                    <div class="user-detail">
                        <span class="detail-icon">📧</span>
                        <div class="detail-content">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">${user.email}</div>
                        </div>
                    </div>
                    <div class="user-detail">
                        <span class="detail-icon">📱</span>
                        <div class="detail-content">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${user.phone}</div>
                        </div>
                    </div>
                    <div class="user-detail">
                        <span class="detail-icon">📍</span>
                        <div class="detail-content">
                            <div class="detail-label">Location</div>
                            <div class="detail-value">${user.location.city}, ${user.location.country}</div>
                        </div>
                    </div>
                    <div class="user-detail">
                        <span class="detail-icon">🎂</span>
                        <div class="detail-content">
                            <div class="detail-label">Age</div>
                            <div class="detail-value">${user.dob.age} years old</div>
                        </div>
                    </div>
                    <div class="user-detail">
                        <span class="detail-icon">${user.gender === 'male' ? '👨' : '👩'}</span>
                        <div class="detail-content">
                            <div class="detail-label">Gender</div>
                            <div class="detail-value">${capitalizeFirst(user.gender)}</div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="delete-btn" onclick="deleteUser(${index})">🗑️ Remove</button>
                </div>
            </div>
        `;
    }).join('');
}

// Display Table View
function displayTableView() {
    if (allUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="info-message">No users yet. Click "Generate Users" to add contacts</td></tr>';
        return;
    }

    tableBody.innerHTML = allUsers.map((user, index) => {
        return `
            <tr>
                <td><img src="${user.picture.thumbnail}" alt="${user.name.first}" class="table-photo"></td>
                <td><strong>${user.name.title} ${user.name.first} ${user.name.last}</strong></td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.location.city}, ${user.location.state}, ${user.location.country}</td>
                <td>${user.dob.age}</td>
                <td>${capitalizeFirst(user.gender)}</td>
                <td><button class="table-delete-btn" onclick="deleteUser(${index})">Delete</button></td>
            </tr>
        `;
    }).join('');
}

// Delete User
function deleteUser(index) {
    if (confirm('Are you sure you want to remove this contact?')) {
        allUsers.splice(index, 1);
        displayUsers();
        updateStats();
    }
}

// Clear All Users
function clearAllUsers() {
    if (allUsers.length === 0) {
        alert('No contacts to clear!');
        return;
    }

    if (confirm('Are you sure you want to clear all contacts?')) {
        allUsers = [];
        displayUsers();
        updateStats();
    }
}

// Switch View
function switchView(view) {
    // Update toggle buttons
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Update views
    if (view === 'cards') {
        cardsView.classList.add('active-view');
        tableView.classList.remove('active-view');
    } else {
        tableView.classList.add('active-view');
        cardsView.classList.remove('active-view');
    }

    displayUsers();
}

// Update Statistics
function updateStats() {
    const total = allUsers.length;
    const males = allUsers.filter(user => user.gender === 'male').length;
    const females = allUsers.filter(user => user.gender === 'female').length;

    totalCountEl.textContent = total;
    maleCountEl.textContent = males;
    femaleCountEl.textContent = females;
}

// Show Loading
function showLoading() {
    const activeView = document.querySelector('.toggle-btn.active').dataset.view;
    
    if (activeView === 'cards') {
        cardsView.innerHTML = '<div class="loading">Generating users</div>';
    } else {
        tableBody.innerHTML = '<tr><td colspan="8" class="loading">Generating users</td></tr>';
    }
}

// Show Error
function showError() {
    const activeView = document.querySelector('.toggle-btn.active').dataset.view;
    
    if (activeView === 'cards') {
        cardsView.innerHTML = '<div class="info-message">❌ Failed to generate users. Please try again.</div>';
    } else {
        tableBody.innerHTML = '<tr><td colspan="8" class="info-message">❌ Failed to generate users. Please try again.</td></tr>';
    }
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize
updateStats();
