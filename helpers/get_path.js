import os from "node:os";
/*
  ---------------
  Returns accurate path
  < getPath >
  * -> return a string value
  * -> throws an error if folder is not found
  ---------------
*/
function getPath(folderPath, file = "config.js") {
  if (folderPath) {
    let path;
    if (os.platform() === "win32") {
      path = folderPath + "\\" + file;
      return path.replace(/\\\\+/g, "\\");
    } else {
      path = folderPath + "/" + file;
      return path.replace(/\/\/+/g, "/");
    }
  } else {
    throw new Error("FOLDER PATH IS NOT DEFINED!");
  }
};
export default getPath;