document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  const zh = {
    'nav.features': '功能特性',
    'nav.publications': '发表文献',
    'nav.manual': '使用手册',
    'nav.download': '软件下载',
    'nav.about': '关于我们',
    'nav.news': '新闻动态',

    'hero.title': 'Kylin-PBC\uff1a基于第一性原理的周期性密度泛函理论程序',
    'hero.subtitle': 'C++17 \u00b7 GTO 基组 \u00b7 GTH 赝势 \u00b7 MGDF / FTDF 积分',
    'hero.btn.download': '下载软件',
    'hero.btn.manual': '用户手册',

    'footer.copyright': '\u00a9 2026 版权所有\uff1a<a href="https://quantum-chemistry-cn.com">马海波教授课题组</a>',

    'index.about.title': '关于 Kylin-PBC',
    'index.about.intro': 'Kylin-PBC 是一个用 C++17 编写的周期性密度泛函理论（DFT）程序，专为晶体和周期性体系的高精度电子结构计算而设计。',
    'index.about.desc': '该程序采用 Gaussian 型轨道（GTO）基组与 Goedecker-Teter-Hutter（GTH）赝势，并通过两种先进的密度拟合方案计算库仑积分和交换积分：多重网格密度拟合（MGDF）和基于 FFT 的密度拟合（FTDF）。',
    'index.about.list1': '通过 Libxc 实现的交换关联泛函：<span class="feature-tag">LDA</span> <span class="feature-tag">GGA</span> <span class="feature-tag">meta-GGA</span> <span class="feature-tag">Hybrid</span> <span class="feature-tag">RSH</span>',
    'index.about.list2': 'Monkhorst-Pack k 点采样与 Gamma 点求解器 <span class="feature-tag">GRKS</span> <span class="feature-tag">KRKS</span>',
    'index.about.list3': '自适应压缩交换（ACE）加速杂化泛函计算 <span class="feature-tag">ACE</span>',
    'index.about.list4': '几何优化：BFGS 准牛顿法与信赖域步长控制 <span class="feature-tag">BFGS</span> <span class="feature-tag">GDIIS</span>',
    'index.about.list5': '占据数展宽方案 <span class="feature-tag">Fermi-Dirac</span> <span class="feature-tag">Gaussian</span> <span class="feature-tag">Methfessel-Paxton</span>',

    'index.tech.title': '技术特性',
    'index.tech.subtitle': 'Kylin-PBC 的核心算法组件',
    'index.tech.xc.title': '交换关联泛函',
    'index.tech.xc.desc': '通过 Libxc 集成实现完整的 Kohn-Sham DFT 近似层级。支持从局域密度近似到范围分离杂化泛函，可在 Jacob 阶梯上进行系统的精度基准测试。',
    'index.tech.bz.title': '布里渊区采样',
    'index.tech.bz.desc': 'Monkhorst-Pack k 点网格，自动在 Gamma 点（实数值 GRKS）和一般 k 点（复数值 KRKS）求解器之间切换，以实现最优的内存和计算效率。',
    'index.tech.int.title': '积分算法',
    'index.tech.int.desc': '两种互补的密度拟合方案：用于库仑矩阵和赝势矩阵计算的多重网格密度拟合（MGDF），以及用于高效精确交换计算的基于 FFT 的密度拟合（FTDF）。',
    'index.tech.ace.title': 'ACE 加速',
    'index.tech.ace.desc': '自适应压缩交换（ACE）算符，可选 Cholesky 分解，在保持数值精度的同时大幅降低杂化泛函 SCF 迭代的计算成本。',
    'index.tech.geo.title': '几何优化',
    'index.tech.geo.desc': '基于解析核梯度的结构弛豫，采用 BFGS 准牛顿 Hessian 更新、信赖域步长控制以及 GDIIS/GEDIIS 几何外推加速收敛。',
    'index.tech.scf.title': 'SCF 收敛引擎',
    'index.tech.scf.desc': '同时作用于密度矩阵、电子密度和哈密顿量的多级混合框架。Broyden 和 DIIS 算法支持可配置的历史深度和分数占据展宽。',

    'index.qs.title': '快速开始',
    'index.qs.desc': 'Kylin-PBC 需要工作目录中的两个输入文件：<strong>cell.txt</strong>（晶胞和原子坐标）和 <strong>calc.txt</strong>（计算参数）。以下是硅金刚石结构单点计算的最简示例。',

    'about.team.title': 'Kylin 开发团队',
    'about.team.intro': 'Kylin 由马海波教授课题组开发。开发人员包括：',
    'about.team.member1': '宋寅宣博士（博士后研究员）；',
    'about.team.member2': '孙新雨先生（博士研究生）；',
    'about.team.member3': '苏嘉奥先生（硕士研究生）；',
    'about.team.member4': '黄维先生（硕士研究生）；',
    'about.team.member5': '谢肇轩先生（现为慕尼黑大学博士研究生）；',
    'about.team.member6': '程一帆博士（现为马普固体研究所博士后研究员）；',
    'about.team.member7': '田英旗博士（现为中国科学院计算机网络信息中心博士后研究员）；',
    'about.team.member8': '彭方文先生（现就职于追觅科技）；',
    'about.team.member9': '李建浩先生（现为明尼苏达大学博士研究生）；',
    'about.team.member10': '张凌志先生（现为东京大学硕士研究生）；',
    'about.team.member11': '马迎津博士（现为中国科学院计算机网络信息中心研究员）；',
    'about.team.member12': '罗缜博士（现就职于 BDF 青岛科技）；',
    'about.team.member13': '马海波教授。',

    'about.research.title': '研究方向',
    'about.research.desc': '马海波课题组致力于发展强关联量子体系和激发态体系的新化学方法及其应用。我们的研究重点包括：',
    'about.research.item1': '强关联量子体系的电子结构；',
    'about.research.item2': '量子动力学模拟与光谱学；',
    'about.research.item3': '光电子学与光催化。',
    'about.research.visit': '更多信息请访问课题组网站 <a href="https://quantum-chemistry-cn.com">https://quantum-chemistry-cn.com</a>。',

    'news.title': '新闻动态',
    'news.2026.item1': '<strong>2026.4.22</strong>\uff1aKylin-PBC v1.0 正式发布。',

    'pub.title': '发表文献',

    'dl.title': '下载 Kylin-PBC',
    'dl.intro': 'Kylin-PBC 以预编译的 Linux 平台二进制文件形式分发。',
    'dl.version': 'Kylin-PBC 1.4 版本于 2026 年 2 月发布，支持基于 GTO 基组、GTH 赝势和先进密度拟合积分算法（MGDF/FTDF）的周期性 DFT 计算。该软件包对学术用户免费提供。',
    'dl.license': '如果您对 Kylin-PBC 软件包感兴趣，请将签署的<a href="files/license.pdf">许可协议</a>发送至孙新雨先生的邮箱 <a href="mailto:sunxinyu347@gmail.com">sunxinyu347@gmail.com</a> 以获取试用版本。',
    'dl.kylinv.title': '<strong>Kylin-V（开源）</strong>',
    'dl.kylinv.desc': '<strong>Kylin-V 是一个简便易用的 TD-DMRG（激子-声子耦合模型）和振动热浴 CI 程序。</strong>它对所有用户免费开源。请访问<a href="https://gitee.com/nierenstein/kln-x">此 Gitee 页面</a>获取 Kylin-V 的源代码。'
  };

  let currentLang = localStorage.getItem('site-lang') || 'en';
  let originalsStored = false;

  function storeOriginals() {
    if (originalsStored) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.dataset.i18nOriginal = el.textContent;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.dataset.i18nHtmlOriginal = el.innerHTML;
    });
    originalsStored = true;
  }

  function applyLanguage(lang) {
    storeOriginals();
    if (lang === 'zh') {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const t = zh[el.dataset.i18n];
        if (t !== undefined) el.textContent = t;
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const t = zh[el.dataset.i18nHtml];
        if (t !== undefined) el.innerHTML = t;
      });
    } else {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.dataset.i18nOriginal !== undefined) el.textContent = el.dataset.i18nOriginal;
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        if (el.dataset.i18nHtmlOriginal !== undefined) el.innerHTML = el.dataset.i18nHtmlOriginal;
      });
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    btn.textContent = lang === 'zh' ? 'ZH' : 'EN';
    currentLang = lang;
  }

  applyLanguage(currentLang);

  btn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('site-lang', newLang);
    applyLanguage(newLang);
  });
});
