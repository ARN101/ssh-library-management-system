-- Database Schema for SSH Library Management System

CREATE DATABASE IF NOT EXISTS ssh_library_db;
USE ssh_library_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kuet_mail VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(15) NOT NULL UNIQUE,
    role ENUM('student', 'librarian') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'issued', 'cancelled', 'returned') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Insert demo librarian user (password: admin123)
-- In production, the password hash should be bcrypt
INSERT INTO users (kuet_mail, password_hash, full_name, student_id, role)
VALUES ('librarian@kuet.ac.bd', '$2b$10$wB50.7cRz1r2Z6t.8P2YI.rM/sLd2vM.F8v8Lw0rF2n1J4Yp2y5m.', 'SSH Librarian', '0000000', 'librarian')
ON DUPLICATE KEY UPDATE id=id;
