# isBIM 内地华为云部署要求（服务器/数据库/前提条件）

**文档目的**：明确网站在中国内地华为云落地时，服务器与数据库参数、上线前提条件，以及“当前香港 OBS 视频链接”在内地访问风险。  
**适用范围**：`web`（Next.js 15）+ `cms`（Strapi 5）。  
**内地域名**：`https://www.jarvisdt.com/`  
**Last Updated**：2026-03-11

---

## 1. 当前项目输入（用于参数基线）

- 前端：Next.js 15（Node 运行时）
- CMS：Strapi 5.38（Node 运行时）
- CMS 当前数据库驱动：MySQL（配置支持 mysql/postgres/sqlite，现网以 mysql 为目标）
- 当前视频 CDN 链接（生产模板）指向香港 OBS：
  - `NEXT_PUBLIC_VIDEO_CDN_URL=https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/share/video`
  - `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL=https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/share/isbim-website-assets`

---

## 2. 服务器参数要求

### 2.1 Web（Next.js）服务器要求

| 级别 | 建议规格 | 说明 |
|---|---|---|
| 最低可运行 | 2 vCPU / 4 GB RAM / 50 GB 系统盘 | 仅适合低并发与测试环境 |
| 生产建议 | 4 vCPU / 8 GB RAM / 100 GB 系统盘 | 推荐配 2 实例起步，挂 ELB |
| 高可用建议 | 2+ 实例，跨可用区部署 | 避免单点故障 |

**运行前提**：
- Node.js 建议统一为 `20.x LTS`（兼容 Next.js/Strapi 当前依赖）
- 建议使用容器化部署（CCE/ECS + Docker）
- 实例需具备公网出站能力（访问第三方邮件服务、依赖源等）

### 2.2 CMS（Strapi）服务器要求

| 级别 | 建议规格 | 说明 |
|---|---|---|
| 最低可运行 | 2 vCPU / 4 GB RAM / 80 GB 系统盘 | 仅适合轻量内容管理 |
| 生产建议 | 4 vCPU / 8 GB RAM / 100 GB 系统盘 | 中小型内容团队更稳妥 |
| 高可用建议 | 2 实例 + 会话/状态外置 | 配合负载均衡，避免单点 |

**运行前提**：
- 与 RDS 部署在同一 VPC 内网访问
- 安全组仅放行必要端口（80/443、管理口按需白名单）
- 如采用多实例，限流与缓存状态必须外置（建议 DCS Redis）

### 2.3 小流量部署档位（100 并发）

> 适用场景：企业展示官网、动态内容更新频率低、峰值并发约 100。

| 档位 | Web（Next.js） | CMS（Strapi） | RDS MySQL | Redis（DCS） | 适用说明 |
|---|---|---|---|---|---|
| 经济型（最低成本） | 2C4G x1 | 2C4G x1 | 2C4G（建议 HA） | 可暂不上 | 可运行，但 Web 无高可用，适合预算极紧或短期上线 |
| 平衡型（推荐） | 2C4G x2 + ELB | 2C4G x1 | 2C4G HA | 1GB 可选 | 成本和稳定性平衡，适合长期生产 |
| 预留型（增长准备） | 4C8G x2 + ELB | 2C4G x1 | 4C8G HA | 1GB-2GB | 用于预计流量快速增长或活动期 |

**建议结论**：
- 你的场景优先采用“平衡型（推荐）”。
- 不建议把预算主要加在 CPU/内存上，内地站点优先保证“内地 OBS + 内地 CDN”视频链路。

---

## 3. 数据库要求（华为云 RDS for MySQL）

### 3.1 推荐参数

| 项目 | 推荐值 |
|---|---|
| 引擎 | MySQL 8.0 |
| 架构 | 主备高可用（HA） |
| 起步规格 | 2 vCPU / 4 GB RAM |
| 生产建议 | 4 vCPU / 8 GB RAM（可按监控扩容） |
| 存储 | SSD 云盘，100 GB 起，按增长扩容 |
| 网络 | 与 Web/CMS 同 VPC 内网访问 |
| 字符集 | `utf8mb4` |
| 备份 | 自动备份 + 保留策略（按业务 RPO/RTO 设定） |
| 连接安全 | 开启 SSL（生产建议） |

### 3.2 与现有项目的对应关系

- `cms/config/database.ts` 已支持 `mysql` 并带连接池参数（默认 `min:2 / max:10`）
- 生产环境应将 `DATABASE_HOST` 指向 RDS 内网地址，不再使用本机数据库

---

## 4. 上线前提条件（内地部署必须确认）

### 4.1 域名与备案

- 内地主站域名固定为 `https://www.jarvisdt.com/`，部署环境变量需设置 `NEXT_PUBLIC_SITE_URL=https://www.jarvisdt.com`。
- 若要使用中国大陆加速（CDN 服务范围含“中国大陆”），加速域名必须完成 ICP 备案。
- 内地备案通常要求：
  - 购买中国大陆节点云服务资源（常见要求：资源可用期不少于 3 个月）
  - 网站内容可访问且符合备案规则

### 4.2 网络与访问链路

- 建议内地域名与海外域名分离（内地独立域名/子域名）
- 回源链路优先内地就近，避免关键静态资源跨境回源
- CDN/WAF/ELB 的健康检查、缓存策略、回源 Host 必须统一规划

### 4.3 安全与运维

- 证书：全站 HTTPS，证书按主域/子域规划
- 日志：接入 LTS，关键访问/错误日志可追溯
- 监控：接入 AOM/Cloud Eye，设置 CPU、内存、5xx、慢响应告警
- 备份：数据库自动备份 + 定期恢复演练

---

## 5. 香港 OBS 视频在内地访问风险评估（重点）

**当前事实**：项目生产模板中的视频地址是香港 OBS 域名（`ap-southeast-1`）。

### 5.1 风险判断

1. **跨境链路时延和抖动不可忽略**  
   内地用户访问香港源，首包与视频首帧时间通常更高。

2. **缓存未命中时存在跨境回源不稳定风险**  
   华为云 CDN FAQ 明确提到：当源站在中国大陆境外且缓存过期/未命中时，可能出现回源时延、丢包，严重时会出现用户访问不可达。

3. **内地 CDN 加速需要备案前置**  
   若希望内地加速稳定生效，域名备案是硬性前提之一。

### 5.2 结论

- **不建议**以内地站点直接依赖“仅香港 OBS”作为唯一视频源。
- **建议**将视频主源放到内地 OBS（或内地 CDN 回源内地 OBS），香港 OBS 作为海外域名/兜底源。

---

## 6. 部署前硬性检查清单

- [ ] 内地站点域名已完成 ICP 备案
- [ ] 内地站点 CDN 服务范围已包含中国大陆
- [ ] Web/CMS 已具备双实例与 ELB 规划
- [ ] RDS MySQL 已按 HA 架构开通
- [ ] 视频资源已具备内地 OBS 主源（非仅香港源）
- [ ] 关键环境变量已进入 Secret/配置中心（不在代码库明文）
- [ ] 监控、日志、备份、告警规则已启用

---

## 7. ECS + Docker（不含 Redis）运行约束

- 本期联系表单限流仍使用内存 `Map`，只适用于单个 `web` 实例的一致限流。
- 在未引入 Redis 前，生产建议 `web` 保持单实例；如需扩容到多实例，需先改造限流为共享存储。
- `cms` 图片继续保存在 `public/uploads`，生产必须绑定持久化磁盘目录（如 `/data/cms/uploads`）。
- 不使用 Redis 不影响站点主流程（内容展示、CMS 发布、图片访问），但会限制多实例下的统一限流能力。

---

## 8. 参考资料（华为云官方）

- CDN 服务范围与备案要求：<https://support.huaweicloud.com/usermanual-cdn/cdn_01_0131.html>
- CDN FAQ（境外源站回源风险）：<https://support.huaweicloud.com/cdn_faq/cdn_faq_0040.html>
- 内地备案前提（云服务时长等）：<https://support.huaweicloud.com/bestpractice-icpfiling/icpfiling_09_0027.html>
- OBS 桶区域选择建议：<https://support.huaweicloud.com/bestpractice-obs/obs_05_0015.html>
- RDS for MySQL（能力总览/API 入口）：<https://support.huaweicloud.com/myql-api/rds_mysql_api_00_0001.html>
