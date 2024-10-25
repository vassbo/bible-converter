// https://www.ph4.org/b4_index.php?q=mybible

import { Bible, Book, Chapter, Metadata } from "../Bible"
import { MyBibleBooks, MyBibleInfo, MyBibleVerses } from "../types/MyBible"
import { flatVersesToChapters } from "../util/books"
import { initDB } from "../util/db"
import { bibleParser } from "../util/helper"

export async function parseMyBible(filePath: string, outputFolderPath: string) {
    return [await bibleParser(filePath, outputFolderPath, parser)]
}

async function parser(filePath: string) {
    const db = await initDB(filePath)

    const booksTable: MyBibleBooks[] = await (await db.getTable("books")).values()
    const versesTable: MyBibleVerses[] = await (await db.getTable("verses")).values()

    let books: Book[] = []
    booksTable.forEach((bookData, i) => {
        const versesData = versesTable.filter((a) => a.book_number === bookData.book_number)
        let chapters: Chapter[] = flatVersesToChapters(versesData, {})

        // get book number from name as stored number is often incorrect
        let number = bookNames.indexOf(bookData.short_name) + 1
        if (!number) number = Number(bookData.book_number) || i + 1
        books.push({ number, name: bookData.long_name, chapters })
    })

    const info: MyBibleInfo[] = await (await db.getTable("info")).values()
    const metadata: Metadata = {
        title: getMetadata("description"),
        language: getMetadata("language")
    }

    return { name: metadata.title, metadata, books } as Bible

    function getMetadata(key: string) {
        return (info.find((a) => a.name === key)?.value || "") as string
    }
}

const bookNames = [
    "Gn",
    "Ex",
    "Lv",
    "Nb",
    "Dt",
    "Js",
    "Jg",
    "Rt",
    "1S",
    "2S",
    "1R",
    "2R",
    "1Ch",
    "2Ch",
    "Esd",
    "Ne",
    "Est",
    "Jb",
    "Ps",
    "Pr",
    "Ec",
    "Ct",
    "Es",
    "Jr",
    "La",
    "Ez",
    "Da",
    "Os",
    "Jl",
    "Am",
    "Ab",
    "Jon",
    "Mi",
    "Na",
    "Ha",
    "So",
    "Ag",
    "Za",
    "Ma",
    "Mt",
    "Mc",
    "Lc",
    "Jn",
    "Ac",
    "Rm",
    "1Co",
    "2Co",
    "Ga",
    "Ep",
    "Ph",
    "Col",
    "1Th",
    "2Th",
    "1Ti",
    "2Ti",
    "Tt",
    "Phm",
    "He",
    "Jc",
    "1P",
    "2P",
    "1Jn",
    "2Jn",
    "3Jn",
    "Jd",
    "Ap"
]
