import os from "node:os";
import {
  fileExists,
  getPath,
  is_includes,
  check_type_value,
} from "../merge.test.js";

function expect_to_be_equal(
  value1,
  value2,
  task = "",
) {
  const passed =
    "\x1b[32mTEST PASSED:\x1b[0m \x1b[36mTRUE\x1b[0m " + "-> " +
    (task
      ? `\x1b[33mTASK:\x1b[0m ${task}`
      : task);
  const failed =
    "\x1b[31mTEST FAILED:\x1b[0m \x1b[35mFALSE\x1b[0m " + "-> " +
    (task
      ? `\x1b[33mTASK:\x1b[0m: ${task}`
      : task);
  if (value1 === value2) {
    console.log(passed);
  } else {
    console.log(failed);
  }
}

console.log("\x1b[33mRunning Tests...\x1b[0m");
console.log("-".repeat(30));
console.log("\x1b[34m[--Testing function:\x1b[0m \x1b[36mfileExists--]\x1b[0m");
/*
  ---------------
  Check if file exists using a real path
  * Expected result: true
  ---------------
*/
const is_file_1_exists = await fileExists("./tests/example/config.js");
expect_to_be_equal(is_file_1_exists, true, "Check if file exists using a real path");
/*
  ---------------
  Check if file exists using a fake path
  * Expected result: false
  ---------------
*/
const is_file_2_exists = await fileExists("./example/docs/config.js");
expect_to_be_equal(is_file_2_exists, false, "Check if file exists using a fake path");
/*
  ---------------
  Check if file exists if path is not defined
  * Expected result: false
  ---------------
*/
const is_file_3_exists = await fileExists();
expect_to_be_equal(is_file_3_exists, false, "Check if file exists if path is not defined");

console.log("-".repeat(30));
console.log("\x1b[34m[--Testing function:\x1b[0m \x1b[36mgetPath--]\x1b[0m");
/*
  ---------------
  Check if it returns an accurate path
  * Expected result for windows path: .\example\config.js
  * Expected result for unix-like path: ./example/config.js
  ---------------
*/
if (os.platform === "win32") {
  const path_1 = getPath(".\\example\\\\", "config.js");
  expect_to_be_equal(path_1, ".\\example\\config.js", "Check if it returns an accurate path (windows path)");
} else {
  const path_2 = getPath("./example////", "config.js");
  expect_to_be_equal(path_2, "./example/config.js", "Check if it returns an accurate path (unix-like path)");
}
console.log("-".repeat(30));
console.log(
  "\x1b[34m[--Testing function:\x1b[0m \x1b[36mis_includes--]\x1b[0m",
);
/*
  ---------------
  Check if config_object includes allowed properties
  * Expected result: true
  ---------------
*/
const config_object = await import("../example/config.js");
expect_to_be_equal(is_includes(config_object.default), true, "Check if config_object includes allowed properties");
/*
  ---------------
  Check if config_object does not include allowed properties
  * Expected result: false
  ---------------
*/
config_object.default.id = 101;
expect_to_be_equal(is_includes(config_object.default), false, "Check if config_object does not include allowed properties");

console.log("-".repeat(30));
console.log(
  "\x1b[34m[--Testing function:\x1b[0m \x1b[36mcheck_type_value--]\x1b[0m",
);
