'use strict';

var vue = require('vue');

const objectClass = Object;
// 解决跨微前端问题
objectClass.__keepAlive = true;

const wrapRouter = {
  getKeepAlive() {
    return objectClass.__keepAlive;
  },
  setKeepAlive(useKeepAlive) {
    objectClass.__keepAlive = useKeepAlive;
  },
  wrap(router) {
    const { push, go } = router;

    router.push = function(...args) {
      const location = args[0];

      if (location && typeof location.cached === 'boolean') {
        wrapRouter.setKeepAlive(location.cached);
      } else if (location && (typeof location.keepAlive === 'boolean')) {
        wrapRouter.setKeepAlive(location.keepAlive);
      }  else {
        wrapRouter.setKeepAlive(false);
      }
      return push.apply(this, args);
    };
    router.back = function(options) {
      if (options && typeof options.cached === 'boolean') {
        wrapRouter.setKeepAlive(objectClass.__keepAlive);
      } else if (options && (typeof options.keepAlive === 'boolean')) {
        wrapRouter.setKeepAlive(options.keepAlive);
      }
      return go.apply(this, [-1]);
    };
    router.go = function(num, options) {
      if (num > 0) {
        wrapRouter.setKeepAlive(false);
      }
      if (options && typeof options.cached === 'boolean') {
        wrapRouter.setKeepAlive(objectClass.__keepAlive);
      } else if (options && (typeof options.keepAlive === 'boolean')) {
        wrapRouter.setKeepAlive(options.keepAlive);
      }
      return go.apply(this, [num]);
    };
  }
};

const Main = {
  name: 'KeepAliveVue3',
  props: {
    include: RegExp,
    exclude: RegExp,
    max: Number,
    name: String,
    cached: Boolean
  },
  data() {
    return {
      hasDestroyed: false,
      current: null,
    };
  },

  methods: {
    before(to, from, next) {
      if (this.hasDestroyed) {
        return next();
      }
      if (!wrapRouter.getKeepAlive()) {
        this.deleteCache(to);
      }
      next();
    },
    after(to) {
      if (this.hasDestroyed) {
        return true;
      }
      setTimeout(() => {
        if (!wrapRouter.getKeepAlive() && this.cached) {
          this.deleteCache(to);
        }
        wrapRouter.setKeepAlive(true);
      }, 10);
    },
    deleteCache(router){
      const keepAlive = this.$refs.keepAlive;
      const cache = keepAlive && keepAlive.$ && keepAlive.$.__v_cache;
      if (cache) {
        this.current = cache.get(router.name);
        if (this.current) {
          cache.delete(router.name);
        }
      }
    }
  },

  created() {
    wrapRouter.wrap(this.$router);
    this.$router.beforeEach(this.before);
    this.$router.afterEach(this.after);
  },
  destroyed() {
    this.hasDestroyed = true;
  },
  render() {
    const keepAliveProps = {
      include: this.include,
      exclude: this.exclude,
      max: this.max,
      ref: 'keepAlive'
    };
    const $route = this.$route;
    const isCached = this.cached;

    return vue.createVNode(vue.resolveComponent('router-view'), {
        name: this.name
      }, {
        default: vue.withCtx(function ({ Component }) {
          return [(vue.openBlock(), vue.createBlock(vue.KeepAlive, keepAliveProps, [isCached ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
              key: $route.name
            })) : vue.createCommentVNode("v-if", true)], 1032
            , ["include", "exclude", "max"])), !isCached ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
            key: $route.name
          })) :vue.createCommentVNode("v-if", true)];
        })
      }, 8
      , ["name"]);
  }
};

var main = {
  install: (app) => {
    app.component(Main.name, Main);
  }
};

module.exports = main;
