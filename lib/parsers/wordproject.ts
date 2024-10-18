import NodeHTMLParser from "node-html-parser"
import path from "path"
import { Bible, Book, Chapter, Verse } from "../Bible"
import { getFilesInFolder, jsonToFile, readFile } from "../util/file"

// @ts-ignore
const { parse } = NodeHTMLParser

export async function parseWordProject(filePath: string, outputFolderPath: string, fileContent?: string) {
    if (!fileContent) fileContent = readFile(filePath)

    const extension = path.extname(filePath)
    const name = path.basename(filePath, extension)

    const json = parser(path.dirname(filePath), fileContent)
    jsonToFile(outputFolderPath, name, json)
}

export function parseWordProjectFolder(inputFolderPath: string, outputFolderPath: string) {
    const folders = getFilesInFolder(inputFolderPath, false)
    console.log("Bibles:", folders.length)

    folders.forEach((folderName, bibleIndex) => {
        const folderPath = path.join(inputFolderPath, folderName, folderName)
        const index = readFile(path.join(folderPath, "index.htm"))

        const extension = path.extname(folderPath)
        const name = path.basename(folderPath, extension)

        console.log(`Parsing ${bibleIndex + 1}: "${name}"!`)
        const json = parser(folderPath, index)
        jsonToFile(outputFolderPath, name, json)
    })

    console.log("Finished:", folders.length)
}

function parser(folderPath: string, indexContent: string) {
    const root = parse(indexContent)

    let bibleName: string = root.querySelector("h1")?.textContent?.trim() + "_" + path.basename(folderPath).replace("_new", "")

    const links = root.querySelectorAll("li")
    const bookList: any[] = []
    links.map((link) => {
        let href = link.querySelector("a")?.getAttribute("href")
        if (href?.includes("http")) return
        let name = link.textContent.trim()
        if (!name) return

        bookList.push({ href, name })
    })

    let books: Book[] = []
    bookList.forEach(getBook)
    function getBook({ href, name }: any, i: number) {
        const index = readFile(path.join(folderPath, href))
        const root = parse(index)

        const folderName = href.slice(0, href.indexOf("/"))
        const chapterLinks = [href, ...root.querySelectorAll(".chap").map((a) => path.join(folderName, a.getAttribute("href")!.replace("#0", "")))]

        // let chapterFiles: string[] = getFilesInFolder(path.join(INPUT, folderName), [".htm"])

        let chapters: Chapter[] = []
        chapterLinks.forEach((chapterFile) => {
            const chapterContent = readFile(path.join(folderPath, chapterFile))
            // const root = parse(index)
            // const verseElem = root.querySelector(".textBody")?.innerHTML!

            let verses: Verse[] = []
            chapterContent.split('class="verse"').forEach((verse, i) => {
                if (i === 0) return

                let textStart = verse.indexOf("</span>") + 7
                let textEnd = verse.indexOf("\n")
                if (verse.indexOf("</p>") > -1 && verse.indexOf("</p>") < textEnd) textEnd = verse.indexOf("</p>")
                if (verse.indexOf("<br />") > -1 && verse.indexOf("<br />") < textEnd) textEnd = verse.indexOf("<br />")

                let number = Number(verse.slice(verse.indexOf("id=") + 3, verse.indexOf(">")).replaceAll('"', "")) || i
                let text = verse.slice(textStart, textEnd).trim()

                verses.push({ number, text })
            })

            // const verses = root.querySelectorAll(".verse").map((a, i) => ({ number: Number(a.getAttribute("id")) || i + 1, value: a.textContent }))

            let chapterIndex = chapterFile.slice(chapterFile.indexOf("/") + 1, chapterFile.indexOf("."))
            chapters.push({ number: chapterIndex, verses })
        })

        books.push({ number: Number(folderName) || i + 1, name, chapters })
    }

    return { name: bibleName, metadata: {}, books } as Bible
}
