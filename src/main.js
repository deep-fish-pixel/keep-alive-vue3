import {
  createVNode,
  withCtx,
  openBlock,
  createBlock,
  resolveComponent,
  resolveDynamicComponent,
  KeepAlive,
  createCommentVNode
} from 'vue';
import wrapRouter from './wrapRouter';

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

    return createVNode(resolveComponent('router-view'), {
        name: this.name
      }, {
        default: withCtx(function ({ Component }) {
          return [(openBlock(), createBlock(KeepAlive, keepAliveProps, [isCached ? (openBlock(), createBlock(resolveDynamicComponent(Component), {
              key: $route.name
            })) : createCommentVNode("v-if", true)], 1032
            , ["include", "exclude", "max"])), !isCached ? (openBlock(), createBlock(resolveDynamicComponent(Component), {
            key: $route.name
          })) :createCommentVNode("v-if", true)];
        })
      }, 8
      , ["name"]);
  }
};

export default {
  install: (app) => {
    app.component(Main.name, Main);
  }
};
