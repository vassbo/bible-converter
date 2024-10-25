// https://www.ph4.org/b4_index.php?q=bq

import path from "path"
import { Bible, Book, Chapter, Metadata, Verse } from "../Bible"
import { jsonToFile, readFile } from "../util/file"
import { IniParser } from "../util/ini"

export async function parseBibleQuote(filePath: string, outputFolderPath: string, fileContent?: string) {
    if (!fileContent) fileContent = readFile(filePath)

    const extension = path.extname(filePath)
    const parsed = new IniParser(fileContent)
    const name = parsed.getStringValue("BibleName") || path.basename(filePath, extension)

    const json = parser(path.dirname(filePath), parsed)
    return [jsonToFile(outputFolderPath, name, json)]
}

function parser(folderPath: string, parsed: IniParser) {
    const bookList: any[] = []
    const names = parsed.getArrayValue("FullName")
    const paths = parsed.getArrayValue("PathName")

    paths.forEach((path: string, i: number) => {
        bookList.push({ href: path, name: names[i] })
    })

    let books: Book[] = []
    bookList.forEach(getBook)
    function getBook({ href, name }: any, i: number) {
        const index = readFile(path.join(folderPath, href))
        const rootChapters = index.split("<h4>").slice(1)

        let chapters: Chapter[] = []
        rootChapters.forEach((chapterContent, i) => {
            // 1</h4>\n<p><sup>1</sup> text\n<p><sup>2</sup> text\n
            const rootVerses = chapterContent.split("<sup>").slice(1)

            let verses: Verse[] = []
            rootVerses.forEach((verse, i) => {
                // 1</sup> text\n<p>
                let textStart = verse.indexOf("</sup>") + 6
                let textEnd = verse.indexOf("\n")

                let number = Number(verse.slice(0, verse.indexOf("</sup>"))) || i + 1
                let text = verse.slice(textStart, textEnd).trim()

                verses.push({ number, text })
            })

            let chapterIndex = Number(chapterContent.slice(0, chapterContent.indexOf("</h4>"))) || i + 1
            chapters.push({ number: chapterIndex, verses })
        })

        let bookIndex = Number(href.slice(0, href.indexOf("_"))) || i + 1
        books.push({ number: bookIndex, name, chapters })
    }

    const name = parsed.getStringValue("BibleName")
    const metadata: Metadata = {
        title: name,
        identifier: parsed.getStringValue("BibleShortName"),
        copyright: parsed.getStringValue("Copyright")
    }

    return { name, metadata, books } as Bible
}
