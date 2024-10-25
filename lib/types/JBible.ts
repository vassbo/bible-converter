export type JBibleTables = ["bible", "books"]
export type JBibleKey = JBibleTables[number]

export type JBibleBible = {
    id: number
    name: string
    author: string
    source: string
    ot: number
    nt: number
    ap: number
}

export type JBibleBooks = {
    id: number
    id_bible: number
    id_book: number
    name: string
    fname: string
    statment: number
    chapters: number
}

export type JBibleSource = {
    id: number
    book: number
    chapter: number
    id_verse: number
    body: string
    number: string
}
