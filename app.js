/* ===== CTBU一只喵 · 导航站交互逻辑（一般不用改这里）===== */

(function () {
  "use strict";

  var state = {
    category: "全部",
    stage: null,
    query: ""
  };

  /* 「敬请期待」区展开状态（跨多次渲染保留） */
  var pendingOpen = false;

  var TYPE_ICON = { "图文": "📝", "资料": "📄", "实景": "📸" };

  var grid = document.getElementById("grid");
  var chipsBox = document.getElementById("chips");
  var searchInput = document.getElementById("search");
  var countEl = document.getElementById("count");
  var emptyEl = document.getElementById("empty");
  var emptyTextEl = document.querySelector("#empty p");
  var stageTag = document.getElementById("stage-tag");
  var guideCards = document.querySelectorAll(".guide-card");
  var pendingZone = document.getElementById("pendingZone");

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

  /* ---------- 过滤（占位卡单独收集，不进网格） ---------- */
  function getFiltered() {
    var q = state.query.trim().toLowerCase();
    var real = [], pending = [];
    (RESOURCES || []).forEach(function (r) {
      if (state.category !== "全部" && r.category !== state.category) return;
      if (state.stage && r.stage !== state.stage) return;
      if (q) {
        var hay = (r.title + " " + r.desc + " " + r.category + " " + (r.stage || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      if (r.link && r.link !== "#") real.push(r);
      else pending.push(r);
    });
    return { real: real, pending: pending };
  }

  /* ---------- 单张卡片 ---------- */
  function makeCard(r) {
    var el = document.createElement("a");
    el.className = "card" + (r.hot ? " is-hot" : "");
    el.href = r.link;
    el.target = "_blank";
    el.rel = "noopener";

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
    go.textContent = "查看 →";
    el.appendChild(go);

    return el;
  }

  /* ---------- 主渲染：按分类分节 ---------- */
  function render() {
    var res = getFiltered();
    var list = res.real;
    grid.innerHTML = "";

    /* 计数 + 空状态 */
    countEl.textContent = "共 " + list.length + " 份干货";
    if (list.length === 0) {
      emptyEl.hidden = false;
      if (emptyTextEl) {
        emptyTextEl.textContent = res.pending.length
          ? "这一类学姐还在整理中喵，即将上线的都收在下面～"
          : "没找到相关内容～换个关键词试试？";
      }
    } else {
      emptyEl.hidden = true;
    }

    /* 分组：默认视图按 CATEGORIES 顺序分节；选中某分类时不重复显示节标题 */
    var showTitles = (state.category === "全部");
    var cats = [];
    if (showTitles) {
      cats = CATEGORIES || [];
    } else {
      cats = [state.category];
    }

    var rendered = {};
    cats.forEach(function (cat) {
      var cards = list.filter(function (r) { return r.category === cat; });
      if (!cards.length) return;
      rendered[cat] = true;
      renderSection(cat, cards, showTitles);
    });

    /* 兜底：万一有卡片分类不在 CATEGORIES 里，也不让它消失 */
    var leftovers = list.filter(function (r) { return !rendered[r.category]; });
    if (leftovers.length) {
      var seen = {};
      leftovers.forEach(function (r) {
        if (!seen[r.category]) {
          seen[r.category] = true;
          renderSection(r.category, leftovers.filter(function (x) { return x.category === r.category; }), true);
        }
      });
    }

    renderPending(res.pending);
  }

  function renderSection(cat, cards, withTitle) {
    var sec = document.createElement("section");
    sec.className = "cat-section";

    if (withTitle) {
      var h = document.createElement("h2");
      h.className = "cat-section-title";
      h.textContent = ((CATEGORY_ICONS && CATEGORY_ICONS[cat] || "") + " " + cat).trim();
      sec.appendChild(h);
    }

    /* 节内 hot 置顶 */
    cards = cards.slice().sort(function (a, b) {
      var ha = a.hot ? 1 : 0, hb = b.hot ? 1 : 0;
      return hb - ha;
    });

    var g = document.createElement("div");
    g.className = "grid";
    cards.forEach(function (r) { g.appendChild(makeCard(r)); });
    sec.appendChild(g);

    grid.appendChild(sec);
  }

  /* ---------- 「敬请期待」折叠区 ---------- */
  function renderPending(list) {
    if (!pendingZone) return;
    pendingZone.innerHTML = "";
    if (!list.length) { pendingZone.hidden = true; return; }
    pendingZone.hidden = false;

    var btn = document.createElement("button");
    btn.className = "pending-toggle";
    btn.type = "button";

    var box = document.createElement("div");
    box.className = "pending-list";
    box.hidden = !pendingOpen;

    list.forEach(function (r) {
      var item = document.createElement("div");
      item.className = "pending-item";

      var tag = document.createElement("span");
      tag.className = "pending-cat";
      tag.textContent = ((CATEGORY_ICONS && CATEGORY_ICONS[r.category] || "") + " " + r.category).trim();
      item.appendChild(tag);

      var t = document.createElement("span");
      t.className = "pending-title";
      t.textContent = r.title;
      item.appendChild(t);

      var s = document.createElement("span");
      s.className = "pending-state";
      s.textContent = "整理中";
      item.appendChild(s);

      box.appendChild(item);
    });

    function syncBtn() {
      btn.textContent = pendingOpen
        ? "收起 ↑"
        : "⏳ 还有 " + list.length + " 期在路上 · 点开看看";
    }
    syncBtn();
    btn.addEventListener("click", function () {
      pendingOpen = !pendingOpen;
      box.hidden = !pendingOpen;
      syncBtn();
    });

    pendingZone.appendChild(btn);
    pendingZone.appendChild(box);
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
