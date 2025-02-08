async function convertLatex() {
  const fileInput = document.getElementById("latexFile");
  const format = document.getElementById("format").value;
  const outputBox = document.getElementById("output");

  if (!fileInput.files.length) {
    showFeedback("⚠️ Please upload a LaTeX file first!", 3000);
    return;
  }

  try {
    // Show converting status
    outputBox.value =
      "Converting... ⌛ (This might take a few seconds due to free-tier processing)";

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    const response = await fetch("https://latex2all.onrender.com/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Server error. Please try again later.");
    }

    const result = await response.json();
    outputBox.value =
      result.result || "Conversion failed - no output generated";
    showFeedback("Conversion completed!", 2000);
  } catch (error) {
    console.error("Conversion error:", error);
    outputBox.value = `Error: ${error.message}`;
    showFeedback("Conversion failed!", 3000);
  }
}

// 📋 Copy to clipboard with modern API
async function copyToClipboard() {
  try {
    const output = document.getElementById("output").value;
    await navigator.clipboard.writeText(output);
    showFeedback("Copied to clipboard!", 2000);
  } catch (err) {
    showFeedback("Failed to copy!", 3000);
  }
}

// 💾 Export file with better naming
function exportToFile() {
  const output = document.getElementById("output").value;
  const format = document.getElementById("format").value;
  const extensions = {
    html: "html",
    markdown: "md",
    text: "txt",
  };

  try {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const filename = `converted-${Date.now()}.${extensions[format] || "txt"}`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    showFeedback("File downloaded!", 2000);
  } catch (error) {
    console.error("Export error:", error);
    showFeedback("Export failed!", 3000);
  }
}
