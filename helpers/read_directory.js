import fs from "node:fs/promises";
import fileExists from "./file_exists.js";
/*
  ---------------
  Gets files inside a folder/directory
  < read_directory >
  * -> returns array of strings
  * -> throws an error if folder is not found
  ---------------
*/
async function read_directory(path) {
  try {
    if (path) {
      const is_dir_exists = await fileExists(path);
      if (is_dir_exists) {
        const files = await fs.readdir(path);
        return files.filter(
          (filename) => filename.toLowerCase() !== "config.js",
        );
      }
    }
  } catch (_) {
    throw new Error("DIRECTORY DOES NOT EXIST!");
  }
};
export default read_directory;