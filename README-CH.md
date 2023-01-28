# keep-alive-vue3
扩展vue3的keep-alive and router-view，可以自动判断是否需要使用缓存功能。
与router-view不同，该工具默认是不缓存页面内容，仅在keep-alive-vue3配置了cached为true值的情况下缓存指定页面。
对vue2的支持[点击这里](https://github.com/deep-fish-pixel/keep-alive-vue3)

### 背景

当你项目中使用了keep-alive和router-view，好处是在下一个页面操作返回时快速恢复了上一步的操作状态，这样的体验非常好。

但是也有另外一个问题，当用户从导航菜单或面包削等入口进入页面，是需要一个全新页面的，但实际上还是使用了缓存的页面，这样的结果不是我们想要的。

keep-alive-vue3解决了这样问题，在你操作$router.back和$router.go默认返回页面使用缓存，
$router.push默认不使用缓存。


### 安装

```npm i keep-alive-vue3```

### 使用步骤

#### 第一步 引用并注册组件

```
import KeepAliveVue3 from 'keep-alive-vue3';

createApp(App).use(router).use(KeepAliveVue3)
```

#### 第二步 使用keep-alive-vue3组件代替keep-alive和router-view

keep-alive-vue3内部封装了keep-alive和router-view，所以你只要写keep-alive-vue3组件元素。

disabled属性，用来设置禁止使用页面缓存。

```
<div id="app">
    <keep-alive-vue3 :cached="$route.meta.keepAlive" />
</div>
```

#### 第三步 必须使用vue-router实例的方法，只有在$router.go、$router.back调用后，才默认使用缓存页面。

### keep-alive-vue3属性说明

| 属性      | 说明 | 类型 | 可选值 | 默认值   |
|---------| --- | --- | --- |-------|
| cached  | 是否缓存页面 | Boolean  | true/false | false |
| name    | router-view名称 | String  | - | -     |
| include | 只有名称匹配的组件会被缓存 | RegExp  | - | -     |
| exclude | 任何名称匹配的组件都不会被缓存 | RegExp  | - | -     |
| max     | 最多可以缓存多少组件实例 | Number  | - | -     |

### [Example](https://codesandbox.io/s/vue3-keep-alive-vue3-d2o4k5)

### vue-router接口扩展

#### $router.push
push接口展示的页面默认不使用缓存功能。如果需要使用，配置cached为true
```javascript
this.$router.push({
  name: 'list',
  cached: true
});
```
#### $router.back
back接口展示的页面默认使用缓存功能。如果禁止使用，配置cached为false
```javascript
this.$router.back({
  cached: false
});
```

#### $router.go
go接口展示的页面，小于0默认使用缓存功能，大于0默认禁止使用缓存。如果禁止使用，配置cached为false
```javascript
this.$router.go(-1, {
  cached: false
});
```
