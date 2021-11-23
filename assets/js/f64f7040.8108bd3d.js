"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2758],{5318:function(e,r,n){n.d(r,{Zo:function(){return c},kt:function(){return m}});var t=n(7378);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function i(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=t.createContext({}),s=function(e){var r=t.useContext(u),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},c=function(e){var r=s(e.components);return t.createElement(u.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||o;return n?t.createElement(f,l(l({ref:r},c),{},{components:n})):t.createElement(f,l({ref:r},c))}));function m(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var u in r)hasOwnProperty.call(r,u)&&(i[u]=r[u]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var s=2;s<o;s++)l[s]=n[s];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8458:function(e,r,n){n.d(r,{Z:function(){return o}});var t=n(7378),a="iconExternalLink_pqex",o=function(e){var r=e.width,n=void 0===r?13.5:r,o=e.height,l=void 0===o?13.5:o;return t.createElement("svg",{width:n,height:l,"aria-hidden":"true",viewBox:"0 0 24 24",className:a},t.createElement("path",{fill:"currentColor",d:"M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"}))}},517:function(e,r,n){var t=n(7378);r.Z=function(e){var r=e.children,n=e.hidden,a=e.className;return t.createElement("div",{role:"tabpanel",hidden:n,className:a},r)}},2120:function(e,r,n){n.d(r,{Z:function(){return d}});var t=n(5773),a=n(7378),o=n(6457),l=n(4956);var i=function(){var e=(0,a.useContext)(l.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},u=n(1202),s=n(8944),c="tabItem_c0e5";function p(e){var r,n,t,o=e.lazy,l=e.block,p=e.defaultValue,d=e.values,m=e.groupId,f=e.className,h=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=d?d:h.map((function(e){var r=e.props;return{value:r.value,label:r.label}})),b=(0,u.duplicates)(v,(function(e,r){return e.value===r.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===p?p:null!=(r=null!=p?p:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?r:null==(t=h[0])?void 0:t.props.value;if(null!==g&&!v.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=i(),k=y.tabGroupChoices,w=y.setTabGroupChoices,E=(0,a.useState)(g),N=E[0],C=E[1],O=[],T=(0,u.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=m){var x=k[m];null!=x&&x!==N&&v.some((function(e){return e.value===x}))&&C(x)}var Z=function(e){var r=e.currentTarget,n=O.indexOf(r),t=v[n].value;t!==N&&(T(r),C(t),null!=m&&w(m,t))},j=function(e){var r,n=null;switch(e.key){case"ArrowRight":var t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break;case"ArrowLeft":var a=O.indexOf(e.currentTarget)-1;n=O[a]||O[O.length-1]}null==(r=n)||r.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":l},f)},v.map((function(e){var r=e.value,n=e.label;return a.createElement("li",{role:"tab",tabIndex:N===r?0:-1,"aria-selected":N===r,className:(0,s.Z)("tabs__item",c,{"tabs__item--active":N===r}),key:r,ref:function(e){return O.push(e)},onKeyDown:j,onFocus:Z,onClick:Z},null!=n?n:r)}))),o?(0,a.cloneElement)(h.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map((function(e,r){return(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==N})}))))}function d(e){var r=(0,o.Z)();return a.createElement(p,(0,t.Z)({key:String(r)},e))}},4956:function(e,r,n){var t=(0,n(7378).createContext)(void 0);r.Z=t},297:function(e,r,n){n.d(r,{Z:function(){return a}});var t=n(7378);function a(e){var r=e.children,n=e.type;return t.createElement("span",{className:"badge badge--"+n},r)}},2723:function(e,r,n){n.d(r,{Z:function(){return c}});var t=n(7378),a=n(1884),o=n(8458),l=n(297),i="badgeGroup_2HOO",u="apiLink_32Vk";function s(e){var r=e.children;return t.createElement("span",{className:i},r)}function c(e){var r=e.api,n=e.backend,i=e.frontend,c=e.tooling;return t.createElement(t.Fragment,null,r&&t.createElement(a.default,{className:u,to:r},"API ",t.createElement(o.Z,null)),t.createElement(s,null,n&&t.createElement(l.Z,{type:"warning"},"Backend"),i&&t.createElement(l.Z,{type:"success"},"Frontend"),c&&t.createElement(l.Z,{type:"primary"},"Tooling")))}},6512:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return c},contentTitle:function(){return p},metadata:function(){return d},toc:function(){return m},default:function(){return h}});var t=n(5773),a=n(808),o=(n(7378),n(5318)),l=n(2723),i=n(2120),u=n(517),s=["components"],c={title:"Crash reporting"},p=void 0,d={unversionedId:"crash",id:"crash",isDocsHomePage:!1,title:"Crash reporting",description:"Report important environmental information when an error occurs or a process crashes.",source:"@site/docs/crash.mdx",sourceDirName:".",slug:"/crash",permalink:"/docs/crash",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/crash.mdx",tags:[],version:"current",frontMatter:{title:"Crash reporting"},sidebar:"docs",previous:{title:"Configuration",permalink:"/docs/config"},next:{title:"Debugging",permalink:"/docs/debug"}},m=[{value:"Installation",id:"installation",children:[],level:2},{value:"Reporting",id:"reporting",children:[],level:2}],f={toc:m};function h(e){var r=e.components,n=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},f,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)(l.Z,{backend:!0,tooling:!0,api:"/api/debug",mdxType:"EnvBadges"}),(0,o.kt)("p",null,"Report important environmental information when an error occurs or a process crashes."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,o.kt)(u.Z,{value:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/debug\n"))),(0,o.kt)(u.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/debug\n")))),(0,o.kt)("h2",{id:"reporting"},"Reporting"),(0,o.kt)("p",null,"Sometimes an application or script fails. Sometimes we want to write an error log with environmental\ninformation about the failure. Boost supports this exact scenario."),(0,o.kt)("p",null,"Take advantage of crash reporting by importing and instantiating the\n",(0,o.kt)("a",{parentName:"p",href:"/api/debug/class/CrashReporter"},(0,o.kt)("inlineCode",{parentName:"a"},"CrashReporter"))," class."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { CrashReporter } from '@boost/debug';\n\nconst reporter = new CrashReporter();\n")),(0,o.kt)("p",null,"The reporter supports a collection of chainable methods that log targeted information, grouped into\nsections. View the API for more information on these methods."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"reporter\n  .reportPackageVersions('@boost/*')\n  .reportBinaries()\n  .reportEnvVars()\n  .reportSystem();\n")),(0,o.kt)("p",null,"If you'd like to add your own section and label value pairs, use\n",(0,o.kt)("a",{parentName:"p",href:"/api/debug/class/CrashReporter#addSection"},(0,o.kt)("inlineCode",{parentName:"a"},"CrashReporter#addSection()")),", which requires a title,\nand ",(0,o.kt)("a",{parentName:"p",href:"/api/debug/class/CrashReporter#add"},(0,o.kt)("inlineCode",{parentName:"a"},"CrashReporter#add()")),", which accepts a label and one or\nmany values."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"reporter\n    .addSection('User')\n    .add('ID', user.id)\n    .add('Name', user.name)\n    .add('Location', user.address, user.country);\n")),(0,o.kt)("p",null,"Once all the information has been buffered, we can write the content to a log file by using\n",(0,o.kt)("a",{parentName:"p",href:"/api/debug/class/CrashReporter#write"},(0,o.kt)("inlineCode",{parentName:"a"},"CrashReporter#write()")),", which requires an absolute file\npath."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"reporter.write(path.join(process.cwd(), 'error.log'));\n")))}h.isMDXComponent=!0}}]);