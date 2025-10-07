import fs from "node:fs/promises";
import os from "node:os";
/*
  ---------------
  Check if config.js exist in the target folder
  ---------------
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
/*
  ---------------
  Return accurate path
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
  }
  return "FOLDER PATH IS NOT DEFINED!";
}
const config_file_path = process.argv[2] ? getPath(process.argv[2]) : "";
const is_file_exists = await fileExists(config_file_path);

/*
  ---------------
  Check allowed properties
  ---------------
*/

const config_object = await import(config_file_path);
/*
  ---------------
  Allowed properties
  ---------------
*/
const allowed_properties = [
  "imports",
  "frontmatter",
  "outputFile",
  "outputDir",
  "order",
];
/*
  ---------------
  Check if config file includes allowed properties
  ---------------
*/
function is_includes(obj) {
  for (const prop of allowed_properties) {
    switch (true) {
      case obj.hasOwnProperty(prop):
        return true;
    }
  }
  return false;
}
/*
  ---------------
  Valid type for allowed properties
  ---------------
*/
const valid_types = {
  imports: "Array of strings",
  frontmatter: "String",
  outputFile: "String",
  outputDir: "String",
  order: "Array of strings",
};
const invalid_type_value = [];
/*
  ---------------
  Check valid types
  ---------------
*/
function check_type_value(obj) {
  for (const prop of allowed_properties) {
    if (prop === "imports" || prop === "order") {
      if (obj.hasOwnProperty(prop) && !Array.isArray(obj[prop])) {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    }
    else if (prop !== "imports" || prop !== "order") {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "string") {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    }
  }
  return invalid_type_value;
}
/*
  ---------------
  Get properties info
  ---------------
*/
async function get_properies_info() {
  if (is_file_exists) {
    try {
      let is_allowed = is_includes(config_object.default),
        unknown_props = [];
      if (config_object.default) {
        for (const key of Object.keys(config_object.default)) {
          if (!allowed_properties.includes(key)) {
            is_allowed = false;
            unknown_props.push(key);
          }
        }
        return {
          is_allowed,
          unknown_props,
          invalid_types: check_type_value(config_object.default),
        };
      }
    } catch (err) {
      console.error(err);
    }
  }
  return "FILE DOES NOT EXIST!";
}

const properties_info = await get_properies_info();
/*
  ---------------
  Add contents to output file
  ---------------
*/
async function add_contents(path, files) {
  if (path && Array.isArray(files) && files.length > 0) {
    for (const file of files) {
      const content = await fs.readFile(getPath(process.argv[2], file));
      await fs.appendFile(path, content + "\n");
    }
  }
  return "PATH IS NOT DEFINED OR ARGUMENT 'FILES' IS EMPTY";
}
/*
  ---------------
  Get files inside a folder/directory
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
  } catch (err) {
    console.error(err);
  }
  return "DIRECTORY DOES NOT EXIST!";
}
/*
  ---------------
  Generate output file
  ---------------
*/
async function generate_file() {
  const is_outputFile_empty =
    typeof config_object.default.outputFile === "string" &&
    config_object.default.outputFile !== "";
  const is_outputDir_exists = await fileExists(config_object.default.outputDir);
  if (
    properties_info.is_allowed === true &&
    properties_info.unknown_props.length === 0 &&
    properties_info.invalid_types.length === 0
  ) {
    if (is_outputFile_empty && is_outputDir_exists) {
      const files = await read_directory(process.argv[2]);
      try {
        const path = getPath(
          config_object.default.outputDir,
          config_object.default.outputFile,
        );
        const is_outputFile_exists = await fileExists(path);
        if (is_outputFile_exists) {
          await fs.writeFile(path, "");
          await add_contents(path, files);
        } else {
          await fs.writeFile(path, "");
          await add_contents(path, files);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}

console.log(await generate_file());
