export interface ZefaniaBible {
    INFORMATION?: Info
    BIBLEBOOK: Book[]
}

type Info = {
    title?: string
    creator?: string
    subject?: string
    description?: string
    publisher?: string
    contributors?: string
    date?: string
    type?: string
    format?: string
    identifier?: string
    source?: string
    language?: string
    coverage?: string
    rights?: string
}

type Book = {
    bnumber: string
    bname: string
    CHAPTER: Chapter[]
}

type Chapter = {
    cnumber: string
    VERS: Verse[]
}

type Verse = {
    vnumber: string
    text: string
}
