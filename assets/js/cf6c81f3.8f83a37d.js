"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5516],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(n),d=a,f=m["".concat(s,".").concat(d)]||m[d]||p[d]||l;return n?r.createElement(f,o(o({ref:t},c),{},{components:n})):r.createElement(f,o({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var u=2;u<l;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8458:function(e,t,n){n.d(t,{Z:function(){return l}});var r=n(7378),a="iconExternalLink_pqex",l=function(e){var t=e.width,n=void 0===t?13.5:t,l=e.height,o=void 0===l?13.5:l;return r.createElement("svg",{width:n,height:o,"aria-hidden":"true",viewBox:"0 0 24 24",className:a},r.createElement("path",{fill:"currentColor",d:"M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"}))}},517:function(e,t,n){var r=n(7378);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},2120:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(5773),a=n(7378),l=n(6457),o=n(4956);var i=function(){var e=(0,a.useContext)(o.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=n(1202),u=n(8944),c="tabItem_c0e5";function p(e){var t,n,r,l=e.lazy,o=e.block,p=e.defaultValue,m=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=m?m:v.map((function(e){var t=e.props;return{value:t.value,label:t.label}})),b=(0,s.duplicates)(h,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===p?p:null!=(t=null!=p?p:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(r=v[0])?void 0:r.props.value;if(null!==g&&!h.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=i(),y=k.tabGroupChoices,w=k.setTabGroupChoices,N=(0,a.useState)(g),T=N[0],E=N[1],x=[],O=(0,s.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=d){var j=y[d];null!=j&&j!==T&&h.some((function(e){return e.value===j}))&&E(j)}var Z=function(e){var t=e.currentTarget,n=x.indexOf(t),r=h[n].value;r!==T&&(O(t),E(r),null!=d&&w(d,r))},C=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=x.indexOf(e.currentTarget)+1;n=x[r]||x[0];break;case"ArrowLeft":var a=x.indexOf(e.currentTarget)-1;n=x[a]||x[x.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.Z)("tabs",{"tabs--block":o},f)},h.map((function(e){var t=e.value,n=e.label;return a.createElement("li",{role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,className:(0,u.Z)("tabs__item",c,{"tabs__item--active":T===t}),key:t,ref:function(e){return x.push(e)},onKeyDown:C,onFocus:Z,onClick:Z},null!=n?n:t)}))),l?(0,a.cloneElement)(v.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==T})}))))}function m(e){var t=(0,l.Z)();return a.createElement(p,(0,r.Z)({key:String(t)},e))}},4956:function(e,t,n){var r=(0,n(7378).createContext)(void 0);t.Z=r},297:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7378);function a(e){var t=e.children,n=e.type;return r.createElement("span",{className:"badge badge--"+n},t)}},2723:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(7378),a=n(1884),l=n(8458),o=n(297),i="badgeGroup_2HOO",s="apiLink_32Vk";function u(e){var t=e.children;return r.createElement("span",{className:i},t)}function c(e){var t=e.api,n=e.backend,i=e.frontend,c=e.tooling;return r.createElement(r.Fragment,null,t&&r.createElement(a.default,{className:s,to:t},"API ",r.createElement(l.Z,null)),r.createElement(u,null,n&&r.createElement(o.Z,{type:"warning"},"Backend"),i&&r.createElement(o.Z,{type:"success"},"Frontend"),c&&r.createElement(o.Z,{type:"primary"},"Tooling")))}},1180:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return p},metadata:function(){return m},toc:function(){return d},default:function(){return v}});var r=n(5773),a=n(808),l=(n(7378),n(5318)),o=n(2723),i=n(2120),s=n(517),u=["components"],c={title:"Terminal utilities"},p=void 0,m={unversionedId:"terminal",id:"terminal",isDocsHomePage:!1,title:"Terminal utilities",description:"A collection of utilities for managing and interacting with a terminal.",source:"@site/docs/terminal.mdx",sourceDirName:".",slug:"/terminal",permalink:"/docs/terminal",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/terminal.mdx",tags:[],version:"current",frontMatter:{title:"Terminal utilities"},sidebar:"docs",previous:{title:"Plugins",permalink:"/docs/plugin"},next:{title:"Translations",permalink:"/docs/translate"}},d=[{value:"Installation",id:"installation",children:[],level:2},{value:"Cursor",id:"cursor",children:[],level:2},{value:"Figures",id:"figures",children:[],level:2},{value:"Screen",id:"screen",children:[],level:2},{value:"Styles",id:"styles",children:[],level:2},{value:"Text",id:"text",children:[],level:2}],f={toc:d};function v(e){var t=e.components,n=(0,a.Z)(e,u);return(0,l.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(o.Z,{tooling:!0,api:"/api/terminal",mdxType:"EnvBadges"}),(0,l.kt)("p",null,"A collection of utilities for managing and interacting with a terminal."),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/terminal\n"))),(0,l.kt)(s.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/terminal\n")))),(0,l.kt)("p",null,"There are many terminal based libraries and utilities available in the npm ecosystem, many of which\nBoost consolidates into a single package. The currently supported are as follows."),(0,l.kt)("h2",{id:"cursor"},"Cursor"),(0,l.kt)("p",null,"The ",(0,l.kt)("a",{parentName:"p",href:"/api/terminal/namespace/cursor"},(0,l.kt)("inlineCode",{parentName:"a"},"cursor"))," object provides a set of\n",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/ansi-escapes"},"ANSI escapes codes")," for use in manipulating the\nterminal cursor."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { cursor } from '@boost/terminal';\n\nprocess.stdout.write(cursor.to(10, 10));\n")),(0,l.kt)("h2",{id:"figures"},"Figures"),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"figures")," object provides a set of cross-platform symbols.\n",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/figures"},"View the official npm package for a full list"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { figures } from '@boost/terminal';\n\nprocess.stdout.write(figures.tick);\n")),(0,l.kt)("h2",{id:"screen"},"Screen"),(0,l.kt)("p",null,"The ",(0,l.kt)("a",{parentName:"p",href:"/api/terminal/namespace/screen"},(0,l.kt)("inlineCode",{parentName:"a"},"screen"))," object provides a set of\n",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/ansi-escapes"},"ANSI escapes codes")," for use in manipulating the\nterminal screen."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { screen } from '@boost/terminal';\n\nprocess.stdout.write(screen.eraseLine);\n")),(0,l.kt)("h2",{id:"styles"},"Styles"),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"style")," export is an instance of ",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/chalk"},"chalk"),", for use in simple\ncolor and text styling."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { style } from '@boost/terminal';\n\nconst pass = style.bgGreen.black.bold(' PASS ');\n")),(0,l.kt)("h2",{id:"text"},"Text"),(0,l.kt)("p",null,"A handful of functions can be used to operate on ANSI-aware strings.\n",(0,l.kt)("a",{parentName:"p",href:"/api/terminal#Index"},"View the API for a full list of functions"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { calculateWidth } from '@boost/terminal';\n\ncalculateWidth('\u53e4'); // 2\n")))}v.isMDXComponent=!0}}]);