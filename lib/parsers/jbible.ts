// https://www.ph4.org/b4_mobi.php?q=mac

import { Bible, Book, Chapter, Metadata } from "../Bible"
import { JBibleBible, JBibleBooks, JBibleSource } from "../types/JBible"
import { flatVersesToChapters } from "../util/books"
import { initDB } from "../util/db"
import { bibleParser } from "../util/helper"

export async function parseJBible(filePath: string, outputFolderPath: string) {
    return [await bibleParser(filePath, outputFolderPath, parser)]
}

async function parser(filePath: string) {
    const db = await initDB(filePath)

    const bibleTable: JBibleBible = (await (await db.getTable("bible")).values())[0]
    const booksTable: JBibleBooks[] = await (await db.getTable("books")).values()
    const versesTable: JBibleSource[] = await (await db.getTable(bibleTable.source)).values()

    let books: Book[] = []
    booksTable.forEach((bookData, i) => {
        const versesData = versesTable.filter((a) => a.book === bookData.id_book)
        let chapters: Chapter[] = flatVersesToChapters(versesData, { verseNumber: "id_verse", text: "body" })

        books.push({ number: bookData.id_book || i + 1, name: bookData.fname, chapters })
    })

    const metadata: Metadata = {
        title: bibleTable.name,
        publisher: bibleTable.author
    }

    return { name: metadata.title, metadata, books } as Bible
}
