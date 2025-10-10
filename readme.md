# DocMerge

**DocMerge** combines multiple topic files into one single document for easy documentation management.

## Usage

1. Organize topics in a folder:

```
js/
 ├── config.js
 ├── 1-variable.mdx
 ├── 2-console.mdx
 ├── 3-conditionals.mdx
```

2. Set output file in `config.js`.

3. Run:

```bash
node merge.js <topics folder>
```

## Output

Generates a single combined file in the target folder.

> [!NOTE]
> Orders files by filename (prefix with numbers)

> [!TIP]
> Only specific configuration properties are allowed in config.js (such as **imports**, **frontmatter**, **outputFile**, **outputDir**, and **order**)
> this limitation is intentional to avoid confusion and keep DocMerge predictable and easy to use.