async function convertLatex() {
  let fileInput = document.getElementById("latexFile");
  let format = document.getElementById("format").value;

  if (!fileInput.files.length) {
    alert("Please select a LaTeX file to convert!");
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

    let result = await response.json();
    document.getElementById("output").innerText =
      result.result || "Oops! Something went wrong!";
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "Error: " + error.message;
  }
}
