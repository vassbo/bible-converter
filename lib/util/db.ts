import sqlite3, { type Database } from "sqlite3"

export async function initDB(filename: string) {
    let db: Database
    if (!filename) throw new Error("No sqlite3 client provided.")

    db = new sqlite3.Database(filename)

    return { db, query, getTables, getTable }

    async function query(query: string): Promise<any[]> {
        return new Promise((resolve) => {
            db.all(query, (err, tables: any[]) => {
                if (err) {
                    console.error(err)
                    resolve([])
                    return
                }

                resolve(tables)
            })
        })
    }

    async function getTables(): Promise<string[]> {
        return (await query("SELECT name FROM sqlite_master WHERE type='table'")).map((a) => a.name)
    }

    async function getTable(tableId: string) {
        return { all, values, column }

        async function all() {
            return await query("SELECT * FROM " + tableId)
        }

        async function values(limit?: number): Promise<any[]> {
            return await query("SELECT * FROM " + tableId + (limit ? ` LIMIT ${limit}` : ""))
        }

        async function column(columnName: string, value: string): Promise<any[]> {
            return await query("SELECT * FROM " + tableId + " WHERE " + columnName + "='" + value + "'")
        }
    }
}

// SETUP HELPER

export async function getTableKeys(inputPath: string) {
    const db = await initDB(inputPath)
    const tables = await db.getTables()

    let tableObj: any = {}
    await Promise.all(
        tables.map(async (key) => {
            const keyTable = await db.getTable(key)
            const tableContents = await keyTable.values(1)

            tableObj[key] = tableContents[0]
        })
    )

    return tableObj
}
