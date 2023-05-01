"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[452],{5318:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var a=t(7378);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var o=a.createContext({}),u=function(e){var n=a.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(o.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},v=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),v=u(t),m=r,d=v["".concat(o,".").concat(m)]||v[m]||p[m]||l;return t?a.createElement(d,i(i({ref:n},c),{},{components:t})):a.createElement(d,i({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,i=new Array(l);i[0]=v;var s={};for(var o in n)hasOwnProperty.call(n,o)&&(s[o]=n[o]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var u=2;u<l;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}v.displayName="MDXCreateElement"},9798:function(e,n,t){t.d(n,{Z:function(){return i}});var a=t(7378),r=t(8944),l="tabItem_wHwb";function i(e){var n=e.children,t=e.hidden,i=e.className;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,i),hidden:t},n)}},3337:function(e,n,t){t.d(n,{Z:function(){return d}});var a=t(5773),r=t(7378),l=t(8944),i=t(3457),s=t(5595),o=t(6457),u="tabList_J5MA",c="tabItem_l0OV";function p(e){var n=e.className,t=e.block,s=e.selectedValue,o=e.selectValue,u=e.tabValues,p=[],v=(0,i.o5)().blockElementScrollPositionUntilNextRender,m=function(e){var n=e.currentTarget,t=p.indexOf(n),a=u[t].value;a!==s&&(v(n),o(a))},d=function(e){var n,t=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":var a,r=p.indexOf(e.currentTarget)+1;t=null!=(a=p[r])?a:p[0];break;case"ArrowLeft":var l,i=p.indexOf(e.currentTarget)-1;t=null!=(l=p[i])?l:p[p.length-1]}null==(n=t)||n.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":t},n)},u.map((function(e){var n=e.value,t=e.label,i=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,key:n,ref:function(e){return p.push(e)},onKeyDown:d,onClick:m},i,{className:(0,l.Z)("tabs__item",c,null==i?void 0:i.className,{"tabs__item--active":s===n})}),null!=t?t:n)})))}function v(e){var n=e.lazy,t=e.children,a=e.selectedValue,l=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){var i=l.find((function(e){return e.props.value===a}));return i?(0,r.cloneElement)(i,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},l.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})})))}function m(e){var n=(0,s.Y)(e);return r.createElement("div",{className:(0,l.Z)("tabs-container",u)},r.createElement(p,(0,a.Z)({},e,n)),r.createElement(v,(0,a.Z)({},e,n)))}function d(e){var n=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(n)},e))}},5595:function(e,n,t){t.d(n,{Y:function(){return v}});var a=t(7378),r=t(5331),l=t(654),i=t(784),s=t(1819);function o(e){return function(e){var n,t;return null!=(n=null==(t=a.Children.map(e,(function(e){if(!e||(0,a.isValidElement)(e)&&(n=e.props)&&"object"==typeof n&&"value"in n)return e;var n;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:t.filter(Boolean))?n:[]}(e).map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes,default:n.default}}))}function u(e){var n=e.values,t=e.children;return(0,a.useMemo)((function(){var e=null!=n?n:o(t);return function(e){var n=(0,i.l)(e,(function(e,n){return e.value===n.value}));if(n.length>0)throw new Error('Docusaurus error: Duplicate values "'+n.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[n,t])}function c(e){var n=e.value;return e.tabValues.some((function(e){return e.value===n}))}function p(e){var n=e.queryString,t=void 0!==n&&n,i=e.groupId,s=(0,r.k6)(),o=function(e){var n=e.queryString,t=void 0!==n&&n,a=e.groupId;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=a?a:null}({queryString:t,groupId:i});return[(0,l._X)(o),(0,a.useCallback)((function(e){if(o){var n=new URLSearchParams(s.location.search);n.set(o,e),s.replace(Object.assign({},s.location,{search:n.toString()}))}}),[o,s])]}function v(e){var n,t,r,l,i=e.defaultValue,o=e.queryString,v=void 0!==o&&o,m=e.groupId,d=u(e),f=(0,a.useState)((function(){return function(e){var n,t=e.defaultValue,a=e.tabValues;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!c({value:t,tabValues:a}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+t+'" but none of its children has the corresponding value. Available values are: '+a.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return t}var r=null!=(n=a.find((function(e){return e.default})))?n:a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:i,tabValues:d})})),g=f[0],h=f[1],b=p({queryString:v,groupId:m}),k=b[0],y=b[1],E=(n=function(e){return e?"docusaurus.tab."+e:null}({groupId:m}.groupId),t=(0,s.Nk)(n),r=t[0],l=t[1],[r,(0,a.useCallback)((function(e){n&&l.set(e)}),[n,l])]),N=E[0],w=E[1],T=function(){var e=null!=k?k:N;return c({value:e,tabValues:d})?e:null}();return(0,a.useLayoutEffect)((function(){T&&h(T)}),[T]),{selectedValue:g,selectValue:(0,a.useCallback)((function(e){if(!c({value:e,tabValues:d}))throw new Error("Can't select invalid tab value="+e);h(e),y(e),w(e)}),[y,w,d]),tabValues:d}}},297:function(e,n,t){t.d(n,{Z:function(){return r}});var a=t(7378);function r(e){var n=e.children,t=e.type;return a.createElement("span",{className:"badge badge--"+t},n)}},2723:function(e,n,t){t.d(n,{Z:function(){return c}});var a=t(7378),r=t(1884),l=t(6125),i=t(297),s="badgeGroup_syf7",o="apiLink_JWAN";function u(e){var n=e.children;return a.createElement("span",{className:s},n)}function c(e){var n=e.api,t=e.backend,s=e.frontend,c=e.tooling;return a.createElement(a.Fragment,null,n&&a.createElement(r.default,{className:o,to:n},"API ",a.createElement(l.Z,null)),a.createElement(u,null,t&&a.createElement(i.Z,{type:"warning"},"Backend"),s&&a.createElement(i.Z,{type:"success"},"Frontend"),c&&a.createElement(i.Z,{type:"primary"},"Tooling")))}},2521:function(e,n,t){t.r(n),t.d(n,{assets:function(){return m},contentTitle:function(){return p},default:function(){return g},frontMatter:function(){return c},metadata:function(){return v},toc:function(){return d}});var a=t(5773),r=t(808),l=(t(7378),t(5318)),i=t(2723),s=t(3337),o=t(9798),u=["components"],c={title:"Events"},p=void 0,v={unversionedId:"event",id:"event",title:"Events",description:"A type-safe event system with multiple emitter patterns.",source:"@site/docs/event.mdx",sourceDirName:".",slug:"/event",permalink:"/docs/event",draft:!1,editUrl:"https://github.com/milesj/boost/edit/master/website/docs/event.mdx",tags:[],version:"current",frontMatter:{title:"Events"},sidebar:"docs",previous:{title:"Decorators",permalink:"/docs/decorators"},next:{title:"Logging",permalink:"/docs/log"}},m={},d=[{value:"Installation",id:"installation",level:2},{value:"Events",id:"events",level:2},{value:"Registering listeners",id:"registering-listeners",level:3},{value:"Unregistering listeners",id:"unregistering-listeners",level:3},{value:"Emitting events",id:"emitting-events",level:3},{value:"Scopes",id:"scopes",level:2},{value:"Event types",id:"event-types",level:2},{value:"Event",id:"event",level:3},{value:"BailEvent",id:"bailevent",level:3},{value:"ConcurrentEvent",id:"concurrentevent",level:3},{value:"WaterfallEvent",id:"waterfallevent",level:3}],f={toc:d};function g(e){var n=e.components,t=(0,r.Z)(e,u);return(0,l.kt)("wrapper",(0,a.Z)({},f,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)(i.Z,{backend:!0,frontend:!0,tooling:!0,api:"/api/event",mdxType:"EnvBadges"}),(0,l.kt)("p",null,"A type-safe event system with multiple emitter patterns."),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)(s.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/event\n"))),(0,l.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/event\n")))),(0,l.kt)("h2",{id:"events"},"Events"),(0,l.kt)("p",null,"The event system is built around individual ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event"))," classes that can be instantiated in\nisolation, register and unregister their own listeners, and emit values by executing each listener\nwith arguments. There are multiple ",(0,l.kt)("a",{parentName:"p",href:"#types"},"types of events"),", so choose the best one for each use\ncase."),(0,l.kt)("p",null,"To begin using events, instantiate an ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event"))," with a unique name -- the name is purely for\ndebugging purposes."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { Event } from '@boost/event';\n\nconst event = new Event<[string]>('example');\n")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event")),"s utilize TypeScript generics for typing the arguments passed to listener functions.\nThis can be defined using a tuple or an array in the 1st generic slot. The 2nd slot is reserved for\n",(0,l.kt)("a",{parentName:"p",href:"#scopes"},"scopes"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// One argument of type number\nnew Event<[number]>('foo');\n\n// Two arguments of type number and string\nnew Event<[number, string]>('bar');\n\n// Three arguments with the last item being optional\nnew Event<[object, boolean, string?]>('baz');\n\n// Array of any type or size\nnew Event<unknown[]>('foo');\n")),(0,l.kt)("h3",{id:"registering-listeners"},"Registering listeners"),(0,l.kt)("p",null,"Listeners are simply functions that can be registered to an event using ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#listen"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#listen()")),".\nThe same listener function reference will only be registered once."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"event.listen(listener);\n")),(0,l.kt)("p",null,"A listener can also be registered to execute only once, using ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#once"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#once()")),", regardless of\nhow many times the event has been emitted."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"event.once(listener);\n")),(0,l.kt)("h3",{id:"unregistering-listeners"},"Unregistering listeners"),(0,l.kt)("p",null,"A listener can be unregistered from an event using ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#unlisten"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#unlisten()")),". The same listener\nreference used to register must also be used for unregistering."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"event.unlisten(listener);\n")),(0,l.kt)("p",null,"To make this flow easier, a pre-configured unlistener is returned from ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#listen"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#listen()")),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const unlisten = event.listen(listener);\nunlisten();\n")),(0,l.kt)("h3",{id:"emitting-events"},"Emitting events"),(0,l.kt)("p",null,"Emitting is the concept of executing all registered listeners with a set of arguments. This can be\nachieved through the ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#emit"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#emit()"))," method, which requires an array of values to pass to\neach listener as arguments."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"event.emit(['abc']);\n")),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"The array values and its types should match the ",(0,l.kt)("a",{parentName:"p",href:"#events"},"generics defined")," on the constructor.")),(0,l.kt)("h2",{id:"scopes"},"Scopes"),(0,l.kt)("p",null,"Scopes are a mechanism for restricting listeners to a unique subset. Scopes are defined as the 2nd\nargument to ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#listen"},(0,l.kt)("inlineCode",{parentName:"a"},"Event#listen()")),", ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#unlisten"},(0,l.kt)("inlineCode",{parentName:"a"},"#unlisten()")),", ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#once"},(0,l.kt)("inlineCode",{parentName:"a"},"#once()")),", and\n",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event#emit"},(0,l.kt)("inlineCode",{parentName:"a"},"#emit()")),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"event.listen(listener);\nevent.listen(listener, 'foo');\nevent.listen(listener, 'bar');\n\n// Will only execute the 1st listener\nevent.emit([]);\n\n// Will only execute the 2nd listener\nevent.emit([], 'foo');\n")),(0,l.kt)("p",null,"A list of acceptable scope names can be passed as the 2nd generic slot to ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event")),",\notherwise all strings are allowed."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new Event<[number], 'foo' | 'bar' | 'baz'>('event');\n")),(0,l.kt)("h2",{id:"event-types"},"Event types"),(0,l.kt)("p",null,"There are 4 types of events that can be instantiated and emitted."),(0,l.kt)("h3",{id:"event"},"Event"),(0,l.kt)("p",null,"Standard ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event"))," that executes listeners in the order they were registered."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { Event } from '@boost/event';\n\nconst event = new Event<[string, number]>('standard');\n\nevent.listen(listener);\n\nevent.emit(['abc', 123]);\n")),(0,l.kt)("h3",{id:"bailevent"},"BailEvent"),(0,l.kt)("p",null,"The ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/BailEvent"},(0,l.kt)("inlineCode",{parentName:"a"},"BailEvent"))," is like ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/Event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event"))," but can bail the execution\nloop early if a listener returns ",(0,l.kt)("inlineCode",{parentName:"p"},"false"),". The emit method will return ",(0,l.kt)("inlineCode",{parentName:"p"},"true")," if a bail occurs."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { BailEvent } from '@boost/event';\n\nconst event = new BailEvent<[object]>('bail');\n\n// Will execute\nevent.listen(() => {});\n\n// Will execute and bail\nevent.listen(() => false);\n\n// Will not execute\nevent.listen(() => {});\n\nconst bailed = event.emit([{ example: true }]);\n")),(0,l.kt)("h3",{id:"concurrentevent"},"ConcurrentEvent"),(0,l.kt)("p",null,"The ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/ConcurrentEvent"},(0,l.kt)("inlineCode",{parentName:"a"},"ConcurrentEvent"))," executes listeners in parallel and returns\na promise with the result of all listeners."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { ConcurrentEvent } from '@boost/event';\n\nconst event = new ConcurrentEvent<[]>('parallel');\n\nevent.listen(doHeavyProcess);\nevent.listen(doBackgroundJob);\n\n// Async/await\nconst result = await event.emit([]);\n\n// Promise\nevent.emit([]).then((results) => {});\n")),(0,l.kt)("h3",{id:"waterfallevent"},"WaterfallEvent"),(0,l.kt)("p",null,"The ",(0,l.kt)("a",{parentName:"p",href:"/api/event/class/WaterfallEvent"},(0,l.kt)("inlineCode",{parentName:"a"},"WaterfallEvent"))," executes each listener in order, passing the\nprevious listeners return value as an argument to the next listener. The final value is then\nreturned as a result."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { WaterfallEvent } from '@boost/event';\n\nconst event = new WaterfallEvent<number>('waterfall');\n\nevent.listen((num) => num * 2);\nevent.listen((num) => num * 3);\n\nconst result = event.emit(10); // 60\n")),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"This event only accepts a single argument. The generic type should not be an array, as it types\nthe only argument and the return type.")))}g.isMDXComponent=!0}}]);