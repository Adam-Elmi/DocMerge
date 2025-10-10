import os from "node:os";
export function getPath(folderPath, file = "config.js") {
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
}