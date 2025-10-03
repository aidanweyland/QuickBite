function extractRecipe() {
  const hostname = window.location.hostname;
  let ingredients = [];
  let steps = [];

  if (hostname.includes("allrecipes.com")) {
    //Structured ingredients
    const ingredientItems = document.querySelectorAll('li.mm-recipes-structured-ingredients__list-item');
    ingredients = Array.from(ingredientItems).map(item => {
      const quantity = item.querySelector('[data-ingredient-quantity="true"]')?.textContent.trim() || '';
      const unit = item.querySelector('[data-ingredient-unit="true"]')?.textContent.trim() || '';
      const name = item.querySelector('[data-ingredient-name="true"]')?.textContent.trim() || '';
      return [quantity, unit, name].filter(Boolean).join(' ');
    });

    //Structured steps
    const stepItems = document.querySelectorAll('div.mm-recipes-steps__content ol > li');
    steps = Array.from(stepItems).map(item => {
      const text = item.querySelector('p')?.textContent.trim();
      return text || '';
    }).filter(text => text.length > 0);
  }

  return { ingredients, steps };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    const recipe = extractRecipe();
    sendResponse(recipe);
  }
});