import { router as A } from "@inertiajs/vue3";
import { inject as _, reactive as k, defineComponent as C, createBlock as m, openBlock as d, unref as l, isRef as V, withCtx as g, createElementBlock as M, createCommentVNode as h, Fragment as v, renderList as I, createTextVNode as T, toDisplayString as j, normalizeProps as E, mergeProps as P } from "vue";
import { VSnackbarQueue as B, VBtn as N } from "vuetify/components";
function L(n) {
  return "name" in n && typeof n.name == "string";
}
function S(n) {
  return "url" in n && "method" in n;
}
const w = /* @__PURE__ */ Symbol("inertia-vuetify-notifications"), y = {
  flashKeys: ["success", "error", "warning", "info", "notification"],
  defaults: {
    timeout: 5e3,
    closable: !0,
    location: "bottom"
  },
  actions: {},
  colorMap: {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info"
  }
};
function D(n = {}) {
  const i = {
    ...y,
    ...n,
    defaults: { ...y.defaults, ...n.defaults },
    colorMap: { ...y.colorMap, ...n.colorMap },
    actions: { ...n.actions }
  }, a = k([]), r = /* @__PURE__ */ new Map();
  for (const [t, o] of Object.entries(i.actions))
    r.set(t, o);
  function s(t, o) {
    if (typeof t == "string")
      return {
        text: t,
        color: o ? i.colorMap[o] : void 0,
        timeout: i.defaults.timeout,
        closable: i.defaults.closable
      };
    const f = t.type ? i.colorMap[t.type] || t.type : o ? i.colorMap[o] : void 0;
    return {
      text: t.message,
      color: f,
      timeout: t.timeout ?? i.defaults.timeout,
      closable: t.closable ?? i.defaults.closable,
      actions: t.actions
    };
  }
  function u(t, o) {
    const f = s(t, o);
    a.push(f);
  }
  function c(t, o) {
    r.set(t, o);
  }
  function p(t) {
    r.delete(t);
  }
  async function e(t) {
    if (L(t)) {
      const o = r.get(t.name);
      o ? await o(t.payload) : console.warn(`[inertia-vuetify-notifications] No handler registered for action: ${t.name}`);
    } else if (S(t)) {
      const o = t.method.toLowerCase();
      A.visit(t.url, {
        method: o,
        data: t.data
      });
    }
  }
  return {
    queue: a,
    notify: u,
    registerAction: c,
    unregisterAction: p,
    executeAction: e,
    options: i
  };
}
function F() {
  const n = _(w);
  if (!n)
    throw new Error(
      "[inertia-vuetify-notifications] useNotifications() must be used within a component tree that has the notification plugin installed. Did you forget to call app.use(inertiaVuetifyNotifications())?"
    );
  return n;
}
function R(n = {}) {
  return {
    install(i) {
      const a = D(n);
      i.provide(w, a), A.on("flash", (r) => {
        const s = r.detail.flash;
        if (!(!s || typeof s != "object"))
          for (const u of a.options.flashKeys) {
            const c = s[u];
            c != null && a.notify(c, u);
          }
      });
    }
  };
}
const $ = /* @__PURE__ */ C({
  __name: "NotificationProvider",
  setup(n) {
    const { queue: i, executeAction: a, options: r } = F();
    function s(e) {
      return typeof e == "object" && e !== null && "actions" in e && Array.isArray(e.actions) && e.actions.length > 0;
    }
    function u(e) {
      return e.label;
    }
    async function c(e) {
      await a(e);
    }
    function p(e) {
      return typeof e == "string" ? !0 : typeof e == "object" && e !== null && "closable" in e ? e.closable !== !1 : !0;
    }
    return (e, t) => (d(), m(l(B), {
      modelValue: l(i),
      "onUpdate:modelValue": t[0] || (t[0] = (o) => V(i) ? i.value = o : null),
      location: l(r).defaults.location,
      closable: l(r).defaults.closable,
      timeout: l(r).defaults.timeout
    }, {
      actions: g(({ item: o, props: f }) => [
        s(o) ? (d(!0), M(v, { key: 0 }, I(o.actions, (b, x) => (d(), m(l(N), {
          key: x,
          variant: "text",
          size: "small",
          onClick: (O) => c(b)
        }, {
          default: g(() => [
            T(j(u(b)), 1)
          ]),
          _: 2
        }, 1032, ["onClick"]))), 128)) : h("", !0),
        p(o) ? (d(), m(l(N), E(P({ key: 1 }, f)), null, 16)) : h("", !0)
      ]),
      _: 1
    }, 8, ["modelValue", "location", "closable", "timeout"]));
  }
});
export {
  $ as NotificationProvider,
  R as inertiaVuetifyNotifications,
  L as isNamedAction,
  S as isUrlAction,
  F as useNotifications
};
