import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const uploadDir = path.join(__dirname, "public", "mock-uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// The static folder is mounted ONLY ONCE, when the server starts.
app.use("/mock-uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-mock.webp");
  },
});

const upload = multer({ storage });

// Centralization of the port to prohibit any asymmetry.
const PORT = 8081;

// Route to simulate the Cloudinary API
app.post("/v1_1/:cloudName/image/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: "No file uploaded" } });
  }

  // Use the PORT variable to ensure strict alignment.
  const fakeSecureUrl = `http://localhost:${PORT}/mock-uploads/${req.file.filename}`;
  console.log(`[MOCK] Optimized image received and stored: ${fakeSecureUrl}`);

  res.json({
    secure_url: fakeSecureUrl,
    public_id: req.file.filename,
    format: "webp",
    bytes: req.file.size,
  });
});

app.listen(PORT, () => {
  console.log(`🔴 Mock Cloudinary server active on http://localhost:${PORT}`);
});
