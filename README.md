# QuickBite

QuickBite extracts recipe ingredients and steps from a webpage and shows a compact summary in the extension popup.

## How to install locally

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and pick this project folder.

## How to use

- Open any recipe page and click the QuickBite icon.
- Click **Summarize Recipe**.
- Use **Copy to Clipboard** to copy a plain-text summary.
- Use **Save as PDF** to open a printable summary and save or print it.

## Files

- `manifest.json` — extension configuration.
- `popup.html` — popup markup.
- `styles.css` — popup styling.
- `popup.js` — popup logic for UI, copy, and PDF.
- `content.js` — page parser for ingredients and steps.
- `background.js` — optional service worker.
- `icon.png` — toolbar icon.

## How it works

- `popup.js` sends a message `{ action: "summarize" }` to the active tab.
- `content.js` listens and runs `extractRecipe()` to parse the page, returning `{ ingredients, steps }`.
- `popup.js` renders results inside `<details>` elements, adds a Copy button and a Save as PDF button.

## Development notes and improvements

- Parsers for site-specific structure:
  - AllRecipes: queries structured ingredient and step selectors.
  - Food Network: queries structured selectors used by the site.
  - Generic fallback: looks for list items and paragraphs and filters by heuristics.
- To add site support, add hostname checks in `extractRecipe()` and use selectors matching the site HTML.
- Consider sanitizing returned text to remove inline ads or extra whitespace.
- Consider using schema.org Recipe JSON-LD when available for more reliable extraction.

## Troubleshooting

- If Summarize Recipe does nothing:
  - Ensure the extension is loaded and popup console shows no errors.
  - Ensure the active tab contains a page where `content.js` can run (not Chrome Web Store or internal chrome:// pages).
- If returned arrays are empty:
  - The page structure may differ from the selectors; update selectors in `content.js`.
  - The site may dynamically load content; a small delay or observing mutations may occur.

## Contributing

- Update or add site parsers in `content.js`.
- Keep UI minimal and accessible.
- Share pull requests with clear test pages and examples.

## License

MIT
