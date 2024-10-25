import path from "path"
import { copyrightStop } from "./detecter"
import { getTableKeys } from "./mdb"

type SQLiteTypes = "bibleshow"

export async function detectMDB(filePath: string, outputFolderPath: string) {
    const keys = getTableKeys(filePath)
    const type = detectSqliteType(keys)

    if (!type) {
        console.log("Could not find type for file:", path.basename(filePath))
        console.log(keys)
        return []
    }

    console.log(`MicrosoftAccessDatabase ${type.toUpperCase()}: "${path.basename(filePath)}"!`)
    return await converters[type](filePath, outputFolderPath)
}

function detectSqliteType(tables: { [key: string]: any }): SQLiteTypes | null {
    if (tables.Bible?.Scripture && tables.Structure?.FullTitle) return "bibleshow"

    return null
}

type ParserFunction = (filePath: string, outputFolderPath: string, fileContent?: string) => Promise<string[]>
export const converters: { [key in SQLiteTypes]: ParserFunction } = {
    bibleshow: copyrightStop
}
