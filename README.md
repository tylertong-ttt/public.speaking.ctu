# FACT, NOT FLUFF — Chapter 7

Static one-page presentation website for **Public Speaking · Chapter 7: Gathering Materials**.

## What's updated
- Five-part overview cards use a spacious responsive grid to prevent text from overflowing.
- Each speaker/topic title opens a detail window.
- Use **Edit this topic** on a card or in its detail window to edit the name, title, summary/full text, keywords and three steps.
- Upload a landscape image (16:9 recommended) from the card or topic editor.
- Use the × button on a card or **Remove image** in the topic editor to hide/remove an image.
- Content and images are saved in this browser's localStorage. Export JSON to back up or move changes to another browser.

## Files
- `index.html` — page structure
- `styles.css` — layout and responsive styles
- `app.js` — topic data, detail editor, image and local storage logic
- `assets/logo.png` — workshop logo

## Run locally
Open `index.html` in a browser, or open this folder in VS Code and run it with Live Server.

## GitHub Pages
Upload the contents of this folder to the repository root, keeping `assets/logo.png` in the `assets` folder. Then enable **Settings → Pages → Deploy from a branch → main → / (root)**.

## Note
This is a static site. Local edits are not automatically published to GitHub Pages. Export the JSON for backup; editing the source files and redeploying is required to change the public site for everyone.
