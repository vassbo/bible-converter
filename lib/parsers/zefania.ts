// https://sourceforge.net/projects/zefania-sharp/files/Bibles/
// https://osdn.net/projects/sfnet_zefania-sharp/releases/
// https://www.ph4.org/b4_mobi.php?q=zefania
// https://www.ajaytheceo.com/digital/bibles

import { Bible } from "../Bible"
import { ZefaniaBible } from "../types/Zefania"
import { parseBooks } from "../util/books"
import { getSpecificFilesInFolder } from "../util/file"
import { bibleContentParser, getMetadata, parseBibles } from "../util/helper"
import { toArray, xml2json } from "../util/xml"

export async function parseZefania(filePath: string, outputFolderPath: string, fileContent?: string) {
    return [await bibleContentParser(filePath, outputFolderPath, fileContent, parser)]
}

export function parseZefaniaFolder(inputFolderPath: string, outputFolderPath: string) {
    const bibleList = getSpecificFilesInFolder(inputFolderPath, [".xml"])
    parseBibles(bibleList, outputFolderPath, parser)
}

async function parser(content: string, name: string = "") {
    const data = await xml2json(content)
    const bibleContent: ZefaniaBible = data.XMLBIBLE

    let metadata = getMetadata(bibleContent.INFORMATION)
    name = name || metadata?.title || ""

    const books = parseBooks(toArray(bibleContent.BIBLEBOOK), {
        tags: { chapter: "CHAPTER", verse: "VERS" },
        numberKeys: ["bnumber", "cnumber", "vnumber"],
        bookNameKey: "bname"
    })

    return { name, metadata, books } as Bible
}
