---
title: 铁磁性在伊辛模型中的应用：基于 Metropolis 算法的模拟
date: 2024-03-18
author: 黄晨
blogtags: ["matlab"]
---

## 引言

相变是指热力学性质在特定温度附近发生突然变化或趋于无穷大的现象，这在自然界中很常见。尽管自然界中的哈密顿量是平滑且有界的，但我们如何将其与热力学量中这些突然的变化联系起来呢？此外，一个配分函数表达式能否同时包含各种相的相变？一个解决方案是构建简化模型，捕捉系统的基本特征，并严格推导它们在相变点的宏观性质。在这些模型中，伊辛模型脱颖而出。

伊辛模型是专门为探索和理解铁磁性现象而开发的，该现象涉及铁磁材料中观察到的相变行为。这包括磁体加热到临界温度以上时磁性消失，以及冷却到临界温度以下时磁性重新出现的情况。铁磁材料的磁性主要源于磁性原子中电子的自旋-轨道磁矩。由于相邻电子之间存在强大的交换耦合，在没有外部磁场的情况下，它们的自旋磁矩在小区域内自发对齐，形成磁化畴。在未磁化的铁磁材料中，这些畴表现出不同的磁化方向，导致没有宏观磁性。施加外部磁场后，与磁场方向相似的畴会扩张，吞并相邻的磁化方向相反的畴。因此，每个畴的磁化强度逐渐与外部磁场对齐，使材料“磁化”。然而，随着温度的升高，总磁性减弱，并在临界温度下，系统发生相变，所有磁化强度消失。因此，我们的目标是阐明铁磁体的热行为。

## 伊辛模型

### 基本哈密顿量

在伊辛模型中，我们考虑一个由 $N$ 个格点组成的晶格，排列在 $d$ 维空间中。每个格点都承载一个量子自旋，能够处于两种状态之一：自旋向上 ($\uparrow$) 或自旋向下 ($\downarrow$)，分别由第 $i$ 个格点的自旋本征值 $s_i=\pm 1$ 表示。伊辛模型的哈密顿量表示为：

$$
H\{\alpha*k\}=-J\sum*{\langle i,j\rangle}s_is_j-B\sum_is_i,
$$

其中 $\{\alpha_k\}=\{s_1,s_2,\dots,s_N\}$ 描述了自旋取向。这里的符号 $\langle i,j\rangle$ 表示对相邻格点对求和，代表最近邻相互作用。参数 $J$ 表示自旋之间相互作用的强度，而 $B$ 表示外部磁场。

在 $J > 0$ 的情况下，相邻自旋倾向于相互对齐 ($\uparrow\uparrow$ or $\downarrow\downarrow$)，导致铁磁性状态。相反，如果 $J < 0$，自旋倾向于反向对齐 ($\uparrow\downarrow$)，导致反铁磁性状态。在我们的讨论中，我们将重点关注 $J>0$ 的情况。

在研究铁磁系统中的相变时，我们主要关注系统的平均自旋，表示为：

$$
m=\frac{1}{N}\sum_{i} s_i,
$$

通常称为平均磁化强度。系统的配分函数由下式给出：

$$
Z=\sum_{{\alpha_k}}\mathrm{e}^{-\beta H\{\alpha_k\}},
$$

其中求和是对所有可能的自旋构型 $\{\alpha_k\}$ 进行的。从这个配分函数中，我们可以推导出系统的所有热力学性质。

伊辛模型起源于 Wilhelm Lenz 的工作，他最初提出了这个想法，并将其传授给他的学生 Ernst Ising。在他的开创性论文中，伊辛研究了一维模型，并得出结论：它不表现出任何相变。然而，二维模型提出了一个更复杂的挑战，最终由 Lars Onsager 解析解决。另一方面，三维伊辛模型仍然没有解析解，仍然是计算探索的主题。

### 一维伊辛模型的理论解

在一维伊辛模型中，应用周期性边界条件 $s_1=s_{N+1}$。配分函数可以写为：

$$
\begin{aligned} Z
&=\sum_{s_1=\pm1}\sum_{s_2=\pm1}\cdots\sum_{s_N=\pm1}e^{-\beta H}\\
&=\sum_{s_1=\pm1}\sum_{s_2=\pm1}\cdots\sum_{s_N=\pm1}e^{\beta J\sum_{\langle i,j\rangle}s_is_j-\beta B\sum_{i}s_i}\\
&=\sum_{s_1=\pm1}\sum_{S_2=\pm1}\cdots\sum_{s_N=\pm1}A_{s_1s_2}A_{s_2s_3}\cdots A_{s_Ns_1}, \end{aligned}
$$

其中 $A_{s_is_j}$ 表示矩阵 $\mathbf{A}$ 的元素：

$$
\mathbf{A}=\begin{pmatrix} e^{\beta J+\beta B} & e^{-\beta J+\beta B}\\ e^{-\beta J-\beta B} & e^{\beta J-\beta B} \end{pmatrix}.
$$

利用线性代数，配分函数可以简化为

$$
Z=\lambda_+^N+\lambda_-^N,
$$

其中 $\lambda_\pm$ 是矩阵 $\mathbf{A}$，由下式给出

$$
\lambda*\pm=e^{\beta J}\cosh(\beta B)\pm\sqrt{e^{2\beta J}\cosh^2(\beta B)-2\sinh(2\beta J)}.
$$

因此，当系统尺寸 $N$ 足够大时，我们可以将配分函数近似为

$$
Z=\lambda_+^N\left[1+\left(\frac{\lambda_-}{\lambda_+}\right)^N\right]\approx \lambda_+^N.
$$

因此，每个格点的亥姆霍兹自由能为

$$
f(B,T)=-\frac{1}{N}k_BT\ln Z=-k_BT\ln \lambda_+,
$$

磁化强度由此给出

$$
m(B,T)=-\left(\frac{\partial f}{\partial B}\right)\_T=\frac{\sinh(\beta B)}{\sqrt{\cosh^2(\beta B)-2\mathrm{e}^{2\beta J}\sinh(2\beta J)}}.
$$

确实，值得注意的是，磁化强度 $m(B,T)$ 是磁场 $B$ 实值和正温度 $T$ 的解析函数。这意味着在一维伊辛模型中，对于正温度，没有相变。

## 伊辛模型的模拟

在本节中，我们将讨论伊辛模型的模拟，它是统计力学中的一个基本模型，特别是在磁性系统相变研究中。我们将重点介绍使用 Metropolis 算法，一种广泛使用的蒙特卡洛方法，来模拟伊辛模型在热平衡时的行为。

### Metropolis 算法

Metropolis 算法是模拟热平衡系统中系统的强大工具。它生成一系列构型（马尔可夫链），准确地代表了热平衡期间观察到的波动。该算法根据特定标准随机修改单个自旋，以确保构型的概率遵循玻尔兹曼分布。

Metropolis 算法的步骤如下：

1. **初始化：**从任意自旋构型开始。
2. **试探构型：**通过随机选择一个自旋进行翻转来生成一个试探构型。
3. **能量计算：**计算试探构型的能量。
4. **能量比较：**将试探构型导致的能量变化 ($\Delta E$) 与当前构型进行比较。如果 $\Delta E \le 0$，则无条件接受翻转。否则，继续下一步。
5. **接受准则：**如果 $\Delta E > 0$，以概率 $\exp(-\Delta E/k_BT)$ 接受翻转，其中 $k_B$ 是玻尔兹曼常数，$T$ 是温度。此步骤允许系统偶尔探索能量较高的构型，模拟热波动。
6. **迭代:**重复步骤 2-5 大量迭代，直到系统达到热平衡。

通过迭代这些步骤，Metropolis 算法生成一系列构型，准确地代表了伊辛模型在给定温度下的平衡行为。接下来，我们将讨论 Metropolis 算法在模拟伊辛模型及其性质中的实现。

### 一维伊辛模型

为了使用 Metropolis 算法模拟一维伊辛模型，我们遵循前面概述的一般过程。我们使用特定构型初始化系统，并迭代应用 Metropolis 算法来生成一系列表示系统在给定温度下平衡状态的构型。

![Simulation results for the energy of a 1-D lattice of 100 spins as a function of temperature.](./images/EvT1.png)
![Simulation results for the magnetization of a 1-D lattice of 100 spins as a function of temperature.](./images/mvT1.png)

```matlab
clear;  % 清除工作区

% 参数
N = 100;          % 格点数
J = 1;            % 交换耦合常数
T_list = linspace(0.001, 5, 50);    % 温度 (kT)

mean_magnetization = zeros(1, length(T_list));  % 初始化磁化强度
mean_energy = zeros(1, length(T_list));         % 初始化能量

magnetization = zeros(10, length(T_list)); % 预分配数组以存储磁化强度结果
energy = zeros(10, length(T_list));        % 预分配数组以存储能量结果

% 遍历温度列表中的每个温度
for idx = 1:length(T_list)
    T = T_list(idx);

    % 进行多次模拟以进行统计平均
    for i = 1:10
        [spins, energy(i, idx)] = solveIsing(N, T, J);  % 调用函数模拟伊辛模型
        magnetization(i, idx) = abs(mean(spins(:)));
    end

    % 计算结果的平均值
    mean_magnetization(idx) = mean(magnetization(:, idx));
    mean_energy(idx) = mean(energy(:, idx));
end

% 绘制平均能量随温度变化的曲线
figure(420);
plot(T_list, mean_energy, 'ko--');
xlabel('温度 $(k_BT)$', 'Interpreter', 'latex');
ylabel('能量 $(E)$', 'Interpreter', 'latex');
savefig('1d_energy_plot.fig');

% 绘制平均磁化强度随温度变化的曲线
figure(421); % 为磁化强度图创建一个新图形
plot(T_list, mean_magnetization, 'ko--');
xlabel('温度 $(k_BT)$', 'Interpreter', 'latex');
ylabel('磁化强度 $(m)$', 'Interpreter', 'latex');
savefig('1d_magnetization_plot.fig');

% 使用 Metropolis 算法模拟伊辛模型的函数
function [spins, energy] = solveIsing(N, T, J)
    % 初始化自旋构型
    spins = ones(1, N);

    % 模拟步数
    num_steps = 200*N;

    % Metropolis 算法模拟
    for step = 1:num_steps
        % 随机选择一个格点
        i = randi([1, N]);

        % 计算能量变化
        delta_E = 2 * J * spins(i) * ( ...
            spins(mod(i - 2, N) + 1) + spins(mod(i, N) + 1));

        % Metropolis 接受准则
        if rand() < exp(-delta_E / T)
            spins(i) = -spins(i);
        end
    end

    energy = 0; % 初始化能量
    for i=1:N-1
        energy = energy - J * spins(i) * spins(i+1);
    end
end
```

### 二维伊辛模型

从一维伊辛模型的简单性出发，我们深入研究二维伊辛模型更丰富的行为。该模型通过考虑排列在二维晶格（例如方形晶格）上的自旋来捕获磁性材料更真实的特征。该模型中相邻自旋之间的相互作用可以导致引人入胜的现象，包括相变和临界行为。

为了模拟二维伊辛模型，我们扩展 Metropolis 算法以处理晶格结构引入的额外复杂性。与一维情况类似，我们使用特定构型初始化系统，并迭代应用 Metropolis 算法更新自旋构型。然而，在二维情况下，我们必须考虑自旋在水平和垂直方向上的相互作用。

![Spin configurations of a 2-D lattice (50$\times$ 50) at various temperatures. Navy blue denotes spin up $(\uparrow)$, while light blue signifies spin down $(\downarrow)$. ](./images/spins2.png)
![Simulation results for the energy of a 2-D lattice of 50×50 spins as a function of temperature.](./images/EvT2.png)
![Simulation results for the magnetization of a 2-D lattice of 50×50 spins as a function of temperature.](./images/mvT2.png)

在二维伊辛模型中，在低温下，自旋倾向于相互平行对齐，导致非零磁化强度。这种对齐是由于自旋-自旋相互作用对热波动的支配，导致铁磁畴的形成。

随着温度升高，热波动变得更加突出，扰乱了自旋的对齐并降低了系统的整体磁化强度。在称为居里温度 ($T_C$) 的临界温度下，系统从铁磁相经历相变到顺磁相，磁化强度消失。

```matlab
clear;  % 清除工作区

% 参数
N = 50;          % 格点数 (N*N)
J = 1;           % 交换耦合常数
T_list = linspace(0.001, 5, 16);    % 温度

mean_magnetization = zeros(1, length(T_list));  % 初始化磁化强度
mean_energy = zeros(1, length(T_list));         % 初始化能量

magnetization = zeros(10, length(T_list)); % 预分配数组以存储磁化强度结果
energy = zeros(10, length(T_list));        % 预分配数组以存储能量结果

figure(820); % 在循环外部创建一个新图形
custom_colormap = [177 217 229; 52 73 100]/255;

% 遍历温度列表中的每个温度
for idx = 1:length(T_list)
    T = T_list(idx);

    % 进行多次模拟以进行统计平均
    for i = 1:10
        [spins, energy(i, idx)] = solveIsing(N, T, J);  % 调用函数
        magnetization(i, idx) = abs(mean(spins(:))); % 直接计算平均磁化强度
    end

    % 计算结果的平均值
    mean_magnetization(idx) = mean(magnetization(:, idx));
    mean_energy(idx) = mean(energy(:, idx));

    % 直接绘制自旋
    subplot(4, 4, idx); % 4 行，4 列
    imagesc(spins);
    colormap(custom_colormap);
    axis equal
    title(['$k_BT=$', num2str(round(T,2)), ...
        ', $|m|=$', num2str(round(mean_magnetization(idx),2))], ...
        'Interpreter', 'latex');
    set(gca,'XTick',[], 'YTick', []);
    axis tight
end

savefig('2d_spins.fig');

% 绘制平均磁化强度
figure(821); % 为磁化强度图创建一个新图形
plot(T_list, mean_magnetization, 'ko--');
xlabel('温度 $(k_BT)$', 'Interpreter', 'latex');
ylabel('磁化强度 $(m)$', 'Interpreter', 'latex');
savefig('2d_magnetization_plot.fig');

% 绘制平均能量
figure(822); % 为能量图创建一个新图形
plot(T_list, mean_energy, 'ko--');
xlabel('温度 $(k_BT)$', 'Interpreter', 'latex');
ylabel('能量 $(E)$', 'Interpreter', 'latex');
savefig('2d_energy_plot.fig');

function [spins, energy] = solveIsing(N, T, J)
    % 初始化自旋构型
    spins = ones(N);

    % 模拟步数
    num_steps = 200*N^2;

    % Metropolis 算法模拟
    for step = 1:num_steps
        % 随机选择一个格点
        i = randi([1, N]);
        j = randi([1, N]);

        % 计算能量变化
        delta_E = 2 * J * spins(i, j) * ( ...
            spins(mod(i - 2, N) + 1, j) + spins(mod(i, N) + 1, j) + ...
            spins(i, mod(j - 2, N) + 1) + spins(i, mod(j, N) + 1));

        % Metropolis 接受准则
        if rand() < exp(-delta_E / T)
            spins(i, j) = -spins(i, j);
        end
    end

    energy = 0; % 初始化能量
    for i=1:N-1
        for j=1:N-1
            energy = energy - J * spins(i,j) * ( ...
                spins(i,j+1) + spins(i+1,j));
        end
    end
end
```
