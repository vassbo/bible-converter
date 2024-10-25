// https://download.ibibles.net/

import NodeHTMLParser from "node-html-parser"
import path from "path"
import { Bible, Book, Chapter } from "../Bible"
import { flatVersesToChapters } from "../util/books"
import { jsonToFile, readFile } from "../util/file"

// @ts-ignore
const { parse } = NodeHTMLParser

export async function parseIBible(filePath: string, outputFolderPath: string, fileContent?: string) {
    if (!fileContent) fileContent = readFile(filePath)

    const extension = path.extname(filePath)
    const name = path.basename(filePath, extension)

    const json = parser(path.dirname(filePath), fileContent)
    return [jsonToFile(outputFolderPath, name, json)]
}

function parser(folderPath: string, content: string) {
    const root = parse(content)

    const bookListOT: any[] = []
    const bookListNT: any[] = []
    const links = root.querySelectorAll("tr").slice(1)
    links.map((link) => {
        const names = link.querySelectorAll("td")
        const small = link.querySelectorAll("small")

        const linksOT = small[0].querySelectorAll("a")
        const linksNT = small[1]?.querySelectorAll("a")

        let linkElem = linksOT[0]
        if (linkElem.getAttribute("name")) linkElem = linksOT[1]
        let hrefOT = linkElem?.getAttribute("href") || ""
        hrefOT = hrefOT.slice(0, hrefOT.indexOf("#"))

        let hrefNT = linksNT?.[0].getAttribute("href") || ""
        hrefNT = hrefNT.slice(0, hrefNT.indexOf("#"))

        let nameOT = names[0]?.textContent?.replace(".", "").trim()
        let nameNT = names[2]?.textContent?.replace(".", "").trim()

        if (nameOT) bookListOT.push({ href: hrefOT, name: nameOT })
        if (nameNT) bookListNT.push({ href: hrefNT, name: nameNT })
    })
    const bookList: any[] = [...bookListOT, ...bookListNT]

    let books: Book[] = []
    bookList.forEach(getBook)
    function getBook({ href, name }: any, i: number) {
        const index = readFile(path.join(folderPath, href))

        const rootContent = index.slice(index.indexOf("<br><br>"))
        const bookContent = extractVerses(rootContent)

        let chapters: Chapter[] = flatVersesToChapters(bookContent, {})

        books.push({ number: i + 1, name, chapters })
    }

    let bibleName: string = root.querySelector("title")?.textContent?.trim() || ""
    return { name: bibleName, metadata: {}, books } as Bible

    function extractVerses(htmlContent: string) {
        const versePattern = /<small>(\d+):(\d+)<\/small>\s*([^<]+)<br><br>/g
        const verses = []
        let match

        while ((match = versePattern.exec(htmlContent)) !== null) {
            const [_, chapter, verse, text] = match
            verses.push({
                chapter: parseInt(chapter, 10),
                verse: parseInt(verse, 10),
                text: text.trim()
            })
        }

        return verses
    }
}
