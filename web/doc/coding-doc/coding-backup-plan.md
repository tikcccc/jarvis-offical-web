# isBIM 官网备份方案 (Backup Plan)

**文件说明:** 本文件记录 isBIM 官网关键技术模块的备份方案和替代选项。当主要技术服务出现问题时,可快速切换到备份方案,确保业务连续性。

**备份原则:**
- 🔄 每个关键服务都应有至少一个备份方案
- 📋 记录迁移步骤和预估工作量
- 💰 对比成本差异
- ⚡ 优先选择迁移难度低、功能相近的替代方案

**最后更新:** 2025-11-29

---

## 📧 邮件服务备份方案

### 当前方案: Resend

**使用场景:** 联系表单邮件发送 (内部通知 + 用户确认)

**优点:**
- 现代化 API 设计,开发体验好
- 免费额度充足 (3,000 封/月)
- 文档清晰,TypeScript SDK 完善
- 域名验证流程简单
- 邮件送达率高

**缺点:**
- 免费额度有限 (超过 3,000 封/月需付费)
- 仅支持发送邮件 (无接收功能)
- 国际服务,可能受网络限制影响

---

### 备份方案 1: Brevo (原 Sendinblue) ✅ 已实现

**状态:** 已完成双提供商系统实现 (v4.1, 2025-11-29)

#### 当前实现方式

**架构:** 统一邮件客户端 (`lib/email/email-client.ts`) + 手动环境变量切换

```typescript
// 通过 EMAIL_PROVIDER 环境变量控制
EMAIL_PROVIDER=resend  // 默认使用 Resend
EMAIL_PROVIDER=brevo   // 切换到 Brevo
```

**优点:**
- ✅ 实现简单,无需额外依赖
- ✅ 代码零侵入 (Server Action 无需修改)
- ✅ 适合 localhost 开发环境
- ✅ 两个提供商都已集成,随时可切换

**缺点:**
- ❌ 需要手动修改环境变量并重启服务
- ❌ 无法自动检测额度不足并切换
- ❌ 无法实时监控发送状态

#### 功能对比

| 功能 | Resend | Brevo |
|------|--------|-------|
| 免费额度 | 3,000 封/月 | 300 封/天 (9,000 封/月) |
| 域名验证 | **生产环境必须** (SPF + DKIM + DMARC) | **可选但推荐** (SPF + DKIM + DMARC) |
| 邮件模板 | HTML + React (React Email) | HTML + 可视化编辑器 |
| API 风格 | RESTful (现代) | RESTful (传统) |
| 送达率 | 高 | 高 |
| 附加功能 | 无 | SMS, WhatsApp, 营销自动化 |
| TypeScript SDK | 官方 SDK | 官方 SDK (@getbrevo/brevo) |
| 文档质量 | 优秀 | 良好 |

#### 成本对比

**Resend:**
- 免费: 3,000 封/月
- 付费: $20/月 (50,000 封)
- 超额: $1/1,000 封

**Brevo:**
- 免费: 300 封/天 (9,000 封/月)
- 付费: $25/月 (20,000 封)
- 超额: $1/1,000 封

**结论:** 如果月发送量 < 3,000 封,Resend 更优。如果月发送量 3,000-9,000 封,Brevo 免费额度更大。

#### 当前切换步骤 (已实现双提供商)

**步骤 1: 修改环境变量** (1 分钟)
```bash
# .env.local 或 Vercel 环境变量
EMAIL_PROVIDER=brevo  # 从 resend 切换到 brevo
```

**步骤 2: 重启服务**
```bash
npm run dev  # 开发环境
# 或在 Vercel 重新部署 (生产环境)
```

**步骤 3: 验证发件人邮箱 (Brevo 必须)**

⚠️ **重要**: Brevo 要求至少验证一个发件人邮箱才能发送邮件,否则会返回 **403 Forbidden** 错误。

**方式 A: 单个邮箱验证** (快速,适合测试)
1. 访问 https://app.brevo.com/senders
2. 点击 "Add a new sender"
3. 输入邮箱地址 (如 `noreply@isbim.com.hk` 或个人 Gmail)
4. 输入发件人名称 (如 "isBIM Contact Form")
5. Brevo 会发送验证邮件到该地址
6. 点击邮件中的验证链接完成验证
7. 验证后立即可用

**方式 B: 域名验证** (推荐,适合生产环境)
1. 访问 https://app.brevo.com/senders/domain/list
2. 添加域名 `isbim.com.hk`
3. 配置 DNS 记录:
   - SPF 记录: `v=spf1 include:spf.brevo.com ~all`
   - DKIM 记录: (Brevo 控制台提供)
4. 等待验证通过 (域名下所有邮箱都可用)

**开发环境建议:**
- 使用个人 Gmail 作为发件人,快速验证即可测试
- 修改 `.env.local` 中的 `EMAIL_FROM_INTERNAL` 和 `EMAIL_FROM_USER` 为验证的邮箱
- 生产环境再配置企业域名验证

**步骤 4: 测试发送**
1. 提交测试表单
2. 检查控制台日志确认使用 Brevo: `✅ Emails sent successfully via brevo`
3. 验证邮件送达

#### 历史方案: 自动降级切换 (未实现)

**背景:** 之前讨论过实现自动检测 Resend 额度不足并切换到 Brevo 的方案,但最终决定不实现。

**方案 A: 额度监控 + 自动切换**
```typescript
// 伪代码 - 未实现
async function sendEmailWithFallback(params: EmailParams) {
  // 1. 检查 Resend 剩余额度
  const resendQuota = await checkResendQuota();

  // 2. 如果额度不足,自动切换到 Brevo
  if (resendQuota < 100) {
    return await sendViaBrevo(params);
  }

  // 3. 尝试 Resend,失败则降级到 Brevo
  try {
    return await sendViaResend(params);
  } catch (error) {
    if (error.code === 'quota_exceeded') {
      return await sendViaBrevo(params);
    }
    throw error;
  }
}
```

**未实现原因:**
1. ❌ **复杂性高**: 需要持久化额度信息 (Redis/数据库)
2. ❌ **纯前端项目**: 无后端数据库,无法可靠存储额度状态
3. ❌ **Serverless 不兼容**: 多实例环境下无法共享内存状态
4. ❌ **额度 API 限制**: Resend/Brevo 都没有提供实时额度查询 API
5. ✅ **手动切换足够**: 对于低流量网站,手动监控和切换即可

**方案 B: 实时重试降级**
```typescript
// 伪代码 - 未实现
async function sendWithRetry(params: EmailParams) {
  try {
    return await resend.send(params);
  } catch (error) {
    // 如果是额度错误,自动重试 Brevo
    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.warn('Resend quota exceeded, falling back to Brevo');
      return await brevo.send(params);
    }
    throw error;
  }
}
```

**未实现原因:**
1. ❌ **用户体验差**: 邮件可能从不同域名发送,影响品牌一致性
2. ❌ **额度浪费**: 可能导致两个提供商都被消耗额度
3. ❌ **无法预测**: 无法提前知道哪个提供商会被使用

**当前方案优势:**
- ✅ **简单可靠**: 环境变量切换,无状态管理
- ✅ **可控性强**: 明确知道使用哪个提供商
- ✅ **适合现状**: 月发送量远低于 3000 封,手动监控即可
- ✅ **易于调试**: 日志清晰显示使用的提供商

#### 何时切换到 Brevo?

**建议切换的情况:**
- ✅ 月发送量持续超过 3,000 封 (Brevo 有 9,000 封/月)
- ✅ 需要 SMS 或 WhatsApp 功能
- ✅ 需要营销自动化功能
- ✅ 需要可视化邮件模板编辑器
- ✅ Resend 服务临时故障

**继续使用 Resend 的情况:**
- ✅ 月发送量 < 3,000 封 (Resend 免费额度足够)
- ✅ 重视开发体验 (Resend API 更现代)
- ✅ 项目使用 React Email 组件 (Resend 原生支持)

**切换操作:** 只需修改 `EMAIL_PROVIDER=brevo` 并重启服务,1 分钟完成。

---

### 备份方案 2: AWS SES (Simple Email Service)

#### 优点
- 成本极低 ($0.10/1,000 封)
- 高可靠性 (AWS 基础设施)
- 无月发送量限制
- 与 AWS 生态集成好

#### 缺点
- 初期需要申请退出沙箱模式 (24-48 小时审核)
- 配置复杂 (IAM, SES, SMTP)
- 无邮件模板可视化编辑器
- SDK 相对臃肿 (AWS SDK)

#### 迁移难度
**工作量:** 8-12 小时
**难度等级:** ⭐⭐⭐ (中高) - 需要配置 AWS 账号和 IAM 权限

#### 何时考虑?
- 月发送量 > 50,000 封 (成本优势明显)
- 已使用 AWS 生态 (Lambda, S3, CloudFront)
- 需要极高的可靠性和扩展性

---

### 备份方案 3: Postmark

#### 优点
- 专注于事务性邮件 (不支持营销邮件)
- 送达率极高
- 详细的邮件追踪和分析
- 优秀的开发体验

#### 缺点
- 无免费额度 (最低 $15/月 起步)
- 价格较高

#### 迁移难度
**工作量:** 4-6 小时
**难度等级:** ⭐⭐ (中低) - API 与 Resend 相似

#### 何时考虑?
- 对送达率要求极高
- 需要详细的邮件追踪分析
- 预算充足

---

## 推荐决策树

```
月发送量 < 3,000 封?
├─ 是 → 继续使用 Resend (免费额度足够)
└─ 否 → 月发送量 < 9,000 封?
    ├─ 是 → 迁移到 Brevo (免费额度更大)
    └─ 否 → 月发送量 > 50,000 封?
        ├─ 是 → 迁移到 AWS SES (成本最低)
        └─ 否 → 根据预算和功能需求选择 Brevo/Postmark
```

---

## 🗄️ 其他模块备份方案

### CMS 备份方案 (Sanity 替代)

_(待补充)_

可选方案: Strapi, Contentful, Payload CMS

---

### CDN 备份方案 (华为云 OBS 替代)

_(待补充)_

可选方案: AWS S3 + CloudFront, Cloudflare R2, 阿里云 OSS

---

### 部署平台备份方案 (Vercel 替代)

_(待补充)_

可选方案: Netlify, AWS Amplify, Cloudflare Pages

---

## 📝 使用指南

**添加新备份方案时:**
1. 记录当前方案的优缺点
2. 列出至少 2-3 个备份选项
3. 对比功能、成本、迁移难度
4. 提供详细的迁移步骤
5. 说明何时应该考虑迁移

**评估备份方案时:**
- 迁移难度: ⭐ (简单 1-2 小时) 到 ⭐⭐⭐⭐⭐ (复杂 > 40 小时)
- 成本对比: 列出免费额度和付费价格
- 功能差异: 关键功能是否支持
- 业务影响: 停机时间、数据迁移等
