/* Chapter 7: a FatQat introduction followed by career exploration. */
R.add('C7-1',[
 {...R.say('FatQat 可以用 Python 代码描述量子线路，并调用模拟器运行。本节用 FatQat 编写一个量子实验：准备 |0⟩，施加 H 门，再进行测量。','把这个实验重复 100 次，统计测到 0 和 1 各有多少次；然后把 H 门换成 X 门，观察计数怎样变化。','接下来分四步完成：准备比特、添加量子门、添加测量、执行采样并读取结果。每一步只看一小段代码，并对照对应的线路。')},
 R.lab('准备比特：从 |0⟩ 开始。',{labKey:'code',codeStage:'prepare',seed:[],measured:false,shots:100,explain:true,showCode:true,codeFirst:true,ok:()=>true,gh:''}),
 R.lab('添加量子门：给第 0 个比特施加 H 门。',{labKey:'code',codeStage:'gates',seed:['H'],measured:false,explain:true,showCode:true,codeFirst:true,ok:()=>true,gh:''}),
 R.lab('添加测量：把测量结果保存到经典位。',{labKey:'code',codeStage:'measure',seed:['H'],measured:true,explain:true,showCode:true,codeFirst:true,ok:()=>true,gh:''}),
 R.lab('执行采样，并读取计数。',{labKey:'code',codeStage:'execute',seed:['H'],measured:true,shots:100,explain:true,showCode:true,codeFirst:true,ok:m=>!!m.result,gh:'采样一次，观察 0 和 1 分别出现了多少次。'}),
 R.ask('如果输出中有「\'0\': 49」，它表示什么？',['概率幅是 49','测到 0 共 49 次','第 49 个量子比特'],1,'键是测量结果，值是次数。它不等于量子态的概率幅。'),
 R.lab('把 H 换成 X，计数会怎样变化？先在心里预测，再清空门、加入 X 并采样，留意代码同步改变。',{labKey:'code',seed:['H'],measured:true,edit:true,gates:['H','X'],showCode:true,codeFirst:true,explain:true,ok:m=>m.seq.join(',')==='X'&&!!m.result,gh:'只保留一个 X，再采样。'}),
 R.say('本节的计数来自网页内的模拟，网页并不运行上面展示的 FatQat Python 代码。有限次采样不一定恰好符合理论比例；真实设备还涉及实际的准备、控制与读出，增加采样次数不会自动消除设备误差。','想继续使用 FatQat，可以复制实验代码，在安装了 FatQat 的 Python 环境中运行。<a class="career-doc-link" href="https://fatqat.readthedocs.io/en/latest/guide/quickstart/" target="_blank" rel="noopener noreferrer">继续使用 FatQat：快速入门（新窗口）</a>'),
 R.end('你已经了解怎样用代码描述一个量子实验。让这样的程序在真实设备上运行，还需要哪些人的工作？')
]);
R.add('C7-2',[
 {t:'show',art:'careerFlow',cap:'这些工作相互合作，同一个人也可能跨越多个方向。'},
 {t:'show',art:'careerDirections',cap:'点击方向查看具体工作与相关基础。这是探索入口，不是固定的专业或岗位边界。'},
 {t:'show',art:'careerNext',cap:'兴趣选择没有对错，随时可以切换。后续任务不影响本课完成。'},
 R.end('这门课提供了一张入门地图。带着一个感兴趣的问题继续学习，在具体的小项目中逐步积累能力，也逐步了解自己喜欢怎样的工作。')
]);
