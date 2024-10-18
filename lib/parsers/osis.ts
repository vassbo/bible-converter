import { Bible } from "../Bible"
import { OSISBible } from "../types/OSIS"
import { getBookObject, parseBooks } from "../util/books"
import { getSpecificFilesInFolder } from "../util/file"
import { bibleParser, getMetadata, parseBibles } from "../util/helper"
import { toArray, xml2json } from "../util/xml"

export async function parseOSIS(filePath: string, outputFolderPath: string, fileContent?: string) {
    await bibleParser(filePath, outputFolderPath, fileContent, parser)
}

export function parseOSISFolder(inputFolderPath: string, outputFolderPath: string) {
    const bibleList = getSpecificFilesInFolder(inputFolderPath, [".xml"])
    parseBibles(bibleList, outputFolderPath, parser)
}

async function parser(content: string, name: string = "") {
    const data = await xml2json(content)
    const bibleContent: OSISBible = data.osis.osisText

    let metadata = getMetadata(bibleContent.header?.work)
    const bookList = toArray(bibleContent.div).filter((a) => a.type === "book")

    const books = parseBooks(bookList, {
        tags: { chapter: "chapter", verse: "verse" },
        numberKeys: ["osisID"],
        bookObject: defaultBookNames
    })

    return { name, metadata, books } as Bible
}

// BOOK NAMES //

const defaultBookNames = getBookObject([
    "Gen",
    "Exod",
    "Lev",
    "Num",
    "Deut",
    "Josh",
    "Judg",
    "Ruth",
    "1Sam",
    "2Sam",
    "1Kgs",
    "2Kgs",
    "1Chr",
    "2Chr",
    "Ezra",
    "Neh",
    "Esth",
    "Job",
    "Ps",
    "Prov",
    "Eccl",
    "Song",
    "Isa",
    "Jer",
    "Lam",
    "Ezek",
    "Dan",
    "Hos",
    "Joel",
    "Amos",
    "Obad",
    "Jonah",
    "Mic",
    "Nah",
    "Hab",
    "Zeph",
    "Hag",
    "Zech",
    "Mal",

    "Matt",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Rom",
    "1Cor",
    "2Cor",
    "Gal",
    "Eph",
    "Phil",
    "Col",
    "1Thess",
    "2Thess",
    "1Tim",
    "2Tim",
    "Titus",
    "Phlm",
    "Heb",
    "Jas",
    "1Pet",
    "2Pet",
    "1John",
    "2John",
    "3John",
    "Jude",
    "Rev"
])
