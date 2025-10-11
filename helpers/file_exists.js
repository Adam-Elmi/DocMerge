import fs from "node:fs/promises";
/*
  ---------------
  Checks if config.js exist in the target folder
  < fileExists >
  * -> return boolean value
  ---------------
*/
const fileExists = async (path) => {
  try {
    if (path) {
      await fs.access(path);
      return true;
    } else {
      throw new Error("PROVIDE THE PATH!");
    }
  } catch (_) {
    return false;
  }
};
export default fileExists;