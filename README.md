# Hot Potatoes Mobile Converter

Converts [Hot Potatoes](https://hotpot.uvic.ca/) exercise files (JQuiz, JCloze, JMatch, JMix) into mobile-friendly versions — open the page, drop a `.htm` file, and download the converted result.

## How it works

1. **Injects** `<meta name="viewport">` — the single biggest fix for mobile rendering.
2. **Appends responsive CSS** inside a `@media (max-width: 600px)` block:
   - Enlarges touch targets (buttons, keypad, answer checkboxes) to 44×44px minimum.
   - Stacks side-by-side layout vertically on narrow screens.
   - Fixes the feedback modal (absolute → fixed positioning).
   - Reduces body margins from 5% to 1%.
   - Balances left/right padding on quiz lists.
   - Centers question navigation controls.
   - Scales images to fit within their container.
   - Prevents iOS zoom on input focus (`font-size: 16px`).
   - Enlarges drag-and-drop cards for touch.
3. **Preserves all original JavaScript quiz logic** — only CSS and meta are added; nothing in `<body>` or `<script>` is touched.

## Usage

Open `index.html` in a browser (locally or deployed to Netlify/GitHub Pages), drag a `.htm` file onto the drop zone, and click **Download mobile version**.

## Deploying

Drop the `index.html` and `main.js` files onto [Netlify Drop](https://app.netlify.com/drop) or push them to a GitHub Pages repo. No build step, no server — everything runs in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Converter UI (drop zone + download button) |
| `main.js` | Conversion logic and browser interaction |
| `input/` | (gitignored) Drop your original `.htm` files here |

## Supported exercise types

- JQuiz (multiple choice, short answer, hybrid, multi-select)
- JCloze (gap-fill)
- JMatch (matching, flashcards)
- JMix (jumbled sentences)
- JCross (crosswords)

## License

This project is unlicensed. Hot Potatoes is developed by [Half-Baked Software](https://hotpot.uvic.ca/).
