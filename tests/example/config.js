import fs from "node:fs/promises";
import { getPath } from "../../helpers/getPath.js";
export default {
  imports: ["import somcheat from 'somcheat'"],
  frontmatter: `---
  name: Adam Elmi Eid
  id: 101
---
  `,
  outputFile: "js.mdx",
  outputDir: "./tests/generated",
  order: [],
  hook: async(path, files) => {
    for (const file of files) {
      const content = await fs.readFile(getPath(process.argv[2], file));
      if(file === "1.step_one.md") {
        await fs.appendFile(path, `<somcheat>\n${content}` + "\n");
      } else if(file === "6.step_six.md") {
        await fs.appendFile(path, `${content}\n</somcheat>`);
      }
      else {
        await fs.appendFile(path, content + "\n");
      }
    }
  }
}