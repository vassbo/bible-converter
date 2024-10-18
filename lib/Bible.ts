export interface Bible {
    name: string
    abbreviation?: string
    metadata: Metadata

    books: Book[]
}

export type Book = {
    number: number
    name: string
    id?: string

    chapters: Chapter[]
}

export type Chapter = {
    number: number
    header?: string

    verses: Verse[]
}

export type Verse = {
    number: number
    endNumber?: number

    text: string
}

export type Metadata = {
    title?: string
    identifier?: string
    description?: string
    language?: string

    publisher?: string
    publishDate?: string
    contributors?: string[]

    copyright?: string

    // custom keys allowed
    [key: string]: any
}
