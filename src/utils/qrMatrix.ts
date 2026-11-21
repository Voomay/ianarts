/**
 * Self-contained pure TypeScript QR Code Matrix Generator
 * Supports Byte mode (UTF-8 / URLs) with Error Correction (Levels L, M, Q, H)
 * Produces standard ISO/IEC 18004 compliant 2D boolean matrices for scannable QR Art rendering.
 */

// Error Correction Levels
export type ECLevel = 'L' | 'M' | 'Q' | 'H';

const EC_CODEWORDS_PER_BLOCK: Record<ECLevel, number[]> = {
  L: [0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28],
  M: [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26],
  Q: [0, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30],
  H: [0, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24]
};

const NUM_ERROR_CORRECTION_BLOCKS: Record<ECLevel, number[]> = {
  L: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8],
  M: [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16],
  Q: [0, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20],
  H: [0, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25]
};

const TOTAL_CODEWORDS = [
  0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085
];

// Galois Field arithmetic for Reed-Solomon coding
const GF_EXP: number[] = new Array(512);
const GF_LOG: number[] = new Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF_EXP[GF_LOG[x] + GF_LOG[y]];
}

function rsComputeRemainder(msg: number[], numEc: number): number[] {
  // Generator polynomial
  let gen = [1];
  for (let i = 0; i < numEc; i++) {
    const nextGen = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      nextGen[j] ^= gfMul(gen[j], GF_EXP[i]);
      nextGen[j + 1] ^= gen[j];
    }
    gen = nextGen;
  }

  const result = new Array(numEc).fill(0);
  for (const b of msg) {
    const factor = b ^ result[0];
    result.shift();
    result.push(0);
    for (let i = 0; i < numEc; i++) {
      result[i] ^= gfMul(gen[i], factor);
    }
  }
  return result;
}

export interface QRMatrixResult {
  size: number;
  matrix: boolean[][];
  version: number;
}

export function generateQRMatrix(text: string, ecLevel: ECLevel = 'M'): QRMatrixResult {
  const utf8Bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    let c = text.charCodeAt(i);
    if (c < 0x80) {
      utf8Bytes.push(c);
    } else if (c < 0x800) {
      utf8Bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0xd800 || c >= 0xe000) {
      utf8Bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      i++;
      c = 0x10000 + (((c & 0x3ff) << 10) | (text.charCodeAt(i) & 0x3ff));
      utf8Bytes.push(
        0xf0 | (c >> 18),
        0x80 | ((c >> 12) & 0x3f),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f)
      );
    }
  }

  // Find minimum version (1 to 20)
  let version = 1;
  while (version <= 20) {
    const totalDataBytes =
      TOTAL_CODEWORDS[version] -
      EC_CODEWORDS_PER_BLOCK[ecLevel][version] * NUM_ERROR_CORRECTION_BLOCKS[ecLevel][version];
    const charCountBits = version < 10 ? 8 : 16;
    const requiredBits = 4 + charCountBits + utf8Bytes.length * 8;
    if (requiredBits <= totalDataBytes * 8) {
      break;
    }
    version++;
  }
  if (version > 20) version = 20;

  const totalDataBytes =
    TOTAL_CODEWORDS[version] -
    EC_CODEWORDS_PER_BLOCK[ecLevel][version] * NUM_ERROR_CORRECTION_BLOCKS[ecLevel][version];
  const charCountBits = version < 10 ? 8 : 16;

  // Bit buffer
  let bitBuf: number[] = [];
  const appendBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitBuf.push((val >> i) & 1);
    }
  };

  // Mode Byte: 0100
  appendBits(4, 4);
  appendBits(utf8Bytes.length, charCountBits);
  for (const b of utf8Bytes) {
    appendBits(b, 8);
  }

  // Terminator
  const maxBits = totalDataBytes * 8;
  const termLen = Math.min(4, maxBits - bitBuf.length);
  appendBits(0, termLen);

  // Byte align
  while (bitBuf.length % 8 !== 0) {
    bitBuf.push(0);
  }

  // Pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuf.length < maxBits) {
    appendBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to bytes
  const dataBytes: number[] = [];
  for (let i = 0; i < bitBuf.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bitBuf[i + b];
    }
    dataBytes.push(byte);
  }

  // Block splitting & RS error correction
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecLevel][version];
  const ecPerBlock = EC_CODEWORDS_PER_BLOCK[ecLevel][version];
  const shortBlockLen = Math.floor(dataBytes.length / numBlocks);
  const numLongBlocks = dataBytes.length % numBlocks;

  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let byteOffset = 0;

  for (let i = 0; i < numBlocks; i++) {
    const isLong = i >= numBlocks - numLongBlocks;
    const len = shortBlockLen + (isLong ? 1 : 0);
    const block = dataBytes.slice(byteOffset, byteOffset + len);
    byteOffset += len;
    dataBlocks.push(block);
    ecBlocks.push(rsComputeRemainder(block, ecPerBlock));
  }

  // Interleave
  const finalCodewords: number[] = [];
  const maxDataBlockLen = shortBlockLen + (numLongBlocks > 0 ? 1 : 0);
  for (let i = 0; i < maxDataBlockLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i < dataBlocks[b].length) {
        finalCodewords.push(dataBlocks[b][i]);
      }
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(ecBlocks[b][i]);
    }
  }

  // Matrix construction
  const size = 17 + 4 * version;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunction = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      isFunction[r][c] = true;
    }
  };

  // Finder patterns
  const drawFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBlack =
          r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        setFunction(top + r, left + c, isBlack);
      }
    }
    // Separator
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          setFunction(top + r, left + c, false);
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Alignment patterns for version >= 2
  const ALIGNMENT_LOCATIONS: Record<number, number[]> = {
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
    11: [6, 30, 54],
    12: [6, 32, 58],
    13: [6, 34, 62],
    14: [6, 26, 46, 66],
    15: [6, 26, 48, 70],
    16: [6, 26, 50, 74],
    17: [6, 30, 54, 78],
    18: [6, 30, 56, 82],
    19: [6, 30, 58, 86],
    20: [6, 34, 62, 90]
  };

  if (version >= 2 && ALIGNMENT_LOCATIONS[version]) {
    const locs = ALIGNMENT_LOCATIONS[version];
    for (const r of locs) {
      for (const c of locs) {
        if (
          (r === 6 && c === 6) ||
          (r === 6 && c === locs[locs.length - 1]) ||
          (r === locs[locs.length - 1] && c === 6)
        ) {
          continue;
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBlack =
              Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            setFunction(r + dr, c + dc, isBlack);
          }
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  // Dark module
  setFunction(4 * version + 9, 8, true);

  // Reserve format information areas
  for (let i = 0; i < 9; i++) {
    setFunction(8, i, false);
    setFunction(i, 8, false);
  }
  for (let i = size - 8; i < size; i++) {
    setFunction(8, i, false);
    setFunction(i, 8, false);
  }

  // Write Data bits
  const finalBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let b = 7; b >= 0; b--) {
      finalBits.push((cw >> b) & 1);
    }
  }

  let bitIndex = 0;
  let right = size - 1;
  let upward = true;

  while (right > 0) {
    if (right === 6) right--; // Skip timing column
    const cols = [right, right - 1];
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of cols) {
        if (!isFunction[r][c]) {
          const bit = bitIndex < finalBits.length ? finalBits[bitIndex++] : 0;
          matrix[r][c] = bit === 1;
        }
      }
    }
    right -= 2;
    upward = !upward;
  }

  // Apply Mask Pattern 0: (row + col) % 2 === 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c]) {
        if ((r + c) % 2 === 0) {
          matrix[r][c] = !matrix[r][c];
        }
      }
    }
  }

  // Format info (Mask 0 + EC Level M -> format bits: 101010000010010)
  // Format bit lookup
  const FORMAT_BITS: Record<ECLevel, number[]> = {
    L: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    M: [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    Q: [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    H: [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1]
  };

  const fBits = FORMAT_BITS[ecLevel];
  // Top left
  const formatCoordsTop = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = formatCoordsTop[i];
    matrix[r][c] = fBits[i] === 1;
  }

  // Bottom / Right
  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = fBits[i] === 1;
  }
  for (let i = 7; i < 15; i++) {
    matrix[8][size - 15 + i] = fBits[i] === 1;
  }

  return {
    size,
    matrix: matrix.map((row) => row.map((cell) => cell ?? false)),
    version
  };
}
