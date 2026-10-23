const vscode = require('vscode');

const DEBOUNCE_TIMEOUT = 100
const CONFIG_NAME = 'todovscode'

let timer
let tagsConfig = []

function isFile(editor) {
    return editor.document.uri.scheme === 'file'
}

function isCorrectLeftBoundary(symbol) {
    if (symbol.length > 0) {
        return symbol == ' ' || symbol == '\n' || symbol == '\r' || symbol == '\t'
    }
    return false
}

function isCorrectRightBoundary(symbol) {
    if (symbol.length > 0) {
        return symbol == ' ' || symbol == '.' || symbol == ',' || symbol == ':' || symbol == '\n' || symbol == '\r' || symbol == '\t'
    }
    return false
}

function getPositions(document, tag) {
    let text = document.getText()
    const txLength = text.length
    const kwLength = tag.length

    let index = 0
    let result = []
    while (index != -1) {
        index = text.indexOf(tag, index)

        if (index != -1) {
            let left = ''
            if (index > 0) {
                left = text.charAt(index - 1)
            }

            let right = ''
            if (index < txLength) {
                right = text.charAt(index + kwLength)
            }

            if (isCorrectLeftBoundary(left) && isCorrectRightBoundary(right)) {
                const start = document.positionAt(index)
                const line = document.lineAt(start.line)

                result.push({ range: new vscode.Range(start, line.range.end) })
            }
            index++
        }
    }
    return result
}

function getTagsConfig() {
    const tags = []
    const config = vscode.workspace.getConfiguration(CONFIG_NAME);
    if (config) {
        for (let item of config.tags) {
            tags.push({
                tag: item.tag,
                decoration: vscode.window.createTextEditorDecorationType({
                    color: item.foreground,
                    overviewRulerColor: item.foreground,
                    overviewRulerLane: vscode.OverviewRulerLane.Right,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                })
            })
        }
    }
    return tags
}

async function analyzeOpenEditor(editor, tags) {
    for (let item of tags) {
        const positions = getPositions(editor.document, item.tag)
        if (positions.length > 0) {
            editor.setDecorations(item.decoration, positions)
        }
    }
}

async function onDidChangeTextDocument(event) {
    const editor = vscode.window.activeTextEditor
    if (editor && isFile(editor)) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            for (let item of tagsConfig) {
                editor.setDecorations(item.decoration, [])
            }
            analyzeOpenEditor(editor, tagsConfig)
        }, DEBOUNCE_TIMEOUT)
    }
}

async function onDidChangeActiveTextEditor(editor) {
    if (editor && isFile(editor)) {
        analyzeOpenEditor(editor, tagsConfig)
    }
}

async function onDidChangeConfiguration(event) {
    if (event.affectsConfiguration(CONFIG_NAME)) {
        for (let item of tagsConfig) {
            item.decoration.dispose()
        }
        tagsConfig = getTagsConfig()
    }
}

async function activate(context) {
    tagsConfig = getTagsConfig()

    const editor = vscode.window.activeTextEditor
    if (editor && isFile(editor)) {
        analyzeOpenEditor(editor, tagsConfig)
    }

    const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor)
    const changeTextDocument = vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument)
    const changeConfiguration = vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration)

    context.subscriptions.push(changeActiveTextEditor, changeTextDocument, changeConfiguration);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
    getPositions,
    isCorrectLeftBoundary,
    isCorrectRightBoundary,
    getTagsConfig,
    analyzeOpenEditor,
    onDidChangeActiveTextEditor,
    onDidChangeTextDocument,
    onDidChangeConfiguration
}