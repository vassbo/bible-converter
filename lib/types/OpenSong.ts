export interface OpenSongBible {
    b: Book[]
}

type Book = {
    n: string
    c: Chapter[]
}

type Chapter = {
    n: string
    v: Verse[]
}

type Verse = {
    n: string
    text: string
}
