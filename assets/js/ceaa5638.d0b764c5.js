"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4168],{5318:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=s(n),d=r,f=c["".concat(p,".").concat(d)]||c[d]||m[d]||o;return n?a.createElement(f,i(i({ref:t},u),{},{components:n})):a.createElement(f,i({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},1016:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return l},toc:function(){return s}});var a=n(5773),r=n(808),o=(n(7378),n(5318)),i=["components"],l={},p=void 0,s=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Documentation",id:"documentation",level:2}],u={toc:s};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://travis-ci.org/milesj/boost"},(0,o.kt)("img",{parentName:"a",src:"https://travis-ci.org/milesj/boost.svg?branch=master",alt:"Build Status"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@boost/args"},(0,o.kt)("img",{parentName:"a",src:"https://badge.fury.io/js/%40boost%2Fargs.svg",alt:"npm version"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@boost/args"},(0,o.kt)("img",{parentName:"a",src:"https://david-dm.org/milesj/boost.svg?path=packages/args",alt:"npm deps"}))),(0,o.kt)("p",null,"A convention based argument parsing and formatting library, with strict validation checks. It ",(0,o.kt)("em",{parentName:"p"},"is\nnot")," a command line interface."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { parse } from '@boost/args';\n\ninterface Options {\n    help: boolean;\n    logLevel: 'info' | 'error' | 'warn';\n    version: boolean;\n}\n\nconst { command, errors, options, params, rest } = parse<Options>(process.argv.slice(2), {\n    commands: ['build', 'install', 'update'],\n    options: {\n        help: {\n            default: false,\n            description: 'Show a help menu',\n            type: 'boolean',\n            short: 'H',\n        },\n        logLevel: {\n            choices: ['info', 'error', 'warn'],\n            default: 'info',\n            description: 'Customize logging level',\n        },\n        version: {\n            default: false,\n            description: 'Show the version number',\n            type: 'boolean',\n            short: 'V',\n        },\n    },\n});\n")),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Commands and sub-commands: ",(0,o.kt)("inlineCode",{parentName:"li"},"cmd"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"cmd:sub")),(0,o.kt)("li",{parentName:"ul"},"Options (long and short) that set a value(s): ",(0,o.kt)("inlineCode",{parentName:"li"},"--foo value"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"--foo=value"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"-f value"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"-f=value"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Camel (preferred) or kebab cased option names."))),(0,o.kt)("li",{parentName:"ul"},"Flags (boolean options) that take no value: ",(0,o.kt)("inlineCode",{parentName:"li"},"--bar"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"-B"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"With implicit negation support: ",(0,o.kt)("inlineCode",{parentName:"li"},"--no-bar")))),(0,o.kt)("li",{parentName:"ul"},"Parameters that act as standalone values: ",(0,o.kt)("inlineCode",{parentName:"li"},"foo bar baz"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Can be marked as required."))),(0,o.kt)("li",{parentName:"ul"},"Rest arguments that are passed to subsequent scripts (aggregated after ",(0,o.kt)("inlineCode",{parentName:"li"},"--"),"): ",(0,o.kt)("inlineCode",{parentName:"li"},"foo -- bar")),(0,o.kt)("li",{parentName:"ul"},"Supports ",(0,o.kt)("inlineCode",{parentName:"li"},"string"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"number"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"boolean"),", and list based values, with the addition of:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Single value based on a list of possible choices."),(0,o.kt)("li",{parentName:"ul"},"Multiple values with optional arity count requirements."))),(0,o.kt)("li",{parentName:"ul"},"Group multiple short options under a single argument: ",(0,o.kt)("inlineCode",{parentName:"li"},"-fBp"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Increment a counter each time a short option is found in a group."))),(0,o.kt)("li",{parentName:"ul"},"Strict parser and validation checks, allowing for informative interfaces.",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Custom option and param validation for increased accuracy.")))),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"yarn add @boost/args\n")),(0,o.kt)("h2",{id:"documentation"},"Documentation"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://boostlib.dev/docs/args"},"https://boostlib.dev/docs/args")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://boostlib.dev/api/args"},"https://boostlib.dev/api/args"))))}m.isMDXComponent=!0}}]);