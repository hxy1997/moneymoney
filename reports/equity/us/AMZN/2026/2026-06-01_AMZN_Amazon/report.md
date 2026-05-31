# 亚马逊分析及评估报告

**免责声明**  
本报告用于研究归纳，不构成投资建议。关键行情和估值判断截至 **2026-06-01**；财务数据以 Amazon 2025 Annual Report、2026Q1 Earnings Release、SEC XBRL company facts 及公开行情快照为基础。亚马逊为美股公司，非 A 股；本报告沿用 `$a-share-report-analyzer` 三阶段框架，并叠加全球云计算、电商、广告和 AI 基础设施平台行业逻辑。

## 一、准备工作一：估值分位计算

**公司确认**

| 项目 | 内容 |
|---|---|
| 公司 | Amazon.com, Inc. |
| Ticker | AMZN |
| 市场 | NASDAQ，美股 |
| 行业 | Consumer Discretionary / Internet Retail / Cloud Infrastructure |
| 子行业 | 全球云计算、电商平台、广告平台、自研 AI 加速器基础设施 |
| 主要业务 | Online Stores、Third-party Seller Services、Advertising、Subscription Services、AWS、物流和自研芯片 |

**基础估值数据表**

| 指标 | 当前值 | 说明 |
|---|---:|---|
| 股价 | 约 272.29 美元 | 公开行情快照，2026-06-01 附近 |
| 当前市值 M | 约 2.96 万亿美元 | 用 Q1 diluted shares 10.874B 与股价估算 |
| GAAP TTM PE | 约 32.6x | TTM 净利润含 Anthropic 投资公允价值收益 |
| normalized PE | 约 40.0x | 剔除 Q1 2026 Anthropic 税前收益 168 亿美元后的粗略口径 |
| PB | 约 6.7x | 当前市值 / 2026Q1 股东权益 |
| PS TTM | 约 4.0x | 当前市值 / TTM 收入约 7427 亿美元 |
| TTM OCF | 1485 亿美元 | Amazon Q1 2026 |
| TTM FCF | 12 亿美元 | Amazon Q1 2026，受 AI capex 明显压低 |

**5 年和 10 年估值分位表**

| 口径 | 当前 | 近 5 年中枢估计 | 近 10 年中枢估计 | 当前分位判断 | 估值偏离 |
|---|---:|---:|---:|---|---:|
| normalized PE | 约 40.0x | 约 52x | 约 75x | 低于自身历史中枢 | 5 年 -23%，10 年 -47% |
| PS TTM | 约 4.0x | 约 3.1x | 约 3.4x | 高于中枢 | 5 年 +29%，10 年 +18% |
| PB | 约 6.7x | 约 7.6x | 约 9.0x | 低于中枢 | 5 年 -12%，10 年 -26% |
| 综合 dev | - | - | - | 5 年近中性，10 年偏低 | `dev_5y=-2%`，`dev_10y=-18%` |

注：亚马逊 2022 年曾因投资公允价值和消费周期扰动出现亏损，静态 PE 历史分位会失真；本表把 PE、PS、PB 合并看，最终估值更重视 SOTP、normalized earnings 和 AI capex 后的 FCF 复原能力。

**子行业估值锚表版本检查**

| 项目 | 内容 |
|---|---|
| anchor id | `global_cloud_ecommerce_ad_ai_platform` |
| version date | 2026-06-01 |
| freshness status | `ok`，下一次复核日 2026-08-30 |
| primary anchor | SOTP with normalized PE/FCF for cloud, advertising, and retail operating profit |
| secondary anchor | normalized PE、EV/Sales、segment revenue multiple、normalized FCF yield |
| weak / floor anchor | PB 仅作资产负债表 sanity check |
| disabled anchor | 单独静态 GAAP PE、单一零售 PS |
| stale / missing handling | 原技能库无此锚表，已按当前官方资料和市场定价语言补建，置信度 medium |

## 二、准备工作二：利润成长性分析

**近 5 至 6 年财务表，单位：亿美元**

| 年度 | 收入 | YoY | 净利润 | ROE | OCF | FCF | 经营利润 | 备注 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 2020 | 3860.6 | 37.6% | 213.3 | 22.8% | 660.6 | 310 | 229.0 | 疫情电商高增长 |
| 2021 | 4698.2 | 21.7% | 333.6 | 24.1% | 463.3 | -147 | 248.8 | 履约和物流投入高峰 |
| 2022 | 5139.8 | 9.4% | -27.2 | -1.9% | 467.5 | -116 | 122.5 | Rivian 等投资公允价值扰动 |
| 2023 | 5747.9 | 11.8% | 304.3 | 15.1% | 849.5 | 368 | 368.5 | 成本优化、AWS 稳定 |
| 2024 | 6379.6 | 11.0% | 592.5 | 20.7% | 1158.8 | 382 | 685.9 | 广告和 AWS 利润改善 |
| 2025 | 7169.2 | 12.4% | 776.7 | 18.9% | 1395.1 | 110 | 799.8 | AI capex 拉低 FCF |
| TTM 2026Q1 | 7427.3 | - | 908.0 | 约 21% | 1485.3 | 12 | - | Q1 含 Anthropic 税前收益 168 亿美元 |

**CAGR 与六方法利润增长率**

利润序列：`21.331, 33.364, -2.722, 30.425, 59.248, 77.670` 十亿美元。  
脚本：`calc_profit_growth.py`

| 方法 | 结果 |
|---|---:|
| 线性回归增长率法 | 30.68% |
| 中位数增长率法 | 31.09% |
| 指数平滑法 alpha=0.5 | 22.56% |
| 加权移动平均法 | -221.12% |
| Theil-Sen 稳健回归法 | 30.83% |
| 分位数回归法 q=0.4 | -6.33% |

过滤规则：剔除 `abs(x) > 50%`，剔除加权移动平均法 `-221.12%`。  
去极值：有效结果 5 个，去掉最高值 31.09%、最低值 -6.33%。  
去极值后平均 `estimated_avg_profit_growth = 28.02%`。  
利润 CAGR `profit_cagr = 29.49%`。  
`weighted_compound_growth = (29.49% + 28.02%) / 2 = 28.76%`。

判断：这个结果不能机械外推。2022 年亏损和 2026Q1 Anthropic 投资收益会放大利润波动，亚马逊的真实成长锚应从 AWS 增速、广告增速、零售经营杠杆、AI capex 转化和 normalized FCF 恢复来判断。

## 三、业务及产品清晰度

事实：亚马逊 2025 年收入 7169 亿美元，同比增长 12%；分部看，North America 收入约 4260 亿美元，International 收入约 1620 亿美元，AWS 收入约 1290 亿美元。2026Q1，AWS 收入 376 亿美元，同比增长 28%，经营利润 142 亿美元；Advertising services 收入 172 亿美元，同比增长 24%。

判断：业务非常清晰，但不是单一零售商。亚马逊实际是“电商流量与履约网络 + 第三方卖家平台 + 高毛利广告 + AWS 云基础设施 + 自研芯片”的复合平台。行业叠加后，估值不能用传统零售 PS，也不能只用云公司 PE；AWS 和广告应承担主要利润权重，零售和物流承担现金流与流量基础设施权重。

评分：**9.0 / 10**。业务版图复杂，但价值链闭环清楚。

## 四、经营稳定性

事实：2025 年经营利润 800 亿美元，经营利润率 11.2%；2026Q1 经营利润 239 亿美元，高于 2025Q1 的 184 亿美元。North America、International、AWS 三个分部均有经营利润，说明过去几年国际零售拖累明显减轻。

判断：亚马逊经营稳定性较 2021-2022 年显著增强。零售端仍受消费、工资、履约成本和汇率影响；AWS 端则受 AI capex、GPU/Trainium 供给、电力、数据中心利用率和企业云预算影响。当前最大稳定性变量不是需求是否存在，而是资本开支转化为收入和 FCF 的时间。

评分：**8.2 / 10**。

## 五、产品定价权及定价权种类

事实：AWS 2026Q1 收入增速 28%，为 15 个季度以来最快；广告服务收入同比增长 24%。Prime、第三方卖家服务、广告和 AWS 都存在网络效应或迁移成本。

判断：亚马逊的定价权分层明显。AWS 有“算力、数据、生态和迁移成本”定价权；广告有“购买意图流量”定价权；第三方卖家服务有“平台交易和履约基础设施”定价权；一方零售则定价权较弱，更像规模和效率竞争。综合看，它不是零售低毛利企业，而是把低毛利零售作为流量入口，把广告、卖家服务、订阅和云服务变成利润池。

评分：**8.0 / 10**。

## 六、成长分析

事实：2026Q1 亚马逊净销售额 1815 亿美元，同比增长 17%；AWS 增长 28%，广告增长 24%；Q2 2026 指引收入 1940-1990 亿美元，同比增长 16%-19%，经营利润 200-240 亿美元。公司披露芯片业务年化收入 run rate 超过 200 亿美元，包含 Graviton、Trainium 和 Nitro，且同比三位数增长。

判断：未来三年成长由三条线驱动：第一，AWS AI workload 和传统云迁移重新加速；第二，广告变成接近平台税的高毛利业务；第三，零售履约网络和国际业务继续释放经营杠杆。风险也很清楚：TTM FCF 只有 12 亿美元，几乎被 AI 基建投资吃掉；如果 Trainium、GPU 集群和数据中心不能形成足够高的利用率，利润表增长会被现金流质疑。

**Trainium 与 TPU、GPU 相比的优势分析（不少于 500 字）**

Trainium 的核心优势不是“单颗芯片一定全面胜过 GPU 或 TPU”，而是它作为 AWS 自研加速器，嵌入了亚马逊自己的云基础设施、客户关系、定价体系和供应链战略。与 NVIDIA GPU 相比，Trainium 的第一层优势是成本和供给控制。GPU 尤其是高端训练卡在 2024-2026 年长期处于供不应求状态，客户既要承受较高单价，也要面对供给排队和集群部署周期。Trainium 由 AWS 自建、自采、自调度，配合 Nitro、EFA、Neuron SDK、SageMaker、Bedrock 和 UltraCluster，可以在 AWS 内部形成更完整的成本闭环。对 Anthropic、OpenAI、Uber、Meta 这类已经在 AWS 有大量数据、存储、网络和应用的客户来说，Trainium 的意义不是替代所有 GPU，而是在可适配的大模型训练和推理任务上，提供更低 TCO、更短数据路径和更可控的容量。第二层优势是平台绑定。GPU 的强项是 CUDA 生态、通用性和跨云可迁移性；Trainium 的强项则是 AWS 原生集成。一旦客户的数据湖、微服务、向量数据库、Bedrock 调用、S3、EC2、VPC 和安全权限都在 AWS 内部，训练和推理放在 Trainium 上可以减少跨云迁移、网络延迟和数据治理成本。与 Google TPU 相比，Trainium 和 TPU 都属于云厂商自研 AI 加速器，逻辑相似，都是为了降低对 NVIDIA 的依赖、优化单位算力成本、提升自家云平台的毛利率。TPU 的优势在于 Google 长期自用经验、JAX/XLA 生态、Gemini 和搜索/广告内部负载验证；Trainium 的优势在于 AWS 的云客户基数更广、企业 workload 更杂、Bedrock 模型选择更多，并且亚马逊可以把 Trainium 与 Graviton、Nitro、S3、Redshift、OpenSearch、SageMaker 和企业数据栈一起打包销售。换句话说，TPU 更像 Google AI 工厂内部能力的外溢，Trainium 更像 AWS 为企业客户建立的 AI 计算成本控制层。第三层优势是战略议价权。只要 Trainium 能在一部分训练和推理负载上达到足够好的性能/成本比，AWS 就不必完全跟随 NVIDIA GPU 的价格和供货节奏，也能在客户合同里提供更灵活的长期容量承诺。局限也必须承认：GPU 的软件生态最成熟，开发者心智最强；TPU 在 Google 自家模型和垂直优化上很深；Trainium 的挑战是 Neuron 生态、模型适配、开发工具成熟度和第三方框架兼容性。投资结论上，Trainium 的价值不应被理解为“芯片单点胜负”，而应被理解为 AWS 降低 AI capex 单位成本、提高数据中心利用率、保护云毛利率、增强大客户黏性的基础设施杠杆。

成长评分：**8.6 / 10**。增长质量强，但 FCF 转化是硬约束。

## 七、行业竞争度

**同行关键指标对比**

| 公司 | 定位 | 市值 | PE | PS | PB | 核心增量 | 竞争结论 |
|---|---|---:|---:|---:|---:|---|---|
| Amazon | 电商 + AWS + 广告 + Trainium | 约 2.96T | GAAP 约 32.6x / normalized 约 40x | 约 4.0x | 约 6.7x | AWS AI、广告、零售杠杆 | 综合平台最复杂，FCF 压力最大 |
| Microsoft | 企业软件 + Azure + AI 平台 | 约 3.34T | 约 26.8x | 约 10x+ | 约 8.1x | Azure、Copilot、OpenAI 生态 | 利润稳定性和企业软件定价权更强 |
| Alphabet | 搜索广告 + Google Cloud + TPU | 约 4.6T-4.7T | 约 29x | 约 11x | 约 9x | AI 搜索、TPU、Google Cloud | 自研 TPU 与广告现金流强，但搜索重构风险更大 |
| Meta | 社交广告 + AI 推荐 + Llama | 约 1.6T+ | 约 25x | 约 8x | 约 8x | 广告效率、AI 推荐、开源模型 | 广告利润率强，但云基础设施外部收入弱 |
| Walmart | 全球线下/线上零售 | 约 0.8T+ | 约 35x+ | 约 1x | 约 8x-9x | 会员、电商、广告 | 零售可比，但云和 AI 基建属性弱 |

判断：亚马逊的竞争壁垒来自多业务互相供血，而非单一产品。与 Microsoft/Alphabet 相比，亚马逊的软件订阅利润不如微软稳，搜索广告垄断性不如 Google，但它在电商购买意图、物流、第三方卖家、AWS 和自研芯片上形成了少见的复合生态。市场目前给亚马逊的 PS 低于纯软件云公司，但 FCF yield 也最难看，这是 AI capex 周期下的主要分歧。

评分：**8.0 / 10**。

## 八、财务质量分析

**资产质量**：2026Q1 总资产 9166 亿美元，股东权益 4419 亿美元。资产端快速扩张主要来自数据中心、服务器、物流和云基础设施；这类资产如果利用率高，会形成规模壁垒，如果需求错配，则会变成折旧压力。

**利润质量**：2025 净利润 777 亿美元，2026Q1 净利润 303 亿美元，但 Q1 包含 Anthropic 投资税前收益 168 亿美元。剔除此项后，normalized earnings 仍健康，但 GAAP PE 被一次性收益压低。

**现金流质量**：TTM OCF 1485 亿美元，同比增长 30%；但 TTM FCF 降至 12 亿美元，主要因为 AI 基建相关 property and equipment 支出同比大幅增加。现金流不是恶化，而是被投入周期“前置消耗”。

**财务勾稽**：2025 收入增长 12%、经营利润增长 17%，经营杠杆仍在；但 FCF 从 2024 年约 382 亿美元降至 2025 年约 110 亿美元，2026Q1 TTM 又降至 12 亿美元。利润表和现金流表之间的差异，是本轮估值的核心风险点。

财务质量综合评分：**8.4 / 10**。利润质量和 OCF 很强，FCF 处于 AI 投资低谷。

## 九、总评分

| 项目 | 分数 |
|---|---:|
| 业务及产品清晰度 | 9.0 |
| 经营稳定性 | 8.2 |
| 产品定价权 | 8.0 |
| 成长分析 | 8.6 |
| 行业竞争度 | 8.0 |
| 财务质量 | 8.4 |
| 平均分 | 8.37 |
| 质量系数 G | 0.84 |

结论：亚马逊属于 **好公司**。它不是便宜的零售股，也不是单纯的云股；它是一个正在用 AI 基础设施重新扩张资本底座的平台型复合企业。

## 十、企业估值

**未来成长率保守估算**

- 六方法利润成长锚：28.76%，但受 2022 亏损和投资公允价值收益扰动，不能机械外推。
- 采用值：2027-2028 normalized net income 约 1050 亿美元。
- 逻辑：AWS 继续高双位数增长，广告维持 20% 左右增长，零售经营杠杆改善，但 AI capex 抑制短期 FCF。

**主估值方法：SOTP 简化为 normalized PE**

子行业锚表主张用 SOTP，但在公开页面报告中用 normalized PE 简化表达：AWS 和广告给高倍数，零售和物流给低倍数，合并后对 normalized earnings 给约 32x。

`B = 1050 亿美元 * 32 = 3.36 万亿美元`

以 diluted shares 10.874B 估算：

`内在价值价格 = 3.36T / 10.874B = 约 309 美元`

**交叉验证方法：EV/Sales / PS**

TTM 收入约 7427 亿美元。若给合并 PS 4.5x，则市值约 3.34 万亿美元，与主估值接近。PS 的合理性来自 AWS、广告和第三方卖家服务占比提升；但如果市场重新把亚马逊当零售公司估值，4x PS 会显得偏高。

**安全边际估值**

保守场景：normalized net income 870 亿美元、27x PE：

`C = 870 亿美元 * 27 = 2.35 万亿美元`

对应安全价格：

`2.35T / 10.874B = 约 216 美元`

锚表失效条件：AWS 增速连续低于 hyperscaler peers；Trainium 大客户承诺不能转化为利用率和毛利率；AI capex 导致 FCF 长期低于 3%-4% yield；广告增速显著放缓；监管要求拆分 marketplace、广告或云业务。

## 十一、最终结论

**估值结论表**

| 项目 | 数值 |
|---|---:|
| 当前市值 M | 2.961 万亿美元 |
| 内在市值 B | 3.360 万亿美元 |
| 安全市值 C | 2.350 万亿美元 |
| E = (M-B)/B | -11.88% |
| F = (M-C)/C | 26.00% |
| dev_5y | -2.00% |
| dev_10y | -18.00% |
| avg_dev | -1.47% |
| LOW = -0.18/G | -21.43% |
| UP = 0.18*G | 15.12% |
| 公司质量分类 | 好公司 |
| 价格高低分类 | 中价 |
| 模型动作映射 | 持有 |
| 模型推导市值区间 | 2.361-3.460 万亿美元 |
| 模型推导价格区间 | 217.13-318.13 美元 |

核心结论：亚马逊当前不是明显低估，也不是明显高估。它的 PE 相对自身历史并不贵，PS 又已经反映 AWS、广告和 AI 基建溢价；模型把它归为“好公司中价”。如果 Trainium 和 GPU 集群带来的 AI 投资能在 2027 年后转化为 AWS 收入、毛利率和 FCF，当前价格仍有上行空间；如果 FCF 长期被 capex 吃掉，估值会回到安全价附近。

关键风险：AI capex 超前但需求利用率不足；Trainium 软件生态和模型适配不及 NVIDIA CUDA；Google TPU、Microsoft/OpenAI、NVIDIA 云生态竞争；零售工资、物流和关税压力；广告增长放缓；反垄断和平台监管。

**模板合规自检**

已完成三阶段流程；已列示公司识别、5 年和 10 年估值位置、5-6 年财务表、六方法成长率、过滤与去极值、`weighted_compound_growth`、估值锚表状态、六项正文评分、同业比较、主估值和交叉验证、`E/F/avg_dev/LOW/UP`、模型市值与价格区间。  
缺口：历史估值分位因 2022 年亏损和不同数据商口径差异较大，本报告用 PE/PS/PB 综合 dev 替代单一精确分位，置信度中等。

**资料来源**

- [Amazon 2025 Annual Report](https://s2.q4cdn.com/299287126/files/doc_financials/2026/ar/Amazon-2025-Annual-Report.pdf)
- [Amazon Q1 2026 Earnings Release](https://s2.q4cdn.com/299287126/files/doc_earnings/2026/q1/earnings-result/AMZN-Q1-2026-Earnings-Release.pdf)
- [SEC Amazon Company Facts](https://data.sec.gov/api/xbrl/companyfacts/CIK0001018724.json)
- [AWS Trainium Product Page](https://aws.amazon.com/machine-learning/trainium/)
- [AWS Trainium2 Instances](https://aws.amazon.com/ec2/instance-types/trn2/)
- [Google Cloud TPU Overview](https://cloud.google.com/tpu)
- [NVIDIA Blackwell Platform](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)
