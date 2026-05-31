# 诺基亚分析及评估报告

## 免责声明

本报告按 `a-share-report-analyzer` 框架生成，但诺基亚不是 A 股公司。公司识别为 Nokia Oyj，主要上市地 Helsinki `NOKIA.HE`，NYSE ADR `NOK`；行业为通信设备/硬科技，子行业按本次要求确认为“光通信设备/相干光网络/磷化铟 InP 光子集成与数据中心互联”。数据截止日：中国时间 2026-06-01；美股价格采用 2026-05-29 NYSE 收盘。本文仅为研究归纳，不构成投资建议。

## 一、准备工作一：估值分位计算

### 公司识别与行业确认

| 项目 | 内容 |
| --- | --- |
| 公司 | Nokia Oyj / 诺基亚 |
| 代码 | `NOK` / `NOKIA.HE` |
| 市场 | 美股 ADR / 赫尔辛基，非 A 股 |
| 行业 | 通信设备 / 硬科技 |
| 子行业 | 光通信设备、相干光网络、磷化铟 InP 光子集成与数据中心互联 |

事实：Nokia 2025 年净销售额 EUR 19.889bn；Network Infrastructure 收入 EUR 7.986bn，同比增长 23%，其中 Optical Networks 受 AI/Cloud 光互联需求驱动。公司年报提到 Infinera 收购、AI & Cloud 订单超过 EUR 2.4bn、InP photonic integrated circuits、1.2T/1.6T coherent transponders 与 800G coherent pluggables。

判断：诺基亚已不能只按传统电信设备商看，Infinera/InP 使其多了一层“AI 光网络资产”的估值弹性；但集团仍有 Mobile Networks 等成熟/低增长业务，估值应使用 SOTP 或 `EV/Sales + normalized margin bridge`，而不是单一 PE。

### 基础估值数据表

| 项目 | 数值 | 说明 |
| --- | ---:| --- |
| 当前价格 | USD 14.84 | NYSE ADR，2026-05-29 收盘 |
| 市值 M | USD 81.82bn | StockAnalysis/Fiscal.ai |
| PE TTM | 89.15x | 利润受周期、并购、重组影响，参考价值偏弱 |
| PB TTM | 3.34x | 高于近年区间 |
| PS TTM | 3.55x | 当前市场已显著重估 |
| EV/Sales TTM | 3.43x | 本报告主估值锚之一 |
| ROE TTM | 3.70% | 当前盈利质量尚未跟上估值重估 |

### 5 年估值位置

| 指标 | 当前 | 2021-2025 中位数 | 偏离 | 分位判断 |
| --- | ---:| ---:| ---:| --- |
| PE | 89.15x | 18.86x | +373% | 高于近 5 年全部年度点 |
| PB | 3.34x | 1.13x | +194% | 高位 |
| PS | 3.55x | 1.19x | +198% | 高位 |
| EV/Sales | 3.43x | 1.00x | +242% | 高位 |

### 10 年估值位置

公开结构化数据本次只能稳定取到 2021-2026 年口径，10 年分位未完整取得。影响：最终模型中 `dev_10y` 使用保守代理值 `+200%`，估值结论置信度下调一档。

### 子行业估值锚表版本检查

| 项目 | 内容 |
| --- | --- |
| anchor id | `optical_networks_inp` |
| version date | 2026-06-01 |
| freshness status | ok，next review due 2026-09-09 |
| primary anchor | `EV/Sales or PS with normalized margin bridge` |
| secondary anchor | normalized PE / EV-EBIT、peer EV/Sales、SOTP |
| stale/missing handling | 原锚表缺失，已新建并通过 freshness 检查 |

## 二、准备工作二：利润成长性分析

| 年度 | 收入 EURm | 归母/普通股净利 EURm | ROE | 经营现金流 EURm | FCF/自由现金流口径 |
| --- | ---:| ---:| ---:| ---:| --- |
| 2021 | 22,202 | 1,645 | 11.0% | 2,625 | 结构化源约 2,065 |
| 2022 | 23,761 | 4,259 | 21.6% | 1,474 | 结构化源约 873 |
| 2023 | 21,138 | 665 | 3.1% | 1,317 | 年报 EUR 665m |
| 2024 | 19,220 | 1,277 | 8.3% | 2,493 | 年报 EUR 2,021m |
| 2025 | 19,889 | 651 | 3.1% | 2,071 | 年报 EUR 1,465m |
| TTM 2026Q1 | 19,996 | 720 | 3.7% | 1,179 | 结构化源约 743 |

利润 CAGR：`(651 / 1645)^(1/4) - 1 = -20.69%`

| 方法 | 结果 |
| --- | ---:|
| 线性回归增长率法 | -29.25% |
| 中位数增长率法 | +21.50% |
| 指数平滑法 alpha=0.5 | -9.64% |
| 加权移动平均法 | +16.96% |
| Theil-Sen 稳健回归法 | -21.73% |
| 分位数回归法 q=0.4 | -69.31%，因绝对值超过 50% 被过滤 |

过滤规则：剔除 `abs(x) > 50%`。

去极值：有效结果 5 个，剔除最大值 +21.50% 与最小值 -29.25%。

`estimated_avg_profit_growth = -4.80%`；`weighted_compound_growth = -12.74%`。

判断：机械利润增长率对诺基亚不够决策有用，原因是 2022 税项/利润异常、2023-2025 电信资本开支周期、Infinera 并购与重组成本扰动较大。估值阶段不把 `-12.74%` 作为核心锚，而用光网络收入质量与正常化利润率桥接。

## 三、业务及产品清晰度

评分：**8.0/10**

事实：业务包括 Network Infrastructure、Mobile Networks、Cloud and Network Services、Nokia Technologies。InP/PIC、coherent optics、800G pluggables、IP routing、fixed access 与专利授权构成主要资产。

判断：产品线清晰，但集团业务跨度大。光网络/InP 是增量亮点，Mobile Networks 是估值折价来源。

## 四、经营稳定性

评分：**6.0/10**

事实：2021-2025 收入从 EUR 22.2bn 到 EUR 19.9bn，利润波动明显；2025 仍保持净现金与正自由现金流。

判断：专利授权与现金流提供底盘，但通信设备资本开支周期、客户集中、AI 光网络订单节奏会带来较强波动。

## 五、产品定价权及定价权种类

评分：**6.5/10**

事实：Nokia Technologies 专利授权利润率高；Optical Networks 受高速相干光、InP/PIC、DSP 路线图支撑。

判断：专利业务有强定价权，光网络有技术型定价权，但系统设备面对运营商/云厂商采购议价，整体定价权中等偏上。

## 六、成长分析

评分：**7.0/10**

事实：Network Infrastructure 2025 收入 EUR 7.986bn，同比增长 23%；年报披露 AI & Cloud 订单超过 EUR 2.4bn。

判断：成长主要来自 AI 数据中心互联、800G/1.6T 光传输、InP 纵向集成与 Infinera 协同。可重复性取决于 InP 产能爬坡、客户验证、Ciena 等同行竞争，以及 AI capex 是否延续。

## 七、行业竞争度

| 公司 | 市值 USD bn | PE | PB | PS | EV/Sales | ROE | 备注 |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| --- |
| Nokia | 81.82 | 89.2 | 3.34 | 3.55 | 3.43 | 3.7% | 多业务集团，光网络弹性被重估 |
| Ciena | 82.04 | 358.2 | 29.39 | 16.01 | 16.05 | 8.3% | 纯度更高的光网络对标 |
| Ericsson | 43.29 | 16.4 | 3.99 | 1.78 | 1.68 | 23.0% | 更接近传统通信设备估值 |
| Cisco | 474.63 | 40.1 | 9.71 | 7.81 | 8.08 | 25.0% | 网络平台龙头，质量溢价明显 |

评分：**6.0/10**

判断：诺基亚估值低于 Ciena/Cisco 的高纯度/高质量溢价，但明显高于 Ericsson。市场已经把“AI 光网络 + InP”计入不少，竞争结论不是便宜，而是“有产业期权但已重估”。

## 八、财务质量分析

评分：**6.5/10**

事实：2025 股东权益 EUR 20.967bn，股东权益比率 56.0%，净现金与有息金融投资 EUR 3.378bn，经营现金流 EUR 2.071bn，自由现金流 EUR 1.465bn。

判断：资产负债表稳健，现金流好于净利润；但 ROE 与营业利润率偏低，2025 operating profit EUR 885m 对当前市值支撑不足。财务质量是“稳健但盈利效率不足”。

## 九、总评分

| 项目 | 分数 |
| --- | ---:|
| 业务及产品清晰度 | 8.0 |
| 经营稳定性 | 6.0 |
| 定价权 | 6.5 |
| 成长分析 | 7.0 |
| 行业竞争度 | 6.0 |
| 财务质量 | 6.5 |
| 平均分 | 6.67/10 |
| 估值模型质量系数 G | 0.72 |

## 十、企业估值

未来成长率保守估算：机械利润成长 `weighted_compound_growth = -12.74%`，但本行业锚表将机械利润 CAGR 降权。本报告采用收入与正常化利润率桥接：TTM 收入约 USD 23.1bn，合理 PS/EV-Sales 区间约 `2.2x-2.8x`，光网络/InP 放量成功时可上移，Mobile Networks 拖累时下移。

主估值方法：EV/Sales / PS + normalized margin bridge。

保守内在市值 `B = USD 65.0bn`，约等于 2.8x TTM 销售额附近，并隐含光网络溢价但不给 Ciena 纯光网络估值。

安全边际市值 `C = USD 50.0bn`，约等于 2.2x TTM 销售额附近。

交叉验证：normalized PE / EV-EBIT。若正常化净利 USD 1.8-2.2bn，对应 25-30x PE，估值约 USD 45-66bn，与主方法的 USD 50-65bn 区间基本吻合。当前 USD 81.82bn 需要更高的光网络增长和利润率兑现。

## 十一、最终结论

| 项目 | 数值 |
| --- | ---:|
| 当前市值 M | USD 81.82bn |
| 内在市值 B | USD 65.00bn |
| 安全市值 C | USD 50.00bn |
| E = (M-B)/B | +25.88% |
| F = (M-C)/C | +63.64% |
| dev_5y | +210% |
| dev_10y | +200%，代理值，因完整 10 年数据缺失 |
| avg_dev | +124.88% |
| LOW | -25.00% |
| UP | +12.96% |
| 公司质量分类 | 中公司 |
| 价格分类 | 高价 |
| 模型动作映射 | 减持 |

模型推导的估值带：基础内在/安全市值区间为 **USD 50.0-65.0bn**，对应 ADR 约 **USD 9.07-11.79**。按框架 `LOW/UP` 机械价格带，回到“中价”区域约需 **USD 4.95-7.45**；该机械带较严苛，主要因为当前估值相对 5 年历史已大幅上移。

核心依据：诺基亚的 Infinera/InP/相干光业务确实改变了叙事，AI 光互联可能提升长期收入质量；但当前市值已提前反映较多乐观预期，而 ROE、利润率和集团业务结构还没有完全匹配。

关键风险：AI capex 放缓、800G/1.6T 光模块供需反转、InP 产能/良率不及预期、云客户议价压缩毛利、Mobile Networks 继续拖累、并购整合费用高于预期、10 年估值数据缺失导致历史分位置信度下降。

## 模板合规自检

已完成三阶段：准备数据、正文分析、估值结论。已包含公司识别、5 年估值表、10 年缺失影响、5-6 年财务表、六方法成长表、过滤/去极值/`weighted_compound_growth`、估值锚版本、六大正文评分、同行表、主估值与交叉验证、`E/F/avg_dev/LOW/UP`、市值与价格区间、核心证据和风险。子代理研究未调用，原因是当前工具规则只允许用户明确要求子代理时使用；行业叠加已在本线程本地完成。

主要来源：[Nokia Annual Report](https://www.nokia.com/about-us/investors/results-reports/annual-report/)、[Nokia Q4 2025 / FY2025 report](https://www.nokia.com/newsroom/nokia-corporation-financial-report-for-q4-2025-and-full-year-2025/)、[Nokia Q1 2026 interim report](https://www.nokia.com/newsroom/nokia-corporation-interim-report-for-q1-2026/)、[StockAnalysis NOK ratios](https://stockanalysis.com/stocks/nok/financials/ratios/)、[StockAnalysis NOK financials](https://stockanalysis.com/stocks/nok/financials/)。
