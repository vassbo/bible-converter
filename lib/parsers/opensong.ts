import { Bible } from "../Bible"
import { OpenSongBible } from "../types/OpenSong"
import { parseBooks } from "../util/books"
import { getSpecificFilesInFolder } from "../util/file"
import { bibleParser, parseBibles } from "../util/helper"
import { toArray, xml2json } from "../util/xml"

export async function parseOpenSong(filePath: string, outputFolderPath: string, fileContent?: string) {
    await bibleParser(filePath, outputFolderPath, fileContent, parser)
}

export function parseOpenSongFolder(inputFolderPath: string, outputFolderPath: string) {
    const bibleList = getSpecificFilesInFolder(inputFolderPath, [".xml", ".xmm"])
    parseBibles(bibleList, outputFolderPath, parser)
}

async function parser(content: string, name: string = "") {
    // add root node to end because it's missing sometimes
    content += "</bible>"

    const data = await xml2json(content)
    const bibleContent: OpenSongBible = data.bible

    const books = parseBooks(toArray(bibleContent.b), {
        tags: { chapter: "c", verse: "v" },
        numberKeys: ["n"]
    })

    return { name, books } as Bible
}
