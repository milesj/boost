"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4264],{2800:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>l,default:()=>p,frontMatter:()=>o,toc:()=>r});var i=t(1948),s=t(3460);const o={},l=void 0,r=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Documentation",id:"documentation",level:2}];function a(e){const n={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.M)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.img,{src:"https://img.shields.io/github/actions/workflow/status/milesj/boost/build.yml",alt:"build status"}),"\n",(0,i.jsx)(n.img,{src:"https://img.shields.io/npm/v/@boost/pipeline",alt:"npm version"})]}),"\n",(0,i.jsx)(n.p,{children:"Pipe an input through a series of routines and tasks to produce an output, or simply, run logic in a\nseries of stages."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { Context, WaterfallPipeline } from '@boost/pipeline';\n\nconst ast = new WaterfallPipeline(new Context(), filePath)\n  .pipe('Parsing AST', parseAst)\n  .pipe('Linting rules', runLintsOnAst)\n  .pipe('Transforming nodes', transformNodesOnAst)\n  .pipe('Writing contents', writeAstToFile)\n  .run();\n"})}),"\n",(0,i.jsx)(n.h2,{id:"features",children:"Features"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Parallel and serial based processing pipelines."}),"\n",(0,i.jsx)(n.li,{children:"Supports 2 types of work units: tasks and routines."}),"\n",(0,i.jsx)(n.li,{children:"Pooling and aggregated implementations for computation heavy or complex logic."}),"\n",(0,i.jsx)(n.li,{children:"Contextually aware executions."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"yarn add @boost/pipeline\n"})}),"\n",(0,i.jsx)(n.h2,{id:"documentation",children:"Documentation"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://boostlib.dev/docs/pipeline",children:"https://boostlib.dev/docs/pipeline"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://boostlib.dev/api/pipeline",children:"https://boostlib.dev/api/pipeline"})}),"\n"]})]})}function p(e){void 0===e&&(e={});const{wrapper:n}={...(0,s.M)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},3460:(e,n,t)=>{t.d(n,{I:()=>r,M:()=>l});var i=t(6952);const s={},o=i.createContext(s);function l(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);