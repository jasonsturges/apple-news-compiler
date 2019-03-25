'use strict';

const util = require("./util");


/**
 * Inline all layouts, styles, and text styles directly within each component.
 * 
 * @param {*} article Article JSON to process.
 */
const inline = (article) => {
  article.components.forEach(function (component) {
    inlineComponent(article, component);
  }, this);

  article.componentLayouts = {};
  article.componentStyles = {};
  article.componentTextStyles = {};
};

const getLayout = (article, layout) => {
  if (article.hasOwnProperty("componentLayouts"))
    if (article.componentLayouts.hasOwnProperty(layout))
      return article.componentLayouts[layout];
}

const getStyle = (article, style) => {
  if (article.hasOwnProperty("componentStyles"))
    if (article.componentStyles.hasOwnProperty(style))
      return article.componentStyles[style];
}

const getTextStyle = (article, textStyle) => {
  if (article.hasOwnProperty("componentTextStyles"))
    if (article.componentTextStyles.hasOwnProperty(textStyle))
      return article.componentTextStyles[textStyle];
}

const inlineComponent = (article, component) => {
  if (component.hasOwnProperty("layout")) {
    if (util.isString(component["layout"])) {
      component["layout"] = getLayout(article, component["layout"]);
    }
  }

  if (component.hasOwnProperty("style")) {
    if (util.isString(component["style"])) {
      component["style"] = getStyle(article, component["style"]);
    }
  }

  if (component.hasOwnProperty("textStyle")) {
    if (util.isString(component["textStyle"])) {
      component["textStyle"] = getTextStyle(article, component["textStyle"]);
    }
  }

  if (component.hasOwnProperty("components")) {
    component["components"].forEach(function (child) {
      inlineComponent(article, child);
    }, this);
  }
}

module.exports = {
  inline
};
