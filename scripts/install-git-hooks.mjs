import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const hooksDir = path.join(root, '.git', 'hooks')

if (!existsSync(path.join(root, '.git'))) {
  process.exit(0)
}

mkdirSync(hooksDir, { recursive: true })

function toGitShPath(filePath) {
  return filePath.replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`).replaceAll('\\', '/')
}

const npmCommand =
  process.platform === 'win32'
    ? `"${toGitShPath(path.join(path.dirname(process.execPath), 'npm.cmd'))}"`
    : 'npm'
const nodePathExport =
  process.platform === 'win32' ? `export PATH="${toGitShPath(path.dirname(process.execPath))}:$PATH"\n` : ''

const hookBody = `#!/bin/sh
${nodePathExport}
${npmCommand} run privacy:check
`

for (const hookName of ['pre-commit', 'pre-push']) {
  const hookPath = path.join(hooksDir, hookName)
  writeFileSync(hookPath, hookBody, 'utf8')
  chmodSync(hookPath, 0o755)
}
