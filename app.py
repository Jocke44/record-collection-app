from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Required for session management
db = SQLAlchemy(app)

# Define the Record model
class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    band_name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    format = db.Column(db.String(50), nullable=False)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'admin' or 'readonly'

# Create the database
with app.app_context():
    db.create_all()

    # Add an admin user if it doesn't exist
    if not User.query.filter_by(username='admin').first():
        admin_user = User(
            username='admin',
            password=generate_password_hash('admin123'),  # Hash the password
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()

    # Add a read-only user if it doesn't exist
    if not User.query.filter_by(username='reader').first():
        readonly_user = User(
            username='reader',
            password=generate_password_hash('reader123'),  # Hash the password
            role='readonly'
        )
        db.session.add(readonly_user)
        db.session.commit()

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            session['logged_in'] = True
            session['username'] = user.username
            session['role'] = user.role  # Store the user's role in the session
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials')
    return render_template('login.html')

# Logout Route
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    session.pop('role', None)
    return redirect(url_for('login'))

# Change Password Route
@app.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    if request.method == 'POST':
        current_password = request.form['current_password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        # Fetch the current user
        user = User.query.filter_by(username=session['username']).first()

        # Verify the current password
        if not check_password_hash(user.password, current_password):
            flash('Current password is incorrect')
            return redirect(url_for('change_password'))

        # Check if new passwords match
        if new_password != confirm_password:
            flash('New passwords do not match')
            return redirect(url_for('change_password'))

        # Update the password
        user.password = generate_password_hash(new_password)
        db.session.commit()

        flash('Password updated successfully')
        return redirect(url_for('index'))

    return render_template('change_password.html')

# Index Route (Main Page)
@app.route('/')
def index():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    records = Record.query.order_by(Record.band_name.asc()).all()
    return render_template('index.html', records=records, role=session.get('role'))

# Add Record Route
@app.route('/add', methods=['GET', 'POST'])
def add_record():
    if not session.get('logged_in') or session.get('role') != 'admin':
        return redirect(url_for('login'))
    if request.method == 'POST':
        band_name = request.form['band_name']
        title = request.form['title']
        year = request.form['year']
        format = request.form['format']
        new_record = Record(band_name=band_name, title=title, year=year, format=format)
        db.session.add(new_record)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('add.html')

# Edit Record Route
@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_record(id):
    if not session.get('logged_in') or session.get('role') != 'admin':
        return redirect(url_for('login'))
    record = Record.query.get_or_404(id)
    if request.method == 'POST':
        record.band_name = request.form['band_name']
        record.title = request.form['title']
        record.year = request.form['year']
        record.format = request.form['format']
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('edit.html', record=record)

# Delete Record Route
@app.route('/delete/<int:id>')
def delete_record(id):
    if not session.get('logged_in') or session.get('role') != 'admin':
        return redirect(url_for('login'))
    record = Record.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return redirect(url_for('index'))

# Run the application
if __name__ == '__main__':
    app.run(debug=True)