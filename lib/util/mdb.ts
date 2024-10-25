import { readFileSync } from "fs"
import MDBReader from "mdb-reader"

let db: MDBReader
export function initDB(filename: string) {
    if (!filename) throw new Error("No MDB client provided.")

    const buffer = readFileSync(filename)
    db = new MDBReader(buffer)

    return db
}

export function getTableKeyValue(table: any[], keyName: string, keyValue: string, valueName: string) {
    return table.find((a) => a[keyName] === keyValue)?.[valueName]
}

// SETUP HELPER

export function getTableKeys(filename: string) {
    initDB(filename)
    const tables = db.getTableNames()

    let tableObj: any = {}
    tables.map((key) => {
        const table = db.getTable(key)
        const tableContents = table.getData()

        tableObj[key] = tableContents[0]
    })

    return tableObj
}
