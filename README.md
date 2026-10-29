## Where is it on my local machine?
I have Herd installed so, I added it to my Herd/portfolio-live-preview
## How do I add it to my project?
Create a directory in your project called `.vscode` and add a `settings.json` file to it. Copy this JSON into the file.
```
{
  "portfolioPreview.enabled": true,
  "fiveServer.port": 5500
}
```
## How do I run it?
Restart VS Code with the new settings.json

If it doesn’t run automatically:

Run Developer: Reload Window from the Command Palette (Cmd+Shift+P), or restart VS Code.

Open your portfolio folder. The extension starts Five Server on port 5500 and opens a "Live Preview" panel beside the editor.

Open index.html, edit, and save. Five Server reloads the preview automatically.
