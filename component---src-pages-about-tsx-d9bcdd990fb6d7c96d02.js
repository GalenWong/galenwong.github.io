(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__(4);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.to-string.js
var es6_object_to_string = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__(26);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/esm/Typography/Typography.js
var Typography = __webpack_require__(294);

// EXTERNAL MODULE: ./node_modules/@material-ui/styles/esm/makeStyles/makeStyles.js + 4 modules
var makeStyles = __webpack_require__(134);

// EXTERNAL MODULE: ./node_modules/@material-ui/styles/esm/createStyles/createStyles.js
var createStyles = __webpack_require__(268);

// CONCATENATED MODULE: ./src/components/About/About.tsx






function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




var introStr = "\nHi, my name is Galen Wong.\nI am a UCLA Computer Science undergrad.\nI mostly do work in JavaScript,\nespecially frontend developemnt with React.\nI also works with Go, C/C++ (learnt from school),\nand Python (my introductory language).\n";
var lazyUpdate = react_default.a.createElement(react_default.a.Fragment, null, "I don't like to put too much stuff on this page,\n\tsince I know things are going to change and I don't\n\twant to come back and update it.\n\tI can't imagine the extend of boredom that it\n\ttakes to get me to update my intro from \u201CI was a UCLA CS\u2026\u201D\n\tto \u201CI am working for blahblahblah\u201D. ", react_default.a.createElement("strong", null, "If you are really interested in knowing me, contact me through email or facebook or whatever, or even better, meet me in real life."), " Yes, I do work with computer software, things that are mostly\n\tvirtual. But ultimately they serve what is real and tangible:\n\tMeat and flesh like me, and like you.");
var useStyles = Object(makeStyles["a" /* default */])(function (theme) {
  return Object(createStyles["a" /* default */])({
    paragraph: {
      marginBottom: theme.spacing(2)
    }
  });
});

function About() {
  var classes = useStyles();

  var Title = function Title(_ref) {
    var children = _ref.children;
    return react_default.a.createElement(Typography["a" /* default */], {
      variant: "h3",
      component: "h2",
      classes: {
        root: classes.paragraph
      }
    }, children);
  };

  var Quote = function Quote(_ref2) {
    var children = _ref2.children;
    return react_default.a.createElement("h5", null, react_default.a.createElement("blockquote", null, react_default.a.createElement("i", null, children)));
  };

  var Aext = function Aext(_ref3) {
    var children = _ref3.children,
        aProps = _objectWithoutPropertiesLoose(_ref3, ["children"]);

    return react_default.a.createElement("a", Object.assign({
      target: "_blank",
      rel: "noreferrer noopener"
    }, aProps), children);
  };

  return react_default.a.createElement("article", null, react_default.a.createElement(Title, null, "About Galen"), react_default.a.createElement("p", null, " ", introStr, " "), react_default.a.createElement(Quote, null, "Meat and Flesh like me, and like you\u2026"), react_default.a.createElement("p", null, " ", lazyUpdate, " "), react_default.a.createElement(Title, null, "Facts"), react_default.a.createElement("p", null, "What I am writing in this section are facts about me as of September 12, 2019. These are facts about the 2019-09-12 me that I will not need to update these in the future. However, they might not apply to the current me."), react_default.a.createElement(Quote, null, "As of September 12", react_default.a.createElement("sup", null, "th"), ", 2019\u2026"), react_default.a.createElement("p", null, react_default.a.createElement("strong", null, "Cooking: "), "I like it a lot. I specializes in Asian cuisine, (Southern Chinese) home cooked style food but with a bit of Japanese and Korean twist. It is hard to find home cooked style food in LA, despite the great food scene in Sawtelle. However, my favorite supermarket is the ", " ", react_default.a.createElement(Aext, {
    href: "https://www.facebook.com/Nijiya-Market-Sawtelle-West-La-276513139034965/"
  }, "Nijiya in Sawtelle"), "."), react_default.a.createElement("p", null, react_default.a.createElement("strong", null, "Photography: "), "I like it a lot when I feel like it, meaning when my schedule is not filled with C/C++ assignment. You can find me and my work on insta ", " ", react_default.a.createElement(Aext, {
    href: "https://www.instagram.com/wonggalen/"
  }, "@wonggalen"), ". I actually do free grad photo shoot for people, only when I feel like it. If you want to model or want some stylish photo, hit me up but again only when I feel like it."), react_default.a.createElement("p", null, react_default.a.createElement("strong", null, "Music: "), "My music taste mutates. But right now, the Taiwanese indies are my fav. An non exhaustive list includes: ", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=kCHMkUSNHKw"
  }, "Sunset Rollercoaster \u65E5\u843D\u98DB\u8ECA"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=3Y0Ut5ozaKs"
  }, "\u8304\u5B50\u86CB"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=o5muvc-LOlA"
  }, "\u543F\u4E94\u4EBA"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=Vf1bAv_ZDAs"
  }, "\u597D\u6A02\u5718"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=NbNPJr_0tqA"
  }, "\u8001\u738B\u6A02\u968A"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=kZecE9AeELI"
  }, "deca joins"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=HqmpIQ9l-uA"
  }, "\u8349\u6771\u6C92\u6709\u6D3E\u5C0D"), "\u2026", " Other than these, there are those that cannot be\n\t\t\t\tclassified in the Taiwanese indie's category: ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=3ad4NsEy1tg"
  }, "\u30DD\u30EB\u30AB\u30C9\u30C3\u30C8\u30B9\u30C6\u30A3\u30F3\u30B0\u30EC\u30A4 polkadot stingray"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=cK3NMZAUKGw"
  }, "Babymetal"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=q2zj74iK1MI"
  }, "\u623F\u6771\u7684\u8C93"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=YJfHuATJYsQ"
  }, "Jay Chou \u5468\u6770\u502B"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=zkNzxsaCunU"
  }, "\u7C73\u6D25\u7384\u5E2B"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://www.youtube.com/watch?v=Gxdvg5zqjkc"
  }, "\u842C\u80FD\u9752\u5E74\u65C5\u5E97"), "\u2026"), react_default.a.createElement("p", null, react_default.a.createElement("strong", null, "School: "), "I think the best part about UCLA is probably ACM Hack. I got to teach ", " ", react_default.a.createElement(Aext, {
    href: "https://github.com/uclaacm/hackschool-f18"
  }, "some web dev"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://github.com/uclaacm/learn.py-s19"
  }, "some Python"), ",", " ", react_default.a.createElement(Aext, {
    href: "https://hoth.splashthat.com"
  }, "organize some hackathons"), ",", " ", "and meet some amazing people."));
}

/* harmony default export */ var About_About = (About);
// EXTERNAL MODULE: ./src/components/Layout/Layout.tsx + 17 modules
var Layout = __webpack_require__(271);

// EXTERNAL MODULE: ./src/components/SEO/SEO.tsx
var SEO = __webpack_require__(272);

// CONCATENATED MODULE: ./src/pages/about.tsx





function AboutPage() {
  return react_default.a.createElement(Layout["a" /* default */], {
    showTopInfo: true
  }, react_default.a.createElement(SEO["a" /* default */], {
    title: "About Galen",
    description: "Galen is weird..."
  }), react_default.a.createElement(About_About, null));
}

/* harmony default export */ var about = __webpack_exports__["default"] = (AboutPage);

/***/ })

}]);
//# sourceMappingURL=component---src-pages-about-tsx-d9bcdd990fb6d7c96d02.js.map