import fs from "node:fs/promises";
import os from "node:os";
/*
 Checking if config.js exist in the target folder
*/
const fileExists = async (path) => {
  try {
    if (path) {
      await fs.access(path);
      return true;
    } else {
      console.log("PROVIDE THE PATH!");
    }
  } catch (_) {
    return false;
  }
};

function getPath(folderPath, file = "config.js") {
  if(folderPath) {
    let path;
    if(os.platform() === "win32") {
      path = folderPath + "\\" + file;
      return path.replace(/\\\\+/g, "\\");
    }
    else {
      path = folderPath + "/" + file
      return path.replace(/\/\/+/g, "/");
    }
  }
  return "FOLDER PATH IS NOT DEFINED!"
}
const config_file_path = process.argv[2] ? getPath(process.argv[2]) : "";
const is_file_exists = await fileExists(config_file_path);

/*
  Checking allowed properties
*/
const allowed_properties = ["imports", "frontmatter", "outputFile", "outputDir", "order"]; 
async function check_properties() {
  if (is_file_exists) {
    try {
      let is_allowed = true, unknown_props = [];
      const config_object = await import(config_file_path);
      if(config_object.default) {
        for(const key of Object.keys(config_object.default)) {
          if(!allowed_properties.includes(key)) {
            is_allowed = false;
            unknown_props.push(key);
          } 
        }
        return {is_allowed, unknown_props};
      }
    } catch (err) {
      console.error(err);
    }
  }
  return "FILE DOES NOT EXIST!";
}
console.log(await check_properties());