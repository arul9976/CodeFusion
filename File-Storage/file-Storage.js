import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const BASE_DIR = path.join(__dirname, "uploads");

// Create folder API
app.post("/create-folder", (req, res) => {
    const folderName = req.body.folderName;
    if (!folderName) return res.status(400).json({ error: "Folder name required" });

    const folderPath = path.join(BASE_DIR, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return res.json({ message: "Folder created successfully!" });
    } else {
        return res.json({ message: "Folder already exists!" });
    }
});

// Create file API
app.post("/create-file", (req, res) => {
    const { folderName, fileName, content } = req.body;
    if (!folderName || !fileName) return res.status(400).json({ error: "Folder and file name required" });

    const filePath = path.join(BASE_DIR, folderName, fileName);

    fs.writeFile(filePath, content || "", (err) => {
        if (err) return res.status(500).json({ error: "Error creating file" });
        return res.json({ message: "File created successfully!" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));