export function justifyText(text: string, lineWidth: number = 80): string {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    if (currentLength + word.length + currentLine.length > lineWidth) {
      lines.push(justifyLine(currentLine, lineWidth));
      currentLine = [word];
      currentLength = word.length;
    } else {
      currentLine.push(word);
      currentLength += word.length;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines.join('\n');
}

export function justifyLine(words: string[], lineWidth: number): string {
  if (words.length === 1) {
    return words[0]!;
  }

  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
  const totalSpaces = lineWidth - totalWordLength;
  const gaps = words.length - 1;
  const spacesPerGap = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;

  let result = '';
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if (i < words.length - 1) {
      result += ' '.repeat(spacesPerGap + (i < extraSpaces ? 1 : 0));
    }
  }

  return result;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

export function resetIfNewDay(tokenData: { wordCount: number; lastReset: Date }): void {
  const now = new Date();
  const lastReset = tokenData.lastReset;
  
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    tokenData.wordCount = 0;
    tokenData.lastReset = now;
  }
}


