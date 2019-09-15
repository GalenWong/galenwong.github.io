(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./src/components/Layout/Layout.tsx + 17 modules
var Layout = __webpack_require__(271);

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__(4);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.to-string.js
var es6_object_to_string = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/Typography/Typography.js
var Typography = __webpack_require__(294);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/Box/Box.js + 18 modules
var Box = __webpack_require__(295);

// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js
var gatsby_browser_entry = __webpack_require__(88);

// CONCATENATED MODULE: ./src/components/BlogSummary/BlogSummary.tsx





function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





function BlogSummary(_ref) {
  var post = _ref.post,
      component = _ref.component,
      props = _objectWithoutPropertiesLoose(_ref, ["post", "component"]);

  var Component = component || 'article';
  return react_default.a.createElement(Component, props, react_default.a.createElement(Typography["a" /* default */], {
    variant: "h4",
    color: "primary",
    component: "h3",
    gutterBottom: true
  }, react_default.a.createElement(Box["a" /* default */], {
    lineHeight: 1.3
  }, react_default.a.createElement(gatsby_browser_entry["a" /* Link */], {
    to: "/blog" + post.fields.slug
  }, post.frontmatter.title))), react_default.a.createElement(Typography["a" /* default */], {
    variant: "h6",
    component: "h4"
  }, post.frontmatter.subtitle), react_default.a.createElement(Typography["a" /* default */], {
    variant: "body1",
    color: "textSecondary",
    gutterBottom: true
  }, post.frontmatter.date + " \u2022 " + post.timeToRead + " min read"));
}

/* harmony default export */ var BlogSummary_BlogSummary = (BlogSummary);
// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/styles/makeStyles.js
var makeStyles = __webpack_require__(174);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/styles/createStyles.js
var createStyles = __webpack_require__(293);

// EXTERNAL MODULE: ./src/components/SEO/SEO.tsx
var SEO = __webpack_require__(272);

// CONCATENATED MODULE: ./src/templates/HomeTemplate/HomeTemplate.tsx
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageQuery", function() { return pageQuery; });





var pageQuery = "8184178";
var useStyles = Object(makeStyles["a" /* default */])(function (theme) {
  return Object(createStyles["a" /* default */])({
    blogItem: {
      marginBottom: theme.spacing(8)
    }
  });
});

function HomePageTemplate(_ref) {
  var data = _ref.data;
  var classes = useStyles();
  var listOfBlogs = data.allMarkdownRemark.nodes.map(function (post) {
    return react_default.a.createElement(BlogSummary_BlogSummary, {
      className: classes.blogItem,
      post: post,
      key: post.id
    });
  });
  return react_default.a.createElement(Layout["a" /* default */], {
    showTopInfo: true
  }, react_default.a.createElement(SEO["a" /* default */], null), listOfBlogs);
}

/* harmony default export */ var HomeTemplate = __webpack_exports__["default"] = (HomePageTemplate);

/***/ })

}]);
//# sourceMappingURL=component---src-templates-home-template-home-template-tsx-8b2317ea361a0c28ae45.js.map