# Bible Converter

> Convert common digital Bible formats to a universal [JSON Bible Format](https://github.com/vassbo/json-bible).

Currently supported file types:

-   Zefania XML
-   OSIS XML
-   OpenSong XML
-   Beblia XML
-   SoftProjector SPB
-   WordProject HTML
-   BibleQuote HTML
-   iBible HTML
-   MyBible SQL
-   eBible SQL
-   jBible SQL

This is a helpful utility, but make sure you have the proper permission to actually use the Bible file you are converting!
If unsure take contact with the publisher/Bible society.

If you have issues in regards to copyright, please take contact!

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
