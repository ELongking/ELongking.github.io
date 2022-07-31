<- [返回首页](index.md)

## 写在前面

  本程序的底层框架采用PyQt5自主编写，不放出源代码，但是如果你想要的话可以说明来意，我会酌情考虑。
  
  <p>龙王在实习的某一天，因为工作的某些缘故，突发奇想，做了一点反编译的措施。如果您是大佬，那当我没说。<br>
  另外，程序里面是夹带了一点私货的，~~__不是那种，会读你数据的私货__~~。指数据导入特定格式的时候，会有防伪的弹出框，问就是犯大吴疆土了(bushi)<p>
  
  欢迎所有的bug反馈，尤其是在弹出特殊报错框的时候，前提是你的步骤是对的

## 总览

  无论是哪个程序，他们的文件夹的构成是大相径庭的。

- 第一个程序的目录脑图如下图所示：

  <p>app/<br>
  |——七七八八的依赖项目<br>
  |——app.exe<br>
  |——output/<br>
  &emsp;&emsp;&emsp;|——circles/<br>
  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|——output_i.jpg<br>
  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|——...<br>
  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|——config.json<br>
  &emsp;&emsp;&emsp;|——standard.avi<br>
  &emsp;&emsp;&emsp;|——skeleton_points.xlsx<br>
  &emsp;&emsp;&emsp;|——data_after_delete_extra_zero.xlsx<br></p>

- 第二个程序的目录脑图如下图所示：

  <p>app/<br>
  |——七七八八的依赖项目<br>
  |——app.exe<br></p>

具体的文件作用在下面对应位置解释。

## 第一个程序
  
  *该程序的主要流程是: 导入原始数据文件，生成骨架曲线并导出*

![flowchart_1](material/app_help/app1/APP1.png)

1. 读取文件（支持xlsx和csv两种格式）

  注意，这里所导入的文件，不能有表头。很多朋友喜欢把excel表的第一行写上表头，例如：

  | strain | stress |
  |--------|--------|
  |   ...  |   ...  |
  |   ...  |   ...  |
  |   ...  |   ...  |

  请把表头的starin和stress等均删除，***且只许为两列的格式***

  此步骤是整个流程中最需要时间的地方，请耐心等待（亲测，15000组点大概需要15s的时间）

  最后会生成两个文件和一个文件夹，分别为circles(文件夹) | standard.avi | data_after_delete_extra_zero.xlsx

  **其中circles文件夹是第二个程序分析的主要数据来源**；standard.avi是视频文件；最后一个excel表格是抛去原数据中所有多余的原点所得到的数据，供用户检查所用。

2. 绘制图像
  
  这部分点击即可，左边生成原数据的折线图，右边生成对应的视频展示（循环无停止）

3. 进行提取（骨架点的提取）

  点击即可，运行完成后会生成对应的骨架点数据并保存在软件内部

4. 两种骨架点的画图模式

  左侧是原数据折线图+骨架点的散点图；右侧是骨架点的折线图。直接在绘图区显示

5. 保存骨架点数据

  会在软件目录下的output文件夹下生成skeleton_points.xlsx文件

  ***特别注意: 由于数据等问题，所提取出的骨架点会存在一些离群值，请手动去除，否则会严重干扰后面的分析***




   
  
