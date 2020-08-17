(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{81:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return p})),n.d(t,"default",(function(){return l}));var r=n(2),a=n(6),o=(n(0),n(85)),i={title:"Contract"},c={unversionedId:"common/contract",id:"common/contract",isDocsHomePage:!1,title:"Contract",description:"A Contract is an abstract class that implements the Optionable interface, which provides an",source:"@site/docs/common/contract.md",permalink:"/docs/common/contract",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/common/contract.md",sidebar:"docs",previous:{title:"Common utilities",permalink:"/docs/common"},next:{title:"Path",permalink:"/docs/common/path"}},p=[{value:"Required options",id:"required-options",children:[]},{value:"API",id:"api",children:[{value:"<code>blueprint</code>",id:"blueprint",children:[]},{value:"<code>configure</code>",id:"configure",children:[]}]}],s={rightToc:p};function l(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"A ",Object(o.b)("inlineCode",{parentName:"p"},"Contract")," is an abstract class that implements the ",Object(o.b)("inlineCode",{parentName:"p"},"Optionable")," interface, which provides an\noptions object layer, and is meant to be inherited from as a super class. All classes that extend\n",Object(o.b)("inlineCode",{parentName:"p"},"Contract")," accept an options object through the constructor, which is validated and built using\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/milesj/optimal"}),"optimal"),"."),Object(o.b)("p",null,"To start, extend ",Object(o.b)("inlineCode",{parentName:"p"},"Contract")," with a generic interface that represents the shape of the options\nobject. Next, implement the abstract ",Object(o.b)("inlineCode",{parentName:"p"},"Contract#blueprint()")," method, which is passed\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/milesj/optimal/blob/master/docs/predicates.md"}),"optimal predicates")," as an\nargument, and must return an\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/milesj/optimal/blob/master/docs/usage.md#blueprint"}),"optimal blueprint")," that\nmatches the generic interface."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { Contract, Blueprint, Predicates } from '@boost/common';\n\nexport interface AdapterOptions {\n  name?: string;\n  priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n  blueprint({ number, string }: Predicates): Blueprint<AdapterOptions> {\n    return {\n      name: string().notEmpty(),\n      priority: number().gte(0),\n    };\n  }\n}\n")),Object(o.b)("p",null,"When the class is instantiated, the provided values will be checked and validated using the\nblueprint. If invalid, an error will be thrown. Furthermore, the ",Object(o.b)("inlineCode",{parentName:"p"},"Contract#options")," property is\n",Object(o.b)("inlineCode",{parentName:"p"},"readonly"),", and will error when mutated."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"const adapter = new Adapter({\n  name: 'Boost',\n});\n\nconst { name } = adapter.options; // => Boost\n")),Object(o.b)("h2",{id:"required-options"},"Required options"),Object(o.b)("p",null,"By default, the options argument in the constructor is optional, and if your interface has a\nrequired property, it will not be bubbled up in TypeScript. To support this, the constructor will\nneed to be overridden so that the argument can be marked as non-optional."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"export interface AdapterOptions {\n  name: string;\n  priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n  constructor(options: AdapterOptions) {\n    super(options);\n  }\n\n  // ...\n}\n")),Object(o.b)("h2",{id:"api"},"API"),Object(o.b)("h3",{id:"blueprint"},Object(o.b)("inlineCode",{parentName:"h3"},"blueprint")),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},"Contract#blueprint(predicates: Predicates): Blueprint<T",">")),Object(o.b)("p",null,"Shape of the options object passed to the constructor or to ",Object(o.b)("inlineCode",{parentName:"p"},"Contract#configure()"),". Utilizes\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/milesj/optimal"}),"optimal")," for strict and thorough validation checks."),Object(o.b)("h3",{id:"configure"},Object(o.b)("inlineCode",{parentName:"h3"},"configure")),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},"Contract#configure(options?: Partial<T",">"," | ((options: Required<T",">",") => Partial<T",">",")):\nReadonly<Required<T",">",">")),Object(o.b)("p",null,"Use this method to modify the options object after instantiation. This method accepts a partial\nobject, or a function that receives the current full options object and must return a partial\nobject."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"adapter.configure({ name: 'Boost' });\n\nadapter.configure((prevOptions) => ({\n  nestedObject: {\n    ...prevOptions.nestedObject,\n    some: 'value',\n  },\n}));\n")))}l.isMDXComponent=!0},85:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),l=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=l(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),b=l(n),d=r,m=b["".concat(i,".").concat(d)]||b[d]||u[d]||o;return n?a.a.createElement(m,c(c({ref:t},s),{},{components:n})):a.a.createElement(m,c({ref:t},s))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);