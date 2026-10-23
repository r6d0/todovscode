class Document {
    constructor(text, scheme) {
        this.text = text
        this.uri = { scheme: scheme }
    }

    getText() {
        return this.text
    }

    positionAt(index) {
        return index
    }

    lineAt(number) {
        return {
            number: number,
            range: new Range(0, this.text.length - 1)
        }
    }
}

class Range {
    constructor(start, end) {
        this.start = start
        this.end = end
    }
}

class Workspace {
    getConfiguration(name) {
        return this[name]
    }

    onDidChangeTextDocument(callback) { }

    onDidChangeConfiguration(callback) { }
}

class Window {
    createTextEditorDecorationType(data) {
        data.dispose = () => {}
        return data
    }
    onDidChangeActiveTextEditor(callback) { }
}

module.exports = {
    Document,
    Range,
    workspace: new Workspace(),
    window: new Window(),
    OverviewRulerLane: {
        Right: 0
    },
    DecorationRangeBehavior: {
        ClosedClosed: 0
    }
};