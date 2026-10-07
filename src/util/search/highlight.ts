// Finds a micro chunk's text in a rendered document and highlights it.
//
// The chunk text was extracted from the document on the server, so it differs from the rendered DOM
// text in whitespace, line breaks, case and invisible characters. Both sides are therefore normalized
// the same way (see normalize) and compared, while every normalized character remembers the text node
// and offset it came from, so a match can be mapped back to the DOM.

type TextIndex = {
  text: string
  nodes: Array<Text>
  offsets: Array<number>
}

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'])
// Soft hyphen, zero-width space/joiners, word joiner, byte order mark.
const INVISIBLE = /[\u00AD\u200B-\u200D\u2060\uFEFF]/

// Characters that are compared, as 0..n characters (NFKC can expand ligatures such as "ﬁ" into "fi").
function normalizeChar (char: string): string {
  if (/\s/.test(char) || INVISIBLE.test(char)) {
    return ''
  }
  return char.normalize('NFKC').toLowerCase().replace(/\s/g, '')
}

export function normalize (text: string): string {
  let result = ''
  for (const char of text) {
    result += normalizeChar(char)
  }
  return result
}

export function buildTextIndex (root: Node): TextIndex {
  const doc = root.ownerDocument ?? (root as Document)
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode (node) {
      let el = node.parentElement
      while (el) {
        if (SKIPPED_TAGS.has(el.tagName)) {
          return NodeFilter.FILTER_REJECT
        }
        el = el.parentElement
      }
      return NodeFilter.FILTER_ACCEPT
    }
  })
  const parts: Array<string> = []
  const nodes: Array<Text> = []
  const offsets: Array<number> = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const value = node.nodeValue ?? ''
    for (let i = 0; i < value.length; i++) {
      let char = value[i]
      // Keep surrogate pairs together, so astral characters normalize correctly.
      const code = value.charCodeAt(i)
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < value.length) {
        char = value.slice(i, i + 2)
      }
      const normalized = normalizeChar(char)
      for (const part of normalized) {
        parts.push(part)
        nodes.push(node)
        offsets.push(i)
      }
      i += char.length - 1
    }
  }
  return { text: parts.join(''), nodes, offsets }
}

const ANCHOR_LENGTH = 30

// Returns the [start, end) range of the needle in the haystack (both normalized), or undefined.
// Tries an exact match first. Otherwise the start and end are located through short anchors taken
// from the beginning and the end of the needle, which tolerates small differences in between.
export function findText (haystack: string, needle: string): { start: number, end: number } | undefined {
  if (needle.length === 0 || haystack.length === 0) {
    return undefined
  }
  const exact = haystack.indexOf(needle)
  if (exact !== -1) {
    return { start: exact, end: exact + needle.length }
  }
  if (needle.length <= ANCHOR_LENGTH) {
    return undefined
  }
  let start = -1
  for (let i = 0; i + ANCHOR_LENGTH <= needle.length; i += ANCHOR_LENGTH) {
    const pos = haystack.indexOf(needle.substr(i, ANCHOR_LENGTH))
    if (pos !== -1) {
      start = Math.max(0, pos - i)
      break
    }
  }
  if (start === -1) {
    return undefined
  }
  // The end anchor must lie after the start and not unreasonably far from it.
  let end = -1
  for (let j = needle.length; j - ANCHOR_LENGTH >= 0; j -= ANCHOR_LENGTH) {
    const pos = haystack.indexOf(needle.substring(j - ANCHOR_LENGTH, j), start)
    if (pos !== -1 && pos - start <= needle.length * 2) {
      end = pos + ANCHOR_LENGTH + (needle.length - j)
      break
    }
  }
  if (end === -1) {
    end = start + needle.length
  }
  return { start, end: Math.min(end, haystack.length) }
}

// Wraps the DOM text behind index positions [start, end) in <mark> elements and returns them.
export function markIndexRange (index: TextIndex, start: number, end: number): Array<HTMLElement> {
  // One segment per text node: the first and last character offset to mark within it.
  const segments: Array<{ node: Text, from: number, to: number }> = []
  for (let i = start; i < end; i++) {
    const node = index.nodes[i]
    const offset = index.offsets[i]
    const last = segments[segments.length - 1]
    if (last && last.node === node) {
      last.to = offset + 1
    } else {
      segments.push({ node, from: offset, to: offset + 1 })
    }
  }
  const marks: Array<HTMLElement> = []
  for (const { node, from, to } of segments) {
    const doc = node.ownerDocument
    const parent = node.parentNode
    if (!doc || !parent) {
      continue
    }
    let target = node
    if (from > 0) {
      target = target.splitText(from)
    }
    if (to - from < target.length) {
      target.splitText(to - from)
    }
    const mark = doc.createElement('mark')
    target.parentNode!.insertBefore(mark, target)
    mark.appendChild(target)
    marks.push(mark)
  }
  return marks
}

// Highlights the chunk text in the document below root. Returns the created <mark> elements
// (empty if the text could not be found).
export function highlightText (root: Node, chunkText: string): Array<HTMLElement> {
  const index = buildTextIndex(root)
  const match = findText(index.text, normalize(chunkText))
  if (match === undefined) {
    return []
  }
  return markIndexRange(index, match.start, match.end)
}
