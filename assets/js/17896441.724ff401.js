(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7918],{5862:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return S}});var n=a(7378),r=a(8944),l=a(8245),i=a(3008),s=a(9077),o=a(1956),c=a(1787),d=a(5013);function m(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(c.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function u(e){var t=e.lastUpdatedBy;return n.createElement(c.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function v(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,r=e.lastUpdatedBy;return n.createElement("span",{className:d.ThemeClassNames.common.lastUpdated},n.createElement(c.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(m,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:r?n.createElement(u,{lastUpdatedBy:r}):""}},"Last updated{atDate}{byUser}"),!1)}var f=a(9603),h=a(120),p="iconEdit_1CBY",E=["className"],g=function(e){var t=e.className,a=(0,h.Z)(e,E);return n.createElement("svg",(0,f.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,r.Z)(p,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))};function b(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:d.ThemeClassNames.common.editThisPage},n.createElement(g,null),n.createElement(c.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var N=a(6839),_="tags_1YZR",T="tag_3GNh";function C(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(c.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,r.Z)(_,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:T},n.createElement(N.Z,{name:t,permalink:a}))}))))}var k="lastUpdated_S150";function U(e){return n.createElement("div",{className:(0,r.Z)(d.ThemeClassNames.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(C,e)))}function w(e){var t=e.editUrl,a=e.lastUpdatedAt,l=e.lastUpdatedBy,i=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,r.Z)(d.ThemeClassNames.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(b,{editUrl:t})),n.createElement("div",{className:(0,r.Z)("col",k)},(a||l)&&n.createElement(v,{lastUpdatedAt:a,formattedLastUpdatedAt:i,lastUpdatedBy:l})))}function y(e){var t=e.content.metadata,a=t.editUrl,l=t.lastUpdatedAt,i=t.formattedLastUpdatedAt,s=t.lastUpdatedBy,o=t.tags,c=o.length>0,m=!!(a||l||s);return c||m?n.createElement("footer",{className:(0,r.Z)(d.ThemeClassNames.docs.docFooter,"docusaurus-mt-lg")},c&&n.createElement(U,{tags:o}),m&&n.createElement(w,{editUrl:a,lastUpdatedAt:l,lastUpdatedBy:s,formattedLastUpdatedAt:i})):n.createElement(n.Fragment,null)}var L=a(7205),Z=a(9776),A=a(2332),B="docItemContainer_3nUq",M="docItemCol_1o9i",O="tocMobile_1BQl";function S(e){var t,a=e.content,c=e.versionMetadata,m=a.metadata,u=a.frontMatter,v=u.image,f=u.keywords,h=u.hide_title,p=u.hide_table_of_contents,E=m.description,g=m.title,b=!h&&void 0===a.contentTitle,N=(0,l.default)(),_=!p&&a.toc&&a.toc.length>0,T=_&&("desktop"===N||"ssr"===N);return n.createElement(n.Fragment,null,n.createElement(o.default,{title:g,description:E,keywords:f,image:v}),n.createElement("div",{className:"row"},n.createElement("div",{className:(0,r.Z)("col",(t={},t[M]=!p,t))},n.createElement(s.default,{versionMetadata:c}),n.createElement("div",{className:B},n.createElement("article",null,c.badge&&n.createElement("span",{className:(0,r.Z)(d.ThemeClassNames.docs.docVersionBadge,"badge badge--secondary")},"Version: ",c.label),_&&n.createElement(Z.default,{toc:a.toc,className:(0,r.Z)(d.ThemeClassNames.docs.docTocMobile,O)}),n.createElement("div",{className:(0,r.Z)(d.ThemeClassNames.docs.docMarkdown,"markdown")},b&&n.createElement(A.MainHeading,null,g),n.createElement(a,null)),n.createElement(y,e)),n.createElement(i.default,{metadata:m}))),T&&n.createElement("div",{className:"col col--3"},n.createElement(L.default,{toc:a.toc,className:d.ThemeClassNames.docs.docTocDesktop}))))}},3008:function(e,t,a){"use strict";a.r(t);var n=a(7378),r=a(4142),l=a(1787);t.default=function(e){var t=e.metadata;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,l.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},n.createElement("div",{className:"pagination-nav__item"},t.previous&&n.createElement(r.default,{className:"pagination-nav__link",to:t.previous.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(l.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")),n.createElement("div",{className:"pagination-nav__label"},"\xab ",t.previous.title))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},t.next&&n.createElement(r.default,{className:"pagination-nav__link",to:t.next.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(l.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next")),n.createElement("div",{className:"pagination-nav__label"},t.next.title," \xbb"))))}},9077:function(e,t,a){"use strict";a.r(t);var n=a(7378),r=a(353),l=a(4142),i=a(1787),s=a(6889),o=a(5013),c=a(8944);var d={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(i.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(i.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function m(e){var t=d[e.versionMetadata.banner];return n.createElement(t,e)}function u(e){var t=e.versionLabel,a=e.to,r=e.onClick;return n.createElement(i.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(l.default,{to:a,onClick:r},n.createElement(i.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function v(e){var t,a=e.versionMetadata,l=(0,r.default)().siteConfig.title,i=(0,s.gA)({failfast:!0}).pluginId,d=(0,o.useDocsPreferredVersion)(i).savePreferredVersionName,v=(0,s.Jo)(i),f=v.latestDocSuggestion,h=v.latestVersionSuggestion,p=null!=f?f:(t=h).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,c.Z)(o.ThemeClassNames.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(m,{siteTitle:l,versionMetadata:a})),n.createElement("div",{className:"margin-top--md"},n.createElement(u,{versionLabel:h.label,to:p.path,onClick:function(){return d(h.name)}})))}t.default=function(e){var t=e.versionMetadata;return t.banner?n.createElement(v,{versionMetadata:t}):n.createElement(n.Fragment,null)}},2332:function(e,t,a){"use strict";a.r(t),a.d(t,{MainHeading:function(){return u},default:function(){return v}});var n=a(120),r=a(9603),l=a(7378),i=a(8944),s=a(1787),o=a(5013),c="anchorWithStickyNavbar_23Bc",d="anchorWithHideOnScrollNavbar_3Dj-",m=["id"],u=function(e){var t=Object.assign({},e);return l.createElement("header",null,l.createElement("h1",(0,r.Z)({},t,{id:void 0}),t.children))},v=function(e){return"h1"===e?u:(t=e,function(e){var a,r=e.id,u=(0,n.Z)(e,m),v=(0,o.useThemeConfig)().navbar.hideOnScroll;return r?l.createElement(t,u,l.createElement("a",{"aria-hidden":"true",tabIndex:-1,className:(0,i.Z)("anchor","anchor__"+t,(a={},a[d]=v,a[c]=!v,a)),id:r}),u.children,l.createElement("a",{className:"hash-link",href:"#"+r,title:(0,s.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"#")):l.createElement(t,u)});var t}},1956:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return s}});var n=a(7378),r=a(5361),l=a(5013),i=a(8948);function s(e){var t=e.title,a=e.description,s=e.keywords,o=e.image,c=e.children,d=(0,l.useTitleFormatter)(t),m=(0,i.C)().withBaseUrl,u=o?m(o,{absolute:!0}):void 0;return n.createElement(r.Z,null,t&&n.createElement("title",null,d),t&&n.createElement("meta",{property:"og:title",content:d}),a&&n.createElement("meta",{name:"description",content:a}),a&&n.createElement("meta",{property:"og:description",content:a}),s&&n.createElement("meta",{name:"keywords",content:Array.isArray(s)?s.join(","):s}),u&&n.createElement("meta",{property:"og:image",content:u}),u&&n.createElement("meta",{name:"twitter:image",content:u}),c)}},7205:function(e,t,a){"use strict";a.r(t),a.d(t,{TOCHeadings:function(){return v},default:function(){return f}});var n=a(7378),r=a(8944),l=a(5013);function i(e){var t=e.getBoundingClientRect();return t.top===t.bottom?i(e.parentNode):t}function s(e){var t,a=e.anchorTopOffset,n=Array.from(document.querySelectorAll(".anchor.anchor__h2, .anchor.anchor__h3")),r=n.find((function(e){return i(e).top>=a}));return r?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(i(r))?r:null!=(t=n[n.indexOf(r)-1])?t:null:n[n.length-1]}function o(){var e=(0,n.useRef)(0),t=(0,l.useThemeConfig)().navbar.hideOnScroll;return(0,n.useEffect)((function(){e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}var c=function(e){var t=(0,n.useRef)(void 0),a=o();(0,n.useEffect)((function(){var n=e.linkClassName,r=e.linkActiveClassName;function l(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(n),l=s({anchorTopOffset:a.current}),i=e.find((function(e){return l&&l.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,a){if(a){var n;t.current&&t.current!==e&&(null==(n=t.current)||n.classList.remove(r)),e.classList.add(r),t.current=e}else e.classList.remove(r)}(e,e===i)}))}return document.addEventListener("scroll",l),document.addEventListener("resize",l),l(),function(){document.removeEventListener("scroll",l),document.removeEventListener("resize",l)}}),[e,a])},d="tableOfContents_3J2a",m="table-of-contents__link",u={linkClassName:m,linkActiveClassName:"table-of-contents__link--active"};function v(e){var t=e.toc,a=e.isChild;return t.length?n.createElement("ul",{className:a?"":"table-of-contents table-of-contents__left-border"},t.map((function(e){return n.createElement("li",{key:e.id},n.createElement("a",{href:"#"+e.id,className:m,dangerouslySetInnerHTML:{__html:e.value}}),n.createElement(v,{isChild:!0,toc:e.children}))}))):null}var f=function(e){var t=e.toc;return c(u),n.createElement("div",{className:(0,r.Z)(d,"thin-scrollbar")},n.createElement(v,{toc:t}))}},9776:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return u}});var n=a(7378),r=a(8944),l=a(1787),i=a(5013),s="tocCollapsible_Snzk",o="tocCollapsibleButton_27DV",c="tocCollapsibleContent_6RV4",d="tocCollapsibleExpanded__mI0",m=a(7205);function u(e){var t,a=e.toc,u=e.className,v=(0,i.useCollapsible)({initialState:!0}),f=v.collapsed,h=v.toggleCollapsed;return n.createElement("div",{className:(0,r.Z)(s,(t={},t[d]=!f,t),u)},n.createElement("button",{type:"button",className:(0,r.Z)("clean-btn",o),onClick:h},n.createElement(l.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page")),n.createElement(i.Collapsible,{lazy:!0,className:c,collapsed:f},n.createElement(m.TOCHeadings,{toc:a})))}},6839:function(e,t,a){"use strict";a.d(t,{Z:function(){return c}});var n=a(7378),r=a(8944),l=a(4142),i="tag__u1m",s="tagRegular_Kusr",o="tagWithCount_2eub";var c=function(e){var t,a=e.permalink,c=e.name,d=e.count;return n.createElement(l.default,{href:a,className:(0,r.Z)(i,(t={},t[s]=!d,t[o]=d,t))},c,d&&n.createElement("span",null,d))}},8245:function(e,t,a){"use strict";a.r(t);var n=a(7378),r=a(161),l="desktop",i="mobile",s="ssr";function o(){return r.Z.canUseDOM?window.innerWidth>996?l:i:s}t.default=function(){var e=(0,n.useState)((function(){return o()})),t=e[0],a=e[1];return(0,n.useEffect)((function(){function e(){a(o())}return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e),clearTimeout(undefined)}}),[]),t}}}]);