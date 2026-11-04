# DaziPet · Dada

**A Little Companion, A Bigger Happiness.**

电子商务课程的 AI 陪伴宠物品牌独立站，按照 Dada PRD V2.0 与团队提供的概念图片制作。使用原生 HTML、CSS、JavaScript，无需 npm 安装或构建。

> Classroom Demo Only · Concept Product · No Real Payment
>
> 本项目不处理真实支付、商品履约或购买者敏感资料。图片为课堂 AI 概念效果图，不是量产产品照片或工程性能证明。

## 快速运行

直接用 Chrome 打开 [`dist/index.html`](dist/index.html)。建议使用固定的 HTTP 地址，以稳定保存跨页购物车：

```sh
git clone https://github.com/EricliLife/Dazipet.git
cd Dazipet
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

浏览器访问 **http://127.0.0.1:4173**。结束预览时在终端按 `Ctrl+C`。

已发布的 [Sites 演示站](https://dazipet-dada-studio-1103.liandremissu.chatgpt.site) 沿用私有访问，需要站点所有者登录。

## 仓库结构

```text
Dazipet/
├── README.md                     项目入口与快速使用
├── QA.md                         验证记录及验证范围
├── netlify.toml                  静态部署配置
├── .gitignore
├── checks/
│   └── cart-checks.cjs           无依赖的购物车逻辑检查
├── dist/                         可直接运行及部署的网站
│   ├── index.html                品牌首页
│   ├── shop.html                 套装 / 独立外壳商品页
│   ├── checkout.html             购物车及模拟结算
│   ├── success.html              模拟订单确认
│   ├── config.js                 售价、运费、图片及商品配置
│   ├── script.js                 页面交互与浏览器本地保存
│   ├── i18n.js                   中英文显示与语言偏好保存
│   ├── style.css                 响应式样式
│   └── assets/                   网站实际使用的品牌与商品素材
└── docs/
    ├── USAGE.md                  详细操作、改价、换图与演示说明
    ├── prd/                      团队提供的原始 PRD 文档
    ├── requirements/             初始网站 prompt
    └── brand-assets/             团队提供的完整原始图片包
```

`dist/` 中的文件就是网页源文件，不由其他框架生成。原始 PRD、图片和需求独立保存在 `docs/`，网站只引用 `dist/assets/`，不依赖本地绝对路径。

## 页面与交互

- 首页：品牌主视觉、四项核心卖点、五种 AI 性格、三款外壳、完整套装、桌面与挂包场景。
- 商品：Complete Set / Extra Skin 两种类型；五行性格与外壳独立选择，图片、配置、数量和金额联动。
- 购物车：本地保存、数量修改、删除、同配置合并、模拟运费、自动合计。
- 模拟订单：订单编号、商品类型、配置及价格快照；确认后清空购物车。
- 小程序概念：共享提醒日程、添加/编辑/删除/打卡、唤醒名称与设备偏好设置；不连接真实微信或硬件。

## PRD V2.0 商品口径

| 类别 | 内容 | 模拟零售价 |
| --- | --- | --- |
| Dada Complete Set | 1 个 AI 核心主机 + 1 款外壳 + 磁吸桌面底座 + 充电线 + 挂包配件 | US$59.99 |
| Dada Extra Skin | Cloud、Sun 或 Star 一款外壳，不包含 AI 核心主机与配件 | US$8.99 |

五种性格：**Metal — Analytical / Wood — Gentle / Water — Agile / Fire — Passionate / Earth — Steady**。

三款外壳：**Cloud — Long-Pile Plush / Sun — Short-Pile Plush / Star — Silicone**。

性格在购买时选定且默认固定；修改唤醒名称不会切换性格。外壳可替换，沿用原核心。

PRD 第 9.3 节与素材说明给出了具体价格及套装组成，第 12.1 节仍保留旧的“待确认”清单。商品组成沿用第 9.3 节的具体方案；2026-11-04 按最新要求改为美元定价（USD），仍须与课堂财务测算统一。第一阶段面向中国 Z 世代消费者，完整套装含中国大陆标准配送费；跨境电商仅为未来国际化愿景。

## 修改价格与素材

编辑 [`dist/config.js`](dist/config.js)：

```js
product: {
  name: 'Dada',
  brand: 'DaziPet',
  price: 59.99,
  extraSkinPrice: 8.99,
  maxQuantity: 99
}
```

`shipping.completeSetFee: 0` 表示完整套装在中国大陆标准包邮，随套装加购的外壳合并配送，无额外标准配送费。`shipping.standaloneSkinFee: null` 表示外壳单买运费尚未定价；页面显示 To be confirmed，演示总额标注不含该运费，不会把待定运费显示为包邮。确定外壳单买运费后可将其改为金额，整单只计算一次。

AI 对话需要 Wi-Fi 或支持的热点；基础 AI 服务为拟议核心体验，具体可用范围和使用条款将在商业上线前确定。连接及服务说明统一配置于 `ai`，网站不承诺无限对话或永久免费。

图片替换、文件对应及完整演示步骤见 [`docs/USAGE.md`](docs/USAGE.md)。当前价通过配置统一计算，历史订单保留确认时快照。

## 验证

需要本机安装 Node 才运行以下开发检查；正常打开网页不需要 Node。

```sh
node --check dist/config.js
node --check dist/script.js
node checks/cart-checks.cjs
```

已验证：完整套装 **US$59.99**，一套加一个外壳 **US$68.98**，一套加两个外壳 **US$77.97**，以上均含中国大陆标准配送。外壳单买 **US$8.99**，运费待定并明确不含在演示总额中；完整套装与额外外壳分别计价，旧版购物车可兼容读取。浏览器验证和限制见 [`QA.md`](QA.md)。

## 部署到 Netlify

连接本仓库时，使用仓库内 [`netlify.toml`](netlify.toml)：无构建命令，发布目录为 `dist`。也可直接把 `dist/` 上传至静态托管平台。

## 本地数据

导航栏可选择 **EN / 中文**，语言偏好在当前浏览器中保存，并用于首页、商品页、购物袋及模拟订单。切换语言不会改变商品配置、数量、USD 定价或已保存订单。品牌图片中原有的英文属于图片素材。

商品购买区下方提供常驻 **View bag / 查看购物袋** 链接；加购提示中的链接也可点击，提示保留 12 秒。两处均跳转至 `checkout.html`。

购物车、最近一次模拟订单、示例提醒与演示偏好保存在当前浏览器。不同域名/端口的存储相互独立。本项目不含支付密钥、账号密码、Sites 访问凭据或外部分析统计。

## 展示网站
https://dazipet.liandremissu.workers.dev/
