// https://ebible.org/Scriptures/
// https://ebible.org/find/
// giant_bible.sqlite: https://comfybox.floofey.dog/resources/project-giant-bible-db-v1-0-0.52/

import { Bible, Book, Metadata } from "../Bible"
import { GiantKey, GiantVerse, GiantVersion } from "../types/EBibleDB"
import { getBookObject } from "../util/books"
import { initDB } from "../util/db"
import { jsonToFile } from "../util/file"

export async function parseEBibleDB(filePath: string, outputFolderPath: string) {
    return await parser(filePath, outputFolderPath)
}

async function parser(filePath: string, outputPath: string) {
    const db = await initDB(filePath)

    const versionTable = await db.getTable("version" as GiantKey)
    const version = (await versionTable.values()) as GiantVersion[]

    // WIP references....

    // const cross_referenceTable = await db.getTable("cross_reference" as GiantKey)
    // const cross_reference = (await cross_referenceTable.values()) as CrossReference[]
    // console.log(cross_reference.length, cross_reference[0])

    // const sqlite_sequenceTable = await db.getTable("sqlite_sequence" as GiantKey)
    // const sqlite_sequence = (await sqlite_sequenceTable.values()) as SqliteSequence
    // console.log(sqlite_sequence.length, sqlite_sequence)

    // const pointTable = await db.getTable("point" as GiantKey)
    // const point = (await pointTable.values()) as Point[]
    // console.log(point.length, point[0])

    const verseTable = await db.getTable("verse" as GiantKey)
    // const verseOne = (await verseTable.values(1))[0] as Verse
    // console.log(verseOne)

    // const verse = (await verseTable.values()) as Verse[]

    const bibles = version.length
    console.log("GIANT Bibles:", bibles)

    let filePaths: string[] = []
    for (let bibleIndex = 0; bibleIndex < bibles; bibleIndex++) {
        const json = await parseBible(bibleIndex)
        filePaths.push(jsonToFile(outputPath, json.name, json))
    }

    // const json = await parseBible(0)
    // jsonToFile(outputPath, json.name, json)

    console.log("GIANT Finished:", bibles)

    return filePaths

    async function parseBible(bibleIndex: number) {
        let bible = version[bibleIndex]
        const bibleContent = (await verseTable.column("version_id", bible.id)) as GiantVerse[]
        console.log(`GIANT Parsing ${bibleIndex + 1}: "${bible.vernacular_title}" (${bible.english_title})! Verses: (${bibleContent.length})`)

        let books: Book[] = []

        let currentBook = ""
        let currentChapter = -1
        for (let i = 0; i < bibleContent.length; i++) {
            const verse = bibleContent[i]

            if (verse.book !== currentBook) {
                currentBook = verse.book
                currentChapter = -1
                books.push({ number: i + 1, name: defaultBookNames[verse.book] || verse.book, chapters: [] })
            }
            let bookIndex = books.length - 1

            if (verse.chapter !== currentChapter) {
                currentChapter = verse.chapter
                books[bookIndex].chapters.push({ number: currentChapter, verses: [] })
            }
            let chapterIndex = books[bookIndex].chapters.length - 1

            books[bookIndex].chapters[chapterIndex].verses.push({ number: verse.start_verse, text: verse.text })
        }

        const metadata: Metadata = {
            title: bible.vernacular_title,
            language: bible.language,

            territory: bible.territory,
            language_english: bible.language_english,
            english_title: bible.english_title
        }

        return { name: metadata.title, metadata, books } as Bible
    }
}

// BOOK NAMES //

const defaultBookNames = getBookObject([
    "GEN",
    "EXO",
    "LEV",
    "NUM",
    "DEU",
    "JOS",
    "JDG",
    "RUT",
    "1SA",
    "2SA",
    "1KI",
    "2KI",
    "1CH",
    "2CH",
    "EZR",
    "NEH",
    "EST",
    "JOB",
    "PSA",
    "PRO",
    "ECC",
    "SNG",
    "ISA",
    "JER",
    "LAM",
    "EZK",
    "DAN",
    "HOS",
    "JOL",
    "AMO",
    "OBA",
    "JON",
    "MIC",
    "NAM",
    "HAB",
    "ZEP",
    "HAG",
    "ZEC",
    "MAL",

    "MAT",
    "MRK",
    "LUK",
    "JHN",
    "ACT",
    "ROM",
    "1CO",
    "2CO",
    "GAL",
    "EPH",
    "PHP",
    "COL",
    "1TH",
    "2TH",
    "1TI",
    "2TI",
    "TIT",
    "PHM",
    "HEB",
    "JAS",
    "1PE",
    "2PE",
    "1JN",
    "2JN",
    "3JN",
    "JUD",
    "REV"
])
