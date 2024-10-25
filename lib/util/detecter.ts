import { parseBeblia } from "../parsers/beblia"
import { parseBibleQuote } from "../parsers/biblequote"
import { parseOpenSong } from "../parsers/opensong"
import { parseOSIS } from "../parsers/osis"
import { parseSoftProjector } from "../parsers/softprojector"
import { detectSqlite } from "./detecterSqlite"
import { parseWordProject } from "../parsers/wordproject"
import { parseZefania } from "../parsers/zefania"
import { detectMDB } from "./detecterMDB"
import { parseIBible } from "../parsers/ibible"

type FileTypes = "zefania" | "osis" | "opensong" | "beblia" | "softprojector" | "wordproject" | "biblequote" | "ibible" | "sqlite" | "mdb"

export function detectFileType(content: string): FileTypes | null {
    // XML
    if (content.includes("XMLBIBLE") && content.includes("BIBLEBOOK")) return "zefania"
    if (content.includes("osisText") && content.includes("osisID")) return "osis"
    if (content.includes("bible") && content.includes("b n=") && content.includes("v n=")) return "opensong"
    if (content.includes("bible") && content.includes("verse number=")) return "beblia"
    // TXT (Custom)
    if (content.includes("spDataVersion:") && content.includes("C001V001")) return "softprojector"
    // HTM(L)
    if (content.includes('<li><a title="') && content.includes("Wordproject")) return "wordproject"
    if (content.includes("PathName") && content.includes("BibleName")) return "biblequote"
    if (content.includes("ibibles.net")) return "ibible"

    // SQLITE
    if (content.includes("SQLite")) return "sqlite"
    // Microsoft Access Database
    if (content.includes("Standard Jet DB")) return "mdb"

    return null
}

type ParserFunction = (filePath: string, outputFolderPath: string, fileContent?: string) => Promise<string[]>
export const converters: { [key in FileTypes]: ParserFunction } = {
    zefania: parseZefania,
    osis: parseOSIS,
    opensong: parseOpenSong,
    beblia: parseBeblia,
    softprojector: parseSoftProjector,
    wordproject: parseWordProject,
    biblequote: parseBibleQuote,
    ibible: parseIBible,

    sqlite: detectSqlite,
    mdb: detectMDB
}

/////

const folderSystemFiles = ["index.htm", "Bibleqt.ini"]
export function checkFolderSystem(filesInFolder: string[]) {
    return filesInFolder.find((a) => folderSystemFiles.find((name) => a.endsWith(name)))
}

/////

// not sure about all file types, might have to get permission for the more "closed" ones
export async function copyrightStop(_: string, __: string) {
    console.log("Cannot convert this file due to copyright!")
    return []
}
