# Bible Converter

> Convert common digital Bible formats to a universal [JSON Bible Format](https://github.com/vassbo/json-bible).

Currently supported file types:

-   Zefania XML
-   OSIS XML
-   OpenSong XML
-   Beblia XML
-   WordProject HTML

See a list of available Bibles here: [biblelist.netlify.app](https://biblelist.netlify.app)

## Usage

Convert a folder of Bibles (with auto detect)

```js
import convertBibles from "bible-converter"

const INPUT_FOLDER = "../Bibles/"
const OUTPUT_FOLDER = "/converted/"

convertBibles(INPUT_FOLDER, OUTPUT_FOLDER)
```

Convert a specific file

```js
import { convertBible } from "bible-converter"

const INPUT_FILE = "bible.xml"
const OUTPUT_FOLDER = "/converted/"

await convertBible().auto(INPUT_FILE, OUTPUT_FOLDER)
await convertBible().zefania(INPUT_FILE, OUTPUT_FOLDER)
```
