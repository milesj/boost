(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9723],{297:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var a=n(7378);function o(e){var t=e.children,n=e.type;return a.createElement("span",{className:"badge badge--"+n},t)}},7586:function(e,t,n){"use strict";n.d(t,{Z:function(){return m}});var a=n(7378),o=n(4142),r=n(1554),l=n(297),s="badgeGroup_2HOO",i="apiLink_32Vk";function c(e){var t=e.children;return a.createElement("span",{className:s},t)}function m(e){var t=e.api,n=e.backend,s=e.frontend,m=e.tooling;return a.createElement(a.Fragment,null,t&&a.createElement(o.default,{className:i,to:t},"API ",a.createElement(r.Z,null)),a.createElement(c,null,n&&a.createElement(l.Z,{type:"warning"},"Backend"),s&&a.createElement(l.Z,{type:"success"},"Frontend"),m&&a.createElement(l.Z,{type:"primary"},"Tooling")))}},7684:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return m},contentTitle:function(){return p},metadata:function(){return d},toc:function(){return u},default:function(){return k}});var a=n(9603),o=n(120),r=(n(7378),n(5318)),l=n(7586),s=n(4535),i=n(517),c=["components"],m={title:"Decorators"},p=void 0,d={unversionedId:"decorators",id:"decorators",isDocsHomePage:!1,title:"Decorators",description:"Experimental decorators for common patterns.",source:"@site/docs/decorators.mdx",sourceDirName:".",slug:"/decorators",permalink:"/docs/decorators",editUrl:"https://github.com/milesj/boost/edit/master/website/docs/decorators.mdx",tags:[],version:"current",frontMatter:{title:"Decorators"},sidebar:"docs",previous:{title:"Debugging",permalink:"/docs/debug"},next:{title:"Events",permalink:"/docs/event"}},u=[{value:"Installation",id:"installation",children:[]},{value:"@Bind",id:"bind",children:[]},{value:"@Debounce",id:"debounce",children:[]},{value:"@Deprecate",id:"deprecate",children:[]},{value:"@Memoize",id:"memoize",children:[]},{value:"@Throttle",id:"throttle",children:[]}],h={toc:u};function k(e){var t=e.components,n=(0,o.Z)(e,c);return(0,r.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)(l.Z,{backend:!0,frontend:!0,tooling:!0,api:"/api/decorators",mdxType:"EnvBadges"}),(0,r.kt)("p",null,"Experimental decorators for common patterns."),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)(s.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"yarn",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @boost/decorators\n"))),(0,r.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @boost/decorators\n")))),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Decorators may also be imported from ",(0,r.kt)("inlineCode",{parentName:"p"},"@boost/common"),".")),(0,r.kt)("h2",{id:"bind"},"@Bind"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/function/Bind"},(0,r.kt)("inlineCode",{parentName:"a"},"Bind"))," decorator automatically binds a class method's ",(0,r.kt)("inlineCode",{parentName:"p"},"this"),"\ncontext to its current instance, even when the method is dereferenced, which is the primary use-case\nfor this decorator. This is an alternative to manually ",(0,r.kt)("inlineCode",{parentName:"p"},"bind()"),"ing within the constructor, or using\nclass properties with anonymous functions."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Bind } from '@boost/decorators';\n\nclass Example {\n    @Bind()\n    static test() {\n        return this; // Class constructor\n    }\n\n    @Bind()\n    test() {\n        return this; // Class instance\n    }\n}\n\nconst example = new Example();\nconst { test } = example;\n\nexample.test() = test(); // true\n")),(0,r.kt)("h2",{id:"debounce"},"@Debounce"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/function/Debounce"},(0,r.kt)("inlineCode",{parentName:"a"},"Debounce"))," decorator delays the execution of the class\nmethod by the provided time in milliseconds. If another method call occurs within this timeframe,\nthe execution delay will be reset."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Debounce } from '@boost/decorators';\n\nclass Example {\n    @Debounce(250)\n    log() {\n        console.log('Fired!');\n    }\n}\n\nconst example = new Example();\n\nexample.log(); // Will not log\nexample.log(); // Will not log\nexample.log(); // Will log after 250ms\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Debouncing only works on methods with no return.")),(0,r.kt)("h2",{id:"deprecate"},"@Deprecate"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/function/Deprecate"},(0,r.kt)("inlineCode",{parentName:"a"},"Deprecate"))," decorator marks a class declaration, class\nmethod, class property, or method parameter as deprecated by logging a deprecation message to the\nconsole. Works for both static and instance members."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Deprecate } from '@boost/decorators';\n\n@Deprecate()\nclass Example {\n    @Deprecate()\n    static property = 123;\n\n    @Deprecate('Can provide a custom message')\n    method() {}\n}\n")),(0,r.kt)("h2",{id:"memoize"},"@Memoize"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/function/Memoize"},(0,r.kt)("inlineCode",{parentName:"a"},"Memoize"))," decorator caches the return value of a class\nmethod or getter to consistently and efficiently return the same value. By default, hashes the\nmethod's arguments to determine a cache key, but can be customized with a unique hashing function."),(0,r.kt)("p",null,"Memoization also works on async/promise based methods by caching the promise itself. However, if the\npromise is rejected, the cache will be deleted so that subsequent calls can refresh itself."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Memoize } from '@boost/decorators';\n\nclass Example {\n    @Memoize()\n    someExpensiveOperation() {\n        // Return some value\n    }\n\n    @Memoize({ expires: 3600 })\n    async fetchInBackground() {\n        // Return some async value with an expiration time\n    }\n}\n\nconst example = new Example();\n\nexample.someExpensiveOperation(); // Will run and cache result\nexample.someExpensiveOperation(); // Will return cached result\nexample.someExpensiveOperation(); // Will return cached result\n")),(0,r.kt)("p",null,"The memoize decorator supports the ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/interface/MemoizeOptions"},(0,r.kt)("inlineCode",{parentName:"a"},"MemoizeOptions")),"\nobject as an argument."),(0,r.kt)("h2",{id:"throttle"},"@Throttle"),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"/api/decorators/function/Throttle"},(0,r.kt)("inlineCode",{parentName:"a"},"Throttle"))," decorator throttles the execution of a class\nmethod to only fire once within every delay timeframe (in milliseconds). Will always fire on the\nfirst invocation."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Throttle } from '@boost/decorators';\n\nclass Example {\n    @Throttle(100)\n    log() {\n        console.log('Fired!');\n    }\n}\n\nconst example = new Example();\n\nexample.log(); // Will log\nexample.log(); // Will not log\nexample.log(); // Will not log\n\n// 100ms pass\nexample.log(); // Will log\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Throttling only works on methods with no return.")))}k.isMDXComponent=!0}}]);