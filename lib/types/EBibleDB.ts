export type GiantTables = ["verse", "version", "cross_reference", "sqlite_sequence", "point"]
export type GiantKey = GiantTables[number]

// [{ id: 'aak', territory: 'Papua New Guinea', language: 'Angave', language_english: 'Ankave', vernacular_title: 'Xwɨyí̵á Gorɨxoyá Sɨŋí̵pɨrɨnɨ', english_title: 'Minaifia NT' }] (1161)
export type GiantVersion = {
    id: string
    territory: string
    language: string
    language_english: string
    vernacular_title: string
    english_title: string
}

// [{ id: 1, point_1_id: 1, point_2_id: 2 }] (300622)
export type GiantCrossReference = {
    id: number
    point_1_id: number
    point_2_id: number
}

// [{ name: 'point', seq: 30298 }, { name: 'cross_reference', seq: 300622 }]
export type GiantSqliteSequence = [{ name: "point"; seq: 30298 }, { name: "cross_reference"; seq: 300622 }]

// [{ id: 1, book: 'GEN', chapter: 1, verse: 1 }] (30298)
export type GiantPoint = {
    id: number
    book: string
    chapter: number
    verse: number
}

// [{ id: 1, version_id: 'aak', canon_order: '070_1_1', book: 'MAT', chapter: 1, start_verse: 1, end_verse: 1, text: "" }] (1161*7786)
export type GiantVerse = {
    id: number
    version_id: string
    canon_order: string
    book: string
    chapter: number
    start_verse: number
    end_verse: number
    text: string
}
