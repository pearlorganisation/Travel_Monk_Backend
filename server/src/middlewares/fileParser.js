import formidable from "formidable";

const fileParser = (req, res, next) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files", err);
      return next(err);
    }
    req.body = req.body || {};

    // Convert fields to req.body
    for (const key in fields) {
      if (fields[key]) {
        const value = fields[key][0]; // Get the first item in the array

        // Attempt to parse JSON strings (for objects/arrays sent as strings)
        try {
          req.body[key] = JSON.parse(value);
        } catch (e) {
          req.body[key] = value; // If parsing fails, keep as string
        }

        // Convert specific fields to numbers
        if (!isNaN(req.body[key])) {
          req.body[key] = Number(req.body[key]);
        }
      }
    }
    // console.log("REQ: Body:--------- ", req.body);

    req.files = req.files || {};

    // Convert files to req.files
    for (const key in files) {
      const actualFiles = files[key];
      if (!actualFiles) break;

      if (Array.isArray(actualFiles)) {
        req.files[key] = actualFiles.length > 1 ? actualFiles : actualFiles[0];
      } else {
        req.files[key] = actualFiles;
      }
    }
    // console.log("REQ: file:--------- ", req.files);
    next();
  });
};

export default fileParser;

// import formidable, { File } from "formidable";
// import path from "path";

// const fileParser = async (req, res, next) => {
//   const form = formidable();

//   form.parse(req, (err, fields, files) => {
//     console.log("fields:-- ", fields);
//     console.log("Files:-- ", files);
//     if (err) {
//       return next(err);
//     }

//     // Ensure req.body exists
//     req.body = req.body || {};

//     // Convert fields to req.body
//     for (const key in fields) {
//       if (fields[key]) {
//         req.body[key] = fields[key][0];
//       }
//     }
//     console.log("REQ: Body:--------- ", req.body);
//     // Ensure req.files exists
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

//     next();
//   });

//   // form.parse(req, (err, fields, files) => {
//   //   if (err) {
//   //     //  next(err);
//   //     console.error("Error parsing the files", err);
//   //     return;
//   //   }

//   //   if (!req.body) req.body = {};

//   //   for (const key in fields) {
//   //     req.body[key] = fields[key][0];
//   //   }

//   //   if (!req.files) req.files = {};

//   //   for (const key in files) {
//   //     const actualFiles = files[key];
//   //     if (!actualFiles) break;

//   //     if (Array.isArray(actualFiles) && actualFiles.length > 1) {
//   //       req.files[key] = actualFiles;
//   //     } else {
//   //       req.files[key] = actualFiles[0];
//   //     }
//   //   }

//   //   next();
//   // });

//   //   const form = formidable({
//   //     uploadDir: path.join(__dirname, "../../public/images/uploads"),
//   //     filename(name, ext, part) {
//   //       const uniqueFileName =
//   //         Date.now() + "_" + (part.originalFilename || name + ".jpg");
//   //       return uniqueFileName;
//   //     },
//   //   });
//   //   form.parse(req, (err, fields, files) => {
//   //     if (err) {
//   //       //return sendErrorRes(res, "Error parsing the files", 500);
//   //       console.error("Error parsing the files", err);
//   //     }
//   //     req.body = fields;
//   //     req.files = files;
//   //     next();
//   //   });
// };

// export default fileParser;
