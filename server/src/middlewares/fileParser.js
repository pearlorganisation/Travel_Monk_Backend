// import formidable from "formidable";

// const fileParser = (req, res, next) => {
//   const form = formidable();

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.error("Error parsing the files", err);
//       return next(err);
//     }
//     req.body = req.body || {};
//     // console.log("FIELDS: ", fields);
//     // Convert fields to req.body
//     for (const key in fields) {
//       if (fields[key]) {
//         const value = fields[key][0]; // Get the first item in the array

//         // Attempt to parse JSON strings (for objects/arrays sent as strings)
//         try {
//           req.body[key] = JSON.parse(value);
//         } catch (e) {
//           // return next(new ApiErrorResponse("Parsing failed", 400));
//           req.body[key] = value;
//         }

//         // Convert specific fields to numbers
//         if (!isNaN(req.body[key])) {
//           // console.log("NaN");
//           req.body[key] = Number(req.body[key]);
//         }
//       }
//     }
//     // console.log("REQ: Body:--------- ", req.body);

//     req.files = req.files || {};

//     // Convert files to req.files
//     for (const key in files) {
//       const actualFiles = files[key];
//       if (!actualFiles) break;

//       if (Array.isArray(actualFiles)) {
//         req.files[key] = actualFiles.length > 1 ? actualFiles : actualFiles[0];
//       } else {
//         req.files[key] = actualFiles;
//       }
//     }
//     // console.log("REQ: file:--------- ", req.files);
//     next();
//   });
// };

// export default fileParser;

import formidable from "formidable";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Middleware to parse files and fields from requests
const fileParser = (req, res, next) => {
  // Define __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const form = formidable({
    uploadDir: path.join(__dirname, "../../public/uploads"), // Directory for file uploads
    keepExtensions: true, // Retain file extensions
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
        const value = Array.isArray(fields[key]) ? fields[key][0] : fields[key]; // Handle arrays

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

    next(); // Pass control to the next middleware or route handler
  });
};

export default fileParser;
