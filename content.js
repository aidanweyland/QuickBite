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

  else if (hostname.includes("foodnetwork.com")) {
    const ingredientEls = document.querySelectorAll('.o-Ingredients__a-Ingredient--CheckboxLabel');
    ingredients = Array.from(ingredientEls)
      .map(el => el.textContent.trim())
      .filter(text => text && text.toLowerCase() !== 'deselect all');

    const stepEls = document.querySelectorAll('.o-Method__m-Step');
    steps = Array.from(stepEls)
      .map(el => el.textContent.trim())
      .filter(text => text.length > 0);
  }
  

else {
    // Generic fallback parser
    const allListItems = document.querySelectorAll('li');
    ingredients = Array.from(allListItems)
      .map(el => el.textContent.trim())
      .filter(text => /[\d\/]+\s\w+|\b(salt|flour|egg|butter|milk|sugar|onion|garlic)\b/i.test(text));

    const allParagraphs = document.querySelectorAll('p');
    steps = Array.from(allParagraphs)
      .map(el => el.textContent.trim())
      .filter(text => /^[A-Z]/.test(text) && /\b(cook|bake|mix|stir|heat|serve|chop|add|combine|simmer)\b/i.test(text));
  }

  return { ingredients, steps };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    const recipe = extractRecipe();
    sendResponse(recipe);
  }
});
