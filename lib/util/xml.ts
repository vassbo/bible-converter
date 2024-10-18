import xml2js from "xml2js"

const parser = new xml2js.Parser({ explicitArray: false, charkey: "text", mergeAttrs: true })

export async function xml2json(xmlContent: string) {
    return await parser.parseStringPromise(xmlContent)
}

export function toArray<T>(data: T): T {
    if (Array.isArray(data)) return data
    if (!data) return [] as T
    return [data] as T
}
