import { Bible } from "../Bible"
import { BebliaBible } from "../types/Beblia"
import { parseBooks } from "../util/books"
import { getSpecificFilesInFolder } from "../util/file"
import { bibleParser, getMetadata, parseBibles } from "../util/helper"
import { toArray, xml2json } from "../util/xml"

export async function parseBeblia(filePath: string, outputFolderPath: string, fileContent?: string) {
    await bibleParser(filePath, outputFolderPath, fileContent, parser)
}

export function parseBebliaFolder(inputFolderPath: string, outputFolderPath: string) {
    const bibleList = getSpecificFilesInFolder(inputFolderPath, [".xml"])
    parseBibles(bibleList, outputFolderPath, parser)
}

async function parser(content: string, name: string = "") {
    const data = await xml2json(content)
    const bibleContent: BebliaBible = data.bible

    let metadata = getMetadata(bibleContent, "testament")

    // some files might be missing <testament>
    const testaments = toArray(bibleContent.testament)
    const bookList = testaments.length ? toArray(testaments.map(({ book }) => book).flat()) : toArray(bibleContent.book || [])

    const books = parseBooks(bookList, {
        tags: { chapter: "chapter", verse: "verse" },
        numberKeys: ["number"]
    })

    return { name, metadata, books } as Bible
}
