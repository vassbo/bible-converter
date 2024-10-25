export type MyBibleTables = ["info", "books", "verses"]
export type MyBibleKey = MyBibleTables[number]

export type MyBibleInfo = {
    name: string
    value: string
}

export type MyBibleBooks = {
    book_color: string
    book_number: number
    short_name: string
    long_name: string
}

export type MyBibleVerses = {
    book_number: number
    chapter: number
    verse: number
    text: string
}
