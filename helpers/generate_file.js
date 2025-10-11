import fs from "node:fs/promises";
import fileExists from "./file_exists.js";
import getPath from "./get_path.js";
import read_directory from "./read_directory.js";
import add_contents from "./add_contents.js";
/*
  ---------------
  Generates output file
  < generate_file >
  * ->
  ---------------
*/
async function generate_file(properties_info, obj) {
  const is_outputFile_empty =
    typeof obj.outputFile === "string" &&
    obj.outputFile !== "";
  const is_outputDir_exists = await fileExists(obj.outputDir);
  if (
    properties_info.is_allowed === true &&
    properties_info.unknown_props.length === 0 &&
    properties_info.invalid_types.length === 0
  ) {
    if (!is_outputDir_exists) {
      console.error(
        "Output directory does not exist:",
        obj.outputDir,
      );
    }
    if (is_outputFile_empty && is_outputDir_exists) {
      const files = await read_directory(process.argv[2]);
      try {
        const path = getPath(
          obj.outputDir,
          obj.outputFile,
        );
        await fs.writeFile(path, "");
        await add_contents(path, files, obj);
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
};
export default generate_file;