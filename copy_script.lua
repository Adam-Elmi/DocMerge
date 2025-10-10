local function getPlatform()
    local sep = package.config:sub(1, 1)

    if sep == "\\" then
        return "win"
    else
        return "unix-like"
    end
end
local platform = getPlatform()


local replace_table = { [[
if (import.meta.url === `file://${process.argv[1]}`) {
    await generate_file();
}
]],
    [[const properties_info =
  import.meta.url === `file://${process.argv[1]}` &&
  await get_properies_info();]],
[[const config_object =
  import.meta.url === `file://${process.argv[1]}` &&
  await import(config_file_path);]],
[[const is_file_exists =
  import.meta.url === `file://${process.argv[1]}` &&
  await fileExists(config_file_path);]],
[[const config_file_path =
  import.meta.url === `file://${process.argv[1]}` && process.argv[2]
    ? getPath(process.argv[2])
    : "";]]
}

local function get_content(path)
    local file = io.open(path, "r")
    if file then
        local content = file:read("*a")
        if content then
            content = string.gsub(content, "await generate_file%(%);", replace_table[1])
            content = string.gsub(content, "const properties_info = await get_properies_info%(%);", replace_table[2])
            content = string.gsub(content, "const config_object = await import%(config_file_path%)%;", replace_table[3])
            content = string.gsub(content, "const is_file_exists = await fileExists%(config_file_path%)%;", replace_table[4])
            content = string.gsub(content, "const config_file_path = getPath%(process%.argv%[%d+%]%)%;", replace_table[5])
            return content
        else
            print("EMPTY - NO CONTENT")
        end
        file:close()
    else
        print("FILE IS NOT FOUND!")
    end
end

if platform == "win" then
    local file = io.open(".\\merge.js", "w")
    if file then
        file:write(get_content(".\\merge.js"))
        file:close()
    end
else
    local file = io.open("./tests/merge.test.js", "w")
    if file then
        file:write(get_content("./merge.js"))
        file:close()
    end
end
