const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();


app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true
})); 

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mek@la297",
    database: "usersDB"
});


db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database!");
});


app.post('/signUp', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(sql, [name, email, hashedPassword], (err, data) => {
            if (err) {
                console.error("Database Insert Error:", err);
                return res.status(500).json({ error: "Database Error", details: err });
            }
            return res.status(200).json({ message: "User Registered Successfully!" });
        });

    } catch (error) {
        return res.status(500).json({ error: "Encryption Error", details: error });
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, data) => {
        if (err) return res.status(500).json({ error: "Database Error", details: err });

        if (data.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = data[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        return res.status(200).json({ message: "Login Successful!" });
    });
});

const PORT =8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
