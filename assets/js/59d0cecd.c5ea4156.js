"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5104],{8284:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>h,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>d,toc:()=>u});var r=t(1948),a=t(3460),s=t(302),o=t(240),l=t(2548);const i={title:"Logging"},c=void 0,d={id:"log",title:"Logging",description:"Lightweight level based logging system.",source:"@site/docs/log.mdx",sourceDirName:".",slug:"/log",permalink:"/docs/log",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/log.mdx",tags:[],version:"current",frontMatter:{title:"Logging"},sidebar:"docs",previous:{title:"Events",permalink:"/docs/event"},next:{title:"Modules",permalink:"/docs/module"}},h={},u=[{value:"Installation",id:"installation",level:2},{value:"Environment variables",id:"environment-variables",level:2},{value:"Logging",id:"logging",level:2},{value:"Options",id:"options",level:3},{value:"Log levels",id:"log-levels",level:3},{value:"Silencing output",id:"silencing-output",level:3},{value:"Formats",id:"formats",level:2},{value:"Metadata",id:"metadata",level:2},{value:"Transport types",id:"transport-types",level:2},{value:"ConsoleTransport",id:"consoletransport",level:3},{value:"StreamTransport",id:"streamtransport",level:3},{value:"FileTransport",id:"filetransport",level:3},{value:"RotatingFileTransport",id:"rotatingfiletransport",level:3},{value:"Test utilities",id:"test-utilities",level:2}];function g(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.M)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.c,{backend:!0,tooling:!0,api:"/api/log"}),"\n",(0,r.jsx)(n.p,{children:"Lightweight level based logging system."}),"\n",(0,r.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsxs)(o.c,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"pnpm",value:"pnpm"},{label:"npm",value:"npm"}],children:[(0,r.jsx)(l.c,{value:"yarn",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"yarn add @boost/log\n"})})}),(0,r.jsx)(l.c,{value:"pnpm",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"pnpm add @boost/log\n"})})}),(0,r.jsx)(l.c,{value:"npm",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm install @boost/log\n"})})})]}),"\n",(0,r.jsx)(n.h2,{id:"environment-variables",children:"Environment variables"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"BOOSTJS_LOG_DEFAULT_LEVEL"})," (",(0,r.jsx)(n.a,{href:"/api/log#LogLevel",children:(0,r.jsx)(n.code,{children:"LogLevel"})}),") - The default log level to use when\ncalling the logger function stand alone (the usage examples below). Defaults to the lowest level,\n",(0,r.jsx)(n.code,{children:"log"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"BOOSTJS_LOG_MAX_LEVEL"})," (",(0,r.jsx)(n.a,{href:"/api/log#LogLevel",children:(0,r.jsx)(n.code,{children:"LogLevel"})}),") - The maximum level, based on priority,\nto write to a stream. All levels higher than the maximum will be ignored. Defaults to allowing all\nlevels."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"logging",children:"Logging"}),"\n",(0,r.jsxs)(n.p,{children:['Logging is based around the concept of a "logger", which provides a set of functions of severity\nlevels to log with. Logs are written to one or many provided transports -- or ',(0,r.jsx)(n.code,{children:"console"})," if not\ndefined. To begin, instantiate a logger with ",(0,r.jsx)(n.a,{href:"/api/log/function/createLogger",children:(0,r.jsx)(n.code,{children:"createLogger"})}),", which\nreturns a function that can be used for standard level logging."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { createLogger } from '@boost/log';\n\nconst log = createLogger({ name: 'boost' });\n\nlog('Something has happened\u2026');\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Each logging function requires a message string as the 1st argument, and an optional rest of\narguments to interpolate into the message using\n",(0,r.jsx)(n.a,{href:"https://nodejs.org/api/util.html#util_util_format_format_args",children:(0,r.jsx)(n.code,{children:"util.format()"})}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"log('Name: %s %s', user.first_name, user.last_name);\nlog('Object: %O', data);\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If you would prefer to interact with a class instance, you may use the\n",(0,r.jsx)(n.a,{href:"/api/log/class/Logger",children:(0,r.jsx)(n.code,{children:"Logger"})})," class. The major difference between the class and the function, is\nthat the class only has 1 logging method, ",(0,r.jsx)(n.a,{href:"/api/log/class/Logger#log",children:(0,r.jsx)(n.code,{children:"Logger#log()"})}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { Logger } from '@boost/log';\n\nconst logger = new Logger({ name: 'boost' });\n\nlogger.log({\n  level: 'info',\n  message: 'Something else has happened\u2026',\n});\n"})}),"\n",(0,r.jsx)(n.h3,{id:"options",children:"Options"}),"\n",(0,r.jsxs)(n.p,{children:["When creating a logger, a ",(0,r.jsx)(n.a,{href:"/api/log/interface/LoggerOptions",children:(0,r.jsx)(n.code,{children:"LoggerOptions"})})," object can be passed.\nThe options ",(0,r.jsx)(n.em,{children:"cannot"})," be customized after the fact."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import chalk from 'chalk';\nimport { createLogger, StreamTransport } from '@boost/log';\n\nconst log = createLogger({\n  name: 'boost',\n  labels: {\n    error: chalk.bgRed.black.bold(' FAIL '),\n  },\n  transports: [new StreamTransport({ levels: ['error'], stream: process.stderr })],\n});\n"})}),"\n",(0,r.jsx)(n.h3,{id:"log-levels",children:"Log levels"}),"\n",(0,r.jsxs)(n.p,{children:["There are 5 distinct logging levels outside the standard level, each represented as a unique\nfunction on the logger instance. The levels in order of ",(0,r.jsx)(n.strong,{children:"priority"})," are ",(0,r.jsx)(n.code,{children:"trace"}),", ",(0,r.jsx)(n.code,{children:"debug"}),", ",(0,r.jsx)(n.code,{children:"info"}),",\n",(0,r.jsx)(n.code,{children:"warn"}),", and ",(0,r.jsx)(n.code,{children:"error"}),". Each function requires a message as the 1st argument, and an optional rest of\narguments to interpolate into the message."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"log.trace('Code path hit?');\nlog.debug('What is going on here?');\nlog.info('Systems are stable');\nlog.warn('Something is definitely going on\u2026');\nlog.error('Systems are down! %s', error.message);\n"})}),"\n",(0,r.jsx)(n.h3,{id:"silencing-output",children:"Silencing output"}),"\n",(0,r.jsxs)(n.p,{children:["By default, all logged messages are immediately written to the configured transports. To silence\noutput and disable writes, call the ",(0,r.jsx)(n.a,{href:"/api/log/interface/LoggerFunction#disable",children:(0,r.jsx)(n.code,{children:"logger.disable()"})}),"\nfunction, and to re-enable, call ",(0,r.jsx)(n.a,{href:"/api/log/interface/LoggerFunction#enable",children:(0,r.jsx)(n.code,{children:"logger.enable()"})}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"log.disable();\n\n// Will not write!\nlog.debug('Something is broken!');\n"})}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsxs)(n.p,{children:["Messages that are logged while silenced are ",(0,r.jsx)(n.em,{children:"lost"})," and are ",(0,r.jsx)(n.em,{children:"not"})," buffered."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"formats",children:"Formats"}),"\n",(0,r.jsxs)(n.p,{children:["All logs are represented as an object, known as a ",(0,r.jsx)(n.a,{href:"/api/log/interface/LogItem",children:(0,r.jsx)(n.code,{children:"LogItem"})}),". These\nitems contain metadata about the environment, the logger, and the current log message."]}),"\n",(0,r.jsxs)(n.p,{children:["Before an item is written to a transport, it must be formatted from an object into a string. This\ncan be done on a per transport basis using the\n",(0,r.jsx)(n.a,{href:"/api/log/interface/TransportOptions#format",children:(0,r.jsx)(n.code,{children:"format"})})," option, like so."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { ConsoleTransport, formats } from '@boost/log';\n\nconst transport = new ConsoleTransport({\n  format: (item) => `${item.level} ${item.message}`,\n  // Or a pre-built format\n  format: formats.json,\n});\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Boost provides formats by default, all of which are pre-configured into each built-in transport.\nFeel free to use the ",(0,r.jsx)(n.a,{href:"/api/log/namespace/formats",children:"built-in formats"}),", or customize your own!"]}),"\n",(0,r.jsx)(n.h2,{id:"metadata",children:"Metadata"}),"\n",(0,r.jsx)(n.p,{children:"Sometimes additional metadata may be required that is not found within the pre-defined log item\nfields. Metadata can be defined on the logger using an object, which is then passed to all log\nitems."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const log = createLogger({\n  name: 'boost',\n  metadata: {\n    locale: 'en',\n    region: 'eu',\n  },\n});\n"})}),"\n",(0,r.jsx)(n.p,{children:"It can also be defined per log by passing an object as the 1st argument. Metadata defined at this\nlevel will override the logger metadata."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"log({ locale: 'de' }, \"What's going on?\");\n"})}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsxs)(n.p,{children:["Fields ",(0,r.jsx)(n.code,{children:"name"}),", ",(0,r.jsx)(n.code,{children:"host"}),", and ",(0,r.jsx)(n.code,{children:"pid"})," are reserved names and cannot be used."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"transport-types",children:"Transport types"}),"\n",(0,r.jsxs)(n.p,{children:["There are multiple types of transports that can be used within a logger, all of which support a\n",(0,r.jsx)(n.a,{href:"/api/log/interface/TransportOptions",children:(0,r.jsx)(n.code,{children:"TransportOptions"})})," object. Some transports support additional\noptions, so please refer to their types."]}),"\n",(0,r.jsx)(n.h3,{id:"consoletransport",children:"ConsoleTransport"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.a,{href:"/api/log/class/ConsoleTransport",children:(0,r.jsx)(n.code,{children:"ConsoleTransport"})})," logs messages to the native ",(0,r.jsx)(n.code,{children:"console"})," and\nits corresponding level. This is the default transport when no transports are defined."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { ConsoleTransport } from '@boost/log';\n\nconst transport = new ConsoleTransport();\n"})}),"\n",(0,r.jsx)(n.h3,{id:"streamtransport",children:"StreamTransport"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.a,{href:"/api/log/class/StreamTransport",children:(0,r.jsx)(n.code,{children:"StreamTransport"})})," logs messages to any writeable stream or an\nobject that defines a ",(0,r.jsx)(n.a,{href:"/api/log/interface/Writable",children:(0,r.jsx)(n.code,{children:"write()"})})," method. Additional\n",(0,r.jsx)(n.a,{href:"/api/log/interface/StreamTransportOptions",children:(0,r.jsx)(n.code,{children:"StreamTransportOptions"})})," options may be provided."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { StreamTransport } from '@boost/log';\n\nconst transport = new StreamTransport({\n  levels: ['error', 'warn'],\n  stream: process.stderr,\n});\n"})}),"\n",(0,r.jsx)(n.h3,{id:"filetransport",children:"FileTransport"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.a,{href:"/api/log/class/FileTransport",children:(0,r.jsx)(n.code,{children:"FileTransport"})})," appends and logs messages to a file at the\ndefined path. Will automatically rotate files when a max file size is met. Additional\n",(0,r.jsx)(n.a,{href:"/api/log/interface/FileTransportOptions",children:(0,r.jsx)(n.code,{children:"FileTransportOptions"})})," options may be provided."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { FileTransport } from '@boost/log';\n\nconst transport = new FileTransport({\n  levels: ['error'],\n  path: '/var/log/error.log',\n});\n"})}),"\n",(0,r.jsx)(n.h3,{id:"rotatingfiletransport",children:"RotatingFileTransport"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.a,{href:"/api/log/class/RotatingFileTransport",children:(0,r.jsx)(n.code,{children:"RotatingFileTransport"})})," is like\n",(0,r.jsx)(n.a,{href:"/api/log/class/FileTransport",children:(0,r.jsx)(n.code,{children:"FileTransport"})}),", but also rotates files based on timestamps and a\nchosen periodic interval. Additional\n",(0,r.jsx)(n.a,{href:"/api/log/interface/RotatingFileTransportOptions",children:(0,r.jsx)(n.code,{children:"RotatingFileTransportOptions"})})," options may be\nprovided."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { RotatingFileTransport } from '@boost/log';\n\nconst transport = new RotatingFileTransport({\n  levels: ['error'],\n  path: '/var/log/error.log',\n  rotation: 'daily',\n});\n"})}),"\n",(0,r.jsx)(n.h2,{id:"test-utilities",children:"Test utilities"}),"\n",(0,r.jsxs)(n.p,{children:["A handful of ",(0,r.jsx)(n.a,{href:"https://vitest.dev/",children:"Vitest"})," utilities are available in the ",(0,r.jsx)(n.code,{children:"@boost/log/test"})," module.\n",(0,r.jsx)(n.a,{href:"/api/log-test",children:"View the API for a full list"}),"."]})]})}function p(e={}){const{wrapper:n}={...(0,a.M)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},2548:(e,n,t)=>{t.d(n,{c:()=>o});t(6952);var r=t(8112);const a={tabItem:"tabItem_wHwb"};var s=t(1948);function o(e){let{children:n,hidden:t,className:o}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.c)(a.tabItem,o),hidden:t,children:n})}},240:(e,n,t)=>{t.d(n,{c:()=>g});var r=t(6952),a=t(8112),s=t(320),o=t(500),l=t(6576);const i={tabList:"tabList_J5MA",tabItem:"tabItem_l0OV"};var c=t(1948);function d(e){let{className:n,block:t,selectedValue:r,selectValue:o,tabValues:l}=e;const d=[],{blockElementScrollPositionUntilNextRender:h}=(0,s.MV)(),u=e=>{const n=e.currentTarget,t=d.indexOf(n),a=l[t].value;a!==r&&(h(n),o(a))},g=e=>{var n;let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{var r;const n=d.indexOf(e.currentTarget)+1;t=null!=(r=d[n])?r:d[0];break}case"ArrowLeft":{var a;const n=d.indexOf(e.currentTarget)-1;t=null!=(a=d[n])?a:d[d.length-1];break}}null==(n=t)||n.focus()};return(0,c.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.c)("tabs",{"tabs--block":t},n),children:l.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,c.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>d.push(e),onKeyDown:g,onClick:u,...s,className:(0,a.c)("tabs__item",i.tabItem,null==s?void 0:s.className,{"tabs__item--active":r===n}),children:null!=t?t:n},n)}))})}function h(e){let{lazy:n,children:t,selectedValue:a}=e;const s=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,c.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function u(e){const n=(0,o.a)(e);return(0,c.jsxs)("div",{className:(0,a.c)("tabs-container",i.tabList),children:[(0,c.jsx)(d,{...e,...n}),(0,c.jsx)(h,{...e,...n})]})}function g(e){const n=(0,l.c)();return(0,c.jsx)(u,{...e,children:(0,o.A)(e.children)},String(n))}},500:(e,n,t)=>{t.d(n,{A:()=>c,a:()=>g});var r=t(6952),a=t(7976),s=t(2508),o=t(440),l=t(2484),i=t(900);function c(e){var n,t;return null!=(n=null==(t=r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:t.filter(Boolean))?n:[]}function d(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=null!=n?n:function(e){return c(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:a}}=e;return{value:n,label:t,attributes:r,default:a}}))}(t);return function(e){const n=(0,l.w)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error('Docusaurus error: Duplicate values "'+n.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[n,t])}function h(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function u(e){let{queryString:n=!1,groupId:t}=e;const s=(0,a.Uz)(),l=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=t?t:null}({queryString:n,groupId:t});return[(0,o._M)(l),(0,r.useCallback)((e=>{if(!l)return;const n=new URLSearchParams(s.location.search);n.set(l,e),s.replace({...s.location,search:n.toString()})}),[l,s])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,o=d(e),[l,c]=(0,r.useState)((()=>function(e){var n;let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:r}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+t+'" but none of its children has the corresponding value. Available values are: '+r.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return t}const a=null!=(n=r.find((e=>e.default)))?n:r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:o}))),[g,p]=u({queryString:t,groupId:a}),[m,f]=function(e){let{groupId:n}=e;const t=function(e){return e?"docusaurus.tab."+e:null}(n),[a,s]=(0,i.IN)(t);return[a,(0,r.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:a}),x=(()=>{const e=null!=g?g:m;return h({value:e,tabValues:o})?e:null})();(0,s.c)((()=>{x&&c(x)}),[x]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:o}))throw new Error("Can't select invalid tab value="+e);c(e),p(e),f(e)}),[p,f,o]),tabValues:o}}},5392:(e,n,t)=>{t.d(n,{c:()=>a});var r=t(1948);function a(e){let{children:n,type:t}=e;return(0,r.jsx)("span",{className:"badge badge--"+t,children:n})}},302:(e,n,t)=>{t.d(n,{c:()=>c});var r=t(4308),a=t(3752),s=t(5392);const o={badgeGroup:"badgeGroup_syf7",apiLink:"apiLink_JWAN"};var l=t(1948);function i(e){let{children:n}=e;return(0,l.jsx)("span",{className:o.badgeGroup,children:n})}function c(e){let{api:n,backend:t,frontend:c,tooling:d}=e;return(0,l.jsxs)(l.Fragment,{children:[n&&(0,l.jsxs)(r.default,{className:o.apiLink,to:n,children:["API ",(0,l.jsx)(a.c,{})]}),(0,l.jsxs)(i,{children:[t&&(0,l.jsx)(s.c,{type:"warning",children:"Backend"}),c&&(0,l.jsx)(s.c,{type:"success",children:"Frontend"}),d&&(0,l.jsx)(s.c,{type:"primary",children:"Tooling"})]})]})}},3460:(e,n,t)=>{t.d(n,{I:()=>l,M:()=>o});var r=t(6952);const a={},s=r.createContext(a);function o(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);