import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'dist-ssr', 'output', 'coverage'])
const ignoredFiles = new Set(['package-lock.json'])
const textExtensions = new Set([
  '',
  '.css',
  '.gitignore',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
])
const protectedBinaryExtensions = new Set([
  '.doc',
  '.docx',
  '.jpeg',
  '.jpg',
  '.pages',
  '.pdf',
  '.png',
  '.ppt',
  '.pptx',
  '.rtf',
  '.webp',
  '.xls',
  '.xlsx',
])
const allowedBinaryFiles = new Set(['docs/preview-default.png', 'src/assets/hero.png'])

const patterns = [
  {
    label: 'mainland China phone number',
    regex: /\b1[3-9]\d{9}\b/g,
    allowed: new Set([['138', '00000000'].join('')]),
  },
  {
    label: 'Chinese citizen ID number',
    regex: /\b[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/g,
  },
  {
    label: 'QQ email address',
    regex: /\b[1-9]\d{4,11}@qq\.com\b/gi,
  },
  {
    label: 'common personal email address',
    regex: /\b[A-Z0-9._%+-]+@(163|126|qq|gmail|outlook|hotmail)\.com\b/gi,
  },
]

const sensitiveFileNamePatterns = [
  { label: 'resume export or imported data file name', regex: /(resume-data|raw-resume|real-data|imported-data)/i },
  { label: 'private file name marker', regex: /(private|personal)/i },
  { label: 'Chinese resume-like file name', regex: /(简历|证件|成绩单)/i },
]

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

function readLocalDenylist() {
  const denylistPath = path.join(root, '.privacy-denylist.local')
  if (!existsSync(denylistPath)) return []

  return readFileSync(denylistPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((value, index) => ({ label: `.privacy-denylist.local entry ${index + 1}`, value }))
}

function getCandidateFiles() {
  if (existsSync(path.join(root, '.git'))) {
    const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
      cwd: root,
      encoding: 'utf8',
    })
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  }

  const files = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue
      const absolutePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(absolutePath)
      } else if (entry.isFile()) {
        files.push(normalizePath(path.relative(root, absolutePath)))
      }
    }
  }
  walk(root)
  return files
}

function shouldScanText(file) {
  if (ignoredFiles.has(path.basename(file))) return false
  return textExtensions.has(path.extname(file).toLowerCase())
}

function lineNumberFor(text, index) {
  return text.slice(0, index).split(/\r?\n/).length
}

const findings = []
const localBlockedValues = readLocalDenylist()

for (const file of getCandidateFiles()) {
  const absolutePath = path.join(root, file)
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) continue

  const normalizedFile = normalizePath(file)
  const extension = path.extname(normalizedFile).toLowerCase()

  for (const { label, regex } of sensitiveFileNamePatterns) {
    if (regex.test(normalizedFile)) {
      findings.push(`${normalizedFile}: contains ${label}`)
    }
  }

  if (protectedBinaryExtensions.has(extension) && !allowedBinaryFiles.has(normalizedFile)) {
    findings.push(`${normalizedFile}: binary resume-like asset is not allowed in the public repo`)
    continue
  }

  if (!shouldScanText(normalizedFile)) continue

  const text = readFileSync(absolutePath, 'utf8')

  for (const { label, value } of localBlockedValues) {
    const index = text.toLowerCase().indexOf(value.toLowerCase())
    if (index !== -1) {
      findings.push(`${normalizedFile}:${lineNumberFor(text, index)} contains ${label}`)
    }
  }

  for (const { label, regex, allowed = new Set() } of patterns) {
    for (const match of text.matchAll(regex)) {
      if (allowed.has(match[0])) continue
      findings.push(`${normalizedFile}:${lineNumberFor(text, match.index ?? 0)} contains ${label}: ${match[0]}`)
    }
  }
}

if (findings.length > 0) {
  console.error('Privacy check failed. Remove personal resume data before committing or pushing:\n')
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exit(1)
}

console.log('Privacy check passed.')
