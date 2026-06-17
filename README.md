# University Physics A1 -- 期末复习题库

> Based on PPTs from DGUT (lecturer: Marlon Zeng), combined with external resources from multiple universities.
> Course textbook: *University Physics with Modern Physics* (Young & Freedman, 13th Ed)

## 目录结构

```
题库/
├── README.md                      ← 本文件（总索引）
├── 习题集/                         ← 精编习题 Markdown（可直接打印）
│   ├── Chapter 1 Force and Motion 力和运动 习题.md
│   ├── Chapter 2 Particle Dynamics 质点动力学 习题.md
│   ├── Chapter 3 Rotation of Rigid Body 刚体转动 习题.md
│   ├── Chapter 4 Special Relativity 狭义相对论 习题.md
│   ├── Chapter 5 Mechanical Vibration 机械振动 习题.md
│   ├── Chapter 6 Mechanical Wave 机械波 习题.md
│   ├── Chapter 7 Kinetic Theory of Ideal Gas 理想气体动理论 习题.md
│   └── Chapter 8 Thermodynamics 热力学基础 习题.md
├── 答案/                           ← 参考解答（含详细解析+易错标注）
│   └── (各章对应答案)
├── Chapter X ... .html             ← 交互版（浏览器打开，含笔记+测验+PPT对照）
├── Chapter X ... /README.md        ← 各章索引（公式速查+外部链接+红线）
├── ch1.json ~ ch8.json             ← 题库JSON（程序化调用）
├── final_exam.json                 ← 期末模拟卷JSON
├── 期末模拟卷.html                  ← 期末模拟卷交互版
└── _总览.json                      ← 题数统计
```

## 使用指南

| 需求 | 去哪里 |
|------|--------|
| 做练习题 | `习题集/` -- 按章节打印 |
| 做完对答案 | `答案/` -- 逐题详解 |
| 浏览器交互学习 | `Chapter X ... .html` -- 双标签页：笔记+测验 |
| 打印复习笔记 | HTML 页面 Ctrl+P 导出 PDF |
| 期末模拟练习 | `期末模拟卷.html` -- 100分 120分钟 |
| 搜外部题库 | 各章 `README.md` -- 含50+个MIT/Berkeley等名校链接 |
| 查公式 | 各章 `README.md` -- 核心公式速查表 |
| 程序化提取题目 | `ch1.json ~ ch8.json` |

## 各章概况

| 章节 | 内容 | 题数 | PPT对照页 |
|------|------|:--:|:--:|
| ch1 力和运动 | 矢量/运动学/圆周/抛体/相对运动 | 21 | 28页 |
| ch2 质点动力学 | 牛顿定律/动量/功能/守恒 | 20 | 60页 |
| ch3 刚体转动 | 转动惯量/转动定律/角动量守恒 | 20 | 65页 |
| ch4 狭义相对论 | 时间膨胀/长度收缩/质能方程 | 20 | 59页 |
| ch5 机械振动 | 简谐振动/合成/共振 | 17 | 14页 |
| ch6 机械波 | 波函数/干涉/驻波/多普勒 | 20 | 20页 |
| ch7 理想气体动理论 | 状态方程/压强公式/能均分/麦氏分布 | 20 | 20页 |
| ch8 热力学基础 | 第一定律/四大过程/卡诺循环/熵 | 20 | 18页 |
| **合计** | | **177** | **284页** |
| 期末模拟卷 | 8章全覆盖, 100分 | 19 | -- |

## 难度分布

每章题目按 basic/medium/hard 三层梯度分布，目标比例：basic ~25%（概念/送分）、medium ~45%（套公式/中档）、hard ~30%（两步综合/拉分）。

## 不考红线

| 章节 | 不考内容 |
|------|----------|
| Ch1 | Pages 1-5 课程介绍/教材推荐、Pages 12-14 质点哲学思政内容 |
| Ch2 | Pages 11-14 牛顿定律「人生智慧」思政内容 |
| Ch3-8 | 无特殊红线 — 所有PPT内容均可能考查 |

## 资源质量标签

| 标签 | 含义 |
|------|------|
| 🟢 | 完整解答（含步骤+评分） |
| 🟡 | 习题列表 + 部分提示/答案 |
| 🔴 | 仅习题号 |
| 💲 | 付费墙后 |

## 技术说明

- **生成方式**: 基于 ExamPass Assistant v2.0 多Agent流水线（Phase 0提取 → Phase 1骨架 → Phase 2并行创作 → Phase 3流式评审 → Phase 4渲染）
- **数据格式**: JSON 每题含 kc_id/type/difficulty/question/options/answer/explanation/pitfall/cognitive_level/points 十个字段
- **PPT对照**: 284张关键PPT页面以base64嵌入HTML，与笔记标题关联
- **公式渲染**: MathJax，支持 `$inline$` 和 `$$display$$` 语法
- **验证状态**: JSON结构全部合法，choice答案ABCD均匀分布(spread≤1)，无三连同，裸<已转义
