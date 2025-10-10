#!/usr/bin/env node
import fs from "node:fs/promises";
import os from "node:os";
import { pathToFileURL } from "node:url";
/*
  ---------------
  Check if config.js exist in the target folder
  < fileExists >
  * -> return boolean value
  ---------------
*/
export const fileExists = async (path) => {
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
/*
  ---------------
  Return accurate path
  < getPath >
  * -> return a string value
  * -> throws an error if folder is not found
  ---------------
*/
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
const config_file_path = getPath(process.argv[2]);
const is_file_exists = await fileExists(config_file_path);

/*
  ---------------
  Check allowed properties
  ---------------
*/

const config_object = await import(pathToFileURL(config_file_path).href);

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
  < is_includes >
  * -> returns a boolean value
  ---------------
*/
export function is_includes(obj) {
  for (const key of Object.keys(obj)) {
    if (!allowed_properties.includes(key)) {
      return false;
    }
  }
  return true;
}
// console.log(is_includes(config_object.default));
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
/*
  ---------------
  Check valid types
  < invalid_type_value >
  * -> return array of objects
  ---------------
*/
export function check_type_value(obj) {
  const invalid_type_value = [];
  for (const prop of allowed_properties) {
    if (prop === "imports" || prop === "order") {
      if (obj.hasOwnProperty(prop) && !Array.isArray(obj[prop])) {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    } else if (prop !== "imports" && prop !== "order") {
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
  < get_properies_info >
  * -> return an object
  * -> throws an error if file is not found
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
  } else {
    throw new Error("FILE DOES NOT EXIST!");
  }
}

const properties_info = await get_properies_info();
/*
  ---------------
  Add contents to output file
  < add_contents >
  * -> throws an error if path is incorrect
  ---------------
*/
async function add_contents(path, files) {
  if (path && Array.isArray(files) && files.length > 0) {
    if (config_object.default.frontmatter) {
      await fs.appendFile(path, config_object.default.frontmatter + "\n");
    }
    if (
      Array.isArray(config_object.default.imports) &&
      config_object.default.imports.length > 0
    ) {
      for (const value of config_object.default.imports) {
        await fs.appendFile(path, value + "\n\n");
      }
    }
    for (const file of files) {
      const content = await fs.readFile(getPath(process.argv[2], file));
      await fs.appendFile(path, content + "\n");
    }
  } else {
    throw new Error("PATH IS NOT DEFINED OR ARGUMENT 'FILES' IS EMPTY");
  }
}
/*
  ---------------
  Get files inside a folder/directory
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
}
/*
  ---------------
  Generate output file
  < generate_file >
  * ->
  ---------------
*/
async function generate_file() {
  console.log(properties_info);
  const is_outputFile_empty =
    typeof config_object.default.outputFile === "string" &&
    config_object.default.outputFile !== "";
  const is_outputDir_exists = await fileExists(config_object.default.outputDir);
  if (
    properties_info.is_allowed === true &&
    properties_info.unknown_props.length === 0 &&
    properties_info.invalid_types.length === 0
  ) {
    if (!is_outputDir_exists) {
      console.error(
        "Output directory does not exist:",
        config_object.default.outputDir,
      );
    }
    if (is_outputFile_empty && is_outputDir_exists) {
      const files = await read_directory(process.argv[2]);
      try {
        const path = getPath(
          config_object.default.outputDir,
          config_object.default.outputFile,
        );
        await fs.writeFile(path, "");
        await add_contents(path, files);
        console.log("FILE IS GENERATED SUCCESSFULLY!");
      } catch (err) {
        console.error(err);
      }
    }
  } else {
    console.error("Invalid or unsupported configuration in config.js");

    if (!properties_info.is_allowed) {
      console.error(
        "Your config includes unknown properties:",
        properties_info.unknown_props.join(", ") || "none",
      );
    }

    if (properties_info.invalid_types.length > 0) {
      console.error("Invalid property types:");
      for (const {
        prop_name,
        has_type,
        expected_type,
      } of properties_info.invalid_types) {
        console.error(
          `   → ${prop_name}: got ${has_type}, expected ${expected_type}`,
        );
      }
    }
  }
}

try {
  await generate_file();
  console.log("Merge complete!");
} catch (err) {
  console.error(`Merge failed: ${err}`);
}
