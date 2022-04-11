const fs = require('fs');
const vscode = require('vscode');
const path = require('path');
const JSON5 = require('json5')

function activate(context) {
    console.log('Congratulations, your extension "wine-fox-translator" is now active!');
    let updateSort = vscode.commands.registerCommand('wine-fox-translator.update-sort', () => updateLanguageFile(false));
    let updateAdd = vscode.commands.registerCommand('wine-fox-translator.update-add', () => updateLanguageFile(true));
    context.subscriptions.push(updateSort);
    context.subscriptions.push(updateAdd);
}

function updateLanguageFile(add) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("请打开中文语言文件！")
        return
    }
    let fileName = path.basename(editor.document.fileName);
    if (fileName !== "zh_cn.json") {
        vscode.window.showErrorMessage("你打开的不是中文语言文件！")
        return
    }
    if (editor.document.isDirty) {
        vscode.window.showErrorMessage("请先保存你当前打开的文件！")
        return
    }
    let zhFile = editor.document.uri.fsPath
    let enFile = path.join(path.dirname(zhFile), "en_us.json")
    if (fs.existsSync(enFile)) {
        handleLanguage(enFile, zhFile, add)
    } else {
        vscode.window.showErrorMessage("同目录下英文文本不存在！")
    }
}

function handleLanguage(enFile, zhFile, add) {
    let enData = JSON5.parse(fs.readFileSync(enFile, { encoding: "utf-8" }))
    let zhData = JSON5.parse(fs.readFileSync(zhFile, { encoding: "utf-8" }))
    let outZhData = {}
    for (let key in enData) {
        if (zhData.hasOwnProperty(key)) {
            outZhData[key] = zhData[key]
        } else if (add) {
            outZhData[key] = enData[key]
        }
    }
    let folder = path.dirname(zhFile)
    let outZhFile = path.join(folder, "zh_cn.json")
    vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(outZhFile),
    }).then(uri =>
        fs.writeFileSync(uri.fsPath, JSON.stringify(outZhData, null, 4), { encoding: "utf-8" })
    )
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}