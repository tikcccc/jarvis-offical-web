# JarvisDT 內地部署需求單

**用途**：給經理/採購/運維對齊部署資源與前提條件。  
**目標站點**：`https://www.jarvisdt.com/`  
**部署形態**：華為雲 `ECS + Docker`（本期不引入 Redis）  
**流量假設**：峰值同時在線約 100 人，企業展示官網，動態寫入量低。  
**Last Updated**：2026-03-11

---

## 1. 一頁結論（可直接發採購）

1. Web （前端 nextjs）服務器：`2C4G x 1` 
2. CMS  (後端）服務器：`2C4G x 1`  
3. 數據庫：`RDS MySQL 8.0，2C4G，主備 HA，100GB SSD`  
4. 對象存儲：`OBS 標準存儲（內地 Region）`，初始容量建議 `200GB`（視頻+圖片）  
5. CDN：必需（內地加速），域名完成 ICP 後接入  
6. 域名：主站 `www.jarvisdt.com`；CMS 建議獨立子域名（例如 `cms.jarvisdt.com`）

> 說明：本期不做 Redis，Web 生產建議先單實例，避免現有限流邏輯在多實例下不一致。

---

## 2. 資源規格明細（100 并發）

## 2.1 計算資源（ECS）

| 模塊 | 規格 | 數量 | 系統盤 | 其他 |
|---|---|---|---|---|
| Web（Next.js） | 2 vCPU / 4 GB | 1 台 | 80 GB SSD | Docker 運行，對外 80/443 走 ELB/CDN |
| CMS（Strapi） | 2 vCPU / 4 GB | 1 台 | 80 GB SSD | Docker 運行，建議僅內網訪問 1337 |

## 2.2 存儲與數據庫

| 模塊 | 規格 | 建議參數 |
|---|---|---|
| RDS MySQL | MySQL 8.0 主備 HA | 2 vCPU / 4 GB，100 GB SSD，`utf8mb4`，開啟自動備份 |
| CMS 上傳盤 | 掛載到 CMS ECS | 建議 100 GB 起，掛載路徑 `/data/cms/uploads` -> 容器 `/app/public/uploads` |
| OBS（內地） | 標準存儲 | 初始容量 200 GB，作為內地站點視頻/圖片主源 |

## 2.3 網路與入口

| 模塊 | 建議 |
|---|---|
| ELB | 1 個（7層）承接 Web |
| CDN | 內地加速，主域名 `www.jarvisdt.com` 接入 |
| 安全組 | 公網僅放行 Web 入口；CMS 1337 僅允許內網/Web 機訪問；RDS 3306 僅允許 CMS 機訪問 |

---

## 3. OBS / 視頻參數建議（重點）

## 3.1 Bucket 建議

1. 新建內地 Bucket（例如華南/華東，按主要客群選）  
2. 存儲類型：`標準存儲`  
3. 訪問方式：通過 CDN 域名訪問，不直接暴露 Bucket URL  
4. 權限：私有讀，通過 CDN 回源策略控制

## 3.2 容量與帶寬估算（100 并發）

- 若 100 人同時播放 1080p（按 2 Mbps 粗估）：理論峰值約 `200 Mbps` 流量需求。  
- 因此視頻分發能力主要由 **CDN + OBS 回源** 承擔，不應由 ECS 出口帶寬承擔。  
- OBS 容量建議：首期 `200GB`，每月按實際增長擴容。

## 3.3 當前風險與要求

- 現有香港 OBS 鏈接可作海外站使用。  
- 內地正式站應切換到內地 OBS/CDN 源，降低跨境回源時延與不穩定風險。

---

## 4. 環境變量（對 PM/運維必填）

## 4.1 Web（ECS-web）

- `NEXT_PUBLIC_SITE_URL=https://www.jarvisdt.com`
- `STRAPI_URL=http://<cms-private-ip>:1337`
- `NEXT_PUBLIC_STRAPI_URL=https://cms.jarvisdt.com`
- `NEXT_PUBLIC_MEDIA_URL=https://cms.jarvisdt.com`
- `NEXT_PUBLIC_VIDEO_CDN_URL=<內地視頻CDN域名>`
- `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL=<內地特性視頻CDN域名>`

## 4.2 CMS（ECS-cms）

- `DATABASE_CLIENT=mysql`
- `DATABASE_HOST=<rds-private-host>`
- `DATABASE_PORT=3306`
- `DATABASE_NAME=isbim_cms`
- `DATABASE_USERNAME=<db-user>`
- `DATABASE_PASSWORD=<db-password>`
- `DATABASE_SSL=true`

---

## 5. 帳號與權限前提（你可直接回 PM）

若由你方負責部署，華為雲需提供子帳號（IAM）並授權以下最小範圍：

1. ECS（查看/啟停/重啟）  
2. SWR（拉取鏡像）  
3. RDS（查看實例與連接參數）  
4. OBS/CDN（查看與配置對應域名）  
5. ELB/安全組（查看與必要調整）  
6. 雲監控與日誌（查看）

> 建議不要直接共用 root 主帳號，使用專用部署子帳號。

---

## 6. 驗收標準（100 并發）

1. 站點可用：首頁、新聞、案例、招聘頁可正常打開。  
2. CMS 可用：`/admin` 可登錄，內容可發布。  
3. 媒體可用：圖片與視頻可在內地正常加載。  
4. 性能基線：100 并發下無大規模 5xx，P95 響應維持可接受。  
5. 回滾可行：可按鏡像 tag 回退到上一版本。

---

## 7. 備註（本期邊界）

- 本期先不上 Redis。  
- 因現有限流為內存 Map，生產 Web 先單實例。  
- 若後續要升級為多 Web 實例，再追加 Redis 做分布式限流即可。
