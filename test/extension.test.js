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
});