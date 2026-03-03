import { router as b } from "@inertiajs/vue3";
import { inject as x, ref as _, defineComponent as C, openBlock as d, createBlock as m, unref as c, isRef as V, withCtx as h, createElementBlock as M, Fragment as v, renderList as j, createTextVNode as I, toDisplayString as T, createCommentVNode as N, mergeProps as E } from "vue";
import { VSnackbarQueue as F, VBtn as A } from "vuetify/components";
function O(o) {
  return "name" in o && typeof o.name == "string";
}
function P(o) {
  return "url" in o && "method" in o;
}
const w = /* @__PURE__ */ Symbol("inertia-vuetify-notifications"), y = {
  flashKeys: ["success", "error", "warning", "info", "notification"],
  defaults: {
    timeout: 5e3,
    closable: !0,
    location: "top"
  },
  actions: {},
  colorMap: {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info"
  }
};
function S(o = {}) {
  const n = {
    ...y,
    ...o,
    defaults: { ...y.defaults, ...o.defaults },
    colorMap: { ...y.colorMap, ...o.colorMap },
    actions: { ...o.actions }
  }, s = _([]), r = /* @__PURE__ */ new Map();
  for (const [t, e] of Object.entries(n.actions))
    r.set(t, e);
  function u(t, e) {
    if (typeof t == "string")
      return {
        text: t,
        color: e ? n.colorMap[e] : void 0,
        timeout: n.defaults.timeout,
        closable: n.defaults.closable
      };
    const f = t.type ? n.colorMap[t.type] || t.type : e ? n.colorMap[e] : void 0;
    return {
      text: t.message,
      color: f,
      timeout: t.timeout ?? n.defaults.timeout,
      closable: t.closable ?? n.defaults.closable,
      actions: t.actions
    };
  }
  function a(t, e) {
    const f = u(t, e);
    s.value.push(f);
  }
  function l(t, e) {
    r.set(t, e);
  }
  function p(t) {
    r.delete(t);
  }
  async function i(t) {
    if (O(t)) {
      const e = r.get(t.name);
      e ? await e(t.payload) : console.warn(`[inertia-vuetify-notifications] No handler registered for action: ${t.name}`);
    } else if (P(t)) {
      const e = t.method.toLowerCase();
      b.visit(t.url, {
        method: e,
        data: t.data
      });
    }
  }
  return {
    queue: s,
    notify: a,
    registerAction: l,
    unregisterAction: p,
    executeAction: i,
    options: n
  };
}
function B() {
  const o = x(w);
  if (!o)
    throw new Error(
      "[inertia-vuetify-notifications] useNotifications() must be used within a component tree that has the notification plugin installed. Did you forget to call app.use(inertiaVuetifyNotifications())?"
    );
  return o;
}
function D(o, n) {
  for (const s of n.options.flashKeys) {
    const r = o[s];
    r != null && n.notify(r, s);
  }
}
function K(o = {}) {
  return {
    install(n) {
      const s = S(o);
      n.provide(w, s);
      let r = null;
      b.on("before", () => {
        r = null;
      }), b.on("flash", (u) => {
        const a = u.detail.flash;
        if (!a || typeof a != "object" || Object.keys(a).length === 0) return;
        const l = JSON.stringify(a);
        l !== r && (r = l, D(a, s));
      });
    }
  };
}
const R = /* @__PURE__ */ C({
  __name: "NotificationProvider",
  setup(o) {
    const { queue: n, executeAction: s, options: r } = B();
    function u(i) {
      return typeof i == "object" && i !== null && "actions" in i && Array.isArray(i.actions) && i.actions.length > 0;
    }
    function a(i) {
      return i.label;
    }
    async function l(i) {
      await s(i);
    }
    function p(i) {
      return typeof i == "string" ? !0 : typeof i == "object" && i !== null && "closable" in i ? i.closable !== !1 : !0;
    }
    return (i, t) => (d(), m(c(F), {
      modelValue: c(n),
      "onUpdate:modelValue": t[0] || (t[0] = (e) => V(n) ? n.value = e : null),
      location: c(r).defaults.location,
      closable: c(r).defaults.closable,
      timeout: c(r).defaults.timeout
    }, {
      actions: h(({ item: e, props: f }) => [
        u(e) ? (d(!0), M(v, { key: 0 }, j(e.actions, (g, k) => (d(), m(c(A), {
          key: k,
          variant: "text",
          size: "small",
          onClick: (L) => l(g)
        }, {
          default: h(() => [
            I(T(a(g)), 1)
          ]),
          _: 2
        }, 1032, ["onClick"]))), 128)) : N("", !0),
        p(e) ? (d(), m(c(A), E({ key: 1 }, f, { icon: "mdi-close" }), null, 16)) : N("", !0)
      ]),
      _: 1
    }, 8, ["modelValue", "location", "closable", "timeout"]));
  }
});
export {
  R as NotificationProvider,
  K as inertiaVuetifyNotifications,
  O as isNamedAction,
  P as isUrlAction,
  B as useNotifications
};
