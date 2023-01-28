# keep-alive-vue3  [中文](./README-CH.md)
Extend vue3 keep-alive and router-view, add the function of automatically judging whether to use the cache.
Support for vue2 [Click here](https://github.com/deep-fish-pixel/keep-alive-vue2)

### The background of the problem

If the page uses keep-alive and router-view, the advantage is that the operation state of the previous step is quickly restored when the next page operation returns, and this experience is very good. 

But it also brings problems. 

When the user enters the page from the navigation menu or breadcrumb, a brand new page is needed, but the cached page is actually used, and this result is not what we want. 

keep-alive-vue3 solves this problem. 

It uses the cache when you operate $router.back and $router.go to return the page by default, and $router.push does not use the cache by default.

### Install

```npm i keep-alive-vue3```

### Steps for usage

#### First: import and register component

```
import KeepAliveVue3 from 'keep-alive-vue3';

createApp(App).use(router).use(KeepAliveVue3)
```

#### Second: use keep-alive-vue3 component replace keep-alive and router-view components

keep-alive-vue3 encapsulates keep-alive and router-view internally, 

so you only need to write the keep-alive-vue3 component element.

The cached attribute is used to cache the use of page caching.

```
<div id="app">
    <keep-alive-vue3 :cached="$route.meta.keepAlive" />
</div>
```

#### Third: must use the method of the vue-router instance. Only after $router.go and $router.back are called, the cached page is used.

### keep-alive-vue3 properties descriptions

| property | description | type | option | default |
| --- | --- | --- | --- |---------|
| cached | whether to disable page caching | Boolean  | true/false | false   |
| name | router-view name | String  | - | -       |
| include | only components with matching names will be cached | RegExp  | - | -       |
| exclude | any component whose name matches will not be cached | RegExp  | - | -       |
| max | maximum number of component instances that can be cached | Number  | - | -       |

### [Example](https://codesandbox.io/s/vue3-keep-alive-vue3-d2o4k5)

### vue-router interface extensions

#### $router.push

The page displayed by the push interface does not use the cache function by default. If you need to use it, configure cached to true

```javascript
this.$router.push({
  name: 'list',
  cached: true
});
```
#### $router.back

The page displayed by the back interface uses the cache function by default. If disabled, configure cached to false

```javascript
this.$router.back({
  cached: false
});
```

#### $router.go

The page displayed by the go interface uses the cache function by default when it is less than 0, and the cache is prohibited by default when it is greater than 0.
If disabled, configure cached to false

```javascript
this.$router.go(-1, {
  cached: false
});
```
