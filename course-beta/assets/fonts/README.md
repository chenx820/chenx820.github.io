# 课程网页字体

本目录的 `spaceqat-course-sans.woff2` 来自 Adobe 思源黑体简体中文可变字体 Source Han Sans CN VF 2.005，保留 250–900 字重轴，按当前课程文字和 Latin-1 字符集制作网页子集。

- 上游：[Adobe Source Han Sans](https://github.com/adobe-fonts/source-han-sans)
- 原文件：`Variable/WOFF2/TTF/Subset/SourceHanSansCN-VF.ttf.woff2`（release 分支）
- 下载：[上游文件的 jsDelivr 镜像](https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/Variable/WOFF2/TTF/Subset/SourceHanSansCN-VF.ttf.woff2)
- 原文件 SHA-256：`f971e3bff46f76b49e1d5510556c2297c618ec4b491a295a4e741cdd38257799`
- 许可证：`SourceHanSans-LICENSE.txt`（SIL OFL 1.1）

按许可证的保留字体名称要求，子集的内部名称为 `SpaceQat Course Sans`，字形仍来自思源黑体。网站自行托管字体，无需访问外部字体服务。数学公式继续使用 KaTeX 字体，代码保留等宽字体。

新增课程文字后，用原文件重建子集，以包含新出现的字：

```sh
python3 -m pip install 'fonttools[woff]'
python3 scripts/subset-font.py /path/to/SourceHanSansCN-VF.woff2
```

脚本扫描 `index.html` 和 `js/`。未收录字符会使用 CSS 中的系统后备字体。更新字体文件后，应更新 CSS 字体 URL 的版本参数，避免浏览器继续使用旧子集。

## 旅程卡标题字体

`spaceqat-journey-play.woff2` 为 [ZCOOL KuaiLe](https://github.com/google/fonts/tree/main/ofl/zcoolkuaile) 的本地标题子集，仅包含“我完成了量子之旅”八字。采用 SIL OFL 1.1，许可证保存在 `ZCOOLKuaiLe-LICENSE.txt`；内部名称为 `SpaceQat Journey Play`。源自 Google Fonts 的 `text=` 标题子集，使用 FontTools 转为 WOFF2。页面与导出等待本地字体加载完成，不在运行时访问外部字体服务。修改标题时需重新生成子集。
