/* Standard lesson pages; Bloch experiments mount only inside play steps. */
R.add('C2-1',[
 R.say(
  String.raw`经典比特像一个开关，用 0 和 1 表示两个取值。量子比特则由可以控制和测量的物理系统承载，例如原子的两个内部状态。这两个状态记作 $|0\rangle$ 和 $|1\rangle$，分别读作“零态”和“一态”。`,
  String.raw`要知道量子比特的状态，需要测量。本课程中的测量都是“计算基测量”，也叫“$Z$ 基测量”：每次把量子比特读成 0 或 1。在理想情况下，测量 $|0\rangle$ 确定得到 0，测量 $|1\rangle$ 确定得到 1。`,
  String.raw`$$|0\rangle\xrightarrow{\text{测量}}0\qquad |1\rangle\xrightarrow{\text{测量}}1$$`
 ),
 R.play('sphere','将箭头拖至赤道附近，观察测到 0 和 1 的概率。',{
  intro:[
   String.raw`量子比特还可以处在叠加态。想象一个球：从球心出发的箭头指向北极时表示 $|0\rangle$，指向南极时表示 $|1\rangle$，指向球面其他位置时表示叠加态。`,
   String.raw`这个球叫作 Bloch 球（布洛赫球）。<strong>在理想情况下，球面上的每一个点都对应量子比特的一个状态</strong>。`
  ],
  c:'c5',gates:[],ok:st=>st.dragged&&Math.abs(st.b[2])<0.08
 }),
 R.ask('箭头指向赤道上的一点时，进行一次计算基测量，会得到什么？',
  ['0 或 1，两者概率各为 50%','0.5','一次同时得到 0 和 1'],0,
  '一次测量只得到一个结果。各为 50% 描述的是两种结果出现的概率，不是一次读出“一半”，也不是同时得到 0 和 1。'),
 R.end('量子态可以连续变化，但在计算基测量中，每次只得到 0 或 1。<br>下一节用公式描述量子态，算一算测到 0 和 1 的概率。')
]);
R.add('C2-2',[
 R.say(
  String.raw`上一节用球上的箭头表示量子态，也可以用公式表示：$$|\psi\rangle=a|0\rangle+b|1\rangle.$$其中 $|\psi\rangle$ 读作“psi 态”，泛指一个量子比特的状态；系数 $a$、$b$ 称为<strong>概率幅</strong>。`,
  '概率幅不等于概率。概率描述一个结果有多大可能出现，取值在 0 到 1 之间；概率幅要经过平方，才得到概率。例如概率幅是 1/2，概率就是 1/4，也就是 25%。概率幅可以带负号，概率却不能为负。'
 ),
 R.say(
  String.raw`在计算基测量中，测到 0 和 1 的概率分别是：$$P(0)=|a|^2,\qquad P(1)=|b|^2.$$竖线表示取模，也就是取概率幅的大小。本节的例子都用实数，取模就是取绝对值。一般的概率幅还可以是复数，但“取模再平方”的规则相同。两种结果的概率之和为 1。`
 ),
 R.ask(String.raw`量子比特处于状态 $$|\psi\rangle=\frac12|0\rangle+\frac{\sqrt3}{2}|1\rangle.$$测到 0 的概率是多少？`,
  ['50%','25%','75%'],1,
  String.raw`$|0\rangle$ 前的概率幅是 $1/2$，所以 $P(0)=(1/2)^2=1/4=25\%$。`),
 R.ask(String.raw`量子比特处于状态 $$|\psi\rangle=\frac35|0\rangle+\frac45|1\rangle.$$测到 0 和 1 的概率分别是多少？`,
  ['36% 和 64%','60% 和 80%','50% 和 50%'],0,
  String.raw`分别平方：$P(0)=(3/5)^2=9/25=36\%$，$P(1)=(4/5)^2=16/25=64\%$。检查概率之和：$36\%+64\%=100\%$。`),
 R.ask(String.raw`这次概率幅带有负号：$$|\psi\rangle=\frac{1}{\sqrt2}|0\rangle-\frac{1}{\sqrt2}|1\rangle.$$测到 1 的概率是多少？`,
  ['−50%','100%','50%'],2,
  String.raw`$P(1)=|-1/\sqrt2|^2=1/2=50\%$。负号不会产生负概率；测到 0 的概率也是 50%。这个负号有什么作用，本章最后一节会讨论。`),
 R.ask('把一个量子比特设为赤道上的叠加态，测量一次，得到 1。接着不做任何操作，马上用同样的方式再测一次（假设测量是理想的，中间没有干扰）。<br><br>第二次会得到什么？',
  ['确定仍为 1','得到 0 和 1 的概率仍各为 50%'],0,
  String.raw`第一次得到 1 后，状态成为 $|1\rangle$。没有其他操作或干扰时，再做同样的理想计算基测量，就会确定得到 1。`),
 R.say(
  '测量不仅给出一个结果，也会改变量子比特的状态。这种变化叫作<strong>量子态的塌缩</strong>。',
  String.raw`可以借用球上的箭头来想象：测量前，箭头可以指向赤道等位置；进行一次计算基测量后，它会“落定”在两个极点之一。得到 0，测后的状态就是北极的 $|0\rangle$；得到 1，测后的状态就是南极的 $|1\rangle$。`,
  '这里描述的是状态变化，不是原子真的移动到某个位置。测完后直接再测，要从这个新的状态出发。'
 ),
 R.ask('换一种做法：第一次测得 1 之后，先把量子比特重新设为原来的赤道叠加态，再测一次。<br><br>这次还一定得到 1 吗？',
  ['一定，仍然得到 1','不一定，得到 0 和 1 的概率又各为 50%'],1,
  '重新设置后，量子比特又回到原来的叠加态，两种结果的概率各为 50%。第一次的结果不会固定这次的结果。'),
 R.end('量子态决定测量概率，测量结果决定测量后的状态。再次测量时，如果状态保持测量后的样子，结果就是确定的；如果重新制备了状态，就要按新状态重新计算概率。<br>下一节，我们用量子门主动改变状态。')
]);
R.add('C2-3',[
 R.say('单比特门只作用于一个量子比特，用来改变它的状态。本节介绍四种常用单比特门：X、Y、Z 和 H。其中 X、Y、Z 合称 Pauli 门，H 叫作 Hadamard 门。',
  String.raw`在 Bloch 球上，X、Y、Z 分别对应绕 $x$、$y$、$z$ 轴旋转半圈（即旋转 $\pi$）。H 则对应绕一根斜轴旋转半圈，这根轴位于 $x$、$z$ 正方向的正中间，与两轴各成 $45^\circ$。`),
 R.play('gates','从零态出发，连续按两次 X，观察每次操作后箭头的方向。',
  {c:'qubit',key:'xzero',init:'zero',gates:['X'],axis:'X',showFormula:true,showMeasurement:false,required:true,minGates:2,explain:'X 交换零态和一态。连续施加两次 X，状态回到起点。'}),
 R.ask('刚才 X 让箭头在南北极之间翻转。现在把初态换成赤道上指向 +x 的叠加态，叫作加号态，记作 $|+\\rangle$。<br><br>施加一次 X 后，箭头会指向哪里？',
  ['仍指向 +x','转向 −x','转到南极'],0,'+x 方向正好是 X 门的旋转轴。箭头沿着旋转轴时，绕这根轴转动不会改变它的方向。同一个 X 门作用于不同初态，结果可以不同。'),
 R.play('gates','从 $|+\\rangle$ 出发，按一次 Y，观察箭头的方向如何变化。',
  {intro:['Y 门绕 y 轴旋转半圈。和 X 一样，它也会交换南北极。这次从 $|+\\rangle$ 出发，比较它与 X 的区别。'],c:'qubit',key:'yplus',init:'plus',gates:['Y'],axis:'Y',showFormula:true,showMeasurement:false,required:true,explain:'$|+\\rangle$ 经过 Y 后，箭头指向赤道的 −x 方向，这个状态叫减号态，记作 $|-\\rangle$。'}),
 R.ask('同样从 $|+\\rangle$ 出发，X 让箭头保持不变，Y 却让它转到 −x。<br><br>为什么这两个门的作用不同？',
  ['旋转角度不同：Y 比 X 多转了半圈','旋转轴不同：箭头沿着 x 轴，与 y 轴垂直'],1,'X 和 Y 都旋转半圈，区别在于旋转轴。沿 x 轴的箭头绕 x 轴转动时方向不变，绕 y 轴转半圈则指向 −x。'),
 R.play('gates','从 $|+\\rangle$ 出发，按一次 Z，观察箭头沿赤道的变化。',
  {intro:['Z 门绕 z 轴旋转半圈。z 轴穿过南北极，$|+\\rangle$ 的箭头与这根轴垂直。'],c:'qubit',key:'zplus',init:'plus',gates:['Z'],axis:'Z',showFormula:true,showMeasurement:false,required:true,explain:'Z 把 $|+\\rangle$ 变成 $|-\\rangle$。它与 Y 对这个初态的最终方向相同，但旋转轴不同。'}),
 R.ask('刚才 Z 把赤道上的箭头转到了相反方向。如果把初态换成北极的零态，箭头就沿着 z 轴。<br><br>施加一次 Z 后，箭头会怎样？',
  ['转到南极','保持原方向'],1,'北极的箭头沿着 Z 门的旋转轴，绕这根轴转动时方向不变。南极也一样。Z 会改变 $|+\\rangle$ 的方向，却不会改变两极的方向。'),
 R.play('gates','从零态出发，连续按两次 H，观察每次操作后箭头停在极点还是赤道上。',
  {intro:['H 门绕 x、z 正方向正中间的斜轴旋转半圈。'],c:'qubit',key:'hzero',init:'zero',gates:['H'],axis:'H',showFormula:true,showMeasurement:false,required:true,minGates:2,explain:'第一次 H 把零态变成 $|+\\rangle$，第二次 H 把 $|+\\rangle$ 变回零态。'}),
 R.ask('根据刚才连续两次 H 的实验，H 会把所有输入状态都变成叠加态吗？',
  ['会，H 的输出总是叠加态','不会，输出取决于输入状态'],1,'H 把零态变成 $|+\\rangle$，但也把 $|+\\rangle$ 变回零态。因此，不能把 H 理解成总会产生叠加态的操作。'),
 R.say('把门按时间顺序排在一条线上，就得到单比特线路。线代表量子比特，方框代表门，从左到右执行。',
  '接下来自由组合这四种门，观察状态怎样一步步变化。“撤销”退回上一步，“重置”回到本次实验的初态。'),
 R.play('gates','任选 X、Y、Z、H 组成线路，对照球上的状态变化，再试试撤销和重置。',
  {c:'qubit',key:'circuit',init:'zero',gates:['X','Y','Z','H'],axis:'H',showFormula:true,showMeasurement:false,required:true}),
 R.end('现在你认识了 Pauli 门 X、Y、Z 和 Hadamard 门 H。每个门都有固定的作用规则，结果还取决于输入的状态。<br>下一节继续比较 $|+\\rangle$ 与 $|-\\rangle$：为什么测量概率相同的两个状态，经过同一个门后会得到不同的结果？')
]);
R.add('C2-4',[
 R.say(
  String.raw`两个状态可以有相同的测量概率，却有不同的概率幅。例如：$$|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},\qquad |-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}. $$直接测量（不加其他门，直接做计算基测量）这两个状态，得到 0 和 1 的概率都各为 50%。`,
  String.raw`区别在于符号：$|+\rangle$ 的两个概率幅同号，$|-\rangle$ 的两个概率幅异号。两个分量之间的这种差别叫作<strong>相对相位</strong>（概率幅为复数时，相对相位可以取任意角度，正负号是其中最简单的情况）。在 Bloch 球上，相对相位对应箭头绕 z 轴转到的方位，所以 $|+\rangle$ 和 $|-\rangle$ 位于赤道的相反两侧。`
 ),
 R.play("formula","在 Bloch 球上，箭头偏离北极的角度 θ 决定测量概率，绕 z 轴的方位角 φ 对应相对相位。切换状态，对照两种写法。",{"key":"angles","showMeasurement":false,"init":"plus","presets":["zero","one","plus","minus","yplus"],"mathDetails":true,"c":"qubit","explain":"θ 相同的状态，直接测量的概率相同；φ 不同，相对相位就不同。"}),
 R.ask(String.raw`只看直接测量的概率，能区分 $|+\rangle$ 和 $|-\rangle$ 吗？`,['能','不能'],1,'取模平方后，两者的测量概率都是各半，但量子态并不相同。'),
 R.play('gates',String.raw`对 $|+\rangle$ 施加一次 Z，观察公式、球上方向和测量概率。`,{key:'zphase',sample:false,init:'plus',gates:['Z'],axis:'Z',showFormula:true,required:true,c:'qubit',explain:String.raw`Z 门只改变相对相位，把 $|+\rangle$ 变为 $|-\rangle$，直接测量的概率仍各半。`}),
 R.ask(String.raw`如果先给 $|+\rangle$ 和 $|-\rangle$ 各施加一个 H 门，再进行计算基测量，结果会怎样？`,
  ['两种初态仍然都以各 50% 的概率得到 0 或 1','$|+\\rangle$ 确定得到 0，$|-\\rangle$ 确定得到 1','$|+\\rangle$ 确定得到 1，$|-\\rangle$ 确定得到 0'],1,
  String.raw`H 门将 $|+\rangle$ 变为 $|0\rangle$，将 $|-\rangle$ 变为 $|1\rangle$。因此，再进行计算基测量，就能确定地区分这两个初态。下一页动手验证。`),
 R.play('compare','给 $|+\\rangle$ 和 $|-\\rangle$ 同时施加 H，对照操作前后的状态与测量概率。',
  {c:'qubit',key:'phase-after-h',pair:'phase',sample:false,required:true,explain:'H 将 $|+\\rangle$ 变为零态、$|-\\rangle$ 变为一态，再测量就分别确定得到 0 和 1。'}),
 R.ask(String.raw`$|+\rangle$ 和 $|-\rangle$ 直接测量的概率相同，经过同一个 H 后，测量结果却完全不同。这说明了什么？`,
  ['H 门会随机地给出不同结果','相对相位不影响直接测量的概率，却会影响后续操作的结果'],1,'H 的作用是确定的。两个状态只差在相对相位上，这个差别在直接测量时看不出来，经过 H 之后就变成了测量概率的差别。第六章会把这个现象称为干涉。'),
 R.end('概率幅的模平方决定直接测量的概率；相对相位虽然不改变直接测量的概率，却会影响后续操作的结果。<br>下一章，我们从一个量子比特走向两个量子比特。')
]);
