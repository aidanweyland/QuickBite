document.getElementById("summarize").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "summarize" }, response => {
      const output = document.getElementById("output");
      const summarizeBtn = document.getElementById("summarize");

      // Render the recipe summary
      output.innerHTML = `
        <h3>Ingredients</h3><ul>${response.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h3>Steps</h3><ol>${response.steps.map(s => `<li>${s}</li>`).join("")}</ol>
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
        // Extract ingredients and steps from the DOM
        const ingredients = Array.from(output.querySelectorAll("ul li")).map(li => li.textContent);
        const steps = Array.from(output.querySelectorAll("ol li")).map((li, i) => `${i + 1}. ${li.textContent}`);

        // Format the text
        const textToCopy = `Ingredients:\n${ingredients.join("\n")}\n\nSteps:\n${steps.join("\n")}`;

        // Copy to clipboard silently
        navigator.clipboard.writeText(textToCopy);
      });
    });
  });
});
