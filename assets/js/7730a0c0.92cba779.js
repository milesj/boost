(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2415],{297:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var a=n(7378);function r(e){var t=e.children,n=e.type;return a.createElement("span",{className:"badge badge--"+n},t)}},7586:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var a=n(7378),r=n(4142),o=n(1554),l=n(297),i="badgeGroup_2HOO",p="apiLink_32Vk";function s(e){var t=e.children;return a.createElement("span",{className:i},t)}function u(e){var t=e.api,n=e.backend,i=e.frontend,u=e.tooling;return a.createElement(a.Fragment,null,t&&a.createElement(r.default,{className:p,to:t},"API ",a.createElement(o.Z,null)),a.createElement(s,null,n&&a.createElement(l.Z,{type:"warning"},"Backend"),i&&a.createElement(l.Z,{type:"success"},"Frontend"),u&&a.createElement(l.Z,{type:"primary"},"Tooling")))}},2369:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return d},metadata:function(){return m},toc:function(){return c},default:function(){return h}});var a=n(9603),r=n(120),o=(n(7378),n(5318)),l=n(7586),i=n(4535),p=n(517),s=["components"],u={title:"Modules"},d=void 0,m={unversionedId:"module",id:"module",isDocsHomePage:!1,title:"Modules",description:"Load and resolve custom file types at runtime with a Node.js require replacement or",source:"@site/docs/module.mdx",sourceDirName:".",slug:"/module",permalink:"/docs/module",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/module.mdx",tags:[],version:"current",frontMatter:{title:"Modules"},sidebar:"docs",previous:{title:"Logging",permalink:"/docs/log"},next:{title:"Pipelines",permalink:"/docs/pipeline"}},c=[{value:"Installation",id:"installation",children:[]},{value:"CommonJS requires",id:"commonjs-requires",children:[{value:"Module interoperability",id:"module-interoperability",children:[]},{value:"Generic types",id:"generic-types",children:[]}]},{value:"ECMAScript module loaders",id:"ecmascript-module-loaders",children:[]},{value:"Supported file types",id:"supported-file-types",children:[{value:"TypeScript",id:"typescript",children:[]}]}],k={toc:c};function h(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},k,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)(l.Z,{backend:!0,tooling:!0,api:"/api/module",mdxType:"EnvBadges"}),(0,o.kt)("p",null,"Load and resolve custom file types at runtime with a Node.js ",(0,o.kt)("inlineCode",{parentName:"p"},"require")," replacement or\nnext-generation ",(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/api/esm.html#esm_loaders"},"loaders"),". Currently supports\nTypeScript for ",(0,o.kt)("inlineCode",{parentName:"p"},".ts")," and ",(0,o.kt)("inlineCode",{parentName:"p"},".tsx")," files."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,o.kt)(p.Z,{value:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/module\n"))),(0,o.kt)(p.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/module\n")))),(0,o.kt)("h2",{id:"commonjs-requires"},"CommonJS requires"),(0,o.kt)("p",null,"Node.js's native ",(0,o.kt)("inlineCode",{parentName:"p"},"require()")," has historically only supported ",(0,o.kt)("inlineCode",{parentName:"p"},".js")," and ",(0,o.kt)("inlineCode",{parentName:"p"},".json")," files (and now ",(0,o.kt)("inlineCode",{parentName:"p"},".cjs"),"\ntoo). But what if we were able to require non-JavaScript files at runtime also? Like TypeScript?\nThis package does just that through a new function called ",(0,o.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,o.kt)("inlineCode",{parentName:"a"},"requireModule()")),"."),(0,o.kt)("p",null,"This function operates by patching the list of allowed file types/extensions in Node.js's module\nresolution. Begin by importing the function and importing\n",(0,o.kt)("a",{parentName:"p",href:"#supported-file-types"},"a supported file type"),"!"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { requireModule } from '@boost/module';\n\nconst result = requireModule('./some/non-js/file');\n")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"This function should only be used to import module-like files, like JavaScript and TypeScript. It\nshould ",(0,o.kt)("em",{parentName:"p"},"not")," be used for other file types, like JSON or YAML.")),(0,o.kt)("p",null,"If you'd prefer to ",(0,o.kt)("em",{parentName:"p"},"not")," use ",(0,o.kt)("inlineCode",{parentName:"p"},"requireModule()")," and still use native ",(0,o.kt)("inlineCode",{parentName:"p"},"require()"),", but also support\ncustom file types, you may do so by calling\n",(0,o.kt)("a",{parentName:"p",href:"/api/module/function/registerExtensions"},(0,o.kt)("inlineCode",{parentName:"a"},"registerExtensions()"))," at the top of your script or\napplication entry point."),(0,o.kt)("h3",{id:"module-interoperability"},"Module interoperability"),(0,o.kt)("p",null,"Unlike ",(0,o.kt)("inlineCode",{parentName:"p"},"require()")," which returns imported values as-is, ",(0,o.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,o.kt)("inlineCode",{parentName:"a"},"requireModule()"))," changes\nthe shape of the import to align with ECMAScript modules. We do this for interoperability and\nconsistency sake, so that the developer experience is the same for both systems."),(0,o.kt)("p",null,"So what does this mean exactly? The biggest change is that CommonJS default exports\n(",(0,o.kt)("inlineCode",{parentName:"p"},"module.exports"),") are now returned under a ",(0,o.kt)("inlineCode",{parentName:"p"},"default")," property, like so."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example.js"',title:'"example.js"'},"module.exports = 123;\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const value = require('./example'); // 123\nconst { default: value } = requireModule('./example'); // 123\n")),(0,o.kt)("p",null,"Another change is that CommonJS named exports (",(0,o.kt)("inlineCode",{parentName:"p"},"exports.<name>"),") are returned as properties in the\nimported object, as well as properties in an object on the ",(0,o.kt)("inlineCode",{parentName:"p"},"default")," property. This pattern exists\nto match Node.js >= v12.20 functionality."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example.js"',title:'"example.js"'},"exports.foo = 'abc';\nexports.bar = 123;\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const value = require('./example');\nvalue.foo; // abc\nvalue.bar; // 123\n\nconst value = requireModule('./example');\nvalue.foo; // abc\nvalue.bar; // 123\nvalue.foo === value.default.foo; // true\n")),(0,o.kt)("h3",{id:"generic-types"},"Generic types"),(0,o.kt)("p",null,"In TypeScript, the native ",(0,o.kt)("inlineCode",{parentName:"p"},"require()")," is typed to return ",(0,o.kt)("inlineCode",{parentName:"p"},"any"),", which isn't that ideal. However,\n",(0,o.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,o.kt)("inlineCode",{parentName:"a"},"requireModule()"))," can type both the default and named exports of a module via\ngenerics."),(0,o.kt)("p",null,"The 1st generic slot types the default export (",(0,o.kt)("inlineCode",{parentName:"p"},"module.exports")," for CJS and ",(0,o.kt)("inlineCode",{parentName:"p"},"export default")," for\nESM) under the returned ",(0,o.kt)("inlineCode",{parentName:"p"},"default")," property."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<string>('./example');\nresult.default; // string\n")),(0,o.kt)("p",null,"While the 2nd generic slot types named exports (",(0,o.kt)("inlineCode",{parentName:"p"},"exports.<name>")," for CJS and ",(0,o.kt)("inlineCode",{parentName:"p"},"export <name>")," for\nESM) under their respective property names."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<string, { foo: string; bar: number }>('./example');\nresult.foo; // string\nresult.bar; // number\nresult.default; // string\n")),(0,o.kt)("p",null,"For backwards compatibility with CommonJS (can't mix ",(0,o.kt)("inlineCode",{parentName:"p"},"module.exports")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"exports.<name>"),"), named\nexports are also encapsulated under the ",(0,o.kt)("inlineCode",{parentName:"p"},"default")," property. To type this correctly, pass ",(0,o.kt)("inlineCode",{parentName:"p"},"void")," for\nthe default generic, which passes the type through accordingly."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<void, { foo: string; bar: number }>('./example');\nresult.foo; // string\nresult.bar; // number\nresult.default.foo; // string\nresult.default.bar; // number\n")),(0,o.kt)("h2",{id:"ecmascript-module-loaders"},"ECMAScript module loaders"),(0,o.kt)("p",null,"Node.js supports an ",(0,o.kt)("em",{parentName:"p"},"experimental")," feature called\n",(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/api/esm.html#esm_loaders"},"ESM loaders"),", where non-JavaScript files can be\nloaded, parsed, and evaluated at runtime through Node.js's module system when using\n",(0,o.kt)("inlineCode",{parentName:"p"},"import"),"/",(0,o.kt)("inlineCode",{parentName:"p"},"export"),"."),(0,o.kt)("p",null,"To make use of loaders, the following requirements must be met."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Node.js >= v12.17"),(0,o.kt)("li",{parentName:"ul"},"Must use ",(0,o.kt)("inlineCode",{parentName:"li"},"import()")," or ",(0,o.kt)("inlineCode",{parentName:"li"},"import"),"/",(0,o.kt)("inlineCode",{parentName:"li"},"export")," syntax (no ",(0,o.kt)("inlineCode",{parentName:"li"},"require"),")"),(0,o.kt)("li",{parentName:"ul"},"Source files must be modules (",(0,o.kt)("inlineCode",{parentName:"li"},".mjs"),", ",(0,o.kt)("inlineCode",{parentName:"li"},".ts"),", etc)"),(0,o.kt)("li",{parentName:"ul"},"Imported files must have trailing file extensions")),(0,o.kt)("p",null,"If you meet all of these requirements, then you may run your Node.js script with\n",(0,o.kt)("inlineCode",{parentName:"p"},"--experimental-loader")," and a ",(0,o.kt)("a",{parentName:"p",href:"#supported-file-types"},"supported loader type"),", or the general loader\nthat supports ",(0,o.kt)("em",{parentName:"p"},"all")," file types (demonstrated below)."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"node --experimental-loader @boost/module/loader.mjs ./path/to/entry-point.mjs\n")),(0,o.kt)("p",null,"For example, with the loader above you can now import TypeScript files as if they were standard\nJavaScript!"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import defaultValue, { namedValue } from './some/file/written/in.ts';\n")),(0,o.kt)("h2",{id:"supported-file-types"},"Supported file types"),(0,o.kt)("h3",{id:"typescript"},"TypeScript"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," files are supported for ",(0,o.kt)("inlineCode",{parentName:"p"},".ts")," and ",(0,o.kt)("inlineCode",{parentName:"p"},".tsx")," file\nextensions. The TypeScript source code will be down-leveled according to the currently running\nNode.js version and its capabilities."),(0,o.kt)("p",null,"The TypeScript only ESM loader can be referenced with ",(0,o.kt)("inlineCode",{parentName:"p"},"@boost/module/loader/typescript.mjs"),"."))}h.isMDXComponent=!0}}]);