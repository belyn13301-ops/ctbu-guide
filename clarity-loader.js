/* 微软 Clarity 访问统计（ctbu-guide 站点加载器）
 *
 * 与 portfolio 站分开独立统计，所以这里要填 ctbu-guide 专属的项目 ID。
 * 后台：https://clarity.microsoft.com → 新建项目 ctbu-guide → Settings → Setup
 * 取 ID：代码里 https://www.clarity.ms/tag/ 后面那一串 10 位字符
 *
 * ID 为空时整个脚本不执行，不会发出任何请求，也不会报错。
 */
var CLARITY_ID = "";

(function (c, l, a, r, i, t, y) {
  if (!i) return;
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", CLARITY_ID);
