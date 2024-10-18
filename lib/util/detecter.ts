import { parseBeblia } from "../parsers/beblia"
import { parseOpenSong } from "../parsers/opensong"
import { parseOSIS } from "../parsers/osis"
import { parseWordProject } from "../parsers/wordproject"
import { parseZefania } from "../parsers/zefania"

type FileTypes = "zefania" | "osis" | "opensong" | "beblia" | "wordproject"

export function detectFileType(content: string): FileTypes | null {
    if (content.includes("XMLBIBLE") && content.includes("BIBLEBOOK")) return "zefania"
    if (content.includes("osisText") && content.includes("osisID")) return "osis"
    if (content.includes("bible") && content.includes("b n=") && content.includes("v n=")) return "opensong"
    if (content.includes("bible") && content.includes("verse number=")) return "beblia"
    if (content.includes('<li><a title="') && content.includes("Wordproject")) return "wordproject"

    return null
}

type ParserFunction = (filePath: string, outputFolderPath: string, fileContent?: string) => Promise<void>
export const converters: { [key in FileTypes]: ParserFunction } = {
    zefania: parseZefania,
    osis: parseOSIS,
    opensong: parseOpenSong,
    beblia: parseBeblia,
    wordproject: parseWordProject
}
