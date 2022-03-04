"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5467],{5318:function(e,t,r){r.d(t,{Zo:function(){return m},kt:function(){return d}});var n=r(7378);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},m=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),u=s(r),d=a,f=u["".concat(p,".").concat(d)]||u[d]||c[d]||o;return r?n.createElement(f,i(i({ref:t},m),{},{components:r})):n.createElement(f,i({ref:t},m))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},5518:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return l},toc:function(){return s}});var n=r(5773),a=r(808),o=(r(7378),r(5318)),i=["components"],l={},p=void 0,s=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Documentation",id:"documentation",level:2}],m={toc:s};function c(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://travis-ci.org/milesj/boost"},(0,o.kt)("img",{parentName:"a",src:"https://travis-ci.org/milesj/boost.svg?branch=master",alt:"Build Status"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@boost/cli"},(0,o.kt)("img",{parentName:"a",src:"https://badge.fury.io/js/%40boost%2Fcli.svg",alt:"npm version"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@boost/cli"},(0,o.kt)("img",{parentName:"a",src:"https://david-dm.org/milesj/boost.svg?path=packages/cli",alt:"npm deps"}))),(0,o.kt)("p",null,"An interactive command line program builder, powered by ",(0,o.kt)("a",{parentName:"p",href:"https://reactjs.org/"},"React")," and ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/vadimdemedes/ink"},"Ink"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Program } from '@boost/cli';\nimport BuildCommand from './commands/Build';\nimport CleanCommand from './commands/Clean';\n\nconst program = new Program({\n    bin: 'boost',\n    name: 'Boost',\n    version: '1.2.3',\n});\n\nprogram.register(new BuildCommand());\nprogram.register(new CleanCommand());\n\nawait program.runAndExit(process.argv);\n")),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Supports common ",(0,o.kt)("a",{parentName:"li",href:"https://www.npmjs.com/package/@boost/args"},"argument features")," like commands, options, flags, parameters, and more."),(0,o.kt)("li",{parentName:"ul"},"Export a stand-alone or command-based CLI program binary."),(0,o.kt)("li",{parentName:"ul"},"Write declarative commands with decorators, or imperative commands with static properties."),(0,o.kt)("li",{parentName:"ul"},"Write shorthand proxy commands for small one offs."),(0,o.kt)("li",{parentName:"ul"},"Renders interface using ",(0,o.kt)("a",{parentName:"li",href:"https://reactjs.org/"},"React")," and ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/vadimdemedes/ink"},"Ink")," at 16 FPS, or output simple strings."),(0,o.kt)("li",{parentName:"ul"},"Outputs beautiful help, usage, error, and index menus."),(0,o.kt)("li",{parentName:"ul"},"Buffers console logs to avoid render tearing."),(0,o.kt)("li",{parentName:"ul"},"Apply middleware to the argv list, or to the parsed arguments."),(0,o.kt)("li",{parentName:"ul"},"Customize output colors using Boost-based terminal themes.")),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"yarn add @boost/cli react\n")),(0,o.kt)("h2",{id:"documentation"},"Documentation"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://boostlib.dev/docs/cli"},"https://boostlib.dev/docs/cli")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://boostlib.dev/api/cli"},"https://boostlib.dev/api/cli"))),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/milesj/boost/master/website/static/img/cli/program.png",alt:"CLI example"})))}c.isMDXComponent=!0}}]);