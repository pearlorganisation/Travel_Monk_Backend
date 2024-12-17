import fs from "fs";

export const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    throw new Error(`Error deleting file: ${filePath}. ${error.message}`);
  }
};
