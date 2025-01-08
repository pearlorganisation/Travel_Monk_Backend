import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Middleware to parse files and fields from requests
const fileParser = (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const form = formidable({
    uploadDir: path.join(__dirname, "../../public/uploads"), // Directory for file uploads
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    multiples: true, // Allow multiple file uploads
  });

  // console.log("uploadDir: ", form); // D:\Travel Monk Backend\server\public\uploads

  // Ensure the upload directory exists
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  // Parse the incoming request
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files:", err);
      return next(err); // Pass the error to the error-handling middleware
    }

    // Convert fields to req.body
    req.body = req.body || {};
    for (const key in fields) {
      if (fields[key]) {
        const value = Array.isArray(fields[key]) ? fields[key][0] : fields[key];

        // Attempt to parse JSON strings
        try {
          req.body[key] = JSON.parse(value);
        } catch {
          req.body[key] = value; // Use raw value if parsing fails
        }

        // Convert numerical strings to numbers
        if (!isNaN(req.body[key])) {
          req.body[key] = Number(req.body[key]);
        }
      }
    }

    // Convert files to req.files
    req.files = req.files || {};
    for (const key in files) {
      const file = files[key];
      if (file) {
        req.files[key] = Array.isArray(file) ? file : [file]; // Always store files as an array
      }
    }

    next();
  });
};

export default fileParser;
