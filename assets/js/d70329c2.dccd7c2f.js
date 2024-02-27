"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[568],{1076:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>h,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>d,toc:()=>p});var s=a(1948),t=a(3460),o=a(302),r=a(240),l=a(2548);const i={title:"Common utilities"},c=void 0,d={id:"common",title:"Common utilities",description:"A collection of common utilities, classes, and helpers.",source:"@site/docs/common.mdx",sourceDirName:".",slug:"/common",permalink:"/docs/common",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/common.mdx",tags:[],version:"current",frontMatter:{title:"Common utilities"},sidebar:"docs",previous:{title:"Prompts",permalink:"/docs/cli/prompts"},next:{title:"Configuration",permalink:"/docs/config"}},h={},p=[{value:"Installation",id:"installation",level:2},{value:"Helpers and serializers",id:"helpers-and-serializers",level:2},{value:"JSON",id:"json",level:4},{value:"YAML",id:"yaml",level:4},{value:"Class contracts",id:"class-contracts",level:2},{value:"Required options",id:"required-options",level:3},{value:"Project management",id:"project-management",level:2},{value:"Workspaces",id:"workspaces",level:3},{value:"Package graph",id:"package-graph",level:3},{value:"Path management",id:"path-management",level:2},{value:"Static factories",id:"static-factories",level:3},{value:"Resolving lookup paths",id:"resolving-lookup-paths",level:3}];function u(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(o.c,{backend:!0,tooling:!0,api:"/api/common"}),"\n",(0,s.jsx)(n.p,{children:"A collection of common utilities, classes, and helpers."}),"\n",(0,s.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsxs)(r.c,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"pnpm",value:"pnpm"},{label:"npm",value:"npm"}],children:[(0,s.jsx)(l.c,{value:"yarn",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn add @boost/common\n"})})}),(0,s.jsx)(l.c,{value:"pnpm",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"pnpm add @boost/common\n"})})}),(0,s.jsx)(l.c,{value:"npm",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install @boost/common\n"})})})]}),"\n",(0,s.jsx)(n.h2,{id:"helpers-and-serializers",children:"Helpers and serializers"}),"\n",(0,s.jsxs)(n.p,{children:["Boost provides many functions for common scenarios and patterns, like\n",(0,s.jsx)(n.a,{href:"/api/common/function/isObject",children:(0,s.jsx)(n.code,{children:"isObject"})})," for verifying a value is an object, or\n",(0,s.jsx)(n.a,{href:"/api/common/function/toArray",children:(0,s.jsx)(n.code,{children:"toArray"})})," for converting a value to an array.\n",(0,s.jsx)(n.a,{href:"/api/common#Index",children:"View the API for a full list of functions with examples"}),"."]}),"\n",(0,s.jsx)(n.h4,{id:"json",children:"JSON"}),"\n",(0,s.jsxs)(n.p,{children:["Powered by the ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/json5",children:"JSON5"})," package, the\n",(0,s.jsx)(n.a,{href:"/api/common/namespace/json",children:(0,s.jsx)(n.code,{children:"json"})})," serializer can be used to parse and stringify JSON data."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { json } from '@boost/common';\n\njson.parse(data);\njson.stringify(data);\n"})}),"\n",(0,s.jsx)(n.h4,{id:"yaml",children:"YAML"}),"\n",(0,s.jsxs)(n.p,{children:["Powered by the ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/yaml",children:"YAML"})," package, the\n",(0,s.jsx)(n.a,{href:"/api/common/namespace/yaml",children:(0,s.jsx)(n.code,{children:"yaml"})})," serializer can be used to parse and stringify YAML data."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { yaml } from '@boost/common';\n\nyaml.parse(data);\nyaml.stringify(data);\n"})}),"\n",(0,s.jsx)(n.h2,{id:"class-contracts",children:"Class contracts"}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.a,{href:"/api/common/class/Contract",children:(0,s.jsx)(n.code,{children:"Contract"})}),"is an abstract class that implements the\n",(0,s.jsx)(n.a,{href:"/api/common/interface/Optionable",children:(0,s.jsx)(n.code,{children:"Optionable"})})," interface, which provides an options object layer,\nand is meant to be inherited from as a super class. All classes that extend ",(0,s.jsx)(n.a,{href:"/api/common/class/Contract",children:(0,s.jsx)(n.code,{children:"Contract"})}),"\naccept an options object through the constructor, which is validated and built using\n",(0,s.jsx)(n.a,{href:"https://github.com/milesj/optimal",children:"optimal"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["To start, extend ",(0,s.jsx)(n.a,{href:"/api/common/class/Contract",children:(0,s.jsx)(n.code,{children:"Contract"})})," with a generic interface that represents the shape of the\noptions object. Next, implement the abstract\n",(0,s.jsx)(n.a,{href:"/api/common/class/Contract#blueprint",children:(0,s.jsx)(n.code,{children:"Contract#blueprint()"})})," method, which is passed\n",(0,s.jsx)(n.a,{href:"https://github.com/milesj/optimal/blob/master/docs/schemas.md",children:"optimal schemas"})," as an argument, and\nmust return an\n",(0,s.jsx)(n.a,{href:"https://github.com/milesj/optimal/blob/master/docs/usage.md#blueprint",children:"optimal blueprint"})," that\nmatches the generic interface."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { Contract, Blueprint, Schemas } from '@boost/common';\n\nexport interface AdapterOptions {\n  name?: string;\n  priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n  blueprint({ number, string }: Schemas): Blueprint<AdapterOptions> {\n    return {\n      name: string().notEmpty(),\n      priority: number().gte(0),\n    };\n  }\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["When the class is instantiated, the provided values will be checked and validated using the\nblueprint. If invalid, an error will be thrown. Furthermore, the\n",(0,s.jsx)(n.a,{href:"/api/common/class/Contract#options",children:(0,s.jsx)(n.code,{children:"Contract#options"})})," property is ",(0,s.jsx)(n.code,{children:"readonly"}),", and will error when\nmutated."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const adapter = new Adapter({\n  name: 'Boost',\n});\n\nconst { name } = adapter.options; // => Boost\n"})}),"\n",(0,s.jsx)(n.h3,{id:"required-options",children:"Required options"}),"\n",(0,s.jsx)(n.p,{children:"By default, the options argument in the constructor is optional, and if your interface has a\nrequired property, it will not be bubbled up in TypeScript. To support this, the constructor will\nneed to be overridden so that the argument can be marked as non-optional."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"export interface AdapterOptions {\n  name: string;\n  priority?: number;\n}\n\nexport default class Adapter extends Contract<AdapterOptions> {\n  constructor(options: AdapterOptions) {\n    super(options);\n  }\n\n  // ...\n}\n"})}),"\n",(0,s.jsx)(n.h2,{id:"project-management",children:"Project management"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/api/common/class/Project",children:(0,s.jsx)(n.code,{children:"Project"})})," class provides workspace and package metadata for a project. A project is\ndenoted by a root ",(0,s.jsx)(n.code,{children:"package.json"})," file and abides the npm and Node.js module pattern. To begin,\nimport and instantiate the ",(0,s.jsx)(n.a,{href:"/api/common/class/Project",children:(0,s.jsx)(n.code,{children:"Project"})})," class with a path to the project's root."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { Project } from '@boost/common';\n\nconst project = new Project();\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Root defaults to ",(0,s.jsx)(n.code,{children:"process.cwd()"})," if not provided."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"workspaces",children:"Workspaces"}),"\n",(0,s.jsxs)(n.p,{children:["The primary feature of this class is to extract metadata about a project's workspaces. Workspaces\nare used to support multi-package architectures known as monorepos, typically through\n",(0,s.jsx)(n.a,{href:"https://yarnpkg.com/features/workspaces",children:"Yarn"}),", ",(0,s.jsx)(n.a,{href:"https://pnpm.js.org/en/pnpm-workspace_yaml",children:"PNPM"}),",\nor ",(0,s.jsx)(n.a,{href:"https://github.com/lerna/lerna#lernajson",children:"Lerna"}),". In Boost, our implementation of workspaces\naligns with:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Project"})," - Typically a repository with a root ",(0,s.jsx)(n.code,{children:"package.json"}),". Can either be a collection of\npackages, or a package itself."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Package"})," - A folder with a ",(0,s.jsx)(n.code,{children:"package.json"})," file that represents an npm package. Contains source\nand test files specific to the package."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Workspace"})," - A folder that houses one or many packages."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"package-graph",children:"Package graph"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/api/common/class/PackageGraph",children:(0,s.jsx)(n.code,{children:"PackageGraph"})})," class can be used to generate a dependency graph for a list of\npackages, based on their defined ",(0,s.jsx)(n.code,{children:"dependencies"})," and ",(0,s.jsx)(n.code,{children:"peerDependencies"}),". To begin, import and\ninstantiate the class, which accepts a list of optional ",(0,s.jsx)(n.code,{children:"package.json"})," objects as the 1st argument."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { PackageGraph } from '@boost/common';\n\nconst graph = new PackageGraph([\n  {\n    name: '@boost/common',\n    version: '1.2.3',\n  },\n  {\n    name: '@boost/cli',\n    version: '1.0.0',\n    dependencies: {\n      '@boost/common': '^1.0.0',\n    },\n  },\n]);\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Once all packages have been defined, we can resolve our graph into 1 of 3 formats, using the\nfollowing methods. ",(0,s.jsx)(n.a,{href:"/api/common/class/PackageGraph",children:"View the API for more information on these methods"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const batch = graph.resolveBatchList();\nconst list = graph.resolveList();\nconst tree = graph.resolveTree();\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Will only resolve and return packages that have been defined. Will ",(0,s.jsx)(n.em,{children:"not"})," return non-defined\npackages found in ",(0,s.jsx)(n.code,{children:"dependencies"})," and ",(0,s.jsx)(n.code,{children:"peerDependencies"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"path-management",children:"Path management"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:(0,s.jsx)(n.code,{children:"Path"})})," class is an immutable abstraction around file/module paths and the Node.js ",(0,s.jsx)(n.code,{children:"fs"}),"\nand ",(0,s.jsx)(n.code,{children:"path"})," modules. It aims to solve cross platform and operating system related issues in a\nstraight forward way. To begin, import and instantiate the ",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:(0,s.jsx)(n.code,{children:"Path"})})," class, with either a\nsingle path, or a list of path parts that will be joined."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { Path } from '@boost/common';\n\nconst absPath = new Path('/root/some/path');\nconst relPath = new Path('some/path', '../move/around', 'again');\n"})}),"\n",(0,s.jsxs)(n.p,{children:["By default, the class operates on the defined path parts as-is. If you would prefer to operate\nagainst real or resolved paths, use the ",(0,s.jsx)(n.a,{href:"/api/common/class/Path#realPath",children:(0,s.jsx)(n.code,{children:"Path#realPath()"})})," and\n",(0,s.jsx)(n.a,{href:"/api/common/class/Path#resolve",children:(0,s.jsx)(n.code,{children:"Path#resolve()"})})," methods respectively. The current path is\n",(0,s.jsx)(n.a,{href:"https://nodejs.org/api/path.html#path_path_resolve_paths",children:"resolved against"})," the defined current\nworking directory (",(0,s.jsx)(n.code,{children:"process.cwd()"}),")."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"path.path(); // Possibly inaccurate\npath.resolve().path(); // Resolved accurately\n"})}),"\n",(0,s.jsxs)(n.p,{children:["With that being said, the class supports many convenient methods.\n",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:"View the API for a full list"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"static-factories",children:"Static factories"}),"\n",(0,s.jsxs)(n.p,{children:["The static ",(0,s.jsx)(n.a,{href:"/api/common/class/Path#create",children:(0,s.jsx)(n.code,{children:"Path.create()"})})," and\n",(0,s.jsx)(n.a,{href:"/api/common/class/Path#resolve",children:(0,s.jsx)(n.code,{children:"Path.resolve()"})})," methods can be used to factory a ",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:(0,s.jsx)(n.code,{children:"Path"})}),"\ninstance from a string or an existing instance. Especially useful when used in combination with the\n",(0,s.jsx)(n.a,{href:"/api/common#PortablePath",children:(0,s.jsx)(n.code,{children:"PortablePath"})})," type."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"Path.create('some/file/path'); // Path\n"})}),"\n",(0,s.jsx)(n.h3,{id:"resolving-lookup-paths",children:"Resolving lookup paths"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/api/common/class/PathResolver",children:(0,s.jsx)(n.code,{children:"PathResolver"})})," class can be used to find a real path amongst a list of possible\nlookups. A lookup is either a file system path or a Node.js module. If a path is found, an absolute\nresolved ",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:(0,s.jsx)(n.code,{children:"Path"})})," instance is returned, otherwise an error is thrown."]}),"\n",(0,s.jsx)(n.p,{children:"A perfect scenario for this mechanism would be finding a valid configuration file, which we'll\ndemonstrate below. Import and instantiate the class to begin."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { PathResolver } from '@boost/common';\n\nconst resolver = new PathResolver();\n\n// With a custom module resolver (can be async!)\nconst resolver = new PathResolver(customResolver);\n"})}),"\n",(0,s.jsxs)(n.p,{children:["To add a file system lookup, use the\n",(0,s.jsx)(n.a,{href:"/api/common/class/PathResolver#lookupFilePath",children:(0,s.jsx)(n.code,{children:"PathResolver#lookupFilePath()"})})," method, which\nrequires a path and an optional current working directory (defaults to ",(0,s.jsx)(n.code,{children:"process.cwd()"}),")."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Look in current directory\nresolver\n  .lookupFilePath('tool.config.js')\n  .lookupFilePath('tool.config.json')\n  .lookupFilePath('tool.config.yaml');\n\n// Look in a folder\nresolver.lookupFilePath('configs/tool.js');\n\n// Look in user's home directory\nresolver.lookupFilePath('tool.config.js', os.homedir());\n"})}),"\n",(0,s.jsxs)(n.p,{children:["And to add a Node.js module lookup, use the\n",(0,s.jsx)(n.a,{href:"/api/common/class/PathResolver#lookupNodeModule",children:(0,s.jsx)(n.code,{children:"PathResolver#lookupNodeModule()"})})," method, which\naccepts a module name or path."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Look in module (assuming index export)\nresolver.lookupNodeModule('tool-config-module');\n\n// Look in module with sub-path\nresolver.lookupNodeModule('tool-config-module/lib/configs/tool.js');\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Once all the lookup paths have been defined, the\n",(0,s.jsx)(n.a,{href:"/api/common/class/PathResolver#resolve",children:(0,s.jsx)(n.code,{children:"PathResolver#resolve()"})})," method will iterate through them\nin order until one is found. If a file system path, ",(0,s.jsx)(n.code,{children:"fs.existsSync()"})," will be used to check for\nexistence, while the ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/resolve",children:(0,s.jsx)(n.code,{children:"resolve"})})," npm package will be used for\nNode.js modules. If found, a result object will be returned with the resolved ",(0,s.jsx)(n.a,{href:"/api/common/class/Path",children:(0,s.jsx)(n.code,{children:"Path"})})," and\noriginal lookup parts."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const { originalSource, resolvedPath, type } = await resolver.resolve();\n"})}),"\n",(0,s.jsxs)(n.p,{children:["If you'd prefer to only have the resolved path returned, the\n",(0,s.jsx)(n.a,{href:"/api/common/class/PathResolver#resolvePath",children:(0,s.jsx)(n.code,{children:"PathResolver#resolvePath()"})})," method can be used\ninstead."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const resolvedPath = await resolver.resolvePath();\n"})})]})}function m(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},2548:(e,n,a)=>{a.d(n,{c:()=>r});a(6952);var s=a(8112);const t={tabItem:"tabItem_wHwb"};var o=a(1948);function r(e){let{children:n,hidden:a,className:r}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,s.c)(t.tabItem,r),hidden:a,children:n})}},240:(e,n,a)=>{a.d(n,{c:()=>u});var s=a(6952),t=a(8112),o=a(320),r=a(500),l=a(6576);const i={tabList:"tabList_J5MA",tabItem:"tabItem_l0OV"};var c=a(1948);function d(e){let{className:n,block:a,selectedValue:s,selectValue:r,tabValues:l}=e;const d=[],{blockElementScrollPositionUntilNextRender:h}=(0,o.MV)(),p=e=>{const n=e.currentTarget,a=d.indexOf(n),t=l[a].value;t!==s&&(h(n),r(t))},u=e=>{var n;let a=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{var s;const n=d.indexOf(e.currentTarget)+1;a=null!=(s=d[n])?s:d[0];break}case"ArrowLeft":{var t;const n=d.indexOf(e.currentTarget)-1;a=null!=(t=d[n])?t:d[d.length-1];break}}null==(n=a)||n.focus()};return(0,c.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.c)("tabs",{"tabs--block":a},n),children:l.map((e=>{let{value:n,label:a,attributes:o}=e;return(0,c.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>d.push(e),onKeyDown:u,onClick:p,...o,className:(0,t.c)("tabs__item",i.tabItem,null==o?void 0:o.className,{"tabs__item--active":s===n}),children:null!=a?a:n},n)}))})}function h(e){let{lazy:n,children:a,selectedValue:t}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===t));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,c.jsx)("div",{className:"margin-top--md",children:o.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==t})))})}function p(e){const n=(0,r.a)(e);return(0,c.jsxs)("div",{className:(0,t.c)("tabs-container",i.tabList),children:[(0,c.jsx)(d,{...e,...n}),(0,c.jsx)(h,{...e,...n})]})}function u(e){const n=(0,l.c)();return(0,c.jsx)(p,{...e,children:(0,r.A)(e.children)},String(n))}},500:(e,n,a)=>{a.d(n,{A:()=>c,a:()=>u});var s=a(6952),t=a(7976),o=a(2508),r=a(440),l=a(2484),i=a(900);function c(e){var n,a;return null!=(n=null==(a=s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:a.filter(Boolean))?n:[]}function d(e){const{values:n,children:a}=e;return(0,s.useMemo)((()=>{const e=null!=n?n:function(e){return c(e).map((e=>{let{props:{value:n,label:a,attributes:s,default:t}}=e;return{value:n,label:a,attributes:s,default:t}}))}(a);return function(e){const n=(0,l.w)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error('Docusaurus error: Duplicate values "'+n.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[n,a])}function h(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:a}=e;const o=(0,t.Uz)(),l=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=a?a:null}({queryString:n,groupId:a});return[(0,r._M)(l),(0,s.useCallback)((e=>{if(!l)return;const n=new URLSearchParams(o.location.search);n.set(l,e),o.replace({...o.location,search:n.toString()})}),[l,o])]}function u(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,r=d(e),[l,c]=(0,s.useState)((()=>function(e){var n;let{defaultValue:a,tabValues:s}=e;if(0===s.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(a){if(!h({value:a,tabValues:s}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+a+'" but none of its children has the corresponding value. Available values are: '+s.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return a}const t=null!=(n=s.find((e=>e.default)))?n:s[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:r}))),[u,m]=p({queryString:a,groupId:t}),[j,f]=function(e){let{groupId:n}=e;const a=function(e){return e?"docusaurus.tab."+e:null}(n),[t,o]=(0,i.IN)(a);return[t,(0,s.useCallback)((e=>{a&&o.set(e)}),[a,o])]}({groupId:t}),x=(()=>{const e=null!=u?u:j;return h({value:e,tabValues:r})?e:null})();(0,o.c)((()=>{x&&c(x)}),[x]);return{selectedValue:l,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:r}))throw new Error("Can't select invalid tab value="+e);c(e),m(e),f(e)}),[m,f,r]),tabValues:r}}},5392:(e,n,a)=>{a.d(n,{c:()=>t});var s=a(1948);function t(e){let{children:n,type:a}=e;return(0,s.jsx)("span",{className:"badge badge--"+a,children:n})}},302:(e,n,a)=>{a.d(n,{c:()=>c});var s=a(4308),t=a(3752),o=a(5392);const r={badgeGroup:"badgeGroup_syf7",apiLink:"apiLink_JWAN"};var l=a(1948);function i(e){let{children:n}=e;return(0,l.jsx)("span",{className:r.badgeGroup,children:n})}function c(e){let{api:n,backend:a,frontend:c,tooling:d}=e;return(0,l.jsxs)(l.Fragment,{children:[n&&(0,l.jsxs)(s.default,{className:r.apiLink,to:n,children:["API ",(0,l.jsx)(t.c,{})]}),(0,l.jsxs)(i,{children:[a&&(0,l.jsx)(o.c,{type:"warning",children:"Backend"}),c&&(0,l.jsx)(o.c,{type:"success",children:"Frontend"}),d&&(0,l.jsx)(o.c,{type:"primary",children:"Tooling"})]})]})}},3460:(e,n,a)=>{a.d(n,{I:()=>l,M:()=>r});var s=a(6952);const t={},o=s.createContext(t);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);