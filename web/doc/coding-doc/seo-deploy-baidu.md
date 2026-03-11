# 百度 SEO 部署手冊（生產）

**版本**: v1.0  
**日期**: 2026-03-11  
**適用**: `www.jarvisdt.com`（內地）/ `www.isbim.com.hk`（外網，如需百度收錄）

---

## 1. 目標

- 完成百度搜索資源平台站點驗證
- 完成 sitemap 提交
- 把動態內容納入百度收錄鏈路（普通收錄 API）

---

## 2. 前置條件

1. 內地域名已完成 ICP 備案（若在內地節點提供服務）。  
2. 網站可公開訪問：
   - `/robots.txt`
   - `/sitemap.xml`
3. `NEXT_PUBLIC_SITE_URL` 設為當前部署域名。  
4. CMS -> Webhook -> `/api/revalidate` 可用。

---

## 3. 站點接入步驟

### 3.1 添加站點

- 進入百度搜索資源平台（ziyuan.baidu.com）
- 添加站點資產
- 若你有兩個域名（內地/外網），建議分別添加

### 3.2 驗證站點

可選方式（推薦順序）：

1. HTML 文件驗證（穩定）
2. HTML meta 驗證
3. DNS 驗證

對本項目建議：

- 優先文件驗證（`public/baidu_verify_xxx.html`）
- 次選 meta 驗證（在 metadata `other` 增加 `baidu-site-verification`）

---

## 4. robots 與 sitemap

### 4.1 robots 要求

當前代碼文件：`web/src/app/(website)/robots.ts`

需確認：

- 允許抓取公開頁
- 禁止後台/接口路徑（`/api/`, `/admin/`）
- 包含 sitemap 聲明

### 4.2 sitemap 要求

當前代碼文件：`web/src/app/(website)/sitemap.ts`

需確認：

- 包含靜態頁 + 動態頁（news/case-studies/careers）
- `lastmod` 盡量反映真實更新時間
- 內地和外網域名分環境輸出各自 URL

---

## 5. 動態內容收錄（必做）

### 5.1 發佈後流程

1. Strapi 發佈內容
2. 調用 `POST /api/revalidate`
3. 觸發百度普通收錄 API 提交變更 URL

### 5.2 建議接入點

- 在 `web/src/app/api/revalidate/route.ts` 完成路徑 revalidate 後
- 追加「待提交 URL 列表」推送到百度普通收錄 API

### 5.3 運維注意

- API token 放服務端環境變量（例如 `BAIDU_PUSH_TOKEN`）
- 失敗重試與限流保護
- 記錄提交成功/失敗日誌

---

## 6. 常見風險與修正

1. **有 sitemap，但收錄慢**  
- 檢查是否已做普通收錄 API 主動提交
- 檢查頁面內容質量與重複度

2. **動態頁不收錄**  
- 檢查是否被 robots 阻擋
- 檢查 canonical 是否錯配到其他域名
- 檢查頁面是否能在 SSR 首屏看到核心內容

3. **多域名重複內容**  
- 單主域策略：副域名 301 到主域
- 若雙域都需收錄：兩邊都建站點資產並做好 canonical/hreflang 策略

---

## 7. 上線檢查清單

- [ ] 站點已在百度平台驗證通過
- [ ] `robots.txt` 可訪問且含 sitemap
- [ ] `sitemap.xml` 可訪問且 URL 正確
- [ ] 動態內容發佈可觸發 revalidate
- [ ] 普通收錄 API 提交鏈路可用
- [ ] 內地與外網域名策略已確認（單主域或雙收錄）

---

## 8. 參考

- 百度普通收錄: https://ziyuan.baidu.com/wiki/398
- 百度站點屬性（http/https）: https://ziyuan.baidu.com/wiki/3546

