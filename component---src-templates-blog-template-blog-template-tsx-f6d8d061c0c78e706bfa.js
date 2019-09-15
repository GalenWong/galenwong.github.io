(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js
var gatsby_browser_entry = __webpack_require__(88);

// CONCATENATED MODULE: ./src/components/BlogPost/BlogPost.tsx


function BlogPost(_ref) {
  var html = _ref.html;
  return react_default.a.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}

/* harmony default export */ var BlogPost_BlogPost = (BlogPost);
// EXTERNAL MODULE: ./src/components/Layout/Layout.tsx + 17 modules
var Layout = __webpack_require__(271);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/Typography/Typography.js
var Typography = __webpack_require__(294);

// EXTERNAL MODULE: ./node_modules/@material-ui/styles/esm/makeStyles/makeStyles.js + 4 modules
var makeStyles = __webpack_require__(134);

// EXTERNAL MODULE: ./node_modules/@material-ui/styles/esm/createStyles/createStyles.js
var createStyles = __webpack_require__(268);

// EXTERNAL MODULE: ./src/components/SEO/SEO.tsx
var SEO = __webpack_require__(272);

// CONCATENATED MODULE: ./src/templates/BlogTemplate/BlogTemplate.tsx
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageQuery", function() { return pageQuery; });







var pageQuery = "985221119";
var useStyles = Object(makeStyles["a" /* default */])(function (theme) {
  return Object(createStyles["a" /* default */])({
    navBar: {
      textAlign: 'center'
    },
    nextPrevBar: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: theme.spacing(4, 0),
      flexWrap: 'wrap'
    },
    rightLink: {
      marginLeft: 'auto'
    }
  });
});

function BlogTemplate(_ref) {
  var data = _ref.data,
      pageContext = _ref.pageContext;
  var classes = useStyles();
  var markdownRemark = data.markdownRemark;
  var html = markdownRemark.html,
      frontmatter = markdownRemark.frontmatter,
      timeToRead = markdownRemark.timeToRead;
  var next = pageContext.next,
      prev = pageContext.prev;
  return react_default.a.createElement(Layout["a" /* default */], null, react_default.a.createElement(SEO["a" /* default */], {
    article: true,
    title: frontmatter.title,
    description: frontmatter.subtitle
  }), react_default.a.createElement("article", null, react_default.a.createElement("header", null, react_default.a.createElement(Typography["a" /* default */], {
    component: "h1",
    variant: "h2",
    gutterBottom: true
  }, frontmatter.title), react_default.a.createElement(Typography["a" /* default */], {
    variant: "h6",
    component: "h2"
  }, frontmatter.subtitle), react_default.a.createElement(Typography["a" /* default */], {
    variant: "body1",
    color: "textSecondary"
  }, frontmatter.date, " \u2022 ", timeToRead, " min read")), react_default.a.createElement(BlogPost_BlogPost, {
    html: html
  }), react_default.a.createElement("nav", {
    className: classes.navBar
  }, react_default.a.createElement("div", {
    className: classes.nextPrevBar
  }, prev ? react_default.a.createElement(gatsby_browser_entry["a" /* Link */], {
    to: prev.path
  }, "\u2190 ", prev.title) : null, next ? react_default.a.createElement(gatsby_browser_entry["a" /* Link */], {
    to: next.path,
    className: classes.rightLink
  }, next.title, " \u2192") : null), react_default.a.createElement(gatsby_browser_entry["a" /* Link */], {
    to: "/"
  }, "Go Back Home, the Middle"))));
}

/* harmony default export */ var BlogTemplate_BlogTemplate = __webpack_exports__["default"] = (BlogTemplate);

/***/ })

}]);
//# sourceMappingURL=component---src-templates-blog-template-blog-template-tsx-f6d8d061c0c78e706bfa.js.map