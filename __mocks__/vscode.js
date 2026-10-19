class Document {
    constructor(text) {
        this.text = text
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
            range: new Range(0, this.text.length-1)
        }
    }
}

class Range {
    constructor(start, end) {
        this.start = start
        this.end = end
    }
}

module.exports = {
    Document,
    Range
};