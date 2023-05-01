"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7918],{4543:function(e,t,a){a.r(t),a.d(t,{default:function(){return ae}});var n=a(7378),l=a(1123),r=a(9446);function s(){var e,t=(0,r.k)(),a=t.metadata,s=t.frontMatter,i=t.assets;return n.createElement(l.d,{title:a.title,description:a.description,keywords:s.keywords,image:null!=(e=i.image)?e:s.image})}var i=a(8944),o=a(8357),d=a(4619);function c(){var e=(0,r.k)().metadata;return n.createElement(d.default,{previous:e.previous,next:e.next})}var m=a(353),u=a(1884),v=a(9213),E=a(2935),h=a(5484),p=a(4453),f=a(5611);var g={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function b(e){var t=g[e.versionMetadata.banner];return n.createElement(t,e)}function k(e){var t=e.versionLabel,a=e.to,l=e.onClick;return n.createElement(v.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(u.default,{to:a,onClick:l},n.createElement(v.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function U(e){var t,a=e.className,l=e.versionMetadata,r=(0,m.default)().siteConfig.title,s=(0,E.useActivePlugin)({failfast:!0}).pluginId,o=(0,p.J)(s).savePreferredVersionName,d=(0,E.useDocVersionSuggestions)(s),c=d.latestDocSuggestion,u=d.latestVersionSuggestion,v=null!=c?c:(t=u).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,i.Z)(a,h.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(b,{siteTitle:r,versionMetadata:l})),n.createElement("div",{className:"margin-top--md"},n.createElement(k,{versionLabel:u.label,to:v.path,onClick:function(){return o(u.name)}})))}function L(e){var t=e.className,a=(0,f.E)();return a.banner?n.createElement(U,{className:t,versionMetadata:a}):null}var N=a(5069);function w(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(v.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function _(e){var t=e.lastUpdatedBy;return n.createElement(v.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function T(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,l=e.lastUpdatedBy;return n.createElement("span",{className:h.k.common.lastUpdated},n.createElement(v.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(w,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(_,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var y=a(5773),Z=a(808),A="iconEdit_bHB7",M=["className"];function B(e){var t=e.className,a=(0,Z.Z)(e,M);return n.createElement("svg",(0,y.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,i.Z)(A,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function C(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:h.k.common.editThisPage},n.createElement(B,null),n.createElement(v.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var V="tag_otG2",D="tagRegular_s0E1",x="tagWithCount_PGyn";function F(e){var t=e.permalink,a=e.label,l=e.count;return n.createElement(u.default,{href:t,className:(0,i.Z)(V,l?x:D)},a,l&&n.createElement("span",null,l))}var I="tags_Ow0B",S="tag_DFxh";function H(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(v.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,i.Z)(I,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:S},n.createElement(F,{label:t,permalink:a}))}))))}var P="lastUpdated_pbO5";function O(e){return n.createElement("div",{className:(0,i.Z)(h.k.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(H,e)))}function G(e){var t=e.editUrl,a=e.lastUpdatedAt,l=e.lastUpdatedBy,r=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,i.Z)(h.k.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(C,{editUrl:t})),n.createElement("div",{className:(0,i.Z)("col",P)},(a||l)&&n.createElement(T,{lastUpdatedAt:a,formattedLastUpdatedAt:r,lastUpdatedBy:l})))}function R(){var e=(0,r.k)().metadata,t=e.editUrl,a=e.lastUpdatedAt,l=e.formattedLastUpdatedAt,s=e.lastUpdatedBy,o=e.tags,d=o.length>0,c=!!(t||a||s);return d||c?n.createElement("footer",{className:(0,i.Z)(h.k.docs.docFooter,"docusaurus-mt-lg")},d&&n.createElement(O,{tags:o}),c&&n.createElement(G,{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:s,formattedLastUpdatedAt:l})):null}var j=a(2218),q="tocMobile_Ojys";function z(){var e=(0,r.k)(),t=e.toc,a=e.frontMatter;return n.createElement(j.default,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:(0,i.Z)(h.k.docs.docTocMobile,q)})}var J=a(7061);function Q(){var e=(0,r.k)(),t=e.toc,a=e.frontMatter;return n.createElement(J.default,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:h.k.docs.docTocDesktop})}var W=a(1999),K=a(450);function X(e){var t,a,l,s,o=e.children,d=(t=(0,r.k)(),a=t.metadata,l=t.frontMatter,s=t.contentTitle,l.hide_title||void 0!==s?null:a.title);return n.createElement("div",{className:(0,i.Z)(h.k.docs.docMarkdown,"markdown")},d&&n.createElement("header",null,n.createElement(W.default,{as:"h1"},d)),n.createElement(K.default,null,o))}var Y=a(6821),$="docItemContainer_tjFy",ee="docItemCol_Qr34";function te(e){var t,a,l,s,d,m,u=e.children,v=(t=(0,r.k)(),a=t.frontMatter,l=t.toc,s=(0,o.i)(),d=a.hide_table_of_contents,m=!d&&l.length>0,{hidden:d,mobile:m?n.createElement(z,null):void 0,desktop:!m||"desktop"!==s&&"ssr"!==s?void 0:n.createElement(Q,null)});return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,i.Z)("col",!v.hidden&&ee)},n.createElement(L,null),n.createElement("div",{className:$},n.createElement("article",null,n.createElement(Y.default,null),n.createElement(N.default,null),v.mobile,n.createElement(X,null,u),n.createElement(R,null)),n.createElement(c,null))),v.desktop&&n.createElement("div",{className:"col col--3"},v.desktop))}function ae(e){var t="docs-doc-id-"+e.content.metadata.unversionedId,a=e.content;return n.createElement(r.b,{content:e.content},n.createElement(l.FG,{className:t},n.createElement(s,null),n.createElement(te,null,n.createElement(a,null))))}}}]);