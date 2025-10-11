import fileExists from "./file_exists.js";
import getPath from "./get_path.js";
import is_includes from "./is_includes.js";
import check_type_value from "./check_value_type.js";

/*
  ---------------
  Gets properties info
  < get_properies_info >
  * -> return an object
  * -> throws an error if file is not found
  ---------------
*/
const config_file_path = getPath(process.argv[2]);
const is_file_exists = await fileExists(config_file_path);
async function get_properties_info(obj, arr) {
  if (is_file_exists) {
    try {
      let is_allowed = is_includes(obj, arr),
        unknown_props = [];
      if (obj) {
        for (const key of Object.keys(obj)) {
          if (!arr.includes(key)) {
            is_allowed = false;
            unknown_props.push(key);
          }
        }
        return {
          is_allowed,
          unknown_props,
          invalid_types: check_type_value(obj, arr),
        };
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    throw new Error("FILE DOES NOT EXIST!");
  }
};
export default get_properties_info;