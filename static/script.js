// Function to toggle between light and dark mode
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Save the theme preference
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
} else {
    document.documentElement.setAttribute('data-theme', 'light'); // Default to light mode
}

// Search Functionality
const searchInput = document.getElementById('search-input');
const recordRows = document.querySelectorAll('.record-row');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    recordRows.forEach(row => {
        const bandName = row.querySelector('.band-name').textContent.toLowerCase();
        const title = row.querySelector('.title').textContent.toLowerCase();

        if (bandName.includes(searchTerm) || title.includes(searchTerm)) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
});