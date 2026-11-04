# DaziPet / Dada 课堂电商演示站 · PRD V2.0

原生 HTML5、CSS3、JavaScript，无安装依赖、无构建步骤。网站英文展示，本文件为中文操作说明。

## 本次更新依据

- `docs/prd/DaziPet_Dada_PRD_V2.0_2026-11-03.docx`
- `docs/brand-assets/README.md` 与提供的品牌、产品、场景图片。
- `docs/requirements/original-prompt.md`。

商品组成沿用 PRD 第 9.3 节的五项标配；2026-11-04 按最新要求将完整套装定价更新为 US$59.99、独立外壳更新为 US$8.99，货币为 USD。第 12.1 节仍保留的“价格/包装/额外外壳待定”清单视为待财务复核事项，页面仍保留 Classroom Demo，所有价格可在 config.js 改动。跨境供应地、目的市场、实际运费和交付方案未确认，继续显示占位。

## 文件目录

仓库结构见根目录 [README.md](../README.md)。网页文件位于 `dist/`，原始 PRD、需求和图片位于 `docs/`。

## 本地打开

直接用 Chrome 打开 `dist/index.html`。为了稳定保存跨页购物车，建议固定用 HTTP 地址演示：

```sh
cd Dazipet
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

访问 http://127.0.0.1:4173 ，结束时 Ctrl+C。不要在 localhost、127.0.0.1、file:// 和线上域名之间切换购买流程，它们各自的存储互相独立。

## 商品规则与价格修改

只需修改 `dist/config.js`：

- `product.price: 59.99`：完整套装单价。
- `product.extraSkinPrice: 8.99`：额外外壳单价，Cloud、Sun、Star 统一价格。
- `shipping.fee: 0`：模拟运费。当前 **US$0 仅为待定计算占位，不承诺实际免运费**。
- `shipping.origin`、`destination`、`delivery`、`feeNote`：跨境信息占位。
- `skins[].image`：各款主图文件路径，统一影响首页、商品页、加购区和购物车。
- `product.maxQuantity: 99`：每种配置的数量上限。

所有页面价格使用上述配置。已确认的订单保留当时价格快照。网站展示的完整套装清单为真实 HTML，可随业务规则修改；没有用带固定价格的整张海报代替价格逻辑。

Complete Set 包含：1 个 AI 核心主机（选择一种性格）+ 1 款自选外壳 + 1 个磁吸桌面底座 + 1 根充电线 + 1 套挂包配件。

Extra Skin 仅含一款替换外壳，不包含 AI 核心主机或配件。提供的商品概念图展示装配后的外观，页面明确说明图中的黑色核心不随独立外壳销售。

AI 性格与外壳独立选择：性格在购买时选定且默认固定；更改唤醒名称不会切换性格。外壳可更换，使用原核心。

## 图片与页面对应

| 来源素材 | 网站用途 |
| --- | --- |
| logo/dazipet-logo-transparent.png | 导航与页脚品牌标识 |
| hero/hero-desktop-original.png | 桌面首页主视觉，派生 JPEG 减少传输体积；图中两处 CTA 覆盖为真实 HTML 链接 |
| products/dada-cloud.png、dada-sun.png、dada-star.png | 商品切换图、首页三外壳、缩略图、额外外壳卡片、购物车 |
| products/dada-modular-design.png | 商品页模块化设计说明 |
| lifestyle/dada-desktop.png | 首页桌面场景 |
| lifestyle/dada-bag-charm.png | 首页挂包场景 |
| 带价格的 complete-set 海报、人格与小程序整图 | 保留原始素材，不用静态图代替实时价格、人格选项和可交互小程序 |

这些是提供给课堂项目的 AI 概念效果图，不是量产产品照片或功能实现证明。首页和全站公告均保留概念提示。原始图片文件夹与 PRD 未被修改。

未来换图时，将新文件放入 `dist/assets/` 并改对应配置/引用即可。只能使用团队认可的 Cloud、Sun、Star 外观，不加入兔子。文件名、扩展名与大小写须一致；商品图加载失败会回退到标记清晰的占位。

## 课堂购买演示

1. 首页 Shop Dada → 商品页，保持 **Complete Set**。
2. 选择一个人格和一个外壳，数量 1，Add to bag。
3. 在下方加购区点击 **Add skin · $8.99**，或切换上方 **Extra Skin** 后选款、数量、加入购物车。
4. Bag：一套 + 一个额外外壳小计 **¥458**；额外外壳增加到 2 时小计 **¥517**。总计再加配置中的模拟运费，整张订单只计算一次运费。
5. 相同类别与配置合并数量；完整套装与额外外壳不会误合并。旧版本购物车自动作为完整套装读取。
6. 通过 + / − 修改数量，Remove 删除条目，空购物车显示返回商店入口。
7. Confirm Demo Order → 确认页，展示各商品的类别、配置、数量、单价与订单快照。
8. 订单确认后购物车清空。刷新确认页保留最近一次模拟订单，Back to the little shop 可返回。

网站不收集真实购买者姓名、地址、电话和付款信息，不接支付，不真实发货。

## 小程序概念演示

首页 How It Works 中保留真实 HTML 模拟界面：

- Chat / Feelings / Create / View / Edit / Cancel / Complete 切换语音场景。
- Try a reminder demo：创建 Review my notes / 16:00，直接显示在同一份 Schedule 数据中；同一示例避免重复创建。
- Schedule：添加、编辑、删除、打卡提醒，可设日期、时间及 None / Daily / Weekly 重复概念。
- Settings：修改 Wake-up Name、音量、免打扰、安静时间；唤醒名称同步到语音示例。
- Restore defaults 恢复默认偏好；Delete saved preferences 删除当前浏览器中保存的演示偏好，保留日程。
- Optional memory 明确为未来能力的演示开关，只保存一个本地偏好标记，不保存对话内容。

没有真实录音、语音识别、设备绑定、微信登录或系统通知；日程“同步”只在网页概念演示内发生，不读取 Apple/Google 系统日历。重复提醒在此版本只展示数据，不运行后台定时任务。

## 检查与部署

```sh
node --check dist/config.js
node --check dist/script.js
node checks/cart-checks.cjs
```

验证记录见 QA.md。

Netlify 手动部署上传 `dist` 文件夹即可，或解压本仓库打包的静态文件 后上传。无 Build command；以 dazipet 作为仓库根目录时 Publish directory 为 `dist`。

线上 Sites 沿用原有私有站点。本 GitHub 仓库不包含 Sites 托管身份或访问凭据。

浏览器仅保存课堂购物车、最近订单、示例提醒和偏好，无外部分析或字体依赖。若需重置演示，在 Chrome 该站点设置中清除站点数据。禁用本地存储时页面会提示，请启用后再演示跨页购买。
