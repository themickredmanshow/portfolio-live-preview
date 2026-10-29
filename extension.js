const vscode = require('vscode');

let panel;

function previewUrl() {
  const port = vscode.workspace.getConfiguration('fiveServer').get('port', 5500);
  return `http://localhost:${port}/`;
}

async function startServer() {
  if (!vscode.workspace.workspaceFolders?.length) {
    return;
  }
  try {
    await vscode.commands.executeCommand('fiveServer.start');
    // Five Server returns before it is listening, so give it a moment.
    await new Promise((resolve) => setTimeout(resolve, 1500));
  } catch (err) {
    vscode.window.showWarningMessage(`Portfolio Preview: could not start Five Server (${err.message}).`);
  }
}

function showPreview() {
  const url = previewUrl();

  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside, true);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'portfolioPreview',
    'Live Preview',
    { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; frame-src http://localhost:* http://127.0.0.1:*; style-src 'unsafe-inline';">
  <style>html, body, iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: 0; }</style>
</head>
<body>
  <iframe src="${url}"></iframe>
</body>
</html>`;

  panel.onDidDispose(() => {
    panel = undefined;
  });
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('portfolioPreview.start', async () => {
      await startServer();
      showPreview();
    }),
    vscode.commands.registerCommand('portfolioPreview.show', () => showPreview())
  );

  // Auto-start only in workspaces that opt in with portfolioPreview.enabled.
  const enabled = vscode.workspace.getConfiguration('portfolioPreview').get('enabled', false);
  if (enabled) {
    startServer().then(() => showPreview());
  }
}

function deactivate() {
  panel?.dispose();
  return vscode.commands.executeCommand('fiveServer.close').catch(() => {});
}

module.exports = { activate, deactivate };
