"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3176],{6666:function(e,r,n){n.d(r,{D:function(){return a},f:function(){return s}});var t=n(7378),u=n(8215),o=Symbol("EmptyContext"),i=t.createContext(o);function a(e){var r=e.children,n=(0,t.useState)(null),u=n[0],o=n[1],a=(0,t.useMemo)((function(){return{expandedItem:u,setExpandedItem:o}}),[u]);return t.createElement(i.Provider,{value:a},r)}function s(){var e=(0,t.useContext)(i);if(e===o)throw new u.i6("DocSidebarItemsExpandedStateProvider");return e}},9169:function(e,r,n){n.d(r,{a:function(){return i}});var t=n(7378),u=n(3457),o=n(4993);function i(e){var r=e.threshold,n=(0,t.useState)(!1),i=n[0],a=n[1],s=(0,t.useRef)(!1),l=(0,u.Ct)(),c=l.startScroll,f=l.cancelScroll;return(0,u.RF)((function(e,n){var t=e.scrollY,u=null==n?void 0:n.scrollY;u&&(s.current?s.current=!1:t>=u?(f(),a(!1)):t<r?a(!1):t+window.innerHeight<document.documentElement.scrollHeight&&a(!0))})),(0,o.S)((function(e){e.location.hash&&(s.current=!0,a(!1))})),{shown:i,scrollToTop:function(){return c(0)}}}},7019:function(e,r,n){n.r(r),n.d(r,{Collapsible:function(){return s.z},ErrorBoundaryError:function(){return V.aG},ErrorBoundaryTryAgainButton:function(){return V.Cw},ErrorCauseBoundary:function(){return V.QW},HtmlClassNameProvider:function(){return f.FG},NavbarSecondaryMenuFiller:function(){return m.Zo},PageMetadata:function(){return f.d},ReactContextError:function(){return c.i6},SkipToContentFallbackId:function(){return F.u},SkipToContentLink:function(){return F.l},ThemeClassNames:function(){return l.k},composeProviders:function(){return c.Qc},createStorageSlot:function(){return u.WA},duplicates:function(){return P.l},filterDocCardListItems:function(){return i.MN},isMultiColumnFooterLinks:function(){return S.a},isRegexpStringMatch:function(){return C.F},listStorageKeys:function(){return u._f},listTagsByLetters:function(){return h},processAdmonitionProps:function(){return k},translateTagsPageTitle:function(){return g},uniq:function(){return P.j},useCollapsible:function(){return s.u},useColorMode:function(){return d.I},useContextualSearchFilters:function(){return o._q},useCurrentSidebarCategory:function(){return i.jA},useDocsPreferredVersion:function(){return T.J},useEvent:function(){return c.zX},useIsomorphicLayoutEffect:function(){return c.LI},usePluralForm:function(){return a.c},usePrevious:function(){return c.D9},usePrismTheme:function(){return y.p},useSearchLinkCreator:function(){return b.M},useSearchQueryString:function(){return b.K},useStorageSlot:function(){return u.Nk},useThemeConfig:function(){return t.L},useWindowSize:function(){return v.i}});var t=n(624),u=n(1819),o=n(3149),i=n(2949),a=n(689),s=n(376),l=n(5484),c=n(8215),f=n(1123),d=n(5421),m=n(3471),v=n(8357),p=n(9213),g=function(){return(0,p.I)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"})};function h(e){var r={};return Object.values(e).forEach((function(e){var n=function(e){return e[0].toUpperCase()}(e.label);null!=r[n]||(r[n]=[]),r[n].push(e)})),Object.entries(r).sort((function(e,r){var n=e[0],t=r[0];return n.localeCompare(t)})).map((function(e){return{letter:e[0],tags:e[1].sort((function(e,r){return e.label.localeCompare(r.label)}))}}))}var b=n(3584),S=n(3922),C=n(1503),P=n(784),y=n(6499),T=n(4453),E=n(7378);function k(e){var r,n=function(e){var r=E.Children.toArray(e),n=r.find((function(e){var r;return E.isValidElement(e)&&"mdxAdmonitionTitle"===(null==(r=e.props)?void 0:r.mdxType)})),t=E.createElement(E.Fragment,null,r.filter((function(e){return e!==n})));return{mdxAdmonitionTitle:null==n?void 0:n.props.children,rest:t}}(e.children),t=n.mdxAdmonitionTitle,u=n.rest,o=null!=(r=e.title)?r:t;return Object.assign({},e,o&&{title:o},{children:u})}var F=n(9360),V=n(9441)},6239:function(e,r,n){n.r(r),n.d(r,{AnnouncementBarProvider:function(){return v.pl},BlogPostProvider:function(){return f},Collapsible:function(){return t.Collapsible},ColorModeProvider:function(){return b.S},DEFAULT_SEARCH_TAG:function(){return P.HX},DocProvider:function(){return a.b},DocSidebarItemsExpandedStateProvider:function(){return u.D},DocsPreferredVersionContextProvider:function(){return m.L5},DocsSidebarProvider:function(){return i.b},DocsVersionProvider:function(){return o.q},ErrorBoundaryError:function(){return t.ErrorBoundaryError},ErrorBoundaryTryAgainButton:function(){return t.ErrorBoundaryTryAgainButton},ErrorCauseBoundary:function(){return t.ErrorCauseBoundary},HtmlClassNameProvider:function(){return t.HtmlClassNameProvider},NavbarProvider:function(){return B.V},NavbarSecondaryMenuFiller:function(){return t.NavbarSecondaryMenuFiller},PageMetadata:function(){return t.PageMetadata},PluginHtmlClassNameProvider:function(){return w.VC},ReactContextError:function(){return t.ReactContextError},ScrollControllerProvider:function(){return D.OC},SkipToContentFallbackId:function(){return t.SkipToContentFallbackId},SkipToContentLink:function(){return t.SkipToContentLink},ThemeClassNames:function(){return t.ThemeClassNames},composeProviders:function(){return t.composeProviders},containsLineNumbers:function(){return C.nt},createStorageSlot:function(){return t.createStorageSlot},docVersionSearchTag:function(){return P.os},duplicates:function(){return t.duplicates},filterDocCardListItems:function(){return t.filterDocCardListItems},findFirstCategoryLink:function(){return y.Wl},findSidebarCategory:function(){return y.em},getPrismCssVariables:function(){return C.QC},isActiveSidebarItem:function(){return y._F},isDocsPluginEnabled:function(){return y.cE},isMultiColumnFooterLinks:function(){return t.isMultiColumnFooterLinks},isRegexpStringMatch:function(){return t.isRegexpStringMatch},isSamePath:function(){return I.Mg},keyboardFocusedClassName:function(){return x.h},listStorageKeys:function(){return t.listStorageKeys},listTagsByLetters:function(){return t.listTagsByLetters},parseCodeBlockTitle:function(){return C.bc},parseLanguage:function(){return C.Vo},parseLines:function(){return C.nZ},processAdmonitionProps:function(){return t.processAdmonitionProps},splitNavbarItems:function(){return B.A},translateTagsPageTitle:function(){return t.translateTagsPageTitle},uniq:function(){return t.uniq},useAlternatePageUtils:function(){return S.l},useAnnouncementBar:function(){return v.nT},useBackToTopButton:function(){return q.a},useBlogPost:function(){return d},useCodeWordWrap:function(){return A.F},useCollapsible:function(){return t.useCollapsible},useColorMode:function(){return t.useColorMode},useContextualSearchFilters:function(){return t.useContextualSearchFilters},useCurrentSidebarCategory:function(){return t.useCurrentSidebarCategory},useDoc:function(){return a.k},useDocById:function(){return y.xz},useDocRouteMetadata:function(){return y.hI},useDocSidebarItemsExpandedState:function(){return u.f},useDocsPreferredVersion:function(){return t.useDocsPreferredVersion},useDocsPreferredVersionByPluginId:function(){return m.Oh},useDocsSidebar:function(){return i.V},useDocsVersion:function(){return o.E},useDocsVersionCandidates:function(){return y.lO},useEvent:function(){return t.useEvent},useFilteredAndTreeifiedTOC:function(){return V.b},useHideableNavbar:function(){return M.c},useHistoryPopHandler:function(){return F.Rb},useHistorySelector:function(){return F.xL},useHomePageRoute:function(){return I.Ns},useIsomorphicLayoutEffect:function(){return t.useIsomorphicLayoutEffect},useKeyboardNavigation:function(){return x.t},useLayoutDoc:function(){return y.vY},useLayoutDocsSidebar:function(){return y.oz},useLocalPathname:function(){return k.b},useLocationChange:function(){return E.S},useLockBodyScroll:function(){return N.N},useNavbarMobileSidebar:function(){return g.e},useNavbarSecondaryMenu:function(){return h.Y},usePluralForm:function(){return t.usePluralForm},usePrevious:function(){return t.usePrevious},usePrismTheme:function(){return t.usePrismTheme},useQueryStringValue:function(){return F._X},useScrollController:function(){return D.sG},useScrollPosition:function(){return D.RF},useScrollPositionBlocker:function(){return D.o5},useSearchLinkCreator:function(){return t.useSearchLinkCreator},useSearchQueryString:function(){return t.useSearchQueryString},useSidebarBreadcrumbs:function(){return y.s1},useSmoothScrollTo:function(){return D.Ct},useStorageSlot:function(){return t.useStorageSlot},useTOCHighlight:function(){return L.S},useTabs:function(){return p.Y},useThemeConfig:function(){return t.useThemeConfig},useTitleFormatter:function(){return T.p},useTreeifiedTOC:function(){return V.a},useWindowSize:function(){return t.useWindowSize}});var t=n(7019),u=n(6666),o=n(5611),i=n(2095),a=n(9446),s=n(7378),l=n(8215),c=s.createContext(null);function f(e){var r=e.children,n=e.content,t=e.isBlogPostPage,u=function(e){var r=e.content,n=e.isBlogPostPage;return(0,s.useMemo)((function(){return{metadata:r.metadata,frontMatter:r.frontMatter,assets:r.assets,toc:r.toc,isBlogPostPage:n}}),[r,n])}({content:n,isBlogPostPage:void 0!==t&&t});return s.createElement(c.Provider,{value:u},r)}function d(){var e=(0,s.useContext)(c);if(null===e)throw new l.i6("BlogPostProvider");return e}var m=n(4453),v=n(10),p=n(5595),g=n(5536),h=n(5530),b=n(5421),S=n(3714),C=n(433),P=n(3149),y=n(2949),T=n(9162),E=n(4993),k=n(3511),F=n(654),V=n(6934),D=n(3457),I=n(8862),w=n(1123),B=n(3211),L=n(1344),M=n(2561),x=n(174),N=n(7930),A=n(6177),q=n(9169)},5595:function(e,r,n){n.d(r,{Y:function(){return d}});var t=n(7378),u=n(5331),o=n(654),i=n(784),a=n(1819);function s(e){return function(e){var r,n;return null!=(r=null==(n=t.Children.map(e,(function(e){if(!e||(0,t.isValidElement)(e)&&(r=e.props)&&"object"==typeof r&&"value"in r)return e;var r;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:n.filter(Boolean))?r:[]}(e).map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes,default:r.default}}))}function l(e){var r=e.values,n=e.children;return(0,t.useMemo)((function(){var e=null!=r?r:s(n);return function(e){var r=(0,i.l)(e,(function(e,r){return e.value===r.value}));if(r.length>0)throw new Error('Docusaurus error: Duplicate values "'+r.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[r,n])}function c(e){var r=e.value;return e.tabValues.some((function(e){return e.value===r}))}function f(e){var r=e.queryString,n=void 0!==r&&r,i=e.groupId,a=(0,u.k6)(),s=function(e){var r=e.queryString,n=void 0!==r&&r,t=e.groupId;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=t?t:null}({queryString:n,groupId:i});return[(0,o._X)(s),(0,t.useCallback)((function(e){if(s){var r=new URLSearchParams(a.location.search);r.set(s,e),a.replace(Object.assign({},a.location,{search:r.toString()}))}}),[s,a])]}function d(e){var r,n,u,o,i=e.defaultValue,s=e.queryString,d=void 0!==s&&s,m=e.groupId,v=l(e),p=(0,t.useState)((function(){return function(e){var r,n=e.defaultValue,t=e.tabValues;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!c({value:n,tabValues:t}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+n+'" but none of its children has the corresponding value. Available values are: '+t.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return n}var u=null!=(r=t.find((function(e){return e.default})))?r:t[0];if(!u)throw new Error("Unexpected error: 0 tabValues");return u.value}({defaultValue:i,tabValues:v})})),g=p[0],h=p[1],b=f({queryString:d,groupId:m}),S=b[0],C=b[1],P=(r=function(e){return e?"docusaurus.tab."+e:null}({groupId:m}.groupId),n=(0,a.Nk)(r),u=n[0],o=n[1],[u,(0,t.useCallback)((function(e){r&&o.set(e)}),[r,o])]),y=P[0],T=P[1],E=function(){var e=null!=S?S:y;return c({value:e,tabValues:v})?e:null}();return(0,t.useLayoutEffect)((function(){E&&h(E)}),[E]),{selectedValue:g,selectValue:(0,t.useCallback)((function(e){if(!c({value:e,tabValues:v}))throw new Error("Can't select invalid tab value="+e);h(e),C(e),T(e)}),[C,T,v]),tabValues:v}}},689:function(e,r,n){n.d(r,{c:function(){return l}});var t=n(7378),u=n(353),o=["zero","one","two","few","many","other"];function i(e){return o.filter((function(r){return e.includes(r)}))}var a={locale:"en",pluralForms:i(["one","other"]),select:function(e){return 1===e?"one":"other"}};function s(){var e=(0,u.default)().i18n.currentLocale;return(0,t.useMemo)((function(){try{return r=e,n=new Intl.PluralRules(r),{locale:r,pluralForms:i(n.resolvedOptions().pluralCategories),select:function(e){return n.select(e)}}}catch(t){return console.error('Failed to use Intl.PluralRules for locale "'+e+'".\nDocusaurus will fallback to the default (English) implementation.\nError: '+t.message+"\n"),a}var r,n}),[e])}function l(){var e=s();return{selectMessage:function(r,n){return function(e,r,n){var t=e.split("|");if(1===t.length)return t[0];t.length>n.pluralForms.length&&console.error("For locale="+n.locale+", a maximum of "+n.pluralForms.length+" plural forms are expected ("+n.pluralForms.join(",")+"), but the message contains "+t.length+": "+e);var u=n.select(r),o=n.pluralForms.indexOf(u);return t[Math.min(o,t.length-1)]}(n,r,e)}}}},6498:function(e,r,n){Object.defineProperty(r,"__esModule",{value:!0});var t=function(e){return e&&e.__esModule?e:{default:e}}(n(7378));r.Footer=function(){return t.default.createElement("footer",{className:"tsd-footer"},"Powered by"," ",t.default.createElement("a",{href:"https://github.com/milesj/docusaurus-plugin-typedoc-api"},"docusaurus-plugin-typedoc-api")," ","and ",t.default.createElement("a",{href:"https://typedoc.org/"},"TypeDoc"))}},6715:function(e,r,n){Object.defineProperty(r,"__esModule",{value:!0});var t=n(7378),u=n(1884),o=n(2935),i=n(7019),a=n(6239),s=function(e){return e&&e.__esModule?e:{default:e}},l=s(t),c=s(u);r.VersionBanner=function(){var e=a.useDocsVersion(),r=e.banner,n=e.docs,u=e.pluginId,s=e.version,f=o.useDocVersionSuggestions(u).latestVersionSuggestion,d=i.useDocsPreferredVersion(u).savePreferredVersionName,m=t.useCallback((function(){d(f.name)}),[f.name,d]);if(!r||!f)return null;var v=n[f.label];return l.default.createElement("div",{className:i.ThemeClassNames.docs.docVersionBanner+" alert alert--warning margin-bottom--md",role:"alert"},l.default.createElement("div",null,"unreleased"===r&&l.default.createElement(l.default.Fragment,null,"This is documentation for an unreleased version."),"unmaintained"===r&&l.default.createElement(l.default.Fragment,null,"This is documentation for version ",l.default.createElement("b",null,s),".")," ","For the latest API, see version"," ",l.default.createElement("b",null,l.default.createElement(c.default,{to:v.id,onClick:m},v.title)),"."))}}}]);