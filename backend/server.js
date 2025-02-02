const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const tenderPort = 5003; // New port for the /tenders route
const uploadPort = 5002; // Port for the /upload route

app.use(cors()); // CORS is essential!
app.use(express.json()); // Parses JSON request bodies (CRITICAL!)

// Multer setup (same as before)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files (same as before)
app.use("/uploads", express.static("uploads"));

// File Upload Route (same as before)
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ fileUrl: `http://localhost:${uploadPort}/uploads/${req.file.filename}` });
});

// Tender Submission Route (NEW and IMPROVED)
app.post("/tenders", (req, res) => {
  console.log("Tender data received:", req.body);

  // Access file URLs and other form data from req.body
  const tenderUpload = req.body.tenderUpload;
  const generalTerms = req.body.generalTerms;
  const specificTerms = req.body.specificTerms;
  const titleOfTender = req.body.titleOfTender;
  // ... access other fields

  // Now save this data to your database or perform other actions.
  // Example (replace with your database logic):
  const tenders = [];
  tenders.push(req.body); // Store the tender data

  res.status(200).json({ message: "Tender submitted successfully" });
});

// Start Servers (Two separate ports)
app.listen(uploadPort, () => {
  console.log(`File upload server running on port ${uploadPort}`);
});

app.listen(tenderPort, () => {
  console.log(`Tender submission server running on port ${tenderPort}`);
});