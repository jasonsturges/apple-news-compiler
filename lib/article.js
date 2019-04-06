'use strict';

const util = require("./util");


/**
 * Inline all layouts, styles, and text styles directly within each component.
 * 
 * @param {*} article Article JSON to process.
 */
const inline = (article) => {
  let componentLayouts = article.componentLayouts || {};
  let componentStyles = article.componentStyles || {};
  let componentTextStyles = article.componentTextStyles || {};

  const traverser = (article, component) => {
    // Component layouts
    if (component.hasOwnProperty("layout"))
      if (util.isString(component["layout"]))
        if (componentLayouts.hasOwnProperty(component["layout"]))
          component["layout"] = componentLayouts[component["layout"]];

    // Component styles
    if (component.hasOwnProperty("style"))
      if (util.isString(component["style"]))
        if (componentStyles.hasOwnProperty(component["style"]))
          component["style"] = componentStyles[component["style"]];

    // Component text styles
    if (component.hasOwnProperty("textStyle"))
      if (util.isString(component["textStyle"]))
        if (componentTextStyles.hasOwnProperty(component["textStyle"]))
          component["textStyle"] = componentTextStyles[component["textStyle"]];

    // Conditionals
    if (component.hasOwnProperty("conditional"))
      component.conditional.forEach(condition => {
        // Component layouts - conditional
        if (condition.hasOwnProperty("layout"))
          if (util.isString(condition["layout"]))
            if (componentLayouts.hasOwnProperty(condition["layout"]))
              condition["layout"] = componentLayouts[condition["layout"]];

        // Component styles - conditional
        if (condition.hasOwnProperty("style"))
          if (util.isString(condition["style"]))
            if (componentStyles.hasOwnProperty(condition["style"]))
              condition["style"] = componentStyles[condition["style"]];

        // Component text styles - conditional
        if (condition.hasOwnProperty("textStyle"))
          if (util.isString(condition["textStyle"]))
            if (componentTextStyles.hasOwnProperty(condition["textStyle"]))
              condition["textStyle"] = componentTextStyles[condition["textStyle"]];
      });

    // Traverse descendants of the `components` array
    if (component.hasOwnProperty("components")) {
      component["components"].forEach(child => {
        traverser(article, child);
      });
    }
  };

  article.components.forEach(function (component) {
    traverser(article, component);
  }, this);

  article.componentLayouts = {};
  article.componentStyles = {};
  article.componentTextStyles = {};
};


/**
 * Remove comments from all components, layouts, styles, and text styles.
 * 
 * @param {*} article 
 */
const removeComments = (article) => {
  let componentLayouts = article.componentLayouts || {};
  let componentStyles = article.componentStyles || {};
  let componentTextStyles = article.componentTextStyles || {};
  let textStyles = article.textStyles || {};

  const traverser = (article, component) => {
    removeComment(component);

    if (component.hasOwnProperty("components")) {
      component["components"].forEach(child => {
        traverser(article, child);
      });
    }
  };

  article.components.forEach(component => {
    traverser(article, component)
  });

  Object.keys(componentLayouts).forEach(layout => {
    removeComment(componentLayouts[layout]);
  });

  Object.keys(componentStyles).forEach(style => {
    removeComment(componentStyles[style]);
  });

  Object.keys(componentTextStyles).forEach(textStyle => {
    removeComment(componentTextStyles[textStyle]);
  });

  Object.keys(textStyles).forEach(textStyle => {
    removeComment(textStyles[textStyle]);
  });
};


/**
 * Remove empty layout, style, and text style definitions and their named reference within the components array
 * 
 * @param {*} article 
 */
const removeEmptyDefinitions = (article) => {
  let componentLayouts = article.componentLayouts || {};
  let componentStyles = article.componentStyles || {};
  let componentTextStyles = article.componentTextStyles || {};

  const traverser = (article, component) => {
    // Component layouts
    if (component.hasOwnProperty("layout"))
      if (util.isString(component["layout"]))
        if (componentLayouts.hasOwnProperty(component["layout"]))
          if (Object.keys(componentLayouts[component["layout"]]).length === 0)
            delete component["layout"];

    // Component styles
    if (component.hasOwnProperty("style"))
      if (util.isString(component["style"]))
        if (componentStyles.hasOwnProperty(component["style"]))
          if (Object.keys(componentStyles[component["style"]]).length === 0)
            delete component["style"];

    // Component text styles
    if (component.hasOwnProperty("textStyle"))
      if (util.isString(component["textStyle"]))
        if (componentTextStyles.hasOwnProperty(component["textStyle"]))
          if (Object.keys(componentTextStyles[component["textStyle"]]).length === 0)
            delete component["textStyle"];

    // Conditionals
    if (component.hasOwnProperty("conditional"))
      component.conditional.forEach(condition => {
        // Component layouts - conditional
        if (condition.hasOwnProperty("layout"))
          if (util.isString(condition["layout"]))
            if (componentLayouts.hasOwnProperty(condition["layout"]))
              if (Object.keys(componentLayouts[condition["layout"]]).length === 0)
                delete condition["layout"];

        // Component styles - conditional
        if (condition.hasOwnProperty("style"))
          if (util.isString(condition["style"]))
            if (componentStyles.hasOwnProperty(condition["style"]))
              if (Object.keys(componentStyles[condition["style"]]).length === 0)
                delete condition["style"];

        // Component text styles - conditional
        if (condition.hasOwnProperty("textStyle"))
          if (util.isString(condition["textStyle"]))
            if (componentTextStyles.hasOwnProperty(condition["textStyle"]))
              if (Object.keys(componentTextStyles[condition["textStyle"]]).length === 0)
                delete condition["textStyle"]
      });

    if (component.hasOwnProperty("components")) {
      component["components"].forEach(child => {
        traverser(article, child);
      });
    }
  };

  article.components.forEach(component => {
    traverser(article, component)
  });

  Object.keys(componentLayouts).forEach(layout => {
    if (Object.keys(componentLayouts[layout]).length === 0)
      delete componentLayouts[layout];
  });

  Object.keys(componentStyles).forEach(style => {
    if (Object.keys(componentStyles[style]).length === 0)
      delete componentStyles[style]
  });

  Object.keys(componentTextStyles).forEach(textStyle => {
    if (Object.keys(componentTextStyles[textStyle]).length === 0)
      delete componentTextStyles[textStyle];
  });
};


/**
 * Remove unused layouts, styles, and text styles not referenced directly by a component.
 * 
 * @param {*} article 
 */
const removeUnusedReferences = (article) => {
  let componentLayouts = article.componentLayouts || {};
  let componentStyles = article.componentStyles || {};
  let componentTextStyles = article.componentTextStyles || {};
  let layouts = [];
  let styles = [];
  let textStyles = [];

  // Default text style
  textStyles.push("default");

  const traverser = (article, component) => {
    // Component layouts
    if (component.hasOwnProperty("layout"))
      if (util.isString(component["layout"]))
        if (!layouts.includes(component["layout"]))
          layouts.push(component["layout"]);

    // Component styles
    if (component.hasOwnProperty("style"))
      if (util.isString(component["style"]))
        if (!styles.includes(component["style"]))
          styles.push(component["style"]);

    // Component text styles
    if (component.hasOwnProperty("textStyle"))
      if (util.isString(component["textStyle"]))
        if (!textStyles.includes(component["textStyle"]))
          textStyles.push(component["textStyle"]);

    // Component text style default
    if (!textStyles.includes("default-" + component.role))
      textStyles.push("default-" + component.role);

    // Conditionals
    if (component.hasOwnProperty("conditional"))
      component.conditional.forEach(condition => {
        // Component layouts - conditional
        if (condition.hasOwnProperty("layout"))
          if (util.isString(condition["layout"]))
            layouts.push(condition["layout"]);

        // Component styles - conditional
        if (condition.hasOwnProperty("style"))
          if (util.isString(condition["style"]))
            styles.push(condition["style"]);

        // Component text styles - conditional
        if (condition.hasOwnProperty("textStyle"))
          if (util.isString(condition["textStyle"]))
            textStyles.push(condition["textStyle"]);
      });

    if (component.hasOwnProperty("components")) {
      component["components"].forEach(child => {
        traverser(article, child);
      });
    }
  };

  article.components.forEach(component => {
    traverser(article, component)
  });

  Object.keys(componentLayouts).forEach(layout => {
    if (!layouts.includes(layout))
      delete componentLayouts[layout];
  });

  Object.keys(componentStyles).forEach(style => {
    if (!styles.includes(style))
      delete componentStyles[style]
  });

  Object.keys(componentTextStyles).forEach(textStyle => {
    if (!textStyles.includes(textStyle))
      delete componentTextStyles[textStyle];
  });
};


/**
 * Remove comment from JSON object with key `//` or `comment`.
 * 
 * @param {*} object 
 */
const removeComment = (object) => {
  if (object.hasOwnProperty("//"))
    delete object["//"];

  if (object.hasOwnProperty("comment"))
    delete object["comment"];
};


module.exports = {
  inline,
  removeComments,
  removeEmptyDefinitions,
  removeUnusedReferences
};
