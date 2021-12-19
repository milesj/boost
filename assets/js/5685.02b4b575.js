"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5685],{3635:function(e,t,n){n.r(t),n.d(t,{MainHeading:function(){return d},default:function(){return y}});var r=n(808),o=n(5773),l=n(7378),a=n(8944),i=n(9213),c=n(6429),s="anchorWithStickyNavbar_23Bc",u="anchorWithHideOnScrollNavbar_3Dj-",p=["id"],d=function(e){var t=Object.assign({},e);return l.createElement("header",null,l.createElement("h1",(0,o.Z)({},t,{id:void 0}),t.children))},y=function(e){return"h1"===e?d:(t=e,function(e){var n,d=e.id,y=(0,r.Z)(e,p),m=(0,c.useThemeConfig)().navbar.hideOnScroll;return d?l.createElement(t,(0,o.Z)({},y,{className:(0,a.Z)("anchor",(n={},n[u]=m,n[s]=!m,n)),id:d}),y.children,l.createElement("a",{"aria-hidden":"true",className:"hash-link",href:"#"+d,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):l.createElement(t,y)});var t}},5685:function(e,t,n){n.r(t),n.d(t,{default:function(){return A}});var r=n(5773),o=n(808),l=n(7378),a=n(2263),i=n(1884),c=n(8944),s={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","at-rule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]},u={Prism:n(2349).default,theme:s};function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function d(){return d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}var y=/\r\n|\r|\n/,m=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},h=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},g=function(e,t){var n=e.plain,r=Object.create(null),o=e.styles.reduce((function(e,n){var r=n.languages,o=n.style;return r&&!r.includes(t)||n.types.forEach((function(t){var n=d({},e[t],o);e[t]=n})),e}),r);return o.root=n,o.plain=d({},n,{backgroundColor:null}),o};function f(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&-1===t.indexOf(r)&&(n[r]=e[r]);return n}var v=function(e){function t(){for(var t=this,n=[],r=arguments.length;r--;)n[r]=arguments[r];e.apply(this,n),p(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?g(e.theme,e.language):void 0;return t.themeDict=n})),p(this,"getLineProps",(function(e){var n=e.key,r=e.className,o=e.style,l=d({},f(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),a=t.getThemeDict(t.props);return void 0!==a&&(l.style=a.plain),void 0!==o&&(l.style=void 0!==l.style?d({},l.style,o):o),void 0!==n&&(l.key=n),r&&(l.className+=" "+r),l})),p(this,"getStyleForToken",(function(e){var n=e.types,r=e.empty,o=n.length,l=t.getThemeDict(t.props);if(void 0!==l){if(1===o&&"plain"===n[0])return r?{display:"inline-block"}:void 0;if(1===o&&!r)return l[n[0]];var a=r?{display:"inline-block"}:{},i=n.map((function(e){return l[e]}));return Object.assign.apply(Object,[a].concat(i))}})),p(this,"getTokenProps",(function(e){var n=e.key,r=e.className,o=e.style,l=e.token,a=d({},f(e,["key","className","style","token"]),{className:"token "+l.types.join(" "),children:l.content,style:t.getStyleForToken(l),key:void 0});return void 0!==o&&(a.style=void 0!==a.style?d({},a.style,o):o),void 0!==n&&(a.key=n),r&&(a.className+=" "+r),a})),p(this,"tokenize",(function(e,t,n,r){var o={code:t,grammar:n,language:r,tokens:[]};e.hooks.run("before-tokenize",o);var l=o.tokens=e.tokenize(o.code,o.grammar,o.language);return e.hooks.run("after-tokenize",o),l}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,r=e.code,o=e.children,l=this.getThemeDict(this.props),a=t.languages[n];return o({tokens:function(e){for(var t=[[]],n=[e],r=[0],o=[e.length],l=0,a=0,i=[],c=[i];a>-1;){for(;(l=r[a]++)<o[a];){var s=void 0,u=t[a],p=n[a][l];if("string"==typeof p?(u=a>0?u:["plain"],s=p):(u=h(u,p.type),p.alias&&(u=h(u,p.alias)),s=p.content),"string"==typeof s){var d=s.split(y),g=d.length;i.push({types:u,content:d[0]});for(var f=1;f<g;f++)m(i),c.push(i=[]),i.push({types:u,content:d[f]})}else a++,t.push(u),n.push(s),r.push(0),o.push(s.length)}a--,t.pop(),n.pop(),r.pop(),o.pop()}return m(i),c}(void 0!==a?this.tokenize(t,r,a,n):[r]),className:"prism-code language-"+n,style:void 0!==l?l.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(l.Component),b=v;var k=n(9213),E=n(6429),T={plain:{color:"#bfc7d5",backgroundColor:"#292d3e"},styles:[{types:["comment"],style:{color:"rgb(105, 112, 152)",fontStyle:"italic"}},{types:["string","inserted"],style:{color:"rgb(195, 232, 141)"}},{types:["number"],style:{color:"rgb(247, 140, 108)"}},{types:["builtin","char","constant","function"],style:{color:"rgb(130, 170, 255)"}},{types:["punctuation","selector"],style:{color:"rgb(199, 146, 234)"}},{types:["variable"],style:{color:"rgb(191, 199, 213)"}},{types:["class-name","attr-name"],style:{color:"rgb(255, 203, 107)"}},{types:["tag","deleted"],style:{color:"rgb(255, 85, 114)"}},{types:["operator"],style:{color:"rgb(137, 221, 255)"}},{types:["boolean"],style:{color:"rgb(255, 88, 116)"}},{types:["keyword"],style:{fontStyle:"italic"}},{types:["doctype"],style:{color:"rgb(199, 146, 234)",fontStyle:"italic"}},{types:["namespace"],style:{color:"rgb(178, 204, 214)"}},{types:["url"],style:{color:"rgb(221, 221, 221)"}}]},N=n(9237),C=function(){var e=(0,E.useThemeConfig)().prism,t=(0,N.Z)().isDarkTheme,n=e.theme||T,r=e.darkTheme||n;return t?r:n},Z="codeBlockContainer_1ukp",L="codeBlockContent_3Y8q",O="codeBlockTitle_befg",S="codeBlock_2Xgr",j="copyButton_1mju",D="codeBlockLines_3Zfi";function P(e){var t,n=e.children,o=e.className,a=e.metastring,i=e.title,s=(0,E.useThemeConfig)().prism,p=(0,l.useState)(!1),d=p[0],y=p[1],m=(0,l.useState)(!1),h=m[0],g=m[1];(0,l.useEffect)((function(){g(!0)}),[]);var f=(0,E.parseCodeBlockTitle)(a)||i,v=C(),T=Array.isArray(n)?n.join(""):n,N=null!=(t=(0,E.parseLanguage)(o))?t:s.defaultLanguage,P=(0,E.parseLines)(T,a,N),_=P.highlightLines,x=P.code,B=function(){!function(e,t){var n=(void 0===t?{}:t).target,r=void 0===n?document.body:n,o=document.createElement("textarea"),l=document.activeElement;o.value=e,o.setAttribute("readonly",""),o.style.contain="strict",o.style.position="absolute",o.style.left="-9999px",o.style.fontSize="12pt";var a=document.getSelection(),i=!1;a.rangeCount>0&&(i=a.getRangeAt(0)),r.append(o),o.select(),o.selectionStart=0,o.selectionEnd=e.length;var c=!1;try{c=document.execCommand("copy")}catch(s){}o.remove(),i&&(a.removeAllRanges(),a.addRange(i)),l&&l.focus()}(x),y(!0),setTimeout((function(){return y(!1)}),2e3)};return l.createElement(b,(0,r.Z)({},u,{key:String(h),theme:v,code:x,language:N}),(function(e){var t=e.className,n=e.style,a=e.tokens,i=e.getLineProps,s=e.getTokenProps;return l.createElement("div",{className:(0,c.Z)(Z,o)},f&&l.createElement("div",{style:n,className:O},f),l.createElement("div",{className:(0,c.Z)(L,N)},l.createElement("pre",{tabIndex:0,className:(0,c.Z)(t,S,"thin-scrollbar"),style:n},l.createElement("code",{className:D},a.map((function(e,t){1===e.length&&"\n"===e[0].content&&(e[0].content="");var n=i({line:e,key:t});return _.includes(t)&&(n.className+=" docusaurus-highlight-code-line"),l.createElement("span",(0,r.Z)({key:t},n),e.map((function(e,t){return l.createElement("span",(0,r.Z)({key:t},s({token:e,key:t})))})),l.createElement("br",null))})))),l.createElement("button",{type:"button","aria-label":(0,k.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),className:(0,c.Z)(j,"clean-btn"),onClick:B},d?l.createElement(k.Z,{id:"theme.CodeBlock.copied",description:"The copied button label on code blocks"},"Copied"):l.createElement(k.Z,{id:"theme.CodeBlock.copy",description:"The copy button label on code blocks"},"Copy"))))}))}var _=n(3635),x="details_SL1Q";function B(e){var t=Object.assign({},e);return l.createElement(E.Details,(0,r.Z)({},t,{className:(0,c.Z)("alert alert--info",x,t.className)}))}var w=["mdxType","originalType"];var A={head:function(e){var t=l.Children.map(e.children,(function(e){return function(e){var t,n;if(null!=e&&null!=(t=e.props)&&t.mdxType&&null!=e&&null!=(n=e.props)&&n.originalType){var r=e.props,a=(r.mdxType,r.originalType,(0,o.Z)(r,w));return l.createElement(e.props.originalType,a)}return e}(e)}));return l.createElement(a.Z,e,t)},code:function(e){var t=e.children;return(0,l.isValidElement)(t)?t:t.includes("\n")?l.createElement(P,e):l.createElement("code",e)},a:function(e){return l.createElement(i.default,e)},pre:function(e){var t,n=e.children;return(0,l.isValidElement)(n)&&(0,l.isValidElement)(null==n||null==(t=n.props)?void 0:t.children)?n.props.children:l.createElement(P,(0,l.isValidElement)(n)?null==n?void 0:n.props:Object.assign({},e))},details:function(e){var t=l.Children.toArray(e.children),n=t.find((function(e){var t;return"summary"===(null==e||null==(t=e.props)?void 0:t.mdxType)})),o=l.createElement(l.Fragment,null,t.filter((function(e){return e!==n})));return l.createElement(B,(0,r.Z)({},e,{summary:n}),o)},h1:(0,_.default)("h1"),h2:(0,_.default)("h2"),h3:(0,_.default)("h3"),h4:(0,_.default)("h4"),h5:(0,_.default)("h5"),h6:(0,_.default)("h6")}}}]);