async function convertLatex() {
  let fileInput = document.getElementById("latexFile");
  let format = document.getElementById("format").value;

  if (!fileInput.files.length) {
    alert("Please upload a LaTeX file first!");
    return;
  }

  let file = fileInput.files[0];
  let formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  try {
    let response = await fetch("https://latex2all.onrender.com/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Server error! Please try again later.");
    }

    let result = await response.json();
    let outputBox = document.getElementById("output");

    outputBox.value = result.result || "Conversion failed!";
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").value = "Error: " + error.message;
  }
}

// 📋 复制全部文本
function copyToClipboard() {
  let outputBox = document.getElementById("output");
  outputBox.select();
  document.execCommand("copy");
  alert("Copied to clipboard! ");
}

// 💾 导出文件
function exportToFile() {
  let outputBox = document.getElementById("output").value;
  let format = document.getElementById("format").value;
  let fileType =
    format === "html" ? "html" : format === "markdown" ? "md" : "txt";

  let blob = new Blob([outputBox], { type: "text/plain" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `converted.${fileType}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
