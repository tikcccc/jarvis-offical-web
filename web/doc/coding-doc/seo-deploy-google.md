# Google SEO 部署手冊（生產）

**版本**: v1.0  
**日期**: 2026-03-11

---

## 1. 目標

- 完成 Google Search Console（GSC）資產驗證
- 提交 sitemap 並建立可持續監控
- 讓動態內容（news/case/career）能穩定被抓取與收錄

---

## 2. 資產策略（重要）

Google Search Console 有兩種資產：

1. Domain property（推薦）
- 覆蓋所有子域與協議
- 需要 DNS 驗證

2. URL-prefix property
- 僅覆蓋指定前綴
- 可用 HTML/DNS/Meta 等方式驗證

如果你同時有內地與外網兩個不同主域名，建議各建一個 Domain property。

---

## 3. 部署步驟

### 3.1 驗證站點

- 進入 GSC，新增 Domain property（優先）
- 完成 DNS TXT 驗證
- 若 DNS 不便，可使用 URL-prefix + HTML file/meta

### 3.2 提交 sitemap

- 在 GSC 提交：`https://<domain>/sitemap.xml`
- 若有 sitemap index，提交 index 即可

### 3.3 核查 robots 與可抓取性

- 確認 `robots.txt` 未誤阻擋內容頁
- 確認關鍵頁可被 Googlebot 正常請求

---

## 4. 動態內容 SEO（Google）

### 4.1 現有基礎

- 詳情頁 `generateMetadata` 已存在
- 已有 canonical/hreflang
- 已有 Article/NewsArticle/JobPosting 等結構化數據

### 4.2 補強建議

1. JSON-LD 改 SSR 直出，避免依賴 afterInteractive。  
2. sitemap `lastmod` 以 Strapi `updatedAt` 為準。  
3. 動態頁增加內鏈與相關內容，提升抓取深度。  
4. 針對內容型頁面補充 Rich Results 可用 schema（按頁型）。

---

## 5. 性能與收錄質量

Google 對體驗指標較敏感，需持續跟進：

- Core Web Vitals（LCP/INP/CLS）
- 行動端可用性
- 服務端首屏輸出完整內容（避免純客戶端 SEO）

---

## 6. 上線驗收清單

- [ ] GSC 資產已驗證
- [ ] sitemap 已提交並可讀取
- [ ] 關鍵頁 URL Inspection 無阻斷
- [ ] 動態內容發佈後可被抓取（抽樣）
- [ ] 結構化數據無重大錯誤

---

## 7. 參考

- Add a property: https://support.google.com/webmasters/answer/34592
- Domain vs URL-prefix: https://support.google.com/webmasters/answer/9008080
- Build and submit sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Structured data basics: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

