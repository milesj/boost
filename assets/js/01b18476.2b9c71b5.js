"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1477],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7378);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=r.createContext({}),p=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),m=i,f=d["".concat(u,".").concat(m)]||d[m]||s[m]||a;return n?r.createElement(f,o(o({ref:t},c),{},{components:n})):r.createElement(f,o({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4020:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return s}});var r=n(5773),i=n(808),a=(n(7378),n(5318)),o=["components"],l={},u="Errors",p={unversionedId:"internal/errors",id:"internal/errors",title:"Errors",description:"Each package should contain a scoped error class, created with the @boost/internal package's",source:"@site/docs/internal/errors.md",sourceDirName:"internal",slug:"/internal/errors",permalink:"/docs/internal/errors",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/internal/errors.md",tags:[],version:"current",frontMatter:{}},c={},s=[{value:"Code guidelines",id:"code-guidelines",level:2},{value:"Interpolation",id:"interpolation",level:2}],d={toc:s};function m(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"errors"},"Errors"),(0,a.kt)("p",null,"Each package should contain a scoped error class, created with the ",(0,a.kt)("inlineCode",{parentName:"p"},"@boost/internal")," package's\n",(0,a.kt)("inlineCode",{parentName:"p"},"createScopedError")," function. This function requires a mapping of error codes to error messages."),(0,a.kt)("h2",{id:"code-guidelines"},"Code guidelines"),(0,a.kt)("p",null,"Each code should follow the format of ",(0,a.kt)("inlineCode",{parentName:"p"},"<feature>_<category>"),", where category is in the form of one\nof the following:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"UNKNOWN"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"UNKNOWN_*")," - A value is unknown."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"UNSUPPORTED"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"UNSUPPORTED_*")," - A value is not supported currently."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"INVALID_*")," - A value is invalid."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"REQUIRED"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"REQUIRED_*")," - A value is missing."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"DEFINED"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"PROVIDED")," - A value already exists."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"ONLY_*")," - Only ",(0,a.kt)("em",{parentName:"li"},"this")," can be used."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"NO"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"NON"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"NOT")," - Disallow a specific value or symbol from being used."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"*")," - Other applicable actions/verbs.")),(0,a.kt)("h2",{id:"interpolation"},"Interpolation"),(0,a.kt)("p",null,"The following interpolated values should be wrapped with double quotes:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"User provided"),(0,a.kt)("li",{parentName:"ul"},"File paths")),(0,a.kt)("p",null,"The following values should use backticks."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Code provided values"),(0,a.kt)("li",{parentName:"ul"},"Hard coded file names (",(0,a.kt)("inlineCode",{parentName:"li"},"package.json"),", etc)")))}m.isMDXComponent=!0}}]);