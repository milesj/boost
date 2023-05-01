"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2415],{5318:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=s(n),m=a,f=c["".concat(u,".").concat(m)]||c[m]||d[m]||l;return n?r.createElement(f,o(o({ref:t},p),{},{components:n})):r.createElement(f,o({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=c;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},9798:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7378),a=n(8944),l="tabItem_wHwb";function o(e){var t=e.children,n=e.hidden,o=e.className;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(l,o),hidden:n},t)}},3337:function(e,t,n){n.d(t,{Z:function(){return f}});var r=n(5773),a=n(7378),l=n(8944),o=n(3457),i=n(5595),u=n(6457),s="tabList_J5MA",p="tabItem_l0OV";function d(e){var t=e.className,n=e.block,i=e.selectedValue,u=e.selectValue,s=e.tabValues,d=[],c=(0,o.o5)().blockElementScrollPositionUntilNextRender,m=function(e){var t=e.currentTarget,n=d.indexOf(t),r=s[n].value;r!==i&&(c(t),u(r))},f=function(e){var t,n=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":var r,a=d.indexOf(e.currentTarget)+1;n=null!=(r=d[a])?r:d[0];break;case"ArrowLeft":var l,o=d.indexOf(e.currentTarget)-1;n=null!=(l=d[o])?l:d[d.length-1]}null==(t=n)||t.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":n},t)},s.map((function(e){var t=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:function(e){return d.push(e)},onKeyDown:f,onClick:m},o,{className:(0,l.Z)("tabs__item",p,null==o?void 0:o.className,{"tabs__item--active":i===t})}),null!=n?n:t)})))}function c(e){var t=e.lazy,n=e.children,r=e.selectedValue,l=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){var o=l.find((function(e){return e.props.value===r}));return o?(0,a.cloneElement)(o,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},l.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r})})))}function m(e){var t=(0,i.Y)(e);return a.createElement("div",{className:(0,l.Z)("tabs-container",s)},a.createElement(d,(0,r.Z)({},e,t)),a.createElement(c,(0,r.Z)({},e,t)))}function f(e){var t=(0,u.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},5595:function(e,t,n){n.d(t,{Y:function(){return c}});var r=n(7378),a=n(5331),l=n(654),o=n(784),i=n(1819);function u(e){return function(e){var t,n;return null!=(t=null==(n=r.Children.map(e,(function(e){if(!e||(0,r.isValidElement)(e)&&(t=e.props)&&"object"==typeof t&&"value"in t)return e;var t;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:n.filter(Boolean))?t:[]}(e).map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes,default:t.default}}))}function s(e){var t=e.values,n=e.children;return(0,r.useMemo)((function(){var e=null!=t?t:u(n);return function(e){var t=(0,o.l)(e,(function(e,t){return e.value===t.value}));if(t.length>0)throw new Error('Docusaurus error: Duplicate values "'+t.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[t,n])}function p(e){var t=e.value;return e.tabValues.some((function(e){return e.value===t}))}function d(e){var t=e.queryString,n=void 0!==t&&t,o=e.groupId,i=(0,a.k6)(),u=function(e){var t=e.queryString,n=void 0!==t&&t,r=e.groupId;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=r?r:null}({queryString:n,groupId:o});return[(0,l._X)(u),(0,r.useCallback)((function(e){if(u){var t=new URLSearchParams(i.location.search);t.set(u,e),i.replace(Object.assign({},i.location,{search:t.toString()}))}}),[u,i])]}function c(e){var t,n,a,l,o=e.defaultValue,u=e.queryString,c=void 0!==u&&u,m=e.groupId,f=s(e),h=(0,r.useState)((function(){return function(e){var t,n=e.defaultValue,r=e.tabValues;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:r}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+n+'" but none of its children has the corresponding value. Available values are: '+r.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return n}var a=null!=(t=r.find((function(e){return e.default})))?t:r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:o,tabValues:f})})),k=h[0],y=h[1],v=d({queryString:c,groupId:m}),b=v[0],g=v[1],N=(t=function(e){return e?"docusaurus.tab."+e:null}({groupId:m}.groupId),n=(0,i.Nk)(t),a=n[0],l=n[1],[a,(0,r.useCallback)((function(e){t&&l.set(e)}),[t,l])]),w=N[0],x=N[1],C=function(){var e=null!=b?b:w;return p({value:e,tabValues:f})?e:null}();return(0,r.useLayoutEffect)((function(){C&&y(C)}),[C]),{selectedValue:k,selectValue:(0,r.useCallback)((function(e){if(!p({value:e,tabValues:f}))throw new Error("Can't select invalid tab value="+e);y(e),g(e),x(e)}),[g,x,f]),tabValues:f}}},297:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7378);function a(e){var t=e.children,n=e.type;return r.createElement("span",{className:"badge badge--"+n},t)}},2723:function(e,t,n){n.d(t,{Z:function(){return p}});var r=n(7378),a=n(1884),l=n(6125),o=n(297),i="badgeGroup_syf7",u="apiLink_JWAN";function s(e){var t=e.children;return r.createElement("span",{className:i},t)}function p(e){var t=e.api,n=e.backend,i=e.frontend,p=e.tooling;return r.createElement(r.Fragment,null,t&&r.createElement(a.default,{className:u,to:t},"API ",r.createElement(l.Z,null)),r.createElement(s,null,n&&r.createElement(o.Z,{type:"warning"},"Backend"),i&&r.createElement(o.Z,{type:"success"},"Frontend"),p&&r.createElement(o.Z,{type:"primary"},"Tooling")))}},2369:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return d},default:function(){return k},frontMatter:function(){return p},metadata:function(){return c},toc:function(){return f}});var r=n(5773),a=n(808),l=(n(7378),n(5318)),o=n(2723),i=n(3337),u=n(9798),s=["components"],p={title:"Modules"},d=void 0,c={unversionedId:"module",id:"module",title:"Modules",description:"Load and resolve custom file types at runtime with a Node.js require replacement or",source:"@site/docs/module.mdx",sourceDirName:".",slug:"/module",permalink:"/docs/module",draft:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/module.mdx",tags:[],version:"current",frontMatter:{title:"Modules"},sidebar:"docs",previous:{title:"Logging",permalink:"/docs/log"},next:{title:"Pipelines",permalink:"/docs/pipeline"}},m={},f=[{value:"Installation",id:"installation",level:2},{value:"CommonJS requires",id:"commonjs-requires",level:2},{value:"Module interoperability",id:"module-interoperability",level:3},{value:"Generic types",id:"generic-types",level:3},{value:"ECMAScript module loaders",id:"ecmascript-module-loaders",level:2},{value:"Supported file types",id:"supported-file-types",level:2},{value:"TypeScript",id:"typescript",level:3}],h={toc:f};function k(e){var t=e.components,n=(0,a.Z)(e,s);return(0,l.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(o.Z,{backend:!0,tooling:!0,api:"/api/module",mdxType:"EnvBadges"}),(0,l.kt)("p",null,"Load and resolve custom file types at runtime with a Node.js ",(0,l.kt)("inlineCode",{parentName:"p"},"require")," replacement or\nnext-generation ",(0,l.kt)("a",{parentName:"p",href:"https://nodejs.org/api/esm.html#esm_loaders"},"loaders"),". Currently supports\nTypeScript for ",(0,l.kt)("inlineCode",{parentName:"p"},".ts")," and ",(0,l.kt)("inlineCode",{parentName:"p"},".tsx")," files."),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,l.kt)(u.Z,{value:"yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/module\n"))),(0,l.kt)(u.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/module\n")))),(0,l.kt)("h2",{id:"commonjs-requires"},"CommonJS requires"),(0,l.kt)("p",null,"Node.js's native ",(0,l.kt)("inlineCode",{parentName:"p"},"require()")," has historically only supported ",(0,l.kt)("inlineCode",{parentName:"p"},".js")," and ",(0,l.kt)("inlineCode",{parentName:"p"},".json")," files (and now ",(0,l.kt)("inlineCode",{parentName:"p"},".cjs"),"\ntoo). But what if we were able to require non-JavaScript files at runtime also? Like TypeScript?\nThis package does just that through a new function called ",(0,l.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,l.kt)("inlineCode",{parentName:"a"},"requireModule()")),"."),(0,l.kt)("p",null,"This function operates by patching the list of allowed file types/extensions in Node.js's module\nresolution. Begin by importing the function and importing\n",(0,l.kt)("a",{parentName:"p",href:"#supported-file-types"},"a supported file type"),"!"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { requireModule } from '@boost/module';\n\nconst result = requireModule('./some/non-js/file');\n")),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"This function should only be used to import module-like files, like JavaScript and TypeScript. It\nshould ",(0,l.kt)("em",{parentName:"p"},"not")," be used for other file types, like JSON or YAML.")),(0,l.kt)("p",null,"If you'd prefer to ",(0,l.kt)("em",{parentName:"p"},"not")," use ",(0,l.kt)("inlineCode",{parentName:"p"},"requireModule()")," and still use native ",(0,l.kt)("inlineCode",{parentName:"p"},"require()"),", but also support\ncustom file types, you may do so by calling\n",(0,l.kt)("a",{parentName:"p",href:"/api/module/function/registerExtensions"},(0,l.kt)("inlineCode",{parentName:"a"},"registerExtensions()"))," at the top of your script or\napplication entry point."),(0,l.kt)("h3",{id:"module-interoperability"},"Module interoperability"),(0,l.kt)("p",null,"Unlike ",(0,l.kt)("inlineCode",{parentName:"p"},"require()")," which returns imported values as-is, ",(0,l.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,l.kt)("inlineCode",{parentName:"a"},"requireModule()"))," changes\nthe shape of the import to align with ECMAScript modules. We do this for interoperability and\nconsistency sake, so that the developer experience is the same for both systems."),(0,l.kt)("p",null,"So what does this mean exactly? The biggest change is that CommonJS default exports\n(",(0,l.kt)("inlineCode",{parentName:"p"},"module.exports"),") are now returned under a ",(0,l.kt)("inlineCode",{parentName:"p"},"default")," property, like so."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example.js"',title:'"example.js"'},"module.exports = 123;\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const value = require('./example'); // 123\nconst { default: value } = requireModule('./example'); // 123\n")),(0,l.kt)("p",null,"Another change is that CommonJS named exports (",(0,l.kt)("inlineCode",{parentName:"p"},"exports.<name>"),") are returned as properties in the\nimported object, as well as properties in an object on the ",(0,l.kt)("inlineCode",{parentName:"p"},"default")," property. This pattern exists\nto match Node.js >= v12.20 functionality."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example.js"',title:'"example.js"'},"exports.foo = 'abc';\nexports.bar = 123;\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const value = require('./example');\nvalue.foo; // abc\nvalue.bar; // 123\n\nconst value = requireModule('./example');\nvalue.foo; // abc\nvalue.bar; // 123\nvalue.foo === value.default.foo; // true\n")),(0,l.kt)("h3",{id:"generic-types"},"Generic types"),(0,l.kt)("p",null,"In TypeScript, the native ",(0,l.kt)("inlineCode",{parentName:"p"},"require()")," is typed to return ",(0,l.kt)("inlineCode",{parentName:"p"},"any"),", which isn't that ideal. However,\n",(0,l.kt)("a",{parentName:"p",href:"/api/module/function/requireModule"},(0,l.kt)("inlineCode",{parentName:"a"},"requireModule()"))," can type both the default and named exports of a module via\ngenerics."),(0,l.kt)("p",null,"The 1st generic slot types the default export (",(0,l.kt)("inlineCode",{parentName:"p"},"module.exports")," for CJS and ",(0,l.kt)("inlineCode",{parentName:"p"},"export default")," for\nESM) under the returned ",(0,l.kt)("inlineCode",{parentName:"p"},"default")," property."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<string>('./example');\nresult.default; // string\n")),(0,l.kt)("p",null,"While the 2nd generic slot types named exports (",(0,l.kt)("inlineCode",{parentName:"p"},"exports.<name>")," for CJS and ",(0,l.kt)("inlineCode",{parentName:"p"},"export <name>")," for\nESM) under their respective property names."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<string, { foo: string; bar: number }>('./example');\nresult.foo; // string\nresult.bar; // number\nresult.default; // string\n")),(0,l.kt)("p",null,"For backwards compatibility with CommonJS (can't mix ",(0,l.kt)("inlineCode",{parentName:"p"},"module.exports")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"exports.<name>"),"), named\nexports are also encapsulated under the ",(0,l.kt)("inlineCode",{parentName:"p"},"default")," property. To type this correctly, pass ",(0,l.kt)("inlineCode",{parentName:"p"},"void")," for\nthe default generic, which passes the type through accordingly."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const result = requireModule<void, { foo: string; bar: number }>('./example');\nresult.foo; // string\nresult.bar; // number\nresult.default.foo; // string\nresult.default.bar; // number\n")),(0,l.kt)("h2",{id:"ecmascript-module-loaders"},"ECMAScript module loaders"),(0,l.kt)("p",null,"Node.js supports an ",(0,l.kt)("em",{parentName:"p"},"experimental")," feature called\n",(0,l.kt)("a",{parentName:"p",href:"https://nodejs.org/api/esm.html#esm_loaders"},"ESM loaders"),", where non-JavaScript files can be\nloaded, parsed, and evaluated at runtime through Node.js's module system when using\n",(0,l.kt)("inlineCode",{parentName:"p"},"import"),"/",(0,l.kt)("inlineCode",{parentName:"p"},"export"),"."),(0,l.kt)("p",null,"To make use of loaders, the following requirements must be met."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Node.js >= v12.17"),(0,l.kt)("li",{parentName:"ul"},"Must use ",(0,l.kt)("inlineCode",{parentName:"li"},"import()")," or ",(0,l.kt)("inlineCode",{parentName:"li"},"import"),"/",(0,l.kt)("inlineCode",{parentName:"li"},"export")," syntax (no ",(0,l.kt)("inlineCode",{parentName:"li"},"require"),")"),(0,l.kt)("li",{parentName:"ul"},"Source files must be modules (",(0,l.kt)("inlineCode",{parentName:"li"},".mjs"),", ",(0,l.kt)("inlineCode",{parentName:"li"},".ts"),", etc)"),(0,l.kt)("li",{parentName:"ul"},"Imported files must have trailing file extensions")),(0,l.kt)("p",null,"If you meet all of these requirements, then you may run your Node.js script with\n",(0,l.kt)("inlineCode",{parentName:"p"},"--experimental-loader")," and a ",(0,l.kt)("a",{parentName:"p",href:"#supported-file-types"},"supported loader type"),", or the general loader\nthat supports ",(0,l.kt)("em",{parentName:"p"},"all")," file types (demonstrated below)."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"node --experimental-loader @boost/module/loader ./path/to/entry-point.mjs\n")),(0,l.kt)("p",null,"For example, with the loader above you can now import TypeScript files as if they were standard\nJavaScript!"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import defaultValue, { namedValue } from './some/file/written/in.ts';\n")),(0,l.kt)("h2",{id:"supported-file-types"},"Supported file types"),(0,l.kt)("h3",{id:"typescript"},"TypeScript"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," files are supported for ",(0,l.kt)("inlineCode",{parentName:"p"},".ts")," and ",(0,l.kt)("inlineCode",{parentName:"p"},".tsx")," file\nextensions. The TypeScript source code will be down-leveled according to the currently running\nNode.js version and its capabilities."),(0,l.kt)("p",null,"The TypeScript only ESM loader can be referenced with ",(0,l.kt)("inlineCode",{parentName:"p"},"@boost/module/loader-typescript"),"."))}k.isMDXComponent=!0}}]);