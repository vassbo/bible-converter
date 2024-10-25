export class IniParser {
    iniString: string
    data: { [key: string]: string | string[] }

    constructor(iniString: string) {
        this.iniString = iniString
        this.data = this.parse()
    }

    private parse() {
        const lines = this.iniString.split("\n")
        const result: { [key: string]: string | string[] } = {}

        lines.forEach((line) => {
            const trimmedLine = line.trim()

            // skip empty lines and comments
            if (trimmedLine.length === 0 || trimmedLine.startsWith(";") || trimmedLine.startsWith("#")) return

            const [key, ...valueParts] = trimmedLine.split("=")

            // skip if there's no key or value
            if (!key || valueParts.length === 0) return

            const parsedKey = key.trim()
            const parsedValue = valueParts.join("=").trim()

            if (result.hasOwnProperty(parsedKey) && Array.isArray(result[parsedKey])) result[parsedKey].push(parsedValue)
            else result[parsedKey] = [parsedValue]
        })

        // remove array if length is 1
        Object.keys(result).forEach((key) => {
            if (result[key].length < 2) result[key] = result[key][0]
        })

        return result
    }

    getValue(key: string) {
        return this.data[key] || ""
    }

    getStringValue(key: string) {
        return (this.data[key] || "").toString()
    }

    getArrayValue(key: string) {
        let value = this.data[key]
        if (!value) return []
        if (!Array.isArray(value)) value = [value]
        return value
    }
}
