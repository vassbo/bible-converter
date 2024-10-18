export interface BebliaBible {
    translation: string
    status: string
    site: string

    testament: Testament[]
    book?: Book[] // some files are missing testament
}

type Testament = {
    name: "Old" | "New"
    book: Book[]
}

type Book = {
    // name?: string
    number: string
    chapter: Chapter[]
}

type Chapter = {
    number: string
    verse: Verse[]
}

type Verse = {
    number: string
    text: string
}
