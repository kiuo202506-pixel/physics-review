# Chapter 3 Rotation of Rigid Body 刚体转动

## 核心公式速查

| Concept | Formula | Notes/Conditions |
|---------|---------|------------------|
| Angular velocity | `omega = d_theta/dt` | rad/s |
| Angular acceleration | `alpha = d_omega/dt` | Uniform angular acceleration: 3 kinematic equations |
| Moment of Inertia | `I = sum(m_i * r_i^2)` | Depends on mass distribution and axis position |
| Parallel Axis Theorem | `I = I_C + m*d^2` | d = distance between parallel axes |
| Rotational Law | `M = I*alpha` | M = r x F (torque), analog of F=ma |
| Angular Momentum | `L = I*omega` | Particle: L = r x m*v |
| Conservation of Angular Momentum | `Sum(M_ext) = 0 => I*omega = constant` | Ice skater pulling arms in |
| Rotational Kinetic Energy | `Ek = I*omega^2/2` | Analog of mv^2/2 |
| Torque Work | `W = integral(M*d_theta)` | Analog of W = integral(F*dx) |
| Pure Rolling | `v_c = R*omega` | No-slip condition |

## 外部在线资源

### 网上资源（含解答）

| # | 来源 | 链接 | 质量 | 说明 |
|---|------|------|:--:|------|
| 1 | UESTC Rotation Exercise Bank | [study.uestc.edu.cn](https://study.uestc.edu.cn/wlxt/ncourse/physics/web/DXWL/xuexizhidao/xitiku/3t.htm) | 🟢 | 电子科大题库第3章：刚体转动（中文）|
| 2 | SWJTU Angular Momentum HW #3 | [GitHub/SWJTU](https://raw.githubusercontent.com/swjtuhub/SWJTU-Courses/main/考试作业/大学物理/作业2022/) | 🟢 | 西南交大角动量守恒作业含答案 |
| 3 | Shzu Univ Rotation Test Bank | [eol.shzu.edu.cn](https://eol.shzu.edu.cn/meol/data/convert/2025/1/24/e5b109e8-6b87-49fe-bb0e-feb45af1c37b_60967.html) | 🟢 | 石河子大学刚体转动题库 |
| 4 | 刚体转动习题+答案合集 | [renrendoc.com](https://www.renrendoc.com/paper/325332481.html) | 🟢 | 含选择题+计算题+完整解析 |
| 5 | 大学物理解题指南（华南理工）| [PDF](https://www.renrendoc.com/paper/325332481.html) | 🟢 | 刚体章节详细解题方法 |
| 6 | MIT 8.01 Rotational Motion | [MIT OCW](https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/pages/rotation/) | 🟢 | PSets 9-11: torque, angular momentum, rigid body dynamics |
| 7 | Physics LibreTexts Rotational Dynamics | [phys.libretexts.org](https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/Book%3A_University_Physics_I_-_Mechanics_Sound_Oscillations_and_Waves_(OpenStax)/10%3A_Fixed-Axis_Rotation_Introduction) | 🟢 | OpenStax大学物理旋转章节+习题 |

### 课本安全题号（Young & Freedman 13th Ed）

- Ch9: §9.1-9.6 Rotation: Examples 9.1-9.11, Problems #1-62
- Ch10: §10.1-10.7 Torque & angular momentum: Examples 10.1-10.11, Problems #1-72

## 题库

- Exercises: 20 questions
- Printable: `../习题集/Chapter 3 Rotation of Rigid Body 刚体转动 习题.md`
- Answers: `../答案/Chapter 3 Rotation of Rigid Body 刚体转动 答案.md`
- Interactive: `../Chapter 3 Rotation of Rigid Body 刚体转动.html` (open in browser)
