# Apple News Compiler
Apple News format compiler for optimized JSON article

## Inline

Replace all named component layouts, styles, and text styles by inlining object definitions within the article's components array.

Example:

```js
const fs = require("fs");
const anf = require("apple-news-compiler")

const run = async () => {
  var article = JSON.parse(fs.readFileSync("article.json"), 'utf8');

  anf.article.inline(article);

  console.log(JSON.stringify(article, null, 2));
}

run();
```

Original article.json

```json
{
  "role": "title",
  "text": "Title on Scrim",
  "layout": "titleLayout",
  "textStyle": "titleStyle"
}
```

Inline will replace named references of `titleLayout` and `titleStyle` with object definitions:

```json
{
  "role": "title",
  "text": "Title on Scrim",
  "layout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 50,
      "bottom": 5
    }
  },
  "textStyle": {
    "textAlignment": "center",
    "fontName": "HelveticaNeue-Bold",
    "fontSize": 42,
    "lineHeight": 50,
    "textColor": "#EFEFEF"
  }
}
```


## Remove Unused References

Purge any unused references to layouts, styles, or text styles not referenced by name within the components array.

This optimization removes lengthy templated style definitions that may be stubbed into an article boilerplate, leaving only definitions that are actually used.  Note this does not purge empty object definitions.

Example:

```js
const fs = require("fs");
const anf = require("apple-news-compiler")

const run = async () => {
  var article = JSON.parse(fs.readFileSync("article.json"), 'utf8');

  anf.article.removeUnusedReferences(article);

  console.log(JSON.stringify(article, null, 2));
}

run();
```


## Remove Comments

Purge any comments from from components, layouts, styles, or text styles that use either the following conventions:

```json
{
  "//": "Comment example",
  "comment": "Comment example
}
```
