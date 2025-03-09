# Record Collection Web Application

This is a simple web application built using **Flask** and **SQLite** to manage a record collection. It allows users to log in, view, add, edit, and delete records. The application also includes features like **dark mode**, **search filtering**, and **sorting**.

---

## Features

### 1. **User Authentication**
   - **Admin User**: Can add, edit, and delete records.
   - **Read-Only User**: Can only view records (actions are hidden).
   - Secure login with session management.

### 2. **Record Management**
   - **Add Records**: Add new records with band name, title, year, and format.
   - **Edit Records**: Update existing records.
   - **Delete Records**: Remove records from the collection.
   - **View Records**: Display all records in a table.

### 3. **Search Filter**
   - Search records by **band name** or **title** in real-time.

### 4. **Sorting**
   - Sort records alphabetically by **band name** (A to Z or Z to A).

### 5. **Dark Mode**
   - Toggle between light and dark themes.
   - Theme preference is saved in local storage.

### 6. **Responsive Design**
   - Clean and modern UI with CSS styling.

---

## Technologies Used

- **Backend**: Flask (Python)
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with dark mode support
- **JavaScript**: For dynamic features like search filtering and theme toggling

---

## Project Structure

record_collection_app/
* │
* ├── app.py # Main Flask application
* ├── database.db # SQLite database file
* ├── README.md # Project documentation
* │
* ├── static/
* │ ├── styles.css # CSS for styling
* │ └── script.js # JavaScript for dynamic features
* │
* └── templates/
* | ├── index.html # Main page (record collection)
* | ├── login.html # Login page
* | ├── add.html # Add a new record
* | └── edit.html # Edit a record


---

## How to Run the Application

### Prerequisites
- Python 3.x
- Flask (`pip install flask`)
- Flask-SQLAlchemy (`pip install flask-sqlalchemy`)

### Steps
1. Clone the repository or download the project files.
2. Navigate to the project directory:
   - cd record_collection_app
3. Run the Flask application:
   - python app.py
4. Open your browser and go to http://127.0.0.1:5000.

## User Accounts
### Admin User
* Username: admin
* Password: admin123 
* Permissions: Add, edit, and delete records.

### Read-Only User
* Username: reader
* Password: reader123
* Permissions: View records only.

## Code Overview
### Backend (app.py)
* Handles routing, database operations, and user authentication.
* Uses Flask-SQLAlchemy for database management.
* Implements session-based login/logout functionality.

### Frontend (templates/)
* HTML Templates: Define the structure of each page.
* CSS (styles.css): Styles the application with support for dark mode.
* JavaScript (script.js): Adds interactivity (search filtering, theme toggling).

## Future Enhancements
* Add user registration functionality.
* Implement pagination for the record table.
* Use a CSS framework like Bootstrap for more advanced styling.
* Add more search filters (e.g., by year or format).

## License
This project is open-source and available under the MIT License..-