/* ============================================================
   火山为什么会喷发 — 完善版本 script.js
   题库数据 + hash路由 + 渲染 + 交互 + 悬停动画 + 结果页
   ============================================================ */

// ---------- 题库数据（15题） ----------
const QUIZ_DATA = [
  {
    id: 1,
    question: "1. 火山口为什么会喷出气体和火山灰？",
    options: [
      { text: "A. 地表水受热蒸发形成水汽", correct: false, anim: "steam-vent" },
      { text: "B. 地壳裂缝释放古老气体", correct: false, anim: "crack-steam" },
      { text: "C. 岩浆中的气体遇压释放", correct: true, anim: "lava-steam" }
    ],
    explanation: "岩浆含大量挥发性气体，上升时压力骤降，气体膨胀释放，携带岩浆碎屑形成火山灰。"
  },
  {
    id: 2,
    question: "2. 为什么板块碰撞会导致火山爆发？",
    options: [
      { text: "A. 板块摩擦直接点燃岩石", correct: false, anim: null },
      { text: "B. 板块下沉至地幔，岩石高温熔化形成岩浆", correct: true, anim: "subduction" },
      { text: "C. 碰撞震动震裂地壳释放岩浆", correct: false, anim: null }
    ],
    explanation: "俯冲带板块进入地幔高温区熔融成岩浆，上升喷发，环太平洋火山带即此成因。"
  },
  {
    id: 3,
    question: "3. 地球上火山最容易出现在哪些地区？",
    options: [
      { text: "A. 板块边界附近", correct: true, anim: null },
      { text: "B. 大陆中心稳定区域", correct: false, anim: null },
      { text: "C. 高楼林立的城市", correct: false, anim: null }
    ],
    explanation: "板块边界（碰撞带、分离带、热点）是岩浆通道，全球75%火山集中在环太平洋火山带。"
  },
  {
    id: 4,
    question: "4. 火山爆发时岩浆会变成什么？",
    options: [
      { text: "A. 化肥和矿物质", correct: false, anim: null },
      { text: "B. 火山岩和熔岩流", correct: true, anim: "obsidian-form" },
      { text: "C. 纯粹消失蒸发", correct: false, anim: null }
    ],
    explanation: "岩浆流出地表冷却凝固成熔岩流，快速冷却成黑曜岩，缓慢冷却成玄武岩等火山岩。"
  },
  {
    id: 5,
    question: "5. 为什么有些火山长期不爆发？",
    options: [
      { text: "A. 岩浆通道被冷却凝固的岩浆封堵", correct: true, anim: "magma-plug" },
      { text: "B. 岩浆已经完全耗尽", correct: false, anim: null },
      { text: "C. 人类科技封锁了火山", correct: false, anim: null }
    ],
    explanation: "火山口岩浆冷凝形成「塞子」封堵通道，气体压力积累到突破临界才会再次喷发，称休眠火山。"
  },
  {
    id: 6,
    question: "6. 火山灰对地球环境有什么影响？",
    options: [
      { text: "A. 净化空气", correct: false, anim: null },
      { text: "B. 滋养所有农作物", correct: false, anim: null },
      { text: "C. 遮挡阳光，可能改变全球气候", correct: true, anim: "ash-climate" }
    ],
    explanation: "火山灰进入平流层形成气溶胶层，反射阳光。1815年坦博拉喷发导致1816年「无夏之年」。"
  },
  {
    id: 7,
    question: "7. 岩浆上升时会对地表产生什么信号？",
    options: [
      { text: "A. 小型地震频发", correct: true, anim: "seismic-wave" },
      { text: "B. 河流水温骤降", correct: false, anim: null },
      { text: "C. 鸟类集体迁徙", correct: false, anim: null }
    ],
    explanation: "岩浆上涌撑裂岩石引发微震，是火山喷发前兆之一，监测地震是预警关键手段。"
  },
  {
    id: 8,
    question: "8. 最终总结：火山为什么会喷发？",
    options: [
      { text: "A. 地幔岩浆因高温高压积聚，沿地壳裂缝喷出", correct: true, anim: "full-eruption" },
      { text: "B. 地球自转甩出内部物质", correct: false, anim: null },
      { text: "C. 神秘事件触发，看运气", correct: false, anim: null }
    ],
    explanation: "地幔高温使岩石部分熔融成岩浆，气体含量高、压力积聚到突破地壳薄弱处即喷发。"
  },
  {
    id: 9,
    question: "9. 盾状火山的主要特征是什么？",
    options: [
      { text: "A. 坡度平缓宽广，由流动性好的玄武岩岩浆形成", correct: true, anim: "shield-shape" },
      { text: "B. 坡度陡峭，由爆发性喷发形成", correct: false, anim: null },
      { text: "C. 体型最小，呈尖锥状", correct: false, anim: null }
    ],
    explanation: "盾状火山玄武岩岩浆粘度低、流动性强，层层铺开形成平缓坡度（2°-10°），如夏威夷冒纳罗亚。"
  },
  {
    id: 10,
    question: "10. 层状火山（复合火山）为什么喷发更猛烈？",
    options: [
      { text: "A. 山体更高大", correct: false, anim: null },
      { text: "B. 酸性岩浆粘度高，气体难以逃逸，压力骤然释放", correct: true, anim: "sticky-lava" },
      { text: "C. 位于海洋边缘", correct: false, anim: null }
    ],
    explanation: "层状火山富硅酸性岩浆粘度高，气体被困积累至临界，爆裂式喷发。富士山、维苏威均属此类。"
  },
  {
    id: 11,
    question: "11. 公元79年维苏威火山喷发掩埋了哪座古城？",
    options: [
      { text: "A. 庞贝", correct: true, anim: null },
      { text: "B. 特洛伊", correct: false, anim: null },
      { text: "C. 迦太基", correct: false, anim: null }
    ],
    explanation: "维苏威喷发火山碎屑流掩埋庞贝与赫库兰尼姆，火山灰封存城市近2000年，1748年重见天日。"
  },
  {
    id: 12,
    question: "12. 1815年坦博拉火山喷发导致次年全球出现什么异常？",
    options: [
      { text: "A. 无夏之年", correct: true, anim: null },
      { text: "B. 极光大爆发", correct: false, anim: null },
      { text: "C. 海平面骤降", correct: false, anim: null }
    ],
    explanation: "坦博拉是历史记载最大喷发之一，巨量火山灰气溶胶遮蔽阳光，1816年北半球夏季降雪农作物绝收。"
  },
  {
    id: 13,
    question: "13. 现代火山监测最依赖哪种手段？",
    options: [
      { text: "A. 观察动物行为", correct: false, anim: null },
      { text: "B. 卫星遥感与地震仪监测", correct: true, anim: "monitoring" },
      { text: "C. 查阅历史文献", correct: false, anim: null }
    ],
    explanation: "地震仪捕捉岩浆上涌微震，卫星InSAR监测地表形变，气体传感器测SO₂变化，多手段联合预警。"
  },
  {
    id: 14,
    question: "14. 以下哪项是火山的「益处」？",
    options: [
      { text: "A. 调节全球气温", correct: false, anim: null },
      { text: "B. 提供地热能与肥沃火山灰土壤", correct: true, anim: "volcano-benefits" },
      { text: "C. 净化海洋水质", correct: false, anim: null }
    ],
    explanation: "火山地热可发电（冰岛），火山灰风化形成富含矿质的沃土（爪哇岛），玄武岩是建筑石材。"
  },
  {
    id: 15,
    question: "15. 火山地震与构造地震的主要区别是？",
    options: [
      { text: "A. 火山地震震级一定更大", correct: false, anim: null },
      { text: "B. 火山地震由岩浆活动引起，通常震级较小且集中火山附近", correct: true, anim: null },
      { text: "C. 两者完全相同", correct: false, anim: null }
    ],
    explanation: "火山地震源于岩浆上涌撑裂岩石，震级一般小于构造地震，震源浅且集中分布于火山区域。"
  }
];

// ---------- 悬停动画 HTML 模板（SVG 精细版） ----------
const ANIM_TEMPLATES = {
  "steam-vent": `
    <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg" style="width:160px;">
      <defs>
        <linearGradient id="svGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8d6e63"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <linearGradient id="svWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4fc3f7"/>
          <stop offset="100%" stop-color="#01579b"/>
        </linearGradient>
      </defs>
      <!-- 地表 -->
      <rect x="10" y="75" width="140" height="12" fill="url(#svGround)" rx="2"/>
      <!-- 水池（地表水） -->
      <ellipse cx="80" cy="78" rx="35" ry="4" fill="url(#svWater)">
        <animate attributeName="rx" values="33;37;33" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 加热红光（地表下方岩浆热源） -->
      <rect x="40" y="84" width="80" height="3" fill="#ff4500" opacity="0.7" rx="1">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <!-- 沸腾气泡（水中） -->
      <circle cx="65" cy="77" r="1.5" fill="rgba(255,255,255,0.8)">
        <animate attributeName="cy" values="79;73;73" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.9;0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="95" cy="77" r="1.5" fill="rgba(255,255,255,0.8)">
        <animate attributeName="cy" values="79;73;73" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.9;0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="77" r="1.8" fill="rgba(255,255,255,0.9)">
        <animate attributeName="cy" values="79;72;72" dur="1.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.9;0" dur="1.5s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <!-- 蒸汽上升（白灰半透明，5个粒子） -->
      <circle cx="60" cy="70" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="70;35;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="70" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="70;35;5" dur="2s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="70" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="70;35;5" dur="2s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="70" cy="70" r="4" fill="rgba(230,235,245,0.7)">
        <animate attributeName="cy" values="70;35;5" dur="2s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;7;10" dur="2s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="70" r="4" fill="rgba(230,235,245,0.7)">
        <animate attributeName="cy" values="70;35;5" dur="2s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;7;10" dur="2s" begin="1.6s" repeatCount="indefinite"/>
      </circle>
      <text x="80" y="102" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">地表水受热蒸发</text>
    </svg>`,
  "crack-steam": `
    <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg" style="width:160px;">
      <!-- 左岩块（轻微张合） -->
      <rect x="15" y="60" width="55" height="25" fill="#cc3300" rx="3">
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;0,0" dur="3s" repeatCount="indefinite"/>
      </rect>
      <!-- 右岩块（轻微张合） -->
      <rect x="90" y="60" width="55" height="25" fill="#cc3300" rx="3">
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="3s" repeatCount="indefinite"/>
      </rect>
      <!-- 锯齿形裂缝 -->
      <path d="M 70 62 L 73 67 L 75 63 L 77 68 L 80 64 L 83 67 L 87 62 L 90 67" stroke="#1a0a05" stroke-width="1.5" fill="none"/>
      <!-- 地下岩浆暗红暗示 -->
      <rect x="65" y="83" width="30" height="3" fill="#bf360c" opacity="0.7" rx="1">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/>
      </rect>
      <!-- 蒸汽（白灰半透明，加 r 扩大） -->
      <circle cx="80" cy="58" r="4" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;25;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;7;10" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="58" r="4" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;25;5" dur="2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;7;10" dur="2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="58" r="4" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;25;5" dur="2s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="4;7;10" dur="2s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <text x="80" y="105" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">地壳裂缝释放气体</text>
    </svg>`,
  "lava-steam": `
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" style="width:160px;">
      <defs>
        <linearGradient id="lsLava" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffeb3b"/>
          <stop offset="50%" stop-color="#ff6f00"/>
          <stop offset="100%" stop-color="#bf360c"/>
        </linearGradient>
        <linearGradient id="lsFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="#fff59d"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
        <radialGradient id="lsGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,235,59,0.6)"/>
          <stop offset="100%" stop-color="rgba(255,235,59,0)"/>
        </radialGradient>
      </defs>
      <!-- 岩浆辉光 -->
      <ellipse cx="80" cy="75" rx="70" ry="20" fill="url(#lsGlow)"/>
      <!-- 岩浆池 -->
      <rect x="20" y="60" width="120" height="40" fill="url(#lsLava)" rx="6"/>
      <!-- 岩浆表面流动（亮带平移） -->
      <rect x="20" y="60" width="120" height="6" fill="url(#lsFlow)" rx="6">
        <animate attributeName="x" values="-20;20;-20" dur="3s" repeatCount="indefinite"/>
      </rect>
      <!-- 第二层流动 -->
      <rect x="20" y="62" width="120" height="3" fill="#fff59d" opacity="0.5" rx="3">
        <animate attributeName="x" values="20;-20;20" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      <!-- 岩浆内气泡（上升到表面破裂） -->
      <circle cx="55" cy="80" r="3" fill="rgba(255,235,59,0.8)">
        <animate attributeName="cy" values="85;62;62" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3;5;8" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.9;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="105" cy="80" r="3" fill="rgba(255,235,59,0.8)">
        <animate attributeName="cy" values="85;62;62" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3;5;8" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.9;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
      </circle>
      <!-- 蒸汽上升（白灰半透明） -->
      <circle cx="60" cy="58" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;20;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.4;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="58" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;20;0" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.4;0" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="58" r="5" fill="rgba(230,235,245,0.75)">
        <animate attributeName="cy" values="58;20;0" dur="2.5s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.4;0" dur="2.5s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="5;8;11" dur="2.5s" begin="1.6s" repeatCount="indefinite"/>
      </circle>
      <text x="80" y="115" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">岩浆气体释放</text>
    </svg>`,
  "obsidian-form": `
    <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <linearGradient id="ofLava" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fff59d"/>
          <stop offset="30%" stop-color="#ffeb3b"/>
          <stop offset="60%" stop-color="#ff6f00"/>
          <stop offset="100%" stop-color="#bf360c"/>
        </linearGradient>
        <linearGradient id="ofCool" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(180,220,255,0)"/>
          <stop offset="100%" stop-color="rgba(180,220,255,0.7)"/>
        </linearGradient>
        <radialGradient id="ofObsidian" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#424242"/>
          <stop offset="50%" stop-color="#1a0a05"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      <!-- 冷气流（上方波浪向下） -->
      <path d="M 20 10 Q 50 5 80 10 T 140 10 T 200 10" stroke="url(#ofCool)" stroke-width="6" fill="none" opacity="0.6">
        <animate attributeName="d" values="M 20 10 Q 50 5 80 10 T 140 10 T 200 10;
                                          M 20 14 Q 50 9 80 14 T 140 14 T 200 14;
                                          M 20 10 Q 50 5 80 10 T 140 10 T 200 10" dur="2s" repeatCount="indefinite"/>
      </path>
      <text x="110" y="8" text-anchor="middle" font-size="8" fill="#1565c0" font-family="sans-serif">冷空气 ↓</text>
      <!-- 岩浆块（温度色变：黄白→橙→暗红→黑） -->
      <rect x="50" y="30" width="120" height="55" rx="4" fill="url(#ofLava)"/>
      <!-- 色温变化覆盖层（4阶段颜色叠加，opacity 循环） -->
      <rect x="50" y="30" width="120" height="55" rx="4" fill="#ff6f00" opacity="0">
        <animate attributeName="opacity" values="0;0.4;0.8;0.4;0" keyTimes="0;0.25;0.5;0.75;1" dur="6s" repeatCount="indefinite"/>
      </rect>
      <rect x="50" y="30" width="120" height="55" rx="4" fill="#bf360c" opacity="0">
        <animate attributeName="opacity" values="0;0;0.5;0.9;0.5;0" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="6s" repeatCount="indefinite"/>
      </rect>
      <rect x="50" y="30" width="120" height="55" rx="4" fill="#000" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.4;0.95;0.95;0.4;0" keyTimes="0;0.3;0.5;0.65;0.8;0.9;0.95;1" dur="6s" repeatCount="indefinite"/>
      </rect>
      <!-- 玻璃光泽（高光斜线，黑曜岩形成时显现） -->
      <ellipse cx="80" cy="45" rx="22" ry="5" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.7;0.5;0.7;0;0" keyTimes="0;0.3;0.5;0.7;0.8;0.9;0.95;1" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="rx" values="22;24;22" dur="6s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="130" cy="65" rx="14" ry="3" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.5;0.3;0.5;0;0" keyTimes="0;0.3;0.5;0.7;0.8;0.9;0.95;1" dur="6s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 裂纹生长（stroke-dasharray 动画） -->
      <path d="M 70 35 L 90 55 L 80 75" stroke="#000" stroke-width="1.2" fill="none" stroke-dasharray="60" stroke-dashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;60;60;60;0;0;60" keyTimes="0;0.3;0.5;0.7;0.85;0.95;1" dur="6s" repeatCount="indefinite"/>
      </path>
      <path d="M 130 32 L 145 60 L 135 80" stroke="#000" stroke-width="1" fill="none" stroke-dasharray="60" stroke-dashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;60;60;60;0;0;60" keyTimes="0;0.3;0.5;0.7;0.85;0.95;1" dur="6s" repeatCount="indefinite"/>
      </path>
      <path d="M 105 30 L 110 80" stroke="#000" stroke-width="0.8" fill="none" stroke-dasharray="60" stroke-dashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;60;60;60;0;0;60" keyTimes="0;0.3;0.5;0.7;0.85;0.95;1" dur="6s" repeatCount="indefinite"/>
      </path>
      <!-- 岩浆流（从火山口流出到块体） -->
      <path d="M 110 30 Q 108 25 105 22" stroke="#ff4500" stroke-width="2" fill="none" opacity="0.7"/>
      <!-- 温度计（右侧） -->
      <g transform="translate(195,30)">
        <rect x="-3" y="0" width="6" height="50" fill="#fff" stroke="#424242" stroke-width="0.6" rx="2"/>
        <rect x="-2" y="2" width="4" height="46" fill="#ff5252">
          <animate attributeName="height" values="46;46;30;15;5;5;30" keyTimes="0;0.2;0.4;0.6;0.8;0.9;1" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="y" values="2;2;18;33;43;43;18" keyTimes="0;0.2;0.4;0.6;0.8;0.9;1" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="fill" values="#ff5252;#ff5252;#ff9800;#ffc107;#448aff;#448aff;#ff9800" keyTimes="0;0.2;0.4;0.6;0.8;0.9;1" dur="6s" repeatCount="indefinite"/>
        </rect>
        <text x="0" y="-3" text-anchor="middle" font-size="7" fill="#424242" font-family="sans-serif">温度</text>
        <text x="0" y="60" text-anchor="middle" font-size="6" fill="#424242" font-family="sans-serif">1200→300°C</text>
      </g>
      <text x="110" y="105" text-anchor="middle" font-size="9" fill="#4e342e" font-family="sans-serif">岩浆快速冷却 → 玻璃质黑曜岩</text>
      <text x="110" y="118" text-anchor="middle" font-size="8" fill="#6d4c41" font-family="sans-serif">（贝壳状断口·玻璃光泽）</text>
    </svg>`,
  "full-eruption": `
    <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" style="width:200px;">
      <defs>
        <linearGradient id="feVolcano" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5d4037"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <linearGradient id="feLava" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff4500"/>
          <stop offset="100%" stop-color="#ffeb3b"/>
        </linearGradient>
        <radialGradient id="feGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,140,0,0.6)"/>
          <stop offset="100%" stop-color="rgba(255,140,0,0)"/>
        </radialGradient>
      </defs>
      <!-- 火山体（带微震颤动） -->
      <g>
        <path d="M 40 140 L 100 55 L 160 140 Z" fill="url(#feVolcano)" stroke="#1a0a05" stroke-width="1.5"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;1,0;-1,0;0,0" dur="0.3s" repeatCount="indefinite"/>
      </g>
      <!-- 火山口辉光 -->
      <ellipse cx="100" cy="60" rx="30" ry="12" fill="url(#feGlow)"/>
      <ellipse cx="100" cy="57" rx="13" ry="4" fill="#0a0500"/>
      <!-- 熔岩湖（脉动） -->
      <ellipse cx="100" cy="57" rx="10" ry="3" fill="url(#feLava)">
        <animate attributeName="rx" values="9;11;9" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 三层喷发烟柱（不同色透明度） -->
      <circle cx="100" cy="45" r="9" fill="#ff8c00" opacity="0.85">
        <animate attributeName="cy" values="45;-20;-40" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="9;22;30" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.85;0.3;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="45" r="7" fill="#ff6f00" opacity="0.9">
        <animate attributeName="cy" values="45;-20;-40" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="7;18;24" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.4;0" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="45" r="6" fill="#bf360c" opacity="0.7">
        <animate attributeName="cy" values="45;-15;-30" dur="3s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="6;20;28" dur="3s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.3;0" dur="3s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <!-- 烟柱顶部扩散变灰 -->
      <circle cx="100" cy="0" r="20" fill="rgba(100,90,85,0.4)">
        <animate attributeName="cy" values="20;-30;-50" dur="3s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;30;40" dur="3s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.2;0" dur="3s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <!-- 火星飞溅（4颗，两左两右） -->
      <circle cx="95" cy="50" r="2.5" fill="#ffeb3b">
        <animate attributeName="cy" values="50;15;-5" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="95;80;65" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.7;0" dur="1.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="105" cy="50" r="2.5" fill="#ffeb3b">
        <animate attributeName="cy" values="50;15;-5" dur="1.6s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="105;120;135" dur="1.6s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.7;0" dur="1.6s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="98" cy="50" r="2" fill="#ff5252">
        <animate attributeName="cy" values="50;20;5" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="98;75;55" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.6;0" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="102" cy="50" r="2" fill="#ff5252">
        <animate attributeName="cy" values="50;20;5" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="102;125;145" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.6;0" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
      </circle>
      <!-- 主岩浆流（右侧流下） -->
      <path d="M 100 57 Q 108 85 113 115 Q 118 130 123 138" stroke="url(#feLava)" stroke-width="4" fill="none" opacity="0.9" stroke-linecap="round">
        <animate attributeName="stroke-dasharray" values="0 90;90 0" dur="3s" repeatCount="indefinite"/>
      </path>
      <!-- 分支岩浆流（左侧流下） -->
      <path d="M 97 57 Q 88 80 82 105 Q 78 125 75 135" stroke="url(#feLava)" stroke-width="3" fill="none" opacity="0.75" stroke-linecap="round">
        <animate attributeName="stroke-dasharray" values="0 80;80 0" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
      </path>
      <text x="100" y="162" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">地幔岩浆喷发</text>
    </svg>`,
  "shield-shape": `
    <svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <linearGradient id="ssBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#6d4c41"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <linearGradient id="ssFlow1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="#ff4500"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
        <linearGradient id="ssFlow2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="#ff8c00"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
        <linearGradient id="ssFlow3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="#bf360c"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      <line x1="10" y1="100" x2="210" y2="100" stroke="#5d4037" stroke-width="1.5"/>
      <!-- 盾状山体（平缓宽广） -->
      <path d="M 20 100 Q 110 60 200 100 Z" fill="url(#ssBody)" stroke="#1a0a05" stroke-width="1"/>
      <!-- 多层熔岩叠加（体现"层层铺开成盾"） -->
      <path d="M 30 100 Q 110 75 190 100" stroke="url(#ssFlow1)" stroke-width="4" fill="none" opacity="0.9">
        <animate attributeName="stroke-dashoffset" values="0;-50" dur="2.5s" repeatCount="indefinite"/>
      </path>
      <path d="M 40 100 Q 110 80 180 100" stroke="url(#ssFlow2)" stroke-width="3.5" fill="none" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="0;-40" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M 50 100 Q 110 85 170 100" stroke="url(#ssFlow3)" stroke-width="3" fill="none" opacity="0.7">
        <animate attributeName="stroke-dashoffset" values="0;-35" dur="3.5s" repeatCount="indefinite"/>
      </path>
      <!-- 顶部火山口 -->
      <ellipse cx="110" cy="65" rx="10" ry="2.5" fill="#0a0500"/>
      <ellipse cx="110" cy="65" rx="7" ry="1.5" fill="#ff4500">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 火山口持续冒泡 -->
      <circle cx="110" cy="58" r="2" fill="#ffeb3b">
        <animate attributeName="cy" values="60;48;48" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2;4;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.6;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="108" cy="58" r="1.5" fill="#ff8c00">
        <animate attributeName="cy" values="60;48;48" dur="2s" begin="0.7s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.5;3;3" dur="2s" begin="0.7s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
      </circle>
      <!-- 坡度标注 -->
      <line x1="20" y1="100" x2="110" y2="65" stroke="#d84315" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="55" y="88" font-size="8" fill="#d84315" font-family="sans-serif">2°-10°</text>
      <text x="110" y="115" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">盾状火山 · 层层铺开成盾</text>
    </svg>`,
  "sticky-lava": `
    <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg" style="width:180px;">
      <defs>
        <linearGradient id="slPool" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ff6f00"/>
          <stop offset="100%" stop-color="#c62828"/>
        </linearGradient>
        <radialGradient id="slGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,235,59,0.4)"/>
          <stop offset="100%" stop-color="rgba(255,235,59,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="90" cy="80" rx="85" ry="25" fill="url(#slGlow)">
        <animate attributeName="rx" values="80;90;80" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <rect x="15" y="65" width="150" height="45" fill="url(#slPool)" rx="6"/>
      <rect x="15" y="65" width="150" height="6" fill="#ffeb3b" opacity="0.6" rx="6"/>
      <!-- 粘稠气泡1（颤动+欲破未破） -->
      <ellipse cx="55" cy="72" rx="9" ry="6" fill="rgba(255,235,59,0.7)">
        <animate attributeName="ry" values="4;8;5;9;4" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="74;68;72;66;74" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.9;0.7;0.9;0.6" dur="2.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 粘稠拉丝1 -->
      <path d="M 55 65 Q 53 60 55 55" stroke="rgba(255,235,59,0.5)" stroke-width="1.2" fill="none">
        <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="d" values="M 55 65 Q 53 60 55 55;M 55 65 Q 57 58 55 50;M 55 65 Q 53 60 55 55" dur="2.5s" repeatCount="indefinite"/>
      </path>
      <!-- 粘稠气泡2 -->
      <ellipse cx="90" cy="72" rx="9" ry="6" fill="rgba(255,235,59,0.7)">
        <animate attributeName="ry" values="4;8;5;9;4" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="74;68;72;66;74" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.9;0.7;0.9;0.6" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </ellipse>
      <path d="M 90 65 Q 92 60 90 55" stroke="rgba(255,235,59,0.5)" stroke-width="1.2" fill="none">
        <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="d" values="M 90 65 Q 92 60 90 55;M 90 65 Q 88 58 90 50;M 90 65 Q 92 60 90 55" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </path>
      <!-- 粘稠气泡3 -->
      <ellipse cx="125" cy="72" rx="9" ry="6" fill="rgba(255,235,59,0.7)">
        <animate attributeName="ry" values="4;8;5;9;4" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="74;68;72;66;74" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.9;0.7;0.9;0.6" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <path d="M 125 65 Q 127 60 125 55" stroke="rgba(255,235,59,0.5)" stroke-width="1.2" fill="none">
        <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
        <animate attributeName="d" values="M 125 65 Q 127 60 125 55;M 125 65 Q 123 58 125 50;M 125 65 Q 127 60 125 55" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
      </path>
      <!-- 岩浆表面波动 -->
      <ellipse cx="90" cy="67" rx="70" ry="2" fill="rgba(255,255,255,0.3)">
        <animate attributeName="ry" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite"/>
      </ellipse>
      <text x="90" y="122" text-anchor="middle" font-size="10" fill="#6d4c41" font-family="sans-serif">粘稠岩浆气泡难逸出</text>
    </svg>`,
  // ========== 新增 6 个悬停动画 ==========
  "subduction": `
    <svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <linearGradient id="subMantle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ff7043"/>
          <stop offset="100%" stop-color="#bf360c"/>
        </linearGradient>
        <linearGradient id="subOcean" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5d4037"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <linearGradient id="subCont" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8d6e63"/>
          <stop offset="100%" stop-color="#5d4037"/>
        </linearGradient>
        <linearGradient id="subMagma" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff4500"/>
          <stop offset="100%" stop-color="#ffeb3b"/>
        </linearGradient>
      </defs>
      <!-- 大陆板块 -->
      <path d="M 5 55 L 105 55 L 115 70 L 115 90 L 5 90 Z" fill="url(#subCont)" stroke="#3e2723" stroke-width="1"/>
      <text x="55" y="78" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">大陆板块</text>
      <!-- 海洋板块（俯冲下沉） -->
      <path d="M 115 55 L 215 55 L 215 70 L 155 105 L 135 130 L 120 130 L 115 90 Z" fill="url(#subOcean)" stroke="#1a0a05" stroke-width="1">
        <animateTransform attributeName="transform" type="translate" values="0,0;-3,0;0,0" dur="3s" repeatCount="indefinite"/>
      </path>
      <text x="175" y="68" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">海洋板块</text>
      <!-- 俯冲方向箭头 -->
      <path d="M 165 90 L 145 120 L 138 115 L 145 120 L 142 128" stroke="#d84315" stroke-width="1.5" fill="none"/>
      <!-- 地幔层 -->
      <rect x="0" y="90" width="220" height="50" fill="url(#subMantle)" opacity="0.7"/>
      <!-- 熔融区（海洋板块进入地幔处） -->
      <ellipse cx="145" cy="120" rx="22" ry="7" fill="#ff4500" opacity="0.8">
        <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="rx" values="20;26;20" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <text x="178" y="118" font-size="8" fill="#fff" font-family="sans-serif">熔融</text>
      <!-- 岩浆上升通道 -->
      <path d="M 130 120 Q 95 95 75 60" stroke="url(#subMagma)" stroke-width="3" fill="none" stroke-dasharray="5 3">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1s" repeatCount="indefinite"/>
      </path>
      <!-- 上升的岩浆气泡 -->
      <circle cx="105" cy="95" r="3" fill="#ffeb3b">
        <animate attributeName="cy" values="115;60;60" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="130;75;75" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;1;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="105" cy="95" r="2.5" fill="#ffeb3b">
        <animate attributeName="cy" values="115;60;60" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="130;75;75" dur="2.5s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;1;0" dur="2.5s" begin="1s" repeatCount="indefinite"/>
      </circle>
      <!-- 地表火山 -->
      <path d="M 65 60 L 75 40 L 85 60 Z" fill="#3e2723" stroke="#000" stroke-width="1"/>
      <ellipse cx="75" cy="41" rx="4" ry="1.5" fill="#0a0500"/>
      <ellipse cx="75" cy="41" rx="3" ry="1" fill="#ff4500">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite"/>
      </ellipse>
      <circle cx="75" cy="33" r="2.5" fill="#9e9e9e" opacity="0.7">
        <animate attributeName="cy" values="33;22;33" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x="110" y="135" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">板块俯冲→熔融→岩浆上涌</text>
    </svg>`,
  "magma-plug": `
    <svg viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg" style="width:180px;">
      <defs>
        <linearGradient id="mpCone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5d4037"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <radialGradient id="mpMagma" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffeb3b"/>
          <stop offset="100%" stop-color="#bf360c"/>
        </radialGradient>
      </defs>
      <line x1="10" y1="120" x2="170" y2="120" stroke="#5d4037" stroke-width="1.5"/>
      <!-- 火山锥 -->
      <path d="M 55 120 L 90 35 L 125 120 Z" fill="url(#mpCone)" stroke="#1a0a05" stroke-width="1.5"/>
      <!-- 火山通道（内壁） -->
      <path d="M 87 120 L 88 45 L 92 45 L 93 120 Z" fill="#1a0a05"/>
      <!-- 冷凝塞子（火山口顶部，深色带横纹） -->
      <ellipse cx="90" cy="45" rx="11" ry="4" fill="#0a0500"/>
      <ellipse cx="90" cy="44" rx="9" ry="3" fill="#1a0a05"/>
      <line x1="83" y1="43" x2="97" y2="43" stroke="#424242" stroke-width="0.6"/>
      <line x1="82" y1="45" x2="98" y2="45" stroke="#424242" stroke-width="0.6"/>
      <line x1="83" y1="47" x2="97" y2="47" stroke="#424242" stroke-width="0.6"/>
      <text x="148" y="40" font-size="9" font-weight="bold" fill="#d84315" font-family="sans-serif">冷凝塞子</text>
      <line x1="101" y1="45" x2="140" y2="42" stroke="#d84315" stroke-width="1"/>
      <!-- 塞子下方气体压力积累（气泡群，越来越多） -->
      <ellipse cx="90" cy="80" rx="5" ry="4" fill="rgba(255,235,59,0.7)">
        <animate attributeName="ry" values="2;6;2" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="82;76;82" dur="2.2s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="84" cy="95" rx="4" ry="3" fill="rgba(255,200,50,0.6)">
        <animate attributeName="ry" values="2;5;2" dur="2.2s" begin="0.4s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="96" cy="100" rx="4" ry="3" fill="rgba(255,200,50,0.6)">
        <animate attributeName="ry" values="2;5;2" dur="2.2s" begin="0.8s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="88" cy="108" rx="3.5" ry="2.5" fill="rgba(255,180,30,0.5)">
        <animate attributeName="ry" values="2;4;2" dur="2.2s" begin="1.2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 岩浆房脉动 -->
      <ellipse cx="90" cy="132" rx="65" ry="10" fill="url(#mpMagma)">
        <animate attributeName="rx" values="62;70;62" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 顶部微量气体渗出 -->
      <circle cx="90" cy="38" r="1.8" fill="rgba(200,200,200,0.6)">
        <animate attributeName="cy" values="38;25;25" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.6;0" dur="3s" repeatCount="indefinite"/>
      </circle>
      <!-- 压力指示 -->
      <text x="148" y="100" font-size="9" font-weight="bold" fill="#d84315" font-family="sans-serif">压力</text>
      <text x="148" y="112" font-size="9" font-weight="bold" fill="#d84315" font-family="sans-serif">积累</text>
      <line x1="100" y1="95" x2="140" y2="100" stroke="#d84315" stroke-width="1"/>
    </svg>`,
  "ash-climate": `
    <svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <radialGradient id="acSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff59d"/>
          <stop offset="60%" stop-color="#ffeb3b"/>
          <stop offset="100%" stop-color="#ff9800"/>
        </radialGradient>
        <linearGradient id="acGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8d6e63"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
      </defs>
      <!-- 天空 -->
      <rect x="0" y="0" width="220" height="120" fill="#90caf9" opacity="0.3"/>
      <!-- 太阳 -->
      <circle cx="30" cy="25" r="14" fill="url(#acSun)">
        <animate attributeName="r" values="13;15;13" dur="3s" repeatCount="indefinite"/>
      </circle>
      <!-- 火山 -->
      <path d="M 145 130 L 175 75 L 205 130 Z" fill="#3e2723" stroke="#000" stroke-width="1"/>
      <ellipse cx="175" cy="77" rx="5" ry="1.5" fill="#0a0500"/>
      <!-- 火山喷发灰柱 -->
      <ellipse cx="175" cy="72" rx="3" ry="2" fill="#424242">
        <animate attributeName="cy" values="72;55;40" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="rx" values="3;8;14" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="2;5;8" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.6;0.2" dur="2.5s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="175" cy="72" rx="3" ry="2" fill="#424242">
        <animate attributeName="cy" values="72;55;40" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="rx" values="3;8;14" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="2;5;8" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.6;0.2" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 平流层气溶胶层（扩散） -->
      <ellipse cx="120" cy="40" rx="90" ry="10" fill="rgba(120,100,90,0.55)">
        <animate attributeName="rx" values="60;95;60" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite"/>
      </ellipse>
      <text x="120" y="30" text-anchor="middle" font-size="8" fill="#4e342e" font-family="sans-serif">平流层火山灰气溶胶层</text>
      <!-- 阳光被反射（黄色箭头向下被弹回） -->
      <line x1="35" y1="40" x2="100" y2="40" stroke="#ffeb3b" stroke-width="2" stroke-dasharray="4 2" opacity="0.9">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.8s" repeatCount="indefinite"/>
      </line>
      <path d="M 100 40 L 92 36 L 92 44 Z" fill="#ffeb3b">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite"/>
      </path>
      <!-- 反射回太空的箭头 -->
      <path d="M 100 40 Q 80 25 60 15" stroke="#ffeb3b" stroke-width="1.5" fill="none" opacity="0.7" stroke-dasharray="3 2"/>
      <text x="55" y="55" font-size="8" fill="#ff9800" font-family="sans-serif">阳光被反射</text>
      <!-- 地面 -->
      <rect x="0" y="120" width="220" height="30" fill="url(#acGround)"/>
      <!-- 地面降温（变蓝色） -->
      <rect x="0" y="120" width="220" height="30" fill="#1565c0" opacity="0">
        <animate attributeName="opacity" values="0;0.4;0" dur="4s" repeatCount="indefinite"/>
      </rect>
      <text x="110" y="140" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">地面降温</text>
      <!-- 温度计 -->
      <g transform="translate(205,100)">
        <rect x="-3" y="0" width="6" height="20" fill="#fff" stroke="#424242" stroke-width="0.5" rx="2"/>
        <rect x="-2" y="2" width="4" height="16" fill="#ff5252">
          <animate attributeName="height" values="16;4;16" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="y" values="2;14;2" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="fill" values="#ff5252;#448aff;#ff5252" dur="4s" repeatCount="indefinite"/>
        </rect>
      </g>
    </svg>`,
  "seismic-wave": `
    <svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <linearGradient id="swCone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5d4037"/>
          <stop offset="100%" stop-color="#3e2723"/>
        </linearGradient>
        <linearGradient id="swMagma" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff4500"/>
          <stop offset="100%" stop-color="#ffeb3b"/>
        </linearGradient>
      </defs>
      <line x1="10" y1="120" x2="210" y2="120" stroke="#5d4037" stroke-width="1.5"/>
      <!-- 火山 -->
      <path d="M 85 120 L 110 55 L 135 120 Z" fill="url(#swCone)" stroke="#1a0a05" stroke-width="1.5"/>
      <ellipse cx="110" cy="57" rx="6" ry="2" fill="#0a0500"/>
      <ellipse cx="110" cy="57" rx="4" ry="1.2" fill="#ff4500">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 火山口冒烟 -->
      <circle cx="110" cy="50" r="2.5" fill="#9e9e9e" opacity="0.7">
        <animate attributeName="cy" values="50;35;35" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2.5;5;5" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <!-- 岩浆上涌通道 -->
      <path d="M 110 120 L 110 60" stroke="url(#swMagma)" stroke-width="4" stroke-dasharray="5 3">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <!-- 岩浆房 -->
      <ellipse cx="110" cy="135" rx="55" ry="9" fill="url(#swMagma)">
        <animate attributeName="rx" values="52;58;52" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 岩石裂缝 -->
      <path d="M 110 110 L 90 95 M 110 100 L 130 88 M 110 90 L 85 75" stroke="#1a0a05" stroke-width="1" fill="none" opacity="0.7"/>
      <!-- 地震波纹（同心圆扩散） -->
      <circle cx="110" cy="120" r="15" fill="none" stroke="#d84315" stroke-width="1.5" opacity="0.7">
        <animate attributeName="r" values="15;90;90" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="110" cy="120" r="15" fill="none" stroke="#d84315" stroke-width="1.5" opacity="0.7">
        <animate attributeName="r" values="15;90;90" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="110" cy="120" r="15" fill="none" stroke="#d84315" stroke-width="1.5" opacity="0.7">
        <animate attributeName="r" values="15;90;90" dur="2.5s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0" dur="2.5s" begin="1.6s" repeatCount="indefinite"/>
      </circle>
      <!-- 地震仪（右侧） -->
      <g transform="translate(180,90)">
        <rect x="-15" y="0" width="40" height="30" fill="#fff" stroke="#424242" stroke-width="1" rx="2"/>
        <text x="5" y="12" text-anchor="middle" font-size="7" fill="#424242" font-family="sans-serif">地震仪</text>
        <path d="M -12 22 L -8 18 L -4 24 L 0 16 L 4 22 L 8 14 L 12 22 L 16 18 L 22 22" stroke="#d84315" stroke-width="1.2" fill="none">
          <animate attributeName="d" values="M -12 22 L -8 18 L -4 24 L 0 16 L 4 22 L 8 14 L 12 22 L 16 18 L 22 22;
                                            M -12 22 L -8 24 L -4 16 L 0 22 L 4 18 L 8 22 L 12 14 L 16 22 L 22 18;
                                            M -12 22 L -8 18 L -4 24 L 0 16 L 4 22 L 8 14 L 12 22 L 16 18 L 22 22" dur="0.6s" repeatCount="indefinite"/>
        </path>
      </g>
      <text x="110" y="148" text-anchor="middle" font-size="9" fill="#4e342e" font-family="sans-serif">岩浆上涌撑裂岩石→微震频发</text>
    </svg>`,
  "monitoring": `
    <svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <defs>
        <linearGradient id="mnSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1a237e"/>
          <stop offset="100%" stop-color="#90caf9"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="220" height="100" fill="url(#mnSky)"/>
      <rect x="0" y="100" width="220" height="50" fill="#5d4037"/>
      <!-- 卫星 -->
      <g>
        <rect x="85" y="20" width="20" height="10" fill="#9e9e9e" stroke="#424242" stroke-width="1" rx="1"/>
        <rect x="73" y="22" width="12" height="6" fill="#1565c0"/>
        <rect x="105" y="22" width="12" height="6" fill="#1565c0"/>
        <line x1="95" y1="30" x2="95" y2="38" stroke="#9e9e9e" stroke-width="1"/>
        <circle cx="95" cy="40" r="2.5" fill="#ffeb3b">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
        </circle>
        <animateTransform attributeName="transform" type="translate" values="0,0;30,5;0,0" dur="6s" repeatCount="indefinite"/>
      </g>
      <text x="100" y="15" text-anchor="middle" font-size="8" fill="#fff" font-family="sans-serif">监测卫星</text>
      <!-- 卫星监测波束 -->
      <line x1="110" y1="42" x2="150" y2="95" stroke="#ffeb3b" stroke-width="1" stroke-dasharray="4 3" opacity="0.7">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite"/>
      </line>
      <!-- 火山 -->
      <path d="M 130 100 L 150 60 L 170 100 Z" fill="#3e2723" stroke="#000" stroke-width="1"/>
      <ellipse cx="150" cy="62" rx="4" ry="1.5" fill="#0a0500"/>
      <ellipse cx="150" cy="62" rx="3" ry="1" fill="#ff4500">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 地震仪（左下） -->
      <g transform="translate(40,115)">
        <rect x="-12" y="-8" width="24" height="16" fill="#424242" stroke="#000" stroke-width="1" rx="2"/>
        <circle cx="0" cy="0" r="2.5" fill="#4caf50">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite"/>
        </circle>
        <text x="0" y="22" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif">地震仪</text>
      </g>
      <!-- 气体传感器（右下） -->
      <g transform="translate(195,115)">
        <rect x="-12" y="-8" width="24" height="16" fill="#424242" stroke="#000" stroke-width="1" rx="2"/>
        <circle cx="0" cy="0" r="2.5" fill="#ff9800">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite"/>
        </circle>
        <text x="0" y="22" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif">气体传感</text>
      </g>
      <!-- 地震波纹 -->
      <circle cx="150" cy="100" r="12" fill="none" stroke="#ffeb3b" stroke-width="1" opacity="0.5">
        <animate attributeName="r" values="12;45;45" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- 气体扩散 -->
      <circle cx="150" cy="55" r="2" fill="rgba(255,180,50,0.6)">
        <animate attributeName="cy" values="55;40;40" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="150;160;155" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2;5;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- 形变箭头（地表隆起） -->
      <path d="M 135 100 L 138 95" stroke="#e91e63" stroke-width="1.5" fill="none"/>
      <path d="M 165 100 L 162 95" stroke="#e91e63" stroke-width="1.5" fill="none"/>
      <text x="40" y="50" font-size="8" fill="#fff" font-family="sans-serif">InSAR形变监测</text>
      <line x1="75" y1="48" x2="120" y2="70" stroke="#e91e63" stroke-width="0.8" stroke-dasharray="2 1"/>
      <text x="110" y="145" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">卫星+地震仪+气体传感 多手段联合</text>
    </svg>`,
  "volcano-benefits": `
    <svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" style="width:220px;">
      <!-- 左侧：地热能 -->
      <g>
        <text x="55" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#d84315" font-family="sans-serif">地热能</text>
        <!-- 地热井 -->
        <rect x="50" y="60" width="10" height="60" fill="#424242" stroke="#000" stroke-width="1"/>
        <rect x="48" y="58" width="14" height="4" fill="#616161"/>
        <!-- 地下岩浆（热源） -->
        <ellipse cx="55" cy="135" rx="40" ry="6" fill="#ff4500" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.85;0.5" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <!-- 上升蒸汽 -->
        <circle cx="55" cy="55" r="3" fill="rgba(255,255,255,0.7)">
          <animate attributeName="cy" values="58;30;30" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="r" values="3;6;6" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="55" cy="55" r="3" fill="rgba(255,255,255,0.7)">
          <animate attributeName="cy" values="58;30;30" dur="2s" begin="0.7s" repeatCount="indefinite"/>
          <animate attributeName="r" values="3;6;6" dur="2s" begin="0.7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
        </circle>
        <!-- 发电涡轮 -->
        <g transform="translate(85,50)">
          <circle cx="0" cy="0" r="10" fill="#fff" stroke="#424242" stroke-width="1.2"/>
          <path d="M 0 0 L 0 -8 M 0 0 L 7 4 M 0 0 L -7 4" stroke="#1565c0" stroke-width="1.5">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.5s" repeatCount="indefinite"/>
          </path>
          <circle cx="0" cy="0" r="1.5" fill="#424242"/>
        </g>
        <line x1="60" y1="50" x2="75" y2="50" stroke="#424242" stroke-width="1.5"/>
        <text x="95" y="35" font-size="8" fill="#424242" font-family="sans-serif">发电</text>
      </g>
      <!-- 右侧：沃土 -->
      <g>
        <text x="165" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#d84315" font-family="sans-serif">肥沃土壤</text>
        <!-- 火山灰土壤层 -->
        <rect x="120" y="100" width="90" height="35" fill="#3e2723" stroke="#1a0a05" stroke-width="1"/>
        <rect x="120" y="100" width="90" height="6" fill="#5d4037"/>
        <text x="165" y="123" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif">火山灰土壤</text>
        <!-- 植物生长（从无到有） -->
        <g opacity="0">
          <path d="M 140 100 L 140 80 M 140 90 L 132 82 M 140 88 L 148 80" stroke="#4caf50" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="132" cy="82" r="2.5" fill="#66bb6a"/>
          <circle cx="148" cy="80" r="2.5" fill="#66bb6a"/>
          <animate attributeName="opacity" values="0;1;1" dur="4s" repeatCount="indefinite"/>
        </g>
        <g opacity="0">
          <path d="M 165 100 L 165 75 M 165 88 L 157 80 M 165 85 L 173 77" stroke="#2e7d32" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="157" cy="80" r="3" fill="#4caf50"/>
          <circle cx="173" cy="77" r="3" fill="#4caf50"/>
          <animate attributeName="opacity" values="0;0;1" keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite"/>
        </g>
        <g opacity="0">
          <path d="M 190 100 L 190 82 M 190 92 L 184 85" stroke="#4caf50" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="184" cy="85" r="2.5" fill="#66bb6a"/>
          <animate attributeName="opacity" values="0;0;1" keyTimes="0;0.7;1" dur="4s" repeatCount="indefinite"/>
        </g>
        <!-- 阳光 -->
        <circle cx="200" cy="40" r="8" fill="#ffeb3b" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <line x1="200" y1="48" x2="180" y2="75" stroke="#ffeb3b" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
      </g>
      <text x="110" y="148" text-anchor="middle" font-size="9" fill="#4e342e" font-family="sans-serif">地热发电 + 火山灰沃土</text>
    </svg>`
};

// ---------- 状态 ----------
const state = {
  currentQuestion: 0,
  score: 0,
  answered: new Array(QUIZ_DATA.length).fill(false),
  wrongQuestions: []
};

// ---------- DOM 引用 ----------
const quizArea = document.getElementById("quizArea");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const quizScore = document.getElementById("quizScore");
const navScore = document.getElementById("navScore");
const hoverAnimStage = document.getElementById("hoverAnimStage");
const resultBox = document.getElementById("resultBox");

// ---------- 3D 火山场景实例（懒加载） ----------
let homeVolcano = null;
let knowledgeVolcano = null;

function ensureHomeVolcano() {
  if (!homeVolcano && window.VolcanoScene) {
    const c = document.getElementById("homeVolcano3d");
    if (c) { homeVolcano = new VolcanoScene(c); homeVolcano.start(); }
  } else if (homeVolcano) {
    homeVolcano.start();
  }
}
function ensureKnowledgeVolcano() {
  if (!knowledgeVolcano && window.VolcanoScene) {
    const c = document.getElementById("knowledgeVolcano3d");
    if (c) { knowledgeVolcano = new VolcanoScene(c, { small: true }); knowledgeVolcano.start(); }
  } else if (knowledgeVolcano) {
    knowledgeVolcano.start();
  }
}

// ---------- 路由 ----------
function handleRoute() {
  const hash = window.location.hash.replace("#", "") || "home";
  const validRoutes = ["home", "knowledge", "quiz", "result"];
  const route = validRoutes.includes(hash) ? hash : "home";

  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const target = document.getElementById(route);
  if (target) target.classList.add("active");

  // 导航高亮
  document.querySelectorAll(".nav-links a[data-route]").forEach(a => {
    a.classList.toggle("active", a.dataset.route === route);
  });

  // 3D 场景生命周期管理：仅在对应页面运行
  if (route === "home") {
    ensureHomeVolcano();
    knowledgeVolcano && knowledgeVolcano.stop();
  } else if (route === "knowledge") {
    ensureKnowledgeVolcano();
    homeVolcano && homeVolcano.stop();
  } else {
    homeVolcano && homeVolcano.stop();
    knowledgeVolcano && knowledgeVolcano.stop();
  }

  // 进入问答页时渲染当前题
  if (route === "quiz") renderQuestion(state.currentQuestion);
  // 进入结果页时渲染结果
  if (route === "result") renderResult();

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigate(route) {
  window.location.hash = route;
}

window.addEventListener("hashchange", handleRoute);

// ---------- 渲染单题 ----------
function renderQuestion(index) {
  const q = QUIZ_DATA[index];
  if (!q) return;

  // 更新进度
  const total = QUIZ_DATA.length;
  const progressPct = ((index) / total) * 100;
  progressFill.style.width = progressPct + "%";
  progressText.textContent = `第 ${index + 1} / ${total} 题`;
  quizScore.textContent = `得分：${state.score}`;
  navScore.textContent = `得分：${state.score}`;

  // 清空悬停动画区
  hoverAnimStage.innerHTML = '<div class="hover-anim-hint">将鼠标移到带 🔬 图标的选项上查看动画演示</div>';

  // 渲染题目
  const answered = state.answered[index];
  quizArea.innerHTML = `
    <div class="question-text">${q.question}</div>
    <div class="options" id="optionsList"></div>
    <div class="explanation" id="explanation">
      <div class="explanation-label" id="explanationLabel"></div>
      <div class="explanation-text" id="explanationText"></div>
    </div>
    <button class="next-btn" id="nextBtn">${index + 1 < total ? "下一题" : "查看结果"}</button>
  `;

  const optionsList = document.getElementById("optionsList");
  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.index = optIdx;
    btn.disabled = answered;

    const icon = opt.anim ? ' <span class="opt-anim-icon">🔬</span>' : "";
    btn.innerHTML = `<span>${opt.text}</span>${icon}`;

    // 已答过的题：恢复状态显示
    if (answered) {
      if (opt.correct) btn.classList.add("show-correct");
      // 如果当前选项是用户选错的那个，标记 locked-wrong（需记录用户选择）
      if (state.wrongQuestions.includes(q.id) && state._lastWrongOpt === optIdx && !opt.correct) {
        btn.classList.add("locked-wrong");
      }
    }

    btn.addEventListener("click", () => handleOptionClick(index, optIdx, btn));
    // 悬停动画绑定
    if (opt.anim) {
      btn.addEventListener("mouseenter", () => showHoverAnim(opt.anim));
      btn.addEventListener("mouseleave", () => clearHoverAnim());
    }
    optionsList.appendChild(btn);
  });

  // 已答过的题：显示解析与下一题按钮
  const explanation = document.getElementById("explanation");
  const nextBtn = document.getElementById("nextBtn");
  if (answered) {
    explanation.classList.add("show");
    const isWrong = state.wrongQuestions.includes(q.id);
    document.getElementById("explanationLabel").textContent = isWrong ? "✗ 答错了，正确答案解析：" : "✓ 回答正确！";
    document.getElementById("explanationText").textContent = q.explanation;
    nextBtn.classList.add("show");
  }

  nextBtn.addEventListener("click", () => {
    if (index + 1 < QUIZ_DATA.length) {
      state.currentQuestion = index + 1;
      renderQuestion(state.currentQuestion);
      // 更新进度条到当前题
      const pct = (state.currentQuestion / QUIZ_DATA.length) * 100;
      progressFill.style.width = pct + "%";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // 完成所有题，进度满
      progressFill.style.width = "100%";
      progressText.textContent = `已完成 ${QUIZ_DATA.length} / ${QUIZ_DATA.length} 题`;
      navigate("result");
    }
  });
}

// ---------- 选项点击处理 ----------
function handleOptionClick(qIndex, optIndex, btn) {
  if (state.answered[qIndex]) return;

  const q = QUIZ_DATA[qIndex];
  const opt = q.options[optIndex];
  state.answered[qIndex] = true;
  state._lastWrongOpt = optIndex;

  const explanation = document.getElementById("explanation");
  const explanationLabel = document.getElementById("explanationLabel");
  const explanationText = document.getElementById("explanationText");
  const nextBtn = document.getElementById("nextBtn");
  const allBtns = document.querySelectorAll("#optionsList .option-btn");

  if (opt.correct) {
    // 答对
    state.score++;
    btn.classList.add("correct");
    btn.disabled = true;
    allBtns.forEach(b => b.disabled = true);
    explanationLabel.textContent = "✓ 回答正确！";
    explanationText.textContent = q.explanation;
    explanation.classList.add("show");
    nextBtn.classList.add("show");
  } else {
    // 答错：变红→迅速褪色（0.7s 一次完成）
    state.wrongQuestions.push(q.id);
    btn.classList.add("wrong-flash");
    allBtns.forEach(b => b.disabled = true);

    // 动画结束后（0.7s）显示正确答案与解析
    setTimeout(() => {
      btn.classList.remove("wrong-flash");
      btn.classList.add("locked-wrong");
      // 高亮正确答案
      allBtns.forEach((b, i) => {
        if (q.options[i].correct) b.classList.add("show-correct");
      });
      explanationLabel.textContent = "✗ 答错了，正确答案解析：";
      explanationText.textContent = q.explanation;
      explanation.classList.add("show");
      nextBtn.classList.add("show");
    }, 700);
  }

  // 更新得分显示
  quizScore.textContent = `得分：${state.score}`;
  navScore.textContent = `得分：${state.score}`;
}

// ---------- 悬停动画 ----------
function showHoverAnim(animKey) {
  const tpl = ANIM_TEMPLATES[animKey];
  if (tpl) {
    hoverAnimStage.innerHTML = tpl;
  }
}
function clearHoverAnim() {
  hoverAnimStage.innerHTML = '<div class="hover-anim-hint">将鼠标移到带 🔬 图标的选项上查看动画演示</div>';
}

// ---------- 结果页 ----------
function renderResult() {
  const total = QUIZ_DATA.length;
  const score = state.score;
  let grade, gradeDesc;
  if (score === total) { grade = "🏆 火山专家"; gradeDesc = "完美！你对火山了如指掌。"; }
  else if (score >= 12) { grade = "🌟 火山达人"; gradeDesc = "非常优秀，再接再厉！"; }
  else if (score >= 8) { grade = "📚 火山学徒"; gradeDesc = "基础不错，继续探索吧。"; }
  else { grade = "🌱 火山小白"; gradeDesc = "别灰心，回去看看知识讲堂再来挑战！"; }

  let wrongHtml = "";
  if (state.wrongQuestions.length === 0) {
    wrongHtml = '<div class="result-perfect">🎉 全部答对，没有错题！</div>';
  } else {
    const items = state.wrongQuestions.map(qid => {
      const q = QUIZ_DATA.find(x => x.id === qid);
      const correctOpt = q.options.find(o => o.correct);
      return `<div class="result-wrong-item"><strong>${q.question}</strong><br>正确答案：${correctOpt.text}<br>${q.explanation}</div>`;
    }).join("");
    wrongHtml = `
      <div class="result-wrong-list">
        <div class="result-wrong-title">📝 错题回顾（共 ${state.wrongQuestions.length} 题）</div>
        ${items}
      </div>`;
  }

  resultBox.innerHTML = `
    <div class="result-score">${score} / ${total}</div>
    <div class="result-grade">${grade}</div>
    <div class="result-grade-desc">${gradeDesc}</div>
    ${wrongHtml}
  `;
}

// ---------- 重新挑战 ----------
document.getElementById("retryBtn").addEventListener("click", () => {
  state.currentQuestion = 0;
  state.score = 0;
  state.answered = new Array(QUIZ_DATA.length).fill(false);
  state.wrongQuestions = [];
  state._lastWrongOpt = undefined;
  navigate("quiz");
  renderQuestion(0);
});

// ---------- 喷发演示卡片跳转锚点 ----------
document.getElementById("cardDemo").addEventListener("click", (e) => {
  // 跳转到知识页的喷发原理章节
  setTimeout(() => {
    const target = document.getElementById("eruption-demo");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
});

// ---------- 初始化 ----------
handleRoute();
// 默认渲染第0题（即使没进入问答页也先准备好）
renderQuestion(0);

// 窗口尺寸变化：通知 3D 场景
window.addEventListener("resize", () => {
  homeVolcano && homeVolcano.resize();
  knowledgeVolcano && knowledgeVolcano.resize();
});

// 页面不可见时暂停 3D 渲染（节能）
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    homeVolcano && homeVolcano.stop();
    knowledgeVolcano && knowledgeVolcano.stop();
  } else {
    handleRoute(); // 重新激活当前页对应的场景
  }
});
