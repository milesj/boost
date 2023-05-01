"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5997],{5318:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),c=p(n),d=o,h=c["".concat(s,".").concat(d)]||c[d]||u[d]||a;return n?r.createElement(h,i(i({ref:t},m),{},{components:n})):r.createElement(h,i({ref:t},m))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4802:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var r=n(5773),o=n(808),a=(n(7378),n(5318)),i=["components"],l={title:"4.0 migration",sidebar_label:"4.0"},s=void 0,p={unversionedId:"migrate/4.0",id:"migrate/4.0",title:"4.0 migration",description:"This is a rather simple release, as the APIs themselves are relatively stable. The biggest changes",source:"@site/docs/migrate/4.0.md",sourceDirName:"migrate",slug:"/migrate/4.0",permalink:"/docs/migrate/4.0",draft:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/migrate/4.0.md",tags:[],version:"current",frontMatter:{title:"4.0 migration",sidebar_label:"4.0"},sidebar:"docs",previous:{title:"3.0",permalink:"/docs/migrate/3.0"}},m={},u=[{value:"All packages",id:"all-packages",level:2},{value:"Migrated to CommonJS (<code>.cjs</code>)",id:"migrated-to-commonjs-cjs",level:3},{value:"Migrated to Node.js <code>exports</code>",id:"migrated-to-nodejs-exports",level:3},{value:"@boost/module",id:"boostmodule",level:2},{value:"Updated ESM loader paths",id:"updated-esm-loader-paths",level:3}],c={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This is a rather simple release, as the APIs themselves are relatively stable. The biggest changes\nare migrating to ",(0,a.kt)("inlineCode",{parentName:"p"},".cjs")," and utilizing Node.js package ",(0,a.kt)("inlineCode",{parentName:"p"},"exports"),", both in preparation for migrating\nto ECMAScript modules (",(0,a.kt)("inlineCode",{parentName:"p"},".mjs"),")."),(0,a.kt)("h2",{id:"all-packages"},"All packages"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Requires TypeScript v4.7 or greater."),(0,a.kt)("li",{parentName:"ul"},"Dropped Node.js v12 support. Now requires v14.15 and above."),(0,a.kt)("li",{parentName:"ul"},"Updated many dependencies to their latest major version.")),(0,a.kt)("h3",{id:"migrated-to-commonjs-cjs"},"Migrated to CommonJS (",(0,a.kt)("inlineCode",{parentName:"h3"},".cjs"),")"),(0,a.kt)("p",null,"With the help of ",(0,a.kt)("a",{parentName:"p",href:"https://packemon.dev/"},"Packemon"),", all packages are now shipped as CommonJS\n(",(0,a.kt)("inlineCode",{parentName:"p"},".cjs"),"). This change is an initial step before migrating entirely to ECMAScript modules (which may\nbe the next major version), as it unlocked the ability to also ship\n",(0,a.kt)("a",{parentName:"p",href:"https://packemon.dev/docs/features#automatic-mjs-wrappers-for-cjs-inputs"},(0,a.kt)("inlineCode",{parentName:"a"},".mjs")," wrappers for our package entry points"),".\nWithout this wrapper, named/default imports would ",(0,a.kt)("em",{parentName:"p"},"not")," work correctly within ",(0,a.kt)("inlineCode",{parentName:"p"},".mjs")," files."),(0,a.kt)("p",null,"We don't expect this change to cause issues, but we wanted to document it incase you happen to run\ninto weird module problems!"),(0,a.kt)("h3",{id:"migrated-to-nodejs-exports"},"Migrated to Node.js ",(0,a.kt)("inlineCode",{parentName:"h3"},"exports")),(0,a.kt)("p",null,"All packages now utilize the new ",(0,a.kt)("inlineCode",{parentName:"p"},"package.json"),"\n",(0,a.kt)("a",{parentName:"p",href:"https://nodejs.org/api/packages.html#package-entry-points"},(0,a.kt)("inlineCode",{parentName:"a"},"exports")," feature"),". For the most part,\nif you're importing from Boost modules using the package index, then this shouldn't affect you.\nHowever, if you're importing subpaths from Boost modules, like ",(0,a.kt)("inlineCode",{parentName:"p"},"@boost/common/test")," or\n",(0,a.kt)("inlineCode",{parentName:"p"},"@boost/cli/react"),", then these may no longer work depending on the tooling you're using. The\nfollowing minimum versions of popular tools must now be used:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Jest v28"),(0,a.kt)("li",{parentName:"ul"},"TypeScript v4.7"),(0,a.kt)("li",{parentName:"ul"},"Webpack v5")),(0,a.kt)("p",null,"Another side effect of this change is that our internal files (those in ",(0,a.kt)("inlineCode",{parentName:"p"},"lib/")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"cjs/"),") can no\nlonger be directly imported!"),(0,a.kt)("h2",{id:"boostmodule"},"@boost/module"),(0,a.kt)("h3",{id:"updated-esm-loader-paths"},"Updated ESM loader paths"),(0,a.kt)("p",null,"Because of our move to ",(0,a.kt)("a",{parentName:"p",href:"#migrated-to-nodejs-exports"},(0,a.kt)("inlineCode",{parentName:"a"},"exports")),", the paths to our ESM loader files\nhave changed to the following:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"@boost/module/loader.mjs")," -> ",(0,a.kt)("inlineCode",{parentName:"li"},"@boost/module/loader")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"@boost/module/loader/typescript.mjs")," -> ",(0,a.kt)("inlineCode",{parentName:"li"},"@boost/module/loader-typescript"))))}d.isMDXComponent=!0}}]);