# isBIM 内地华为云部署方案（服务器+数据库均使用华为云）

**文档目的**：给出可执行的华为云落地方案，覆盖计算、数据库、媒体、网络安全、迁移与切换。  
**适用范围**：`web`（Next.js）+ `cms`（Strapi）  
**内地域名**：`https://www.jarvisdt.com/`  
**Last Updated**：2026-03-11

---

## 1. 推荐目标架构（内地生产）

### 1.1 方案总览

- 入口层：华为云 DNS + WAF + CDN（中国大陆服务范围）
- 计算层：CCE（优先）或 ECS（备选）运行 Web 与 CMS
- 负载层：ELB 对外承载 Web/CMS
- 数据层：RDS for MySQL（主备 HA）
- 媒体层：OBS（内地桶为主），香港 OBS 保留给海外域名
- 缓存层：DCS Redis（限流/会话/可选缓存）
- 运维层：LTS（日志）+ AOM/Cloud Eye（监控告警）

### 1.2 双域名策略（推荐）

- 海外主域：继续走香港链路（保留现有香港 OBS 视频路径）
- 内地域名（已备案）：走内地 CDN + 内地 OBS 回源

这样可避免内地站点在视频请求上强依赖跨境链路。

---

## 2. 资源选型与参数（建议）

### 2.1 计算资源

| 组件 | 推荐部署 | 起步规格 |
|---|---|---|
| Web（Next.js） | CCE Deployment（2 副本）或 ECS x2 | 单实例 4 vCPU / 8 GB |
| CMS（Strapi） | CCE Deployment（2 副本）或 ECS x2 | 单实例 4 vCPU / 8 GB |
| 网关 | 公网 ELB（可跨可用区） | 按并发与带宽选型 |

### 2.2 数据库资源

| 组件 | 推荐部署 | 起步规格 |
|---|---|---|
| RDS MySQL | 主备 HA | 4 vCPU / 8 GB，100 GB SSD 起 |
| Redis（DCS） | 主备（按预算） | 1 GB 起，按限流规模扩容 |

### 2.3 小流量部署档位（100 并发）

**目标**：满足“企业展示站 + 动态数据少 + 峰值并发约 100”的稳定生产，不做过度配置。

| 组件 | 精简推荐规格 | 备注 |
|---|---|---|
| Web（Next.js） | 2C4G x2 + ELB | 保留高可用，成本可控 |
| CMS（Strapi） | 2C4G x1 | 内容发布频率低时足够 |
| RDS MySQL | 2C4G HA，100GB SSD | 优先保障数据可用性 |
| Redis（DCS） | 初期可选 1GB | Web 若保持单实例可先不上；多实例建议开启 |

**实施建议**：
1. 首发采用上述精简规格上线。  
2. 连续 7-14 天监控 CPU/内存/响应时间后再决定是否扩容。  
3. 优先优化视频链路（内地 OBS + 内地 CDN），再考虑提高算力规格。  

**升级触发阈值（建议）**：
- Web 平均 CPU 持续 > 60%（高峰时段）且 P95 响应时间上升明显。  
- CMS 发布窗口频繁出现后台慢响应。  
- RDS 连接数或 IOPS 长时间接近规格上限。  

---

## 3. 媒体与视频方案（核心）

### 3.1 目标状态

- 内地站点视频主源：内地 OBS Bucket（例如华北/华东/华南，按用户分布选）
- 海外站点视频主源：香港 OBS Bucket
- CDN：
  - 内地域名 -> 内地 CDN -> 内地 OBS
  - 海外域名 -> 海外 CDN（或全球）-> 香港 OBS

### 3.2 配置原则

- 内地部署的 `NEXT_PUBLIC_VIDEO_CDN_URL` 指向内地视频域名
- `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL` 同理指向内地特性视频域名
- 视频回源优先同区域，减少跨境回源

### 3.3 数据存储职责

- 视频/图片文件：OBS
- 业务数据与媒体元数据（如 Strapi 文件记录、内容关系）：RDS MySQL

---

## 4. 部署实施步骤（可执行）

### 4.1 阶段 A：前置准备

1. 完成内地域名 ICP 备案  
2. 申请并下发 HTTPS 证书  
3. 开通 VPC、子网、安全组、ELB、RDS、OBS、CDN、WAF、LTS/AOM

### 4.2 阶段 B：应用镜像与运行环境

1. 为 `web`、`cms` 分别准备 Docker 镜像  
2. 推送镜像到 SWR  
3. 在 CCE（优先）或 ECS 部署 Web/CMS 服务

### 4.3 阶段 C：数据库与配置接入

1. 创建 RDS MySQL（HA）并设置白名单/安全组  
2. 迁移数据库到 RDS（停写窗口内全量 + 必要增量）  
3. 更新 CMS 环境变量：`DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD`  
4. 打开数据库 SSL（生产建议）

### 4.4 阶段 D：媒体迁移与 CDN 切换

1. 将香港 OBS 视频同步到内地 OBS（首批全量）  
2. 为内地媒体域名配置 CDN 与缓存策略  
3. 更新 `web` 环境变量中的视频 CDN 地址为内地地址  
4. 执行灰度验证（先测试域名，再全量切流）

### 4.5 阶段 E：上线与验收

1. 切换内地域名解析到新链路  
2. 监控 24-72 小时（5xx、首帧时间、错误日志）  
3. 验收通过后固化为正式生产

---

## 5. 关键环境变量清单（上线必须）

### 5.1 Web 侧

- `NEXT_PUBLIC_SITE_URL`（固定为 `https://www.jarvisdt.com`）
- `NEXT_PUBLIC_VIDEO_CDN_URL`（内地视频 CDN 域名）
- `NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL`（内地特性视频 CDN 域名）
- `STRAPI_URL`（内网可达的 CMS 地址）
- `NEXT_PUBLIC_STRAPI_URL`（前端访问 CMS 公网域名，建议 `https://cms.jarvisdt.com`）
- `STRAPI_API_TOKEN`
- `STRAPI_WEBHOOK_SECRET`
- 邮件相关：`RESEND_API_KEY` / `BREVO_API_KEY` / `EMAIL_PROVIDER` / `CONTACT_EMAIL_TO`

### 5.2 CMS 侧

- `DATABASE_CLIENT=mysql`
- `DATABASE_HOST=<RDS内网地址>`
- `DATABASE_PORT=3306`
- `DATABASE_NAME=<业务库名>`
- `DATABASE_USERNAME=<数据库用户>`
- `DATABASE_PASSWORD=<数据库密码>`
- `DATABASE_SSL=true`（生产建议）
- Strapi 密钥类：`APP_KEYS`、`API_TOKEN_SALT`、`ADMIN_JWT_SECRET`、`TRANSFER_TOKEN_SALT`、`JWT_SECRET`、`ENCRYPTION_KEY`

---

## 6. ECS + Docker（不含 Redis）执行手册

### 6.1 本地全栈测试

```bash
# repo root
docker compose -f deploy/docker/docker-compose.local.yml up --build
```

- Web: `http://localhost:3000`
- CMS Admin: `http://localhost:1337/admin`
- 首次启动后请在 Strapi 后台确认内容权限，若接口非公开需在启动前提供 `WEB_STRAPI_API_TOKEN`。

### 6.2 镜像构建与推送（SWR）

```bash
# web
docker build -t swr.<region>.myhuaweicloud.com/<org>/isbim-web:<tag> ./web
docker push swr.<region>.myhuaweicloud.com/<org>/isbim-web:<tag>

# cms
docker build -t swr.<region>.myhuaweicloud.com/<org>/isbim-cms:<tag> ./cms
docker push swr.<region>.myhuaweicloud.com/<org>/isbim-cms:<tag>
```

### 6.3 ECS 分离部署（web/cms）

```bash
# ECS-cms
cd deploy/ecs/cms
cp .env.example .env
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# ECS-web
cd deploy/ecs/web
cp .env.example .env
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

部署约束（本期）：
- 不引入 Redis 时，`web` 生产维持单实例。
- `cms` 必须挂载 `/data/cms/uploads:/app/public/uploads` 持久化目录。

### 6.4 回滚（镜像 tag 回退）

```bash
# 在对应 ECS 的 .env 中将 WEB_IMAGE / CMS_IMAGE 改回旧 tag
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## 7. 验收标准（建议）

- 可用性：上线后一周内核心页面可用率 >= 99.9%
- 性能：内地首屏/首帧显著优于跨境直连基线
- 数据：RDS 连接稳定，无明显连接池耗尽
- 安全：全站 HTTPS、WAF 生效、关键端口最小暴露
- 可观测：日志可检索、告警可触达、故障可追溯

---

## 8. 回滚策略

1. 维持原香港站链路可随时恢复  
2. 新链路异常时，DNS/CDN 回切到旧域名策略  
3. 数据库按变更窗口保留回滚点（备份快照）  
4. 媒体域名先灰度再全量，避免一次性不可逆切换

---

## 9. 官方文档参考（华为云）

- CDN 服务范围与备案要求：<https://support.huaweicloud.com/usermanual-cdn/cdn_01_0131.html>
- CDN FAQ（境外源站缓存未命中回源风险）：<https://support.huaweicloud.com/cdn_faq/cdn_faq_0040.html>
- 备案前提最佳实践：<https://support.huaweicloud.com/bestpractice-icpfiling/icpfiling_09_0027.html>
- OBS 区域选型建议：<https://support.huaweicloud.com/bestpractice-obs/obs_05_0015.html>
- CCE Ingress/ELB 路由：<https://support.huaweicloud.com/usermanual-cce/cce_10_0698.html>
- VPC 安全组规则说明：<https://support.huaweicloud.com/usermanual-vpc/vpc_sg_0103.html>
