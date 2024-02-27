"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6688],{4556:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>t});var r=s(1948),i=s(3460);const o={},l="Errors",c={id:"internal/errors",title:"Errors",description:"Each package should contain a scoped error class, created with the @boost/internal package's",source:"@site/docs/internal/errors.md",sourceDirName:"internal",slug:"/internal/errors",permalink:"/docs/internal/errors",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/internal/errors.md",tags:[],version:"current",frontMatter:{}},d={},t=[{value:"Code guidelines",id:"code-guidelines",level:2},{value:"Interpolation",id:"interpolation",level:2}];function a(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,i.M)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"errors",children:"Errors"}),"\n",(0,r.jsxs)(n.p,{children:["Each package should contain a scoped error class, created with the ",(0,r.jsx)(n.code,{children:"@boost/internal"})," package's\n",(0,r.jsx)(n.code,{children:"createScopedError"})," function. This function requires a mapping of error codes to error messages."]}),"\n",(0,r.jsx)(n.h2,{id:"code-guidelines",children:"Code guidelines"}),"\n",(0,r.jsxs)(n.p,{children:["Each code should follow the format of ",(0,r.jsx)(n.code,{children:"<feature>_<category>"}),", where category is in the form of one\nof the following:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"UNKNOWN"}),", ",(0,r.jsx)(n.code,{children:"UNKNOWN_*"})," - A value is unknown."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"UNSUPPORTED"}),", ",(0,r.jsx)(n.code,{children:"UNSUPPORTED_*"})," - A value is not supported currently."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"INVALID_*"})," - A value is invalid."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"REQUIRED"}),", ",(0,r.jsx)(n.code,{children:"REQUIRED_*"})," - A value is missing."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"DEFINED"}),", ",(0,r.jsx)(n.code,{children:"PROVIDED"})," - A value already exists."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"ONLY_*"})," - Only ",(0,r.jsx)(n.em,{children:"this"})," can be used."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"NO"}),", ",(0,r.jsx)(n.code,{children:"NON"}),", ",(0,r.jsx)(n.code,{children:"NOT"})," - Disallow a specific value or symbol from being used."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"*"})," - Other applicable actions/verbs."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"interpolation",children:"Interpolation"}),"\n",(0,r.jsx)(n.p,{children:"The following interpolated values should be wrapped with double quotes:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"User provided"}),"\n",(0,r.jsx)(n.li,{children:"File paths"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The following values should use backticks."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Code provided values"}),"\n",(0,r.jsxs)(n.li,{children:["Hard coded file names (",(0,r.jsx)(n.code,{children:"package.json"}),", etc)"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},3460:(e,n,s)=>{s.d(n,{I:()=>c,M:()=>l});var r=s(6952);const i={},o=r.createContext(i);function l(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);