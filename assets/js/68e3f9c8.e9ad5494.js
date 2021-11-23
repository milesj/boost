"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7062],{5318:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return m}});var a=t(7378);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(t),m=o,f=c["".concat(s,".").concat(m)]||c[m]||d[m]||r;return t?a.createElement(f,i(i({ref:n},u),{},{components:t})):a.createElement(f,i({ref:n},u))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,i=new Array(r);i[0]=c;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<r;p++)i[p]=t[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},8458:function(e,n,t){t.d(n,{Z:function(){return r}});var a=t(7378),o="iconExternalLink_pqex",r=function(e){var n=e.width,t=void 0===n?13.5:n,r=e.height,i=void 0===r?13.5:r;return a.createElement("svg",{width:t,height:i,"aria-hidden":"true",viewBox:"0 0 24 24",className:o},a.createElement("path",{fill:"currentColor",d:"M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"}))}},517:function(e,n,t){var a=t(7378);n.Z=function(e){var n=e.children,t=e.hidden,o=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:o},n)}},2120:function(e,n,t){t.d(n,{Z:function(){return c}});var a=t(5773),o=t(7378),r=t(6457),i=t(4956);var l=function(){var e=(0,o.useContext)(i.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=t(1202),p=t(8944),u="tabItem_c0e5";function d(e){var n,t,a,r=e.lazy,i=e.block,d=e.defaultValue,c=e.values,m=e.groupId,f=e.className,g=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=c?c:g.map((function(e){var n=e.props;return{value:n.value,label:n.label}})),k=(0,s.duplicates)(h,(function(e,n){return e.value===n.value}));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===d?d:null!=(n=null!=d?d:null==(t=g.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(a=g[0])?void 0:a.props.value;if(null!==b&&!h.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var N=l(),v=N.tabGroupChoices,C=N.setTabGroupChoices,y=(0,o.useState)(b),w=y[0],x=y[1],j=[],T=(0,s.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=m){var F=v[m];null!=F&&F!==w&&h.some((function(e){return e.value===F}))&&x(F)}var E=function(e){var n=e.currentTarget,t=j.indexOf(n),a=h[t].value;a!==w&&(T(n),x(a),null!=m&&C(m,a))},P=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=j.indexOf(e.currentTarget)+1;t=j[a]||j[0];break;case"ArrowLeft":var o=j.indexOf(e.currentTarget)-1;t=j[o]||j[j.length-1]}null==(n=t)||n.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,p.Z)("tabs",{"tabs--block":i},f)},h.map((function(e){var n=e.value,t=e.label;return o.createElement("li",{role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,className:(0,p.Z)("tabs__item",u,{"tabs__item--active":w===n}),key:n,ref:function(e){return j.push(e)},onKeyDown:P,onFocus:E,onClick:E},null!=t?t:n)}))),r?(0,o.cloneElement)(g.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},g.map((function(e,n){return(0,o.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function c(e){var n=(0,r.Z)();return o.createElement(d,(0,a.Z)({key:String(n)},e))}},4956:function(e,n,t){var a=(0,t(7378).createContext)(void 0);n.Z=a},297:function(e,n,t){t.d(n,{Z:function(){return o}});var a=t(7378);function o(e){var n=e.children,t=e.type;return a.createElement("span",{className:"badge badge--"+t},n)}},2723:function(e,n,t){t.d(n,{Z:function(){return u}});var a=t(7378),o=t(1884),r=t(8458),i=t(297),l="badgeGroup_2HOO",s="apiLink_32Vk";function p(e){var n=e.children;return a.createElement("span",{className:l},n)}function u(e){var n=e.api,t=e.backend,l=e.frontend,u=e.tooling;return a.createElement(a.Fragment,null,n&&a.createElement(o.default,{className:s,to:n},"API ",a.createElement(r.Z,null)),a.createElement(p,null,t&&a.createElement(i.Z,{type:"warning"},"Backend"),l&&a.createElement(i.Z,{type:"success"},"Frontend"),u&&a.createElement(i.Z,{type:"primary"},"Tooling")))}},9890:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return d},metadata:function(){return c},toc:function(){return m},default:function(){return g}});var a=t(5773),o=t(808),r=(t(7378),t(5318)),i=t(2723),l=t(2120),s=t(517),p=["components"],u={title:"Configuration"},d=void 0,c={unversionedId:"config",id:"config",isDocsHomePage:!1,title:"Configuration",description:"Powerful convention based finder, loader, and manager of both configuration and ignore files. Will",source:"@site/docs/config.mdx",sourceDirName:".",slug:"/config",permalink:"/docs/config",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/config.mdx",tags:[],version:"current",frontMatter:{title:"Configuration"},sidebar:"docs",previous:{title:"Common utilities",permalink:"/docs/common"},next:{title:"Crash reporting",permalink:"/docs/crash"}},m=[{value:"Installation",id:"installation",children:[],level:2},{value:"Setup",id:"setup",children:[{value:"Finder options",id:"finder-options",children:[],level:3},{value:"Processor options",id:"processor-options",children:[],level:3},{value:"Processing settings",id:"processing-settings",children:[],level:3}],level:2},{value:"Config files",id:"config-files",children:[{value:"File patterns",id:"file-patterns",children:[],level:3},{value:"File formats",id:"file-formats",children:[],level:3},{value:"Loading config files",id:"loading-config-files",children:[{value:"Lookup resolution",id:"lookup-resolution",children:[],level:4},{value:"From root",id:"from-root",children:[],level:4},{value:"From branch",id:"from-branch",children:[],level:4}],level:3},{value:"Enable extending",id:"enable-extending",children:[{value:"Presets",id:"presets",children:[],level:4}],level:3},{value:"Enable overrides",id:"enable-overrides",children:[],level:3}],level:2},{value:"Ignore files",id:"ignore-files",children:[{value:"File patterns",id:"file-patterns-1",children:[],level:3},{value:"Loading ignore files",id:"loading-ignore-files",children:[{value:"From root",id:"from-root-1",children:[],level:4},{value:"From branch",id:"from-branch-1",children:[],level:4}],level:3}],level:2}],f={toc:m};function g(e){var n=e.components,t=(0,o.Z)(e,p);return(0,r.kt)("wrapper",(0,a.Z)({},f,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)(i.Z,{backend:!0,tooling:!0,api:"/api/config",mdxType:"EnvBadges"}),(0,r.kt)("p",null,"Powerful convention based finder, loader, and manager of both configuration and ignore files. Will\nfind config files of multiple supported formats while traversing up the tree."),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)(l.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"yarn",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/config\n"))),(0,r.kt)(s.Z,{value:"npm",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/config\n")))),(0,r.kt)("h2",{id:"setup"},"Setup"),(0,r.kt)("p",null,"Configuration in the context of this package encompasses 2 concepts: config files and ignore files.\nConfig files are a collection of settings (key-value pairs), while ignore files are a list of file\npath patterns and globs."),(0,r.kt)("p",null,"To utilize this functionality, we must extend the ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration"))," class, and define\na blueprint for the structure of our config file (using ",(0,r.kt)("a",{parentName:"p",href:"/docs/common#class-contracts"},"optimal"),").\nThis class will fulfill multiple roles: managing, finding, loading, and processing of files."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Blueprint, Schemas } from '@boost/common';\nimport { Configuration } from '@boost/config';\n\n// Example structure\ninterface ConfigFile {\n    ast?: boolean;\n    cwd?: string;\n    debug?: boolean;\n    exclude?: string[];\n    include?: string[];\n    options?: object;\n}\n\nclass Manager extends Configuration<ConfigFile> {\n    blueprint({ array, bool, string, object }: Schemas): Blueprint<ConfigFile> {\n        return {\n            ast: bool(),\n            cwd: string(process.cwd()),\n            debug: bool(),\n            exclude: array().of(string()),\n            include: array().of(string()),\n            options: object(),\n        };\n    }\n}\n")),(0,r.kt)("p",null,'This class layer is designed to be "internal only", and should not be utilized by consumers\ndirectly. Instead, consumers should interact with an instance of the class, like so.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"export default new Manager('boost');\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"The string value passed to the constructor is the name of the config and ignore files, in camel\ncase format. For example, ",(0,r.kt)("inlineCode",{parentName:"p"},"boost.js")," and ",(0,r.kt)("inlineCode",{parentName:"p"},".boostignore"),".")),(0,r.kt)("h3",{id:"finder-options"},"Finder options"),(0,r.kt)("p",null,"To customize the config file finding and loading layer, call\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#configureFinder"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#configureFinder()"))," within\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#bootstrap"},(0,r.kt)("inlineCode",{parentName:"a"},"#bootstrap()")),". This method supports all options in\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/interface/ConfigFinderOptions"},(0,r.kt)("inlineCode",{parentName:"a"},"ConfigFinderOptions"))," except for ",(0,r.kt)("inlineCode",{parentName:"p"},"name"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            extendsSetting: 'extends',\n            includeEnv: false,\n        });\n    }\n}\n")),(0,r.kt)("h3",{id:"processor-options"},"Processor options"),(0,r.kt)("p",null,"To customize the config processing layer, call\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#configureProcessor"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#configureProcessor()"))," while\nwithin ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#bootstrap"},(0,r.kt)("inlineCode",{parentName:"a"},"#bootstrap()")),". This method supports all options\nin ",(0,r.kt)("a",{parentName:"p",href:"/api/config/interface/ProcessorOptions"},(0,r.kt)("inlineCode",{parentName:"a"},"ProcessorOptions"))," except for ",(0,r.kt)("inlineCode",{parentName:"p"},"name"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureProcessor({\n            defaultWhenUndefined: false,\n        });\n    }\n}\n")),(0,r.kt)("h3",{id:"processing-settings"},"Processing settings"),(0,r.kt)("p",null,"When multiple config files are merged into a single config file, this is known as processing.\nProcessing happens automatically for each setting as we need to determine what the next setting\nvalue would be. By default, the following rules apply when the next and previous setting values are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("em",{parentName:"li"},"Arrays"),": will be merged and deduped into a new array."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("em",{parentName:"li"},"Objects"),": will be shallow merged (using spread) into a new object."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("em",{parentName:"li"},"Primitives"),": next value will overwrite the previous value."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("em",{parentName:"li"},"Undefined"),": will reset to initial value if\n",(0,r.kt)("a",{parentName:"li",href:"/api/config/interface/ProcessorOptions#defaultWhenUndefined"},(0,r.kt)("inlineCode",{parentName:"a"},"defaultWhenUndefined"))," is true.")),(0,r.kt)("p",null,"If you would like to customize this process, you can define custom process handlers per setting with\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#addProcessHandler"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#addProcessHandler()")),". This\nmethod requires a setting name and handler function (which is passed the previous and next values)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        // Always use forward slashes\n        this.addProcessHandler('cwd', (prev, next) => next.replace(/\\\\/g, '/'));\n\n        // Deep merge options since they're dynamic\n        this.addProcessHandler('options', (prev, next) => deepMerge(prev, next));\n    }\n}\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Handlers may only be defined on root-level settings.")),(0,r.kt)("p",null,"To make this process even easier, we provide a handful of pre-defined handlers (below) that can be\nused for common scenarios (these handlers power the default rules mentioned above)."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/api/config/function/mergeArray"},(0,r.kt)("inlineCode",{parentName:"a"},"mergeArray"))," - Merges previous and next arrays into a new array\nwhile removing duplicates (using ",(0,r.kt)("inlineCode",{parentName:"li"},"Set"),")."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/api/config/function/mergeExtends"},(0,r.kt)("inlineCode",{parentName:"a"},"mergeExtends"))," - Merges previous and next file paths (either\na string or array of strings) into a new list of file paths. This is useful if utilizing\n",(0,r.kt)("a",{parentName:"li",href:"#enable-extending"},"config extending"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/api/config/function/mergeObject"},(0,r.kt)("inlineCode",{parentName:"a"},"mergeObject"))," - Shallow merges previous and next objects into\na new object using object spread."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/api/config/function/mergePlugins"},(0,r.kt)("inlineCode",{parentName:"a"},"mergePlugins"))," - Merges previous and next plugin\nconfigurations into an object. Plugin configs can either be a list of sources, or list of sources\nwith flags/options (tuples), or a map of sources to flags/options. This is useful if utilizing the\n",(0,r.kt)("a",{parentName:"li",href:"/docs/plugin#configuration-files"},"plugin package"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/api/config/function/overwrite"},(0,r.kt)("inlineCode",{parentName:"a"},"overwrite"))," - Overwrite the previous value with the next value.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { mergePlugins } from '@boost/config';\n\nclass Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        // Using example from @boost/plugin documentation\n        this.addProcessHandler('renderers', mergePlugins);\n    }\n}\n")),(0,r.kt)("h2",{id:"config-files"},"Config files"),(0,r.kt)("p",null,"A config file is a file that explicitly defines settings (key-value pairs) according to a defined\nstructure."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Configuration files are designed to be serializable, so please use primitive, object, and array\nvalues only. Try to avoid non-serializable values like class instances.")),(0,r.kt)("h3",{id:"file-patterns"},"File patterns"),(0,r.kt)("p",null,"Config files are grouped into either the root or branch category. Root config files are located in a\n",(0,r.kt)("inlineCode",{parentName:"p"},".config")," folder in the root of a project (denoted by the current working directory). Branch config\nfiles are located within folders (at any depth) below the root, and are prefixed with a leading dot\n(",(0,r.kt)("inlineCode",{parentName:"p"},"."),")."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Root"),(0,r.kt)("th",{parentName:"tr",align:null},"Branch"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".config/<name>.<ext>")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".<name>.<ext>"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".config/<name>.<env>.<ext>")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".<name>.<env>.<ext>"))))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"<name>")," - Name passed to your ",(0,r.kt)("a",{parentName:"li",href:"/api/config/class/Configuration"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration"))," instance (in camel case)."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"<env>")," - Current environment derived from ",(0,r.kt)("inlineCode",{parentName:"li"},"NODE_ENV"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"<ext>")," - File extension supported by the defined ",(0,r.kt)("a",{parentName:"li",href:"#finder-options"},"loaders and extensions"),".")),(0,r.kt)("h3",{id:"file-formats"},"File formats"),(0,r.kt)("p",null,"Config files can be written in the formats below, and are listed in the order in which they're\nresolved (can customize with the ",(0,r.kt)("a",{parentName:"p",href:"#finder-options"},(0,r.kt)("inlineCode",{parentName:"a"},"extensions"))," option)."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".js")," - JavaScript. Will load with ",(0,r.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"CommonJS or ECMAScript modules")," depending on the\n",(0,r.kt)("inlineCode",{parentName:"li"},"package.json")," ",(0,r.kt)("inlineCode",{parentName:"li"},"type")," field. Defaults to CommonJS if not defined."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".json"),", ",(0,r.kt)("inlineCode",{parentName:"li"},".json5")," - JSON. Supports ",(0,r.kt)("a",{parentName:"li",href:"https://json5.org/"},"JSON5")," for both extensions."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".cjs")," - JavaScript using ",(0,r.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"CommonJS")," (",(0,r.kt)("inlineCode",{parentName:"li"},"require()"),"). ",(0,r.kt)("em",{parentName:"li"},"Supported by all Node.js versions.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".mjs")," - JavaScript using ",(0,r.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"ECMAScript modules")," (",(0,r.kt)("inlineCode",{parentName:"li"},"import"),"/",(0,r.kt)("inlineCode",{parentName:"li"},"export"),"). ",(0,r.kt)("em",{parentName:"li"},"Requires Node.js\nv13.3+.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".ts")," - TypeScript. ",(0,r.kt)("em",{parentName:"li"},"Requires the ",(0,r.kt)("inlineCode",{parentName:"em"},"typescript")," package.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},".yaml"),", ",(0,r.kt)("inlineCode",{parentName:"li"},".yml")," - YAML. ",(0,r.kt)("em",{parentName:"li"},"Does not support multi-document."))),(0,r.kt)("p",null,"Based on the file structure in the ",(0,r.kt)("a",{parentName:"p",href:"#setup"},"Setup")," section above, the config files can be\ndemonstrated as followed (excluding standard JavaScript since it's either CJS or MJS)."),(0,r.kt)(l.Z,{groupId:"file-format",defaultValue:"cjs",values:[{label:"JavaScript (CJS)",value:"cjs"},{label:"JavaScript (MJS)",value:"mjs"},{label:"TypeScript",value:"ts"},{label:"JSON",value:"json"},{label:"YAML",value:"yaml"}],mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cjs",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"module.exports = {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n"))),(0,r.kt)(s.Z,{value:"mjs",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"export default {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n"))),(0,r.kt)(s.Z,{value:"ts",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ConfigFile } from './types';\n\nconst config: ConfigFile = {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n\nexport default config;\n"))),(0,r.kt)(s.Z,{value:"json",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "ast": false,\n    "debug": true,\n    "exclude": ["**/node_modules/**"],\n    "include": ["src/**", "tests/**"],\n    "options": { "experimental": true }\n}\n'))),(0,r.kt)(s.Z,{value:"yaml",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"ast: false\ndebug: true\nexclude:\n  - '**/node_modules/**'\ninclude:\n  - 'src/**'\n  - 'tests/**'\noptions:\n  experimental: true\n")))),(0,r.kt)("h3",{id:"loading-config-files"},"Loading config files"),(0,r.kt)("p",null,"Config files can be found and loaded with either the\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromRoot()"))," or\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromBranchToRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromBranchToRoot()"))," methods -- both of which\nreturn a processed config object that abides the\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/interface/ProcessedConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"ProcessedConfig"))," type."),(0,r.kt)("h4",{id:"lookup-resolution"},"Lookup resolution"),(0,r.kt)("p",null,"When the finder traverses through the file system and attempts to resolve config files within\neach/target folder, it does so using the lookup algorithm demonstrated below. Let's assume the\nfollowing:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The config file name is ",(0,r.kt)("inlineCode",{parentName:"li"},"boost"),"."),(0,r.kt)("li",{parentName:"ul"},"All file formats are supported, in their default lookup order (js, json, cjs, mjs, ts, json5,\nyaml, yml)."),(0,r.kt)("li",{parentName:"ul"},"The current environment is ",(0,r.kt)("inlineCode",{parentName:"li"},"development")," (the value of ",(0,r.kt)("inlineCode",{parentName:"li"},"NODE_ENV"),").")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"boost.js\nboost.development.js\nboost.json\nboost.development.json\nboost.cjs\nboost.development.cjs\nboost.mjs\nboost.development.mjs\nboost.ts\nboost.development.ts\nboost.json5\nboost.development.json5\nboost.yaml\nboost.development.yaml\nboost.yml\nboost.development.yml\n")),(0,r.kt)("p",null,"For each file format, we attempt to find the base config file, and an environment config file (if\n",(0,r.kt)("a",{parentName:"p",href:"#finder-options"},(0,r.kt)("inlineCode",{parentName:"a"},"includeEnv"))," is true). This allows for higher precendence config per environment.\nOnce a file is found, the lookup process is aborted, and the confg is returned."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Only 1 file format will be used per folder. Multiple file formats is not supported.")),(0,r.kt)("h4",{id:"from-root"},"From root"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromRoot()"))," will load the config file found in\nthe root ",(0,r.kt)("inlineCode",{parentName:"p"},".config")," folder (typically 1 file). If no root path is provided, it defaults to\nprocess.cwd()."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="root/.config/boost.json"',title:'"root/.config/boost.json"'},'{\n    "debug": true\n}\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const { config } = await manager.loadConfigFromRoot('/root');\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"{\n  config: { debug: true },\n  files: [\n    {\n      config: { debug: true },\n      path: new Path('/root/.config/boost.json'),\n      source: 'root',\n    },\n  ],\n}\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Why are root config files located within a ",(0,r.kt)("inlineCode",{parentName:"p"},".config")," folder? In an effort to reduce the root\nconfig and dotfile churn that many projects suffer from, we're trying to push forward an idiomatic\nstandard that we hope many others will follow.")),(0,r.kt)("h4",{id:"from-branch"},"From branch"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromBranchToRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromBranchToRoot()"))," method will load a\nconfig file from each folder while traversing upwards from the branch folder to the root folder. The\nfound list is returned in reverse order so that the deepest branch can be used to overwrite the\nprevious branch (or root)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="root/modules/features/.boost.mjs"',title:'"root/modules/features/.boost.mjs"'},"export default {\n    ast: true,\n};\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="root/modules/.boost.yaml"',title:'"root/modules/.boost.yaml"'},"options:\n  experimental: true\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="root/.config/boost.json"',title:'"root/.config/boost.json"'},'{\n    "debug": true\n}\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const { config } = await manager.loadConfigFromBranchToRoot('/root/modules/features');\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"{\n    config: {\n        ast: true,\n        debug: true,\n        options: {\n            experimental: true,\n        },\n    },\n    files: [\n        {\n            config: { debug: true },\n            path: new Path('/root/.config/boost.json'),\n            source: 'root',\n        },\n        {\n            config: {\n                options: {\n                    experimental: true,\n                },\n            },\n            path: new Path('/root/modules/.boost.yaml'),\n            source: 'branch',\n        },\n        {\n            config: { ast: true },\n            path: new Path('/root/modules/features/.boost.mjs'),\n            source: 'branch',\n        },\n    ],\n};\n")),(0,r.kt)("h3",{id:"enable-extending"},"Enable extending"),(0,r.kt)("p",null,"Config extending enables consumers of your project to extend and merge with external config files\nusing file system paths or ",(0,r.kt)("a",{parentName:"p",href:"#presets"},"Node.js modules"),", with the current config file taking\nprecedence. With that being said, extending is ",(0,r.kt)("em",{parentName:"p"},"not")," enabled by default and must be configured for\nuse. To enable, define the ",(0,r.kt)("a",{parentName:"p",href:"#finder-options"},(0,r.kt)("inlineCode",{parentName:"a"},"extendsSetting"))," option with the name of a setting in\nwhich extending would be configured."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            extendsSetting: 'extend',\n        });\n    }\n}\n")),(0,r.kt)("p",null,"Consumers may now extend external config files by defining a string or an array of strings for\n",(0,r.kt)("inlineCode",{parentName:"p"},"extend")," (name derived from the example above)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"export default {\n    extend: ['./some/relative/path.js', 'npm-module'],\n    debug: false,\n};\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"File paths are relative to the file it's configured in.")),(0,r.kt)("h4",{id:"presets"},"Presets"),(0,r.kt)("p",null,"To extend from a Node.js module, we must use a preset. A preset is a\n",(0,r.kt)("a",{parentName:"p",href:"#file-formats"},"JavaScript config file")," located in the module root, named in the format of\n",(0,r.kt)("inlineCode",{parentName:"p"},"<name>.preset.js"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="npm-module/boost.preset.js"',title:'"npm-module/boost.preset.js"'},"module.exports = {\n    exclude: ['**/node_modules'],\n};\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Since the preset is JavaScript, it can be written in either CommonJS or ECMAScript format,\nassuming the ",(0,r.kt)("inlineCode",{parentName:"p"},"type")," field has been set in ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json"),".")),(0,r.kt)("h3",{id:"enable-overrides"},"Enable overrides"),(0,r.kt)("p",null,"Config overrides enables consumers of your project to define granular settings based on file path\nmatching; settings defined in this fashion would override their base settings. With that being said,\noverrides are ",(0,r.kt)("em",{parentName:"p"},"not")," enabled by default and must be configured for use. To enable, define the\n",(0,r.kt)("a",{parentName:"p",href:"#finder-options"},(0,r.kt)("inlineCode",{parentName:"a"},"overridesSetting"))," option with the name of a setting in which overrides would be\nconfigured."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            overridesSetting: 'override',\n        });\n    }\n}\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Overrides are extracted ",(0,r.kt)("em",{parentName:"p"},"before")," configurations are processed, so a process handler is not\nrequired.")),(0,r.kt)("p",null,"Consumers may now define overrides in their config file by passing a list of items to the ",(0,r.kt)("inlineCode",{parentName:"p"},"override"),"\nsetting (name derived from the example above). Each item must abide the\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/interface/OverridesSettingItem"},(0,r.kt)("inlineCode",{parentName:"a"},"OverridesSettingItem"))," type."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"export default {\n    debug: false,\n    override: [\n        {\n            include: '*.test.ts',\n            settings: {\n                debug: true,\n            },\n        },\n    ],\n};\n")),(0,r.kt)("h2",{id:"ignore-files"},"Ignore files"),(0,r.kt)("p",null,"An ignore file is a standard text file that denotes files and folders to ignore\n(filter/exclude/etc), within the current directory, using matching globs and patterns."),(0,r.kt)("h3",{id:"file-patterns-1"},"File patterns"),(0,r.kt)("p",null,"Both root and branch level ignore files use the same file naming scheme. The file is prefixed with a\nleading dot (",(0,r.kt)("inlineCode",{parentName:"p"},"."),"), followed by the name passed to your ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration"))," instance (in\ncamel case), and suffixed with ",(0,r.kt)("inlineCode",{parentName:"p"},"ignore"),"."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Root"),(0,r.kt)("th",{parentName:"tr",align:null},"Branch"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".<name>ignore")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},".<name>ignore"))))),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"The root ignore file is not located within the ",(0,r.kt)("inlineCode",{parentName:"p"},".config")," folder as ignore paths/patterns/globs\nmust be relative to the current directory.")),(0,r.kt)("h3",{id:"loading-ignore-files"},"Loading ignore files"),(0,r.kt)("p",null,"Ignore files can be found and loaded with either the\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromRoot()"))," or\n",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromBranchToRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromBranchToRoot()"))," methods -- both of which\nreturn a list of ignore metadata that abide the ",(0,r.kt)("a",{parentName:"p",href:"/api/config/interface/IgnoreFile"},(0,r.kt)("inlineCode",{parentName:"a"},"IgnoreFile")),"\ntype."),(0,r.kt)("p",null,"To demonstrate this, let's assume the following file system."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"root/\n\u251c\u2500\u2500 modules/\n\u2502   \u251c\u2500\u2500 features/\n\u2502   \u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u2502   \u2514\u2500\u2500 .boostignore\n\u2502   \u251c\u2500\u2500 foo.ts\n\u2502   \u251c\u2500\u2500 bar.ts\n\u2502   \u2514\u2500\u2500 baz.ts\n\u2514\u2500\u2500 .boostignore\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="root/modules/features/.boostignore"',title:'"root/modules/features/.boostignore"'},"build/\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="root/.boostignore"',title:'"root/.boostignore"'},"*.log\n*.lock\n")),(0,r.kt)("h4",{id:"from-root-1"},"From root"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromRoot()"))," will load the ignore file found in\nthe root folder (typically 1 file). If no root path is provided, it defaults to ",(0,r.kt)("inlineCode",{parentName:"p"},"process.cwd()"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const list = await manager.loadIgnoreFromRoot('/root');\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"[\n    {\n        ignore: ['*.log', '*.lock'],\n        path: new Path('/root/.boostignore'),\n        source: 'root',\n    },\n];\n")),(0,r.kt)("h4",{id:"from-branch-1"},"From branch"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromBranchToRoot"},(0,r.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromBranchToRoot()"))," method will load an\nignore file from each folder while traversing upwards from the branch folder to the root folder. The\nfound list is returned in reverse order so that the deepest branch can be used to overwrite the\nprevious branch (or root)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const list = await manager.loadIgnoreFromBranchToRoot('/root/modules/features');\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"[\n    {\n        ignore: ['*.log', '*.lock'],\n        path: new Path('/root'),\n        source: 'root',\n    },\n    {\n        ignore: ['build/'],\n        path: new Path('/root/modules/features/.boostignore'),\n        source: 'branch',\n    },\n];\n")))}g.isMDXComponent=!0}}]);