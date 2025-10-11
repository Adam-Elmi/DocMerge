import fs from "node:fs/promises";
/*
  ---------------
  Adds contents to output file
  < add_contents >
  * -> throws an error if path is incorrect
  ---------------
*/
async function add_contents(path, files, obj) {
  if (path && Array.isArray(files) && files.length > 0) {
    if (obj.frontmatter) {
      await fs.appendFile(path, obj.frontmatter + "\n");
    }
    if (
      Array.isArray(obj.imports) &&
      obj.imports.length > 0
    ) {
      for (let i = 0; i < obj.imports.length; i++) {
        await fs.appendFile(path, obj.imports[i] + "\n" + (i === (obj.imports.length - 1) ? "\n" : ""));
      }
    }
    if(obj.hook) {
      return obj.hook(path, files);
    } else {
      for (const file of files) {
        const content = await fs.readFile(getPath(process.argv[2], file));
        await fs.appendFile(path, content + "\n");
      }
    }
  } else {
    throw new Error("PATH IS NOT DEFINED OR ARGUMENT 'FILES' IS EMPTY");
  }
};
export default add_contents;