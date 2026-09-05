/* ============================================================
   CTBU一只喵 · 新生干货导航站 —— 数据文件
   ============================================================
   【这是你唯一需要维护的文件】

   ▶ 怎么加新内容？
     找到下面的 RESOURCES，复制任意一条 { ... }（含逗号），
     改成你的内容粘贴进去，保存即可。就这 5 个字段：

       category : 分类（要和 CATEGORIES 里的名字一致）
       stage    : 入学阶段，三选一："报到前" / "报到中" / "开学后"
       title    : 标题
       desc     : 一句话描述
       type     : 类型，三选一："图文" / "资料" / "实景"
       link     : 直达链接（小红书图文 / 文档 / 网盘 都行）
       hot      : 要不要置顶推荐？true / false（可省略，默认不置顶）

   ▶ 怎么改站点信息（名字/口号/更新日期）？
     改下面 CONFIG 里的对应内容即可。

   ▶ 注意：每条之间用英文逗号隔开；最后一条后面不用逗号。
   ============================================================ */


/* ---------- 站点配置（可改） ---------- */
const CONFIG = {
  brand: "CTBU一只喵",
  slogan: "新生干货，一站搞定",
  updatedAt: "2026年9月5日更新 v13（官方三维虚拟校园入口）"   // 改这里更新页脚的"最后更新"
};

/* ---------- 分类（顺序就是显示顺序） ---------- */
const CATEGORIES = [
  "军训", "选课&课表", "考试&复习", "证件&办事",
  "校园生活", "交通&报到", "AI工具", "女生向&成长", "社群交流"
];

/* ---------- 分类图标（可改 emoji） ---------- */
const CATEGORY_ICONS = {
  "军训": "🎒", "选课&课表": "📖", "考试&复习": "📝", "证件&办事": "🪪",
  "校园生活": "🍜", "交通&报到": "🚌", "AI工具": "🤖", "女生向&成长": "🌸",
  "社群交流": "🐱"
};


/* ============================================================
   干货列表 —— 把你的内容填到这里（下面是示例，请替换 link）
   ============================================================ */
const RESOURCES = [
  // ---------- 军训 ----------
  {
    category: "军训", stage: "开学后",
    title: "军训必备清单｜这些东西一定要带",
    desc: "从防晒到鞋垫，学姐踩过的坑都帮你避开了",
    type: "图文", link: "#", hot: true
  },
  {
    category: "军训", stage: "开学后",
    title: "军训防晒不踩雷实测",
    desc: "重庆的太阳真的猛，这几个亲测好用",
    type: "图文", link: "#"
  },
  {
    category: "军训", stage: "开学后",
    title: "军训生存实景记录",
    desc: "宿舍→操场→食堂，一天的真实流程",
    type: "实景", link: "#"
  },

  // ---------- 选课&课表 ----------
  {
    category: "选课&课表", stage: "开学后",
    title: "绩点？学分？选课？一篇讲明白",
    desc: "大一最容易懵的三件事，10张图看完不踩坑",
    type: "图文", link: "pages/gpa.html", hot: true
  },
  {
    category: "选课&课表", stage: "开学后",
    title: "大一就想转专业？先看完这一篇",
    desc: "时间线/绩点要求/11种禁区/热门数据/4条赛道/4步行动清单",
    type: "图文", link: "pages/major-change.html", hot: true
  },
  {
    category: "选课&课表", stage: "开学后",
    title: "课表怎么看？教务系统操作图解",
    desc: "一步步截图，看不懂算我输",
    type: "资料", link: "#"
  },
  {
    category: "选课&课表", stage: "开学后",
    title: "抢课技巧&时间安排表",
    desc: "提前收藏，定好闹钟别错过",
    type: "资料", link: "#"
  },

  // ---------- 考试&复习 ----------
  {
    category: "考试&复习", stage: "开学后",
    title: "四六级备考时间线",
    desc: "从背单词到真题，按月规划好",
    type: "图文", link: "#", hot: true
  },
  {
    category: "考试&复习", stage: "开学后",
    title: "期末高效复习法",
    desc: "绩点想拿高？这套方法亲测有效",
    type: "图文", link: "#"
  },

  // ---------- 证件&办事 ----------
  {
    category: "证件&办事", stage: "开学后",
    title: "财务缴费｜校园一卡通｜统一身份认证的密码是什么",
    desc: "三类账号密码一次理清楚，账号都是学号，初始密码规则各不同",
    type: "图文", link: "pages/finance-auth.html", hot: true
  },
  {
    category: "证件&办事", stage: "报到中",
    title: "报到要带的证件清单",
    desc: "身份证、录取通知书、照片…别漏",
    type: "资料", link: "#", hot: true
  },
  {
    category: "证件&办事", stage: "报到中",
    title: "校园卡怎么用？充值/挂失全流程",
    desc: "吃饭、洗澡、进出都靠它",
    type: "图文", link: "#"
  },
  {
    category: "证件&办事", stage: "开学后",
    title: "在校证明&学生证办理指南",
    desc: "去哪办、要多久，一次说清",
    type: "资料", link: "#"
  },

  // ---------- 校园生活 ----------
  {
    category: "校园生活", stage: "开学后",
    title: "寝室完整攻略｜三校区房型收费一览",
    desc: "南区/北区/新北区·兰花湖·茶园，图文穿插带你看",
    type: "图文", link: "pages/dorm.html", hot: true
  },
  {
    category: "校园生活", stage: "开学后",
    title: "食堂干饭全攻略｜5个食堂怎么选",
    desc: "筱园TOP1到翠园，一荤一素7元起，美食暴击",
    type: "图文", link: "pages/canteen.html", hot: true
  },
  {
    category: "校园生活", stage: "开学后",
    title: "教学楼上课指南｜上课不迷路",
    desc: "南岸7栋·兰花湖广智楼·茶园教学楼群",
    type: "图文", link: "pages/classroom.html"
  },
  {
    category: "校园生活", stage: "报到前",
    title: "大学第一台电脑怎么选",
    desc: "预算配置不踩坑，8张图按顺序看",
    type: "图文", link: "pages/pc.html"
  },
  {
    category: "校园生活", stage: "报到前",
    title: "宿舍开学清单都有什么？",
    desc: "床垫·床品·电子·药品·军训·避雷，CTBU学姐逐项拆解",
    type: "图文", link: "pages/dorm-list.html", hot: true
  },
  {
    category: "校园生活", stage: "开学后",
    title: "赫尔学院",
    desc: "赫尔学院相关干货，8张图按顺序看",
    type: "图文", link: "pages/heer.html"
  },
  {
    category: "校园生活", stage: "开学后",
    title: "宿舍入住攻略｜床位&生活区",
    desc: "带什么不带什么，看这一篇",
    type: "图文", link: "#", hot: true
  },
  {
    category: "校园生活", stage: "开学后",
    title: "食堂测评｜哪个窗口最值得",
    desc: "学姐吃了半学期的真实推荐",
    type: "实景", link: "#"
  },
  {
    category: "校园生活", stage: "开学后",
    title: "校园周边生活地图",
    desc: "快递、超市、打印、理发一站找",
    type: "实景", link: "#"
  },

  // ---------- 交通&报到 ----------
  {
    category: "交通&报到", stage: "报到前",
    title: "2026级新生开学全攻略",
    desc: "三校区注意事项+证件档案+必备物品+报到流程+防坑指南",
    type: "图文", link: "pages/notice.html", hot: true
  },
  {
    category: "交通&报到", stage: "报到前",
    title: "校区分配速查｜我在哪个校区？",
    desc: "三大校区+各学院分配+学费明细，一文搞懂",
    type: "图文", link: "pages/campus.html", hot: true
  },
  {
    category: "交通&报到", stage: "报到前",
    title: "学校概况一览",
    desc: "3个校区·2896亩·王牌专业·学科实力",
    type: "图文", link: "pages/school.html"
  },
  {
    category: "交通&报到", stage: "报到前",
    title: "新生报到流程全图解",
    desc: "到校第一天要干嘛，按这个走",
    type: "图文", link: "#", hot: true
  },
  {
    category: "交通&报到", stage: "报到前",
    title: "怎么到学校？各校区交通指南",
    desc: "机场/高铁/地铁，路线都查好了",
    type: "资料", link: "#"
  },
  {
    category: "交通&报到", stage: "报到前",
    title: "三维虚拟校园｜提前云逛南岸校区",
    desc: "官方系统：以真实校园为蓝本，查方位、找建筑，宿舍食堂教学楼都能看",
    type: "实景", link: "http://gis.ctbu.edu.cn"
  },

  // ---------- AI工具 ----------
  {
    category: "AI工具", stage: "开学后",
    title: "大学生必会的5个AI工具",
    desc: "做笔记、写报告、做PPT都能省一半时间",
    type: "图文", link: "#", hot: true
  },
  {
    category: "AI工具", stage: "开学后",
    title: "用AI整理课堂笔记的实操",
    desc: "录音转文字+自动总结，亲测流程",
    type: "图文", link: "#"
  },
  {
    category: "AI工具", stage: "开学后",
    title: "AI辅助复习资料包",
    desc: "知识点自动提炼模板",
    type: "资料", link: "#"
  },

  // ---------- 女生向&成长 ----------
  {
    category: "女生向&成长", stage: "开学后",
    title: "大学四年怎么规划不虚度",
    desc: "学姐的真心话，大一就能用的框架",
    type: "图文", link: "#", hot: true
  },
  {
    category: "女生向&成长", stage: "开学后",
    title: "女生校园安全&独居小习惯",
    desc: "保护好自己，是大学第一课",
    type: "图文", link: "#"
  },
  {
    category: "女生向&成长", stage: "开学后",
    title: "时间管理｜脉冲冲刺也能高效",
    desc: "不是天天卷，是会蓄能会爆发",
    type: "资料", link: "#"
  },

  // ---------- 社群交流 ----------
  {
    category: "社群交流", stage: "开学后",
    title: "加入喵窝｜新生交流群",
    desc: "学长学姐在线答疑，选题随便提，下期内容由你定",
    type: "图文", link: "pages/community.html", hot: true
  }
];
