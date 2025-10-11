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
  hook: "Function",
};
/*
  ---------------
  Checks valid types
  < check_type_value >
  * -> return array of objects
  ---------------
*/
function check_type_value(obj, arr) {
  const invalid_type_value = [];
  for (const prop of arr) {
    if (prop === "imports" || prop === "order") {
      if (obj.hasOwnProperty(prop) && !Array.isArray(obj[prop])) {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    } else if (prop !== "imports" && prop !== "order" && prop !== "hook") {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "string") {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    } else if (prop === "hook") {
      if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "function") {
        invalid_type_value.push({
          prop_name: prop,
          has_type: typeof obj[prop],
          expected_type: valid_types[prop],
        });
      }
    }
  }
  return invalid_type_value;
};
export default check_type_value;