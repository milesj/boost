"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8122],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return g}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),s=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,u=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=s(n),g=r,m=d["".concat(u,".").concat(g)]||d[g]||p[g]||i;return n?a.createElement(m,l(l({ref:t},c),{},{components:n})):a.createElement(m,l({ref:t},c))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=d;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var s=2;s<i;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},517:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(7378);function r(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},637:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(5773),r=n(7378),i=n(6457),l=n(1429),o=n(8944),u="tabItem_WhCL";function s(e){var t,n,i,s=e.lazy,c=e.block,p=e.defaultValue,d=e.values,g=e.groupId,m=e.className,b=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=d?d:b.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),v=(0,l.duplicates)(f,(function(e,t){return e.value===t.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var h=null===p?p:null!=(t=null!=p?p:null==(n=b.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=b[0])?void 0:i.props.value;if(null!==h&&!f.some((function(e){return e.value===h})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.useTabGroupChoice)(),y=k.tabGroupChoices,N=k.setTabGroupChoices,w=(0,r.useState)(h),E=w[0],O=w[1],D=[],T=(0,l.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=g){var C=y[g];null!=C&&C!==E&&f.some((function(e){return e.value===C}))&&O(C)}var x=function(e){var t=e.currentTarget,n=D.indexOf(t),a=f[n].value;a!==E&&(T(t),O(a),null!=g&&N(g,a))},S=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=D.indexOf(e.currentTarget)+1;n=D[a]||D[0];break;case"ArrowLeft":var r=D.indexOf(e.currentTarget)-1;n=D[r]||D[D.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":c},m)},f.map((function(e){var t=e.value,n=e.label,i=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return D.push(e)},onKeyDown:S,onFocus:x,onClick:x},i,{className:(0,o.Z)("tabs__item",u,null==i?void 0:i.className,{"tabs__item--active":E===t})}),null!=n?n:t)}))),s?(0,r.cloneElement)(b.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function c(e){var t=(0,i.Z)();return r.createElement(s,(0,a.Z)({key:String(t)},e))}},297:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(7378);function r(e){var t=e.children,n=e.type;return a.createElement("span",{className:"badge badge--"+n},t)}},2723:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(7378),r=n(1884),i=n(8458),l=n(297),o="badgeGroup_syf7",u="apiLink_JWAN";function s(e){var t=e.children;return a.createElement("span",{className:o},t)}function c(e){var t=e.api,n=e.backend,o=e.frontend,c=e.tooling;return a.createElement(a.Fragment,null,t&&a.createElement(r.default,{className:u,to:t},"API ",a.createElement(i.Z,null)),a.createElement(s,null,n&&a.createElement(l.Z,{type:"warning"},"Backend"),o&&a.createElement(l.Z,{type:"success"},"Frontend"),c&&a.createElement(l.Z,{type:"primary"},"Tooling")))}},2993:function(e,t,n){n.r(t),n.d(t,{assets:function(){return g},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return c},metadata:function(){return d},toc:function(){return m}});var a=n(5773),r=n(808),i=(n(7378),n(5318)),l=n(2723),o=n(637),u=n(517),s=["components"],c={title:"Debugging"},p=void 0,d={unversionedId:"debug",id:"debug",title:"Debugging",description:"Lightweight debugging. Wraps the amazing debug library to",source:"@site/docs/debug.mdx",sourceDirName:".",slug:"/debug",permalink:"/docs/debug",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/debug.mdx",tags:[],version:"current",frontMatter:{title:"Debugging"},sidebar:"docs",previous:{title:"Crash reporting",permalink:"/docs/crash"},next:{title:"Decorators",permalink:"/docs/decorators"}},g={},m=[{value:"Installation",id:"installation",level:2},{value:"Environment variables",id:"environment-variables",level:2},{value:"Debugging",id:"debugging",level:2},{value:"Invariant messages",id:"invariant-messages",level:3},{value:"Verbose output",id:"verbose-output",level:3},{value:"Silencing output",id:"silencing-output",level:3},{value:"Test utilities",id:"test-utilities",level:2}],b={toc:m};function f(e){var t=e.components,n=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,a.Z)({},b,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(l.Z,{backend:!0,tooling:!0,api:"/api/debug",mdxType:"EnvBadges"}),(0,i.kt)("p",null,"Lightweight debugging. Wraps the amazing ",(0,i.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/debug"},"debug")," library to\nprovide additional functionality."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)(o.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,i.kt)(u.Z,{value:"yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/debug\n"))),(0,i.kt)(u.Z,{value:"npm",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/debug\n")))),(0,i.kt)("h2",{id:"environment-variables"},"Environment variables"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"BOOSTJS_DEBUG_NAMESPACE")," (",(0,i.kt)("inlineCode",{parentName:"li"},"string"),") - A prefix for all debugger namespaces when created with\n",(0,i.kt)("inlineCode",{parentName:"li"},"createDebugger()"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"BOOSTJS_DEBUG_VERBOSE")," (",(0,i.kt)("inlineCode",{parentName:"li"},"boolean"),") - Print verbose messages logged from ",(0,i.kt)("inlineCode",{parentName:"li"},"debugger.verbose()"),",\notherwise they are hidden.")),(0,i.kt)("h2",{id:"debugging"},"Debugging"),(0,i.kt)("p",null,"Like ",(0,i.kt)("a",{parentName:"p",href:"/docs/log"},"logging"),', a "debugger" is a collection of functions that write to ',(0,i.kt)("inlineCode",{parentName:"p"},"process.stderr"),".\nThe key difference is that debug messages are only displayed if the ",(0,i.kt)("inlineCode",{parentName:"p"},"DEBUG")," environment variable is\nset and contains the debugger's namespace (logic provided by the\n",(0,i.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/debug"},"debug")," package). The namespace can be defined when\ninstantiating a debugger using ",(0,i.kt)("a",{parentName:"p",href:"/api/debug/function/createDebugger"},(0,i.kt)("inlineCode",{parentName:"a"},"createDebugger")),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { createDebugger } from '@boost/debug';\n\nconst debug = createDebugger('boost');\n\nprocess.env.DEBUG = 'boost:*';\n\ndebug('Something is broken!');\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"A namespace can either be a string or an array of strings.")),(0,i.kt)("p",null,"Each debug function that logs (excluding invariants) requires a message string as the 1st argument,\nand an optional rest of arguments to interpolate into the message using\n",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/api/util.html#util_util_format_format_args"},(0,i.kt)("inlineCode",{parentName:"a"},"util.format()")),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"debug('Name: %s %s', user.first_name, user.last_name);\ndebug('Object: %O', data);\n")),(0,i.kt)("h3",{id:"invariant-messages"},"Invariant messages"),(0,i.kt)("p",null,"Invariant debugging logs either a success or a failure message, depending on the truthy evaluation\nof a condition. This can be achieved with\n",(0,i.kt)("a",{parentName:"p",href:"/api/debug/interface/Debugger#invariant"},(0,i.kt)("inlineCode",{parentName:"a"},"debugger.invariant()")),", which requires the condition to\nevaluate, a message to always display, and a success and failure message."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"debug.invariant(fs.existsSync(filePath), 'Does file exist?', 'Yes!', 'No');\n")),(0,i.kt)("h3",{id:"verbose-output"},"Verbose output"),(0,i.kt)("p",null,"Debug messages are already hidden behind the ",(0,i.kt)("inlineCode",{parentName:"p"},"DEBUG")," environment variable, but Boost takes it a step\nfurther to support verbose debugging. Messages logged with\n",(0,i.kt)("a",{parentName:"p",href:"/api/debug/interface/Debugger#verbose"},(0,i.kt)("inlineCode",{parentName:"a"},"debugger.verbose()"))," will not be displayed unless the\n",(0,i.kt)("inlineCode",{parentName:"p"},"BOOSTJS_DEBUG_VERBOSE")," environment variable is set -- even if ",(0,i.kt)("inlineCode",{parentName:"p"},"DEBUG")," is set."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"// Will not write!\ndebug.verbose('We need extra information');\n\nprocess.env.BOOSTJS_DEBUG_VERBOSE = 'true';\n\n// Will write!\ndebug.verbose('We need extra information (again)');\n")),(0,i.kt)("h3",{id:"silencing-output"},"Silencing output"),(0,i.kt)("p",null,"By default, all logged messages are immediately written when ",(0,i.kt)("inlineCode",{parentName:"p"},"DEBUG")," contains the debugger\nnamespace. To silence output for a specific debugger, call the\n",(0,i.kt)("a",{parentName:"p",href:"/api/debug/interface/Debugger#disable"},(0,i.kt)("inlineCode",{parentName:"a"},"debugger.disable()"))," function, and to re-enable, call\n",(0,i.kt)("a",{parentName:"p",href:"/api/debug/interface/Debugger#enable"},(0,i.kt)("inlineCode",{parentName:"a"},"debugger.enable()")),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"debug.disable();\n\n// Will not write!\ndebug('Something is broken!');\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Messages that are logged while silenced are ",(0,i.kt)("em",{parentName:"p"},"lost")," and are ",(0,i.kt)("em",{parentName:"p"},"not")," buffered.")),(0,i.kt)("h2",{id:"test-utilities"},"Test utilities"),(0,i.kt)("p",null,"A handful of ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/facebook/jest"},"Jest")," utilities are available in the\n",(0,i.kt)("inlineCode",{parentName:"p"},"@boost/debug/test")," module. ",(0,i.kt)("a",{parentName:"p",href:"/api/debug-test"},"View the API for a full list"),"."))}f.isMDXComponent=!0}}]);