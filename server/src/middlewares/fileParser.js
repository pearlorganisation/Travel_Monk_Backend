import formidable, { File } from "formidable";
import path from "path";

const fileParser = async (req, res, next) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      //  next(err);
      console.error("Error parsing the files", err);
      return;
    }

    if (!req.body) req.body = {};

    for (const key in fields) {
      req.body[key] = fields[key][0];
    }

    if (!req.files) req.files = {};

    for (const key in files) {
      const actualFiles = files[key];
      if (!actualFiles) break;

      if (Array.isArray(actualFiles) && actualFiles.length > 1) {
        req.files[key] = actualFiles;
      } else {
        req.files[key] = actualFiles[0];
      }
    }

    next();
  });

  //   const form = formidable({
  //     uploadDir: path.join(__dirname, "../../public/images/uploads"),
  //     filename(name, ext, part) {
  //       const uniqueFileName =
  //         Date.now() + "_" + (part.originalFilename || name + ".jpg");
  //       return uniqueFileName;
  //     },
  //   });
  //   form.parse(req, (err, fields, files) => {
  //     if (err) {
  //       //return sendErrorRes(res, "Error parsing the files", 500);
  //       console.error("Error parsing the files", err);
  //     }
  //     req.body = fields;
  //     req.files = files;
  //     next();
  //   });
};

export default fileParser;
