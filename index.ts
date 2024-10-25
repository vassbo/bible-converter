import path from "path"
import { checkFolderSystem, converters, detectFileType } from "./lib/util/detecter"
import { getFilesInFolder, getStat, isFolder, readFile } from "./lib/util/file"

/**
 * Convert a folder of files/folders into multiple JSON Bibles
 */
export default async function convertBibles(folderPath: string, outputFolder: string) {
    const excluded = [".lnk", ".zip", ".png", ".jpg"]
    const filesInFolder = getFilesInFolder(folderPath)

    /// FOLDER SYSTEMS ///

    const folderSystemPath = checkFolderSystem(filesInFolder)
    if (folderSystemPath) {
        await convertBible().auto(folderSystemPath, outputFolder)
        return
    }

    /// CHECK EACH FILE/FOLDER ///

    await Promise.all(
        filesInFolder.map(async (fileOrFolderPath) => {
            if (excluded.find((a) => fileOrFolderPath.endsWith(a))) return

            if (isFolder(fileOrFolderPath)) {
                await convertBibles(fileOrFolderPath, path.join(outputFolder, path.basename(fileOrFolderPath)))
                return
            }

            await convertBible().auto(fileOrFolderPath, outputFolder)
        })
    )
}

/**
 * Convert a single file into one or more JSON Bibles
 */
export function convertBible() {
    return { auto, ...converters }
}

/////

async function auto(filePath: string, outputFolder: string) {
    const size = getStat(filePath).size
    if (size > 28000000) {
        console.log("Too large file:", path.basename(filePath), size)
        return []
    }

    const content = readFile(filePath)
    const type = detectFileType(content)

    if (!type) {
        console.log("Could not find type for file:", path.basename(filePath))
        // console.log(content.slice(0, 100))
        return []
    }

    console.log(`Parsing ${type.toUpperCase()}: "${path.basename(filePath)}"!`)
    return await converters[type](filePath, outputFolder, content)
}
