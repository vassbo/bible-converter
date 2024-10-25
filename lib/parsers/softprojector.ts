import { Bible, Book, Chapter, Metadata } from "../Bible"
import { flatVersesToChapters } from "../util/books"
import { bibleContentParser } from "../util/helper"

export async function parseSoftProjector(filePath: string, outputFolderPath: string, fileContent?: string) {
    return [await bibleContentParser(filePath, outputFolderPath, fileContent, parser)]
}

async function parser(content: string, _name?: string) {
    const parsed = new SPBParser(content)

    const rootBooks = parsed.getBooks()
    const rootVerses = parsed.getVerses()

    let books: Book[] = []
    rootBooks.forEach((bookData) => {
        const versesData = rootVerses.filter((a) => a.bookNum === bookData.number)
        let chapters: Chapter[] = flatVersesToChapters(versesData, {})

        books.push({ number: bookData.number, name: bookData.name, chapters })
    })

    const name = parsed.metadata.Title
    const metadata: Metadata = {
        title: name,
        identifier: parsed.metadata.Abbreviation,
        description: parsed.metadata.Information
    }

    return { name, metadata, books } as Bible
}

/////

class SPBParser {
    text: string
    metadata: { [key: string]: string }
    books: { number: number; name: string; chapters: number }[]
    verses: { id: string; bookNum: number; chapter: number; verse: number; text: string }[]

    constructor(text: string) {
        this.text = text
        this.metadata = {}
        this.books = []
        this.verses = []
        this.parse()
    }

    parse() {
        const lines = this.text.split("\n")
        let isParsingMetadata = true
        let isParsingVerses = false

        for (let line of lines) {
            line = line.trim()

            if (line.startsWith("##")) {
                if (isParsingMetadata) {
                    this.parseMetadata(line)
                }
            } else if (line === "-----") {
                isParsingMetadata = false
                isParsingVerses = true
            } else if (/^\d+\s+\w+/.test(line)) {
                if (isParsingMetadata) {
                    isParsingMetadata = false
                }
                this.parseBooks(line)
            } else if (isParsingVerses && line) {
                this.parseVerses(line)
            }
        }
    }

    parseMetadata(line: string) {
        const key = line.slice(2, line.indexOf(":")).trim()
        const value = line.slice(line.indexOf(":") + 1).trim()

        this.metadata[key] = value
    }

    parseBooks(line: string) {
        const [number, name, chapters] = line.split("\t").map((s) => s.trim())

        this.books.push({
            number: parseInt(number),
            name,
            chapters: parseInt(chapters)
        })
    }

    parseVerses(line: string) {
        const [id, bookNum, chapter, verse, text] = line.split("\t").map((s) => s.trim())

        this.verses.push({
            id,
            bookNum: parseInt(bookNum),
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            text
        })
    }

    getMetadata() {
        return this.metadata
    }

    getBooks() {
        return this.books
    }

    getVerses() {
        return this.verses
    }
}
