# Apple News Compiler
Apple News format compiler for optimized JSON article

## Inline

Replace all named component layouts, styles, and text styles by inlining object definitions within the article's components array.

Example:

```
const fs = require("fs");
const anf = require("apple-news-compiler")

const run = async () => {
  var article = JSON.parse(fs.readFileSync("article.json"), 'utf8');

  anf.article.inline(article);

  console.log(JSON.stringify(article, null, 2));
}

run();
```