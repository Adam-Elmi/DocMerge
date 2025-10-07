import { fileExists } from "../../merge.js";

function expect_to_be(value1, value2) {
  if (value1 === value2) {
    return "\x1b[32mTEST PASSED:\x1b[0m \x1b[36mTRUE\x1b[0m" 
  };
  return "\x1b[31mTEST FAILED:\x1b[0m \x1b[35mFALSE\x1b[0m" ;
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
const is_file_1_exists = await fileExists("./tests/doc_test/config.js");
console.log(expect_to_be(is_file_1_exists, true));
/*
  ---------------
  Check if file exists using a fake path
  * Expected result: false
  ---------------
*/
const is_file_2_exists = await fileExists("./example/docs/config.js");
console.log(expect_to_be(is_file_2_exists, false));
/*
  ---------------
  Check if file exists if path is not defined
  * Expected result: false
  ---------------
*/
const is_file_3_exists = await fileExists();
console.log(expect_to_be(is_file_3_exists, false));
console.log("-".repeat(30));