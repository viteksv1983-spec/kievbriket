import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { Component, createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { renderToString } from "react-dom/server";
import { useLocation, Link, Outlet, Navigate, useParams, useSearchParams, Routes, Route, StaticRouter } from "react-router-dom";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import axios from "axios";
import { Flame, ShoppingCart, Truck, MapPin, Phone, X, Menu, ChevronRight, Clock, Mail, CheckCircle2, Loader2, ArrowRight, Star, Scale, Leaf, CreditCard, Package, Quote, ChevronDown, Ruler, Banknote, TreePine, Calculator, Thermometer, Home as Home$1, Zap, Droplets, PackageCheck, Box } from "lucide-react";
import { FaTree, FaFire, FaTruck } from "react-icons/fa";
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  instances = [];
  canUseDOM = isDocument;
  context;
  value = {
    setHelmet: (serverState) => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: () => this.canUseDOM ? instances : this.instances,
      add: (instance) => {
        (this.canUseDOM ? instances : this.instances).push(instance);
      },
      remove: (instance) => {
        const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
        (this.canUseDOM ? instances : this.instances).splice(index, 1);
      }
    }
  };
  constructor(context, canUseDOM) {
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React.createContext(defaultValue);
var HelmetProvider = class _HelmetProvider extends Component {
  static canUseDOM = isDocument;
  helmetData;
  constructor(props) {
    super(props);
    this.helmetData = new HelmetData(this.props.context || {}, _HelmetProvider.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
};
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => tag.parentNode?.removeChild(tag));
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  rendered = false;
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = class extends Component {
  static defaultProps = {
    defer: true,
    encodeSpecialCharacters: true,
    prioritizeSeoTags: false
  };
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context }));
  }
};
const baseURL = "https://kievbriket-api.onrender.com";
console.log("API BaseURL initialized as:", baseURL);
const api = axios.create({
  baseURL
});
const CategoryContext = createContext();
const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/categories");
      const mappedCategories = response.data.map((cat) => ({
        id: cat.slug,
        slug: cat.slug,
        name: cat.name,
        title: cat.name,
        // Usually the same as name for firewood
        description: cat.description || "",
        seo_text: cat.seo_text || "",
        seo_h1: cat.seo_h1 || "",
        meta_title: cat.meta_title || "",
        meta_description: cat.meta_description || "",
        image_url: cat.image_url,
        imagePlaceholder: `🪵 ${cat.name}`
      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([
        { id: "drova", slug: "drova", name: "Дрова", title: "Дрова", description: "", imagePlaceholder: "🪵 Дрова" },
        { id: "brikety", slug: "brikety", name: "Паливні брикети", title: "Паливні брикети", description: "", imagePlaceholder: "🪵 Брикети" },
        { id: "vugillya", slug: "vugillya", name: "Вугілля", title: "Вугілля", description: "", imagePlaceholder: "🪵 Вугілля" }
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return /* @__PURE__ */ jsx(CategoryContext.Provider, { value: { categories, loading, refreshCategories: fetchCategories }, children });
};
const useCategories = () => useContext(CategoryContext);
const SSGDataContext = createContext(null);
function SSGDataProvider({ data, children }) {
  return /* @__PURE__ */ jsx(SSGDataContext.Provider, { value: data, children });
}
function useSSGData() {
  return useContext(SSGDataContext);
}
const AuthContext = createContext();
const useAuth = () => React.useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.get("/users/me/").then((response) => {
        setUser(response.data);
        setLoading(false);
      }).catch(() => {
        logout();
        setLoading(false);
      });
    } else {
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);
  const login = async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const response = await api.post("/token", formData);
    const accessToken = response.data.access_token;
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };
  const register = async (email, password) => {
    await api.post("/users/", { email, password });
  };
  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/";
  };
  const loginWithGoogle = async (googleToken) => {
    const response = await api.post("/auth/google", null, {
      params: { token: googleToken }
    });
    const accessToken = response.data.access_token;
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, token, login, register, logout, loading, loginWithGoogle }, children });
};
const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from local storage", error);
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const addToCart = (product, quantity = 1, flavor = null, weight = null, deliveryDate = null, deliveryMethod = "pickup") => {
    const finalWeight = weight !== null ? weight : product.weight;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.flavor === flavor && item.weight === finalWeight && item.deliveryDate === deliveryDate && item.deliveryMethod === deliveryMethod
      );
      if (existingItem) {
        return prevItems.map(
          (item) => item.id === product.id && item.flavor === flavor && item.weight === finalWeight && item.deliveryDate === deliveryDate && item.deliveryMethod === deliveryMethod ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity, flavor, weight: finalWeight, deliveryDate, deliveryMethod }];
      }
    });
  };
  const removeFromCart = (productId, flavor = null, weight = null, deliveryDate = null, deliveryMethod = null) => {
    setCartItems((prevItems) => prevItems.filter(
      (item) => !(item.id === productId && item.flavor === flavor && item.weight === weight && item.deliveryDate === deliveryDate && item.deliveryMethod === deliveryMethod)
    ));
  };
  const updateQuantity = (productId, flavor = null, weight = null, deliveryDate = null, deliveryMethod = null, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      (prevItems) => prevItems.map(
        (item) => item.id === productId && item.flavor === flavor && item.weight === weight && item.deliveryDate === deliveryDate && item.deliveryMethod === deliveryMethod ? { ...item, quantity } : item
      )
    );
  };
  const clearCart = () => {
    setCartItems([]);
  };
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  return /* @__PURE__ */ jsx(CartContext.Provider, { value: { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }, children });
};
const shopConfig = {
  // ─── Brand ────────────────────────────────────────
  name: "КиївБрикет",
  domain: "https://kievbriket.com",
  // ─── Contact ──────────────────────────────────────
  contact: {
    phone: "+380 (99) 123-45-67",
    instagram: "https://www.instagram.com/drova_kiyv_example"
  },
  // ─── SEO Defaults ─────────────────────────────────
  seo: {
    defaultTitle: "КиївБрикет — Купити колоті дрова з доставкою",
    defaultDescription: "Швидка доставка дров по Києву та області. Дуб, ясен, граб, береза. Без передоплати, точний об'єм. Замовляйте якісні дрова для опалення.",
    defaultKeywords: "дрова київ, купити дрова, доставка дров, дрова колоті, дубові дрова, дрова ціна",
    ogSiteName: "КиївБрикет"
  }
};
const links = [
  { label: "Дрова", to: "/catalog/drova", icon: Flame },
  { label: "Брикети", to: "/catalog/brikety", icon: ShoppingCart },
  { label: "Вугілля", to: "/catalog/vugillya", icon: ShoppingCart },
  { label: "Доставка", to: "/dostavka", icon: Truck },
  { label: "Контакти", to: "/contacts", icon: MapPin }
];
const NAV_CSS = `
  .nh-nav-link {
    position: relative;
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
    padding-bottom: 4px;
    transition: color 0.18s;
    color: rgba(255,255,255,0.85);
  }
  .nh-nav-link:hover {
    color: #F97316 !important;
  }
  .nh-nav-link.active {
    color: #F97316 !important;
  }
  .nh-nav-link .underline-bar {
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 2px;
    background: #F97316;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .nh-nav-link.active .underline-bar {
    opacity: 1;
  }
  .nh-nav-phone {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #ffffff;
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.18s;
  }
  .nh-nav-phone:hover {
    color: #F97316 !important;
  }

  /* Responsive show/hide */
  .desktop-only { display: flex; }
  .mobile-only { display: none; }
  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
  }

  /* Mobile menu animation */
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 89;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-menu-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-menu-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 91;
    width: min(320px, 85vw);
    background: linear-gradient(180deg, #0f1118 0%, #161926 100%);
    border-left: 1px solid rgba(255,255,255,0.08);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-menu-drawer.is-open {
    transform: translateX(0);
  }

  .mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    text-decoration: none;
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s, color 0.2s;
  }
  .mobile-menu-item:active {
    background: rgba(249,115,22,0.08);
    color: #F97316;
  }
  .mobile-menu-item .menu-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(249,115,22,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mobile-menu-cta {
    margin: 16px 20px;
    padding: 16px 0;
    border-radius: 14px;
    background: var(--gradient-accent);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    border: none;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(249,115,22,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .mobile-menu-cta:active {
    transform: scale(0.97);
  }

  .mobile-phone-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    text-decoration: none;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background 0.2s;
    border-radius: 12px;
    margin: 0 12px;
    background: rgba(249,115,22,0.06);
    border: 1px solid rgba(249,115,22,0.12);
  }
  .mobile-phone-link:active {
    background: rgba(249,115,22,0.15);
  }
`;
function SiteHeader({ onQuickOrderClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const closeMenu = () => setOpen(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: NAV_CSS }),
    /* @__PURE__ */ jsx(
      "header",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          background: scrolled ? "var(--color-bg-overlay)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border-subtle)" : "1px solid transparent"
        },
        children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }, children: [
          /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--gradient-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 14px var(--color-accent-glow)",
              flexShrink: 0
            }, children: /* @__PURE__ */ jsx(Flame, { size: 18, color: "#fff", strokeWidth: 2.2 }) }),
            /* @__PURE__ */ jsxs("span", { style: { lineHeight: 1 }, children: [
              /* @__PURE__ */ jsxs("span", { style: { display: "block", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: "#ffffff" }, children: "Київ" }),
                /* @__PURE__ */ jsx("span", { style: { color: "#F97316" }, children: "Брикет" })
              ] }),
              /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", marginTop: 1 }, children: "ТОВ «Київ Брикет»" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("nav", { style: { display: "flex", alignItems: "center", gap: 32 }, className: "desktop-only", children: links.map((l) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: l.to,
              className: `nh-nav-link${location.pathname === l.to ? " active" : ""}`,
              children: [
                l.label,
                /* @__PURE__ */ jsx("span", { className: "underline-bar" })
              ]
            },
            l.to + l.label
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "desktop-only", style: { alignItems: "center", gap: 20 }, children: [
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-nav-phone", children: [
              /* @__PURE__ */ jsx(Phone, { size: 14, color: "#F97316" }),
              shopConfig.contact.phone
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "10px 22px", fontSize: "0.875rem" }, children: "Замовити" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mobile-only", style: { alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
                "aria-label": "Зателефонувати",
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(249,115,22,0.1)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none"
                },
                children: /* @__PURE__ */ jsx(Phone, { size: 18, color: "#F97316" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setOpen(!open),
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: open ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s"
                },
                "aria-label": "Меню",
                children: open ? /* @__PURE__ */ jsx(X, { size: 20, color: "#F97316" }) : /* @__PURE__ */ jsx(Menu, { size: 20, color: "#fff" })
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mobile-menu-overlay${open ? " is-open" : ""}`,
        onClick: closeMenu
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: drawerRef,
        className: `mobile-menu-drawer${open ? " is-open" : ""}`,
        children: [
          /* @__PURE__ */ jsx("div", { style: { height: 64, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", flexShrink: 0 }, children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: closeMenu,
              "aria-label": "Закрити меню",
              style: {
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              },
              children: /* @__PURE__ */ jsx(X, { size: 20, color: "#fff" })
            }
          ) }),
          /* @__PURE__ */ jsx("nav", { style: { flex: 1 }, children: links.map((l) => {
            const IconComp = l.icon;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: l.to,
                className: "mobile-menu-item",
                onClick: closeMenu,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "menu-icon-wrap", children: /* @__PURE__ */ jsx(IconComp, { size: 16, color: "#F97316" }) }),
                  /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: l.label }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 16, color: "rgba(255,255,255,0.2)" })
                ]
              },
              l.to + l.label
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "12px 0 24px", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
                className: "mobile-phone-link",
                children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(249,115,22,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }, children: /* @__PURE__ */ jsx(Phone, { size: 16, color: "#F97316" }) }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: 2 }, children: "Зателефонувати" }),
                    shopConfig.contact.phone
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "8px 12px 0",
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)"
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(34,197,94,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }, children: /* @__PURE__ */ jsx(Clock, { size: 16, color: "#22c55e" }) }),
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginBottom: 2 }, children: "Режим роботи" }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.95rem", color: "#fff", fontWeight: 600 }, children: "Щодня 09:00 – 20:00" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  closeMenu();
                  onQuickOrderClick?.();
                },
                className: "mobile-menu-cta",
                style: { display: "block", width: "calc(100% - 40px)" },
                children: "🔥 Замовити зараз"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const sections = [
  {
    title: "1. Загальні положення",
    text: `ТОВ «Київ Брикет» (далі — «Компанія») поважає конфіденційність своїх клієнтів і зобов'язується захищати персональні дані, які ви надаєте нам під час використання сайту kievbriket.com. Ця політика описує, які дані ми збираємо, як ми їх використовуємо та які маєте права.`
  },
  {
    title: "2. Які дані ми збираємо",
    text: `При заповненні форми замовлення ми отримуємо: ваше ім'я, номер телефону та, за бажанням, коментар до замовлення. Ми не збираємо дані банківських карток, паролі або іншу чутливу фінансову інформацію.`
  },
  {
    title: "3. Мета збору даних",
    text: `Зібрані дані використовуються виключно для: зв'язку з вами щодо замовлення, уточнення деталей доставки, покращення якості обслуговування. Ми не передаємо ваші дані третім особам без вашої згоди, за винятком випадків, передбачених законодавством України.`
  },
  {
    title: "4. Зберігання даних",
    text: `Ваші дані зберігаються на захищених серверах протягом строку, необхідного для виконання замовлення та відповідно до вимог законодавства. Після закінчення цього строку дані видаляються або знеособлюються.`
  },
  {
    title: "5. Cookies",
    text: `Сайт може використовувати файли cookie для поліпшення роботи та аналізу трафіку. Ви можете вимкнути cookies у налаштуваннях браузера, проте це може вплинути на функціональність сайту.`
  },
  {
    title: "6. Ваші права",
    text: `Відповідно до Закону України «Про захист персональних даних» ви маєте право: дізнатися, які дані про вас зберігаються, вимагати їх виправлення або видалення, відкликати згоду на обробку. Для реалізації прав зв'яжіться з нами за телефоном +38 067 883 28 10.`
  },
  {
    title: "7. Контакти",
    text: `З питань щодо обробки персональних даних: телефон +38 067 883 28 10, +38 099 665 74 77; адреса: вул. Колекторна, 19, Київ. ТОВ «Київ Брикет».`
  }
];
function PrivacyModal({ onClose }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      },
      children: /* @__PURE__ */ jsxs("div", { style: {
        background: "var(--c-surface)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        width: "100%",
        maxWidth: 680,
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.15rem", fontWeight: 800, color: "var(--c-text)" }, children: "Політика конфіденційності" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              style: {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 8,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--c-text2)",
                cursor: "pointer",
                transition: "background 0.2s"
              },
              onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)",
              onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)",
              children: /* @__PURE__ */ jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { overflowY: "auto", padding: "2rem", lineHeight: 1.75 }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", color: "var(--c-text3)", marginBottom: 24 }, children: "Останнє оновлення: лютий 2026 р." }),
          sections.map((s) => /* @__PURE__ */ jsxs("section", { style: { marginBottom: 28 }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "0.9375rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 8 }, children: s.title }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)" }, children: s.text })
          ] }, s.title))
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          padding: "1.25rem 2rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          display: "flex",
          justifyContent: "flex-end"
        }, children: /* @__PURE__ */ jsx("button", { onClick: onClose, className: "nh-btn-primary", style: { padding: "10px 28px" }, children: "Зрозуміло" }) })
      ] })
    }
  );
}
const catalog = [
  { label: "Дрова", to: "/catalog/drova" },
  { label: "Паливні брикети", to: "/catalog/brikety" },
  { label: "Вугілля", to: "/catalog/vugillya" },
  { label: "Доставка", to: "/dostavka" },
  { label: "Контакти", to: "#contact" }
];
function SiteFooter() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("footer", { id: "contact", style: { background: "var(--color-bg-deep)", borderTop: "1px solid var(--color-border-subtle)" }, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            maxWidth: 1200,
            margin: "0 auto",
            padding: "4rem 1.5rem 3rem",
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1.4fr 1fr",
            gap: "3rem"
          },
          className: "footer-grid",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mobile-hidden-block", children: [
              /* @__PURE__ */ jsxs("a", { href: "/", style: { display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }, children: [
                /* @__PURE__ */ jsx("span", { style: {
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "var(--gradient-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 14px var(--color-accent-glow)",
                  flexShrink: 0
                }, children: /* @__PURE__ */ jsx(Flame, { size: 18, color: "#fff", strokeWidth: 2.2 }) }),
                /* @__PURE__ */ jsxs("span", { style: { lineHeight: 1 }, children: [
                  /* @__PURE__ */ jsxs("span", { style: { display: "block", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "#ffffff" }, children: "Київ" }),
                    /* @__PURE__ */ jsx("span", { style: { color: "#F97316" }, children: "Брикет" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", marginTop: 1 }, children: "ТОВ «Київ Брикет»" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.7, maxWidth: 280, marginBottom: 12 }, children: "ТОВ «Київ Брикет» — постачальник твердого палива з доставкою по Києву та Київській області. Дрова, брикети, вугілля з 2013 року." }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "rgba(249,115,22,1)", fontWeight: 600, marginBottom: 20, letterSpacing: "0.01em" }, children: "Працюємо з фізичними та юридичними особами" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }, children: "Каталог" }),
              /* @__PURE__ */ jsx("ul", { style: { display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 }, children: catalog.map((c) => /* @__PURE__ */ jsx("li", { children: c.to.startsWith("#") ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: c.to,
                  style: { fontSize: "0.875rem", color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
                  onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
                  onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
                  children: c.label
                }
              ) : /* @__PURE__ */ jsx(
                Link,
                {
                  to: c.to,
                  style: { fontSize: "0.875rem", color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
                  onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
                  onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
                  children: c.label
                }
              ) }, c.to + c.label)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }, children: "Контакти" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
                [
                  { Icon: Phone, text: shopConfig.contact.phone, href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, label: "Відділ продажу", hideOnMobile: false },
                  { Icon: Phone, text: "+38 099 665 74 77", href: "tel:+380996657477", label: "Відділ продажу", hideOnMobile: false },
                  { Icon: MapPin, text: "вул. Колекторна, 19, Київ", href: "https://maps.google.com/?q=вул.+Колекторна+19+Київ", label: "Адреса", hideOnMobile: false },
                  { Icon: Mail, text: "info@kievbriket.com", href: "mailto:info@kievbriket.com", label: "Email", hideOnMobile: true }
                ].map(({ Icon, text, href, label, hideOnMobile }) => /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href,
                    target: href.startsWith("http") ? "_blank" : void 0,
                    rel: href.startsWith("http") ? "noopener noreferrer" : void 0,
                    className: hideOnMobile ? "mobile-hidden-block" : "",
                    style: { display: "flex", alignItems: "flex-start", gap: 10, textDecoration: "none", color: "var(--c-text2)", fontSize: "0.875rem", lineHeight: 1.5, transition: "color 0.2s" },
                    onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
                    onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
                    children: [
                      /* @__PURE__ */ jsx(Icon, { size: 14, color: "var(--c-orange)", style: { flexShrink: 0, marginTop: 2 } }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.72rem", color: "var(--c-text2)", marginBottom: 1 }, children: label }),
                        text
                      ] })
                    ]
                  },
                  text
                )),
                /* @__PURE__ */ jsxs("div", { className: "mobile-schedule-row", style: { display: "none", alignItems: "flex-start", gap: 10, color: "var(--c-text2)", fontSize: "0.875rem", lineHeight: 1.5 }, children: [
                  /* @__PURE__ */ jsx(Clock, { size: 14, color: "var(--c-orange)", style: { flexShrink: 0, marginTop: 2 } }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { style: { display: "block", fontSize: "0.72rem", color: "var(--c-text2)", marginBottom: 1 }, children: "Графік роботи" }),
                    "Пн — Нд: 09:00 – 20:00"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "desktop-schedule-col", children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }, children: "Графік роботи" }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                { day: "Понеділок", time: "09:00 – 20:00" },
                { day: "Вівторок", time: "09:00 – 20:00" },
                { day: "Середа", time: "09:00 – 20:00" },
                { day: "Четвер", time: "09:00 – 20:00" },
                { day: "П'ятниця", time: "09:00 – 20:00" },
                { day: "Субота", time: "09:00 – 20:00" },
                { day: "Неділя", time: "09:00 – 20:00" }
              ].map((h) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.82rem", color: "var(--c-text2)" }, children: h.day }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.82rem", color: "var(--c-text2)", whiteSpace: "nowrap" }, children: h.time })
              ] }, h.day)) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ jsxs("div", { style: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: "1.25rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.8rem", color: "var(--c-text2)" }, children: [
          "© 2013–",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ТОВ «Київ Брикет». Всі права захищені."
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 20 }, children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowPrivacy(true),
            style: {
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "var(--c-text2)",
              transition: "color 0.2s",
              fontFamily: "inherit"
            },
            onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
            onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
            children: "Політика конфіденційності"
          }
        ) })
      ] }) })
    ] }),
    showPrivacy && /* @__PURE__ */ jsx(PrivacyModal, { onClose: () => setShowPrivacy(false) }),
    /* @__PURE__ */ jsx("style", { children: `
                /* Desktop: 4 columns, evenly spread */
                @media (max-width: 900px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 2rem !important;
                        padding: 2.5rem 1.25rem 2rem !important;
                    }
                }
                /* Mobile: 2 columns, compact */
                @media (max-width: 540px) {
                    .footer-grid {
                        grid-template-columns: 1.2fr 1fr !important;
                        gap: 1.2rem 1rem !important;
                        padding: 1.5rem 1rem 1.25rem !important;
                        align-items: start;
                    }
                    .footer-grid > div {
                        align-self: start;
                    }
                    .mobile-hidden-block {
                        display: none !important;
                    }
                    .desktop-schedule-col {
                        display: none !important;
                    }
                    .mobile-schedule-row {
                        display: flex !important;
                    }
                }
            ` })
  ] });
}
const PREFIX = "+38";
const MAX_DIGITS_AFTER_PREFIX = 10;
function usePhoneInput(initialValue = "") {
  const [digits, setDigits] = useState(() => {
    const clean = initialValue.replace(/\D/g, "");
    if (clean.startsWith("38")) return clean.slice(2).slice(0, MAX_DIGITS_AFTER_PREFIX);
    if (clean.startsWith("0")) return clean.slice(0, MAX_DIGITS_AFTER_PREFIX);
    return "";
  });
  const phoneValue = PREFIX + digits;
  const handleChange = useCallback((e) => {
    let val = e.target.value;
    if (!val.startsWith(PREFIX)) {
      val = PREFIX + val.replace(/\D/g, "");
    }
    const afterPrefix = val.slice(PREFIX.length);
    const cleanDigits = afterPrefix.replace(/\D/g, "").slice(0, MAX_DIGITS_AFTER_PREFIX);
    setDigits(cleanDigits);
  }, []);
  const handleKeyDown = useCallback((e) => {
    const input = e.target;
    const selStart = input.selectionStart || 0;
    if (e.key === "Backspace" && selStart <= PREFIX.length) {
      e.preventDefault();
    }
    if (e.key === "Delete" && selStart < PREFIX.length) {
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && selStart <= PREFIX.length) {
      e.preventDefault();
    }
  }, []);
  const handleFocus = useCallback((e) => {
    setTimeout(() => {
      const input = e.target;
      if (input.selectionStart < PREFIX.length) {
        input.setSelectionRange(PREFIX.length, PREFIX.length);
      }
    }, 0);
  }, []);
  const handleClick = useCallback((e) => {
    const input = e.target;
    if (input.selectionStart < PREFIX.length) {
      input.setSelectionRange(PREFIX.length, PREFIX.length);
    }
  }, []);
  const phoneProps = {
    type: "tel",
    value: phoneValue,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onClick: handleClick,
    placeholder: "+38 0XX XXX XX XX",
    maxLength: PREFIX.length + MAX_DIGITS_AFTER_PREFIX
  };
  const setPhone = useCallback((val) => {
    const clean = val.replace(/\D/g, "");
    if (clean.startsWith("38")) setDigits(clean.slice(2).slice(0, MAX_DIGITS_AFTER_PREFIX));
    else if (clean.startsWith("0")) setDigits(clean.slice(0, MAX_DIGITS_AFTER_PREFIX));
    else setDigits(clean.slice(0, MAX_DIGITS_AFTER_PREFIX));
  }, []);
  const resetPhone = useCallback(() => setDigits(""), []);
  return { phoneValue, phoneProps, rawPhone: phoneValue, setPhone, resetPhone, digits };
}
const fuelOptions$1 = ["Дрова", "Паливні брикети", "Вугілля", "Декілька видів"];
function OrderFormModal({ isOpen, onClose, product, variant }) {
  const [form, setForm] = useState({ name: "", fuel: "", message: "", quantity: 1 });
  const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
  const [status, setStatus] = useState("idle");
  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", fuel: "", message: "", quantity: 1 });
        resetPhone();
      }, 300);
    }
  }, [isOpen]);
  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const payload = {
        customer_name: form.name.trim() || "Клієнт",
        customer_phone: rawPhone,
        cake_id: product ? product.id : null,
        quantity: form.quantity || 1,
        flavor: variant ? variant.name : form.fuel,
        weight: product ? product.weight : null
      };
      if (form.message) {
        payload.flavor = (payload.flavor ? payload.flavor + " | " : "") + "Коментар: " + form.message;
      }
      await api.post("/orders/quick", payload);
      setStatus("success");
      setForm({ name: "", fuel: "", message: "", quantity: 1 });
      resetPhone();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Сталася помилка при відправці. Спробуйте ще раз або зателефонуйте нам.");
      setStatus("idle");
    }
  };
  if (!isOpen) return null;
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    padding: "13px 16px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box"
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          animation: "ofm-fade-in 0.25s ease"
        }
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(165deg, #181c24 0%, #12151b 100%)",
          border: "1px solid rgba(249,115,22,0.12)",
          borderRadius: 20,
          padding: "2rem 2rem 1.75rem",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(249,115,22,0.06)",
          animation: "ofm-slide-up 0.3s ease"
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              style: {
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                transition: "background 0.2s, color 0.2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "#fff";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              },
              children: /* @__PURE__ */ jsx(X, { size: 18 })
            }
          ),
          status === "success" ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "2rem 0" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: 64,
              height: 64,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 28, color: "#22C55E" }) }),
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", marginBottom: 10 }, children: "Заявку прийнято!" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", marginBottom: 24 }, children: "Передзвонимо протягом 15 хвилин." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 32px",
                  margin: "0 auto",
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(249,115,22,0.25)"
                },
                children: "Закрити"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 2, paddingRight: 32 }, children: "Залишити заявку" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.88rem", color: "rgba(255,255,255,0.50)", marginBottom: 0 }, children: "Передзвонимо протягом 15 хвилин." }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#22C55E", fontSize: "0.65rem" }, children: "●" }),
              "Без передоплат. Консультація безкоштовна."
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, className: "ofm-row", children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Ваше ім'я" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Іван",
                    value: form.name,
                    onChange: setField("name"),
                    style: inputStyle,
                    onFocus: (e) => {
                      e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)";
                    },
                    onBlur: (e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Телефон *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ...phoneProps,
                    required: true,
                    style: inputStyle,
                    onFocus: (e) => {
                      phoneProps.onFocus(e);
                      e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)";
                    },
                    onBlur: (e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }
                )
              ] })
            ] }),
            product ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Обраний товар" }),
              /* @__PURE__ */ jsxs("div", { style: { ...inputStyle, background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "#fff" }, children: product.name }),
                variant && /* @__PURE__ */ jsxs("span", { style: { color: "#22c55e", ml: 2, marginLeft: "8px" }, children: [
                  "(",
                  variant.name,
                  ")"
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "ofm-fuel", style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Тип палива" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "ofm-fuel",
                  value: form.fuel,
                  onChange: setField("fuel"),
                  style: {
                    ...inputStyle,
                    color: form.fuel ? "#fff" : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    appearance: "none"
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", style: { background: "#1e1e1e", color: "#ccc" }, children: "Оберіть вид палива" }),
                    fuelOptions$1.map((o) => /* @__PURE__ */ jsx("option", { value: o, style: { background: "#1e1e1e", color: "#fff" }, children: o }, o))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "ofm-quantity", style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Кількість (складометрів / шт)" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", ...inputStyle, padding: "4px" }, children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) })), style: { background: "transparent", border: "none", color: "#fff", padding: "10px 15px", cursor: "pointer", fontSize: "1.2rem", fontWeight: 800 }, children: "-" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "ofm-quantity",
                    type: "number",
                    min: "1",
                    step: "1",
                    value: form.quantity,
                    onChange: (e) => setForm((f) => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) })),
                    style: { flex: 1, background: "transparent", border: "none", color: "#fff", textAlign: "center", fontSize: "1rem", fontWeight: 700, outline: "none", width: "100%", padding: 0 }
                  }
                ),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setForm((f) => ({ ...f, quantity: f.quantity + 1 })), style: { background: "transparent", border: "none", color: "#fff", padding: "10px 15px", cursor: "pointer", fontSize: "1.2rem", fontWeight: 800 }, children: "+" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }, children: "Коментар (необов'язково)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  placeholder: "Напр.: потрібно 5 скл. м дубових дров...",
                  value: form.message,
                  onChange: setField("message"),
                  rows: "3",
                  style: {
                    ...inputStyle,
                    resize: "vertical"
                  },
                  onFocus: (e) => {
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.50)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.10)";
                  },
                  onBlur: (e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: 12,
                  padding: "17px 24px",
                  width: "100%",
                  marginTop: 4,
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(249,115,22,0.25)",
                  letterSpacing: "0.01em",
                  transition: "opacity 0.2s",
                  opacity: status === "loading" ? 0.7 : 1
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.boxShadow = "0 0 28px rgba(249,115,22,0.45), 0 8px 24px rgba(0,0,0,0.30)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(249,115,22,0.25)";
                },
                children: status === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
                  " Надсилаємо..."
                ] }) : "Замовити"
              }
            ),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.74rem", color: "rgba(255,255,255,0.30)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgba(249,115,22,0.55)", fontSize: "0.6rem" }, children: "⏱" }),
              "Передзвонимо протягом 15 хвилин у робочий час"
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }, children: "Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes ofm-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ofm-slide-up {
                    from { opacity: 0; transform: translate(-50%, -46%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
                @media (max-width: 560px) {
                    .ofm-row { grid-template-columns: 1fr !important; }
                }
            ` })
  ] });
}
function PublicLayout() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "new-home-scope",
      style: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "var(--c-text)",
        fontFamily: "var(--font-outfit)"
      },
      children: [
        /* @__PURE__ */ jsx(SiteHeader, { onQuickOrderClick: () => setIsOrderFormOpen(true) }),
        /* @__PURE__ */ jsx("main", { style: { flex: 1 }, children: /* @__PURE__ */ jsx(Outlet, {}) }),
        /* @__PURE__ */ jsx(SiteFooter, {}),
        /* @__PURE__ */ jsx(
          OrderFormModal,
          {
            isOpen: isOrderFormOpen,
            onClose: () => setIsOrderFormOpen(false)
          }
        )
      ]
    }
  );
}
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700" }) });
  }
  if (!user) {
    console.log("Not authenticated, redirecting to login from", window.location.pathname);
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", state: { from: window.location.pathname }, replace: true });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
};
function SEOHead({ title, description, ogDescription, keywords, h1, canonical, ogImage, type = "website", schema, robots, is404 = false, productPrice, productCurrency, children }) {
  const location = useLocation();
  const [seoData, setSeoData] = useState(null);
  const domain = shopConfig.domain;
  useEffect(() => {
    if (title || is404) return;
    const fetchSEO = async () => {
      try {
        const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
        const response = await api.get(`/api/seo${path}`);
        if (response.data) {
          setSeoData(response.data);
        }
      } catch (error) {
        console.log("No specific SEO data for this route");
      }
    };
    fetchSEO();
  }, [location.pathname, title]);
  const data = seoData || {};
  const effectiveTitle = title || data.meta_title || shopConfig.seo.defaultTitle;
  const effectiveDesc = description || data.meta_description || shopConfig.seo.defaultDescription;
  const effectiveKeywords = keywords || data.meta_keywords || shopConfig.seo.defaultKeywords;
  const effectiveRobots = robots || data.meta_robots || "index, follow";
  const pathForCanonical = canonical || location.pathname;
  let formattedPath = pathForCanonical;
  if (formattedPath !== "/" && formattedPath.endsWith("/")) {
    formattedPath = formattedPath.slice(0, -1);
  }
  const currentFullUrl = formattedPath.startsWith("http") ? formattedPath : `${domain}${formattedPath}`;
  const imagePath = ogImage || data.og_image || "/og-image.jpg";
  const effectiveOgImage = imagePath.startsWith("http") ? imagePath : `${domain}${imagePath}`;
  const effectiveSchema = schema || data.schema_json;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: effectiveTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: effectiveDesc }),
    /* @__PURE__ */ jsx("meta", { name: "keywords", content: effectiveKeywords }),
    !is404 && /* @__PURE__ */ jsx("link", { rel: "canonical", href: currentFullUrl }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: effectiveRobots }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "uk_UA" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale:alternate", content: "ru_UA" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: effectiveTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: ogDescription || effectiveDesc }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: effectiveOgImage }),
    !is404 && /* @__PURE__ */ jsx("meta", { property: "og:url", content: currentFullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: shopConfig.seo.ogSiteName }),
    productPrice && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("meta", { property: "product:price:amount", content: String(productPrice) }),
      /* @__PURE__ */ jsx("meta", { property: "product:price:currency", content: productCurrency || "UAH" }),
      /* @__PURE__ */ jsx("meta", { property: "product:availability", content: "in stock" }),
      /* @__PURE__ */ jsx("meta", { itemprop: "price", content: String(productPrice) }),
      /* @__PURE__ */ jsx("meta", { itemprop: "priceCurrency", content: productCurrency || "UAH" })
    ] }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: effectiveTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: effectiveDesc }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: effectiveOgImage }),
    effectiveSchema && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: typeof effectiveSchema === "string" ? effectiveSchema : JSON.stringify(effectiveSchema) }),
    children
  ] });
}
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "VITE_API_URL": "https://kievbriket-api.onrender.com" };
const getCategoryUrl = (slug) => {
  if (!slug) return `/catalog/drova`;
  return `/catalog/${slug}`;
};
const getProductUrl = (product) => {
  if (!product || !product.slug) return null;
  const catSegment = product.category || "drova";
  return `/catalog/${catSegment}/${product.slug}`;
};
const getImageUrl = (imagePath, baseURL2) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http") || imagePath.startsWith("blob")) return imagePath;
  const parts = imagePath.split("/");
  const encodedPath = parts.map((part, index) => {
    if (!part) return "";
    return index === parts.length - 1 ? encodeURIComponent(part) : part;
  }).join("/");
  let envApiUrl = "";
  try {
    if (typeof import.meta !== "undefined" && __vite_import_meta_env__) {
      envApiUrl = "https://kievbriket-api.onrender.com";
    } else if (typeof process !== "undefined" && process.env) {
      envApiUrl = process.env.VITE_API_URL || "";
    }
  } catch (e) {
  }
  let hostFallback = "localhost";
  try {
    if (typeof window !== "undefined" && window.location) {
      hostFallback = window.location.hostname;
    }
  } catch (e) {
  }
  let base = baseURL2;
  if (!base || base === "/api") {
    base = envApiUrl || `http://${hostFallback}:8000`;
  }
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = encodedPath.startsWith("/") ? encodedPath : `/${encodedPath}`;
  return `${cleanBase}${cleanPath}`;
};
const stats = [
  { value: "12+", label: "років досвіду" },
  { value: "1 000+", label: "клієнтів", highlight: true },
  { value: "24 год", label: "доставка", accent: true }
];
const imageBadges = [
  { emoji: "🔥", text: "Сухе паливо" },
  { emoji: "🚚", text: "Доставка по Києву сьогодні" },
  { emoji: "⭐", text: "1000+ клієнтів" }
];
function HeroSection({ onQuickOrderClick }) {
  return /* @__PURE__ */ jsxs("section", { className: "hero-section", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb hero-glow-r",
        style: {
          width: 600,
          height: 500,
          top: -80,
          right: -120,
          background: "radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "none"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "layout-container", style: { zIndex: 1 }, children: /* @__PURE__ */ jsxs("div", { className: "hero-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", children: [
        /* @__PURE__ */ jsxs("div", { className: "nh-badge hero-badge fade-up", children: [
          /* @__PURE__ */ jsx(Flame, { size: 13 }),
          "ТОВ «Київ Брикет» · Київ та область"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1 }, children: [
          "Надійне тверде паливо",
          /* @__PURE__ */ jsx("br", {}),
          "з доставкою по Києву",
          /* @__PURE__ */ jsx("span", { className: "hero-h1-divider", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "та області" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "body hero-sub fade-up fade-up-d2", children: [
          "Дрова, паливні брикети та вугілля для опалення будинку, котлів і камінів.",
          " ",
          /* @__PURE__ */ jsxs("span", { style: { color: "var(--c-text)", opacity: 0.9 }, children: [
            stats[0].value,
            " років досвіду. Власний транспорт. Гарантія якості."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-ctas fade-up fade-up-d3", children: [
          /* @__PURE__ */ jsxs("button", { onClick: onQuickOrderClick, className: "nh-btn-primary hero-btn-main", children: [
            "Замовити зараз",
            " ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
          ] }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              className: "nh-btn-ghost hero-btn-phone",
              style: { border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.90)" },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 15 }),
                " ",
                "Подзвонити"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-trust-row fade-up fade-up-d3", children: [
          /* @__PURE__ */ jsxs("span", { className: "hero-trust-item", children: [
            /* @__PURE__ */ jsx("span", { className: "hero-trust-check", children: "✔" }),
            "Доставка сьогодні"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hero-trust-sep" }),
          /* @__PURE__ */ jsxs("span", { className: "hero-trust-item", children: [
            /* @__PURE__ */ jsx("span", { className: "hero-trust-check", children: "✔" }),
            "Оплата після отримання"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hero-trust-sep" }),
          /* @__PURE__ */ jsxs("span", { className: "hero-trust-item", children: [
            /* @__PURE__ */ jsx("span", { className: "hero-trust-check", children: "✔" }),
            "Чесний складометр"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "hero-urgency fade-up fade-up-d3", children: [
          /* @__PURE__ */ jsx("span", { className: "hero-dot" }),
          "Доставка по Києву можлива сьогодні"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hero-stats fade-up fade-up-d4", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "hero-stat", children: [
          /* @__PURE__ */ jsx("p", { className: "hero-stat-val", style: {
            color: s.highlight ? "var(--c-orange)" : s.accent ? "rgba(255,255,255,0.92)" : "var(--c-text)"
          }, children: s.value }),
          /* @__PURE__ */ jsx("p", { className: "hero-stat-label", children: s.label })
        ] }, s.label)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-img-wrap", children: [
        /* @__PURE__ */ jsxs("picture", { children: [
          /* @__PURE__ */ jsx("source", { media: "(max-width: 600px)", srcSet: "/images/hero-bg-mobile.webp" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/hero-bg.webp",
              alt: "Дрова, брикети та вугілля КиївБрикет",
              title: "Купити тверде паливо у Києві",
              className: "hero-img",
              loading: "eager",
              fetchPriority: "high",
              decoding: "sync",
              width: "600",
              height: "750"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hero-img-overlay" }),
        /* @__PURE__ */ jsx("div", { className: "hero-img-badges", children: imageBadges.map((item) => /* @__PURE__ */ jsxs("div", { className: "hero-img-badge", children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem" }, children: item.emoji }),
          /* @__PURE__ */ jsx("span", { className: "hero-img-badge-text", children: item.text })
        ] }, item.text)) }),
        /* @__PURE__ */ jsxs("div", { className: "hero-trust-pill", children: [
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 2 }, children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(Star, { size: 13, fill: "var(--c-orange)", color: "var(--c-orange)" }, i)) }),
          /* @__PURE__ */ jsx("span", { className: "hero-trust-text", children: "4.9 · 320+ відгуків" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        /* ── Hero section base ───────────────────── */
        .hero-section {
          position: relative;
          overflow: hidden;
          background: var(--c-bg);
          padding-top: 84px;
          padding-bottom: 56px;
        }

        /* ── Two-column desktop grid ─────────────── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        /* ── Text column ─────────────────────────── */
        .hero-badge { margin-bottom: 24px; }
        .hero-h1    { margin-bottom: 20px; }
        .hero-sub   { max-width: 420px; margin-bottom: 32px; }

        .hero-h1-divider {
          display: block;
          width: 48px;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--c-orange) 0%,
            rgba(249, 115, 22, 0.22) 100%
          );
          border-radius: 2px;
          margin: 14px 0 16px;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }

        /* Trust indicators row */
        .hero-trust-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 16px;
          margin-bottom: 16px;
        }
        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.775rem;
          color: rgba(255,255,255,0.55);
          font-weight: 500;
          white-space: nowrap;
        }
        .hero-trust-check {
          color: var(--c-orange);
          font-size: 0.7rem;
        }
        .hero-trust-sep {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.15);
          display: block;
          flex-shrink: 0;
        }
        @media (max-width: 479px) {
          .hero-trust-sep { display: none; }
          .hero-trust-row { gap: 6px 12px; }
        }

        .hero-urgency {
          font-size: 0.78rem;
          color: var(--c-orange);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--c-orange);
          display: inline-block;
          box-shadow: 0 0 6px var(--c-orange);
          flex-shrink: 0;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-wrap: wrap;
        }
        .hero-stat-val {
          font-size: 1.875rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: var(--c-text2);
          margin-top: 4px;
        }

        /* ── Image column ────────────────────────── */
        .hero-img-wrap {
          border-radius: 22px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          position: relative;
          /* Multi-layer premium shadow system */
          box-shadow:
            0 0 0 1px rgba(249,115,22,0.15),
            0 0 0 2px rgba(255,255,255,0.04),
            0 8px 24px rgba(0,0,0,0.35),
            0 32px 64px rgba(0,0,0,0.45),
            0 0 80px rgba(249,115,22,0.08);
          /* LCP: no fade-up animation — paint immediately */
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }
        /* Subtle top-edge shine */
        .hero-img-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.12) 30%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0.12) 70%,
            transparent 100%
          );
          z-index: 4;
        }
        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.88) saturate(1.08) contrast(1.04);
          display: block;
        }
        .hero-img-overlay {
          position: absolute; inset: 0;
          background:
            radial-gradient(
              ellipse 80% 50% at 50% 80%,
              rgba(249,115,22,0.06) 0%,
              transparent 60%
            ),
            linear-gradient(
              to top,
              rgba(8,12,16,0.85) 0%,
              rgba(13,17,23,0.30) 45%,
              rgba(13,17,23,0.08) 65%,
              transparent 100%
            );
        }

        .hero-img-badges {
          position: absolute; top: 18px; left: 18px;
          display: flex; flex-direction: column; gap: 8px;
          z-index: 3;
        }
        .hero-img-badge {
          display: flex; align-items: center; gap: 8px;
          background: rgba(8,12,16,0.72);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 2px solid rgba(249,115,22,0.40);
          border-radius: 10px;
          padding: 8px 14px;
          width: fit-content;
          transition: border-left-color 0.25s ease, background 0.25s ease;
        }
        .hero-img-badge:hover {
          border-left-color: rgba(249,115,22,0.75);
          background: rgba(8,12,16,0.80);
        }
        .hero-img-badge-text {
          font-size: 0.78rem;
          color: rgba(241,245,249,0.92);
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .hero-trust-pill {
          position: absolute; bottom: 22px; left: 22px;
          background: rgba(8,12,16,0.78);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 14px 20px;
          display: flex; align-items: center; gap: 10px;
          box-shadow:
            0 8px 24px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.05);
          z-index: 3;
        }
        .hero-trust-text {
          font-size: 0.82rem;
          color: rgba(241,245,249,0.92);
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        /* ── Tablet (640–767px) ──────────────────── */
        @media (max-width: 767px) {
          .hero-section { padding-bottom: 48px; }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hero-img-wrap {
            aspect-ratio: 16 / 9;
            border-radius: 16px;
            max-height: 320px;
          }
          .hero-glow-r { display: none; }
        }

        /* ── Mobile (<=479px) ────────────────────── */
        @media (max-width: 479px) {
          .hero-section {
            padding-top: 76px;
            padding-bottom: 40px;
          }

          .hero-badge { margin-bottom: 16px; font-size: 0.75rem; }

          .hero-h1 {
            margin-bottom: 16px;
            font-size: clamp(1.75rem, 8.5vw, 2.5rem);
            letter-spacing: -0.03em;
          }

          /* Divider compact on mobile */
          .hero-h1-divider {
            width: 36px;
            height: 2px;
            margin: 10px 0 12px;
          }

          .hero-sub { margin-bottom: 24px; max-width: 100%; }

          /* Buttons — full-width column on mobile */
          .hero-ctas {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 12px;
          }
          .hero-btn-main,
          .hero-btn-phone {
            width: 100%;
            justify-content: center;
            padding: 16px 24px;
            border-radius: 12px;
          }

          .hero-urgency { margin-bottom: 24px; }

          /* Stats — compact */
          .hero-stats { gap: 20px; padding-top: 16px; }
          .hero-stat-val { font-size: 1.5rem; }

          /* Image — wide/short on mobile */
          .hero-img-wrap {
            aspect-ratio: 16 / 9;
            border-radius: 12px;
            max-height: 240px;
          }
          .hero-img-badges { display: none; }
          .hero-trust-pill { padding: 8px 12px; }
          .hero-trust-text { font-size: 0.72rem; }
        }
      ` })
  ] });
}
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
const items = [
  { icon: /* @__PURE__ */ jsx(Clock, { size: 26 }), title: "12+ років на ринку", desc: "12 років стабільної роботи без затримок, скандалів та невиконаних зобовʼязань." },
  { icon: /* @__PURE__ */ jsx(Truck, { size: 26 }), title: "Власний транспорт", desc: "Власний автопарк — доставляємо без посередників та затримок." },
  { icon: /* @__PURE__ */ jsx(Clock, { size: 26 }), title: "Доставка за 24 години", desc: "Доставка за 24 години. У межах Києва — в день замовлення.", hero: true },
  { icon: /* @__PURE__ */ jsx(Scale, { size: 26 }), title: "Чесна вага та обʼєм", desc: "Зважуємо та міряємо при вас. Жодного недоважування." },
  { icon: /* @__PURE__ */ jsx(Leaf, { size: 26 }), title: "Сухе якісне паливо", desc: "Вологість дров до 20%. Брикети — лише сертифікована сировина без домішок." },
  { icon: /* @__PURE__ */ jsx(CreditCard, { size: 26 }), title: "Оплата при отриманні", desc: "Ніяких передоплат. Перевіряєте — платите. Просто і чесно." }
];
function BenefitsSection() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "about",
      ref,
      style: { padding: "100px 0", background: "var(--c-bg)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { marginBottom: "var(--s-header)" }, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Чому обирають нас" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { maxWidth: 540 }, children: [
              "Чому нам довіряють",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "понад 1000 клієнтів" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem"
              },
              className: "benefits-grid",
              children: items.map((item, i) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `nh-card benefit-card${item.hero ? " benefit-hero" : ""} reveal ${visible ? "visible" : ""}`,
                  style: {
                    padding: "1.75rem",
                    transitionDelay: `${i * 0.08}s`
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { style: {
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: item.hero ? "rgba(249,115,22,0.18)" : "rgba(249,115,22,0.10)",
                      border: item.hero ? "1px solid rgba(249,115,22,0.45)" : "1px solid rgba(249,115,22,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--c-orange)",
                      marginBottom: "var(--s-element)",
                      boxShadow: item.hero ? "0 0 18px rgba(249,115,22,0.25)" : "none",
                      transition: "background 0.22s, box-shadow 0.22s",
                      flexShrink: 0
                    }, children: item.icon }),
                    /* @__PURE__ */ jsx("h3", { className: "h3", style: { marginBottom: 8 }, children: item.title }),
                    /* @__PURE__ */ jsx("p", { className: "body-sm", children: item.desc })
                  ]
                },
                item.title
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 900px) { .benefits-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .benefits-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 479px) {
          .benefits-grid { gap: 0.875rem !important; }
          .benefits-grid .nh-card { padding: 1.25rem !important; }
        }
        .benefit-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease !important;
        }
        .benefit-hero {
          border: 1px solid rgba(249,115,22,0.30) !important;
          box-shadow: 0 0 0 1px rgba(249,115,22,0.14), 0 0 28px rgba(249,115,22,0.12), inset 0 0 40px rgba(249,115,22,0.04) !important;
        }
        .benefit-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(249,115,22,0.18), 0 2px 10px rgba(0,0,0,0.35) !important;
        }
        .benefit-hero:hover {
          box-shadow: 0 12px 44px rgba(249,115,22,0.28), 0 2px 10px rgba(0,0,0,0.35) !important;
        }
      ` })
      ]
    }
  );
}
const deliveryImg = "/assets/trust-delivery-BCu0hCWo.webp";
const deliveryImgMobile = "/assets/trust-delivery-mobile-CUdLdIQI.webp";
const points = [
  "Власний автопарк — без затримок",
  "Сертифіковане паливо",
  "1000+ постійних клієнтів",
  "Офіційна діяльність, повний пакет документів"
];
function TrustBlock({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "about-trust",
      ref,
      style: { padding: "var(--s-section) 0", background: "var(--c-green-s)", position: "relative", overflow: "hidden" },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "var(--gradient-section-fade)",
          pointerEvents: "none",
          zIndex: 0
        } }),
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--gradient-orange-line)", zIndex: 1 } }),
        /* @__PURE__ */ jsx("div", { className: "layout-container", style: { zIndex: 2 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }, className: "trust-grid", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `reveal ${visible ? "visible" : ""}`,
              style: { borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" },
              children: [
                /* @__PURE__ */ jsxs("picture", { children: [
                  /* @__PURE__ */ jsx("source", { media: "(max-width: 600px)", srcSet: deliveryImgMobile }),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: deliveryImg,
                      alt: "Доставка твердого палива",
                      loading: "lazy",
                      decoding: "async",
                      width: "720",
                      height: "540",
                      style: { width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", filter: "brightness(0.80) saturate(1.15) contrast(1.05)" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,17,23,0.55) 0%, transparent 50%)", pointerEvents: "none" } }),
                /* @__PURE__ */ jsxs("div", { style: {
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(13,17,23,0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(249,115,22,0.20)",
                  borderRadius: 12,
                  padding: "14px 20px",
                  textAlign: "center"
                }, children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "2rem", fontWeight: 900, color: "var(--c-orange)", lineHeight: 1 }, children: "12+" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "var(--c-text2)", marginTop: 4, fontWeight: 500 }, children: "років на ринку" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.15s" }, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Про нас" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { marginBottom: 20 }, children: [
              "Стабільний постачальник",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "твердого палива з 2013 року" })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9375rem", color: "var(--c-text2)", lineHeight: 1.75, marginBottom: "var(--s-block)", maxWidth: 440 }, children: "Щомісяця виконуємо десятки доставок по Києву та області. Понад 12 років працюємо без зривів термінів та невиконаних зобов'язань." }),
            /* @__PURE__ */ jsx("ul", { style: { display: "flex", flexDirection: "column", gap: 16, marginBottom: "var(--s-header)" }, children: points.map((pt) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "flex-start", gap: 12 }, children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 18, style: { color: "var(--c-orange)", flexShrink: 0, marginTop: 2 } }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.6 }, children: pt })
            ] }, pt)) }),
            /* @__PURE__ */ jsx("button", { onClick: onOrderClick, className: "nh-btn-primary", children: "Замовити з доставкою" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 840px) { .trust-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
        @media (max-width: 479px) {
          .trust-grid { gap: 1.5rem !important; }
        }
      ` })
      ]
    }
  );
}
function ProductCard({ p, delay }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isBriquettes = p.slug === "brikety" || p.slug === "ruf" || p.slug === "pinikay";
  const isCoal = p.slug === "vugillya" || p.slug === "coal_ao" || p.slug === "coal_as";
  let fakeTags = ["Деревина", "Екологічно"];
  let triggerIcon = /* @__PURE__ */ jsx(Truck, { size: 13 });
  let triggerText = "Доставка сьогодні";
  let seoDescription = "Колені дрова твердих і м’яких порід для опалення будинку, котлів та камінів. Доставка дров по Києву та області.";
  if (isBriquettes) {
    fakeTags = ["RUF", "Pini-Kay", "Висока тепловіддача"];
    triggerIcon = /* @__PURE__ */ jsx(Flame, { size: 13 });
    triggerText = "Хіт продажу";
    seoDescription = "Екологічні брикети RUF, Nestro та Pini Kay з високою тепловіддачею.";
  } else if (isCoal) {
    fakeTags = ["Антрацит", "Довгогоріння"];
    triggerIcon = /* @__PURE__ */ jsx(Package, { size: 13 });
    triggerText = "В наявності";
    seoDescription = "Кам’яне вугілля антрацит та інші види для ефективного опалення.";
  }
  const fallbackImg = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(p.name)}`;
  const initialImgUrl = getImageUrl(p.image_url, api.defaults.baseURL) || fallbackImg;
  const currentImgUrl = imgError ? fallbackImg : initialImgUrl;
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: "reveal",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        background: "var(--c-surface)",
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${hovered ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.12)" : "0 4px 20px rgba(0,0,0,0.2)",
        transitionDelay: delay,
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { height: 220, overflow: "hidden", position: "relative", flexShrink: 0 }, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: currentImgUrl,
              alt: p.name,
              loading: "lazy",
              decoding: "async",
              onError: () => {
                if (!imgError) setImgError(true);
              },
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: isCoal ? "brightness(0.75) saturate(0.9) contrast(1.2)" : "brightness(0.85) saturate(1.1)",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s ease"
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,28,37,0.85) 0%, transparent 55%)" } }),
          isCoal && /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 60%)", mixBlendMode: "overlay" } })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.2rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10, letterSpacing: "-0.02em" }, children: p.name }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6, marginBottom: 16, flex: 1 }, children: seoDescription }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }, children: fakeTags.map((t) => /* @__PURE__ */ jsx("span", { style: {
            background: "var(--c-surface2)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--c-text2)"
          }, children: t }, t)) }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/catalog/${p.slug}/`,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: hovered ? "var(--color-accent-dark)" : "var(--color-accent-primary)",
                boxShadow: hovered ? "0 4px 20px rgba(249,115,22,0.45)" : "0 2px 10px rgba(249,115,22,0.25)",
                color: "#fff",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.2s, box-shadow 0.2s"
              },
              children: [
                "Переглянути товари ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
            gap: 5,
            marginTop: 10,
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.75rem",
            fontWeight: 500,
            justifyContent: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "rgba(249,115,22,0.7)", display: "flex", alignItems: "center" }, children: triggerIcon }),
            triggerText
          ] })
        ] })
      ]
    }
  );
}
function CategoriesSection({ categories = [] }) {
  const { ref, visible } = useReveal();
  const displayCategories = categories.slice(0, 3);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "categories",
      ref,
      style: { padding: "var(--s-section) 0", background: "var(--c-green-bg)", position: "relative" },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(180deg, var(--color-bg-main) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1
        } }),
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.18) 50%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2
        } }),
        /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 3 }, children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--s-header)", flexWrap: "wrap", gap: 20 }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Асортимент" }),
              /* @__PURE__ */ jsxs("h2", { className: "h2", children: [
                "Популярні категорії",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "твердого палива" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/catalog/drova",
                style: { color: "var(--c-text2)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 },
                onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
                onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
                children: [
                  "Всі товари ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `cat-grid ${visible ? "visible" : ""}`,
              style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" },
              children: displayCategories.map((p, i) => /* @__PURE__ */ jsx(ProductCard, { p, delay: `${i * 0.1}s` }, p.slug || i))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr !important; max-width: 480px; margin-left: auto; margin-right: auto; } }
        @media (max-width: 600px) { .cat-grid { max-width: 100% !important; } }
        @media (max-width: 479px) {
          .cat-grid article > div:first-child { height: 180px !important; }
          .cat-grid article > div:last-child { padding: 1.125rem !important; }
          .cat-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
        .cat-grid .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .cat-grid.visible .reveal:nth-child(1) { opacity:1; transform:none; transition-delay:0s; }
        .cat-grid.visible .reveal:nth-child(2) { opacity:1; transform:none; transition-delay:0.1s; }
        .cat-grid.visible .reveal:nth-child(3) { opacity:1; transform:none; transition-delay:0.2s; }
      ` })
      ]
    }
  );
}
const zones = [
  { name: "Київ", detail: "Доставка в день замовлення (до 4 годин)", time: "0–4 год" },
  { name: "Ближнє Підмістя", detail: "Бориспіль, Бровари, Вишневе, Ірпінь, Буча", time: "24 год" },
  { name: "Київська область", detail: "Фастів, Біла Церква, Обухів, Переяслав", time: "24–48 год" }
];
const OBLAST_PATH$1 = "M 78,44 L 108,18 L 152,6 L 200,10 L 250,6 L 300,22 L 348,52 L 376,94 L 380,140 L 365,182 L 334,220 L 292,248 L 248,260 L 200,262 L 152,260 L 108,248 L 68,220 L 38,180 L 22,138 L 26,92 Z";
const SAT_PINS$1 = [
  { label: "Бровари", cx: 272, cy: 100, beginAnim: "0s" },
  { label: "Ірпінь", cx: 104, cy: 116, beginAnim: "1.1s" },
  { label: "Бориспіль", cx: 298, cy: 192, beginAnim: "0.5s" },
  { label: "Вишневе", cx: 118, cy: 196, beginAnim: "1.7s" }
];
function KyivMap({ hoveredZone }) {
  const oblastActive = hoveredZone === "Київська область";
  const suburbActive = hoveredZone === "Ближнє Підмістя";
  const kyivActive = hoveredZone === "Київ";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 400 300",
      xmlns: "http://www.w3.org/2000/svg",
      style: { width: "100%", height: "100%", display: "block" },
      "aria-label": "Карта зони доставки Київ Брикет",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("filter", { id: "kb-noise", x: "0%", y: "0%", width: "100%", height: "100%", colorInterpolationFilters: "sRGB", children: [
            /* @__PURE__ */ jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.78", numOctaves: "4", seed: "9", stitchTiles: "stitch", result: "noise" }),
            /* @__PURE__ */ jsx("feColorMatrix", { type: "saturate", values: "0", in: "noise", result: "gray" }),
            /* @__PURE__ */ jsx("feBlend", { in: "SourceGraphic", in2: "gray", mode: "overlay", result: "blend" }),
            /* @__PURE__ */ jsx("feComposite", { in: "blend", in2: "SourceGraphic", operator: "in" })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: "kb-glow", cx: "50%", cy: "50%", r: "50%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#F97316", stopOpacity: kyivActive ? "0.45" : "0.30" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#F97316", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxs("filter", { id: "kb-pin-glow", x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "4", result: "blur" }),
            /* @__PURE__ */ jsxs("feMerge", { children: [
              /* @__PURE__ */ jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: "kb-vignette", cx: "50%", cy: "50%", r: "70%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "55%", stopColor: "rgba(0,0,0,0)" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(0,0,0,0.42)" })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: "kb-bg-depth", cx: "50%", cy: "53%", r: "55%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#132b1a" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#080f0a" })
          ] }),
          /* @__PURE__ */ jsx("clipPath", { id: "kb-clip", children: /* @__PURE__ */ jsx("rect", { width: "400", height: "300" }) })
        ] }),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: "#080f0a" }),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: "url(#kb-bg-depth)" }),
        [50, 100, 150, 200, 250].map((y) => /* @__PURE__ */ jsx(
          "line",
          {
            x1: "0",
            y1: y,
            x2: "400",
            y2: y,
            stroke: "rgba(255,255,255,0.03)",
            strokeWidth: "1"
          },
          `h${y}`
        )),
        [57, 114, 171, 228, 285, 342].map((x) => /* @__PURE__ */ jsx(
          "line",
          {
            x1: x,
            y1: "0",
            x2: x,
            y2: "300",
            stroke: "rgba(255,255,255,0.03)",
            strokeWidth: "1"
          },
          `v${x}`
        )),
        /* @__PURE__ */ jsx(
          "rect",
          {
            width: "400",
            height: "300",
            fill: "rgba(255,255,255,0.07)",
            filter: "url(#kb-noise)",
            clipPath: "url(#kb-clip)",
            style: { mixBlendMode: "overlay" }
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: OBLAST_PATH$1,
            fill: oblastActive ? "rgba(249,115,22,0.055)" : "rgba(249,115,22,0.025)",
            stroke: oblastActive ? "rgba(249,115,22,0.48)" : "rgba(249,115,22,0.32)",
            strokeWidth: "1.5",
            strokeDasharray: "5 4",
            strokeLinejoin: "round",
            style: { transition: "fill 0.35s, stroke 0.35s" }
          }
        ),
        /* @__PURE__ */ jsx(
          "ellipse",
          {
            cx: "200",
            cy: "158",
            rx: "76",
            ry: "60",
            fill: "none",
            stroke: suburbActive ? "rgba(249,115,22,0.50)" : "rgba(249,115,22,0.18)",
            strokeWidth: "1",
            strokeDasharray: "4 5",
            style: { transition: "stroke 0.35s" }
          }
        ),
        [0, 0.73, 1.46].map((begin, i) => /* @__PURE__ */ jsxs(
          "circle",
          {
            cx: "200",
            cy: "158",
            r: "22",
            fill: "none",
            stroke: "rgba(249,115,22,0.70)",
            strokeWidth: "1.5",
            children: [
              /* @__PURE__ */ jsx("animate", { attributeName: "r", from: "22", to: "50", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` }),
              /* @__PURE__ */ jsx("animate", { attributeName: "opacity", from: "0.55", to: "0", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` })
            ]
          },
          i
        )),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "200",
            cy: "158",
            r: kyivActive ? 70 : 52,
            fill: "url(#kb-glow)",
            style: { transition: "r 0.4s ease" }
          }
        ),
        SAT_PINS$1.map((pin) => /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "9", fill: "rgba(249,115,22,0.12)" }),
          /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "4.5", fill: "#F97316", opacity: "0.75", filter: "url(#kb-pin-glow)", children: /* @__PURE__ */ jsx(
            "animate",
            {
              attributeName: "opacity",
              values: "0.6;1;0.6",
              dur: "3.5s",
              repeatCount: "indefinite",
              begin: pin.beginAnim
            }
          ) }),
          /* @__PURE__ */ jsx(
            "text",
            {
              x: pin.cx,
              y: pin.cy + 19,
              textAnchor: "middle",
              style: { fontFamily: "Inter, sans-serif", fontSize: "8.5px", fontWeight: 600, fill: "rgba(255,255,255,0.30)" },
              children: pin.label
            }
          )
        ] }, pin.label)),
        /* @__PURE__ */ jsxs("g", { filter: "url(#kb-pin-glow)", children: [
          /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "11", fill: "#F97316" }),
          /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "5", fill: "#fff" })
        ] }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "200",
            y: "143",
            textAnchor: "middle",
            style: { fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, fill: "rgba(255,255,255,0.55)" },
            children: "Київ"
          }
        ),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: "url(#kb-vignette)" }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "14",
            y: "285",
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              fontWeight: 700,
              fill: "rgba(249,115,22,0.65)",
              letterSpacing: "0.07em",
              textTransform: "uppercase"
            },
            children: "КИЇВ ТА ОБЛАСТЬ"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "200",
            y: "293",
            textAnchor: "middle",
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: "8px",
              fontWeight: 400,
              fill: "rgba(255,255,255,0.20)"
            },
            children: "Працюємо по всій Київській області"
          }
        )
      ]
    }
  );
}
function DeliverySection() {
  const { ref, visible } = useReveal();
  const [hoveredZone, setHoveredZone] = useState(null);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "delivery",
      ref,
      style: { padding: "100px 0", background: "var(--c-bg)", position: "relative" },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          background: "var(--gradient-section-fade)",
          pointerEvents: "none",
          zIndex: 0
        } }),
        /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1 }, children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "var(--s-header)" }, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Зона покриття" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { marginBottom: 12 }, children: [
              "Доставляємо по",
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "Києву та області" })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9375rem", color: "var(--c-text2)", maxWidth: 460, margin: "0 auto", marginBottom: "1.5rem" }, children: "Власний автопарк дозволяє нам контролювати терміни і якість доставки без посередників." }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "40px", fontSize: "0.75rem", fontWeight: 600, color: "var(--c-text)" }, children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 14, color: "var(--c-orange)" }),
                " 5000+ доставок"
              ] }),
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "40px", fontSize: "0.75rem", fontWeight: 600, color: "var(--c-text)" }, children: [
                /* @__PURE__ */ jsx(Star, { size: 14, color: "var(--c-orange)" }),
                " 12 років досвіду"
              ] }),
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "40px", fontSize: "0.75rem", fontWeight: 600, color: "var(--c-text)" }, children: [
                /* @__PURE__ */ jsx(Truck, { size: 14, color: "var(--c-orange)" }),
                " власний автопарк"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" },
              className: "delivery-grid",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `reveal ${visible ? "visible" : ""}`,
                    style: {
                      background: "var(--color-bg-green-card)",
                      border: "1px solid var(--color-border-orange-lg)",
                      borderRadius: 16,
                      overflow: "hidden",
                      position: "relative",
                      aspectRatio: "4/3"
                    },
                    children: /* @__PURE__ */ jsx(KyivMap, { hoveredZone })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `reveal ${visible ? "visible" : ""}`,
                    style: { display: "flex", flexDirection: "column", gap: "1rem", transitionDelay: "0.12s" },
                    children: [
                      zones.map((z) => /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "nh-card",
                          onMouseEnter: () => setHoveredZone(z.name),
                          onMouseLeave: () => setHoveredZone(null),
                          style: {
                            padding: "1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 16,
                            cursor: "default",
                            border: `1px solid ${hoveredZone === z.name ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.07)"}`,
                            transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                            transform: hoveredZone === z.name ? "translateX(4px)" : "none",
                            boxShadow: hoveredZone === z.name ? "0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(249,115,22,0.08)" : "none"
                          },
                          children: [
                            /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
                              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
                                /* @__PURE__ */ jsx(MapPin, { size: 15, color: "var(--c-orange)" }),
                                /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, color: "var(--c-text)", fontSize: "0.9375rem" }, children: z.name })
                              ] }),
                              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.5 }, children: z.detail })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { style: {
                              background: hoveredZone === z.name ? "rgba(249,115,22,0.18)" : "rgba(249,115,22,0.10)",
                              border: "1px solid rgba(249,115,22,0.20)",
                              borderRadius: 8,
                              padding: "6px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                              transition: "background 0.25s"
                            }, children: [
                              /* @__PURE__ */ jsx(Clock, { size: 12, color: "var(--c-orange)" }),
                              /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--c-orange)" }, children: z.time })
                            ] })
                          ]
                        },
                        z.name
                      )),
                      /* @__PURE__ */ jsxs("div", { style: {
                        padding: "1.25rem",
                        background: "rgba(249,115,22,0.06)",
                        borderRadius: 12,
                        border: "1px solid rgba(249,115,22,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12
                      }, children: [
                        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ jsx(CheckCircle2, { size: 17, style: { color: "var(--c-orange)", flexShrink: 0, marginTop: 2 } }),
                          /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", lineHeight: 1.6 }, children: [
                            "Потрібна доставка за межі Київської обл.?",
                            " ",
                            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Зв'яжіться з нами" }),
                            " — знайдемо рішення."
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs(
                          "a",
                          {
                            href: "#contact",
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 7,
                              background: "#F97316",
                              color: "#fff",
                              borderRadius: 9,
                              padding: "10px 18px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              alignSelf: "flex-start",
                              boxShadow: "0 2px 12px rgba(249,115,22,0.30)",
                              transition: "background 0.2s, box-shadow 0.2s"
                            },
                            onMouseEnter: (e) => {
                              e.currentTarget.style.background = "#ea580c";
                              e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.45)";
                            },
                            onMouseLeave: (e) => {
                              e.currentTarget.style.background = "#F97316";
                              e.currentTarget.style.boxShadow = "0 2px 12px rgba(249,115,22,0.30)";
                            },
                            children: [
                              "Уточнити доставку ",
                              /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                            ]
                          }
                        )
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) { .delivery-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 479px) {
          .delivery-grid { gap: 0.875rem !important; }
          .delivery-grid .nh-card { padding: 1rem !important; }
        }
      ` })
      ]
    }
  );
}
const reviews = [
  {
    id: 1,
    name: "Олена Ковальчук",
    city: "Київ, Оболонь",
    stars: 5,
    text: "Замовляємо дрова вже третій рік поспіль. Завжди сухі, чесна вага, привезли точно в домовлений час. Рекомендую всім сусідам по дачному кооперативу.",
    initials: "ОК",
    date: "Жовтень 2024"
  },
  {
    id: 2,
    name: "Дмитро Марченко",
    city: "Ірпінь",
    stars: 5,
    text: "Брали вугілля антрацит на зиму. Якість відмінна — котел тримає температуру значно краще ніж з попереднього постачальника. Ціна адекватна, доставка швидка. Наступного сезону знову тільки до вас.",
    initials: "ДМ",
    date: "Листопад 2024"
  },
  {
    id: 3,
    name: "Наталія Бондаренко",
    city: "Бровари",
    stars: 5,
    text: "Паливні брикети — щось нове для мене, але менеджер детально пояснив різницю між RUF і Pini-Kay. Зупинилась на RUF, задоволена на 100%.",
    initials: "НБ",
    date: "Грудень 2024"
  }
];
function StarRow({ count, bright }) {
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 3 }, children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(
    Star,
    {
      size: 14,
      fill: i < count ? "#F97316" : "transparent",
      color: "#F97316",
      style: {
        opacity: bright ? 1 : 0.75,
        transition: "opacity 0.2s",
        filter: bright && i < count ? "drop-shadow(0 0 3px rgba(249,115,22,0.7))" : "none"
      }
    },
    i
  )) });
}
function ReviewCard({ r, delay }) {
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "nh-card review-card",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transitionDelay: delay,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        border: `1px solid ${hovered ? "rgba(249,115,22,0.30)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.45), 0 0 0 1px rgba(249,115,22,0.10), 0 0 32px rgba(249,115,22,0.08)" : "0 6px 24px rgba(0,0,0,0.22)",
        transition: "transform 0.25s ease, border-color 0.25s, box-shadow 0.25s"
      },
      children: [
        /* @__PURE__ */ jsx(Quote, { size: 28, style: { color: hovered ? "rgba(249,115,22,0.45)" : "rgba(249,115,22,0.22)", transition: "color 0.25s" } }),
        /* @__PURE__ */ jsx(StarRow, { count: r.stars, bright: hovered }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.7, flex: 1 }, children: [
          '"',
          r.text,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--c-orange-dk), var(--c-orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
            boxShadow: hovered ? "0 0 14px rgba(249,115,22,0.45)" : "none",
            transition: "box-shadow 0.25s"
          }, children: r.initials }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", fontWeight: 700, color: "var(--c-text)" }, children: r.name }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "var(--c-text3)" }, children: r.city })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", flexShrink: 0 }, children: r.date })
        ] })
      ]
    }
  );
}
function ReviewsSection() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      style: {
        padding: "var(--s-section) 0 5rem",
        background: "linear-gradient(180deg, #0D1117 0%, var(--c-green-bg) 30%, var(--c-green-bg) 100%)",
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "var(--s-header)" }, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Відгуки клієнтів" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { marginBottom: 28 }, children: [
              "Що кажуть",
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "наші клієнти" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
              background: "var(--color-bg-overlay)",
              border: "1px solid rgba(249,115,22,0.26)",
              borderRadius: 16,
              padding: "18px 36px",
              boxShadow: "0 0 48px rgba(249,115,22,0.10), 0 0 0 1px rgba(249,115,22,0.04), inset 0 1px 0 rgba(255,255,255,0.05)"
            }, children: [
              /* @__PURE__ */ jsx("div", { className: `rating-stars ${visible ? "stars-visible" : ""}`, style: { display: "flex", gap: 5 }, children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(
                Star,
                {
                  size: 20,
                  fill: "#F97316",
                  color: "#F97316",
                  className: "rating-star",
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(249,115,22,0.75))",
                    animationDelay: `${i * 0.08}s`
                  }
                },
                i
              )) }),
              /* @__PURE__ */ jsx("div", { style: { width: 1, height: 40, background: "rgba(255,255,255,0.10)" } }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 5, lineHeight: 1 }, children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    fontSize: "2.6rem",
                    fontWeight: 900,
                    color: "var(--color-accent-display)",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    textShadow: "0 0 30px rgba(249,115,22,0.65), 0 0 60px rgba(249,115,22,0.25)"
                  }, children: "4.9" }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "1.05rem", color: "rgba(249,115,22,0.45)", fontWeight: 600 }, children: "/ 5" })
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.76rem", color: "rgba(255,255,255,0.36)", fontWeight: 400, letterSpacing: "0.01em" }, children: [
                  "на основі ",
                  /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.62)", fontWeight: 600 }, children: "320+" }),
                  " відгуків"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { marginTop: 14 }, children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "#contact",
                style: {
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.32)",
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "color 0.2s"
                },
                onMouseEnter: (e) => e.currentTarget.style.color = "rgba(249,115,22,0.80)",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.32)",
                children: "Переглянути всі відгуки →"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `reviews-grid ${visible ? "visible" : ""}`,
              style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" },
              children: reviews.map((r, i) => /* @__PURE__ */ jsx(ReviewCard, { r, delay: `${i * 0.1}s` }, r.id))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        /* Star shimmer animation */
        @keyframes starPop {
          0%   { opacity: 0; transform: scale(0.5); }
          60%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 1; transform: scale(1); }
        }
        .rating-star { opacity: 0; }
        .stars-visible .rating-star {
          animation: starPop 0.40s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr !important; max-width: 520px; margin: 0 auto; } }
        @media (max-width: 600px) { .reviews-grid { max-width: 100% !important; } }
        @media (max-width: 479px) {
          .rating-pill {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 14px 20px !important;
            width: 100% !important;
            max-width: 280px !important;
          }
          .rating-pill-divider { display: none !important; }
          .review-card { padding: 1.25rem !important; }
        }
        .reviews-grid .nh-card { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease, border-color 0.25s, box-shadow 0.25s; }
        .reviews-grid.visible .nh-card:nth-child(1) { opacity:1; transform:none; transition-delay:0s; }
        .reviews-grid.visible .nh-card:nth-child(2) { opacity:1; transform:none; transition-delay:0.1s; }
        .reviews-grid.visible .nh-card:nth-child(3) { opacity:1; transform:none; transition-delay:0.2s; }
        .reviews-grid.visible .nh-card:hover { transform: translateY(-6px) !important; }
      ` })
      ]
    }
  );
}
const SEO_STYLES = `
/* ── Outer section wrappers ─────────────────────────────── */
.seo-s1, .seo-s2 {
    padding: 80px 24px;
}

/* ── Premium glass container ────────────────────────────── */
.seo-box {
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow:
        0 12px 48px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.04),
        inset 0 -1px 0 rgba(255,255,255,0.02);
    padding: 64px 72px;
}
/* Section boxes — slightly lighter than page bg */
.seo-s1 .seo-box,
.seo-s2 .seo-box {
    background: linear-gradient(160deg, #101827 0%, #0c1520 100%);
}

/* ── Two-column layout ──────────────────────────────────── */
.seo-grid {
    display: grid;
    grid-template-columns: 55% 1fr;
    gap: 56px;
    align-items: start;
}

/* ── Section label above heading ── */
.seo-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(251,146,60,0.85);
    margin-bottom: 20px;
}
.seo-label::before {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    background: rgba(251,146,60,0.7);
    border-radius: 2px;
}

/* ── H2 ─────────────────────────────────────────────────── */
.seo-h2 {
    font-size: 41px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.5px;
    color: #f1f5f9;
    margin: 0 0 32px;
}

/* ── Text block ─────────────────────────────────────────── */
.seo-text {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 560px;
}
.seo-text p {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(241,245,249,0.60);
    margin: 0;
}

/* ── SEO links — soft orange with border-bottom ─────────── */
.seo-a {
    color: #fb923c;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,120,40,0.38);
    transition:
        color 0.18s ease,
        border-bottom-color 0.18s ease;
    padding-bottom: 1px;
}
.seo-a:hover {
    color: #fed7aa;
    border-bottom-color: rgba(254,186,96,0.75);
}

/* ── RIGHT COLUMN — Section 1: feature strips ──────────── */
.seo-strips {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.seo-strip {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-left: 2px solid rgba(251,146,60,0.35);
    transition: border-left-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.seo-strip:hover {
    background: rgba(255,255,255,0.04);
    border-left-color: rgba(251,146,60,0.75);
    transform: translateX(3px);
}

.seo-strip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.28);
    box-shadow: 0 0 12px rgba(251,146,60,0.18);
    color: #fb923c;
}

.seo-strip-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.seo-strip-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
    line-height: 1.3;
}
.seo-strip-desc {
    font-size: 0.8125rem;
    color: rgba(241,245,249,0.5);
    margin: 0;
    line-height: 1.5;
}

/* ── RIGHT COLUMN — Section 2: nav category cards ──────── */
.seo-navcards {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Link wrapper resets */
.seo-navcard-link {
    display: block;
    text-decoration: none;
    border-radius: 16px;
}

.seo-navcard {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 16px;
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.055);
    cursor: pointer;
    transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
}
.seo-navcard-link:hover .seo-navcard {
    background: rgba(255,255,255,0.055);
    border-color: rgba(251,146,60,0.3);
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(0,0,0,0.38), 0 0 0 1px rgba(251,146,60,0.1);
}
.seo-navcard-link:hover .seo-navcard-arrow {
    color: #fb923c;
    transform: translateX(4px);
}

.seo-navcard-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.28);
    box-shadow: 0 0 14px rgba(251,146,60,0.2);
    color: #fb923c;
    transition: box-shadow 0.22s ease;
}
.seo-navcard-link:hover .seo-navcard-icon {
    box-shadow: 0 0 22px rgba(251,146,60,0.38);
}

/* ── Checklist under text ───────────────────────────────── */
.seo-checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
    padding: 0;
    list-style: none;
}
.seo-checklist li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: rgba(241,245,249,0.72);
    line-height: 1.4;
}
.seo-check-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(251,146,60,0.15);
    border: 1px solid rgba(251,146,60,0.3);
    color: #fb923c;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
}

.seo-s2-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    margin-top: 28px;
}
.seo-text-wide {
    max-width: 100%;
}
.seo-text-wide p + p {
    margin-top: 14px;
}
.seo-checklist-row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin-top: 20px;
}
.seo-checklist-row li {
    font-size: 0.875rem;
}

/* ── CTA button ─────────────────────────────────────────── */
.seo-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    padding: 12px 24px;
    border-radius: 10px;
    background: rgba(251,146,60,0.12);
    border: 1px solid rgba(251,146,60,0.3);
    color: #fb923c;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.seo-cta-btn:hover {
    background: rgba(251,146,60,0.2);
    border-color: rgba(251,146,60,0.55);
    box-shadow: 0 0 24px rgba(251,146,60,0.18);
    transform: translateY(-2px);
    color: #fed7aa;
}

.seo-navcard-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.seo-navcard-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
}
.seo-navcard-desc {
    font-size: 0.8125rem;
    color: rgba(241,245,249,0.5);
    margin: 0;
    line-height: 1.5;
}
.seo-navcard-arrow {
    color: rgba(251,146,60,0.5);
    flex-shrink: 0;
    transition: color 0.2s ease, transform 0.2s ease;
}
.seo-navcard:hover .seo-navcard-arrow {
    color: #fb923c;
    transform: translateX(4px);
}

/* ── Divider between the two sections ──────────────────── */
.seo-divider {
    max-width: 1200px;
    margin: 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%);
    border: none;
}

/* ── Responsive: tablet ─────────────────────────────────── */
@media (max-width: 960px) {
    .seo-s1, .seo-s2 { padding: 60px 16px; }
    .seo-box  { padding: 40px 32px; }
    .seo-grid { grid-template-columns: 1fr; gap: 36px; }
    .seo-h2   { font-size: 32px; }
}

/* ── Responsive: mobile ─────────────────────────────────── */
@media (max-width: 540px) {
    .seo-s1, .seo-s2 { padding: 48px 12px; }
    .seo-box  { padding: 28px 20px; border-radius: 16px; }
    .seo-h2   { font-size: 26px; letter-spacing: -0.2px; }
    .seo-text p { font-size: 0.9375rem; }
    .seo-strip { flex-direction: column; }
}
`;
function SeoIntroSection() {
  return /* @__PURE__ */ jsx("section", { className: "seo-s1", style: { background: "var(--c-bg)" }, children: /* @__PURE__ */ jsxs("div", { className: "seo-box", children: [
    /* @__PURE__ */ jsx("p", { className: "seo-label", children: "Про компанію" }),
    /* @__PURE__ */ jsxs("h2", { className: "seo-h2", children: [
      "Тверде паливо з доставкою",
      /* @__PURE__ */ jsx("br", {}),
      "по Києву та області"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "seo-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "seo-text", children: [
        /* @__PURE__ */ jsx("p", { children: "Компанія «КиївБрикет» постачає тверде паливо для опалення будинків, котлів та камінів." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "У каталозі представлені",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/catalog/drova",
              title: "Купити колоті дрова з доставкою по Києву",
              className: "seo-a",
              children: "колоті дрова"
            }
          ),
          " ",
          "різних порід,",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/catalog/brikety",
              title: "Купити паливні брикети",
              className: "seo-a",
              children: "паливні брикети"
            }
          ),
          " ",
          "та",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/catalog/vugillya",
              title: "Купити кам'яне вугілля",
              className: "seo-a",
              children: "кам'яне вугілля"
            }
          ),
          " ",
          "з доставкою по Києву та Київській області."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Ми працюємо без посередників та доставляємо паливо власним транспортом. Усі замовлення доставляються у погоджений час із чесним складометром та можливістю оплати після отримання." }),
        /* @__PURE__ */ jsx("p", { children: "Ви можете замовити дубові, грабові, березові або соснові дрова, екологічні паливні брикети типу RUF, Nestro або Pini-Kay, а також кам'яне вугілля для котлів і печей." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "seo-strips", children: [
        /* @__PURE__ */ jsxs("div", { className: "seo-strip", children: [
          /* @__PURE__ */ jsx("div", { className: "seo-strip-icon", children: /* @__PURE__ */ jsx(Truck, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "seo-strip-body", children: [
            /* @__PURE__ */ jsx("p", { className: "seo-strip-title", children: "Доставка по Києву" }),
            /* @__PURE__ */ jsx("p", { className: "seo-strip-desc", children: "Власний транспорт, доставка в день замовлення" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "seo-strip", children: [
          /* @__PURE__ */ jsx("div", { className: "seo-strip-icon", children: /* @__PURE__ */ jsx(Ruler, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "seo-strip-body", children: [
            /* @__PURE__ */ jsx("p", { className: "seo-strip-title", children: "Чесний складометр" }),
            /* @__PURE__ */ jsx("p", { className: "seo-strip-desc", children: "Об'єм перевіряється при вас під час розвантаження" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "seo-strip", children: [
          /* @__PURE__ */ jsx("div", { className: "seo-strip-icon", children: /* @__PURE__ */ jsx(Banknote, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "seo-strip-body", children: [
            /* @__PURE__ */ jsx("p", { className: "seo-strip-title", children: "Оплата після отримання" }),
            /* @__PURE__ */ jsx("p", { className: "seo-strip-desc", children: "Без передоплати — ви платите лише після перевірки" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "seo-strip", children: [
          /* @__PURE__ */ jsx("div", { className: "seo-strip-icon", children: /* @__PURE__ */ jsx(Clock, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "seo-strip-body", children: [
            /* @__PURE__ */ jsx("p", { className: "seo-strip-title", children: "Зручний час доставки" }),
            /* @__PURE__ */ jsx("p", { className: "seo-strip-desc", children: "Погоджуємо зручний для вас час приїзду" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function SeoFooterSection() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { style: { padding: "0 24px" }, children: /* @__PURE__ */ jsx("hr", { className: "seo-divider", "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsxs("section", { className: "seo-s2", style: { background: "transparent" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "seo-box", children: [
        /* @__PURE__ */ jsx("p", { className: "seo-label", children: "Каталог" }),
        /* @__PURE__ */ jsx("h2", { className: "seo-h2", children: "Купити дрова, брикети та вугілля у Києві" }),
        /* @__PURE__ */ jsxs("div", { className: "seo-grid", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "seo-text seo-text-wide", children: [
              /* @__PURE__ */ jsx("p", { children: "Компанія «КиївБрикет» — надійний постачальник твердого палива з доставкою по Києву та Київській області." }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Ми пропонуємо широкий вибір",
                " ",
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/catalog/drova",
                    title: "Купити дрова з доставкою по Києву",
                    className: "seo-a",
                    children: "дров"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/catalog/brikety",
                    title: "Купити паливні брикети",
                    className: "seo-a",
                    children: "паливних брикетів"
                  }
                ),
                " ",
                "та",
                " ",
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/catalog/vugillya",
                    title: "Купити кам'яне вугілля",
                    className: "seo-a",
                    children: "кам'яного вугілля"
                  }
                ),
                " ",
                "для ефективного опалення приватних будинків, котлів та камінів."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "seo-checklist seo-checklist-row", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "seo-check-icon", children: "✓" }),
                "Доставка по Києву та Київській області"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "seo-check-icon", children: "✓" }),
                "Чесний складометр — об'єм при вас"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("span", { className: "seo-check-icon", children: "✓" }),
                "Оплата після отримання, без передоплат"
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/catalog/drova", className: "seo-cta-btn", children: [
              "Обрати паливо",
              /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "seo-navcards", children: [
            /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", className: "seo-navcard-link", children: /* @__PURE__ */ jsxs("div", { className: "seo-navcard", children: [
              /* @__PURE__ */ jsx("div", { className: "seo-navcard-icon", children: /* @__PURE__ */ jsx(TreePine, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "seo-navcard-body", children: [
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-title", children: "Дрова колоті" }),
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-desc", children: "Дуб, граб, береза, сосна — складометрами" })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "seo-navcard-arrow" })
            ] }) }),
            /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-navcard-link", children: /* @__PURE__ */ jsxs("div", { className: "seo-navcard", children: [
              /* @__PURE__ */ jsx("div", { className: "seo-navcard-icon", children: /* @__PURE__ */ jsx(Package, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "seo-navcard-body", children: [
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-title", children: "Паливні брикети" }),
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-desc", children: "RUF, Nestro, Pini-Kay — екологічне паливо" })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "seo-navcard-arrow" })
            ] }) }),
            /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-navcard-link", children: /* @__PURE__ */ jsxs("div", { className: "seo-navcard", children: [
              /* @__PURE__ */ jsx("div", { className: "seo-navcard-icon", children: /* @__PURE__ */ jsx(Flame, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "seo-navcard-body", children: [
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-title", children: "Кам'яне вугілля" }),
                /* @__PURE__ */ jsx("p", { className: "seo-navcard-desc", children: "Антрацит для котлів та печей" })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "seo-navcard-arrow" })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("style", { children: SEO_STYLES })
    ] })
  ] });
}
function SeoContentBlock() {
  return /* @__PURE__ */ jsx("section", { className: "seo-content", style: { padding: "0 24px 60px" }, children: /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: 1200,
    margin: "0 auto",
    borderRadius: 24,
    background: "linear-gradient(160deg, #101827 0%, #0c1520 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
    padding: "clamp(28px, 5vw, 64px) clamp(20px, 5vw, 72px)"
  }, children: [
    /* @__PURE__ */ jsx("h2", { className: "seo-h2", style: { fontSize: "clamp(22px, 4vw, 32px)", marginBottom: 24 }, children: "Купити дрова, паливні брикети та вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: {
      color: "rgba(241,245,249,0.60)",
      fontSize: "1rem",
      lineHeight: 1.75,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
      gap: "2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { margin: "0 0 16px" }, children: "Опалення приватного будинку чи дачі — відповідальне завдання, що потребує якісного палива та надійного постачальника. Компанія «КиївБрикет» працює на ринку твердого палива вже понад 10 років, забезпечуючи мешканців Києва та Київської області дровами, паливними брикетами та кам'яним вугіллям найвищої якості." }),
        /* @__PURE__ */ jsxs("p", { style: { margin: "0 0 16px" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", className: "seo-a", children: "Купити дрова у Києві" }),
          " — одне з найпопулярніших рішень для опалення. У нашому каталозі представлені колоті дрова різних порід: дубові, грабові, березові, соснові та ясенові. Кожна порода має свої переваги: дуб та граб дають тривалий жар і максимальну тепловіддачу, береза та сосна легко розпалюються і створюють приємну атмосферу. Усі дрова ретельно висушені до вологості не більше 20%, що забезпечує ефективне горіння без зайвого диму."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { margin: "0 0 16px" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-a", children: "Паливні брикети" }),
          " — сучасна альтернатива традиційним дровам. Завдяки технології пресування деревної тирси під високим тиском, брикети мають вологість лише 6–10% та щільність, що в рази перевищує натуральну деревину. Ми пропонуємо три основні типи: RUF — класичні прямокутні брикети з тепловіддачею до 5200 ккал/кг; Pini Kay — преміум восьмигранні брикети з центральним каналом для покращеного горіння; Nestro — доступні циліндричні брикети без хімічних добавок. Одна тонна брикетів замінює 3–4 складометри дров за кількістю тепла."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { margin: "0 0 16px" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-a", children: "Кам'яне вугілля" }),
          " залишається незамінним для потужних котельних систем. Антрацит горіх та антрацит насіння забезпечують максимальну теплотворність — до 7500 ккал/кг. Ми також пропонуємо газове вугілля марок ДО та ДПК для промислових та побутових котлів. Низька зольність та мінімальний вміст сірки роблять наше вугілля безпечним для довготривалого використання."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { margin: "0 0 16px" }, children: "Доставка палива здійснюється власним автопарком по всьому Києву та Київській області. Ми використовуємо ГАЗелі, ЗІЛи та КАМАЗи залежно від обсягу замовлення. Мінімальне замовлення — 1 складометр дров або 1 тонна брикетів/вугілля. Доставка можлива в день замовлення, у зручний для вас час, включаючи вихідні дні." }),
        /* @__PURE__ */ jsx("p", { style: { margin: "0 0 16px" }, children: "Ми працюємо без передоплати — ви оплачуєте замовлення лише після отримання та перевірки якості та об'єму. Чесний складометр, гарантована вологість, сертифіковане вугілля — все це входить у стандарт обслуговування «КиївБрикет». Замовляйте тверде паливо онлайн або за телефоном — ми завжди на зв'язку." })
      ] })
    ] })
  ] }) });
}
function FaqSection$5({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("section", { className: "faq-mobile-section", style: { padding: "4rem 0 6rem", background: "var(--color-bg-main)", position: "relative" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { marginBottom: "2.5rem", textAlign: "left", fontSize: "2rem" }, children: "Поширені питання" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: faqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", { style: {
      background: "var(--color-bg-elevated)",
      border: "1px solid var(--color-border-subtle)",
      borderRadius: 16,
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(openIndex === idx ? null : idx),
          style: {
            width: "100%",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
            border: "none",
            color: "var(--c-text)",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            gap: "1rem",
            fontFamily: "inherit"
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.name }),
            /* @__PURE__ */ jsx(ChevronDown, { size: 20, color: "var(--c-orange)", style: {
              flexShrink: 0,
              transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease"
            } })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { style: {
        maxHeight: openIndex === idx ? 300 : 0,
        padding: openIndex === idx ? "0 1.5rem 1.5rem" : "0 1.5rem",
        opacity: openIndex === idx ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.3s ease",
        color: "var(--c-text2)",
        fontSize: "1rem",
        lineHeight: 1.6
      }, children: faq.acceptedAnswer.text })
    ] }, idx)) })
  ] }) });
}
const fireplaceImg = "/assets/cta-fireplace-B2KksctH.webp";
function CtaBanner() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "var(--s-section) 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* Clip boundaries to a max width of 1200px centered, slicing the stretched image */
        clipPath: "inset(0 calc(max(0px, 50vw - 600px)) round 24px)",
        marginBottom: "var(--s-section)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: fireplaceImg,
            alt: "Тепло вдома",
            loading: "lazy",
            decoding: "async",
            width: "1400",
            height: "933",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 60%",
              /* Shift focus down to show the fire logs */
              filter: "brightness(0.22) saturate(0.75)",
              zIndex: 0
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.04) 50%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: 740,
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "nh-badge",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginBottom: 28
                  },
                  children: [
                    /* @__PURE__ */ jsx(Flame, { size: 13 }),
                    "Пропозиція обмежена · Зима 2025/26"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "h2",
                {
                  style: {
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    color: "var(--c-text)",
                    marginBottom: 20,
                    textAlign: "center"
                  },
                  children: [
                    "Замовте тверде паливо",
                    /* @__PURE__ */ jsx("br", {}),
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "p",
                {
                  style: {
                    fontSize: "1rem",
                    color: "var(--c-text2)",
                    lineHeight: 1.75,
                    maxWidth: 480,
                    textAlign: "center",
                    marginBottom: 40
                  },
                  children: [
                    "Ціни зростають із першим похолоданням.",
                    " ",
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Забронюйте паливо зараз за фіксованою ціною." })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "cta-btns", children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "#contact",
                    className: "nh-btn-primary cta-btn-main",
                    style: { fontSize: "1rem", padding: "16px 40px" },
                    children: [
                      "Оформити замовлення ",
                      /* @__PURE__ */ jsx(ArrowRight, { size: 17 })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
                    className: "cta-btn-phone",
                    style: {
                      fontSize: "1rem",
                      padding: "15px 40px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      borderRadius: 14,
                      border: "2px solid rgba(249,115,22,0.55)",
                      color: "#F97316",
                      background: "transparent",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      boxShadow: "0 0 20px rgba(249,115,22,0.12)",
                      textDecoration: "none",
                      transition: "border-color 0.22s, box-shadow 0.22s, background 0.22s, color 0.22s",
                      cursor: "pointer",
                      fontFamily: "inherit"
                    },
                    onMouseEnter: (e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = "rgba(249,115,22,0.9)";
                      el.style.boxShadow = "0 0 32px rgba(249,115,22,0.28)";
                      el.style.background = "rgba(249,115,22,0.08)";
                      el.style.color = "#fff";
                    },
                    onMouseLeave: (e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = "rgba(249,115,22,0.55)";
                      el.style.boxShadow = "0 0 20px rgba(249,115,22,0.12)";
                      el.style.background = "transparent";
                      el.style.color = "#F97316";
                    },
                    children: [
                      /* @__PURE__ */ jsx(Phone, { size: 16, style: { flexShrink: 0 } }),
                      "Подзвонити"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx("span", { style: {
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--c-orange)",
                  boxShadow: "0 0 8px var(--c-orange)",
                  animation: "ctaPulse 2s ease-in-out infinite",
                  flexShrink: 0
                } }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }, children: "Сьогодні ще доступна доставка" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes ctaPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--c-orange); }
          50% { opacity: 0.5; box-shadow: 0 0 3px var(--c-orange); }
        }
        .cta-btns {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 479px) {
          .cta-btns {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
          .cta-btn-main,
          .cta-btn-phone {
            width: 100% !important;
            padding: 16px 24px !important;
            min-width: unset !important;
            justify-content: center;
            border-radius: 12px !important;
          }
        }
      ` })
      ]
    }
  );
}
const fuelOptions = ["Дрова", "Паливні брикети", "Вугілля", "Декілька видів"];
function ContactSection() {
  const [form, setForm] = useState({ name: "", fuel: "", message: "" });
  const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
  const [status, setStatus] = useState("idle");
  const { ref, visible } = useReveal();
  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/orders/quick", {
        customer_name: form.name,
        customer_phone: rawPhone,
        delivery_method: form.fuel || null,
        delivery_date: form.message || null
      });
      setStatus("success");
    } catch (err) {
      console.error("Consultation form error:", err);
      setStatus("success");
    }
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "contact",
      ref,
      style: { padding: "var(--s-section) 0", background: "var(--c-bg)", position: "relative", overflow: "hidden" },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(180deg, var(--color-bg-main) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0
        } }),
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 640, height: 420, background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 } }),
        /* @__PURE__ */ jsx("div", { className: "layout-container", style: { zIndex: 1 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }, className: "contact-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Зв'язатись з нами" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { marginBottom: 16 }, children: [
              "Замовте паливо",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)", textDecoration: "underline", textDecorationColor: "rgba(249,115,22,0.35)", textUnderlineOffset: "5px", textDecorationThickness: "2px" }, children: "сьогодні — без затримок" })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9375rem", color: "var(--c-text2)", lineHeight: 1.7, marginBottom: 36, maxWidth: 360 }, children: "Передзвонимо протягом 15 хвилин та узгодимо зручний час доставки." }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }, children: [
              { Icon: Phone, text: shopConfig.contact.phone, href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, label: "Телефон" },
              { Icon: Mail, text: "info@kievbriket.com", href: "mailto:info@kievbriket.com", label: "Email" },
              { Icon: MapPin, text: "Київ та область", href: "https://maps.google.com/?q=Київ", label: "Доставка" }
            ].map(({ Icon, text, href, label }) => /* @__PURE__ */ jsxs(
              "a",
              {
                href,
                style: { display: "flex", alignItems: "center", gap: 14, textDecoration: "none" },
                children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: "rgba(249,115,22,0.12)",
                    border: "1px solid rgba(249,115,22,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 14px rgba(249,115,22,0.08)"
                  }, children: /* @__PURE__ */ jsx(Icon, { size: 18, color: "#F97316" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "rgba(255,255,255,0.40)", marginBottom: 2, letterSpacing: "0.04em" }, children: label }),
                    /* @__PURE__ */ jsx("p", { style: { fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }, children: text })
                  ] })
                ]
              },
              href
            )) }),
            /* @__PURE__ */ jsxs("div", { style: { background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: 12, padding: "1.25rem 1.5rem" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, children: [
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--c-text2)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }, children: "Графік роботи" }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.75rem", color: "rgba(34,197,94,1)", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "0.5rem", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }, children: "●" }),
                  " ",
                  "Працюємо без вихідних"
                ] })
              ] }),
              [
                { days: "Пн – Пт", hours: "09:00 – 20:00" },
                { days: "Сб – Нд", hours: "09:00 – 20:00" }
              ].map((h) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)" }, children: h.days }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text)" }, children: h.hours })
              ] }, h.days))
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `reveal ${visible ? "visible" : ""}`,
              style: {
                background: "var(--c-surface)",
                border: "1px solid var(--c-border)",
                borderRadius: 18,
                padding: "2.25rem",
                transitionDelay: "0.12s"
              },
              children: status === "success" ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "2rem 0" }, children: [
                /* @__PURE__ */ jsx("div", { style: { width: 60, height: 60, background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 26, color: "var(--color-success)" }) }),
                /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.2rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10 }, children: "Заявку прийнято!" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9rem", color: "var(--c-text2)", marginBottom: 24 }, children: "Передзвонимо протягом 15 хвилин." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      setStatus("idle");
                      setForm({ name: "", fuel: "", message: "" });
                      resetPhone();
                    },
                    style: { background: "none", border: "none", color: "var(--c-orange)", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" },
                    children: "Нова заявка →"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
                /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 4 }, children: "Залишити заявку" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", marginBottom: 2 }, children: "Передзвонимо протягом 15 хвилин." }),
                /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { color: "var(--color-success-glow)", fontSize: "0.65rem" }, children: "●" }),
                  "Без передоплат. Консультація безкоштовна."
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, className: "form-row", children: [
                  [
                    { key: "name", label: "Ваше ім'я", placeholder: "Іван", type: "text" }
                  ].map((f) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                    /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }, children: f.label }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: f.type,
                        placeholder: f.placeholder,
                        value: form[f.key],
                        onChange: setField(f.key),
                        required: f.required || false,
                        style: {
                          background: "var(--c-surface2)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: 10,
                          padding: "12px 14px",
                          color: "var(--c-text)",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.2s",
                          fontFamily: "inherit"
                        },
                        onFocus: (e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)",
                        onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
                      }
                    )
                  ] }, f.key)),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                    /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Телефон *" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ...phoneProps,
                        required: true,
                        style: {
                          background: "var(--c-surface2)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: 10,
                          padding: "12px 14px",
                          color: "var(--c-text)",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.2s",
                          fontFamily: "inherit"
                        },
                        onFocus: (e) => {
                          phoneProps.onFocus(e);
                          e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
                        },
                        onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "contact-fuel", style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Тип палива" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      id: "contact-fuel",
                      value: form.fuel,
                      onChange: setField("fuel"),
                      style: {
                        background: "var(--c-surface2)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        color: form.fuel ? "var(--c-text)" : "var(--c-text3)",
                        fontSize: "0.9rem",
                        outline: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        appearance: "none"
                      },
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Оберіть вид палива" }),
                        fuelOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
                  /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Коментар (необов'язково)" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      placeholder: "Напр.: потрібно 5 скл. м дубових дров...",
                      value: form.message,
                      onChange: setField("message"),
                      rows: "3",
                      style: {
                        background: "var(--c-surface2)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        color: "var(--c-text)",
                        fontSize: "0.9rem",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s"
                      },
                      onFocus: (e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)",
                      onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "nh-btn-primary",
                    disabled: status === "loading",
                    style: { justifyContent: "center", marginTop: 4, width: "100%", padding: "17px 24px" },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.boxShadow = "0 0 28px rgba(249,115,22,0.35), 0 8px 24px rgba(0,0,0,0.30)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.boxShadow = "";
                    },
                    children: status === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
                      " Надсилаємо..."
                    ] }) : "Замовити консультацію"
                  }
                ),
                /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.74rem", color: "rgba(255,255,255,0.30)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { color: "rgba(249,115,22,0.55)", fontSize: "0.6rem" }, children: "⏱" }),
                  "Передзвонимо протягом 15 хвилин у робочий час"
                ] }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "var(--c-text3)", textAlign: "center" }, children: "Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних" })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 840px) { .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }
        @media (max-width: 479px) {
          .contact-grid { gap: 2rem !important; }
          .contact-icon { width: 40px !important; height: 40px !important; border-radius: 10px !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      ` })
      ]
    }
  );
}
const BASE_FIREWOOD_PER_M2 = 0.07;
const HEATING_MULTIPLIER = {
  stove: 1.1,
  boiler: 0.9,
  fireplace: 1.2
};
const HEATING_LABEL = {
  stove: "Піч",
  boiler: "Твердопаливний котел",
  fireplace: "Камін"
};
const INSULATION_MULTIPLIER = {
  poor: 1.2,
  medium: 1,
  good: 0.8
};
const INSULATION_LABEL = {
  poor: "Слабке",
  medium: "Середнє",
  good: "Хороше"
};
const FUEL_CONVERSION = {
  drova: { unit: "складометрів дров", shortUnit: "м³ дров", pricePerUnit: 2400, factor: 1 },
  brikety: { unit: "т паливних брикетів", shortUnit: "т брикетів", pricePerUnit: 8e3, factor: 0.45 },
  vugillya: { unit: "т кам'яного вугілля", shortUnit: "т вугілля", pricePerUnit: 9e3, factor: 0.35 }
};
function calculate(area, heating, insulation, fuel) {
  const base = area * BASE_FIREWOOD_PER_M2;
  const adjusted = base * HEATING_MULTIPLIER[heating] * INSULATION_MULTIPLIER[insulation];
  const fuelData = FUEL_CONVERSION[fuel];
  const volume = adjusted * fuelData.factor;
  const cost = volume * fuelData.pricePerUnit;
  const alternatives = Object.entries(FUEL_CONVERSION).filter(([key]) => key !== fuel).map(([, data]) => ({
    volume: +(adjusted * data.factor).toFixed(1),
    unit: data.shortUnit
  }));
  return {
    volume: fuel === "drova" ? Math.round(volume) : +volume.toFixed(1),
    unit: fuelData.unit,
    cost: Math.round(cost / 100) * 100,
    area,
    heatingLabel: HEATING_LABEL[heating],
    insulationLabel: INSULATION_LABEL[insulation],
    alternatives
  };
}
const HEATING_OPTIONS = [
  { value: "stove", label: "Піч", icon: /* @__PURE__ */ jsx(Flame, { size: 15 }) },
  { value: "boiler", label: "Твердопаливний котел", icon: /* @__PURE__ */ jsx(Thermometer, { size: 15 }) },
  { value: "fireplace", label: "Камін", icon: /* @__PURE__ */ jsx(Home$1, { size: 15 }) }
];
const INSULATION_OPTIONS = [
  { value: "poor", label: "Слабке утеплення" },
  { value: "medium", label: "Середнє утеплення" },
  { value: "good", label: "Хороше утеплення" }
];
const FUEL_OPTIONS = [
  { value: "drova", label: "Дрова", icon: /* @__PURE__ */ jsx(TreePine, { size: 15 }) },
  { value: "brikety", label: "Паливні брикети", icon: /* @__PURE__ */ jsx(Package, { size: 15 }) },
  { value: "vugillya", label: "Кам'яне вугілля", icon: /* @__PURE__ */ jsx(Flame, { size: 15 }) }
];
const PANEL_PREVIEW = "preview";
const PANEL_LOADING = "loading";
const PANEL_RESULT = "result";
function FuelCalculatorSection({ onQuickOrderClick, defaultFuelType = "drova" }) {
  const { ref, visible } = useReveal();
  const [area, setArea] = useState("");
  const [heating, setHeating] = useState("boiler");
  const [insulation, setInsulation] = useState("medium");
  const [fuel, setFuel] = useState(defaultFuelType);
  const [result, setResult] = useState(null);
  const [panelState, setPanelState] = useState(PANEL_PREVIEW);
  const resultRef = useRef(null);
  const handleCalculate = () => {
    const numArea = parseInt(area, 10);
    if (!numArea || numArea < 10 || numArea > 1e3) return;
    setPanelState(PANEL_LOADING);
    setTimeout(() => {
      const res = calculate(numArea, heating, insulation, fuel);
      setResult(res);
      setPanelState(PANEL_RESULT);
      if (window.innerWidth < 900 && resultRef.current) {
        setTimeout(() => {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);
      }
    }, 700);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalculate();
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      style: { padding: "100px 0", background: "transparent" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
          /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { marginBottom: "var(--s-header)" }, children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: "var(--s-tight)" }, children: "Калькулятор палива" }),
            /* @__PURE__ */ jsxs("h2", { className: "h2", style: { maxWidth: 640 }, children: [
              "Розрахуйте скільки палива потрібно",
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "для вашого будинку" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "body-sm", style: { marginTop: 12, maxWidth: 540, color: "var(--c-text2)" }, children: "Онлайн калькулятор допоможе приблизно визначити об'єм дров, брикетів або вугілля для опалення вашого дому." }),
            /* @__PURE__ */ jsx("p", { style: {
              fontSize: "0.75rem",
              color: "var(--c-text3)",
              marginTop: 8,
              fontStyle: "italic"
            }, children: "Середній розрахунок для опалення будинку в кліматі Київської області." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `calc-card reveal ${visible ? "visible" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "calc-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "calc-inputs", children: [
              /* @__PURE__ */ jsxs("div", { className: "calc-field", children: [
                /* @__PURE__ */ jsx("label", { className: "calc-label", htmlFor: "calc-area", children: "Площа будинку (м²)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "calc-area",
                    type: "number",
                    className: "calc-input",
                    placeholder: "120",
                    min: "10",
                    max: "1000",
                    value: area,
                    onChange: (e) => setArea(e.target.value),
                    onKeyDown: handleKeyDown
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "calc-hint", children: "Від 30 до 500 м²" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "calc-field", children: [
                /* @__PURE__ */ jsx("p", { className: "calc-label", children: "Тип опалення" }),
                /* @__PURE__ */ jsx("div", { className: "calc-radio-group", children: HEATING_OPTIONS.map((opt) => /* @__PURE__ */ jsxs("label", { className: `calc-radio ${heating === opt.value ? "active" : ""}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "heating",
                      value: opt.value,
                      checked: heating === opt.value,
                      onChange: () => setHeating(opt.value)
                    }
                  ),
                  opt.icon,
                  opt.label
                ] }, opt.value)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "calc-field", children: [
                /* @__PURE__ */ jsx("p", { className: "calc-label", children: "Рівень утеплення" }),
                /* @__PURE__ */ jsx("div", { className: "calc-radio-group", children: INSULATION_OPTIONS.map((opt) => /* @__PURE__ */ jsxs("label", { className: `calc-radio ${insulation === opt.value ? "active" : ""}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "insulation",
                      value: opt.value,
                      checked: insulation === opt.value,
                      onChange: () => setInsulation(opt.value)
                    }
                  ),
                  opt.label
                ] }, opt.value)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "calc-field", children: [
                /* @__PURE__ */ jsx("p", { className: "calc-label", children: "Тип палива" }),
                /* @__PURE__ */ jsx("div", { className: "calc-radio-group", children: FUEL_OPTIONS.map((opt) => /* @__PURE__ */ jsxs("label", { className: `calc-radio ${fuel === opt.value ? "active" : ""}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "fuel",
                      value: opt.value,
                      checked: fuel === opt.value,
                      onChange: () => setFuel(opt.value)
                    }
                  ),
                  opt.icon,
                  opt.label
                ] }, opt.value)) })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "nh-btn-primary calc-btn",
                  onClick: handleCalculate,
                  disabled: panelState === PANEL_LOADING,
                  children: [
                    /* @__PURE__ */ jsx(Calculator, { size: 16 }),
                    "Розрахувати"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "calc-panel", ref: resultRef, children: [
              panelState === PANEL_PREVIEW && /* @__PURE__ */ jsxs("div", { className: "calc-panel-state calc-preview", children: [
                /* @__PURE__ */ jsx("div", { className: "calc-preview-icon", children: /* @__PURE__ */ jsx(Calculator, { size: 28 }) }),
                /* @__PURE__ */ jsx("p", { className: "calc-preview-title", children: "Приклад розрахунку" }),
                /* @__PURE__ */ jsxs("div", { className: "calc-preview-params", children: [
                  /* @__PURE__ */ jsxs("div", { className: "calc-preview-param", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-label", children: "Будинок" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-value", children: "120 м²" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "calc-preview-param", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-label", children: "Опалення" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-value", children: "Твердопаливний котел" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "calc-preview-param", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-label", children: "Утеплення" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-param-value", children: "Середнє" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "calc-preview-result", children: [
                  /* @__PURE__ */ jsxs("p", { className: "calc-preview-result-line", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-approx", children: "≈" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-num", children: "7–8" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-unit", children: "м³ дров" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "calc-preview-or", children: "або" }),
                  /* @__PURE__ */ jsxs("p", { className: "calc-preview-result-line", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-approx", children: "≈" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-num", children: "3–4" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-preview-unit", children: "т паливних брикетів" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "calc-preview-helper", children: "Заповніть параметри зліва та натисніть «Розрахувати» — система порахує точний об'єм палива для вашого будинку." })
              ] }),
              panelState === PANEL_LOADING && /* @__PURE__ */ jsxs("div", { className: "calc-panel-state calc-loading", children: [
                /* @__PURE__ */ jsx("div", { className: "calc-loading-spinner", children: /* @__PURE__ */ jsx(Loader2, { size: 28 }) }),
                /* @__PURE__ */ jsx("p", { className: "calc-loading-text", children: "Розраховуємо..." })
              ] }),
              panelState === PANEL_RESULT && result && /* @__PURE__ */ jsxs("div", { className: "calc-panel-state calc-result-state", children: [
                /* @__PURE__ */ jsx("p", { className: "calc-res-header", children: "Ваш результат" }),
                /* @__PURE__ */ jsxs("div", { className: "calc-res-summary", children: [
                  /* @__PURE__ */ jsxs("div", { className: "calc-res-summary-row", children: [
                    /* @__PURE__ */ jsx("span", { children: "Площа будинку" }),
                    /* @__PURE__ */ jsxs("span", { className: "calc-res-summary-val", children: [
                      result.area,
                      " м²"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "calc-res-summary-row", children: [
                    /* @__PURE__ */ jsx("span", { children: "Тип опалення" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-res-summary-val", children: result.heatingLabel })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "calc-res-summary-row", children: [
                    /* @__PURE__ */ jsx("span", { children: "Утеплення" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-res-summary-val", children: result.insulationLabel })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "calc-res-main", children: [
                  /* @__PURE__ */ jsx("p", { className: "calc-res-main-label", children: "Необхідний об'єм палива:" }),
                  /* @__PURE__ */ jsxs("div", { className: "calc-res-main-value", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-res-approx", children: "≈" }),
                    /* @__PURE__ */ jsx("span", { className: "calc-res-number", children: result.volume }),
                    /* @__PURE__ */ jsx("span", { className: "calc-res-unit", children: result.unit })
                  ] }),
                  result.alternatives.length > 0 && /* @__PURE__ */ jsx("div", { className: "calc-res-alts", children: result.alternatives.map((alt, i) => /* @__PURE__ */ jsxs("p", { className: "calc-res-alt-line", children: [
                    /* @__PURE__ */ jsx("span", { className: "calc-res-alt-or", children: i === 0 ? "або" : "" }),
                    /* @__PURE__ */ jsxs("span", { className: "calc-res-alt-num", children: [
                      "≈ ",
                      alt.volume
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "calc-res-alt-unit", children: alt.unit })
                  ] }, i)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "calc-res-cost", children: [
                  /* @__PURE__ */ jsx("p", { className: "calc-res-cost-label", children: "Орієнтовна вартість:" }),
                  /* @__PURE__ */ jsxs("p", { className: "calc-res-cost-value", children: [
                    "≈ ",
                    result.cost.toLocaleString("uk-UA"),
                    " грн"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "calc-res-actions", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      className: "nh-btn-primary",
                      onClick: onQuickOrderClick,
                      style: { width: "100%", justifyContent: "center" },
                      children: [
                        "Замовити доставку цього об'єму ",
                        /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
                      className: "nh-btn-ghost",
                      style: {
                        width: "100%",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.15)"
                      },
                      children: [
                        /* @__PURE__ */ jsx(Phone, { size: 15 }),
                        " Зателефонувати"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { marginTop: "0.5rem", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "1.1rem", lineHeight: 1 }, children: "💡" }),
                  /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.8125rem", color: "var(--c-text2)", margin: 0, lineHeight: 1.5 }, children: [
                    /* @__PURE__ */ jsx("strong", { style: { color: "var(--c-text)" }, children: "Підказка:" }),
                    /* @__PURE__ */ jsx("br", {}),
                    " Будинок 100м² зазвичай потребує 6–8 складометрів дров на сезон."
                  ] })
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `reveal ${visible ? "visible" : ""}`,
              style: { marginTop: "var(--s-block)", maxWidth: 840 },
              children: [
                /* @__PURE__ */ jsx("h3", { className: "h3", style: { marginBottom: 12, fontSize: "1rem" }, children: "Скільки дров потрібно на опалення будинку" }),
                /* @__PURE__ */ jsx("p", { className: "body-sm", style: { lineHeight: 1.75 }, children: "Для опалення будинку 100 м² в Київській області зазвичай потрібно 6–8 складометрів дров за сезон. Будинок 120 м² потребує приблизно 8–10 складометрів, а для 150 м² — близько 10–12 складометрів. Витрати залежать від типу котла, рівня утеплення та породи дерева. Паливні брикети мають вищу теплотворність: для аналогічного будинку витрати брикетів становлять приблизно 3–5 тонн за сезон. Кам'яне вугілля ще ефективніше — 2–4 тонни забезпечать тепло на весь опалювальний період." })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                /* ── Calculator card ──────────────────────── */
                .calc-card {
                    background: linear-gradient(160deg, #101827 0%, #0c1520 100%);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 24px;
                    box-shadow:
                        0 12px 48px rgba(0,0,0,0.45),
                        inset 0 1px 0 rgba(255,255,255,0.04);
                    padding: 48px;
                    overflow: hidden;
                }

                .calc-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: start;
                }

                /* ── Inputs ───────────────────────────────── */
                .calc-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }

                .calc-field {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .calc-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--c-text);
                    margin: 0;
                }

                .calc-input {
                    width: 100%;
                    max-width: 280px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    color: var(--c-text);
                    font-size: 1rem;
                    font-family: inherit;
                    font-weight: 600;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    -moz-appearance: textfield;
                }
                .calc-input::-webkit-outer-spin-button,
                .calc-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .calc-input::placeholder {
                    color: rgba(255,255,255,0.25);
                    font-weight: 400;
                }
                .calc-input:focus {
                    border-color: rgba(249,115,22,0.50);
                    box-shadow: 0 0 0 3px rgba(249,115,22,0.12), 0 0 20px rgba(249,115,22,0.08);
                }

                .calc-hint {
                    font-size: 0.72rem;
                    color: var(--c-text3);
                }

                /* ── Radio buttons ────────────────────────── */
                .calc-radio-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .calc-radio {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.025);
                    color: var(--c-text2);
                    font-size: 0.8125rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .calc-radio input {
                    display: none;
                }
                .calc-radio:hover {
                    border-color: rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.04);
                }
                .calc-radio.active {
                    border-color: rgba(249,115,22,0.45);
                    background: rgba(249,115,22,0.10);
                    color: var(--c-orange-lt);
                    box-shadow: 0 0 16px rgba(249,115,22,0.10);
                }

                /* ── Calculate button ─────────────────────── */
                .calc-btn {
                    align-self: flex-start;
                    padding: 14px 32px !important;
                }
                .calc-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* ══════════════════════════════════════════
                   RIGHT PANEL — shared wrapper
                   ══════════════════════════════════════════ */
                .calc-panel {
                    border: 1px solid rgba(249,115,22,0.15);
                    border-radius: 20px;
                    padding: 40px 28px;
                    min-height: 460px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(
                            600px circle at center,
                            rgba(249,115,22,0.05),
                            transparent 70%
                        ),
                        rgba(255,255,255,0.015);
                    box-shadow:
                        0 0 0 1px rgba(249,115,22,0.08),
                        0 0 30px rgba(249,115,22,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.03);
                }

                /* ── State transition ── */
                .calc-panel-state {
                    width: 100%;
                    animation: calcPanelIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes calcPanelIn {
                    from { opacity: 0; transform: scale(0.97) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }

                /* ══════════════════════════════════════════
                   PREVIEW state
                   ══════════════════════════════════════════ */
                .calc-preview-icon {
                    width: 64px; height: 64px;
                    border-radius: 18px;
                    background: rgba(249,115,22,0.12);
                    border: 1px solid rgba(249,115,22,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--c-orange);
                    margin-bottom: 20px;
                    box-shadow: 0 0 24px rgba(249,115,22,0.10);
                }

                .calc-preview-title {
                    font-size: 1.25rem;
                    font-weight: 650;
                    color: var(--c-text);
                    margin: 0 0 20px;
                }

                .calc-preview-params {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                }
                .calc-preview-param {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8125rem;
                }
                .calc-preview-param-label {
                    color: var(--c-text3);
                }
                .calc-preview-param-value {
                    color: var(--c-text);
                    font-weight: 600;
                }

                .calc-preview-result {
                    margin-bottom: 22px;
                    padding: 16px;
                    background: rgba(249,115,22,0.05);
                    border: 1px solid rgba(249,115,22,0.12);
                    border-radius: 12px;
                }
                .calc-preview-result-line {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    margin: 0;
                    line-height: 1.4;
                }
                .calc-preview-approx {
                    font-size: 1rem;
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-preview-num {
                    font-size: 1.25rem;
                    color: var(--c-orange);
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }
                .calc-preview-unit {
                    font-size: 0.8125rem;
                    color: var(--c-text2);
                    font-weight: 500;
                }
                .calc-preview-or {
                    font-size: 0.75rem;
                    color: var(--c-text3);
                    margin: 4px 0 4px 24px;
                }

                .calc-preview-helper {
                    font-size: 0.8125rem;
                    color: rgba(255,255,255,0.50);
                    line-height: 1.65;
                    margin: 0;
                }

                /* ══════════════════════════════════════════
                   LOADING state
                   ══════════════════════════════════════════ */
                .calc-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    min-height: 200px;
                }
                .calc-loading-spinner {
                    width: 56px; height: 56px;
                    border-radius: 16px;
                    background: rgba(249,115,22,0.10);
                    border: 1px solid rgba(249,115,22,0.22);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--c-orange);
                    animation: calcSpin 0.8s linear infinite;
                }
                .calc-loading-spinner svg {
                    animation: calcSpin 0.8s linear infinite;
                }
                @keyframes calcSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .calc-loading-text {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--c-text2);
                    margin: 0;
                }

                /* ══════════════════════════════════════════
                   RESULT state
                   ══════════════════════════════════════════ */
                .calc-result-state {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .calc-res-header {
                    font-size: 1.125rem;
                    font-weight: 650;
                    color: var(--c-text);
                    margin: 0 0 2px;
                }

                /* Summary rows */
                .calc-res-summary {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 14px 16px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    font-size: 0.8125rem;
                }
                .calc-res-summary-row {
                    display: flex;
                    justify-content: space-between;
                    color: var(--c-text3);
                }
                .calc-res-summary-val {
                    color: var(--c-text);
                    font-weight: 600;
                }

                /* Main volume */
                .calc-res-main {
                    padding: 16px;
                    background: rgba(249,115,22,0.05);
                    border: 1px solid rgba(249,115,22,0.12);
                    border-radius: 12px;
                }
                .calc-res-main-label {
                    font-size: 0.78rem;
                    color: var(--c-text3);
                    margin: 0 0 8px;
                }
                .calc-res-main-value {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .calc-res-approx {
                    font-size: 1.375rem;
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-res-number {
                    font-size: 1.75rem;
                    font-weight: 900;
                    color: var(--c-text);
                    letter-spacing: -0.03em;
                    line-height: 1;
                }
                .calc-res-unit {
                    font-size: 0.875rem;
                    color: var(--c-text2);
                    font-weight: 500;
                }

                /* Alternative fuels */
                .calc-res-alts {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(249,115,22,0.10);
                }
                .calc-res-alt-line {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin: 0;
                    font-size: 0.875rem;
                    line-height: 1.8;
                }
                .calc-res-alt-or {
                    font-size: 0.72rem;
                    color: var(--c-text3);
                    min-width: 24px;
                }
                .calc-res-alt-num {
                    color: var(--c-orange);
                    font-weight: 700;
                }
                .calc-res-alt-unit {
                    color: var(--c-text2);
                    font-weight: 500;
                }

                /* Cost */
                .calc-res-cost {
                    padding: 14px 16px;
                    background: rgba(249,115,22,0.06);
                    border: 1px solid rgba(249,115,22,0.15);
                    border-radius: 12px;
                }
                .calc-res-cost-label {
                    font-size: 0.78rem;
                    color: var(--c-text3);
                    margin: 0 0 4px;
                }
                .calc-res-cost-value {
                    font-size: 1.375rem;
                    font-weight: 800;
                    color: var(--c-orange);
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                /* Actions */
                .calc-res-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 2px;
                }

                /* ══════════════════════════════════════════
                   Responsive
                   ══════════════════════════════════════════ */
                @media (max-width: 900px) {
                    .calc-card { padding: 32px 24px; }
                    .calc-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                    .calc-panel { min-height: auto; }
                }

                @media (max-width: 479px) {
                    .calc-card { padding: 24px 16px; border-radius: 16px; }
                    .calc-input { max-width: 100%; }
                    .calc-btn { width: 100%; justify-content: center; }
                    .calc-panel { padding: 28px 20px; border-radius: 14px; }
                    .calc-res-number { font-size: 1.5rem; }
                    .calc-preview-title { font-size: 1.125rem; }
                }
            ` })
      ]
    }
  );
}
function usePageSEO(route) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/pages/by-route", { params: { route } }).then((res) => setPageData(res.data)).catch((err) => {
      console.error(`Error fetching SEO data for route ${route}:`, err);
      setPageData(null);
    }).finally(() => setLoading(false));
  }, [route]);
  return { pageData, loading };
}
function Home() {
  const { addToCart } = useContext(CartContext);
  const { categories } = useCategories();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [allCakes, setAllCakes] = useState([]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { pageData } = usePageSEO("/");
  const handleQuickOrderDefault = () => {
    setIsOrderFormOpen(true);
  };
  useEffect(() => {
    api.get("/products/").then((response) => {
      const data = response.data;
      const items2 = Array.isArray(data) ? data : data.items || [];
      setAllCakes(items2);
      setFeaturedCakes(items2.slice(0, 4));
    }).catch((error) => {
      console.error("Error fetching featured products", error);
    });
  }, []);
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness"],
    "name": shopConfig.name,
    "image": `${shopConfig.domain}/og-image.jpg`,
    "url": `${shopConfig.domain}/`,
    "telephone": shopConfig.contact.phone,
    "priceRange": "₴₴",
    "areaServed": { "@type": "City", "name": "Kyiv" },
    "sameAs": [shopConfig.contact.instagram],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "вул. Колекторна, 19",
      "addressLocality": "Київ",
      "postalCode": "02000",
      "addressRegion": "Київська область",
      "addressCountry": "UA"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "20:00"
    }
  };
  const faqQuestions = [
    {
      "@type": "Question",
      "name": "Які дрова краще для опалення?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Для котлів та камінів найчастіше використовують дубові або грабові дрова. Вони мають високу тепловіддачу та довго горять."
      }
    },
    {
      "@type": "Question",
      "name": "Чи можна оплатити після доставки?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Так. Ми працюємо без передоплати — оплата можлива після перевірки замовлення."
      }
    },
    {
      "@type": "Question",
      "name": "Скільки часу займає доставка?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "По Києву доставка можлива в день замовлення. По області — протягом 24 годин."
      }
    },
    {
      "@type": "Question",
      "name": "Які паливні брикети краще?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Брикети Pini-Kay мають високу щільність і довго горять, а брикети RUF є більш доступними за ціною."
      }
    },
    {
      "@type": "Question",
      "name": "Чи доставляєте ви по Київській області?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Так, доставка здійснюється по Києву та всій Київській області власним транспортом."
      }
    }
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqQuestions
  };
  const productSchema = featuredCakes.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url ? product.image_url.startsWith("http") ? product.image_url : `${shopConfig.domain}${product.image_url}` : "",
    "description": `Купити ${product.name} з доставкою в Києві. Чесний об'єм, швидка доставка.`,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "UAH",
      "availability": "https://schema.org/InStock",
      "url": `${shopConfig.domain}${getProductUrl(product)}`
    }
  }));
  const combinedSchema = [homeSchema, faqSchema, ...productSchema];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: pageData?.meta_title || "Дрова, брикети та вугілля з доставкою по Києву | КиївБрикет",
        description: pageData?.meta_description || "Купити дрова, паливні брикети та вугілля у Києві. Швидка доставка по Києву та області. Чесний складометр, оплата після отримання.",
        canonicalUrl: `${shopConfig.domain}/`,
        schema: combinedSchema
      }
    ),
    /* @__PURE__ */ jsx(HeroSection, { onQuickOrderClick: handleQuickOrderDefault }),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(TrustBlock, { onOrderClick: handleQuickOrderDefault }),
    /* @__PURE__ */ jsx(CategoriesSection, { categories }),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: handleQuickOrderDefault }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(ReviewsSection, {}),
    /* @__PURE__ */ jsx(FaqSection$5, { faqs: faqQuestions }),
    /* @__PURE__ */ jsx(SeoIntroSection, {}),
    /* @__PURE__ */ jsx(SeoFooterSection, {}),
    /* @__PURE__ */ jsx(SeoContentBlock, {}),
    /* @__PURE__ */ jsx(CtaBanner, {}),
    /* @__PURE__ */ jsx(ContactSection, {}),
    /* @__PURE__ */ jsx(
      OrderFormModal,
      {
        isOpen: isOrderFormOpen,
        onClose: () => setIsOrderFormOpen(false)
      }
    )
  ] });
}
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}
function GoogleAnalytics() {
  const [gaId, setGaId] = useState(null);
  useEffect(() => {
    api.get("/api/site-settings/ga").then((res) => {
      const id = res.data?.ga_tracking_id;
      if (id && id.trim()) {
        setGaId(id.trim());
      }
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    if (!gaId) return;
    if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    const inlineScript = document.createElement("script");
    inlineScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
    document.head.appendChild(inlineScript);
  }, [gaId]);
  return null;
}
function NotFound() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "404 — Сторінку не знайдено | Firewood",
        robots: "noindex, follow",
        is404: true
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      padding: "2rem"
    }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: "6rem", margin: 0, color: "var(--color-primary, #b76e79)" }, children: "404" }),
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }, children: "Сторінку не знайдено" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#777", maxWidth: "480px", marginBottom: "2rem" }, children: "На жаль, сторінка, яку ви шукаєте, не існує або була переміщена. Перевірте правильність URL-адреси або поверніться на головну." }),
      /* @__PURE__ */ jsx(Link, { to: "/", style: {
        display: "inline-block",
        padding: "12px 32px",
        background: "var(--color-primary, #b76e79)",
        color: "#fff",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: 600,
        transition: "opacity .2s"
      }, children: "На головну" })
    ] })
  ] });
}
function HeroCategory$2({ onQuickOrderClick, activeCategory, activeCategorySlug }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kievbriket.com/" },
            { "@type": "ListItem", "position": 2, "name": activeCategory?.name || "Дрова", "item": "https://kievbriket.com/catalog/drova" }
          ]
        })
      } }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: activeCategory?.name || "Дрова" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: activeCategory?.name?.toLowerCase() || "дрова" }),
          " у Києві"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "body hero-sub fade-up fade-up-d2", style: { maxWidth: 600, marginBottom: "clamp(0.65rem, 2.5vw, 1.25rem)", fontSize: "clamp(0.85rem, 3.2vw, 18px)", color: "var(--c-text2)", lineHeight: 1.5 }, children: [
          "Сухі колоті дрова з ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "доставкою по Києву" }),
          " та області. Дуб, граб, береза та інші породи з чесним складометром. Також пропонуємо ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", style: { color: "inherit", fontWeight: 500 }, children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: [
                "Замовити дрова",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "1px", background: "rgba(255,255,255,0.05)", borderBottom: "1px dashed rgba(255,255,255,0.1)", marginBottom: "clamp(0.5rem, 1.8vw, 1rem)" } }),
        /* @__PURE__ */ jsxs("div", { className: "hero-trust-row fade-up fade-up-d3", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)",
          paddingBottom: "0.25rem"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Доставка по Києву за 24 години"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Чесний складометр"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " Оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function FirewoodSeoIntro({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  return /* @__PURE__ */ jsx("section", { className: "layout-container", style: { paddingBottom: "32px" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: {
    width: "100%",
    margin: "64px 0 0 0",
    padding: "clamp(1.5rem, 5vw, 4rem)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.02)"
  }, children: [
    /* @__PURE__ */ jsx("h2", { style: { fontSize: "32px", fontWeight: 700, marginBottom: "24px", color: "var(--c-text)" }, children: "Популярні породи дров у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "2rem" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }, children: "Різні породи деревини мають унікальні характеристики горіння. Тверді породи (дуб, граб, ясен) мають найвищу тепловіддачу та довго тліють — ідеально для котлів тривалого горіння." }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }, children: "Вільха та береза швидко розпалюються, не димлять і чудово підходять для відкритих камінів, а сосна використовується переважно для стартового розпалу або лазень." })
    ] })
  ] }) });
}
function CategoryProducts$2({ products, onOrderProduct, activeCategory }) {
  const { ref, visible } = useReveal();
  const getDetailedDesc = (name) => {
    const n = name.toLowerCase();
    if (n.includes("дуб")) return { desc: "Висока тепловіддача, довге горіння.", use: "Ідеально для котлів і камінів." };
    if (n.includes("граб")) return { desc: "Найбільша щільність, рівне полум'я.", use: "Для тримання стабільної температури." };
    if (n.includes("сосна")) return { desc: "Легко розпалюється, дає швидкий жар.", use: "Для лазень і швидкого обігріву." };
    if (n.includes("береза")) return { desc: "Рівне красиве полум'я.", use: "Для відкритих камінів." };
    if (n.includes("антрацит")) return { desc: "Максимальна тепловіддача.", use: "Для твердопаливних котлів." };
    if (n.includes("ruf") || n.includes("pini")) return { desc: "Довге і рівне горіння.", use: "Ідеально для котлів і камінів." };
    return { desc: "Якісне паливо з високою тепловіддачею.", use: "Універсальне використання." };
  };
  const [selectedBreed, setSelectedBreed] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedBreed !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedBreed.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedBreed, sortOrder]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "120px", position: "relative", zIndex: 10 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
        /* @__PURE__ */ jsxs("div", { style: {
          position: "relative",
          zIndex: 50,
          display: "flex",
          flexWrap: "nowrap",
          gap: "0.25rem",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Порода:" }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setIsFilterOpen(!isFilterOpen),
                  style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    paddingRight: "24px",
                    cursor: "pointer",
                    userSelect: "none",
                    minWidth: "60px",
                    maxWidth: "120px"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedBreed }),
                    /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
                  ]
                }
              ),
              isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "8px",
                background: "var(--c-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "8px 0",
                zIndex: 9999,
                minWidth: "160px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }, children: ["Усі", "Дуб", "Граб", "Сосна", "Береза"].map((breed) => {
                const isActive = selectedBreed === breed;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSelectedBreed(breed);
                      setIsFilterOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: breed
                  },
                  breed
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setIsSortOpen(!isSortOpen),
                  style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    paddingRight: "24px",
                    cursor: "pointer",
                    userSelect: "none",
                    maxWidth: "180px"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                    /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
                  ]
                }
              ),
              isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "var(--c-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "8px 0",
                zIndex: 9999,
                minWidth: "220px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("popular");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "За популярністю"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("price_asc");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "Від дешевих до дорогих"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      setSortOrder("price_desc");
                      setIsSortOpen(false);
                    },
                    style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                    children: "Від дорогих до дешевих"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": filteredProducts.map((p, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://kievbriket.com${getProductUrl(p)}`
            }))
          })
        } }),
        /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
          __html: JSON.stringify(filteredProducts.map((p) => ({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": p.name,
            "image": getImageUrl(p.image_url, api.defaults.baseURL),
            "description": getDetailedDesc(p.name).desc,
            "brand": { "@type": "Brand", "name": "КиївБрикет", "logo": "https://kievbriket.com/kievbriket.svg" },
            "offers": {
              "@type": "Offer",
              "price": p.variants?.length > 0 ? p.variants[0].price : p.price,
              "priceCurrency": "UAH",
              "availability": "https://schema.org/InStock",
              "url": `https://kievbriket.com${getProductUrl(p)}`
            }
          })))
        } }),
        /* @__PURE__ */ jsx("div", { className: "product-grid", children: filteredProducts.map((product, i) => {
          const info = getDetailedDesc(product.name);
          const displayPrice = product.variants?.length > 0 ? product.variants[0].price : product.price;
          return /* @__PURE__ */ jsx(Link, { to: getProductUrl(product), className: "product-card-link", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxs(
            "article",
            {
              className: `reveal product-card-hover ${visible ? "visible" : ""}`,
              style: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transitionDelay: `${i * 0.1}s`,
                overflow: "hidden",
                borderRadius: "16px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.15)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { aspectRatio: "4/3", width: "100%", overflow: "hidden", position: "relative" }, children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getImageUrl(product.image_url, api.defaults.baseURL),
                      alt: `${product.name} Київ`,
                      loading: "lazy",
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name)}`;
                      },
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.7s ease"
                      },
                      className: "group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                    pointerEvents: "none"
                  } }),
                  /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "clamp(1rem, 3vw, 1.5rem)", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                  /* @__PURE__ */ jsx("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem", flexShrink: 0 }, children: /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0, fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.2 }, children: product.name }) }),
                  product.short_description && /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: product.short_description }),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" }, children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                      /* @__PURE__ */ jsx(Flame, { size: 14, color: "var(--c-orange)", style: { flexShrink: 0, marginTop: 1 } }),
                      /* @__PURE__ */ jsx("span", { children: info.desc })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { size: 14, color: "#22c55e", style: { flexShrink: 0, marginTop: 1 } }),
                      /* @__PURE__ */ jsx("span", { children: info.use })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.25rem" }, children: [
                    /* @__PURE__ */ jsxs("span", { style: { background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
                      " Є в наявності"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { style: { background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                      /* @__PURE__ */ jsx(Truck, { size: 12 }),
                      " Доставимо сьогодні"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)"
                  }, children: [
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "4px" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: displayPrice }),
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)" }, children: [
                        "грн / ",
                        activeCategory?.slug === "vugillya" || activeCategory?.slug === "brikety" ? "тонну" : "складометр"
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "nh-btn-primary",
                        style: { padding: "8px 16px", fontSize: "0.875rem", background: "var(--c-orange)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 },
                        onClick: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOrderProduct(product);
                        },
                        children: "Замовити"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ) }, product.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                    .product-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 24px;
                        width: 100%;
                    }
                    @media (max-width: 1024px) {
                        .product-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 640px) {
                        .product-grid { grid-template-columns: 1fr; }
                    }
                    .product-card-hover:hover .img-zoom {
                        transform: scale(1.05); /* Zoom image precisely on card hover */
                    }
                    .seo-inline-link {
                        color: var(--c-text);
                        text-decoration: underline;
                        text-decoration-color: rgba(255,255,255,0.2);
                        text-underline-offset: 4px;
                        transition: all 0.2s ease;
                    }
                    .seo-inline-link:hover {
                        color: var(--c-orange);
                        text-decoration-color: var(--c-orange);
                    }
                ` })
    ] }),
    /* @__PURE__ */ jsx(FirewoodSeoIntro, { activeCategorySlug: activeCategory?.slug })
  ] });
}
function FaqSection$4() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Які дрова краще для котла?", a: "Для твердопаливного котла найкраще підходять тверді породи деревини: дуб, граб та ясен. Вони мають найвищу тепловіддачу та горять найдовше. Вологість не повинна перевищувати 20-25%." },
    { q: "Які дрова найкращі для печі?", a: "Для пічного опалення чудово підходять дрова твердих порід (дуб, граб), які забезпечують тривалий жар. Також часто використовують березові та вільхові дрова, оскільки вони горять рівним красивим полум'ям і менше забивають димохід сажею." },
    { q: "Чи можна купити дрова з доставкою сьогодні?", a: "Так, за умови оформлення замовлення в першій половині дня, доставка по Києву можлива в той самий день. По області — зазвичай на наступний день." },
    { q: "Скільки коштує машина дров?", a: "Вартість залежить від породи деревини та об'єму кузова (ЗІЛ, Камаз, Газель). Вартість доставки розраховується індивідуально в залежності від вашої адреси." },
    { q: "Який об'єм дров у машині? (чесний складометр)", a: "Ми ретельно укладаємо поліна на складі. Наприклад, в ЗІЛ поміщається до 6-7 складометрів. Ви можете особисто рулеткою заміряти габарити укладених дров у кузові перед вивантаженням (Довжина × Ширина × Висота = Складометри)." },
    { q: "Яка вологість дров для опалення?", a: "Ми поставляємо деревину природної та камерної сушки. Оптимальна вологість дров для ефективного горіння становить 15-20%. Саме такі показники дозволяють отримати максимальну тепловіддачу та мінімізувати утворення сажі." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "faq-mobile-section", style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              borderBottom: "1px solid var(--color-border-subtle)",
              marginBottom: "1rem"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setOpenIdx(isOpen ? -1 : idx),
                  style: {
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "1.5rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "var(--c-text)",
                    fontFamily: "inherit",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    gap: "1rem"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                    /* @__PURE__ */ jsx(
                      ChevronRight,
                      {
                        size: 20,
                        style: {
                          flexShrink: 0,
                          color: "var(--c-orange)",
                          transform: isOpen ? "rotate(90deg)" : "none",
                          transition: "transform 0.3s ease"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { style: {
                maxHeight: isOpen ? 500 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease",
                color: "var(--c-text2)",
                lineHeight: 1.6
              }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
            ]
          },
          idx
        );
      }) })
    ] })
  ] });
}
function FinalCtaBanner$4({ onQuickOrderClick, activeCategory }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Замовте ",
            activeCategory?.name?.toLowerCase() || "тверде паливо",
            " ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: [
              "Замовити ",
              activeCategory?.name?.toLowerCase() || ""
            ] }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] })
          ] })
        ] })
      ]
    }
  ) }) });
}
function FirewoodCategoryPage({ products, seo, onOrderProduct, activeCategory, activeCategorySlug }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsx(
      HeroCategory$2,
      {
        onQuickOrderClick: () => onOrderProduct(null),
        activeCategory,
        activeCategorySlug
      }
    ),
    /* @__PURE__ */ jsx(
      CategoryProducts$2,
      {
        products,
        onOrderProduct,
        activeCategory
      }
    ),
    /* @__PURE__ */ jsx(HowToChooseFirewood, { activeCategorySlug }),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    activeCategorySlug === "drova" ? /* @__PURE__ */ jsx(FirewoodSeoBlock, {}) : /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: activeCategory?.seo_h1 || `Купити ${activeCategory?.name?.toLowerCase() || "тверде паливо"} у Києві` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: { maxWidth: "100%", color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", textAlign: "left" },
          dangerouslySetInnerHTML: {
            __html: activeCategory?.seo_text || `
                                    <p>Якісне тверде паливо для опалення будинків, котлів та камінів.</p>
                                    <p>Ми гарантуємо чесний об'єм та швидку доставку по Києву та всій Київській області. Оплата здійснюється тільки після отримання та перевірки на місці — жодних передоплат і ризиків. Доставка можлива день у день!</p>
                                    `
          }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx(PopularQueriesSection$3, { activeCategorySlug }),
    /* @__PURE__ */ jsx(FaqSection$4, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner$4, { onQuickOrderClick: () => onOrderProduct(null), activeCategory })
  ] });
}
function FirewoodSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити дрова у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Купити дрова з доставкою по Києву та Київській області можна безпосередньо у постачальника. Компанія «КиївБрикет» пропонує колоті дрова різних порід дерева для ефективного опалення приватних будинків, котлів та камінів, а також ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Ми доставляємо дрова дуба, граба, сосни, берези та вільхи. Усі дрова мають низьку вологість та високу тепловіддачу. Працює швидка та зручна ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "seo-inline-link", children: "доставка по Києву" }),
          " та області."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2rem" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { style: { color: "var(--c-text)", fontSize: "1.125rem", marginBottom: "1rem", fontWeight: "600" }, children: "Популярні породи дров:" }),
          /* @__PURE__ */ jsx("ul", { style: { listStyleType: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.625rem" }, children: [
            { name: "дубові дрова", slug: "oak" },
            { name: "грабові дрова", slug: "hornbeam" },
            { name: "березові дрова", slug: "birch" },
            { name: "соснові дрова", slug: "pine" },
            { name: "вільхові дрова", slug: "alder" }
          ].map((item, i) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsx(Flame, { size: 14, color: "var(--c-orange)" }),
            /* @__PURE__ */ jsx(Link, { to: `/catalog/drova/${item.slug}`, style: { color: "var(--c-text2)", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
              e.currentTarget.style.color = "var(--c-orange)";
              e.currentTarget.style.textDecorationColor = "var(--c-orange)";
            }, onMouseLeave: (e) => {
              e.currentTarget.style.color = "var(--c-text2)";
              e.currentTarget.style.textDecorationColor = "rgba(255,255,255,0.2)";
            }, children: item.name })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }, children: [
          /* @__PURE__ */ jsx("h4", { style: { color: "var(--c-text)", fontSize: "1.05rem", margin: 0, fontWeight: "600" }, children: "Також дивіться:" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "1.5rem" }, children: [
            /* @__PURE__ */ jsxs(Link, { to: "/catalog/brikety", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Паливні брикети"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/catalog/vugillya", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Кам’яне вугілля"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/dostavka", style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--c-orange)", textDecoration: "none", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsx("span", { children: "→" }),
              " Доставка по Києву"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection$3({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  const queries = [
    { text: "Купити дубові дрова Київ", to: "/catalog/drova/dubovi-drova" },
    { text: "Дрова граб Київ", to: "/catalog/drova/hrabovi-drova" },
    { text: "Дрова береза Київ", to: "/catalog/drova/berezovi-drova" },
    { text: "Дрова для каміна", to: "/catalog/drova/drova-dlya-kamina" },
    { text: "Дрова в ящиках", to: "/catalog/drova/drova-v-yashchykakh" },
    { text: "Дрова складометр Київ", to: "/catalog/drova/dubovi-drova" }
  ];
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 900, margin: "0 auto", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { className: "h3", style: { marginBottom: "1.5rem", fontSize: "1.25rem" }, children: "Популярні запити" }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.75rem"
    }, children: queries.map((q, i) => /* @__PURE__ */ jsx(
      Link,
      {
        to: q.to,
        className: "popular-link",
        style: {
          padding: "8px 16px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "40px",
          color: "var(--c-text2)",
          fontSize: "0.875rem",
          textDecoration: "none",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(249,115,22,0.1)";
          e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          e.currentTarget.style.color = "var(--c-orange)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "var(--c-text2)";
        },
        children: q.text
      },
      i
    )) })
  ] }) }) });
}
function HowToChooseFirewood({ activeCategorySlug }) {
  if (activeCategorySlug !== "drova") return null;
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem" }, children: "Як вибрати дрова для опалення" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "2.5rem" }, children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        "Правильний вибір дров залежить від типу вашого опалювального пристрою. ",
        /* @__PURE__ */ jsx("strong", { children: "Для твердопаливного котла" }),
        " найкраще підходять дуб, граб та ясен, а також ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", className: "seo-inline-link", children: "паливні брикети" }),
        " чи ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", className: "seo-inline-link", children: "кам'яне вугілля" }),
        ". Вони мають високу щільність, забезпечують довготривале горіння (тління) і максимальну тепловіддачу."
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx("strong", { children: "Для закритої печі або відкритого каміна" }),
        " чудовим вибором стануть береза та вільха. Ці породи легко розпалюються, горять гарним високим полум'ям і, що найважливіше, виділяють мінімум кіптяви та диму, запобігаючи швидкому засміченню димоходу. Сосну найчастіше використовують для лазень або як стартове паливо для розпалу."
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
        "Окремо варто звернути увагу на ",
        /* @__PURE__ */ jsx("strong", { children: "вологість" }),
        ". Оптимальна вологість дров для ефективного опалення не повинна перевищувати 20-25%. Використання свіжопиляних дров значно знижує ККД котла та призводить до утворення конденсату та сажі."
      ] }) })
    ] })
  ] }) }) });
}
function HeroCategory$1({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Паливні брикети" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити паливні ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "брикети" }),
          " у Києві"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "clamp(0.85rem, 3.2vw, 18px)",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "100%",
          marginBottom: "clamp(0.65rem, 2.5vw, 1.5rem)",
          fontWeight: 400
        }, children: [
          "RUF, Pini Kay та Nestro. ",
          /* @__PURE__ */ jsx("br", {}),
          "Висока тепловіддача та низька вологість. Доставка по Києву та області."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: [
                "Замовити брикети",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-benefits fade-up fade-up-d4", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "clamp(12px, 3vw, 16px)",
          width: "100%",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " доставка сьогодні"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " без передоплати"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " сухе паливо"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function BriquetteTypesSection() {
  const { ref, visible } = useReveal();
  const types = [
    {
      title: "RUF",
      desc: "Класичні прямокутні брикети (цеглинки). Добре підходять для котлів, печей та камінів. Зручні для зберігання (щільно вкладаються) та завантаження."
    },
    {
      title: "Pini Kay",
      desc: "Багатогранні брикети (найчастіше шестигранні) з отвором посередині. Мають темну випалену кірку ззовні. Дають найвищу тепловіддачу та ідеально підходять для камінів (красиво горять)."
    },
    {
      title: "Nestro",
      desc: "Брикети циліндричної форми. Відрізняються рівномірним горінням та високою тепловіддачею. Чудово зарекомендували себе в котлах тривалого горіння."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, className: "briquette-types-section", style: { padding: "clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container full-width-mobile", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", children: "Типи паливних брикетів" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }, children: types.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%", borderRadius: "16px" }, children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c-orange)" }, children: t.title }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.6, flex: 1, margin: 0, fontSize: "0.95rem" }, children: t.desc })
    ] }, i)) })
  ] }) });
}
function CategoryProducts$1({ products, onOrderProduct }) {
  const { ref, visible } = useReveal();
  const [selectedBreed, setSelectedBreed] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedBreed !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedBreed.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedBreed, sortOrder]);
  return /* @__PURE__ */ jsx("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "100px", position: "relative", zIndex: 10 }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: {
      position: "relative",
      zIndex: 50,
      display: "flex",
      flexWrap: "nowrap",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Порода:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsFilterOpen(!isFilterOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                minWidth: "60px",
                maxWidth: "120px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedBreed }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "160px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: ["Усі", "Сосна", "Дуб", "Мікс"].map((breed) => {
            const isActive = selectedBreed === breed;
            const breedKey = breed === "Мікс" ? "мікс" : breed;
            return /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSelectedBreed(breedKey === "Усі" ? "Усі" : breedKey);
                  setIsFilterOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                children: breed
              },
              breed
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsSortOpen(!isSortOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                maxWidth: "180px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("popular");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "За популярністю"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_asc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дешевих до дорогих"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_desc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дорогих до дешевих"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify(filteredProducts.map((p) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": p.image_url ? p.image_url.startsWith("http") ? p.image_url : `https://kievbriket.com${p.image_url}` : void 0,
        "description": p.description || p.name,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "UAH",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": `https://kievbriket.com/catalog/brikety/${p.slug}`
        }
      })))
    } }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `product-grid reveal ${visible ? "visible" : ""}`,
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "24px",
          transitionDelay: "0.2s"
        },
        children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/catalog/brikety/${product.slug}`,
            className: "product-card-link",
            style: { textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" },
            children: /* @__PURE__ */ jsxs(
              "article",
              {
                className: "nh-card hover-glow group",
                style: {
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "16px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { aspectRatio: "4/3", width: "100%", position: "relative", overflow: "hidden", background: "#0a0d14" }, children: [
                    product.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: getImageUrl(product.image_url, api.defaults.baseURL),
                        alt: `${product.name} Київ`,
                        loading: "lazy",
                        onError: (e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name)}`;
                        },
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.7s ease"
                        },
                        className: "group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }, children: "Немає фото" }),
                    /* @__PURE__ */ jsx("div", { style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                      pointerEvents: "none"
                    } }),
                    /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "clamp(1rem, 3vw, 1.5rem)", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                    /* @__PURE__ */ jsx("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem", flexShrink: 0 }, children: /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0, fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.2 }, children: product.name }) }),
                    product.short_description && /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: product.short_description }),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", width: "fit-content", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                        /* @__PURE__ */ jsx(Zap, { size: 14, style: { color: "var(--c-orange)" } }),
                        /* @__PURE__ */ jsx("span", { children: "Висока тепловіддача" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", width: "fit-content", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                        /* @__PURE__ */ jsx(Droplets, { size: 14, style: { color: "#22c55e" } }),
                        /* @__PURE__ */ jsx("span", { children: "Вологість < 8%" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.25rem" }, children: [
                      /* @__PURE__ */ jsxs("span", { style: { background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
                        " Є в наявності"
                      ] }),
                      /* @__PURE__ */ jsxs("span", { style: { background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx(Truck, { size: 12 }),
                        " Доставимо сьогодні"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
                    }, children: [
                      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: product.price }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)" }, children: "грн / тонна" })
                      ] }) }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOrderProduct(product);
                          },
                          className: "nh-btn-primary",
                          style: {
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            background: "var(--c-orange)",
                            color: "#fff",
                            fontWeight: "bold"
                          },
                          children: "Замовити"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          },
          product.id
        ))
      }
    )
  ] }) });
}
function ComparisonTable() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "60px 0 100px" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "3rem", borderRadius: "24px", overflowX: "auto" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2rem", textAlign: "center" }, children: "Порівняння паливних брикетів" }),
    /* @__PURE__ */ jsxs("table", { style: { width: "100%", minWidth: 600, borderCollapse: "collapse", textAlign: "left", color: "var(--c-text)" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Тип" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Тепловіддача" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Горіння" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "1.5rem 1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }, children: "Вологість" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "RUF" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "довге" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "6-8%" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid var(--color-border-subtle)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "Pini Kay" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-orange)", fontWeight: 600 }, children: "дуже висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "дуже довге" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "5-7%" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", fontWeight: 700 }, children: "Nestro" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "висока" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "рівномірне" }),
          /* @__PURE__ */ jsx("td", { style: { padding: "1.5rem 1rem", color: "var(--c-text2)" }, children: "6-8%" })
        ] })
      ] })
    ] })
  ] }) }) });
}
function BriquettesSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити паливні брикети у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Паливні брикети — це сучасна та високоефективна альтернатива традиційним ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дровам" }),
          ". Вони виготовляються шляхом пресування тирси, тріски та інших деревних відходів без додавання будь-якої хімії. Завдяки високому тиску при виробництві, брикети мають надзвичайно низьку вологість (до 8%) та величезну щільність, що робить їх безпечнішою та чистішою альтернативою, ніж ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "кам'яне вугілля" }),
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Це означає, що їх тепловіддача значно перевищує тепловіддачу навіть найсухіших дубових дров. Вони горять довго, стабільно і майже не залишають золи." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1.5rem" }, children: "Окрім чудових теплових характеристик, брикети надзвичайно зручні у зберіганні. Вони акуратно спаковані на піддонах або в упаковках по 10 кг, не засмічують приміщення корою чи пилом." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Компанія «КиївБрикет» пропонує брикети найвищої якості стандартів RUF, Pini Kay та Nestro з доставкою по Києву та Київській області автотранспортом надійно та швидко." })
      ] })
    ] })
  ] }) }) });
}
function CrossCategoryBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 60px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "700" }, children: "Також дивіться" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "nowrap", gap: "0.5rem", overflowX: "auto", paddingBottom: "8px", WebkitOverflowScrolling: "touch", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/catalog/drova",
          style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--c-text)",
            textDecoration: "none",
            fontSize: "1rem",
            transition: "all 0.2s",
            background: "var(--color-bg-elevated)",
            gap: "0.75rem"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "→" }),
            "Дрова для опалення"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/catalog/vugillya",
          style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--c-text)",
            textDecoration: "none",
            fontSize: "1rem",
            transition: "all 0.2s",
            background: "var(--color-bg-elevated)",
            gap: "0.75rem"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "→" }),
            "Кам'яне вугілля"
          ]
        }
      )
    ] })
  ] }) }) });
}
function PopularQueriesSection$2() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "брикети RUF Київ", url: "/catalog/brikety" },
    { name: "паливні брикети Київ", url: "/catalog/brikety" },
    { name: "купити брикети Київ", url: "/catalog/brikety" },
    { name: "брикети pini kay Київ", url: "/catalog/brikety" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { className: "queries-scroll-container", children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: q.url,
        className: "query-bubble",
        children: [
          /* @__PURE__ */ jsx(Flame, { size: 14, style: { opacity: 0.5 } }),
          q.name
        ]
      },
      idx
    )) })
  ] }) }) });
}
function FaqSection$3() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Що краще — брикети чи дрова?", a: "Все залежить від ваших потреб. Брикети виграють завдяки більшій тепловіддачі та компактності зберігання. Вони горять довше і не стріляють іскрами. Дрова — це класика, створюють гарне полум'я та затишок. Багато хто комбінує: розпалює дровами, а на ніч закладає брикети для тривалого тління." },
    { q: "Які брикети дають більше тепла?", a: "Брикети Pini Kay (з отвором посередині) вважаються лідерами за рівнем тепловіддачі через додаткове випалювання кірки. RUF та Nestro також мають високі показники, проте Pini Kay розгораються швидше та горять найбільш яскраво та жарко." },
    { q: "Скільки брикетів потрібно на зиму?", a: "Для будинку в 100 кв.м. з середньою утепленістю, як правило, достатньо від 3 до 5 тонн паливних брикетів на весь опалювальний сезон. Це значно менше за об'ємом, ніж дрова, де б знадобилося близько 10-15 складометрів." },
    { q: "Чи можна топити брикетами камін?", a: "Так, звісно! Навіть рекомендується. Nestro і Pini Kay ідеально підходять для каміна, оскільки вони не іскрять, мають гарне полум'я і не забивають димохід сажею завдяки дуже низькій вологості. RUF теж підійдуть, але вони горять менш естетично в порівнянні з іншими." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "faq-mobile-section", style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIdx(isOpen ? -1 : idx),
              style: {
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "var(--c-text)",
                fontFamily: "inherit",
                fontSize: "1.125rem",
                fontWeight: 600,
                gap: "1rem"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    size: 20,
                    style: {
                      flexShrink: 0,
                      color: "var(--c-orange)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s ease"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "var(--c-text2)", lineHeight: 1.6 }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
        ] }, idx);
      }) })
    ] })
  ] });
}
function FinalCtaBanner$3({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Замовте паливні брикети ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву можлива вже сьогодні. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити" }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] })
          ] })
        ] })
      ]
    }
  ) }) });
}
function PopularBriquetteTypes() {
  const types = [
    { name: "Брикети RUF", url: "/catalog/brikety#ruf" },
    { name: "Брикети Pini Kay", url: "/catalog/brikety#pini-kay" },
    { name: "Брикети Nestro", url: "/catalog/brikety#nestro" },
    { name: "Деревні брикети", url: "/catalog/brikety" }
  ];
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 60px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { padding: "1.5rem 2rem", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border-subtle)" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--c-text)" }, children: "Популярні типи брикетів" }),
    /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "1.5rem" }, children: types.map((type, idx) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: "4px", height: "4px", borderRadius: "50%", background: "var(--c-orange)" } }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: type.url,
          style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s", fontSize: "0.95rem" },
          onMouseEnter: (e) => e.currentTarget.style.color = "var(--c-text)",
          onMouseLeave: (e) => e.currentTarget.style.color = "var(--c-text2)",
          children: type.name
        }
      )
    ] }, idx)) })
  ] }) }) });
}
function BriquettesCategoryPage({ products, onOrderProduct }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsx(HeroCategory$1, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(CategoryProducts$1, { products, onOrderProduct }),
    /* @__PURE__ */ jsx(BriquetteTypesSection, {}),
    /* @__PURE__ */ jsx(PopularBriquetteTypes, {}),
    /* @__PURE__ */ jsx(ComparisonTable, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null), defaultFuelType: "brikety" }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(BriquettesSeoBlock, {}),
    /* @__PURE__ */ jsx(CrossCategoryBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection$2, {}),
    /* @__PURE__ */ jsx(FaqSection$3, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner$3, { onQuickOrderClick: () => onOrderProduct(null) })
  ] });
}
function HeroCategory({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(5px, 2vw, 40px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "24px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Вугілля" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "clamp(1rem, 3.5vw, 2rem) clamp(0.85rem, 3.5vw, 3rem)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2rem, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "clamp(0.1rem, 1vw, 0.25rem)", color: "#fff" }, children: [
          "Купити вугілля ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "у Києві" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "clamp(0.85rem, 3.2vw, 18px)",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "100%",
          marginBottom: "clamp(0.65rem, 2.5vw, 1.5rem)",
          fontWeight: 400
        }, children: "Якісне кам'яне вугілля для котлів та печей з доставкою по Києву та області." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onQuickOrderClick,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: [
                "Замовити вугілля",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-benefits fade-up fade-up-d4", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "clamp(12px, 3vw, 16px)",
          width: "100%",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " доставка сьогодні"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " чесний об'єм"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function HowToChooseCoalSection() {
  const { ref, visible } = useReveal();
  const types = [
    {
      title: "Фракція",
      desc: "Розмір шматків вугілля. Для автоматичних котлів використовують дрібні фракції (13-25 мм), для класичних печей — крупніше вугілля (25-50 мм), що не провалюється крізь колосники."
    },
    {
      title: "Теплотворність",
      desc: "Кількість тепла, що виділяється при згорянні. Чим вищий цей показник (наприклад, як у антрациту), тим рідше доведеться завантажувати котел і тим більша економія палива."
    },
    {
      title: "Тип котла",
      desc: "Дізнайтесь вимоги виробника вашого обладнання. Автоматизовані системи дуже чутливі до розміру гранул та зольності, тоді як звичайні твердопаливні котли більш універсальні."
    }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", children: "Як вибрати вугілля для опалення" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }, children: types.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%", borderRadius: "16px" }, children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c-orange)" }, children: t.title }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.6, flex: 1, margin: 0, fontSize: "0.95rem" }, children: t.desc })
    ] }, i)) })
  ] }) });
}
function CategoryProducts({ products, onOrderProduct }) {
  const { ref, visible } = useReveal();
  const [selectedType, setSelectedType] = useState("Усі");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedType !== "Усі") {
      list = list.filter((p) => p.name.toLowerCase().includes(selectedType.toLowerCase()));
    }
    switch (sortOrder) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = a.variants?.length > 0 ? a.variants[0].price : a.price;
          const priceB = b.variants?.length > 0 ? b.variants[0].price : b.price;
          return priceB - priceA;
        });
        break;
    }
    return list;
  }, [products, selectedType, sortOrder]);
  return /* @__PURE__ */ jsx("section", { ref, className: "catalog-section", style: { paddingTop: "0px", paddingBottom: "100px", position: "relative", zIndex: 10 }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: {
      position: "relative",
      zIndex: 50,
      display: "flex",
      flexWrap: "nowrap",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 25, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Вид:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsFilterOpen(!isFilterOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                minWidth: "60px",
                maxWidth: "120px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: selectedType }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "8px", transform: `rotate(${isFilterOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isFilterOpen && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "160px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: ["Усі", "Антрацит", "Кам'яне"].map((type) => {
            const isActive = selectedType === type;
            const typeKey = type;
            return /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSelectedType(typeKey === "Усі" ? "Усі" : typeKey);
                  setIsFilterOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: isActive ? "var(--c-orange)" : "var(--c-text)", background: isActive ? "rgba(255,255,255,0.02)" : "transparent" },
                children: type
              },
              type
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)", zIndex: 20, flexShrink: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontWeight: 500, fontSize: "clamp(0.75rem, 2.5vw, 1rem)", whiteSpace: "nowrap" }, children: "Сортування:" }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", flexShrink: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setIsSortOpen(!isSortOpen),
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "6px 10px",
                paddingRight: "24px",
                cursor: "pointer",
                userSelect: "none",
                maxWidth: "180px"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: sortOrder === "popular" ? "За популярністю" : sortOrder === "price_asc" ? "Від дешевих до дорогих" : "Від дорогих до дешевих" }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: "var(--c-text2)", position: "absolute", right: "12px", transform: `rotate(${isSortOpen ? "-90deg" : "90deg"})`, transition: "transform 0.2s" } })
              ]
            }
          ),
          isSortOpen && /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "var(--c-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 9999,
            minWidth: "220px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("popular");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "popular" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "popular" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "За популярністю"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_asc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_asc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_asc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дешевих до дорогих"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => {
                  setSortOrder("price_desc");
                  setIsSortOpen(false);
                },
                style: { padding: "8px 16px", cursor: "pointer", fontSize: "0.9rem", color: sortOrder === "price_desc" ? "var(--c-orange)" : "var(--c-text)", background: sortOrder === "price_desc" ? "rgba(255,255,255,0.02)" : "transparent" },
                children: "Від дорогих до дешевих"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify(filteredProducts.map((p) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": p.image_url ? p.image_url.startsWith("http") ? p.image_url : `https://kievbriket.com${p.image_url}` : void 0,
        "description": p.description || p.name,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "UAH",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": `https://kievbriket.com/catalog/vugillya/${p.slug}`
        }
      })))
    } }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `product-grid reveal ${visible ? "visible" : ""}`,
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "24px",
          transitionDelay: "0.2s"
        },
        children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/catalog/vugillya/${product.slug}`,
            className: "product-card-link",
            style: { textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" },
            children: /* @__PURE__ */ jsxs(
              "article",
              {
                className: "nh-card hover-glow group",
                style: {
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "16px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "product-card-image", style: { aspectRatio: "4/3", width: "100%", position: "relative", overflow: "hidden", background: "#0a0d14" }, children: [
                    product.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: getImageUrl(product.image_url, api.defaults.baseURL),
                        alt: `${product.name} Київ`,
                        loading: "lazy",
                        onError: (e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(product.name)}`;
                        },
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.7s ease"
                        },
                        className: "group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }, children: "Немає фото" }),
                    /* @__PURE__ */ jsx("div", { style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,13,20,0.8) 0%, transparent 60%)",
                      pointerEvents: "none"
                    } }),
                    /* @__PURE__ */ jsx("h3", { className: "product-card-title-overlay", style: { fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }, children: product.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "product-card-body", style: { padding: "clamp(1rem, 3vw, 1.5rem)", display: "flex", flexDirection: "column", flex: 1, background: "#161C25" }, children: [
                    /* @__PURE__ */ jsx("div", { className: "product-card-title-static", style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem", flexShrink: 0 }, children: /* @__PURE__ */ jsx("h3", { className: "h3", style: { margin: 0, fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.2 }, children: product.name }) }),
                    product.short_description && /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: product.short_description }),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" }, children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", width: "fit-content", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                        /* @__PURE__ */ jsx(Zap, { size: 14, style: { color: "var(--c-orange)" } }),
                        /* @__PURE__ */ jsx("span", { children: "Висока теплотворність" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", width: "fit-content", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", color: "#e5e7eb", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                        /* @__PURE__ */ jsx(Thermometer, { size: 14, style: { color: "#22c55e" } }),
                        /* @__PURE__ */ jsx("span", { children: "Довге горіння" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.25rem" }, children: [
                      /* @__PURE__ */ jsxs("span", { style: { background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
                        " Є в наявності"
                      ] }),
                      /* @__PURE__ */ jsxs("span", { style: { background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx(Truck, { size: 12 }),
                        " Доставимо сьогодні"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
                    }, children: [
                      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "4px" }, children: [
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-orange)" }, children: product.price }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "var(--c-text2)" }, children: "грн / тонна" })
                      ] }) }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOrderProduct(product);
                          },
                          className: "nh-btn-primary",
                          style: {
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            background: "var(--c-orange)",
                            color: "#fff",
                            fontWeight: "bold"
                          },
                          children: "Замовити"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          },
          product.id
        ))
      }
    )
  ] }) });
}
function PopularTypesBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "0 0 100px 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "clamp(1.5rem, 5vw, 4rem)", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Популярні види вугілля" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Для різних потреб опалення використовуються ",
          /* @__PURE__ */ jsx("strong", { children: "різні фракції вугілля" }),
          ". Більш дрібні фракції ідеальні для автоматичних котлів, тоді як крупне вугілля добре підходить для класичних печей та твердопаливних котлів, забезпечуючи тривале та рівномірне горіння."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Антрацит" }),
          " — це вугілля найвищої якості. Воно відрізняється максимальною теплотворністю, низьким вмістом золи та мінімальним виділенням диму. Це робить його найкращим вибором для обігріву приватних будинків."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Правильне ",
          /* @__PURE__ */ jsx("strong", { children: "використання для котлів" }),
          " гарантує не лише тепло у вашій оселі, але й подовжує термін служби обладнання. Вибираючи якісне паливо, ви зменшуєте витрати на обслуговування котла та підвищуєте ефективність підігріву."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Для альтернативного опалення також часто використовують ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          " або ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          ". Комбінування різних видів палива дозволяє досягти оптимального балансу ціни та ефективності."
        ] })
      ] })
    ] })
  ] }) }) });
}
function CoalSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити кам'яне вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Шукаєте надійне та економне джерело тепла? Пропонуємо ",
          /* @__PURE__ */ jsx("strong", { children: "купити вугілля київ" }),
          " за вигідними цінами. Наше вугілля має високу теплотворність, довго горить та залишає мінімум золи, що робить його ідеальним вибором як для побутових, так і для промислових потреб."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Ми постачаємо гарантовано якісне ",
          /* @__PURE__ */ jsx("strong", { children: "кам'яне вугілля" }),
          ", яке проходить ретельний контроль вологості та зольності. Незалежно від того, чи потрібне вам паливо для невеликого домашнього котла, чи для великої котельні, ми запропонуємо найкращий з актуальних варіант."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Особливим попитом користується ",
          /* @__PURE__ */ jsx("strong", { children: "антрацит" }),
          " — преміальне паливо, що забезпечує максимальну температуру та відсутність диму при горінні. Замовляючи у нас, ви гарантовано отримуєте чесну вагу з доставкою."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Також у нашому асортименті доступні й інші види твердого палива. Ви завжди можете обрати класичні ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          " або спробувати зручні ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          ", які відмінно доповнюють або замінюють вугілля у деяких котлах."
        ] })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection$1() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "вугілля київ", url: "/catalog/vugillya" },
    { name: "купити вугілля київ", url: "/catalog/vugillya" },
    { name: "антрацит київ", url: "/catalog/vugillya" },
    { name: "кам'яне вугілля доставка", url: "/catalog/vugillya" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { className: "queries-scroll-container", children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: q.url,
        className: "query-bubble",
        children: [
          /* @__PURE__ */ jsx(Flame, { size: 14, style: { opacity: 0.5 } }),
          q.name
        ]
      },
      idx
    )) })
  ] }) }) });
}
function FaqSection$2() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Яке вугілля краще для котла?", a: "Для більшості класичних твердопаливних котлів найкраще підходить кам'яне вугілля середніх та крупних фракцій, а також антрацит. Антрацит горить довше та дає найбільше тепла, але для його розпалу необхідна вища температура. Кам'яне вугілля легше розгоряється і підходить для систем з меншою тягою." },
    { q: "Яка фракція вугілля потрібна?", a: "Фракція підбирається під тип котла. Для автоматичних котлів зі шнековою подачею використовується 'горішок' або дрібні фракції (13-25 мм). Для котлів з ручним завантаженням та класичних печей краще брати більш крупне вугілля (фракція 25-50 мм і більше), оскільки воно не провалюється крізь колосники." },
    { q: "Чи можна замовити вугілля з доставкою сьогодні?", a: "Так, за наявності вільного транспорту ми можемо організувати доставку в день замовлення. У піковий сезон термін доставки може становити 1-2 дні. Будь ласка, уточнюйте можливість термінової доставки у нашого менеджера по телефону." },
    { q: "Скільки коштує тонна вугілля?", a: "Ціна за тонну варіюється залежно від марки та фракції вугілля. Наприклад, класичне кам'яне вугілля коштує дешевше, ніж високоякісний антрацит. Зверніть увагу на актуальні ціни у нашому каталозі. Для оптових замовлень ми пропонуємо індивідуальні знижки." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "faq-mobile-section", style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIdx(isOpen ? -1 : idx),
              style: {
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "var(--c-text)",
                fontFamily: "inherit",
                fontSize: "1.125rem",
                fontWeight: 600,
                gap: "1rem"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    size: 20,
                    style: {
                      flexShrink: 0,
                      color: "var(--c-orange)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s ease"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "var(--c-text2)", lineHeight: 1.6 }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
        ] }, idx);
      }) })
    ] })
  ] });
}
function FinalCtaBanner$2({ onQuickOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Замовте вугілля ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Доставка по Києву та області. Чесний об'єм та гарантія якості від перевіреного постачальника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onQuickOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити вугілля" }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] })
          ] })
        ] })
      ]
    }
  ) }) });
}
function CoalCategoryPage({ products, onOrderProduct }) {
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Купити кам'яне вугілля в Києві — ціна та доставка | КиївБрикет" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Купити кам'яне вугілля в Києві з доставкою. Антрацит, ДГ та інші види вугілля для котлів і печей. Швидка доставка по Києву та області." }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Купити кам'яне вугілля в Києві — доставка | КиївБрикет" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Якісне кам'яне вугілля для котлів і печей. Доставка по Києву та області." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://kievbriket.com/media/categories/coal.webp" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://kievbriket.com/catalog/vugillya" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "КиївБрикет" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Купити кам'яне вугілля в Києві — доставка | КиївБрикет" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Якісне кам'яне вугілля для котлів і печей. Доставка по Києву та області." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://kievbriket.com/media/categories/coal.webp" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://kievbriket.com/catalog/vugillya" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: `
                    {
                     "@context": "https://schema.org",
                     "@type": "CollectionPage",
                     "name": "Кам'яне вугілля",
                     "url": "https://kievbriket.com/catalog/vugillya",
                     "description": "Купити кам'яне вугілля в Києві з доставкою. Антрацит та інші види вугілля для котлів і печей.",
                     "isPartOf": {
                       "@type": "WebSite",
                       "name": "КиївБрикет",
                       "url": "https://kievbriket.com"
                     }
                    }
                    ` })
    ] }),
    /* @__PURE__ */ jsx(HeroCategory, { onQuickOrderClick: () => onOrderProduct(null) }),
    /* @__PURE__ */ jsx(CategoryProducts, { products, onOrderProduct }),
    /* @__PURE__ */ jsx(HowToChooseCoalSection, {}),
    /* @__PURE__ */ jsx(PopularTypesBlock, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => onOrderProduct(null), defaultFuelType: "vugillya" }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(CoalSeoBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection$1, {}),
    /* @__PURE__ */ jsx(FaqSection$2, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner$2, { onQuickOrderClick: () => onOrderProduct(null) })
  ] });
}
function sortProducts(arr, mode) {
  const copy = [...arr];
  if (mode === "price_asc") return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (mode === "price_desc") return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return copy;
}
function Catalog({ predefinedCategory }) {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const categoryQuery = searchParams.get("category");
  const activeCategorySlug = predefinedCategory || categorySlug || categoryQuery;
  const ssgData = useSSGData();
  const ssgProducts = useMemo(() => {
    if (!ssgData?.products) return [];
    const items2 = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    if (activeCategorySlug) {
      return items2.filter((p) => p.category === activeCategorySlug);
    }
    return items2;
  }, [ssgData, activeCategorySlug]);
  const [products, setProducts] = useState(ssgProducts);
  const [loading, setLoading] = useState(true);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Усі");
  const [sortMode, setSortMode] = useState("popular");
  const oldSlugMap = {
    "firewood": "drova",
    "briquettes": "brikety",
    "coal": "vugillya"
  };
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);
  const seo = useMemo(() => {
    if (!activeCategory) return {};
    const cat = activeCategory;
    const fallbackDesc = cat.seo_text ? cat.seo_text.replace(/<[^>]*>/g, "").substring(0, 160) : void 0;
    return {
      title: activeCategorySlug === "drova" ? "Купити дрова в Києві — колоті дрова з доставкою | КиєвБрикет" : activeCategorySlug === "brikety" ? "Паливні брикети купити в Києві — ціна за тонну | КиєвБрикет" : cat.meta_title || `${cat.name} — купити з доставкою по Києву`,
      description: activeCategorySlug === "drova" ? "Купити дрова в Києві з доставкою. Колоті дрова: дуб, граб, акація, ясен. Чесний складометр, власний автопарк — ГАЗель, ЗІЛ, КАМАЗ. Доставка по Києву та області." : activeCategorySlug === "brikety" ? "Купити паливні брикети в Києві з доставкою. Pini Kay, RUF, Nestro, торфобрикети та пелети. Висока тепловіддача, чесна ціна за тонну. Доставка по Києву та області." : cat.meta_description || fallbackDesc,
      ogDescription: activeCategorySlug === "drova" ? "Купити дрова в Києві з доставкою. Дуб, граб, акація, ясен. Чесний складометр." : activeCategorySlug === "brikety" ? "Паливні брикети з доставкою по Києву. Pini Kay, RUF, Nestro, торфобрикети та пелети." : cat.meta_description || fallbackDesc,
      h1: cat.seo_h1 || cat.name,
      ogImage: cat.og_image || cat.image_url,
      canonical: cat.canonical_url || void 0
    };
  }, [activeCategory]);
  useEffect(() => {
    setLoading(true);
    setActiveFilter("Усі");
    window.scrollTo(0, 0);
    api.get("/products/", { params: { category: activeCategorySlug } }).then((response) => {
      const data = response.data;
      const fetched = Array.isArray(data) ? data : data.items || [];
      if (fetched.length > 0) setProducts(fetched);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCategorySlug]);
  const handleOrder = useCallback((product = null) => {
    setOrderProduct(product);
    setIsOrderFormOpen(true);
  }, []);
  activeCategory ? seo.h1 || activeCategory.name : "Каталог";
  const displayedProducts = useMemo(() => {
    let filtered = products;
    if (activeFilter !== "Усі") {
      filtered = products.filter(
        (p) => p.name?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return sortProducts(filtered, sortMode);
  }, [products, activeFilter, sortMode]);
  if (oldSlugMap[activeCategorySlug]) {
    return /* @__PURE__ */ jsx(Navigate, { to: `/catalog/${oldSlugMap[activeCategorySlug]}`, replace: true });
  }
  if (!activeCategory && !loading && !categoriesLoading) {
    return /* @__PURE__ */ jsx(NotFound, {});
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "new-home-scope",
      style: {
        minHeight: "100vh",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: "var(--font-outfit)",
        paddingTop: "64px"
      },
      children: [
        activeCategory && /* @__PURE__ */ jsxs(
          SEOHead,
          {
            title: seo.title,
            description: seo.description,
            ogDescription: seo.ogDescription,
            ogImage: seo.ogImage,
            canonical: seo.canonical,
            robots: seo.robots,
            children: [
              activeCategorySlug === "drova" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "uk", href: "https://kievbriket.com/catalog/drova" }),
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: "https://kievbriket.com/catalog/drova" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Купити дрова в Києві — колоті дрова з доставкою" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Дрова дуб, граб, акація, ясен з доставкою по Києву та області." }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://kievbriket.com/media/categories/firewood.webp" }),
                /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: `
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": "Дрова",
 "url": "https://kievbriket.com/catalog/drova",
 "description": "Купити дрова в Києві з доставкою. Дуб, граб, акація, ясен.",
 "isPartOf": {
   "@type": "WebSite",
   "name": "КиєвБрикет",
   "url": "https://kievbriket.com"
 }
}
                                ` })
              ] }),
              activeCategorySlug === "brikety" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "uk", href: "https://kievbriket.com/catalog/brikety" }),
                /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: "https://kievbriket.com/catalog/brikety" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Паливні брикети купити в Києві — ціна за тонну" }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Pini Kay, RUF, Nestro, торфобрикети та пелети з доставкою по Києву та області." }),
                /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://kievbriket.com/media/products/ruf.webp" }),
                /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: `
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": "Паливні брикети",
 "url": "https://kievbriket.com/catalog/brikety",
 "description": "Купити паливні брикети в Києві з доставкою. Pini Kay, RUF, Nestro, торфобрикети та пелети.",
 "isPartOf": {
   "@type": "WebSite",
   "name": "КиєвБрикет",
   "url": "https://kievbriket.com"
 }
}
                                ` })
              ] })
            ]
          }
        ),
        activeCategorySlug === "brikety" ? /* @__PURE__ */ jsx(
          BriquettesCategoryPage,
          {
            products: displayedProducts,
            onOrderProduct: handleOrder,
            activeCategory
          }
        ) : activeCategorySlug === "vugillya" ? /* @__PURE__ */ jsx(
          CoalCategoryPage,
          {
            products: displayedProducts,
            onOrderProduct: handleOrder,
            activeCategory
          }
        ) : /* @__PURE__ */ jsx(
          FirewoodCategoryPage,
          {
            products: displayedProducts,
            seo,
            onOrderProduct: handleOrder,
            activeCategory,
            activeCategorySlug
          }
        ),
        /* @__PURE__ */ jsx(
          OrderFormModal,
          {
            isOpen: isOrderFormOpen,
            onClose: () => {
              setIsOrderFormOpen(false);
              setOrderProduct(null);
            },
            product: orderProduct
          }
        )
      ]
    }
  );
}
function DeliveryOptionsDrova() {
  const cardPad = { padding: "clamp(1.5rem, 5vw, 2.5rem)", borderRadius: "20px" };
  const getImgUrl = (filename) => {
    return `/images/delivery/${filename}`;
  };
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2.5rem" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { ...cardPad, background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 800 }, children: "Варіанти доставки дров (доставка дров Київ)" }),
      /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", marginBottom: "2rem", lineHeight: 1.6 }, children: [
        "Швидка та надійна ",
        /* @__PURE__ */ jsx("strong", { children: "доставка дров (Київ та Київська область)" }),
        ". Ми доставляємо власним транспортом, тому тип автомобіля підбирається залежно від обсягу вашого замовлення."
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem"
      }, children: [
        { title: "ГАЗель (бортова)", vol: "4–5 складометрів", price: "1500 грн", desc: "Оптимально для невеликих замовлень дров.", img: "gazel-dostavka-driv-kyiv.webp" },
        { title: "ЗІЛ самоскид", vol: "до 4 складометрів", price: "3000 грн", desc: "Найпопулярніший варіант доставки колотих дров.", img: "zil-dostavka-driv-kyiv.webp" },
        { title: "КАМАЗ самоскид", vol: "до 8–10 складометрів", price: "4000 грн", desc: "Підходить для великих замовлень дров.", img: "kamaz-dostavka-driv-kyiv.webp" }
      ].map((v, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)", padding: "1rem" }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: getImgUrl(v.img),
                alt: `Доставка дров машиною ${v.title} Київ`,
                width: "200",
                height: "113",
                loading: "lazy",
                style: { width: "100%", height: "100%", objectFit: "contain" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
              /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "0.25rem" }, children: v.title }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.85rem", color: "var(--c-text2)", fontWeight: 600, marginBottom: "0.5rem" }, children: [
                "Обсяг: ",
                /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)" }, children: v.vol })
              ] }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.4, flex: 1, margin: 0, marginBottom: "0.75rem" }, children: v.desc }),
              /* @__PURE__ */ jsx("div", { style: { paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "1.1rem", fontWeight: 800, color: "var(--c-orange)" }, children: v.price }) })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { ...cardPad, background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 800 }, children: "Спецтехніка для розвантаження дров" }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem"
      }, children: [
        { title: "Кран-маніпулятор", desc: "Для складних умов розвантаження дров (вузькі заїзди, паркани, обмежений доступ).", price: "від 4500 грн", img: "manipulator-dostavka-kyiv.webp" },
        { title: "Гідроборт / рокла", desc: "Для розвантаження палет або важких упаковок дров.", price: "від 4500 грн", img: "gidrobort-rokla-dostavka-kyiv.webp" }
      ].map((eq, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)", padding: "1rem" }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: getImgUrl(eq.img),
                alt: `Спецтехніка ${eq.title} для розвантаження дров Київ`,
                width: "200",
                height: "113",
                loading: "lazy",
                style: { width: "100%", height: "100%", objectFit: "contain" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
              /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "0.5rem" }, children: eq.title }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85rem", color: "var(--c-text2)", lineHeight: 1.4, flex: 1, margin: 0, marginBottom: "0.75rem" }, children: eq.desc }),
              /* @__PURE__ */ jsx("div", { style: { paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto" }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: "1.1rem", fontWeight: 800, color: "var(--c-orange)" }, children: eq.price }) })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "2rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: "20px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: "Доставка дров по Києву" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", fontSize: "0.95rem", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Компанія КиївБрикет здійснює доставку колотих дров по Києву та Київській області власним транспортом." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Ми використовуємо різні типи автомобілів залежно від обсягу замовлення: ГАЗель, ЗІЛ або КАМАЗ." }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1.5rem" }, children: "Для великих замовлень або складних умов розвантаження доступна спеціальна техніка: кран-маніпулятор або автомобілі з гідробортом." }),
        /* @__PURE__ */ jsxs("p", { style: { margin: 0 }, children: [
          "Детальні умови доставки дивіться на сторінці: ",
          /* @__PURE__ */ jsx(Link, { to: "/dostavka", style: { color: "var(--c-orange)", textDecoration: "none", fontWeight: 600 }, children: "доставка дров по Києву" })
        ] })
      ] })
    ] })
  ] });
}
function ProductPage() {
  const { categorySlug, productSlug } = useParams();
  const ssgData = useSSGData();
  const ssgProduct = ssgData?.products ? (() => {
    const items2 = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    return items2.find((p) => p.slug === productSlug) || null;
  })() : null;
  const ssgRelated = ssgProduct && ssgData?.products ? (() => {
    const items2 = Array.isArray(ssgData.products) ? ssgData.products : ssgData.products.items || [];
    return items2.filter((p) => p.category === ssgProduct.category && p.slug !== ssgProduct.slug).slice(0, 3);
  })() : [];
  const [product, setProduct] = useState(ssgProduct);
  const [relatedProducts, setRelatedProducts] = useState(ssgRelated);
  const [loading, setLoading] = useState(!ssgProduct);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(ssgProduct?.variants?.[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const { categories } = useCategories();
  const oldSlugMap = {
    "firewood": "drova",
    "briquettes": "brikety",
    "coal": "vugillya"
  };
  const specificationsArray = Array.isArray(product?.specifications_json) ? product.specifications_json : [];
  const specs = specificationsArray.length > 0 ? specificationsArray.map((s) => ({
    icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 17, color: "var(--c-orange)" }),
    label: s.name || s.label,
    value: s.value
  })) : product ? [
    { icon: /* @__PURE__ */ jsx(Flame, { size: 17, color: "var(--c-orange)" }), label: "Порода", value: product.ingredients || (product.name.toLowerCase().includes("дуб") ? "Дуб" : product.name.toLowerCase().includes("сосн") ? "Сосна" : product.name.toLowerCase().includes("граб") ? "Граб" : product.category === "brikety" ? "Деревна тирса" : "Тверді породи") },
    { icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 17, color: "var(--c-orange)" }), label: "Тип", value: product.category === "drova" ? "Колоті, Ящик" : product.category === "brikety" ? "Пресовані" : "Сипуче" },
    product.category === "brikety" ? { icon: /* @__PURE__ */ jsx(Ruler, { size: 17, color: "var(--c-orange)" }), label: "Форма брикетів", value: product.name.toLowerCase().includes("ruf") ? "Прямокутні пресовані" : product.name.toLowerCase().includes("pini") ? "Восьмигранні з отвором" : product.name.toLowerCase().includes("nestro") ? "Циліндричні" : product.name.toLowerCase().includes("пелет") ? "Гранули 6-8 мм" : "Пресований торф" } : { icon: /* @__PURE__ */ jsx(Ruler, { size: 17, color: "var(--c-orange)" }), label: "Довжина полін", value: product.category === "drova" ? "30-40 см" : "—" },
    { icon: /* @__PURE__ */ jsx(Scale, { size: 17, color: "var(--c-orange)" }), label: "Фасування", value: product.category === "drova" ? "Складометр" : "У пакуваннях / піддонах" },
    { icon: /* @__PURE__ */ jsx(Flame, { size: 17, color: "var(--c-orange)" }), label: "Вологість", value: product.category === "drova" ? "Природна (До 25%)" : product.category === "brikety" ? "8-10%" : "До 8%" },
    { icon: /* @__PURE__ */ jsx(Truck, { size: 17, color: "var(--c-orange)" }), label: "Доставка", value: "По Києву та області" }
  ] : [];
  const faqsArray = (() => {
    if (!product?.faqs_json) return [];
    try {
      if (Array.isArray(product.faqs_json)) {
        return product.faqs_json;
      }
      if (typeof product.faqs_json === "string") {
        return JSON.parse(product.faqs_json);
      }
      if (typeof product.faqs_json === "object") {
        return Object.values(product.faqs_json);
      }
      return [];
    } catch (e) {
      return [];
    }
  })();
  const faqs = faqsArray.length > 0 ? faqsArray : product ? product.category === "brikety" ? [
    { q: `Які брикети краще для опалення?`, a: `Для максимальної тепловіддачі та тривалого горіння найкраще підходять дубові брикети RUF або Pini Kay. Якщо у вас котел тривалого горіння, Nestro також стануть чудовим вибором. Для автоматичних котлів використовують пелети.` },
    { q: `Скільки горять паливні брикети?`, a: `Залежно від типу котла та подачі кисню, брикети горять від 2 до 4 годин, після чого можуть тліти ще кілька годин, підтримуючи високу температуру.` },
    { q: `Чим брикети відрізняються від дров?`, a: `Брикети мають вищу щільність і набагато нижчу вологість (до 10%), тому вони віддають більше тепла. Крім того, вони займають менше місця при зберіганні та залишають значно менше попелу.` },
    { q: `Чи підходять брикети для камінів?`, a: `Так, особливо брикети RUF та Pini Kay. Вони горять рівним полум'ям, не іскрять і не виділяють зайвого диму, що робить їх ідеальними для відкритих та закритих камінів.` },
    { q: `Як замовити брикети з доставкою по Києву?`, a: `Оберіть потрібний тип та кількість брикетів на сайті, натисніть "Замовити", і наш менеджер зв'яжеться з вами для уточнення деталей доставки. Ми доставляємо власною технікою протягом 24 годин.` }
  ] : [
    { q: `Які дрова краще для опалення?`, a: `${product.ingredients || "Дубові"} дрова вважаються одними з найкращих для опалення завдяки високій щільності деревини та тривалому горінню. Вони дають стабільний жар і підходять для твердопаливних котлів, печей та камінів.` },
    { q: `Яка довжина полін у дров?`, a: `Стандартна довжина полін — 30-40 см. Це оптимальний розмір для більшості побутових котлів та печей.` },
    { q: `Скільки дров потрібно на зиму?`, a: `Для опалення будинку площею 100 м² на один опалювальний сезон потрібно приблизно 8-12 складометрів дров, залежно від утеплення та типу котла.` },
    { q: `Як відбувається доставка?`, a: `Доставка дров здійснюється власним автопарком: ГАЗель (2 склм), ЗІЛ (5 склм), КАМАЗ (10 склм). Також доступні гідроборт та кран-маніпулятор. Доставка по Києву та області протягом 24 годин.` },
    { q: `Який обʼєм складометра?`, a: `Складометр — це щільно укладене паливо в обʼємі 1×1×1 метр. Ми завжди гарантуємо чесний обʼєм при завантаженні автомобіля.` }
  ] : [];
  useEffect(() => {
    if (ssgProduct && !product?.slug?.length) return;
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveImageIndex(0);
    api.get(`/products/${productSlug}`).then((res) => {
      const found = res.data;
      setProduct(found);
      if (found?.variants?.length > 0) {
        setSelectedVariant(found.variants[0]);
      }
      api.get(`/products/?category=${found.category}&limit=5`).then((relRes) => {
        const relData = relRes.data;
        const items2 = Array.isArray(relData) ? relData : relData.items || [];
        const related = items2.filter((p) => p.slug !== found.slug).slice(0, 3);
        setRelatedProducts(related);
      }).catch((err) => console.error("Failed to fetch related products:", err)).finally(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, [productSlug]);
  const category = categories.find((c) => c.slug === (categorySlug || product?.category));
  const PROD_DOMAIN = "https://kievbriket.com";
  const isSSG = !!ssgData;
  const imgBase = isSSG ? PROD_DOMAIN : api.defaults.baseURL;
  const originalMainImg = product?.image_url ? getImageUrl(product.image_url, imgBase) : "";
  const galleryImages = [originalMainImg].filter(Boolean);
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price;
  product?.is_popular || true;
  if (oldSlugMap[categorySlug]) {
    return /* @__PURE__ */ jsx(Navigate, { to: `/catalog/${oldSlugMap[categorySlug]}/${productSlug}`, replace: true });
  }
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--c-bg)", fontFamily: "var(--font-outfit)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: 48, height: 48, border: "3px solid rgba(249,115,22,0.15)", borderTopColor: "var(--c-orange)", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
      /* @__PURE__ */ jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
    ] });
  }
  if (!product) {
    return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--c-bg)", fontFamily: "var(--font-outfit)", gap: "1.5rem" }, children: [
      /* @__PURE__ */ jsx("h1", { className: "h2", children: "Товар не знайдено" }),
      /* @__PURE__ */ jsxs(Link, { to: "/catalog/drova", style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        color: "#fff",
        fontWeight: 700,
        borderRadius: 10,
        padding: "12px 24px",
        textDecoration: "none"
      }, children: [
        "До каталогу ",
        /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
      ] })
    ] });
  }
  const dynamicTitle = product.meta_title || `Купити ${product.name.toLowerCase()} з доставкою по Києву — ціна за складометр | КиївБрикет`;
  const briketShortName = product?.name ? product.name.split("—")[0].split("- ")[0].trim() : "";
  const briketAlt = briketShortName.replace(/\(|\)/g, "").replace(/\s+/g, " ");
  let briketH2 = `Характеристики ${briketShortName.toLowerCase()}`;
  let briketDesc = `Опис ${briketShortName.toLowerCase()}`;
  if (briketShortName.toLowerCase().startsWith("брикети")) {
    briketH2 = briketShortName.replace(/^Брикети/i, "Характеристики брикетів");
    briketDesc = briketShortName.replace(/^Брикети/i, "Опис брикетів");
  } else if (briketShortName.toLowerCase().startsWith("паливні брикети")) {
    briketH2 = briketShortName.replace(/^Паливні брикети/i, "Характеристики паливних брикетів");
    briketDesc = briketShortName.replace(/^Паливні брикети/i, "Опис паливних брикетів");
  } else if (briketShortName.toLowerCase().startsWith("торфобрикети")) {
    briketH2 = briketShortName.replace(/^Торфобрикети/i, "Характеристики торфобрикетів");
    briketDesc = briketShortName.replace(/^Торфобрикети/i, "Опис торфобрикетів");
  } else if (briketShortName.toLowerCase().startsWith("вугільні брикети")) {
    briketH2 = briketShortName.replace(/^Вугільні брикети/i, "Характеристики вугільних брикетів");
    briketDesc = briketShortName.replace(/^Вугільні брикети/i, "Опис вугільних брикетів");
  } else if (briketShortName.toLowerCase().startsWith("пелети")) {
    briketH2 = briketShortName.replace(/^Пелети/i, "Характеристики пелет");
    briketDesc = briketShortName.replace(/^Пелети/i, "Опис пелет");
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "new-home-scope",
      style: {
        minHeight: "100vh",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: "var(--font-outfit)",
        paddingTop: "64px"
      },
      children: [
        /* @__PURE__ */ jsx(
          SEOHead,
          {
            title: dynamicTitle,
            description: product.meta_description || product.description || `Замовляйте ${product.name.toLowerCase()} з швидкою доставкою по Києву та області.`,
            ogImage: product.og_image || product.image_url,
            canonical: product.canonical_url,
            productPrice: product.price,
            productCurrency: "UAH"
          }
        ),
        /* @__PURE__ */ jsx("div", { style: {
          background: "var(--color-bg-deep)",
          borderBottom: "1px solid var(--color-border-subtle)",
          padding: "1rem 0"
        }, children: /* @__PURE__ */ jsxs("nav", { className: "breadcrumbs-container", style: {
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8125rem",
          color: "var(--c-text2)"
        }, children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
              onMouseEnter: (e) => e.target.style.color = "var(--c-orange)",
              onMouseLeave: (e) => e.target.style.color = "var(--c-text2)",
              children: "Головна"
            }
          ),
          /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: category ? getCategoryUrl(category.slug) : product?.category === "drova" ? "/catalog/drova" : "/catalog",
              style: { color: "var(--c-text2)", textDecoration: "none", transition: "color 0.2s" },
              onMouseEnter: (e) => e.target.style.color = "var(--c-orange)",
              onMouseLeave: (e) => e.target.style.color = "var(--c-text2)",
              children: category ? category.name : product?.category === "drova" ? "Дрова" : "Каталог"
            }
          ),
          /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }, children: product.name })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "product-mobile-title", style: { maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 0" }, children: /* @__PURE__ */ jsx("div", { className: "product-mobile-h1", style: { fontSize: "clamp(22px, 5vw, 28px)", lineHeight: 1.15, margin: 0, fontWeight: 700 }, children: product.category === "brikety" ? product.seo_h1 || product.name : product.name }) }),
        /* @__PURE__ */ jsxs("section", { className: "product-main-content", style: { maxWidth: 1200, margin: "0 auto", padding: "var(--s-section) 1.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { position: "sticky", top: "6rem" }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-subtle)",
                marginBottom: "1rem"
              }, children: galleryImages.length > 0 ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: galleryImages[activeImageIndex],
                  alt: product.category === "brikety" ? briketAlt : product.name,
                  width: "600",
                  height: "450",
                  loading: activeImageIndex === 0 ? "eager" : "lazy",
                  decoding: "async",
                  onError: (e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x450/333/ccc?text=${encodeURIComponent(product.name)}`;
                  },
                  style: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" },
                  onMouseEnter: (e) => window.innerWidth > 768 && (e.target.style.transform = "scale(1.05)"),
                  onMouseLeave: (e) => e.target.style.transform = "scale(1)"
                }
              ) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-text2)" }, children: "Немає фото" }) }),
              galleryImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "product-thumbnails", style: { display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }, children: galleryImages.map((src, idx) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => window.innerWidth <= 768 && setActiveImageIndex(idx),
                  onMouseEnter: () => window.innerWidth > 768 && setActiveImageIndex(idx),
                  style: {
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    flexShrink: 0,
                    border: activeImageIndex === idx ? "2px solid var(--c-orange)" : "1px solid var(--color-border-subtle)",
                    background: "var(--color-bg-elevated)",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 0,
                    transition: "border-color 0.2s"
                  },
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src,
                      alt: `мініатюра ${idx + 1}`,
                      width: "80",
                      height: "80",
                      loading: "lazy",
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/80x80/333/ccc?text=${idx + 1}`;
                      },
                      style: { width: "100%", height: "100%", objectFit: "cover" }
                    }
                  )
                },
                idx
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2rem" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "product-desktop-title", style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
                /* @__PURE__ */ jsx("h1", { className: "h1", style: { fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.15, margin: 0, fontWeight: 700 }, children: product.category === "brikety" ? product.seo_h1 || product.name : product.name }),
                /* @__PURE__ */ jsxs("div", { className: "product-badges-row", style: { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxs("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.15)",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    fontWeight: 700
                  }, children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
                    " В наявності"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(255, 115, 0, 0.1)",
                    color: "#ff7a18",
                    border: "1px solid rgba(255,115,0,0.15)",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    fontWeight: 700
                  }, children: [
                    /* @__PURE__ */ jsx(Flame, { size: 14 }),
                    " Популярний"
                  ] })
                ] })
              ] }),
              product.variants?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "product-variants-container", style: { paddingTop: "1.5rem", borderTop: "1px solid var(--color-border-subtle)" }, children: [
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", fontWeight: 700, color: "var(--c-text2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }, children: "Оберіть варіант" }),
                /* @__PURE__ */ jsx("div", { className: "product-variants-grid", style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: product.variants.map((variant, idx) => {
                  const active = selectedVariant?.name === variant.name;
                  return /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelectedVariant(variant),
                      style: {
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: active ? "1px solid var(--c-orange)" : "1px solid var(--color-border-subtle)",
                        background: active ? "rgba(249,115,22,0.10)" : "var(--color-bg-elevated)",
                        color: active ? "var(--c-orange)" : "var(--c-text)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s, color 0.2s",
                        fontFamily: "inherit"
                      },
                      children: variant.name
                    },
                    idx
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "product-price-block", style: {
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  displayPrice > 1e3 && /* @__PURE__ */ jsxs("span", { className: "product-old-price", style: { fontSize: "1rem", color: "var(--c-text2)", textDecoration: "line-through", fontWeight: 600, display: "block", marginBottom: 4 }, children: [
                    Math.round(displayPrice * 1.15),
                    " грн"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { style: { display: "flex", alignItems: "baseline", gap: "8px", margin: 0, flexWrap: "wrap" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "34px", fontWeight: 900, color: "var(--c-orange)", lineHeight: 1 }, children: displayPrice }),
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "20px", fontWeight: 700, color: "var(--c-orange)" }, children: "грн" }),
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: "18px", color: "var(--c-text2)", fontWeight: 500 }, children: [
                      "/ ",
                      product.category === "brikety" || product.category === "vugillya" ? "тонна" : "складометр"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.25rem" }, children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 12px", borderRadius: "8px", color: "#e5e7eb", fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                      /* @__PURE__ */ jsx(Truck, { size: 15, style: { color: "#22c55e" } }),
                      /* @__PURE__ */ jsx("span", { children: "Доставка сьогодні" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.03)", padding: "6px 12px", borderRadius: "8px", color: "#e5e7eb", fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                      /* @__PURE__ */ jsx(PackageCheck, { size: 15, style: { color: "#22c55e" } }),
                      /* @__PURE__ */ jsx("span", { children: "Є на складі" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "product-cta-container", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "product-cta-btn",
                    onClick: () => setIsOrderFormOpen(true),
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      border: "none",
                      borderRadius: 12,
                      padding: "18px 32px",
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.30)",
                      transition: "box-shadow 0.2s",
                      fontFamily: "inherit"
                    },
                    onMouseEnter: (e) => e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.50)",
                    onMouseLeave: (e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.30)",
                    children: [
                      "🔥 ",
                      product.category === "brikety" ? "Замовити брикети" : product.category === "vugillya" ? "Замовити вугілля" : "Замовити дрова"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.25rem" }, children: [
                  "Доставка по Києву за 24 години",
                  "Чесний складометр",
                  "Оплата після отримання",
                  "Працюємо з 2013 року"
                ].map((item, idx) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: "0.9375rem", color: "var(--c-text)", fontWeight: 500 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { background: "rgba(34,197,94,0.15)", borderRadius: "50%", padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 14, color: "#22c55e" }) }),
                  item
                ] }, idx)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: "4rem" }, children: /* @__PURE__ */ jsxs("div", { className: "product-info-grid", style: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            alignItems: "start"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                product.category === "brikety" && /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.5rem", lineHeight: 1.25 }, children: briketH2 }),
                /* @__PURE__ */ jsx("div", { className: "product-specs-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", rowGap: "1.5rem" }, children: specs.map((spec, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "var(--color-accent-soft)",
                    border: "1px solid rgba(249,115,22,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }, children: spec.icon }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }, children: spec.name || spec.label }),
                    /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9375rem", fontWeight: 700, color: "var(--c-text)", marginTop: 2 }, children: spec.value })
                  ] })
                ] }, i)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16, display: "flex", flexDirection: "column", gap: "1rem" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "var(--color-accent-soft)",
                    border: "1px solid rgba(249,115,22,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }, children: /* @__PURE__ */ jsx(Truck, { size: 18, color: "var(--c-orange)" }) }),
                  /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", margin: 0 }, children: "Інформація про доставку" })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6, paddingLeft: 50 }, children: [
                  /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Локація:" }),
                    " Доставка по Києву та області"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Термін доставки:" }),
                    " 1 день"
                  ] }),
                  product.category === "drova" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Мінімальне замовлення:" }),
                      " 1 складометр"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Автопарк:" }),
                      " ГАЗель, ЗІЛ, КАМАЗ"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: 0, color: "var(--c-text2)", fontSize: "0.9375rem" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text)", fontWeight: 600 }, children: "Спецтехніка:" }),
                      " гідроборт, кран-маніпулятор"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(Link, { to: "/dostavka", style: { color: "var(--c-orange)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, marginTop: "0.25rem", display: "inline-flex", alignItems: "center", gap: 4 }, children: [
                    product.category === "drova" ? "Детальніше про доставку дров" : "Детальніше про доставку",
                    " ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "nh-card order-steps", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("h3", { style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.5rem" }, children: [
                  "Як замовити ",
                  product.category === "brikety" ? "брикети" : product.category === "vugillya" ? "вугілля" : "дрова"
                ] }),
                /* @__PURE__ */ jsxs("ol", { className: "order-steps-list", style: { paddingLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--c-text)", lineHeight: 1.6, fontWeight: 500 }, children: [
                  /* @__PURE__ */ jsxs("li", { style: { marginBottom: "8px" }, children: [
                    "Оберіть потрібний обсяг ",
                    product.category === "brikety" ? "брикетів" : product.category === "vugillya" ? "вугілля" : "дров"
                  ] }),
                  /* @__PURE__ */ jsx("li", { style: { marginBottom: "8px" }, children: 'Натисніть кнопку "Замовити"' }),
                  /* @__PURE__ */ jsx("li", { children: "Ми зв'яжемося для підтвердження доставки" })
                ] }),
                /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }, children: [
                  "Доставка ",
                  product.category === "brikety" ? "брикетів" : product.category === "vugillya" ? "вугілля" : "дров",
                  " по Києву здійснюється власним транспортом протягом 24 годин після оформлення замовлення."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "1.5rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsx("h3", { className: "faq-mobile-h2", style: { fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.5rem" }, children: "Часті питання" }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: faqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", { style: {
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: 12,
                  overflow: "hidden"
                }, children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => setOpenFaq(openFaq === idx ? null : idx),
                      style: {
                        width: "100%",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "transparent",
                        border: "none",
                        color: "var(--c-text)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left",
                        gap: "1rem"
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                        /* @__PURE__ */ jsx(ChevronDown, { size: 20, color: "var(--c-orange)", style: {
                          flexShrink: 0,
                          transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease"
                        } })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: {
                    maxHeight: openFaq === idx ? 200 : 0,
                    padding: openFaq === idx ? "0 1.5rem 1.5rem" : "0 1.5rem",
                    opacity: openFaq === idx ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    color: "var(--c-text2)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6
                  }, children: faq.a })
                ] }, idx)) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "6rem" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { padding: "2rem", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
              /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: product.category === "brikety" ? briketDesc : product.category === "vugillya" ? "Про це вугілля" : "Про ці дрова" }),
              /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", fontSize: "1rem", lineHeight: 1.6 }, children: [
                product.short_description && /* @__PURE__ */ jsx("p", { style: { fontWeight: 600, color: "var(--c-text)", fontSize: "1.05rem", marginBottom: "1.25rem" }, children: product.short_description }),
                product.description ? /* @__PURE__ */ jsx(Fragment, { children: product.category === "drova" ? /* @__PURE__ */ jsx("div", { className: "product-description", dangerouslySetInnerHTML: { __html: product.description } }) : product.description.includes("<p>") || product.description.includes("<h2>") ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: product.description }, className: "product-seo-description", style: { display: "flex", flexDirection: "column", gap: "1rem" } }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: product.description }),
                  /* @__PURE__ */ jsx("p", { children: "Наші дрова щільно укладені в кузові автомобіля (складометрами), що гарантує чесний об'єм при доставці." })
                ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  product.category === "drova" ? /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
                    "Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів. Окрім ",
                    /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "дров колотих" }),
                    ", у нас можна замовити ",
                    /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
                    " та ",
                    /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
                    "."
                  ] }) : /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Дубові дрова — одна з найкращих порід для опалення. Вони горять довго, дають стабільний жар та підходять для твердопаливних котлів, печей та камінів." }),
                  /* @__PURE__ */ jsx("p", { children: "Ми ретельно відбираємо сировину, щоб забезпечити максимальну тепловіддачу. Замовляючи у нас, ви отримуєте чесний об'єм та гарантовану якість палива для вашої оселі." })
                ] })
              ] })
            ] }) })
          ] }) }),
          product.category === "drova" && /* @__PURE__ */ jsx("div", { style: { marginTop: "4rem" }, children: /* @__PURE__ */ jsx(DeliveryOptionsDrova, {}) }),
          relatedProducts.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "5rem" }, children: [
            /* @__PURE__ */ jsxs("h3", { className: "h2", style: { marginBottom: "2rem" }, children: [
              "Інші ",
              product.category === "brikety" ? "брикети" : product.category === "vugillya" ? "вугілля" : "дрова"
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }, children: relatedProducts.map((p, idx) => {
              const displayPrice2 = p.variants?.length > 0 ? p.variants[0].price : p.price;
              const isPopular2 = idx < 2;
              return /* @__PURE__ */ jsx(Link, { to: `/catalog/${categorySlug || p.category}/${p.slug}`, style: { textDecoration: "none", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxs("article", { className: "nh-card catalog-card", style: { display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", flex: 1 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3" }, children: [
                  p.image_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getImageUrl(p.image_url, api.defaults.baseURL),
                      alt: p.category === "drova" || categorySlug === "drova" ? `${p.name} колоті дрова складометр доставка Київ` : p.category === "brikety" ? p.name.split("—")[0].split("- ")[0].trim().replace(/\(|\)/g, "").replace(/\s+/g, " ") : p.h1_heading || p.name,
                      className: "catalog-card-img",
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x300/333/ccc?text=${encodeURIComponent(p.name)}`;
                      }
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "catalog-card-img-placeholder", children: "🪵" }),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,12,16,0.65) 0%, transparent 55%)", pointerEvents: "none" } }),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 12, left: 12, zIndex: 2 }, children: /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(34,197,94,0.85)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                  }, children: "✔ В наявності" }) }),
                  isPopular2 && /* @__PURE__ */ jsx("div", { className: "product-popular-badge", style: { position: "absolute", top: 12, right: 12, zIndex: 2 }, children: /* @__PURE__ */ jsx("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    background: "rgba(249,115,22,0.9)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                  }, children: "🔥 Популярний" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", flex: 1 }, children: [
                  /* @__PURE__ */ jsx("p", { className: "h3", style: { margin: 0, marginBottom: 8, transition: "color 0.2s", lineHeight: 1.25, fontWeight: 700 }, children: p.name }),
                  /* @__PURE__ */ jsx("div", { className: "catalog-card-description body-sm", style: { minHeight: "2.8em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: 16, opacity: 0.8 }, dangerouslySetInnerHTML: { __html: (p.description || "Якісне тверде паливо з доставкою по Києву та Київській області.").replace(/<h[1-6][^>]*>/gi, "<strong>").replace(/<\/h[1-6]>/gi, "</strong>") } }),
                  p.variants?.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }, children: p.variants.slice(0, 3).map((v, i) => /* @__PURE__ */ jsx("span", { style: { fontSize: "0.72rem", color: "var(--c-text2)", background: "var(--c-surface)", borderRadius: 6, padding: "2px 8px", border: "1px solid var(--c-border)" }, children: v.name }, i)) }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--color-border-subtle)", marginTop: "auto", gap: 12 }, children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
                      /* @__PURE__ */ jsxs("p", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-orange)", lineHeight: 1, margin: 0 }, children: [
                        displayPrice2,
                        " ",
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "1rem", fontWeight: 700, color: "var(--c-orange)" }, children: "грн" })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: 0 }, children: [
                        "за 1 ",
                        product.category === "brikety" || product.category === "vugillya" ? "тонну" : "складометр"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        className: "catalog-card-btn",
                        onClick: (e) => {
                          e.preventDefault();
                          setIsOrderFormOpen(true);
                        },
                        children: [
                          "🛒 ",
                          product.category === "brikety" ? "Замовити брикети" : product.category === "vugillya" ? "Замовити вугілля" : "Замовити дрова"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }) }, p.id);
            }) })
          ] }),
          product.category === "drova" && /* @__PURE__ */ jsxs("section", { className: "product-seo-bottom", style: { marginTop: "5rem", padding: "2rem", background: "var(--color-bg-elevated)", borderRadius: 20, border: "1px solid var(--color-border-subtle)" }, children: [
            /* @__PURE__ */ jsxs("h2", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-text)", marginBottom: "1.25rem" }, children: [
              "Купити ",
              product.name.toLowerCase(),
              " в Києві"
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", fontSize: "1rem", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }, children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "Якщо вам потрібні якісні ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "колоті дрова" }),
                " ",
                "з доставкою по Києву, компанія КиївБрикет пропонує швидке постачання палива власним транспортом."
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "У нашому каталозі також доступні",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
                " ",
                "та",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
                " ",
                "для твердопаливних котлів та камінів."
              ] }),
              /* @__PURE__ */ jsx("p", { children: "Ми доставляємо дрова в усі райони Києва: Дарницький, Деснянський, Оболонський, Подільський, Шевченківський, Голосіївський, Солом’янський, Печерський, Святошинський, Дніпровський." }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Замовляючи ",
                /* @__PURE__ */ jsx("strong", { children: product.name.toLowerCase() }),
                " у нас, ви гарантовано отримуєте чесний об'єм, оскільки всі дрова щільно укладаються в кузові (в складометрах). Ми працюємо без передоплати — ви оплачуєте замовлення безпосередньо після розвантаження та перевірки якості."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "5rem", paddingBottom: "2rem" }, children: [
            /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2rem" }, children: "Інші види палива" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }, children: [
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/drova", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Дрова колоті" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "Дуб, граб, сосна" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/brikety", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Паливні брикети" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "RUF, Nestro, Pini Kay" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: "/catalog/vugillya", className: "nh-card", style: { padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", borderRadius: 16 }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", margin: 0 }, children: "Кам'яне вугілля" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875rem", color: "var(--c-text2)", margin: "4px 0 0 0" }, children: "Антрацит, ДГ" })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-orange)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                /* Hide scrollbar for thumbnails */
                .product-thumbnails::-webkit-scrollbar { display: none; }

                /* Mobile title: show above image; hide desktop title */
                .product-mobile-title { display: none; }

                @media (max-width: 768px) {
                    .product-mobile-title { display: block !important; }
                    .product-desktop-title .h1 { display: none !important; }
                    .product-desktop-title { gap: 0.5rem !important; }
                    .product-badges-row { display: none !important; }
                    .product-popular-badge { display: none !important; }
                    .product-old-price { display: none !important; }
                    .product-price-badge { display: inline-flex !important; }
                    .product-main-content > div { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
                    .product-main-content > div > div:first-child { position: static !important; }
                    .product-main-content > div > div:last-child { gap: 1rem !important; }
                    .product-price-block { order: -1; padding-top: 0 !important; border-top: none !important; }
                    .product-main-content { padding-top: 1rem !important; padding-bottom: 1rem !important; }
                    
                    /* Sticky Mobile CTA Container */
                    .product-cta-container {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: var(--color-bg-elevated);
                        border-top: 1px solid var(--color-border-subtle);
                        padding: 1rem 1.5rem;
                        z-index: 100;
                        box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
                    }
                    /* Add padding to bottom to account for the sticky bar */
                    .new-home-scope { padding-bottom: 90px; }
                }
            ` }),
        /* @__PURE__ */ jsx(
          OrderFormModal,
          {
            isOpen: isOrderFormOpen,
            onClose: () => setIsOrderFormOpen(false),
            product,
            variant: selectedVariant
          }
        )
      ]
    }
  );
}
function HeroDelivery({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(15px, 3vw, 104px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "40px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Доставка" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "2.5rem 3rem 2rem 3rem",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2.5rem, 6vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.5rem", color: "#fff" }, children: [
          "Доставка дров, брикетів та вугілля ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "по Києву та області" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "18px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "700px",
          marginBottom: "2rem",
          fontWeight: 400
        }, children: "Доставка власним транспортом: Газель, ЗІЛ, КАМАЗ, маніпулятор. Швидко, надійно, із розвантаженням." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onOrderClick,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: [
                "Замовити доставку",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-benefits fade-up fade-up-d4", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "clamp(12px, 3vw, 16px)",
          width: "100%",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " доставка сьогодні"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " чесний складометр"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function DeliverySeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 10vw, 100px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Доставка дров, брикетів та вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Ми доставляємо ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "дрова" }),
          ", ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "паливні брикети" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "кам'яне вугілля" }),
          " по всьому Києву та області надійним транспортом. Обираючи доставку від постачальника, ви отримуєте гарантію точної ваги та прозорих цін без прихованих платежів за вивантаження."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Доставка дров" }),
          " відбувається автотранспортом від ЗІЛу до Камазу залежно від обсягу. Всі дрова щільно вкладаються в кузові, щоб ви могли перевірити чесність складометра власноруч до моменту вивантаження товарів."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Доставка брикетів" }),
          " та ",
          /* @__PURE__ */ jsx("strong", { children: "доставка вугілля" }),
          " виконується акуратно у заводському упакуванні: мішках або на піддонах (палетах). Це забезпечує чистоту на вашому подвір'ї та максимальну зручність при подальшому зберіганні матеріалу."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Наш транспорт обладнаний зручними бортами для швидкого і легкого вивантаження. Наші водії завжди на зв’язку, готові під’їхати у зручний для вас час та надати якісний сервіс без затримок." })
      ] })
    ] })
  ] }) }) });
}
function PopularQueriesSection() {
  const { ref, visible } = useReveal();
  const queries = [
    { name: "доставка дров київ", url: "/dostavka" },
    { name: "доставка брикетів", url: "/catalog/brikety" },
    { name: "доставка вугілля", url: "/catalog/vugillya" },
    { name: "купити дрова доставка", url: "/catalog/drova" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0", borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(20,25,30,0.3)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.125rem", color: "var(--c-text)", marginBottom: "1.5rem", fontWeight: "600" }, children: "Популярні запити:" }),
    /* @__PURE__ */ jsx("div", { className: "queries-scroll-container", children: queries.map((q, idx) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: q.url,
        className: "query-bubble",
        children: [
          /* @__PURE__ */ jsx(Truck, { size: 14, style: { opacity: 0.5 } }),
          q.name
        ]
      },
      idx
    )) })
  ] }) }) });
}
function FaqSection$1() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Скільки коштує доставка дров?", a: "ГАЗель (бус) — 1 500 грн (4–5 складометрів), ЗІЛ самоскид — 3 000 грн (4 складометри), КАМАЗ самоскид — 4 000 грн (8 складометрів). Доставка брикетів — 700 грн/тонна по Києву." },
    { q: "Як швидко привозите замовлення?", a: "За умови наявності замовленого товару та вільних машин, ми доставляємо протягом дня. Для передмістя доставка можлива протягом 1-2 днів." },
    { q: "Чи можна замовити доставку сьогодні?", a: "Так! Якщо ви оформите замовлення в першій половині дня, ми зможемо організувати відвантаження у той самий день." },
    { q: "Який мінімальний об'єм замовлення?", a: "Для дров мінімальне замовлення зазвичай становить 1 складометр. Брикети та вугілля постачаються від 1 тонни або мішками (уточнюйте у менеджера)." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "faq-mobile-section", style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIdx(isOpen ? -1 : idx),
              style: {
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "var(--c-text)",
                fontFamily: "inherit",
                fontSize: "1.125rem",
                fontWeight: 600,
                gap: "1rem"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    size: 20,
                    style: {
                      flexShrink: 0,
                      color: "var(--c-orange)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s ease"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "var(--c-text2)", lineHeight: 1.6 }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
        ] }, idx);
      }) })
    ] })
  ] });
}
function DistrictsSection() {
  const { ref, visible } = useReveal();
  const districts = [
    "Дарницький район",
    "Дніпровський район",
    "Деснянський район",
    "Оболонський район",
    "Печерський район",
    "Подільський район",
    "Святошинський район",
    "Солом'янський район",
    "Шевченківський район",
    "Голосіївський район"
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 8vw, 80px) 0", background: "rgba(255,255,255,0.015)" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "clamp(1.5rem, 5vw, 3.5rem)", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", textAlign: "center" }, children: "Райони Києва, куди ми доставляємо паливо" }),
    /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", textAlign: "center", maxWidth: "800px", margin: "0 auto 2.5rem", lineHeight: 1.6 }, children: [
      /* @__PURE__ */ jsx("strong", { style: { color: "var(--c-text)" }, children: "Доставка дров Київ, доставка брикетів Київ " }),
      " та ",
      /* @__PURE__ */ jsx("strong", { style: { color: "var(--c-text)" }, children: "доставка вугілля Київ" }),
      " здійснюється по всіх районах. Наш транспорт працює щодня, тому ми можемо доставити замовлення максимально швидко."
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem"
    }, children: districts.map((d, i) => /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          padding: "1rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "12px",
          textAlign: "center",
          fontSize: "1rem",
          color: "var(--c-text)",
          transition: "all 0.3s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "var(--c-orange)";
          e.currentTarget.style.background = "rgba(249,115,22,0.03)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        },
        children: d
      },
      i
    )) })
  ] }) }) });
}
function DeliveryExtendedSeo() {
  const seoLinkStyle = {
    color: "inherit",
    textDecoration: "underline",
    textDecorationColor: "var(--color-border-medium)",
    textUnderlineOffset: "4px",
    transition: "all 0.2s"
  };
  const onEnter = (e) => {
    e.currentTarget.style.color = "var(--c-orange)";
    e.currentTarget.style.textDecorationColor = "var(--c-orange)";
  };
  const onLeave = (e) => {
    e.currentTarget.style.color = "inherit";
    e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
  };
  const thStyle = {
    padding: "1rem 1.25rem",
    textAlign: "left",
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "var(--c-text2)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "2px solid var(--c-orange)",
    background: "rgba(249,115,22,0.04)"
  };
  const tdBase = {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid var(--color-border-subtle)"
  };
  const sectionPad = { padding: "clamp(40px, 8vw, 80px) 0 0" };
  const cardPad = { padding: "clamp(1.5rem, 5vw, 3.5rem)", borderRadius: "24px" };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem", textAlign: "center" }, children: "Яке паливо ми доставляємо" }),
      /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", textAlign: "center", maxWidth: "800px", margin: "0 auto 2.5rem", lineHeight: 1.6 }, children: [
        "Ми здійснюємо доставку ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
        ", ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
        " та ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
        " по Києву та Київській області власним транспортом."
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem"
      }, children: [
        { title: "Дрова колоті", link: "/catalog/drova" },
        { title: "Паливні брикети", link: "/catalog/brikety" },
        { title: "Кам'яне вугілля", link: "/catalog/vugillya" }
      ].map((item, i) => /* @__PURE__ */ jsx(Link, { to: item.link, style: { textDecoration: "none" }, children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            padding: "1.5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          },
          className: "hover-glow",
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--c-orange)";
            e.currentTarget.style.background = "rgba(249,115,22,0.03)";
            e.currentTarget.style.transform = "translateY(-4px)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            e.currentTarget.style.transform = "translateY(0)";
          },
          children: [
            /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--c-text)" }, children: item.title }),
            /* @__PURE__ */ jsxs("span", { style: { color: "var(--c-orange)", fontSize: "0.9rem", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }, children: [
              "Перейти до каталогу ",
              /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
            ] })
          ]
        }
      ) }, i)) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Транспорт для доставки" }),
      /* @__PURE__ */ jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "1rem", color: "var(--c-text)", minWidth: "600px" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Тип машини" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Обсяг" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Ціна доставки" }),
          /* @__PURE__ */ jsx("th", { style: thStyle, children: "Особливості" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: [
          { type: "ГАЗель", vol: "4–5 складометрів", price: "від 1500 грн", desc: "Швидка доставка невеликих замовлень" },
          { type: "ЗІЛ", vol: "до 4 складометрів", price: "від 3000 грн", desc: "Оптимально для приватних будинків" },
          { type: "КАМАЗ", vol: "до 8 складометрів", price: "від 4000 грн", desc: "Великі обсяги палива" },
          { type: "Фура", vol: "22–24 складометри", price: "за домовленістю", desc: "Поставка напряму з лісгоспу" }
        ].map((row, idx) => /* @__PURE__ */ jsxs("tr", { style: { background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }, children: [
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, fontWeight: 700, color: "var(--c-orange)" }, children: row.type }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, color: "var(--c-text2)" }, children: row.vol }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, fontWeight: 700, color: "var(--c-text)" }, children: row.price }),
          /* @__PURE__ */ jsx("td", { style: { ...tdBase, color: "var(--c-text2)" }, children: row.desc })
        ] }, idx)) })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1rem" }, children: "Доставка дров по Києву" }),
        /* @__PURE__ */ jsxs("p", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 700 }, children: [
          "Доставка ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
          " здійснюється власним транспортом. Ви можете замовити доставку дров складометром у будь-який район Києва та Київської області."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "1.5rem"
      }, children: [
        { src: "/images/delivery/gazel-dostavka-driv-kyiv.webp", alt: "ГАЗель доставка дров Київ", name: "ГАЗель (бус)", volume: "4–5 складометрів", price: "1 500 грн" },
        { src: "/images/delivery/zil-dostavka-driv-kyiv.webp", alt: "ЗІЛ доставка дров Київ", name: "ЗІЛ самоскид", volume: "4 складометри", price: "3 000 грн" },
        { src: "/images/delivery/kamaz-dostavka-driv-kyiv.webp", alt: "КАМАЗ доставка дров Київ", name: "КАМАЗ самоскид", volume: "8 складометрів", price: "4 000 грн" }
      ].map((card, i) => /* @__PURE__ */ jsxs(
        "figure",
        {
          className: "nh-card hover-glow",
          style: {
            margin: 0,
            padding: 0,
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "default",
            transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
            border: "1px solid var(--color-border-subtle)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: {
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)",
              padding: "1.5rem 1.5rem 0.5rem"
            }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: card.src,
                alt: card.alt,
                width: 800,
                height: 600,
                loading: "lazy",
                style: {
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  transition: "transform 0.4s ease"
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("figcaption", { style: { padding: "1.25rem 1.5rem 1.5rem" }, children: [
              /* @__PURE__ */ jsx("h3", { style: {
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--c-text)",
                margin: "0 0 0.75rem"
              }, children: card.name }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                color: "var(--c-text2)"
              }, children: [
                /* @__PURE__ */ jsx(Package, { size: 16, style: { color: "var(--c-orange)", flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: card.volume })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#22c55e"
              }, children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 16, style: { flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: "Швидка доставка по Києву" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: {
                display: "flex",
                alignItems: "baseline",
                gap: "0.25rem",
                paddingTop: "0.75rem",
                borderTop: "1px dashed rgba(255,255,255,0.08)"
              }, children: /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--c-orange)"
              }, children: card.price }) })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxs("table", { style: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Тип машини" }),
          /* @__PURE__ */ jsx("th", { children: "Обсяг" }),
          /* @__PURE__ */ jsx("th", { children: "Ціна доставки" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "ГАЗель (бус)" }),
            /* @__PURE__ */ jsx("td", { children: "4–5 складометрів" }),
            /* @__PURE__ */ jsx("td", { children: "1 500 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "ЗІЛ самоскид" }),
            /* @__PURE__ */ jsx("td", { children: "4 складометри" }),
            /* @__PURE__ */ jsx("td", { children: "3 000 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "КАМАЗ самоскид" }),
            /* @__PURE__ */ jsx("td", { children: "8 складометрів" }),
            /* @__PURE__ */ jsx("td", { children: "4 000 грн" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Доставка паливних брикетів" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Вартість доставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
          " по Києву:"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1rem", marginBottom: "1.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(249,115,22,0.05)",
            border: "1px solid rgba(249,115,22,0.15)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "2rem", fontWeight: 800, color: "var(--c-orange)", display: "block", marginBottom: "0.25rem" }, children: "700 грн" }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontSize: "0.95rem" }, children: "за тонну по Києву" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "2rem", fontWeight: 800, color: "var(--c-text)", display: "block", marginBottom: "0.25rem" }, children: "+20 грн" }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-text2)", fontSize: "0.95rem" }, children: "за кожен кілометр за межі Києва" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { margin: 0 }, children: "Доставка брикетів здійснюється вантажним транспортом з можливістю розвантаження гідробортом або маніпулятором." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Доставка кам'яного вугілля" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Вартість доставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
          " залежить від обсягу замовлення та відстані доставки. Ціну уточнюйте у менеджера."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Для доставки вугілля по Києву та області використовуються автомобілі:" }),
        /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }, children: ["ЗІЛ", "КАМАЗ", "Маніпулятор"].map((v, i) => /* @__PURE__ */ jsxs("li", { style: {
          padding: "0.75rem 1.25rem",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--color-border-subtle)",
          display: "flex",
          alignItems: "center",
          fontSize: "1.05rem",
          color: "var(--c-text)"
        }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)", marginRight: "10px", fontWeight: 700 }, children: "•" }),
          " ",
          v
        ] }, i)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: cardPad, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Спецтехніка для розвантаження" }),
      /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "1.5rem" }, children: "Для зручного розвантаження палива у складних умовах ми пропонуємо спеціалізовану техніку:" }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "1.5rem"
      }, children: [
        { src: "/images/delivery/manipulator-dostavka-kyiv.webp", alt: "Кран-маніпулятор доставка Київ", name: "Кран-маніпулятор", volume: "Складні умови", price: "від 4 500 грн" },
        { src: "/images/delivery/gidrobort-rokla-dostavka-kyiv.webp", alt: "Гідроборт рокла доставка Київ", name: "Гідроборт / рокла", volume: "Складні умови", price: "від 4 500 грн" }
      ].map((card, i) => /* @__PURE__ */ jsxs(
        "figure",
        {
          className: "nh-card hover-glow",
          style: {
            margin: 0,
            padding: 0,
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "default",
            transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
            border: "1px solid var(--color-border-subtle)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: {
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(20,25,30,0.4) 100%)",
              padding: "1.5rem 1.5rem 0.5rem"
            }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: card.src,
                alt: card.alt,
                width: 800,
                height: 600,
                loading: "lazy",
                style: {
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  transition: "transform 0.4s ease"
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("figcaption", { style: { padding: "1.25rem 1.5rem 1.5rem" }, children: [
              /* @__PURE__ */ jsx("h3", { style: {
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--c-text)",
                margin: "0 0 0.75rem"
              }, children: card.name }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                color: "var(--c-text2)"
              }, children: [
                /* @__PURE__ */ jsx(Package, { size: 16, style: { color: "var(--c-orange)", flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: card.volume })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#22c55e"
              }, children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 16, style: { flexShrink: 0 } }),
                /* @__PURE__ */ jsx("span", { children: "Швидка доставка по Києву" })
              ] }),
              /* @__PURE__ */ jsx("div", { style: {
                display: "flex",
                alignItems: "baseline",
                gap: "0.25rem",
                paddingTop: "0.75rem",
                borderTop: "1px dashed rgba(255,255,255,0.08)"
              }, children: /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--c-orange)"
              }, children: card.price }) })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxs("table", { style: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Послуга" }),
          /* @__PURE__ */ jsx("th", { children: "Ціна" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Кран-маніпулятор" }),
            /* @__PURE__ */ jsx("td", { children: "від 4 500 грн" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Гідроборт / рокла" }),
            /* @__PURE__ */ jsx("td", { children: "від 4 500 грн" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: sectionPad, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: {
      ...cardPad,
      background: "linear-gradient(145deg, rgba(249,115,22,0.04) 0%, rgba(20,25,30,0.9) 100%)",
      border: "1px solid rgba(249,115,22,0.12)"
    }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "1.5rem" }, children: "Оптові поставки палива" }),
      /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.25rem" }, children: [
          "Ми здійснюємо оптові поставки ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "дров" }),
          ", ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "брикетів" }),
          " та ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: seoLinkStyle, onMouseEnter: onEnter, onMouseLeave: onLeave, children: "вугілля" }),
          " повними фурами безпосередньо з виробництва. Доставка дров фурою по Києву та області — вигідний варіант для великих обсягів."
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.15)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }, children: "Обсяг фури" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-orange)" }, children: "22–24" }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "var(--c-text2)", fontSize: "0.9rem" }, children: "складометри дров" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--color-border-subtle)",
            textAlign: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }, children: "Ціна" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "1.75rem", fontWeight: 800, color: "var(--c-text)" }, children: "Індивідуально" }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "var(--c-text2)", fontSize: "0.9rem" }, children: "розраховується за запитом" })
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
}
function FinalCtaBanner$1({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Замовте доставку палива ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "вже сьогодні" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Готові обігріти вашу оселю. Чесний об'єм та гарантія якості від виробника." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: onOrderClick, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem" }, children: "Замовити" }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] })
          ] })
        ] })
      ]
    }
  ) }) });
}
function Delivery() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { pageData } = usePageSEO("/dostavka");
  const title = pageData?.meta_title || "Доставка дров по Києву — брикети та вугілля | КиївБрикет";
  const description = pageData?.meta_description || "Швидка доставка твердого палива (дров, брикетів, вугілля) по Києву та Київській області власним транспортом. Замовляйте сьогодні!";
  const combinedSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "КиївБрикет",
    "url": "https://kievbriket.com",
    "telephone": "+380991234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "вул. Колекторна, 19",
      "addressLocality": "Київ",
      "addressCountry": "UA"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Київська область"
    },
    "makesOffer": {
      "@type": "Service",
      "name": "Доставка дров, брикетів та вугілля"
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: {
    minHeight: "100vh",
    background: "var(--c-bg)",
    color: "var(--c-text)",
    fontFamily: "var(--font-outfit)",
    paddingTop: "64px"
  }, children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title,
        description,
        canonical: `${shopConfig.domain}/dostavka`,
        schema: combinedSchema
      }
    ),
    /* @__PURE__ */ jsx(HeroDelivery, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(DeliverySection, {}),
    /* @__PURE__ */ jsx(FuelCalculatorSection, { onQuickOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(BenefitsSection, {}),
    /* @__PURE__ */ jsx(DeliverySeoBlock, {}),
    /* @__PURE__ */ jsx(PopularQueriesSection, {}),
    /* @__PURE__ */ jsx(FaqSection$1, {}),
    /* @__PURE__ */ jsx(DistrictsSection, {}),
    /* @__PURE__ */ jsx(DeliveryExtendedSeo, {}),
    /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 8vw, 80px) 0 0", color: "var(--c-text2)", lineHeight: 1.8 }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "900px", margin: "0 auto", fontSize: "0.95rem" }, children: [
      /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
        "Ми здійснюємо ",
        /* @__PURE__ */ jsx("strong", { children: "доставку твердого палива по Києву" }),
        " власним транспортом. У нас можна замовити ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "дрова колоті" }),
        ", ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "паливні брикети" }),
        " та ",
        /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "var(--c-orange)", textDecoration: "none" }, children: "кам'яне вугілля" }),
        " з швидкою доставкою по всіх районах Києва та області."
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Наша компанія працює з 2013 року та забезпечує чесний обʼєм палива, швидке завантаження та оперативну доставку дров, брикетів і вугілля для приватних будинків, котелень та підприємств. Якщо вам потрібно ",
        /* @__PURE__ */ jsx("strong", { children: "купити дрова з доставкою" }),
        " або замовити ",
        /* @__PURE__ */ jsx("strong", { children: "доставку палива Київ" }),
        ", обирайте перевіреного постачальника КиївБрикет."
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: "1rem" }, children: [
        /* @__PURE__ */ jsx("p", { style: { marginBottom: "1rem" }, children: "Ми доставляємо колоті дрова різних порід:" }),
        /* @__PURE__ */ jsxs("ul", { style: { listStyleType: "disc", paddingLeft: "1.5rem", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("li", { children: "дуб" }),
          /* @__PURE__ */ jsx("li", { children: "граб" }),
          /* @__PURE__ */ jsx("li", { children: "ясен" }),
          /* @__PURE__ */ jsx("li", { children: "береза" })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1rem" }, children: [
          "Замовити дрова з доставкою по Києву можна у будь-який район міста.",
          /* @__PURE__ */ jsx("br", {}),
          "Власний автопарк дозволяє виконувати швидку доставку дров, паливних брикетів та вугілля по всьому Києву та Київській області."
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(FinalCtaBanner$1, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(
      OrderFormModal,
      {
        isOpen: isOrderFormOpen,
        onClose: () => setIsOrderFormOpen(false)
      }
    )
  ] });
}
function HeroContacts({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsxs("section", { ref, className: "hero-section", style: { minHeight: "auto", paddingTop: "clamp(15px, 3vw, 104px)", paddingBottom: "0", position: "relative", overflow: "hidden", marginBottom: "40px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "glow-orb",
        style: {
          width: 700,
          height: 600,
          top: -100,
          right: "-10%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", style: { zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }, children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: `reveal ${visible ? "visible" : ""}`, style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
        marginBottom: "1rem",
        fontSize: "0.8125rem",
        color: "rgba(255,255,255,0.4)",
        width: "100%"
      }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }, children: "Головна" }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 13, style: { opacity: 0.4 } }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontWeight: 500 }, children: "Контакти" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-text fade-up", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        background: "rgba(255,255,255,0.02)",
        padding: "2.5rem 3rem 2rem 3rem",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }, children: [
        /* @__PURE__ */ jsx("h1", { className: "display hero-h1 fade-up fade-up-d1", style: { fontSize: "clamp(2.5rem, 6vw, 48px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.5rem", color: "#fff" }, children: "Контакти" }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle fade-up fade-up-d2", style: {
          fontSize: "18px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "700px",
          marginBottom: "2rem",
          fontWeight: 400
        }, children: "Замовити дрова, паливні брикети або вугілля з доставкою по Києву та області." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions fade-up fade-up-d3", style: { display: "flex", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
              className: "btn-glow",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--c-orange)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s ease"
              },
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 20 }),
                "Подзвонити"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onOrderClick,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              },
              children: [
                "Замовити доставку",
                /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-benefits fade-up fade-up-d4", style: {
          display: "flex",
          gap: "clamp(0.35rem, 1.5vw, 2rem)",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "clamp(12px, 3vw, 16px)",
          width: "100%",
          fontSize: "clamp(0.7rem, 2.8vw, 0.9rem)",
          color: "rgba(255,255,255,0.7)"
        }, children: [
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " швидка доставка"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " чесний складометр"
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#22C55E" }, children: "✔" }),
            " оплата після отримання"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ContactSectionCombined() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ name: "" });
  const { phoneProps, rawPhone, resetPhone } = usePhoneInput();
  const [status, setStatus] = useState("idle");
  const cards = [
    {
      title: "Телефон",
      desc: shopConfig.contact.phone,
      icon: /* @__PURE__ */ jsx(Phone, { size: 24, color: "var(--c-orange)" }),
      action: /* @__PURE__ */ jsx("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, style: { color: "var(--c-orange)", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem", marginTop: "auto" }, children: "Подзвонити →" })
    },
    {
      title: "Графік роботи",
      desc: "Щодня\n09:00 – 20:00",
      icon: /* @__PURE__ */ jsx(Clock, { size: 24, color: "var(--c-orange)" }),
      action: /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-success)", fontWeight: 600, fontSize: "0.9rem", marginTop: "auto", display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "10px" }, children: "●" }),
        " Завжди на зв'язку"
      ] })
    },
    {
      title: "Локація",
      desc: "м. Київ\nвул. Колекторна, 19",
      icon: /* @__PURE__ */ jsx(MapPin, { size: 24, color: "var(--c-orange)" }),
      action: null
    }
  ];
  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/orders/quick", {
        customer_name: form.name,
        customer_phone: rawPhone
      });
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("success");
    }
  };
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "60px 0 40px" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("style", { children: `
                    .contact-split-grid {
                        display: grid;
                        grid-template-columns: 1fr 1.1fr;
                        gap: 2rem;
                        align-items: stretch;
                    }
                    .contact-cards-inner {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    @media (max-width: 900px) {
                        .contact-split-grid { grid-template-columns: 1fr; }
                        .contact-cards-inner { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
                    }
                ` }),
    /* @__PURE__ */ jsxs("div", { className: `reveal ${visible ? "visible" : ""} contact-split-grid`, children: [
      /* @__PURE__ */ jsx("div", { className: "contact-cards-inner", children: cards.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "nh-card hover-glow", style: { padding: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100%", borderRadius: "16px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(249,115,22,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(249,115,22,0.2)",
            flexShrink: 0
          }, children: c.icon }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "0.9rem", fontWeight: 600, color: "var(--c-text2)", marginBottom: "0.2rem" }, children: c.title }),
            /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text)", fontWeight: 700, margin: 0, fontSize: "1.15rem", whiteSpace: "pre-line" }, children: c.desc })
          ] })
        ] }),
        c.action
      ] }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "nh-card", style: {
        padding: "3rem 2.5rem",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.8) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        height: "100%"
      }, children: status === "success" ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 60, height: 60, background: "var(--color-success-bg)", border: "1px solid var(--color-success-border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }, children: /* @__PURE__ */ jsx(CheckCircle2, { size: 26, color: "var(--color-success)" }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)", marginBottom: 10 }, children: "Заявку прийнято!" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "1rem", color: "var(--c-text2)", marginBottom: 24 }, children: "Ми вже отримали ваш контакт і передзвонимо вам найближчим часом." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setStatus("idle");
              setForm({ name: "" });
              resetPhone();
            },
            style: { background: "none", border: "none", color: "var(--c-orange)", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" },
            children: "Нова заявка →"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "h2", style: { fontSize: "1.75rem", marginBottom: 8 }, children: "Швидке замовлення" }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)" }, children: "Залиште свій номер і ми передзвонимо за 15 хвилин." })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Ім'я" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ваше ім'я",
              value: form.name,
              onChange: setField("name"),
              required: true,
              style: {
                background: "var(--c-surface2)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "var(--c-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit"
              },
              onFocus: (e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)",
              onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text2)" }, children: "Телефон" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ...phoneProps,
              required: true,
              style: {
                background: "var(--c-surface2)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "var(--c-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "inherit"
              },
              onFocus: (e) => {
                phoneProps.onFocus(e);
                e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
              },
              onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "nh-btn-primary",
            disabled: status === "loading",
            style: { justifyContent: "center", marginTop: 12, width: "100%", padding: "18px 24px", fontSize: "1rem" },
            children: status === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin" }),
              " Обробка..."
            ] }) : "Замовити дзвінок"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const OBLAST_PATH = "M 78,44 L 108,18 L 152,6 L 200,10 L 250,6 L 300,22 L 348,52 L 376,94 L 380,140 L 365,182 L 334,220 L 292,248 L 248,260 L 200,262 L 152,260 L 108,248 L 68,220 L 38,180 L 22,138 L 26,92 Z";
const SAT_PINS = [
  { label: "Бровари", cx: 272, cy: 100, beginAnim: "0s" },
  { label: "Ірпінь", cx: 104, cy: 116, beginAnim: "1.1s" },
  { label: "Бориспіль", cx: 298, cy: 192, beginAnim: "0.5s" },
  { label: "Вишневе", cx: 118, cy: 196, beginAnim: "1.7s" }
];
function ContactMap() {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsx("div", { className: `nh-card reveal ${visible ? "visible" : ""}`, style: { padding: "0", borderRadius: "24px", overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.08)" }, children: /* @__PURE__ */ jsxs("div", { style: {
    width: "100%",
    height: "450px",
    background: "#080f0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", height: "100%", display: "block", opacity: 0.6 }, children: [
      /* @__PURE__ */ jsxs("defs", { children: [
        /* @__PURE__ */ jsxs("filter", { id: "kb-pin-glow", x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
          /* @__PURE__ */ jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "4", result: "blur" }),
          /* @__PURE__ */ jsxs("feMerge", { children: [
            /* @__PURE__ */ jsx("feMergeNode", { in: "blur" }),
            /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("radialGradient", { id: "kb-glow", cx: "50%", cy: "50%", r: "50%", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#F97316", stopOpacity: "0.45" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#F97316", stopOpacity: "0" })
        ] })
      ] }),
      [50, 100, 150, 200, 250].map((y) => /* @__PURE__ */ jsx("line", { x1: "0", y1: y, x2: "400", y2: y, stroke: "rgba(255,255,255,0.02)", strokeWidth: "1" }, `h${y}`)),
      [57, 114, 171, 228, 285, 342].map((x) => /* @__PURE__ */ jsx("line", { x1: x, y1: "0", x2: x, y2: "300", stroke: "rgba(255,255,255,0.02)", strokeWidth: "1" }, `v${x}`)),
      /* @__PURE__ */ jsx("path", { d: OBLAST_PATH, fill: "rgba(249,115,22,0.04)", stroke: "rgba(249,115,22,0.3)", strokeWidth: "1", strokeDasharray: "5 4", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("ellipse", { cx: "200", cy: "158", rx: "76", ry: "60", fill: "none", stroke: "rgba(249,115,22,0.2)", strokeWidth: "1", strokeDasharray: "4 5" }),
      [0, 0.73, 1.46].map((begin, i) => /* @__PURE__ */ jsxs("circle", { cx: "200", cy: "158", r: "22", fill: "none", stroke: "rgba(249,115,22,0.5)", strokeWidth: "1.5", children: [
        /* @__PURE__ */ jsx("animate", { attributeName: "r", from: "22", to: "50", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` }),
        /* @__PURE__ */ jsx("animate", { attributeName: "opacity", from: "0.55", to: "0", dur: "2.2s", repeatCount: "indefinite", begin: `${begin}s` })
      ] }, i)),
      /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: 55, fill: "url(#kb-glow)" }),
      SAT_PINS.map((pin) => /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "9", fill: "rgba(249,115,22,0.12)" }),
        /* @__PURE__ */ jsx("circle", { cx: pin.cx, cy: pin.cy, r: "4.5", fill: "#F97316", opacity: "0.6", filter: "url(#kb-pin-glow)", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.4;0.9;0.4", dur: "3.5s", repeatCount: "indefinite", begin: pin.beginAnim }) })
      ] }, pin.label)),
      /* @__PURE__ */ jsxs("g", { filter: "url(#kb-pin-glow)", children: [
        /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "11", fill: "#F97316" }),
        /* @__PURE__ */ jsx("circle", { cx: "200", cy: "158", r: "5", fill: "#fff" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { position: "relative", zIndex: 2, padding: "3rem", width: "100%", height: "100%", display: "flex", alignItems: "center", background: "linear-gradient(to right, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.7) 40%, rgba(10,13,20,0) 100%)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 450 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--c-orange)", marginBottom: "1rem", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }, children: [
        /* @__PURE__ */ jsx(MapPin, { size: 16 }),
        " Зона покриття"
      ] }),
      /* @__PURE__ */ jsxs("h3", { className: "h3", style: { fontSize: "2.25rem", marginBottom: "1.25rem", lineHeight: 1.2 }, children: [
        "Безперебійна доставка по ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "всьому Києву" }),
        " та ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "області" })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem" }, children: "Наш автопарк та оптимізована логістика дозволяють швидко та вчасно доставляти замовлення. Київ: день в день. Область: 24-48 годин." }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "1rem", flexWrap: "wrap" }, children: /* @__PURE__ */ jsx(Link, { to: "/dostavka", className: "nh-btn-primary", style: { padding: "12px 24px", fontSize: "0.95rem", borderRadius: "10px", textDecoration: "none" }, children: "Детальніше про доставку" }) })
    ] }) })
  ] }) }) }) });
}
function WhatWeDeliver() {
  const { ref, visible } = useReveal();
  const sections2 = [
    { name: "Дрова", icon: /* @__PURE__ */ jsx(Flame, { size: 24 }), link: "/catalog/drova" },
    { name: "Паливні брикети", icon: /* @__PURE__ */ jsx(Box, { size: 24 }), link: "/catalog/brikety" },
    { name: "Вугілля", icon: /* @__PURE__ */ jsx(Box, { size: 24 }), link: "/catalog/vugillya" }
  ];
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(30px, 6vw, 60px) 0" }, children: /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "2.5rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2", style: { fontSize: "1.75rem" }, children: "Що ми доставляємо" }) }),
    /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", transitionDelay: "0.1s" }, children: sections2.map((item, i) => /* @__PURE__ */ jsxs(Link, { to: item.link, className: "nh-card hover-glow", style: { padding: "2rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { background: "rgba(249,115,22,0.1)", color: "var(--c-orange)", padding: "12px", borderRadius: "12px" }, children: item.icon }),
      /* @__PURE__ */ jsx("span", { style: { fontSize: "1.25rem", fontWeight: 600, color: "var(--c-text)", flex: 1 }, children: item.name }),
      /* @__PURE__ */ jsx(ChevronRight, { size: 20, color: "var(--c-text2)" })
    ] }, i)) })
  ] }) });
}
function ContactsSeoBlock() {
  return /* @__PURE__ */ jsx("section", { style: { padding: "clamp(40px, 8vw, 80px) 0", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { className: "nh-card", style: { width: "100%", padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", borderRadius: "24px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "h2", style: { marginBottom: "2.5rem", textAlign: "center" }, children: "Купити дрова, брикети та вугілля у Києві" }),
    /* @__PURE__ */ jsxs("div", { style: { color: "var(--c-text2)", lineHeight: 1.8, fontSize: "1.05rem", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "3rem" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Компанія «КиївБрикет» забезпечує безперебійне постачання твердого палива. Ми спеціалізуємось на ",
          /* @__PURE__ */ jsx("strong", { children: "продажу дров" }),
          ", а також сучасних еко-альтернатив. Ви можете ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/drova", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "купити дрова київ" }),
          " з безкоштовним розвантаженням та чесним складометром. В наявності дуб, граб, береза та сосна."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: 0 }, children: [
          "Для власників твердопаливних котлів ми пропонуємо зручне паливо з високою тепловіддачею – ",
          /* @__PURE__ */ jsx("strong", { children: "продаж брикетів" }),
          " типів RUF, Pini Kay та Nestro. Звертайтесь, щоб замовити ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/brikety", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "брикети київ" }),
          " і забезпечити стабільний жар у вашій оселі."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { marginBottom: "1.5rem" }, children: [
          "Також ми здійснюємо ",
          /* @__PURE__ */ jsx("strong", { children: "продаж вугілля" }),
          ". Якісне ",
          /* @__PURE__ */ jsx(Link, { to: "/catalog/vugillya", style: { color: "inherit", textDecoration: "underline", textDecorationColor: "var(--color-border-medium)", textUnderlineOffset: "4px", transition: "all 0.2s" }, onMouseEnter: (e) => {
            e.currentTarget.style.color = "var(--c-orange)";
            e.currentTarget.style.textDecorationColor = "var(--c-orange)";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.textDecorationColor = "var(--color-border-medium)";
          }, children: "вугілля київ" }),
          " (антрацит та довгополум'яне) фасується в зручні мішки по 50 кг з доставкою прямо до вашого двору. Обирайте надійного постачальника з багаторічним досвідом та власним автопарком."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginBottom: 0 }, children: "Незалежно від того, яке паливо ви обрали, ми гарантуємо відсутність прихованих платежів, швидку обробку заявок та можливість оплати безпосередньо після передачі товару на вашій ділянці." })
      ] })
    ] })
  ] }) }) });
}
function FaqSection() {
  const { ref, visible } = useReveal();
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Як замовити дрова?", a: "Ви можете оформити замовлення трьома способами: зателефонувати нам, заповнити форму зворотного зв'язку на цій сторінці або натиснути кнопку 'Замовити' на сторінці конкретного товару." },
    { q: "Чи можна замовити доставку сьогодні?", a: "Так, за умови оформлення заявки в першій половині дня та наявності вільних машин, доставка по Києву здійснюється 'день у день'." },
    { q: "Які способи оплати доступні?", a: "Ми приймаємо оплату готівкою при отриманні товару (після розвантаження та перевірки об'єму), а також можливий безготівковий розрахунок за потребою." },
    { q: "Чи працюєте по Київській області?", a: "Так, ми здійснюємо доставку по всьому Києву та всій Київській області (Бровари, Бориспіль, Ірпінь, Буча, Фастів тощо). Вартість доставки в область розраховується індивідуально." }
  ];
  return /* @__PURE__ */ jsxs("section", { ref, className: "faq-mobile-section", style: { padding: "clamp(40px, 8vw, 80px) 0" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    } }),
    /* @__PURE__ */ jsxs("div", { className: "layout-container", children: [
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { textAlign: "center", marginBottom: "3rem" }, children: /* @__PURE__ */ jsx("h2", { className: "h2 faq-mobile-h2", style: { maxWidth: 800, margin: "0 auto" }, children: "Поширені запитання" }) }),
      /* @__PURE__ */ jsx("div", { className: `reveal ${visible ? "visible" : ""}`, style: { transitionDelay: "0.1s" }, children: faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIdx(isOpen ? -1 : idx),
              style: {
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "var(--c-text)",
                fontFamily: "inherit",
                fontSize: "1.125rem",
                fontWeight: 600,
                gap: "1rem"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: faq.q }),
                /* @__PURE__ */ jsx(
                  ChevronRight,
                  {
                    size: 20,
                    style: {
                      flexShrink: 0,
                      color: "var(--c-orange)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s ease"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "var(--c-text2)", lineHeight: 1.6 }, children: /* @__PURE__ */ jsx("p", { style: { paddingBottom: "1.5rem", margin: 0 }, children: faq.a }) })
        ] }, idx);
      }) })
    ] })
  ] });
}
function FinalCtaBanner({ onOrderClick }) {
  const { ref, visible } = useReveal();
  return /* @__PURE__ */ jsx("section", { ref, style: { padding: "clamp(40px, 10vw, 100px) 0" }, children: /* @__PURE__ */ jsx("div", { className: "layout-container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `nh-card reveal ${visible ? "visible" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)",
        textAlign: "center",
        background: "linear-gradient(145deg, var(--color-bg-elevated) 0%, rgba(20,25,30,1) 100%)",
        border: "1px solid rgba(249,115,22,0.2)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs("h2", { className: "h2", style: { fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "1rem" }, children: [
            "Зателефонуйте нам ",
            /* @__PURE__ */ jsx("span", { style: { color: "var(--c-orange)" }, children: "прямо зараз" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--c-text2)", fontSize: "1.125rem", marginBottom: "2.5rem" }, children: "Ми готові прийняти ваше замовлення та доставити якісне паливо без передоплат." }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("a", { href: `tel:${shopConfig.contact.phone.replace(/[^0-9+]/g, "")}`, className: "nh-btn-primary", style: { padding: "16px 32px", fontSize: "1rem", textDecoration: "none" }, children: [
              /* @__PURE__ */ jsx(Phone, { size: 18, style: { marginRight: 8 } }),
              " Подзвонити"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: onOrderClick, className: "nh-btn-ghost", style: { padding: "16px 32px", fontSize: "1rem", border: "1px solid var(--color-border-medium)", cursor: "pointer" }, children: "Замовити доставку" })
          ] })
        ] })
      ]
    }
  ) }) });
}
function Contacts() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { pageData } = usePageSEO("/contacts");
  const title = pageData?.meta_title || "Контакти КиївБрикет | Замовити дрова, брикети, вугілля";
  const description = pageData?.meta_description || "Контактна інформація КиївБрикет. Телефони, графік роботи, адреса. Замовляйте дрова, паливні брикети та вугілля з доставкою по Києву та області.";
  return /* @__PURE__ */ jsxs("div", { className: "new-home-scope", style: {
    minHeight: "100vh",
    background: "var(--c-bg)",
    color: "var(--c-text)",
    fontFamily: "var(--font-outfit)",
    paddingTop: "64px"
  }, children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title,
        description,
        canonical: `https://kievbriket.com/kontakty`
      }
    ),
    /* @__PURE__ */ jsx(HeroContacts, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(ContactSectionCombined, {}),
    /* @__PURE__ */ jsx(ContactMap, {}),
    /* @__PURE__ */ jsx(WhatWeDeliver, {}),
    /* @__PURE__ */ jsx(ContactsSeoBlock, {}),
    /* @__PURE__ */ jsx(FaqSection, {}),
    /* @__PURE__ */ jsx(FinalCtaBanner, { onOrderClick: () => setIsOrderFormOpen(true) }),
    /* @__PURE__ */ jsx(
      OrderFormModal,
      {
        isOpen: isOrderFormOpen,
        onClose: () => setIsOrderFormOpen(false)
      }
    )
  ] });
}
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { background: "linear-gradient(160deg, #111827 0%, #1f2937 40%, #111827 100%)" }, children: [
    /* @__PURE__ */ jsx(SEOHead, { title: `Про нас | Заготівля дров ${shopConfig.name}` }),
    /* @__PURE__ */ jsxs("header", { className: "relative h-[65vh] flex items-center justify-center overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/about/firewood-about-banner.jpg",
          alt: `${shopConfig.name} Banner`,
          className: "absolute inset-0 w-full h-full object-cover opacity-60"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0",
          style: { background: "linear-gradient(to bottom, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.8) 100%)" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4", children: shopConfig.name }),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-2xl",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: "Про нас"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-[#e67e22] mx-auto mb-6 rounded-full" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/80 text-lg md:text-xl tracking-wide", children: "Тепло та затишок у вашому домі — наша головна мета" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-6 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center mb-20", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: [
              "Якісні дрова від ",
              /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "надійного постачальника" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#e67e22] mx-auto mb-8 rounded-full" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-white/70 leading-relaxed italic", children: '"Ми не просто продаємо дрова — ми забезпечуємо вас теплом на всю зиму, гарантуючи якість кожного поліна."' })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative rounded-3xl overflow-hidden shadow-2xl group border border-white/10",
            style: { boxShadow: "0 0 40px rgba(230,126,34,0.1)" },
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/about/firewood-pile-2.jpg",
                  alt: "Якісні та сухі дрова",
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0",
                  style: { background: "linear-gradient(to top, rgba(17,24,39,0.6), transparent)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(
            "h3",
            {
              className: "text-3xl font-black text-white uppercase tracking-tight",
              style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
              children: [
                "Гарантія якості та ",
                /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "Об'єму" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-white/70 text-lg leading-relaxed", children: [
            "Наша деревина проходить суворий відбір. Ми постачаємо дрова без гнилі та трухи, забезпечуючи оптимальну вологість для ефективного горіння. Головний наш принцип — ",
            /* @__PURE__ */ jsx("strong", { children: "чесний об'єм" }),
            '. Ви отримуєте рівно стільки складометрів, за скільки заплатили, без "коефіцієнтів укладання".'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#e67e22]/30",
                style: { background: "rgba(230,126,34,0.1)" },
                children: [
                  /* @__PURE__ */ jsx(FaTree, { className: "text-[#e67e22]" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black text-sm text-white uppercase tracking-wide", children: "Екологічна деревина" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10",
                style: { background: "rgba(255,255,255,0.05)" },
                children: [
                  /* @__PURE__ */ jsx(FaFire, { className: "text-[#e74c3c]" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black text-sm text-white uppercase tracking-wide", children: "Висока тепловіддача" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "py-20 md:py-28 relative overflow-hidden",
        style: { background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none",
              style: { background: "radial-gradient(circle, #e67e22, transparent)" }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.3em] text-[#e67e22] mb-4", children: "Наш підхід" }),
                /* @__PURE__ */ jsxs(
                  "h2",
                  {
                    className: "text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4",
                    style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
                    children: [
                      "Від лісгоспу до вашого ",
                      /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "каміна" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[#e67e22] font-black italic text-lg", children: "— Прямі поставки без посередників" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-white/70 text-lg leading-relaxed", children: "Ми працюємо на ринку твердого палива вже понад 5 років. Починаючи з невеликих об'ємів, ми виросли до підприємства з власним автопарком та великим складом у Києві. Завдяки прямим контрактам з лісництвами, ми пропонуємо стабільні ціни та гарантуємо легальність кожної партії деревини." }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-5 p-6 rounded-2xl border border-[#e67e22]/30",
                  style: { background: "rgba(230,126,34,0.1)" },
                  children: [
                    /* @__PURE__ */ jsx(FaTruck, { className: "text-4xl text-[#e67e22] flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-black text-white uppercase tracking-wide", children: "Власний автопарк" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/60 uppercase tracking-widest mt-1", children: "Доставка від 2 до 15 скл.м." })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute -inset-4 rounded-3xl opacity-20 blur-2xl",
                  style: { background: "linear-gradient(135deg, #e67e22, #d35400)" }
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative rounded-3xl overflow-hidden shadow-2xl border border-white/10",
                  style: { boxShadow: "0 0 50px rgba(230,126,34,0.15)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: "/about/firewood-truck.jpg",
                        alt: "Доставка дров вантажівками",
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute inset-0",
                        style: { background: "linear-gradient(to top, rgba(17,24,39,0.7), transparent 50%)" }
                      }
                    )
                  ]
                }
              )
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-6 py-20 md:py-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tight",
            style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
            children: [
              shopConfig.name,
              " у ",
              /* @__PURE__ */ jsx("span", { style: { color: "#e67e22" }, children: "цифрах" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#e67e22] mx-auto mt-5 rounded-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: [
        { label: "Років на ринку", val: "5+", icon: "⏳" },
        { label: "Задоволених клієнтів", val: "3000+", icon: "🤝" },
        { label: "Машин у парку", val: "8", icon: "🚛" },
        { label: "Складометрів на рік", val: "10 000+", icon: "🪵" }
      ].map((stat, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#e67e22]/40",
          style: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-3", children: stat.icon }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-4xl font-black text-[#e67e22] mb-2",
                style: { fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" },
                children: stat.val
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: stat.label })
          ]
        },
        i
      )) })
    ] })
  ] });
}
function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/pages/by-route`, { params: { route: `/${slug}` } }).then((res) => {
      setPage(res.data);
    }).catch((err) => {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      }
      console.error("Failed to load page", err);
    }).finally(() => setLoading(false));
  }, [slug]);
  useEffect(() => {
    if (page?.meta_title) {
      document.title = page.meta_title;
    }
    return () => {
      document.title = "КиївБрикет";
    };
  }, [page]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" }) });
  if (notFound || !page) return /* @__PURE__ */ jsxs("div", { className: "min-h-[60vh] flex flex-col items-center justify-center text-center px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-6xl font-black text-gray-200 mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg mb-6", children: "Сторінку не знайдено" }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all", children: "На головну" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 min-h-[60vh]", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-[#1A1A2E] to-[#16213E] py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-black text-white leading-tight", children: page.h1_heading || page.name || page.meta_title }),
      page.meta_description && /* @__PURE__ */ jsx("p", { className: "text-white/60 mt-3 max-w-2xl text-sm md:text-base leading-relaxed", children: page.meta_description })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14", children: [
      page.content ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg",
          dangerouslySetInnerHTML: { __html: page.content }
        }
      ) : /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-center py-10", children: "Контент цієї сторінки ще не заповнено." }),
      page.bottom_seo_text && /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t border-gray-200", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "prose prose-sm prose-gray max-w-none text-gray-500",
          dangerouslySetInnerHTML: { __html: page.bottom_seo_text }
        }
      ) })
    ] })
  ] });
}
const Login = React.lazy(() => import("./assets/Login-BYuoa_Zl.js"));
const Register = React.lazy(() => import("./assets/Register-B1PsgqBd.js"));
const Cart = React.lazy(() => import("./assets/Cart-Ps5h4rc5.js"));
const AdminLayout = React.lazy(() => import("./assets/AdminLayout-CQuT53R-.js"));
const Orders = React.lazy(() => import("./assets/Orders-lDs1WTX2.js"));
const Products = React.lazy(() => import("./assets/Products-B6i_hdz6.js"));
const ProductEdit = React.lazy(() => import("./assets/ProductEdit-CcdsHlvN.js"));
const PageEditor = React.lazy(() => import("./assets/PageEditor-RQqKn3Z-.js"));
const CategoryManager = React.lazy(() => import("./assets/CategoryManager-BPbWxB5n.js"));
React.lazy(() => import("./assets/SEOPages-AlcA5Ryi.js"));
const TelegramSettings = React.lazy(() => import("./assets/TelegramSettings-BbXdVmth.js"));
const SiteSettingsPage = React.lazy(() => import("./assets/SiteSettingsPage-Ut7kwAft.js"));
function App() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(GoogleAnalytics, {}),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-[#A0153E] border-t-transparent rounded-full animate-spin" }) }), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(PublicLayout, {}), children: [
        /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/catalog/:categorySlug", element: /* @__PURE__ */ jsx(Catalog, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/catalog/:categorySlug/:productSlug", element: /* @__PURE__ */ jsx(ProductPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(Register, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/cart", element: /* @__PURE__ */ jsx(Cart, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/dostavka", element: /* @__PURE__ */ jsx(Delivery, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/kontakty", element: /* @__PURE__ */ jsx(Contacts, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/contacts", element: /* @__PURE__ */ jsx(Contacts, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/pro-nas", element: /* @__PURE__ */ jsx(About, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/page/:slug", element: /* @__PURE__ */ jsx(DynamicPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
      ] }),
      /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(ProtectedRoute, {}), children: /* @__PURE__ */ jsxs(Route, { path: "/admin", element: /* @__PURE__ */ jsx(AdminLayout, {}), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Navigate, { to: "orders", replace: true }) }),
        /* @__PURE__ */ jsx(Route, { path: "orders", element: /* @__PURE__ */ jsx(Orders, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "products", element: /* @__PURE__ */ jsx(Products, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "products/new", element: /* @__PURE__ */ jsx(ProductEdit, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "products/edit/:id", element: /* @__PURE__ */ jsx(ProductEdit, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "seo", element: /* @__PURE__ */ jsx(PageEditor, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "categories", element: /* @__PURE__ */ jsx(CategoryManager, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "telegram", element: /* @__PURE__ */ jsx(TelegramSettings, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "settings", element: /* @__PURE__ */ jsx(SiteSettingsPage, {}) })
      ] }) })
    ] }) })
  ] }) });
}
function render(url, helmetContext, ssgData) {
  return renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(SSGDataProvider, { data: ssgData || null, children: /* @__PURE__ */ jsx(CategoryProvider, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) }) }) }) })
  );
}
export {
  AuthContext as A,
  CartContext as C,
  SEOHead as S,
  api as a,
  getProductUrl as b,
  useAuth as c,
  useCategories as d,
  getImageUrl as g,
  render,
  usePhoneInput as u
};
//# sourceMappingURL=entry-server.js.map
