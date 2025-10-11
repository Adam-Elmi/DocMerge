#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import {
  getPath,
  get_properties_info,
  generate_file,
} from "./helpers/index.js";

const config_file_path = getPath(process.argv[2]);

/*
  ---------------
  Checks allowed properties
  ---------------
*/

const config_object = await import(pathToFileURL(config_file_path).href);

/*
  ---------------
  Allowed properties
  ---------------
*/
const config_properties = [
  "imports",
  "frontmatter",
  "outputFile",
  "outputDir",
  "order",
  "hook",
];

const properties_info = await get_properties_info(
  config_object.default,
  config_properties,
);

try {
  await generate_file(properties_info, config_object.default);
  console.log("Merge completed!");
} catch (err) {
  console.error(`Merge failed: ${err}`);
}
