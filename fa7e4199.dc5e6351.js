(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{101:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return p})),n.d(t,"default",(function(){return l}));var r=n(3),o=n(7),a=(n(0),n(106)),i={title:"Contract"},c={unversionedId:"common/contract",id:"common/contract",isDocsHomePage:!1,title:"Contract",description:"A Contract is an abstract class that implements the Optionable interface, which provides an",source:"@site/docs/common/contract.md",slug:"/common/contract",permalink:"/docs/common/contract",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/common/contract.md",version:"current",sidebar:"docs",previous:{title:"Common utilities",permalink:"/docs/common"},next:{title:"PackageGraph",permalink:"/docs/common/package-graph"}},p=[{value:"Required options",id:"required-options",children:[]},{value:"API",id:"api",children:[{value:"<code>blueprint</code>",id:"blueprint",children:[]},{value:"<code>configure</code>",id:"configure",children:[]}]}],s={toc:p};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"A ",Object(a.b)("inlineCode",{parentName:"p"},"Contract")," is an abstract class that implements the ",Object(a.b)("inlineCode",{parentName:"p"},"Optionable")," interface, which provides an\noptions object layer, and is meant to be inherited from as a super class. All classes that extend\n",Object(a.b)("inlineCode",{parentName:"p"},"Contract")," accept an options object through the constructor, which is validated and built using\n",Object(a.b)("a",{parentName:"p",href:"https://github.com/milesj/optimal"},"optimal"),"."),Object(a.b)("p",null,"To start, extend ",Object(a.b)("inlineCode",{parentName:"p"},"Contract")," with a generic interface that represents the shape of the options\nobject. Next, implement the abstract ",Object(a.b)("inlineCode",{parentName:"p"},"Contract#blueprint()")," method, which is passed\n",Object(a.b)("a",{parentName:"p",href:"https://github.com/milesj/optimal/blob/master/docs/predicates.md"},"optimal predicates")," as an\nargument, and must return an\n",Object(a.b)("a",{parentName:"p",href:"https://github.com/milesj/optimal/blob/master/docs/usage.md#blueprint"},"optimal blueprint")," that\nmatches the generic interface."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-ts"},"import { Contract, Blueprint, Predicates } from '@boost/common';\n\nexport interface AdapterOptions {\n    name?: string;\n    priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n    blueprint({ number, string }: Predicates): Blueprint<AdapterOptions> {\n        return {\n            name: string().notEmpty(),\n            priority: number().gte(0),\n        };\n    }\n}\n")),Object(a.b)("p",null,"When the class is instantiated, the provided values will be checked and validated using the\nblueprint. If invalid, an error will be thrown. Furthermore, the ",Object(a.b)("inlineCode",{parentName:"p"},"Contract#options")," property is\n",Object(a.b)("inlineCode",{parentName:"p"},"readonly"),", and will error when mutated."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-ts"},"const adapter = new Adapter({\n    name: 'Boost',\n});\n\nconst { name } = adapter.options; // => Boost\n")),Object(a.b)("h2",{id:"required-options"},"Required options"),Object(a.b)("p",null,"By default, the options argument in the constructor is optional, and if your interface has a\nrequired property, it will not be bubbled up in TypeScript. To support this, the constructor will\nneed to be overridden so that the argument can be marked as non-optional."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-ts"},"export interface AdapterOptions {\n    name: string;\n    priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n    constructor(options: AdapterOptions) {\n        super(options);\n    }\n\n    // ...\n}\n")),Object(a.b)("h2",{id:"api"},"API"),Object(a.b)("h3",{id:"blueprint"},Object(a.b)("inlineCode",{parentName:"h3"},"blueprint")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"Contract#blueprint(predicates: Predicates, onConstruction: boolean): Blueprint<T",">")),Object(a.b)("p",null,"Shape of the options object passed to the constructor or to ",Object(a.b)("inlineCode",{parentName:"p"},"Contract#configure()"),". Utilizes\n",Object(a.b)("a",{parentName:"p",href:"https://github.com/milesj/optimal"},"optimal")," for strict and thorough validation checks."),Object(a.b)("p",null,"A boolean is passed as the 2nd argument to determine whether this is validating on class\ninstantiation (first time), or by calling ",Object(a.b)("inlineCode",{parentName:"p"},"configure()")," (all other times)."),Object(a.b)("h3",{id:"configure"},Object(a.b)("inlineCode",{parentName:"h3"},"configure")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"Contract#configure(options?: Partial<T",">"," | ((options: Required<T",">",") => Partial<T",">",")):\nReadonly<Required<T",">",">")),Object(a.b)("p",null,"Use this method to modify the options object after instantiation. This method accepts a partial\nobject, or a function that receives the current full options object and must return a partial\nobject."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-ts"},"adapter.configure({ name: 'Boost' });\n\nadapter.configure((prevOptions) => ({\n    nestedObject: {\n        ...prevOptions.nestedObject,\n        some: 'value',\n    },\n}));\n")))}l.isMDXComponent=!0},106:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=o.a.createContext({}),l=function(e){var t=o.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return o.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=l(n),d=r,m=u["".concat(i,".").concat(d)]||u[d]||b[d]||a;return n?o.a.createElement(m,c(c({ref:t},s),{},{components:n})):o.a.createElement(m,c({ref:t},s))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var s=2;s<a;s++)i[s]=n[s];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);