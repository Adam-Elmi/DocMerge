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
function is_includes(obj) {
  for(const prop of allowed_properties) {
    switch(true) {
      case obj.hasOwnProperty(prop):
        return true;
    }
  }
  return false;
}
const invalid_type_value = [];

function check_type_value(obj) {
  if(obj.hasOwnProperty("imports") && !Array.isArray(obj.imports)) {
    invalid_type_value.push({
      prop_name: "imports",
      has_type: typeof obj.imports,
      expected_type: "Array of strings"
    })
  }
  if(obj.hasOwnProperty("frontmatter") && typeof obj.frontmatter !== "string") {
    invalid_type_value.push({
      prop_name: "frontmatter",
      has_type: typeof obj.frontmatter,
      expected_type: "String"
    })
  }
  if(obj.hasOwnProperty("outputFile") && typeof obj.outputFile !== "string") {
    invalid_type_value.push({
      prop_name: "outputFile",
      has_type: typeof obj.outputFile,
      expected_type: "String"
    })
  }
  if(obj.hasOwnProperty("outputDir") && typeof obj.outputDir !== "string") {
    invalid_type_value.push({
      prop_name: "outputDir",
      has_type: typeof obj.outputDir,
      expected_type: "String"
    })
  }
  if(obj.hasOwnProperty("order") && !Array.isArray(obj.order)) {
    invalid_type_value.push({
      prop_name: "order",
      has_type: typeof obj.order,
      expected_type: "Array of strings"
    })
  }
  return invalid_type_value;
}
async function check_properties() {
  if (is_file_exists) {
    try {
      const config_object = await import(config_file_path);
      let is_allowed = is_includes(config_object.default), unknown_props = [];
      if(config_object.default) {
        for(const key of Object.keys(config_object.default)) {
          if(!allowed_properties.includes(key)) {
            is_allowed = false;
            unknown_props.push(key);
          } 
        }
        return {is_allowed, unknown_props, type_value: check_type_value(config_object.default)};
      }
    } catch (err) {
      console.error(err);
    }
  }
  return "FILE DOES NOT EXIST!";
}
console.log(await check_properties());