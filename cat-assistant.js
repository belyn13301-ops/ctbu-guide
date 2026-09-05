/* ============================================================
   喵小助手 · 悬浮猫客服（纯前端，无依赖）
   - 收起：右下角猫头像（呼吸摆动 + 随机眨眼）
   - 展开：对话窗口，本地关键词匹配问答
   - 表情：思考眨眼 / 回复摇尾巴 / 摸头开心冒爱心
   - 快捷问题 + 头顶提示气泡 + 移动端适配
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 猫脸 SVG（字符串生成，可多处复用） ---------- */
  function catFaceSVG(size) {
    return ''
      + '<svg class="cat-face" viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true">'
      +   '<path d="M15 26 L10 7 L28 15 Z" fill="#f2a4b8" stroke="#e08da2" stroke-width="1.2" stroke-linejoin="round"/>'
      +   '<path d="M49 26 L54 7 L36 15 Z" fill="#f2a4b8" stroke="#e08da2" stroke-width="1.2" stroke-linejoin="round"/>'
      +   '<path d="M16.5 21 L13.8 11.5 L23.5 16.2 Z" fill="#fbd6df"/>'
      +   '<path d="M47.5 21 L50.2 11.5 L40.5 16.2 Z" fill="#fbd6df"/>'
      +   '<circle cx="32" cy="37" r="20" fill="#f6bcc8"/>'
      +   '<ellipse class="cat-blush" cx="18" cy="43" rx="4.6" ry="2.7" fill="#f08fa4" opacity="0.45"/>'
      +   '<ellipse class="cat-blush" cx="46" cy="43" rx="4.6" ry="2.7" fill="#f08fa4" opacity="0.45"/>'
      +   '<g class="cat-eye">'
      +     '<circle cx="24.5" cy="35.5" r="3.6" fill="#4a3540"/>'
      +     '<circle cx="25.8" cy="34.3" r="1.25" fill="#fff"/>'
      +   '</g>'
      +   '<g class="cat-eye">'
      +     '<circle cx="39.5" cy="35.5" r="3.6" fill="#4a3540"/>'
      +     '<circle cx="40.8" cy="34.3" r="1.25" fill="#fff"/>'
      +   '</g>'
      +   '<path class="cat-eye-happy" d="M21 36 q3.5 -4.5 7 0 M36 36 q3.5 -4.5 7 0" stroke="#4a3540" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
      +   '<path d="M30.4 40.6 L33.6 40.6 L32 42.6 Z" fill="#e0838f"/>'
      +   '<path d="M32 42.6 q-1.6 3.1 -4.6 1.3 M32 42.6 q1.6 3.1 4.6 1.3" stroke="#4a3540" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
      + '</svg>';
  }

  function catTailSVG() {
    return '<svg class="cat-tail" viewBox="0 0 40 40" aria-hidden="true">'
      + '<path d="M10 36 Q3 24 10 15 Q17 6 25 10" fill="none" stroke="#f2a4b8" stroke-width="7" stroke-linecap="round"/>'
      + '</svg>';
  }

  /* ---------- 页面路径前缀（首页 / 内容页两种深度） ---------- */
  var inPages = /\/pages\//.test(location.pathname);
  function pg(file) { return inPages ? "../pages/" + file : "pages/" + file; }

  /* ---------- 问答库（关键词 → 回答；答案为纯文本，\n 换行） ---------- */
  var QA = [
    { keys: ["校区", "兰花湖", "南岸", "分到哪个", "在哪个校", "经管类在"],
      a: "大一的校区分配和学院有关喵：经管类专业大一在兰花湖校区，大部分其他专业在南岸主校区。",
      link: ["campus.html", "看校区分配详解"] },

    { keys: ["宿舍", "寝室", "床位", "几人", "独卫", "上床下桌", "住宿"],
      a: "宿舍的几人间、独卫、床铺配置，学姐整理过一篇实拍图文，点下面的按钮看最直观喵～",
      link: ["dorm.html", "看寝室实拍详解"] },

    { keys: ["床垫", "尺寸", "多大", "床上用品", "被子", "三件套", "床单"],
      a: "CTBU 的床铺统一是 190×90cm 喵。\n床垫厚度：上铺 5-8cm、下铺不超过 10cm。\n床品要不要从家带、哪些到校再买，开学清单里都写了。",
      link: ["dorm-list.html", "看开学清单"] },

    { keys: ["食堂", "吃饭", "好吃", "哪个食堂", "干饭", "外卖"],
      a: "哪个食堂吃什么、哪家最好吃，学姐写过一篇实拍攻略喵～",
      link: ["canteen.html", "看食堂攻略"] },

    { keys: ["选课", "抢课", "绩点", "学分", "怎么选", "退课"],
      a: "绩点、学分、选课这三件事大一最容易懵，学姐用 10 张图一篇讲明白了喵。",
      link: ["gpa.html", "看选课攻略"] },

    { keys: ["转专业", "换专业", "转出去"],
      a: "转专业要趁大一：时间线、绩点要求、11 种不适合转的情况、4 条路线，学姐都整理好了喵。",
      link: ["major-change.html", "看转专业攻略"] },

    { keys: ["密码", "缴费", "一卡通", "统一身份", "认证", "财务", "登录不上", "初始", "账号"],
      a: "三类账号的账号都是学号，初始密码规则不一样喵：\n· 财务缴费平台：身份证后 6 位（末尾 X 要大写）\n· 校园一卡通：身份证后 6 位（末尾 X 取前 6 位数字）\n· 统一身份认证：CTbu + 考生号后 3 位 + 身份证后 3 位（C、T 大写，bu 小写）\n忘记密码走企业微信 → 工作台 → 密码重置，别反复试错把账号锁了喵。",
      link: ["finance-auth.html", "看密码整理图"] },

    { keys: ["军训", "防晒", "教官", "拉练"],
      a: "军训清单从防晒到鞋垫都整理过，在首页「军训」分类里能看到喵。重庆 9 月还很热，防晒和补水一定安排上～" },

    { keys: ["报到", "开学带", "证件", "材料", "通知书", "录取", "入学"],
      a: "报到要带的证件材料（身份证、录取通知书、照片这些）和开学注意事项，学姐各写了一篇喵。",
      link: ["notice.html", "看开学注意事项"] },

    { keys: ["电脑", "笔记本", "配置", "买电脑", "平板"],
      a: "大学第一台电脑怎么选，学姐按专业和预算写过一篇建议喵。",
      link: ["pc.html", "看电脑选购指南"] },

    { keys: ["赫尔", "中外", "合作办学"],
      a: "赫尔学院的相关介绍学姐整理过一篇图文喵，点下面看看～",
      link: ["heer.html", "看赫尔学院介绍"] },

    { keys: ["群", "喵窝", "进群", "交流", "学长学姐", "提问"],
      a: "想找学长学姐答疑的话，进「喵窝」交流区就对了喵～页面里有微信群二维码，扫码就能进。二维码过期了就私信学姐要新码。",
      link: ["community.html", "去喵窝交流区"] },

    { keys: ["教学楼", "上课", "教室", "几教", "博智", "慧智"],
      a: "哪栋楼是几教、在哪上课，学姐写过一篇教学楼实拍介绍喵。",
      link: ["classroom.html", "看教学楼介绍"] },

    { keys: ["图书馆", "自习", "藏书"],
      a: "图书馆的攻略学姐还在整理中喵…想早点了解的话，去喵窝群问学长学姐会更快～" },

    { keys: ["你是谁", "介绍", "小助手", "机器人", "真人"],
      a: "我是喵小助手喵，由学姐训练的小看家猫，会回答站内整理过的新生问题。答不上来的我会老实说，不瞎编喵。" },

    { keys: ["谢谢", "感谢", "辛苦", "爱你"],
      a: "不客气喵～能帮到你就好。还有问题随时来问，也可以去喵窝找学长学姐们聊聊～" },

    { keys: ["你好", "您好", "hi", "hello", "在吗", "哈喽", "嗨", "早上好", "晚上好"],
      a: "你好呀喵～我是喵小助手。报到、宿舍、选课、密码这些都可以问我，先点下面的快捷问题也可以喵。" }
  ];

  /* 快捷问题按钮 */
  var CHIPS = [
    "校区怎么分配", "宿舍什么样", "初始密码是什么",
    "怎么选课", "转专业条件", "怎么进喵窝群"
  ];

  /* 未匹配时的礼貌引导 */
  var FALLBACK = [
    "呜…这个问题我还没学会喵。换个说法再问我一次？比如「宿舍」「密码」「选课」这些关键词～",
    "这个我答不准，不想瞎编喵。可以去喵窝群问学长学姐，或者换个简单的词再问我一次～"
  ];
  var fbIndex = 0;

  /* ---------- 构建挂件 DOM ---------- */
  var widget = document.createElement("div");
  widget.className = "cat-widget";
  widget.innerHTML = ''
    + '<button class="cat-fab" id="catFab" aria-label="打开喵小助手">'
    +   catTailSVG()
    +   '<span class="cat-fab-body">' + catFaceSVG(46) + '</span>'
    + '</button>'
    + '<div class="cat-bubble-tip" id="catTip" hidden>喵～新生问题可以点我</div>'
    + '<div class="cat-panel" id="catPanel" hidden>'
    +   '<div class="cat-panel-head" id="catHead" title="摸摸头">'
    +     '<div class="cat-head-avatar">' + catFaceSVG(34) + '</div>'
    +     '<div class="cat-head-info"><b>喵小助手</b><span>在线 · 会看家会答疑</span></div>'
    +     '<button class="cat-close" id="catClose" aria-label="收起对话">×</button>'
    +   '</div>'
    +   '<div class="cat-msgs" id="catMsgs"></div>'
    +   '<form class="cat-input-bar" id="catForm">'
    +     '<input id="catInput" type="text" placeholder="问问看：密码 / 宿舍 / 选课 …" autocomplete="off" maxlength="60" />'
    +     '<button type="submit">发送</button>'
    +   '</form>'
    + '</div>';
  document.body.appendChild(widget);

  var fab      = widget.querySelector("#catFab");
  var fabFace  = fab.querySelector(".cat-face");
  var tail     = fab.querySelector(".cat-tail");
  var tip      = widget.querySelector("#catTip");
  var panel    = widget.querySelector("#catPanel");
  var head     = widget.querySelector("#catHead");
  var headFace = head.querySelector(".cat-face");
  var msgs     = widget.querySelector("#catMsgs");
  var form     = widget.querySelector("#catForm");
  var input    = widget.querySelector("#catInput");

  /* ---------- 表情状态机 ---------- */
  function setHappy(face, ms) {
    face.classList.add("happy");
    setTimeout(function () { face.classList.remove("happy"); }, ms || 1400);
  }

  /* 随机眨眼（两只猫各自独立眨） */
  function bindBlink(face) {
    (function loop() {
      var wait = 2400 + Math.random() * 3200;
      setTimeout(function () {
        face.classList.add("blink");
        setTimeout(function () { face.classList.remove("blink"); }, 160);
        loop();
      }, wait);
    })();
  }
  bindBlink(fabFace);
  bindBlink(headFace);

  /* 摸头：开心 + 冒爱心（顶栏头像区域点击） */
  var petCooldown = 0;
  head.addEventListener("click", function (e) {
    if (e.target.closest("#catClose")) return; // 点关闭按钮不算摸头
    setHappy(headFace, 1500);
    setHappy(fabFace, 1500);
    var now = Date.now();
    if (now - petCooldown > 3000) {
      petCooldown = now;
      spawnHearts(head);
      setTimeout(function () {
        if (!panel.hidden) botSay("喵嘿嘿，被摸头了喵～还想问什么尽管说。", null);
      }, 350);
    }
  });

  function spawnHearts(anchor) {
    var rect = anchor.getBoundingClientRect();
    var chars = ["♥", "💗", "♪"];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var h = document.createElement("span");
        h.className = "cat-heart";
        h.textContent = chars[i % chars.length];
        h.style.left = (rect.left + 8 + Math.random() * 70) + "px";
        h.style.top = (rect.top + 10) + "px";
        h.style.position = "fixed";
        h.style.zIndex = "1002";
        h.style.animationDelay = (i * 0.14) + "s";
        document.body.appendChild(h);
        setTimeout(function () { h.remove(); }, 1600);
      })(i);
    }
  }

  /* ---------- 窗口开关 ---------- */
  var greeted = false;
  fab.addEventListener("click", function () {
    hideTip();
    if (panel.hidden) {
      panel.hidden = false;
      panel.classList.remove("closing");
      setHappy(fabFace, 1200);
      if (!greeted) {
        greeted = true;
        botSay("喵呜～你好呀！我是喵小助手，关于报到、宿舍、选课、密码这些问题都可以问我喵。", function () {
          appendChips();
        });
      }
      setTimeout(function () { input.focus(); }, 250);
    } else {
      closePanel();
    }
  });

  function closePanel() {
    panel.classList.add("closing");
    setTimeout(function () {
      panel.hidden = true;
      panel.classList.remove("closing");
    }, 190);
  }
  widget.querySelector("#catClose").addEventListener("click", function (e) {
    e.stopPropagation();
    closePanel();
  });

  /* ---------- 头顶提示气泡 ---------- */
  function hideTip() {
    if (!tip.hidden) {
      tip.classList.add("hide");
      setTimeout(function () { tip.hidden = true; tip.classList.remove("hide", "pop"); }, 240);
    }
  }
  if (!sessionStorage.getItem("catTipShown")) {
    setTimeout(function () {
      if (panel.hidden) {
        tip.hidden = false;
        tip.classList.add("pop");
        setTimeout(hideTip, 9000);
      }
      sessionStorage.setItem("catTipShown", "1");
    }, 3500);
  }
  tip.addEventListener("click", hideTip);

  /* ---------- 消息渲染 ---------- */
  function addMsg(role, text) {
    var div = document.createElement("div");
    div.className = "cat-msg " + role;
    var ava = document.createElement("div");
    ava.className = "avatar";
    if (role === "bot") ava.innerHTML = catFaceSVG(22);
    var b = document.createElement("div");
    b.className = "bubble msg-in";
    b.textContent = text;
    div.appendChild(ava);
    div.appendChild(b);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return b;
  }

  /* 打字机效果（纯文本逐字 + 完成后附链接） */
  function botSay(text, done, link) {
    var b = addMsg("bot", "");
    var i = 0;
    setHappy(headFace, 900); // 思考/说话时眯眯眼
    (function type() {
      if (i <= text.length) {
        b.textContent = text.slice(0, i);
        msgs.scrollTop = msgs.scrollHeight;
        i += 1;
        setTimeout(type, 22);
      } else {
        if (link) {
          var a = document.createElement("a");
          a.className = "cat-link-btn";
          a.href = pg(link[0]);
          a.textContent = link[1] + " →";
          b.appendChild(document.createElement("br"));
          b.appendChild(a);
          msgs.scrollTop = msgs.scrollHeight;
        }
        if (done) done();
      }
    })();
  }

  /* 快捷问题按钮（插在消息流末尾，点击即提问） */
  function appendChips() {
    var old = msgs.querySelector(".cat-chips");
    if (old) old.remove();
    var box = document.createElement("div");
    box.className = "cat-chips";
    CHIPS.forEach(function (q) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "cat-chip";
      c.textContent = q;
      c.addEventListener("click", function () {
        box.remove();
        ask(q);
      });
      box.appendChild(c);
    });
    msgs.appendChild(box);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ---------- 问答匹配 ---------- */
  function findAnswer(q) {
    var s = q.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < QA.length; i++) {
      var score = 0;
      for (var j = 0; j < QA[i].keys.length; j++) {
        if (s.indexOf(QA[i].keys[j]) !== -1) score += 1;
      }
      if (score > bestScore) { bestScore = score; best = QA[i]; }
    }
    return bestScore > 0 ? best : null;
  }

  function ask(q) {
    addMsg("user", q);
    /* 思考中：typing 指示 + 摇尾巴 + 眨眼 */
    var t = document.createElement("div");
    t.className = "cat-msg bot";
    t.innerHTML = '<div class="avatar">' + catFaceSVG(22) + '</div>'
      + '<div class="bubble"><span class="cat-typing"><i></i><i></i><i></i></span></div>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    tail.classList.add("fast");
    var tf = t.querySelector(".cat-face");
    if (tf) { tf.classList.add("blink"); }

    setTimeout(function () {
      tail.classList.remove("fast");
      t.remove();
      var hit = findAnswer(q);
      if (hit) {
        botSay(hit.a, appendChips, hit.link || null);
      } else {
        botSay(FALLBACK[fbIndex % FALLBACK.length], appendChips);
        fbIndex += 1;
      }
    }, 750 + Math.random() * 450);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    var chips = msgs.querySelector(".cat-chips");
    if (chips) chips.remove();
    ask(q);
  });
})();
