const vscode = require('vscode');
const ext = require('../extension.js')

test('getPositions returns empty array', () => {
  const result = ext.getPositions(new vscode.Document(''), 'TODO')

  expect(result).not.toBeNull()
  expect(result.length).toBe(0)
});

test('getPositions returns position', () => {
  const result = ext.getPositions(new vscode.Document('// TODO. example 1'), 'TODO')

  expect(result).not.toBeNull()
  expect(result[0].range.start).toBe(3)
  expect(result[0].range.end).toBe(17)
});

test('isCorrectLeftBoundary returns false', () => {
  expect(ext.isCorrectLeftBoundary('')).toBeFalsy()
  expect(ext.isCorrectLeftBoundary(')')).toBeFalsy()
});

test('isCorrectLeftBoundary returns true', () => {
  expect(ext.isCorrectLeftBoundary(' ')).toBeTruthy()
  expect(ext.isCorrectLeftBoundary('\n')).toBeTruthy()
  expect(ext.isCorrectLeftBoundary('\r')).toBeTruthy()
  expect(ext.isCorrectLeftBoundary('\t')).toBeTruthy()
});

test('isCorrectRightBoundary returns false', () => {
  expect(ext.isCorrectRightBoundary('')).toBeFalsy()
  expect(ext.isCorrectRightBoundary(')')).toBeFalsy()
});

test('isCorrectRightBoundary returns true', () => {
  expect(ext.isCorrectRightBoundary(' ')).toBeTruthy()
  expect(ext.isCorrectRightBoundary('.')).toBeTruthy()
  expect(ext.isCorrectRightBoundary(',')).toBeTruthy()
  expect(ext.isCorrectRightBoundary(':')).toBeTruthy()
  expect(ext.isCorrectRightBoundary('\n')).toBeTruthy()
  expect(ext.isCorrectRightBoundary('\r')).toBeTruthy()
  expect(ext.isCorrectRightBoundary('\t')).toBeTruthy()
});

test('getTagsConfig returns empty array', () => {
  const result = ext.getTagsConfig()
  expect(result.length).toBe(0)
})

test('getTagsConfig returns config', () => {
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }

  const result = ext.getTagsConfig()
  expect(result.length).toBe(1)

  vscode.workspace.todovscode = undefined
})

test('analyzeOpenEditor positions is empty', () => {
  const setDecorations = jest.fn()
  ext.analyzeOpenEditor({ document: new vscode.Document(''), setDecorations: setDecorations }, [{ tag: 'TODO' }])

  expect(setDecorations).not.toHaveBeenCalled()
})

test('analyzeOpenEditor positions is not empty', () => {
  const setDecorations = jest.fn()
  ext.analyzeOpenEditor({ document: new vscode.Document('// TODO. example 1.'), setDecorations: setDecorations }, [{ tag: 'TODO' }])

  expect(setDecorations).toHaveBeenCalled()
})

test('activate no active editor', () => {
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }

  ext.activate({ subscriptions: [] })

  vscode.workspace.todovscode = undefined
})

test('activate active editor is not file', () => {
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.window.activeTextEditor = { document: { uri: { scheme: 'not_file' } } }

  ext.activate({ subscriptions: [] })

  vscode.workspace.todovscode = undefined
  vscode.window.activeTextEditor = undefined
})

test('activate analyze active editor', () => {
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.window.activeTextEditor = { document: new vscode.Document('', 'file') }

  ext.activate({ subscriptions: [] })

  vscode.workspace.todovscode = undefined
  vscode.window.activeTextEditor = undefined
})

test('subscribe onDidChangeActiveTextEditor', () => {
  const onDidChangeActiveTextEditor = jest.fn()
  
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.window.activeTextEditor = { document: new vscode.Document('', 'not_file') }
  vscode.window.onDidChangeActiveTextEditor = onDidChangeActiveTextEditor


  ext.activate({ subscriptions: [] })
  expect(onDidChangeActiveTextEditor).toHaveBeenCalled()

  vscode.workspace.todovscode = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})

test('subscribe onDidChangeTextDocument', () => {
  const onDidChangeTextDocument = jest.fn()
  
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.workspace.onDidChangeTextDocument = onDidChangeTextDocument
  vscode.window.activeTextEditor = { document: new vscode.Document('', 'not_file') }
  vscode.window.onDidChangeActiveTextEditor = () => {}

  ext.activate({ subscriptions: [] })
  expect(onDidChangeTextDocument).toHaveBeenCalled()

  vscode.workspace.todovscode = undefined
  vscode.workspace.onDidChangeTextDocument = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})

test('subscribe onDidChangeConfiguration', () => {
  const onDidChangeConfiguration = jest.fn()
  
  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.workspace.onDidChangeTextDocument = () => {}
  vscode.workspace.onDidChangeConfiguration = onDidChangeConfiguration
  vscode.window.activeTextEditor = { document: new vscode.Document('', 'not_file') }
  vscode.window.onDidChangeActiveTextEditor = () => {}

  ext.activate({ subscriptions: [] })
  expect(onDidChangeConfiguration).toHaveBeenCalled()

  vscode.workspace.todovscode = undefined
  vscode.workspace.onDidChangeTextDocument = undefined
  vscode.workspace.onDidChangeConfiguration = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})

test('trigger onDidChangeActiveTextEditor', () => {
  const setDecorations = jest.fn()

  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.workspace.onDidChangeTextDocument = () => {}
  vscode.workspace.onDidChangeConfiguration = () => {}
  vscode.window.activeTextEditor = { document: new vscode.Document('', 'file'), setDecorations: setDecorations }
  vscode.window.onDidChangeActiveTextEditor = () => {}
  ext.activate({ subscriptions: [] })

  ext.onDidChangeActiveTextEditor(vscode.window.activeTextEditor)

  expect(setDecorations).not.toHaveBeenCalled()

  vscode.workspace.todovscode = undefined
  vscode.workspace.onDidChangeTextDocument = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})

test('trigger onDidChangeTextDocument', () => {
  const setDecorations = jest.fn()

  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.workspace.onDidChangeTextDocument = () => {}
  vscode.workspace.onDidChangeConfiguration = () => {}
  vscode.window.activeTextEditor = { document: new vscode.Document('// TODO. example 1.', 'file'), setDecorations: setDecorations }
  vscode.window.onDidChangeActiveTextEditor = () => {}
  // ext.activate({ subscriptions: [] })

  ext.onDidChangeTextDocument({})

  vscode.workspace.todovscode = undefined
  vscode.workspace.onDidChangeTextDocument = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})

test('trigger onDidChangeConfiguration', () => {
  const setDecorations = jest.fn()

  vscode.workspace.todovscode = { tags: [{ tag: 'TODO', foreground: '#ffc107cc' }] }
  vscode.workspace.onDidChangeTextDocument = () => {}
  vscode.workspace.onDidChangeConfiguration = () => {}
  vscode.window.activeTextEditor = { document: new vscode.Document('// TODO. example 1.', 'file'), setDecorations: setDecorations }
  vscode.window.onDidChangeActiveTextEditor = () => {}

  ext.onDidChangeConfiguration({affectsConfiguration: () => true})

  vscode.workspace.todovscode = undefined
  vscode.workspace.onDidChangeTextDocument = undefined
  vscode.window.activeTextEditor = undefined
  vscode.window.onDidChangeActiveTextEditor = undefined
})