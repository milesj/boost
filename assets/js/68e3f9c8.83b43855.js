(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7062],{297:function(e,n,t){"use strict";t.d(n,{Z:function(){return o}});var a=t(7378);function o(e){var n=e.children,t=e.type;return a.createElement("span",{className:"badge badge--"+t},n)}},7586:function(e,n,t){"use strict";t.d(n,{Z:function(){return d}});var a=t(7378),o=t(4142),i=t(1554),r=t(297),l="badgeGroup_2HOO",s="apiLink_32Vk";function p(e){var n=e.children;return a.createElement("span",{className:l},n)}function d(e){var n=e.api,t=e.backend,l=e.frontend,d=e.tooling;return a.createElement(a.Fragment,null,n&&a.createElement(o.default,{className:s,to:n},"API ",a.createElement(i.Z,null)),a.createElement(p,null,t&&a.createElement(r.Z,{type:"warning"},"Backend"),l&&a.createElement(r.Z,{type:"success"},"Frontend"),d&&a.createElement(r.Z,{type:"primary"},"Tooling")))}},9890:function(e,n,t){"use strict";t.r(n),t.d(n,{frontMatter:function(){return d},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return c},default:function(){return g}});var a=t(9603),o=t(120),i=(t(7378),t(5318)),r=t(7586),l=t(4535),s=t(517),p=["components"],d={title:"Configuration"},u=void 0,m={unversionedId:"config",id:"config",isDocsHomePage:!1,title:"Configuration",description:"Powerful convention based finder, loader, and manager of both configuration and ignore files. Will",source:"@site/docs/config.mdx",sourceDirName:".",slug:"/config",permalink:"/docs/config",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/config.mdx",tags:[],version:"current",frontMatter:{title:"Configuration"},sidebar:"docs",previous:{title:"Common utilities",permalink:"/docs/common"},next:{title:"Crash reporting",permalink:"/docs/crash"}},c=[{value:"Installation",id:"installation",children:[]},{value:"Setup",id:"setup",children:[{value:"Finder options",id:"finder-options",children:[]},{value:"Processor options",id:"processor-options",children:[]},{value:"Processing settings",id:"processing-settings",children:[]}]},{value:"Config files",id:"config-files",children:[{value:"File patterns",id:"file-patterns",children:[]},{value:"File formats",id:"file-formats",children:[]},{value:"Loading config files",id:"loading-config-files",children:[]},{value:"Enable extending",id:"enable-extending",children:[]},{value:"Enable overrides",id:"enable-overrides",children:[]}]},{value:"Ignore files",id:"ignore-files",children:[{value:"File patterns",id:"file-patterns-1",children:[]},{value:"Loading ignore files",id:"loading-ignore-files",children:[]}]}],f={toc:c};function g(e){var n=e.components,t=(0,o.Z)(e,p);return(0,i.kt)("wrapper",(0,a.Z)({},f,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)(r.Z,{backend:!0,tooling:!0,api:"/api/config",mdxType:"EnvBadges"}),(0,i.kt)("p",null,"Powerful convention based finder, loader, and manager of both configuration and ignore files. Will\nfind config files of multiple supported formats while traversing up the tree."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)(l.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/config\n"))),(0,i.kt)(s.Z,{value:"npm",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/config\n")))),(0,i.kt)("h2",{id:"setup"},"Setup"),(0,i.kt)("p",null,"Configuration in the context of this package encompasses 2 concepts: config files and ignore files.\nConfig files are a collection of settings (key-value pairs), while ignore files are a list of file\npath patterns and globs."),(0,i.kt)("p",null,"To utilize this functionality, we must extend the ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration"))," class, and define\na blueprint for the structure of our config file (using ",(0,i.kt)("a",{parentName:"p",href:"/docs/common#class-contracts"},"optimal"),").\nThis class will fulfill multiple roles: managing, finding, loading, and processing of files."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { Blueprint, Schemas } from '@boost/common';\nimport { Configuration } from '@boost/config';\n\n// Example structure\ninterface ConfigFile {\n    ast?: boolean;\n    cwd?: string;\n    debug?: boolean;\n    exclude?: string[];\n    include?: string[];\n    options?: object;\n}\n\nclass Manager extends Configuration<ConfigFile> {\n    blueprint({ array, bool, string, object }: Schemas): Blueprint<ConfigFile> {\n        return {\n            ast: bool(),\n            cwd: string(process.cwd()),\n            debug: bool(),\n            exclude: array().of(string()),\n            include: array().of(string()),\n            options: object(),\n        };\n    }\n}\n")),(0,i.kt)("p",null,'This class layer is designed to be "internal only", and should not be utilized by consumers\ndirectly. Instead, consumers should interact with an instance of the class, like so.'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"export default new Manager('boost');\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"The string value passed to the constructor is the name of the config and ignore files, in camel\ncase format. For example, ",(0,i.kt)("inlineCode",{parentName:"p"},"boost.js")," and ",(0,i.kt)("inlineCode",{parentName:"p"},".boostignore"),".")),(0,i.kt)("h3",{id:"finder-options"},"Finder options"),(0,i.kt)("p",null,"To customize the config file finding and loading layer, call\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#configureFinder"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#configureFinder()"))," within\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#bootstrap"},(0,i.kt)("inlineCode",{parentName:"a"},"#bootstrap()")),". This method supports all options in\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/interface/ConfigFinderOptions"},(0,i.kt)("inlineCode",{parentName:"a"},"ConfigFinderOptions"))," except for ",(0,i.kt)("inlineCode",{parentName:"p"},"name"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            extendsSetting: 'extends',\n            includeEnv: false,\n        });\n    }\n}\n")),(0,i.kt)("h3",{id:"processor-options"},"Processor options"),(0,i.kt)("p",null,"To customize the config processing layer, call\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#configureProcessor"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#configureProcessor()"))," while\nwithin ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#bootstrap"},(0,i.kt)("inlineCode",{parentName:"a"},"#bootstrap()")),". This method supports all options\nin ",(0,i.kt)("a",{parentName:"p",href:"/api/config/interface/ProcessorOptions"},(0,i.kt)("inlineCode",{parentName:"a"},"ProcessorOptions"))," except for ",(0,i.kt)("inlineCode",{parentName:"p"},"name"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureProcessor({\n            defaultWhenUndefined: false,\n        });\n    }\n}\n")),(0,i.kt)("h3",{id:"processing-settings"},"Processing settings"),(0,i.kt)("p",null,"When multiple config files are merged into a single config file, this is known as processing.\nProcessing happens automatically for each setting as we need to determine what the next setting\nvalue would be. By default, the following rules apply when the next and previous setting values are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"Arrays"),": will be merged and deduped into a new array."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"Objects"),": will be shallow merged (using spread) into a new object."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"Primitives"),": next value will overwrite the previous value."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"Undefined"),": will reset to initial value if\n",(0,i.kt)("a",{parentName:"li",href:"/api/config/interface/ProcessorOptions#defaultWhenUndefined"},(0,i.kt)("inlineCode",{parentName:"a"},"defaultWhenUndefined"))," is true.")),(0,i.kt)("p",null,"If you would like to customize this process, you can define custom process handlers per setting with\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#addProcessHandler"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#addProcessHandler()")),". This\nmethod requires a setting name and handler function (which is passed the previous and next values)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        // Always use forward slashes\n        this.addProcessHandler('cwd', (prev, next) => next.replace(/\\\\/g, '/'));\n\n        // Deep merge options since they're dynamic\n        this.addProcessHandler('options', (prev, next) => deepMerge(prev, next));\n    }\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Handlers may only be defined on root-level settings.")),(0,i.kt)("p",null,"To make this process even easier, we provide a handful of pre-defined handlers (below) that can be\nused for common scenarios (these handlers power the default rules mentioned above)."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/api/config/function/mergeArray"},(0,i.kt)("inlineCode",{parentName:"a"},"mergeArray"))," - Merges previous and next arrays into a new array\nwhile removing duplicates (using ",(0,i.kt)("inlineCode",{parentName:"li"},"Set"),")."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/api/config/function/mergeExtends"},(0,i.kt)("inlineCode",{parentName:"a"},"mergeExtends"))," - Merges previous and next file paths (either\na string or array of strings) into a new list of file paths. This is useful if utilizing\n",(0,i.kt)("a",{parentName:"li",href:"#enable-extending"},"config extending"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/api/config/function/mergeObject"},(0,i.kt)("inlineCode",{parentName:"a"},"mergeObject"))," - Shallow merges previous and next objects into\na new object using object spread."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/api/config/function/mergePlugins"},(0,i.kt)("inlineCode",{parentName:"a"},"mergePlugins"))," - Merges previous and next plugin\nconfigurations into an object. Plugin configs can either be a list of sources, or list of sources\nwith flags/options (tuples), or a map of sources to flags/options. This is useful if utilizing the\n",(0,i.kt)("a",{parentName:"li",href:"/docs/plugin#configuration-files"},"plugin package"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/api/config/function/overwrite"},(0,i.kt)("inlineCode",{parentName:"a"},"overwrite"))," - Overwrite the previous value with the next value.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { mergePlugins } from '@boost/config';\n\nclass Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        // Using example from @boost/plugin documentation\n        this.addProcessHandler('renderers', mergePlugins);\n    }\n}\n")),(0,i.kt)("h2",{id:"config-files"},"Config files"),(0,i.kt)("p",null,"A config file is a file that explicitly defines settings (key-value pairs) according to a defined\nstructure."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Configuration files are designed to be serializable, so please use primitive, object, and array\nvalues only. Try to avoid non-serializable values like class instances.")),(0,i.kt)("h3",{id:"file-patterns"},"File patterns"),(0,i.kt)("p",null,"Config files are grouped into either the root or branch category. Root config files are located in a\n",(0,i.kt)("inlineCode",{parentName:"p"},".config")," folder in the root of a project (denoted by the current working directory). Branch config\nfiles are located within folders (at any depth) below the root, and are prefixed with a leading dot\n(",(0,i.kt)("inlineCode",{parentName:"p"},"."),")."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Root"),(0,i.kt)("th",{parentName:"tr",align:null},"Branch"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".config/<name>.<ext>")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".<name>.<ext>"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".config/<name>.<env>.<ext>")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".<name>.<env>.<ext>"))))),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"<name>")," - Name passed to your ",(0,i.kt)("a",{parentName:"li",href:"/api/config/class/Configuration"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration"))," instance (in camel case)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"<env>")," - Current environment derived from ",(0,i.kt)("inlineCode",{parentName:"li"},"NODE_ENV"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"<ext>")," - File extension supported by the defined ",(0,i.kt)("a",{parentName:"li",href:"#finder-options"},"loaders and extensions"),".")),(0,i.kt)("h3",{id:"file-formats"},"File formats"),(0,i.kt)("p",null,"Config files can be written in the formats below, and are listed in the order in which they're\nresolved (can customize with the ",(0,i.kt)("a",{parentName:"p",href:"#finder-options"},(0,i.kt)("inlineCode",{parentName:"a"},"extensions"))," option)."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".js")," - JavaScript. Will load with ",(0,i.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"CommonJS or ECMAScript modules")," depending on the\n",(0,i.kt)("inlineCode",{parentName:"li"},"package.json")," ",(0,i.kt)("inlineCode",{parentName:"li"},"type")," field. Defaults to CommonJS if not defined."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".json"),", ",(0,i.kt)("inlineCode",{parentName:"li"},".json5")," - JSON. Supports ",(0,i.kt)("a",{parentName:"li",href:"https://json5.org/"},"JSON5")," for both extensions."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".cjs")," - JavaScript using ",(0,i.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"CommonJS")," (",(0,i.kt)("inlineCode",{parentName:"li"},"require()"),"). ",(0,i.kt)("em",{parentName:"li"},"Supported by all Node.js versions.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".mjs")," - JavaScript using ",(0,i.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html#esm_enabling"},"ECMAScript modules")," (",(0,i.kt)("inlineCode",{parentName:"li"},"import"),"/",(0,i.kt)("inlineCode",{parentName:"li"},"export"),"). ",(0,i.kt)("em",{parentName:"li"},"Requires Node.js\nv13.3+.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".ts")," - TypeScript. ",(0,i.kt)("em",{parentName:"li"},"Requires the ",(0,i.kt)("inlineCode",{parentName:"em"},"typescript")," package.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".yaml"),", ",(0,i.kt)("inlineCode",{parentName:"li"},".yml")," - YAML. ",(0,i.kt)("em",{parentName:"li"},"Does not support multi-document."))),(0,i.kt)("p",null,"Based on the file structure in the ",(0,i.kt)("a",{parentName:"p",href:"#setup"},"Setup")," section above, the config files can be\ndemonstrated as followed (excluding standard JavaScript since it's either CJS or MJS)."),(0,i.kt)(l.Z,{groupId:"file-format",defaultValue:"cjs",values:[{label:"JavaScript (CJS)",value:"cjs"},{label:"JavaScript (MJS)",value:"mjs"},{label:"TypeScript",value:"ts"},{label:"JSON",value:"json"},{label:"YAML",value:"yaml"}],mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"cjs",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"module.exports = {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n"))),(0,i.kt)(s.Z,{value:"mjs",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"export default {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n"))),(0,i.kt)(s.Z,{value:"ts",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ConfigFile } from './types';\n\nconst config: ConfigFile = {\n    ast: false,\n    debug: true,\n    exclude: ['**/node_modules/**'],\n    include: ['src/**', 'tests/**'],\n    options: { experimental: true },\n};\n\nexport default config;\n"))),(0,i.kt)(s.Z,{value:"json",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "ast": false,\n    "debug": true,\n    "exclude": ["**/node_modules/**"],\n    "include": ["src/**", "tests/**"],\n    "options": { "experimental": true }\n}\n'))),(0,i.kt)(s.Z,{value:"yaml",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"ast: false\ndebug: true\nexclude:\n  - '**/node_modules/**'\ninclude:\n  - 'src/**'\n  - 'tests/**'\noptions:\n  experimental: true\n")))),(0,i.kt)("h3",{id:"loading-config-files"},"Loading config files"),(0,i.kt)("p",null,"Config files can be found and loaded with either the\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromRoot()"))," or\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromBranchToRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromBranchToRoot()"))," methods -- both of which\nreturn a processed config object that abides the\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/interface/ProcessedConfig"},(0,i.kt)("inlineCode",{parentName:"a"},"ProcessedConfig"))," type."),(0,i.kt)("h4",{id:"lookup-resolution"},"Lookup resolution"),(0,i.kt)("p",null,"When the finder traverses through the file system and attempts to resolve config files within\neach/target folder, it does so using the lookup algorithm demonstrated below. Let's assume the\nfollowing:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The config file name is ",(0,i.kt)("inlineCode",{parentName:"li"},"boost"),"."),(0,i.kt)("li",{parentName:"ul"},"All file formats are supported, in their default lookup order (js, json, cjs, mjs, ts, json5,\nyaml, yml)."),(0,i.kt)("li",{parentName:"ul"},"The current environment is ",(0,i.kt)("inlineCode",{parentName:"li"},"development")," (the value of ",(0,i.kt)("inlineCode",{parentName:"li"},"NODE_ENV"),").")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"boost.js\nboost.development.js\nboost.json\nboost.development.json\nboost.cjs\nboost.development.cjs\nboost.mjs\nboost.development.mjs\nboost.ts\nboost.development.ts\nboost.json5\nboost.development.json5\nboost.yaml\nboost.development.yaml\nboost.yml\nboost.development.yml\n")),(0,i.kt)("p",null,"For each file format, we attempt to find the base config file, and an environment config file (if\n",(0,i.kt)("a",{parentName:"p",href:"#finder-options"},(0,i.kt)("inlineCode",{parentName:"a"},"includeEnv"))," is true). This allows for higher precendence config per environment.\nOnce a file is found, the lookup process is aborted, and the confg is returned."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Only 1 file format will be used per folder. Multiple file formats is not supported.")),(0,i.kt)("h4",{id:"from-root"},"From root"),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromRoot()"))," will load the config file found in\nthe root ",(0,i.kt)("inlineCode",{parentName:"p"},".config")," folder (typically 1 file). If no root path is provided, it defaults to\nprocess.cwd()."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="root/.config/boost.json"',title:'"root/.config/boost.json"'},'{\n    "debug": true\n}\n')),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { config } = await manager.loadConfigFromRoot('/root');\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  config: { debug: true },\n  files: [\n    {\n      config: { debug: true },\n      path: new Path('/root/.config/boost.json'),\n      source: 'root',\n    },\n  ],\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Why are root config files located within a ",(0,i.kt)("inlineCode",{parentName:"p"},".config")," folder? In an effort to reduce the root\nconfig and dotfile churn that many projects suffer from, we're trying to push forward an idiomatic\nstandard that we hope many others will follow.")),(0,i.kt)("h4",{id:"from-branch"},"From branch"),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadConfigFromBranchToRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadConfigFromBranchToRoot()"))," method will load a\nconfig file from each folder while traversing upwards from the branch folder to the root folder. The\nfound list is returned in reverse order so that the deepest branch can be used to overwrite the\nprevious branch (or root)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="root/modules/features/.boost.mjs"',title:'"root/modules/features/.boost.mjs"'},"export default {\n    ast: true,\n};\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="root/modules/.boost.yaml"',title:'"root/modules/.boost.yaml"'},"options:\n  experimental: true\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="root/.config/boost.json"',title:'"root/.config/boost.json"'},'{\n    "debug": true\n}\n')),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { config } = await manager.loadConfigFromBranchToRoot('/root/modules/features');\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n    config: {\n        ast: true,\n        debug: true,\n        options: {\n            experimental: true,\n        },\n    },\n    files: [\n        {\n            config: { debug: true },\n            path: new Path('/root/.config/boost.json'),\n            source: 'root',\n        },\n        {\n            config: {\n                options: {\n                    experimental: true,\n                },\n            },\n            path: new Path('/root/modules/.boost.yaml'),\n            source: 'branch',\n        },\n        {\n            config: { ast: true },\n            path: new Path('/root/modules/features/.boost.mjs'),\n            source: 'branch',\n        },\n    ],\n};\n")),(0,i.kt)("h3",{id:"enable-extending"},"Enable extending"),(0,i.kt)("p",null,"Config extending enables consumers of your project to extend and merge with external config files\nusing file system paths or ",(0,i.kt)("a",{parentName:"p",href:"#presets"},"Node.js modules"),", with the current config file taking\nprecedence. With that being said, extending is ",(0,i.kt)("em",{parentName:"p"},"not")," enabled by default and must be configured for\nuse. To enable, define the ",(0,i.kt)("a",{parentName:"p",href:"#finder-options"},(0,i.kt)("inlineCode",{parentName:"a"},"extendsSetting"))," option with the name of a setting in\nwhich extending would be configured."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            extendsSetting: 'extend',\n        });\n    }\n}\n")),(0,i.kt)("p",null,"Consumers may now extend external config files by defining a string or an array of strings for\n",(0,i.kt)("inlineCode",{parentName:"p"},"extend")," (name derived from the example above)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"export default {\n    extend: ['./some/relative/path.js', 'npm-module'],\n    debug: false,\n};\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"File paths are relative to the file it's configured in.")),(0,i.kt)("h4",{id:"presets"},"Presets"),(0,i.kt)("p",null,"To extend from a Node.js module, we must use a preset. A preset is a\n",(0,i.kt)("a",{parentName:"p",href:"#file-formats"},"JavaScript config file")," located in the module root, named in the format of\n",(0,i.kt)("inlineCode",{parentName:"p"},"<name>.preset.js"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="npm-module/boost.preset.js"',title:'"npm-module/boost.preset.js"'},"module.exports = {\n    exclude: ['**/node_modules'],\n};\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Since the preset is JavaScript, it can be written in either CommonJS or ECMAScript format,\nassuming the ",(0,i.kt)("inlineCode",{parentName:"p"},"type")," field has been set in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),".")),(0,i.kt)("h3",{id:"enable-overrides"},"Enable overrides"),(0,i.kt)("p",null,"Config overrides enables consumers of your project to define granular settings based on file path\nmatching; settings defined in this fashion would override their base settings. With that being said,\noverrides are ",(0,i.kt)("em",{parentName:"p"},"not")," enabled by default and must be configured for use. To enable, define the\n",(0,i.kt)("a",{parentName:"p",href:"#finder-options"},(0,i.kt)("inlineCode",{parentName:"a"},"overridesSetting"))," option with the name of a setting in which overrides would be\nconfigured."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class Manager extends Configuration<ConfigFile> {\n    // ...\n\n    bootstrap() {\n        this.configureFinder({\n            overridesSetting: 'override',\n        });\n    }\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Overrides are extracted ",(0,i.kt)("em",{parentName:"p"},"before")," configurations are processed, so a process handler is not\nrequired.")),(0,i.kt)("p",null,"Consumers may now define overrides in their config file by passing a list of items to the ",(0,i.kt)("inlineCode",{parentName:"p"},"override"),"\nsetting (name derived from the example above). Each item must abide the\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/interface/OverridesSettingItem"},(0,i.kt)("inlineCode",{parentName:"a"},"OverridesSettingItem"))," type."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"export default {\n    debug: false,\n    override: [\n        {\n            include: '*.test.ts',\n            settings: {\n                debug: true,\n            },\n        },\n    ],\n};\n")),(0,i.kt)("h2",{id:"ignore-files"},"Ignore files"),(0,i.kt)("p",null,"An ignore file is a standard text file that denotes files and folders to ignore\n(filter/exclude/etc), within the current directory, using matching globs and patterns."),(0,i.kt)("h3",{id:"file-patterns-1"},"File patterns"),(0,i.kt)("p",null,"Both root and branch level ignore files use the same file naming scheme. The file is prefixed with a\nleading dot (",(0,i.kt)("inlineCode",{parentName:"p"},"."),"), followed by the name passed to your ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration"))," instance (in\ncamel case), and suffixed with ",(0,i.kt)("inlineCode",{parentName:"p"},"ignore"),"."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Root"),(0,i.kt)("th",{parentName:"tr",align:null},"Branch"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".<name>ignore")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},".<name>ignore"))))),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"The root ignore file is not located within the ",(0,i.kt)("inlineCode",{parentName:"p"},".config")," folder as ignore paths/patterns/globs\nmust be relative to the current directory.")),(0,i.kt)("h3",{id:"loading-ignore-files"},"Loading ignore files"),(0,i.kt)("p",null,"Ignore files can be found and loaded with either the\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromRoot()"))," or\n",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromBranchToRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromBranchToRoot()"))," methods -- both of which\nreturn a list of ignore metadata that abide the ",(0,i.kt)("a",{parentName:"p",href:"/api/config/interface/IgnoreFile"},(0,i.kt)("inlineCode",{parentName:"a"},"IgnoreFile")),"\ntype."),(0,i.kt)("p",null,"To demonstrate this, let's assume the following file system."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"root/\n\u251c\u2500\u2500 modules/\n\u2502   \u251c\u2500\u2500 features/\n\u2502   \u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u2502   \u2514\u2500\u2500 .boostignore\n\u2502   \u251c\u2500\u2500 foo.ts\n\u2502   \u251c\u2500\u2500 bar.ts\n\u2502   \u2514\u2500\u2500 baz.ts\n\u2514\u2500\u2500 .boostignore\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="root/modules/features/.boostignore"',title:'"root/modules/features/.boostignore"'},"build/\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="root/.boostignore"',title:'"root/.boostignore"'},"*.log\n*.lock\n")),(0,i.kt)("h4",{id:"from-root-1"},"From root"),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromRoot()"))," will load the ignore file found in\nthe root folder (typically 1 file). If no root path is provided, it defaults to ",(0,i.kt)("inlineCode",{parentName:"p"},"process.cwd()"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const list = await manager.loadIgnoreFromRoot('/root');\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"[\n    {\n        ignore: ['*.log', '*.lock'],\n        path: new Path('/root/.boostignore'),\n        source: 'root',\n    },\n];\n")),(0,i.kt)("h4",{id:"from-branch-1"},"From branch"),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"/api/config/class/Configuration#loadIgnoreFromBranchToRoot"},(0,i.kt)("inlineCode",{parentName:"a"},"Configuration#loadIgnoreFromBranchToRoot()"))," method will load an\nignore file from each folder while traversing upwards from the branch folder to the root folder. The\nfound list is returned in reverse order so that the deepest branch can be used to overwrite the\nprevious branch (or root)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const list = await manager.loadIgnoreFromBranchToRoot('/root/modules/features');\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"[\n    {\n        ignore: ['*.log', '*.lock'],\n        path: new Path('/root'),\n        source: 'root',\n    },\n    {\n        ignore: ['build/'],\n        path: new Path('/root/modules/features/.boostignore'),\n        source: 'branch',\n    },\n];\n")))}g.isMDXComponent=!0}}]);