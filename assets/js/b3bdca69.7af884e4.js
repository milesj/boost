"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[907],{5318:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),f=s(n),m=o,d=f["".concat(p,".").concat(m)]||f[m]||c[m]||i;return n?r.createElement(d,a(a({ref:t},u),{},{components:n})):r.createElement(d,a({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var s=2;s<i;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},445:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return l},toc:function(){return s}});var r=n(5773),o=n(808),i=(n(7378),n(5318)),a=["components"],l={},p=void 0,s=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Documentation",id:"documentation",level:2}],u={toc:s};function c(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("img",{parentName:"p",src:"https://img.shields.io/github/workflow/status/milesj/boost/Build",alt:"build status"}),"\n",(0,i.kt)("img",{parentName:"p",src:"https://img.shields.io/npm/v/@boost/pipeline",alt:"npm version"})),(0,i.kt)("p",null,"Pipe an input through a series of routines and tasks to produce an output, or simply, run logic in a\nseries of stages."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { Context, WaterfallPipeline } from '@boost/pipeline';\n\nconst ast = new WaterfallPipeline(new Context(), filePath)\n  .pipe('Parsing AST', parseAst)\n  .pipe('Linting rules', runLintsOnAst)\n  .pipe('Transforming nodes', transformNodesOnAst)\n  .pipe('Writing contents', writeAstToFile)\n  .run();\n")),(0,i.kt)("h2",{id:"features"},"Features"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Parallel and serial based processing pipelines."),(0,i.kt)("li",{parentName:"ul"},"Supports 2 types of work units: tasks and routines."),(0,i.kt)("li",{parentName:"ul"},"Pooling and aggregated implementations for computation heavy or complex logic."),(0,i.kt)("li",{parentName:"ul"},"Contextually aware executions.")),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"yarn add @boost/pipeline\n")),(0,i.kt)("h2",{id:"documentation"},"Documentation"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://boostlib.dev/docs/pipeline"},"https://boostlib.dev/docs/pipeline")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://boostlib.dev/api/pipeline"},"https://boostlib.dev/api/pipeline"))))}c.isMDXComponent=!0}}]);