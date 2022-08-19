"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9514,3893],{2214:function(e,t,n){n.r(t),n.d(t,{default:function(){return Se}});var a=n(7378),r=n(8944),l=n(1123),i=n(5484),o=n(2949),c=n(3149),s=n(5611),d=n(2095),u=n(1246),m=n(9213),b=n(9169),p="backToTopButton_iEvu",v="backToTopButtonShow_DO8w";function h(){var e=(0,b.a)({threshold:300}),t=e.shown,n=e.scrollToTop;return a.createElement("button",{"aria-label":(0,m.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,r.Z)("clean-btn",i.k.common.backToTopButton,p,t&&v),type:"button",onClick:n})}var f=n(5331),E=n(8357),g=n(624),k=n(898),_=n(5773);function C(e){return a.createElement("svg",(0,_.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}var I="collapseSidebarButton_oTwn",N="collapseSidebarButtonIcon_pMEX";function S(e){var t=e.onClick;return a.createElement("button",{type:"button",title:(0,m.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,r.Z)("button button--secondary button--outline",I),onClick:t},a.createElement(C,{className:N}))}var Z=n(10),T=n(3457),x=n(808),y=n(6666),L=n(8215),w=n(376),A=n(8862),M=n(1884),B=n(6457),P=["item","onItemClick","activePath","level","index"];function F(e){var t=e.categoryLabel,n=e.onClick;return a.createElement("button",{"aria-label":(0,m.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function H(e){var t=e.item,n=e.onItemClick,l=e.activePath,c=e.level,s=e.index,d=(0,x.Z)(e,P),u=t.items,m=t.label,b=t.collapsible,p=t.className,v=t.href,h=(0,g.L)().docs.sidebar.autoCollapseCategories,f=function(e){var t=(0,B.Z)();return(0,a.useMemo)((function(){return e.href?e.href:!t&&e.collapsible?(0,o.Wl)(e):void 0}),[e,t])}(t),E=(0,o._F)(t,l),k=(0,A.Mg)(v,l),C=(0,w.u)({initialState:function(){return!!b&&(!E&&t.collapsed)}}),I=C.collapsed,N=C.setCollapsed,S=(0,y.f)(),Z=S.expandedItem,T=S.setExpandedItem,H=function(e){void 0===e&&(e=!I),T(e?null:s),N(e)};return function(e){var t=e.isActive,n=e.collapsed,r=e.updateCollapsed,l=(0,L.D9)(t);(0,a.useEffect)((function(){t&&!l&&n&&r(!1)}),[t,l,n,r])}({isActive:E,collapsed:I,updateCollapsed:H}),(0,a.useEffect)((function(){b&&Z&&Z!==s&&h&&N(!0)}),[b,Z,s,N,h]),a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemCategory,i.k.docs.docSidebarItemCategoryLevel(c),"menu__list-item",{"menu__list-item--collapsed":I},p)},a.createElement("div",{className:(0,r.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":k})},a.createElement(M.default,(0,_.Z)({className:(0,r.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!v&&b,"menu__link--active":E}),onClick:b?function(e){null==n||n(t),v?H(!1):(e.preventDefault(),H())}:function(){null==n||n(t)},"aria-current":k?"page":void 0,"aria-expanded":b?!I:void 0,href:b?null!=f?f:"#":f},d),m),v&&b&&a.createElement(F,{categoryLabel:m,onClick:function(e){e.preventDefault(),H()}})),a.createElement(w.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:I},a.createElement(q,{items:u,tabIndex:I?-1:0,onItemClick:n,activePath:l,level:c+1})))}var D=n(5626),R=n(6125),W="menuExternalLink_BiEj",Y=["item","onItemClick","activePath","level","index"];function z(e){var t=e.item,n=e.onItemClick,l=e.activePath,c=e.level,s=(e.index,(0,x.Z)(e,Y)),d=t.href,u=t.label,m=t.className,b=(0,o._F)(t,l),p=(0,D.Z)(d);return a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(c),"menu__list-item",m),key:u},a.createElement(M.default,(0,_.Z)({className:(0,r.Z)("menu__link",!p&&W,{"menu__link--active":b}),"aria-current":b?"page":void 0,to:d},p&&{onClick:n?function(){return n(t)}:void 0},s),u,!p&&a.createElement(R.Z,null)))}var j="menuHtmlItem_OniL";function O(e){var t=e.item,n=e.level,l=e.index,o=t.value,c=t.defaultStyle,s=t.className;return a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(n),c&&[j,"menu__list-item"],s),key:l,dangerouslySetInnerHTML:{__html:o}})}var V=["item"];function G(e){var t=e.item,n=(0,x.Z)(e,V);switch(t.type){case"category":return a.createElement(H,(0,_.Z)({item:t},n));case"html":return a.createElement(O,(0,_.Z)({item:t},n));default:return a.createElement(z,(0,_.Z)({item:t},n))}}var K=["items"];function U(e){var t=e.items,n=(0,x.Z)(e,K);return a.createElement(y.D,null,t.map((function(e,t){return a.createElement(G,(0,_.Z)({key:t,item:e,index:t},n))})))}var q=(0,a.memo)(U),J="menu_jmj1",Q="menuWithAnnouncementBar_YufC";function X(e){var t=e.path,n=e.sidebar,l=e.className,o=function(){var e=(0,Z.nT)().isActive,t=(0,a.useState)(e),n=t[0],r=t[1];return(0,T.RF)((function(t){var n=t.scrollY;e&&r(0===n)}),[e]),e&&n}();return a.createElement("nav",{className:(0,r.Z)("menu thin-scrollbar",J,o&&Q,l)},a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(q,{items:n,activePath:t,level:1})))}var $="sidebar_CUen",ee="sidebarWithHideableNavbar_w4KB",te="sidebarHidden_k6VE",ne="sidebarLogo_CYvI";function ae(e){var t=e.path,n=e.sidebar,l=e.onCollapse,i=e.isHidden,o=(0,g.L)(),c=o.navbar.hideOnScroll,s=o.docs.sidebar.hideable;return a.createElement("div",{className:(0,r.Z)($,c&&ee,i&&te)},c&&a.createElement(k.Z,{tabIndex:-1,className:ne}),a.createElement(X,{path:t,sidebar:n}),s&&a.createElement(S,{onClick:l}))}var re=a.memo(ae),le=n(3471),ie=n(5536),oe=function(e){var t=e.sidebar,n=e.path,l=(0,ie.e)();return a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(q,{items:t,activePath:n,onItemClick:function(e){"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function ce(e){return a.createElement(le.Zo,{component:oe,props:e})}var se=a.memo(ce);function de(e){var t=(0,E.i)(),n="desktop"===t||"ssr"===t,r="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(re,e),r&&a.createElement(se,e))}var ue="expandButton_YOoA",me="expandButtonIcon_GZLG";function be(e){var t=e.toggleSidebar;return a.createElement("div",{className:ue,title:(0,m.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(C,{className:me}))}var pe="docSidebarContainer_y0RQ",ve="docSidebarContainerHidden_uArb";function he(e){var t,n=e.children,r=(0,d.V)();return a.createElement(a.Fragment,{key:null!=(t=null==r?void 0:r.name)?t:"noSidebar"},n)}function fe(e){var t=e.sidebar,n=e.hiddenSidebarContainer,l=e.setHiddenSidebarContainer,o=(0,f.TH)().pathname,c=(0,a.useState)(!1),s=c[0],d=c[1],u=(0,a.useCallback)((function(){s&&d(!1),l((function(e){return!e}))}),[l,s]);return a.createElement("aside",{className:(0,r.Z)(i.k.docs.docSidebarContainer,pe,n&&ve),onTransitionEnd:function(e){e.currentTarget.classList.contains(pe)&&n&&d(!0)}},a.createElement(he,null,a.createElement(de,{sidebar:t,path:o,onCollapse:u,isHidden:s})),s&&a.createElement(be,{toggleSidebar:u}))}var Ee={docMainContainer:"docMainContainer_sTIZ",docMainContainerEnhanced:"docMainContainerEnhanced_iSjt",docItemWrapperEnhanced:"docItemWrapperEnhanced_PxMR"};function ge(e){var t=e.hiddenSidebarContainer,n=e.children,l=(0,d.V)();return a.createElement("main",{className:(0,r.Z)(Ee.docMainContainer,(t||!l)&&Ee.docMainContainerEnhanced)},a.createElement("div",{className:(0,r.Z)("container padding-top--md padding-bottom--lg",Ee.docItemWrapper,t&&Ee.docItemWrapperEnhanced)},n))}var ke="docPage_KLoz",_e="docsWrapper_ct1J";function Ce(e){var t=e.children,n=(0,d.V)(),r=(0,a.useState)(!1),l=r[0],i=r[1];return a.createElement(u.Z,{wrapperClassName:_e},a.createElement(h,null),a.createElement("div",{className:ke},n&&a.createElement(fe,{sidebar:n.items,hiddenSidebarContainer:l,setHiddenSidebarContainer:i}),a.createElement(ge,{hiddenSidebarContainer:l},t)))}var Ie=n(3893),Ne=n(505);function Se(e){var t=e.versionMetadata,n=(0,o.hI)(e);if(!n)return a.createElement(Ie.default,null);var u=n.docElement,m=n.sidebarName,b=n.sidebarItems;return a.createElement(a.Fragment,null,a.createElement(Ne.Z,{version:t.version,tag:(0,c.os)(t.pluginId,t.version)}),a.createElement(l.FG,{className:(0,r.Z)(i.k.wrapper.docsPages,i.k.page.docsDocPage,e.versionMetadata.className)},a.createElement(s.q,{version:t},a.createElement(d.b,{name:m,items:b},a.createElement(Ce,null,u)))))}},3893:function(e,t,n){n.r(t),n.d(t,{default:function(){return o}});var a=n(7378),r=n(9213),l=n(1123),i=n(1246);function o(){return a.createElement(a.Fragment,null,a.createElement(l.d,{title:(0,r.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(i.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(r.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},6666:function(e,t,n){n.d(t,{D:function(){return o},f:function(){return c}});var a=n(7378),r=n(8215),l=Symbol("EmptyContext"),i=a.createContext(l);function o(e){var t=e.children,n=(0,a.useState)(null),r=n[0],l=n[1],o=(0,a.useMemo)((function(){return{expandedItem:r,setExpandedItem:l}}),[r]);return a.createElement(i.Provider,{value:o},t)}function c(){var e=(0,a.useContext)(i);if(e===l)throw new r.i6("DocSidebarItemsExpandedStateProvider");return e}},9169:function(e,t,n){n.d(t,{a:function(){return i}});var a=n(7378),r=n(3457),l=n(4993);function i(e){var t=e.threshold,n=(0,a.useState)(!1),i=n[0],o=n[1],c=(0,a.useRef)(!1),s=(0,r.Ct)(),d=s.startScroll,u=s.cancelScroll;return(0,r.RF)((function(e,n){var a=e.scrollY,r=null==n?void 0:n.scrollY;r&&(c.current?c.current=!1:a>=r?(u(),o(!1)):a<t?o(!1):a+window.innerHeight<document.documentElement.scrollHeight&&o(!0))})),(0,l.S)((function(e){e.location.hash&&(c.current=!0,o(!1))})),{shown:i,scrollToTop:function(){return d(0)}}}}}]);