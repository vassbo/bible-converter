import path from "path"
import { converters, detectFileType } from "./lib/util/detecter"
import { getFilesInFolder, getStat, isFolder, readFile } from "./lib/util/file"

export default async function convertBibles(folderPath: string, outputFolder: string) {
    const excluded = [".lnk", ".zip", ".png", ".jpg"]
    const filesInFolder = getFilesInFolder(folderPath)

    // WordProject
    const wordProject = filesInFolder.find((a) => a.endsWith("index.htm"))
    if (wordProject) {
        await convertBible().auto(wordProject, outputFolder)
        return
    }

    await Promise.all(
        filesInFolder.map(async (fileOrFolderPath) => {
            if (excluded.find((a) => fileOrFolderPath.endsWith(a))) return

            if (isFolder(fileOrFolderPath)) {
                convertBibles(fileOrFolderPath, path.join(outputFolder, path.basename(fileOrFolderPath)))
                return
            }

            await convertBible().auto(fileOrFolderPath, outputFolder)
        })
    )
}

export function convertBible() {
    return { auto, ...converters }
}

async function auto(filePath: string, outputFolder: string) {
    const size = getStat(filePath).size
    if (size > 28000000) {
        console.log("Too large file:", path.basename(filePath), size)
        return
    }

    const content = readFile(filePath)
    const type = detectFileType(content)

    if (!type) {
        console.log("Could not find type for file:", path.basename(filePath))
        return
    }

    console.log(`Parsing ${type.toUpperCase()}: "${path.basename(filePath)}"!`)
    await converters[type](filePath, outputFolder, content)
}
