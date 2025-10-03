document.getElementById("summarize").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "summarize" }, response => {
      const output = document.getElementById("output");
      const summarizeBtn = document.getElementById("summarize");

      // Render the recipe summary with collapsible sections
      output.innerHTML = `
        <details open>
          <summary><h3>Ingredients</h3></summary>
          <ul>${response.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        </details>
        <details open>
          <summary><h3>Steps</h3></summary>
          <ol>${response.steps.map(s => `<li>${s}</li>`).join("")}</ol>
        </details>
      `;

      // Remove the summarize button
      summarizeBtn.remove();

      // Create and insert the copy button
      const copyBtn = document.createElement("button");
      copyBtn.id = "copy";
      copyBtn.textContent = "Copy to Clipboard";
      copyBtn.style.marginBottom = "10px";
      output.before(copyBtn); // Insert above the output

      // Add copy functionality
      copyBtn.addEventListener("click", () => {
        const ingredients = Array.from(output.querySelectorAll("ul li")).map(li => li.textContent);
        const steps = Array.from(output.querySelectorAll("ol li")).map((li, i) => `${i + 1}. ${li.textContent}`);
        const textToCopy = `Ingredients:\n${ingredients.join("\n")}\n\nSteps:\n${steps.join("\n")}`;
        navigator.clipboard.writeText(textToCopy);
      });

      // Create and insert the Save as PDF button
      const pdfBtn = document.createElement("button");
      pdfBtn.id = "savePdf";
      pdfBtn.textContent = "Save as PDF";
      pdfBtn.style.marginBottom = "10px";
      output.before(pdfBtn); // Insert above the output

      // Add Save as PDF functionality
      pdfBtn.addEventListener("click", () => {
        const recipeWindow = window.open("", "", "width=600,height=800");
        recipeWindow.document.write(`
          <html>
            <head>
              <title>Recipe Summary</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                h3 { color: #333; }
                ul, ol { padding-left: 20px; }
                details { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              ${output.innerHTML}
            </body>
          </html>
        `);
        recipeWindow.document.close();
        recipeWindow.onload = () => {
          recipeWindow.print();
        };
      });
    });
  });
});
