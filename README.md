# TECHFEST 3D Experience

A responsive, futuristic landing page built with HTML, CSS, JavaScript and Three.js.

## Run locally
1. Extract the ZIP.
2. Open a terminal in this folder.
3. Start a local server (recommended because the 3D scene uses JavaScript modules):
   - Python: `python -m http.server 8000`
   - Or VS Code: install/use the Live Server extension.
4. Open `http://localhost:8000`.

The page loads Three.js and Google Fonts from CDNs, so an internet connection is required for the full 3D experience.

## Publish for submission
### GitHub Pages
1. Create a GitHub repository, e.g. `techfest-3d-experience`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Wait for the published URL to appear in the Pages section. Open it and test on your phone.
6. Submit that live URL in the Techfest task form.

### Alternative: Netlify
Drag the extracted project folder into Netlify's manual deploy area, then test the generated public URL before submitting.

## Before you submit
- Open the deployed site on mobile.
- Drag the 3D object to confirm interaction works.
- Scroll through all sections.
- If the task asks for a screen recording, record the deployed site and upload the video to Google Drive with access set to **Anyone with the link — Viewer**.
