const vscode = require('vscode');

const DEBOUNCE_TIMEOUT = 100
const CONFIG_NAME = 'todovscode'

let tagsConfig = []

function isFile(editor) {
    return editor.document.uri.scheme === 'file'
}

function isCorrectLeftBoundary(symbol) {
    if (symbol.length > 0) {
        return symbol == ' ' || symbol == '\n' || symbol == '\r'
    }
    return false
}

function isCorrectRightBoundary(symbol) {
    if (symbol.length > 0) {
        return symbol == ' ' || symbol == '.' || symbol == ',' || symbol == ':' || symbol == '\n' || symbol == '\r'
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
    const config = vscode.workspace.getConfiguration(CONFIG_NAME);
    const tags = []
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
    return tags
}

async function analyzeOpenEditor(editor) {
    for (let item of tagsConfig) {
        const positions = getPositions(editor.document, item.tag)
        if (positions.length > 0) {
            editor.setDecorations(item.decoration, positions)
        }
    }
}

async function activate(context) {
    tagsConfig = getTagsConfig()

    const editor = vscode.window.activeTextEditor
    if (editor && isFile(editor)) {
        analyzeOpenEditor(editor)
    }

    const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(async editor => {
        if (editor && isFile(editor)) {
            analyzeOpenEditor(editor)
        }
    })

    let timer
    const changeTextDocument = vscode.workspace.onDidChangeTextDocument(async event => {
        const editor = vscode.window.activeTextEditor
        if (editor && isFile(editor)) {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                for (let item of tagsConfig) {
                    editor.setDecorations(item.decoration, [])
                }
                analyzeOpenEditor(editor)
            }, DEBOUNCE_TIMEOUT)
        }
    })

    const changeConfiguration = vscode.workspace.onDidChangeConfiguration(async event => {
        if (event.affectsConfiguration(CONFIG_NAME)) {
            for (let item of tagsConfig) {
                item.decoration.dispose()
            }
            tagsConfig = getTagsConfig()
        }
    })

    context.subscriptions.push(changeActiveTextEditor, changeTextDocument, changeConfiguration);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
    getPositions,
    isCorrectLeftBoundary,
    isCorrectRightBoundary
}