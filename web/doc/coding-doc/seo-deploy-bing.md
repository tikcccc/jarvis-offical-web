# Bing SEO 部署手冊（生產）

**版本**: v1.0  
**日期**: 2026-03-11

---

## 1. 你問的問題：內地 Bing 與外網 Bing 要分開申請嗎？

- **帳號層面：不用分開申請**。同一 Bing Webmaster Tools 帳號可管理多站點。  
- **站點資產層面：要按域名/協議分開添加**。  
  - 例：`https://www.jarvisdt.com` 與 `https://www.isbim.com.hk` 應各自添加與驗證。

說明：Bing 官方對外文檔重點是「按站點 URL 添加」，並支持單帳號管理多站；因此對「內地/外網是否要分開」的結論是工程推論，而非地區帳號硬隔離。

---

## 2. 前置條件

1. 站點可訪問：`/robots.txt`、`/sitemap.xml`。  
2. 生產環境 `NEXT_PUBLIC_SITE_URL` 指向當前域名。  
3. 動態內容路由可 SSR 輸出 metadata。

---

## 3. 部署步驟

### 3.1 添加與驗證站點

- 在 Bing Webmaster Tools 添加站點 URL
- 推薦 DNS 驗證（或 XML/Meta 驗證）
- 內地與外網雙域名場景：兩個站點都驗證

### 3.2 提交 sitemap

- 在 Bing Webmaster Tools 提交：
  - `https://<domain>/sitemap.xml`
- 若後續做 sitemap index，改提交 `sitemap-index.xml`

### 3.3 開啟 IndexNow（建議 P0）

- 作用：內容更新後快速通知 Bing 抓取
- 做法：
  - 配置 IndexNow key（文件或 API）
  - 在內容發佈流程推送變更 URL
- 接入點：`web/src/app/api/revalidate/route.ts`

---

## 4. 動態內容 SEO（Bing）

### 4.1 現有基礎

- News/Case/Career 詳情頁已 `generateMetadata`
- 已生成 canonical/hreflang
- sitemap 已包含動態 slug

### 4.2 補強建議

1. JSON-LD 改 SSR 注入，降低對 JS 執行依賴。  
2. 發佈後同步 IndexNow 推送 URL。  
3. sitemap 靜態頁 `lastmod` 改成真實變更時間。  
4. 針對新聞頁可新增 news sitemap（可選）。

---

## 5. 監控與驗收

- 監控：
  - Crawl errors
  - Indexed pages
  - URL inspection 狀態
  - robots/sitemap 讀取成功率

- 驗收清單：
  - [ ] 站點驗證成功
  - [ ] sitemap 提交成功
  - [ ] IndexNow 成功推送（抽樣 URL）
  - [ ] 動態內容更新後可在 Bing 工具看到抓取記錄

---

## 6. 參考

- Bing Webmaster Tools v11: https://blogs.bing.com/webmaster/june-2020/Announcing-Bing-Webmaster-Tools-v11
- Bing 抓取診斷工具: https://blogs.bing.com/webmaster/october-2018/4-ways-to-fetch-as-bingbot
- Bing Geo-targeting（可選）: https://blogs.bing.com/webmaster/march-2019/Geo-targeting-comes-to-Bing-Webmaster-Tools
- IndexNow 文檔: https://www.indexnow.org/documentation

