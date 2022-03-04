"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2322],{5318:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return d}});var r=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),m=c(n),d=o,f=m["".concat(p,".").concat(d)]||m[d]||u[d]||a;return n?r.createElement(f,l(l({ref:t},s),{},{components:n})):r.createElement(f,l({ref:t},s))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var c=2;c<a;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6188:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return d},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return u}});var r=n(5773),o=n(808),a=(n(7378),n(5318)),l=["components"],i={title:"Components"},p=void 0,c={unversionedId:"cli/components",id:"cli/components",title:"Components",description:"Boost provides the following components for use within your programs. All components can be imported",source:"@site/docs/cli/components.md",sourceDirName:"cli",slug:"/cli/components",permalink:"/docs/cli/components",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/cli/components.md",tags:[],version:"current",frontMatter:{title:"Components"},sidebar:"docs",previous:{title:"Overview",permalink:"/docs/cli"},next:{title:"Prompts",permalink:"/docs/cli/prompts"}},s={},u=[{value:"Header",id:"header",level:2},{value:"Help",id:"help",level:2},{value:"Failure",id:"failure",level:2},{value:"Style",id:"style",level:2}],m={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Boost provides the following components for use within your programs. All components can be imported\nfrom ",(0,a.kt)("inlineCode",{parentName:"p"},"@boost/cli/react"),"."),(0,a.kt)("h2",{id:"header"},"Header"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"/api/cli/function/Header"},(0,a.kt)("inlineCode",{parentName:"a"},"Header"))," component is simply that, a header! It renders an inverted\nbackground, with bold and uppercased text, and appropriate margins. It's what the ",(0,a.kt)("a",{parentName:"p",href:"#help"},"help")," and\n",(0,a.kt)("a",{parentName:"p",href:"#failure"},"failure")," menus use to separate and denote sections."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Header } from '@boost/cli';\n\n<Header label=\"About\" />;\n")),(0,a.kt)("h2",{id:"help"},"Help"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"/api/cli/function/Help"},(0,a.kt)("inlineCode",{parentName:"a"},"Help"))," component can be used to render elegant command usage and help\nmenus. It's a very complex component that supports everything from command metadata to variadic\nparams, all through the following props (all optional)."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Help } from '@boost/cli';\n\n<Help\n    header=\"Info\"\n    config={{ description: 'This is a very cool program', deprecated: true }}\n    params={[\n        {\n            description: 'Name',\n            type: 'string',\n        },\n    ]}\n/>;\n")),(0,a.kt)("h2",{id:"failure"},"Failure"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"/api/cli/class/Failure"},(0,a.kt)("inlineCode",{parentName:"a"},"Failure"))," component can be used to render a beautiful failure menu,\nfor an error and its stack trace. The ",(0,a.kt)("inlineCode",{parentName:"p"},"error")," prop must be provided with an ",(0,a.kt)("inlineCode",{parentName:"p"},"Error")," instance."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Failure } from '@boost/cli';\n\n<Failure error={new Error('Something is broken!')} />;\n")),(0,a.kt)("h2",{id:"style"},"Style"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"/api/cli/function/Style"},(0,a.kt)("inlineCode",{parentName:"a"},"Style"))," component is special in that it renders and applies colors\nbased on the ",(0,a.kt)("a",{parentName:"p",href:"/docs/cli#themes"},"chosen theme"),". It accomplishes this through the ",(0,a.kt)("inlineCode",{parentName:"p"},"type")," prop, which\naccepts one of the theme palette names."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Style } from '@boost/cli';\n\n<Style type=\"success\">Downloaded 123 packages</Style>;\n")),(0,a.kt)("p",null,"Furthermore, it also supports text styling similar to Ink's ",(0,a.kt)("inlineCode",{parentName:"p"},"Text")," component. This uses\n",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/chalk"},"chalk")," under the hood."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'<Style bold type="failure">\n    Failed to download packages\n</Style>\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"It's highly encouraged to use this component for all color based styling, so that consumers can\nalways use their chosen theme!")))}d.isMDXComponent=!0}}]);