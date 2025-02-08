async function convertLatex() {
  let fileInput = document.getElementById("latexFile");
  let format = document.getElementById("format").value;

  if (!fileInput.files.length) {
    alert("请上传 LaTeX 文件！");
    return;
  }

  let file = fileInput.files[0];
  let formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  let response = await fetch("https://latex2all.onrender.com", {
    // 替换为你的 Render API 地址
    method: "POST",
    body: formData,
  });

  let result = await response.json();
  document.getElementById("output").innerText = result.result || "转换失败";
}
