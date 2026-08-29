/* ===== CTBU一只喵 · 导航站交互逻辑（一般不用改这里）===== */

(function () {
  "use strict";

  var state = {
    category: "全部",
    stage: null,
    query: ""
  };

  var TYPE_ICON = { "图文": "📝", "资料": "📄", "实景": "📸" };

  var grid = document.getElementById("grid");
  var chipsBox = document.getElementById("chips");
  var searchInput = document.getElementById("search");
  var countEl = document.getElementById("count");
  var emptyEl = document.getElementById("empty");
  var stageTag = document.getElementById("stage-tag");
  var guideCards = document.querySelectorAll(".guide-card");

  /* ---------- 初始化页脚更新时间 ---------- */
  var upd = document.getElementById("updatedAt");
  if (upd && typeof CONFIG !== "undefined" && CONFIG.updatedAt) {
    upd.textContent = "最后更新：" + CONFIG.updatedAt;
  }

  /* ---------- 渲染分类 chips ---------- */
  function renderChips() {
    var all = ["全部"].concat(CATEGORIES || []);
    chipsBox.innerHTML = "";
    all.forEach(function (cat) {
      var b = document.createElement("button");
      b.className = "chip" + (cat === state.category ? " active" : "");
      b.textContent = (cat === "全部") ? "全部" : ((CATEGORY_ICONS && CATEGORY_ICONS[cat] || "") + " " + cat).trim();
      b.addEventListener("click", function () {
        state.category = cat;
        renderChips();
        render();
      });
      chipsBox.appendChild(b);
    });
  }

  /* ---------- 过滤 + 排序 ---------- */
  function getFiltered() {
    var q = state.query.trim().toLowerCase();
    var list = (RESOURCES || []).filter(function (r) {
      if (state.category !== "全部" && r.category !== state.category) return false;
      if (state.stage && r.stage !== state.stage) return false;
      if (q) {
        var hay = (r.title + " " + r.desc + " " + r.category + " " + (r.stage || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    // 置顶优先，其余保持原序
    list.sort(function (a, b) {
      var ha = a.hot ? 1 : 0, hb = b.hot ? 1 : 0;
      return hb - ha;
    });
    return list;
  }

  /* ---------- 渲染卡片 ---------- */
  function render() {
    var list = getFiltered();
    grid.innerHTML = "";

    if (list.length === 0) {
      emptyEl.hidden = false;
      countEl.textContent = "共 0 份";
    } else {
      emptyEl.hidden = true;
      countEl.textContent = "共 " + list.length + " 份干货";
    }

    list.forEach(function (r) {
      var valid = r.link && r.link !== "#";
      var el = document.createElement(valid ? "a" : "div");
      el.className = "card" + (r.hot ? " is-hot" : "") + (valid ? "" : " is-placeholder");
      if (valid) {
        el.href = r.link;
        el.target = "_blank";
        el.rel = "noopener";
      }

      var top = document.createElement("div");
      top.className = "card-top";

      var cat = document.createElement("span");
      cat.className = "cat-tag";
      cat.textContent = (CATEGORY_ICONS && CATEGORY_ICONS[r.category] || "") + " " + r.category;
      top.appendChild(cat);

      var type = document.createElement("span");
      type.className = "type-badge type-" + r.type;
      type.textContent = (TYPE_ICON[r.type] || "") + " " + r.type;
      top.appendChild(type);
      el.appendChild(top);

      if (r.hot) {
        var hot = document.createElement("span");
        hot.className = "hot-badge";
        hot.textContent = "🔥 置顶";
        el.appendChild(hot);
      }

      var title = document.createElement("div");
      title.className = "card-title";
      title.textContent = r.title;
      el.appendChild(title);

      var desc = document.createElement("div");
      desc.className = "card-desc";
      desc.textContent = r.desc;
      el.appendChild(desc);

      var go = document.createElement("span");
      go.className = "card-go";
      go.textContent = valid ? "查看 →" : "示例 · 待替换链接";
      el.appendChild(go);

      grid.appendChild(el);
    });
  }

  /* ---------- 搜索 ---------- */
  searchInput.addEventListener("input", function () {
    state.query = searchInput.value;
    render();
  });

  /* ---------- 入学阶段引导 ---------- */
  guideCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var stage = card.getAttribute("data-stage");
      if (state.stage === stage) {
        state.stage = null; // 再点一次取消
      } else {
        state.stage = stage;
      }
      updateGuide();
      render();
      // 滚到结果区
      var bar = document.querySelector(".result-bar");
      if (bar) bar.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function updateGuide() {
    guideCards.forEach(function (c) {
      c.classList.toggle("active", c.getAttribute("data-stage") === state.stage);
    });
    if (state.stage) {
      stageTag.hidden = false;
      stageTag.textContent = "阶段：" + state.stage + "  ✕";
    } else {
      stageTag.hidden = true;
    }
  }

  stageTag.addEventListener("click", function () {
    state.stage = null;
    updateGuide();
    render();
  });

  /* ---------- 启动 ---------- */
  renderChips();
  render();
})();
