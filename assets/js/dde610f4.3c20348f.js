"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3852],{3188:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>l,default:()=>c,frontMatter:()=>i,toc:()=>r});var o=t(1948),s=t(3460);const i={},l=void 0,r=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Documentation",id:"documentation",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.img,{src:"https://img.shields.io/github/actions/workflow/status/milesj/boost/build.yml",alt:"build status"}),"\n",(0,o.jsx)(n.img,{src:"https://img.shields.io/npm/v/@boost/module",alt:"npm version"})]}),"\n",(0,o.jsxs)(n.p,{children:["Load and resolve custom file types at runtime with a more powerful Node.js ",(0,o.jsx)(n.code,{children:"require"})," replacement."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { requireModule } from '@boost/module';\n\nconst result = requireModule('./some/non-js/file.ts');\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Or with next-generation ",(0,o.jsx)(n.a,{href:"https://nodejs.org/api/module.html#customization-hooks",children:"Node.js hooks"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"node --import @boost/module/register ./path/to/entry-point.mjs\n"})}),"\n",(0,o.jsx)(n.h2,{id:"features",children:"Features"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["CommonJS based importing with ",(0,o.jsx)(n.code,{children:"requireModule()"})]}),"\n",(0,o.jsx)(n.li,{children:"CommonJS interoperability with ESM-like files"}),"\n",(0,o.jsx)(n.li,{children:"ECMAScript module based importing with a custom Node.js hook"}),"\n",(0,o.jsx)(n.li,{children:"Supported file types: TypeScript"}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"yarn add @boost/module\n"})}),"\n",(0,o.jsx)(n.h2,{id:"documentation",children:"Documentation"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://boostlib.dev/docs/module",children:"https://boostlib.dev/docs/module"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://boostlib.dev/api/module",children:"https://boostlib.dev/api/module"})}),"\n"]})]})}function c(e){void 0===e&&(e={});const{wrapper:n}={...(0,s.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},3460:(e,n,t)=>{t.d(n,{I:()=>r,M:()=>l});var o=t(6952);const s={},i=o.createContext(s);function l(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);