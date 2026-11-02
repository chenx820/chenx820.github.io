/* Joint states → entanglement → no-cloning → teleportation. */
R.add('C3-1',[
 {...R.ask('从这一章开始，我们同时使用两个量子比特 q0 和 q1。一起测量它们，会得到一对结果。<span class="joint-readout"><span><small>q0</small><strong>0</strong></span><span><small>q1</small><strong>1</strong></span></span>按 q0、q1 的顺序，这次的结果记作什么？',['00','01','10','11'],1,'按 q0、q1 的顺序记录：前一位是 0，后一位是 1，所以记作 01。')},
 R.say('下面用两种方式准备两个量子比特，每种方式都重复 100 次，再一起测量：','<strong>A 组</strong>：q0、q1 各自独立地随机准备成 0 或 1，各占一半。','<strong>B 组</strong>：每次先随机选定 00 或 11（各占一半），再按选定的结果准备两个比特。','单独看任意一位，两组测到 0、1 的概率都是各占一半。'),
 R.ask('两组中，哪一组可能测到 01 这样两位不同的结果？',['只有 A 组','只有 B 组','两组都可能'],0,'A 组两位各自随机，01、10 都可能出现；B 组两位总是一起选定，只会出现 00 或 11。下一页用实验验证。'),
 R.play('both','运行两组实验，对照两位一起出现的结果。',{c:'jointLesson'}),
 R.ask('两组单独看每一位，概率完全相同，一起看的结果却不同。这说明了什么？',['只要知道每一位各自的概率，就能确定两位一起出现的结果','描述两个比特时，还要知道哪些结果会一起出现'],1,'每一位各自的概率只描述了“分开看”的情况。两个比特之间可能存在关联：B 组的两位总是相同，A 组则没有这种关联。'),
 R.end('分别看，每一位都可能是 0 或 1；一起看，还要知道哪些结果会共同出现。<br>B 组的关联来自经典的随机选择：每次先随机选定 00 或 11，再分别准备两个比特。本章后面会看到另一种来源的关联：纠缠。<br>下一节认识同时作用于两个比特的 CNOT 门。')
]);
R.add('C3-2',[
 {...R.say('CNOT 是受控翻转门：控制比特为 1 时翻转目标比特，为 0 时目标比特不变。这里 q0 控制 q1。','线路上的实心点是控制位，带圈的加号是目标位。输入为 00、01、10、11 这四种确定状态时，控制位本身都不会改变。'),illustration:{src:'assets/illustrations/cnot-circuit.svg',alt:'CNOT 线路：上方 q0 的实心点为控制，下方 q1 的带圈加号为目标。',width:640,height:250,wide:true}},
 R.ask(String.raw`从 $|10\rangle$ 出发（q0 为 1，q1 为 0）做一次 CNOT，会得到什么？`,['00','10','11'],2,'q0 为 1，所以把 q1 从 0 翻到 1，得到 11。'),
 R.play('cnot','切换四种输入，连续执行两次 CNOT，对照输入与输出。',{c:'entanglement',key:'cnot'}),
 R.ask('连续执行两次 CNOT 之后，两个比特的状态会怎样？',['目标位被翻转两次，一定变成 1','回到原来的输入状态'],1,'控制位为 1 时，目标位被翻转两次，回到原值；控制位为 0 时，目标位始终不变。所以连续两次 CNOT 相互抵消。'),
 R.end('控制比特为 0 时，CNOT 不改变目标比特；控制比特为 1 时，CNOT 翻转目标比特。<br>下一节把 H 和 CNOT 组合起来，制备一个纠缠态。')
]);
R.add('C3-3',[
 R.say('如果两个量子比特的状态无法拆成“q0 的状态”和“q1 的状态”分别描述，只能作为一个整体描述，就称它们处于<strong>纠缠</strong>态。','贝尔态（Bell 态）是最典型的纠缠态，共有四种。本节制备其中一种：',String.raw`$$\frac{|00\rangle+|11\rangle}{\sqrt2}.$$`, '它是 00 与 11 的等幅、同相位叠加：两项概率幅的大小相同、符号相同。直接测量两个比特时，只会得到 00 或 11，各有一半概率。'),
 R.play('bell-build','从 |00⟩ 开始，自己选择量子门，观察联合状态怎样变化，试着得到上一页的贝尔态。',{c:'entanglement',key:'bell-build'}),
 R.say('经过 H → CNOT，我们制备出了目标贝尔态。直接测量时，每一位的结果都是随机的，两位的结果却总相同；多次独立制备与测量的计数通常接近各半，不必恰好相等。'),
 R.say('这和第一节的 B 组很像：B 组也只出现 00 和 11，各占一半。区别在于关联的来源。B 组每次先随机选定 00 或 11，测量前两个比特就已经有确定的值，只是我们不知道；贝尔态在测量前并没有确定是 00 还是 11，两项同时存在，并保持着确定的相对相位。','只做直接测量，两者的统计结果完全相同。如果先给两个比特各施加一个 H 再测量，B 组会以各 25% 的概率出现 00、01、10、11；这个贝尔态却仍然只出现 00 和 11。这正是第二章看到的现象：相对相位在直接测量中看不出来，经过后续操作才显现出来。'),
 R.end('理想的 H → CNOT 会把 |00⟩ 制备成贝尔态。它的关联来自纠缠，而不是测量前就已确定的经典随机选择。<br>在用纠缠传送量子态之前，先看一个限制：未知的量子态能不能被复制？')
]);
R.add('C3-4',[
 R.say('经典信息可以随意复制，一份文件可以拷贝无数次。那么，能不能造一台“量子复印机”？','设想这样一台机器：输入一个未知态 $|\\psi\\rangle$ 和一个空白比特 $|0\\rangle$，输出两份 $|\\psi\\rangle$。'),
 R.ask('以 q0 为控制位的 CNOT，能把 $|0\\rangle$ 复制成 $|00\\rangle$，把 $|1\\rangle$ 复制成 $|11\\rangle$。<br><br>把 q0 换成 $|+\\rangle$，再执行同一个 CNOT，会得到两份 $|+\\rangle$ 吗？',
  ['会，得到两份 $|+\\rangle$','不会，得到的是上一节的贝尔态'],1,
  String.raw`这正是上一节的 H → CNOT：结果是贝尔态 $(|00\rangle+|11\rangle)/\sqrt2$，只会测到 00 或 11。两份 $|+\rangle$ 则是 $(|00\rangle+|01\rangle+|10\rangle+|11\rangle)/2$，四种结果各占 25%。CNOT 能复制 0 和 1，却不能复制它们的叠加。`),
 R.say('这不是 CNOT 不够好。量子操作对叠加态的作用，由它对 $|0\\rangle$、$|1\\rangle$ 的作用按概率幅组合而成。能复制 $|0\\rangle$ 和 $|1\\rangle$ 的机器，作用在叠加态上只能得到纠缠态，得不到两份副本。','可以证明：不存在一台机器能完美复制任意未知的量子态。这就是<strong>量子不可克隆定理</strong>。','先测量、再照着结果重新准备，也行不通：一次测量只得到 0 或 1，并且会让状态塌缩，得不到概率幅的完整信息。'),
 R.ask('关于量子不可克隆定理，哪种说法正确？',
  ['任何量子态都无法再制备出第二份','只要测量得足够仔细，就能读出未知态再复制','已知的状态（例如 $|0\\rangle$）可以反复制备；不能完美复制的是任意未知的量子态'],2,
  '如果知道状态是什么，按同样的步骤再制备一份就可以。不可克隆定理限制的是：手里只有一个未知态时，无法得到它的完美副本。'),
 R.end('未知的量子态既不能被完美复制，也不能靠一次测量读出来。<br>那么，怎样把 Alice 手中的未知量子态交给 Bob？下一节的量子隐形传态给出了答案。')
]);
R.add('C3-5',[
 R.play('resources','怎样把 Alice 手中的未知量子态转移给 Bob？',{c:'teleportLesson'}),
 {...R.ask('Alice 手中有一个处于未知态的量子比特 Q，以及纠缠对中的一个量子比特 A；Bob 持有纠缠对中的另一个量子比特 B。接下来，Alice 应该怎样做？',[
  '直接测量 Q，把结果告诉 Bob，让他照着准备原态。',
  '对 Q 和 A 一起进行操作，再测量它们，把结果告诉 Bob。',
  '不做任何操作，Bob 的 B 已经自动变成了 Q 的状态。'
 ],1,'上一节讲过，直接测量一个未知态，得不到重建它所需的完整信息；共享纠缠也不会自动完成传态。<br><br>Alice 需要先对 Q、A 做特定操作：<strong>Q 控制 A 做 CNOT，再对 Q 做 H</strong>，随后测量这两个比特。这样，测量结果就能告诉 Bob 应该怎样修正 B，恢复原来的量子态。'),feedbackCircuit:'teleport-prepare'},
 R.play('derive','从输入态出发，展开 CNOT 和 H 后的完整状态。',{c:'teleportLesson'}),
 {...R.ask('Alice 测得 <strong>a=0、b=1</strong>，即 Q、A 的结果为 01。Bob 尚未执行修正，此时 B 的归一化状态是什么？',[
  String.raw`$\alpha|0\rangle+\beta|1\rangle$`,
  String.raw`$\alpha|1\rangle+\beta|0\rangle$`,
  String.raw`$\alpha|0\rangle-\beta|1\rangle$`,
  String.raw`$\alpha|1\rangle-\beta|0\rangle$`
 ],1,String.raw`测得 01，就在完整展开式中保留 Q、A 为 01 的两项：<div class="teleport-algebra">$$\frac{\alpha}{2}|011\rangle+\frac{\beta}{2}|010\rangle.$$</div>把共同的 $|01\rangle_{QA}$ 提出来，得到：<div class="teleport-algebra">$$\frac12|01\rangle_{QA}(\alpha|1\rangle+\beta|0\rangle)_B.$$</div>这一分支的概率是 ¼。保留该分支并归一化后，B 的状态为 $\alpha|1\rangle+\beta|0\rangle$。用同样的方法，可得到下表。表中均为测量后、Bob 修正前的归一化状态。
 <table class="protocol-table teleport-state-table"><thead><tr><th scope="col">结果 ab</th><th scope="col">B 的状态（修正前）</th></tr></thead><tbody>
 <tr><th scope="row">00</th><td>$\alpha|0\rangle+\beta|1\rangle$</td></tr>
 <tr><th scope="row">01</th><td>$\alpha|1\rangle+\beta|0\rangle$</td></tr>
 <tr><th scope="row">10</th><td>$\alpha|0\rangle-\beta|1\rangle$</td></tr>
 <tr><th scope="row">11</th><td>$\alpha|1\rangle-\beta|0\rangle$</td></tr>
 </tbody></table>`),key:'teleport-state'},
 R.play('transfer','把 Alice 的测量结果告诉 Bob，完成这一次传态。',{c:'teleportLesson'}),
 R.ask('另一轮传态中，Bob 收到 <strong>a=1、b=0</strong>。他应该怎样修正？',
  ['不操作','只做 X','只做 Z','先 X，再 Z'],2,
  String.raw`这一轮 B 的状态为 $\alpha|0\rangle-\beta|1\rangle$。只做 Z，就恢复 $\alpha|0\rangle+\beta|1\rangle$。一般地，先看 b：b=1 时做 X；再看 a：a=1 时做 Z。对应结果为 0，就跳过那个门。
  <table class="protocol-table teleport-corrections"><caption>测量结果与 Bob 的修正</caption><thead><tr><th scope="col">结果 ab</th><th scope="col">修正操作</th></tr></thead><tbody><tr><th scope="row">00</th><td>不操作</td></tr><tr><th scope="row">01</th><td>只做 X</td></tr><tr><th scope="row">10</th><td>只做 Z</td></tr><tr><th scope="row">11</th><td>先 X，再 Z</td></tr></tbody></table>`),
 R.ask('关于刚才的协议，哪项描述正确？',[
  'Bob 恢复原态，Alice 也保留原态，因此双方各有一个副本。',
  'Bob 恢复原态，Alice 不再保有原态；Bob 需要经典消息来确定修正。',
  '有了共享纠缠，Bob 就可以省略接收经典消息，直接恢复任意输入态。'
 ],1,'Alice 的 Q 已被测量，原态没有留下副本，这与不可克隆定理一致。Bob 也必须收到经典消息，才能确定修正。'),
 R.end('传态把未知量子态转移给 Bob：Alice 不再保有原态，没有产生副本，Bob 也离不开经典消息。<br>下一章看看这些量子线路怎样在真实的硬件上运行。')
]);

// Illustrate explanations and predictions with the matching circuit.
const CHAPTER_THREE_CIRCUITS={
 'C3-2':{0:'cnot',1:'cnot10',3:'cnot'},
 'C3-3':{2:'bell-measured',3:'pair-X'},
 'C3-4':{0:'candidate',1:'bell'},
};
for(const [id,pages] of Object.entries(CHAPTER_THREE_CIRCUITS)){
 for(const [index,circuit] of Object.entries(pages))LESSONS[id].pages[index].circuit=circuit;
}
