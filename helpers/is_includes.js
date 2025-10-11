/*
  ---------------
  Checks if config file includes allowed properties
  < is_includes >
  * -> returns a boolean value
  ---------------
*/
function is_includes(obj, arr) {
  for (const key of Object.keys(obj)) {
    if (Array.isArray(arr) && !arr.includes(key)) {
      return false;
    }
  }
  return true;
};
export default is_includes;