export interface OSISBible {
    header?: Header

    div: Book[]
}

type Header = {
    revisionDesc?: { [key: string]: string }
    work?: { [key: string]: string }
}

type Book = {
    type: "book"
    osisID: string // Gen
    chapter: Chapter[]
}

type Chapter = {
    osisID: string // Gen.1
    title?: string[]
    verse: Verse[]
}

type Verse = {
    osisID: string // Gen.1.1
    text: string
}
