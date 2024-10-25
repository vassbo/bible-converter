import path from "path"
import { Bible } from "../Bible"
import { jsonToFile, readFile } from "./file"

type ParserFunction = (content: string, name?: string) => Promise<Bible>
export async function parseBibles(inputFiles: string[], outputPath: string, parser: ParserFunction) {
    const bibles = inputFiles.length
    console.log("Bibles:", bibles)

    for (let i = 0; i < bibles; i++) {
        const p = inputFiles[i]
        const extension = path.extname(p)
        const name = path.basename(p, extension)

        let fileContent = readFile(p)
        if (!fileContent) return

        console.log(`Parsing ${i + 1}: "${name}"!`)
        const json = await parser(fileContent, name)

        jsonToFile(outputPath, name, json)
    }

    console.log("Finished:", bibles)
}

export async function bibleParser(filePath: string, outputFolderPath: string, parser: ParserFunction) {
    const extension = path.extname(filePath)
    const name = path.basename(filePath, extension)

    const json = await parser(filePath)
    return jsonToFile(outputFolderPath, name, json)
}

export async function bibleContentParser(filePath: string, outputFolderPath: string, fileContent: string | undefined, parser: ParserFunction) {
    if (!fileContent) fileContent = readFile(filePath)

    const extension = path.extname(filePath)
    const name = path.basename(filePath, extension)

    const json = await parser(fileContent, name)
    return jsonToFile(outputFolderPath, name, json)
}

export function getMetadata<T>(metadata: T, excludeTag?: string) {
    if (typeof metadata !== "object") return {} as T

    let meta: { [key: string]: string } = clone(metadata as any)
    Object.entries(meta).forEach(([key, value]) => {
        if (key === excludeTag || typeof value !== "string") return delete meta[key]

        meta[key] = value.trim()
        if (!meta[key].length) delete meta[key]
    })

    return meta as T
}

/////

export function clone<T>(object: T): T {
    if (typeof object !== "object") return object
    return JSON.parse(JSON.stringify(object))
}
