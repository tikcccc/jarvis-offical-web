# isBIM 多引擎 SEO 方案（Google + Bing + 百度）

**版本**: v1.0  
**日期**: 2026-03-11  
**適用範圍**: `web` 前端（Next.js App Router）+ Strapi 動態內容

---

## 1. 目標與結論

1. 同步覆蓋 Google / Bing / 百度三個搜索生態。  
2. 把「動態內容 SEO」納入主流程（Newsroom、Case Studies、Careers）。  
3. 形成「可落地」流程：內容發布 -> revalidate -> sitemap/index 提交 -> 收錄監控。

**你問的重點：內地 Bing 和外網 Bing 要分開申請嗎？**

- **不需要分開申請兩個 Bing 站長帳號**（同一個 Microsoft/Bing Webmaster Tools 帳號可管理多站點）。
- **需要按站點（域名/協議）分別添加與驗證**：
  - 若你同時有 `www.jarvisdt.com`（內地）與 `www.isbim.com.hk`（外網），建議在 Bing / Google / 百度都分別建立站點資產。
- 以上對 Bing 的「不分區申請」判斷，屬於根據官方「按 URL 添加站點、單帳號可管理多站」規則的**工程推論**。

---

## 2. 當前 SEO 支持現況（基於現有代碼）

### 2.1 已具備能力

- Metadata 生成器：`web/src/lib/seo.ts`, `web/src/lib/seo-generators.ts`
- 結構化數據：`web/src/components/seo/json-ld.tsx`
- robots：`web/src/app/(website)/robots.ts`
- sitemap（含動態 slug）：`web/src/app/(website)/sitemap.ts`
- 動態頁面 `generateMetadata`：
  - `newsroom/[slug]`
  - `case-studies/[slug]`
  - `careers/[slug]`
- Strapi 內容已支持 SEO 字段：`metaTitle/metaDescription/openGraphImage/keywords`
- 發佈後可 webhook revalidate：`web/src/app/api/revalidate/route.ts`

### 2.2 主要缺口（需要補強）

1. **站長平台驗證碼未落地**：Google/Bing/Baidu verification 還未正式接入。  
2. **JSON-LD 注入策略風險**：目前 `JsonLd` 使用 `next/script` + `afterInteractive`，對弱 JS 爬蟲不夠穩。  
3. **sitemap 精細化不足**：缺少 news/image/video 分 sitemap 與 sitemap index。  
4. **動態更新通知不足**：目前只有 revalidate，尚未串 Bing IndexNow / 百度普通收錄 API。  
5. **lastmod 精準度**：靜態頁在 sitemap 用 `now`，會造成搜尋引擎誤判「每天都更新」。  
6. **雙域名策略未制度化**：內地域名與外網域名在 canonical/hreflang/站長平台層面未形成固定規範。

---

## 3. 雙域名與跨引擎策略（內地 + 外網）

### 3.1 域名策略

- **推薦 A（優先）**：單主域名收錄策略
  - 主域名做 canonical 收錄
  - 另一域名做 301 到主域名
  - 優點：避免重複內容與信號分散

- **推薦 B（業務確需雙域名都收錄）**：雙資產策略
  - 兩個域名都在三大站長平台單獨建資產
  - 各自 sitemap、監控、錯誤排查
  - canonical/hreflang 需嚴格設計，避免相互覆蓋

### 3.2 硬性前提

- 內地域名需 ICP 備案完成（百度收錄和內地加速體驗關鍵）
- 每個域名都要可穩定訪問 `robots.txt` 與 `sitemap.xml`

---

## 4. 動態內容 SEO 方案（核心）

### 4.1 內容模型（Strapi）

每個動態內容（news/case-study/career）至少要求：

- `slug`
- `publishedAt`
- `updatedAt`
- `seo.metaTitle`
- `seo.metaDescription`
- `seo.openGraphImage`
- `seo.keywords`

### 4.2 發佈流程（建議）

1. CMS 發佈內容
2. 觸發 `/api/revalidate`
3. 重新生成頁面與 `sitemap.xml`
4. 同步推送：
   - Bing: IndexNow
   - 百度: 普通收錄 API
5. 監控收錄與抓取錯誤

### 4.3 技術改造要點

- JSON-LD 改為 SSR 直出 `<script type="application/ld+json">`（避免依賴客戶端注入）
- 新增 `sitemap-news.xml`、`sitemap-images.xml`（視內容量再擴展）
- sitemap 靜態頁 `lastmod` 改為「真實更新時間」，不要每次 `now`
- 增加 SEO 監控指標：抓取成功率、索引率、有效頁面數、富結果覆蓋率

---

## 5. 分階段落地

### P0（1 週）

- 完成三大站長平台驗證（Google/Bing/Baidu）
- 提交 sitemap
- 校正 canonical/hreflang
- 建立 SEO 監控面板（至少手工周報）

### P1（1-2 週）

- 串 Bing IndexNow + 百度普通收錄 API
- JSON-LD 改 SSR 注入
- sitemap 分拆（news/image）

### P2（持續）

- 動態頁面模板質量提升（標題、摘要、FAQ/HowTo 等 schema 視頁型引入）
- Core Web Vitals 持續優化
- 外鏈與品牌詞策略

---

## 6. 驗收標準（SEO 層）

1. 三大站長平台均驗證成功。  
2. `robots.txt`、`sitemap.xml` 可抓取且無阻斷。  
3. 動態內容發布後 24 小時內可在站長平台看到抓取/提交記錄。  
4. 重大頁面（首頁、服務頁、動態詳情）均有有效 metadata + schema。  
5. 無大規模 canonical/hreflang 衝突告警。

---

## 7. 外部參考（官方）

- Google Search Console 加入資產: https://support.google.com/webmasters/answer/34592
- Google Domain vs URL-prefix: https://support.google.com/webmasters/answer/9008080
- Google Sitemap 指南: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Bing Webmaster Tools v11（站點管理/能力說明）: https://blogs.bing.com/webmaster/june-2020/Announcing-Bing-Webmaster-Tools-v11
- Bing 抓取與診斷工具: https://blogs.bing.com/webmaster/october-2018/4-ways-to-fetch-as-bingbot
- IndexNow 協議: https://www.indexnow.org/documentation
- 百度搜索資源平台-普通收錄: https://ziyuan.baidu.com/wiki/398
- 百度搜索資源平台-站點屬性說明（http/https）: https://ziyuan.baidu.com/wiki/3546

