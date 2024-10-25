import { Book, Chapter, Verse } from "../Bible"
import { toArray } from "./xml"

type Keys = {
    tags: { chapter: string; verse: string }
    numberKeys: string[]
    bookNameKey?: string
    verseTextKey?: string
    bookObject?: { [key: string]: string }
}

export function parseBooks(books: any[], keys: Keys): Book[] {
    const numberKeys = { book: keys.numberKeys[0], chapter: keys.numberKeys[1] || keys.numberKeys[0], verse: keys.numberKeys[2] || keys.numberKeys[0] }

    return books.map((book, bookIndex) => {
        const chapters = toArray(book[keys.tags.chapter] as any[]).map((chapter) => {
            const verses = toArray(chapter[keys.tags.verse] as any[]).map((verse) => {
                const text = verse[keys.verseTextKey || "text"]?.replaceAll("\n", "") || ""

                let verseNumber = trimNumber(verse[numberKeys.verse])
                return { number: verseNumber, text }
            })

            let chapterNumber = trimNumber(chapter[numberKeys.chapter])
            return { number: chapterNumber, verses }
        })

        let bookNumber = Number(book[numberKeys.book]) || bookIndex + 1
        return { number: bookNumber, name: getBookName(), chapters }

        function getBookName() {
            let name: string = book[keys.bookNameKey || ""]
            if (name) return keys.bookObject?.[name] || name
            return getBookNames()[bookNumber] || bookNumber.toString()
        }

        function trimNumber(number: string) {
            let dot = number.lastIndexOf(".")
            if (dot > -1) number = number.slice(dot + 1)
            return Number(number)
        }
    })
}

/////

export function flatVersesToChapters(versesData: any[], { chapterNumber = "chapter", verseNumber = "verse", text = "text", title = "", note = "" }, extra: { titles?: any[]; notes?: any[] } = {}) {
    let chapters: Chapter[] = []
    let verses: Verse[] = []

    let currentChapterNumber = 0
    versesData.map((a) => {
        if (a[chapterNumber] === undefined) return
        if (a[chapterNumber] !== currentChapterNumber) {
            if (verses.length) chapters.push({ number: currentChapterNumber, verses })
            verses = []
            currentChapterNumber = a[chapterNumber]
        }

        let titleValue: string = extra.titles?.find((b) => b[chapterNumber] === a[chapterNumber] && b[verseNumber] === a[verseNumber])?.[title] || ""
        let footnoteValue: string = extra.notes?.find((b) => b[chapterNumber] === a[chapterNumber] && b[verseNumber] === a[verseNumber])?.[note] || ""

        let textValue = (titleValue ? `# ${titleValue} #` : "") + a[text] + (footnoteValue ? `*{${footnoteValue}}*` : "")

        verses.push({ number: a[verseNumber], text: textValue })
    })

    if (verses.length) chapters.push({ number: currentChapterNumber, verses })

    return chapters
}

/////

export function getBookObject(keys: string[]) {
    if (keys.length !== 66) throw new Error("Incorrect book keys!")

    let bookObj: { [key: string]: string } = {}
    keys.forEach((key, i) => {
        bookObj[key] = defaultBookNames[i]
    })

    return bookObj
}

export function getBookNames() {
    return ["", ...defaultBookNames]
}

const defaultBookNames = [
    // OT
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalm",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    // NT
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
]
