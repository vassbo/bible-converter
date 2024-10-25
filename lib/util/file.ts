import fs from "fs"
import path from "path"

export function jsonToFile(folderPath: string, name: string, json: any) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })

    name = formatToFileName(name) + ".json"
    const p = path.join(folderPath, name)

    fs.writeFileSync(p, JSON.stringify(json))
    return p
}

function formatToFileName(name: string = "") {
    // remove illegal file name characters
    name = name.trim().replace(/[/\\?%*:|"<>╠]/g, "")
    // max 255 length
    if (name.length > 255) name = name.slice(0, 255)

    return name
}

/////

export function getSpecificFilesInFolder(folderPath: string, extensions: string[]) {
    extensions = extensions.map((ext) => ext.toLowerCase())
    const fileNames = fs.readdirSync(folderPath).filter((name) => extensions.find((ext) => name.toLowerCase().endsWith(ext)))
    const fullPaths = fileNames.map((name) => path.join(folderPath, name))
    return fullPaths
}

export function getFilesInFolder(folderPath: string, fullPaths: boolean = true) {
    let fileNames = fs.readdirSync(folderPath)
    if (fullPaths) fileNames = fileNames.map((name) => path.join(folderPath, name))
    return fileNames
}

export function getStat(filePath: string) {
    return fs.statSync(filePath)
}

export function isFolder(filePath: string) {
    return getStat(filePath).isDirectory()
}

export function readFile(filePath: string, encoding: BufferEncoding = "utf8") {
    return fs.readFileSync(filePath, encoding)
}
