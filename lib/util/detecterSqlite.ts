import path from "path"
import { parseEBibleDB } from "../parsers/ebibleDB"
import { parseMyBible } from "../parsers/mybible"
import { getTableKeys } from "./db"
import { copyrightStop } from "./detecter"
import { parseJBible } from "../parsers/jbible"

type SQLiteTypes = "easyworship" | "mybible" | "ebible" | "jbible"

export async function detectSqlite(filePath: string, outputFolderPath: string) {
    const keys = await getTableKeys(filePath)
    const type = detectSqliteType(keys)

    if (!type) {
        console.log("Could not find type for file:", path.basename(filePath))
        console.log(keys)
        return []
    }

    console.log(`Sqlite ${type.toUpperCase()}: "${path.basename(filePath)}"!`)
    return await converters[type](filePath, outputFolderPath)
}

function detectSqliteType(tables: { [key: string]: any }): SQLiteTypes | null {
    if (tables.header?.plugin_version && tables.words?.verse_info) return "easyworship"
    if (tables.verses?.book_number && tables.books?.long_name) return "mybible"
    if (tables.verse?.canon_order && tables.cross_reference?.point_1_id) return "ebible"
    if (tables.bible?.ot && tables.books?.fname) return "jbible"

    return null
}

type ParserFunction = (filePath: string, outputFolderPath: string, fileContent?: string) => Promise<string[]>
export const converters: { [key in SQLiteTypes]: ParserFunction } = {
    easyworship: copyrightStop,
    mybible: parseMyBible,
    ebible: parseEBibleDB,
    jbible: parseJBible
}
