const express = require('express');
const mysql = require('mysql2');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "API for managing book loans in a library"
    },
  },
  apis: ['./app.js'],  // Referensi ke file tempat definisi API
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Endpoint untuk menampilkan semua buku
app.get('/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint untuk menampilkan semua anggota dan jumlah buku yang dipinjam
app.get('/members', (req, res) => {
    const query = `
        SELECT m.*, COUNT(l.id) AS loaned_books 
        FROM members m 
        LEFT JOIN loans l ON m.id = l.member_id AND l.return_date IS NULL 
        GROUP BY m.id;
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint untuk meminjam buku
app.post('/borrow', (req, res) => {
    const { member_id, book_id } = req.body;

    const checkMemberPenalty = `SELECT penalty_until FROM members WHERE id = ?`;
    const checkMemberLoans = `SELECT COUNT(*) AS loan_count FROM loans WHERE member_id = ? AND return_date IS NULL`;
    const checkBookAvailability = `SELECT available FROM books WHERE id = ?`;
    const borrowBook = `INSERT INTO loans (member_id, book_id, loan_date) VALUES (?, ?, CURDATE())`;
    const updateBookAvailability = `UPDATE books SET available = 0 WHERE id = ?`;

    db.query(checkMemberPenalty, [member_id], (err, result) => {
        if (err) throw err;

        const penalty = result[0].penalty_until;
        if (penalty && new Date(penalty) > new Date()) {
            return res.status(403).json({ message: 'Member is under penalty.' });
        }

        db.query(checkMemberLoans, [member_id], (err, result) => {
            if (err) throw err;

            if (result[0].loan_count >= 2) {
                return res.status(403).json({ message: 'Member cannot borrow more than 2 books.' });
            }

            db.query(checkBookAvailability, [book_id], (err, result) => {
                if (err) throw err;

                if (!result[0].available) {
                    return res.status(403).json({ message: 'Book is currently unavailable.' });
                }

                db.query(borrowBook, [member_id, book_id], (err) => {
                    if (err) throw err;

                    db.query(updateBookAvailability, [book_id], (err) => {
                        if (err) throw err;
                        res.json({ message: 'Book borrowed successfully.' });
                    });
                });
            });
        });
    });
});

// Endpoint untuk mengembalikan buku
app.post('/return', (req, res) => {
    const { member_id, book_id } = req.body;

    const checkLoan = `SELECT * FROM loans WHERE member_id = ? AND book_id = ? AND return_date IS NULL`;
    const returnBook = `UPDATE loans SET return_date = CURDATE() WHERE id = ?`;
    const updateBookAvailability = `UPDATE books SET available = 1 WHERE id = ?`;
    const applyPenalty = `UPDATE members SET penalty_until = DATE_ADD(CURDATE(), INTERVAL 3 DAY) WHERE id = ?`;

    db.query(checkLoan, [member_id, book_id], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Loan not found.' });
        }

        const loan = result[0];
        const loanDate = new Date(loan.loan_date);
        const now = new Date();
        const loanDuration = Math.ceil((now - loanDate) / (1000 * 60 * 60 * 24));

        db.query(returnBook, [loan.id], (err) => {
            if (err) throw err;

            db.query(updateBookAvailability, [book_id], (err) => {
                if (err) throw err;

                if (loanDuration > 7) {
                    db.query(applyPenalty, [member_id], (err) => {
                        if (err) throw err;
                        res.json({ message: 'Book returned, penalty applied for late return.' });
                    });
                } else {
                    res.json({ message: 'Book returned successfully.' });
                }
            });
        });
    });
});

// Jalankan server di port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
 
