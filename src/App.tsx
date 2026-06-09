import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Copy,
  Download,
  FileText,
  GraduationCap,
  GripVertical,
  Info,
  ListPlus,
  Link,
  Mail,
  MapPin,
  Palette,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  Trophy,
  UserRound,
  ChevronDown,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import './App.css'

type SectionKey = 'education' | 'skills' | 'internships' | 'projects' | 'honors' | 'custom'

type SchoolTag = '211' | '985' | '双一流'

type BasicExtraInfo = {
  id: string
  label: string
  value: string
}

type Basics = {
  name: string
  headline: string
  phone: string
  email: string
  avatar: string
  extraInfo: BasicExtraInfo[]
  location?: string
  website?: string
}

type Education = {
  id: string
  date: string
  school: string
  major: string
  degree: string
  tags: SchoolTag[]
  note: string
}

type SkillGroup = {
  id: string
  title: string
  content: string
}

type Experience = {
  id: string
  date: string
  company: string
  role: string
  stack: string
  summary: string
  bullets: string[]
}

type Project = {
  id: string
  name: string
  role: string
  stack: string
  summary: string
  bullets: string[]
}

type Honor = {
  text: string
}

type CustomSection = {
  id: string
  title: string
  subtitle: string
  items: string[]
}

type ResumeData = {
  basics: Basics
  education: Education[]
  skills: SkillGroup[]
  internships: Experience[]
  projects: Project[]
  honors: Honor
  customSections: CustomSection[]
  sectionOrder: SectionKey[]
}

type ResumeStyle = {
  accent: string
  ink: string
  muted: string
  paper: string
  fontFamily: string
  monoFamily: string
  fontSize: number
  lineHeight: number
  nameSize: number
  contactSize: number
  headingSize: number
  pageMargin: number
  sectionGap: number
  blockGap: number
  evidenceGap: number
  bulletGap: number
  ruleWeight: number
  bulletIndent: number
}

type Tab = 'content' | 'style' | 'order' | 'data'

const uid = () => Math.random().toString(36).slice(2, 10)
const schoolTagOptions: SchoolTag[] = ['211', '985', '双一流']

const emptyAvatar =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200"><rect width="160" height="200" fill="#e9f0f7"/><circle cx="80" cy="72" r="34" fill="#b8c6d6"/><path d="M28 184c8-43 28-64 52-64s44 21 52 64" fill="#b8c6d6"/><text x="80" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#607086">Photo</text></svg>`,
  )

const defaultResume: ResumeData = {
  basics: {
    name: '张同学',
    headline: 'AI 应用开发 / Java 后端开发',
    phone: '13800000000',
    email: 'example@email.com',
    avatar: emptyAvatar,
    extraInfo: [
      { id: uid(), label: '城市', value: '目标城市' },
      { id: uid(), label: '求职方向', value: '后端开发实习生' },
    ],
  },
  education: [
    {
      id: uid(),
      date: '2019 - 2023',
      school: '示例大学',
      major: '计算机相关专业',
      degree: '本科',
      tags: [],
      note: '补充说明：GPA、排名、核心课程、竞赛或奖学金等',
    },
    {
      id: uid(),
      date: '2024 - 2027',
      school: '示例研究生院校',
      major: '计算机技术',
      degree: '硕士',
      tags: ['211', '双一流'],
      note: '补充说明：研究方向、核心课程、论文/项目经历等',
    },
  ],
  skills: [
    {
      id: uid(),
      title: '前端工程能力',
      content: '熟悉 React、TypeScript 与组件化开发，了解状态管理、路由组织、表单校验和基础性能优化方法。',
    },
    {
      id: uid(),
      title: '服务端开发能力',
      content: '熟悉 Java / Node.js 常见 Web 开发模式，了解接口设计、参数校验、权限控制、日志追踪和异常处理。',
    },
    {
      id: uid(),
      title: '客户端与跨端能力',
      content: '了解 Flutter / Android 基础开发流程，熟悉页面适配、本地缓存、弱网处理、埋点上报和发布前质量检查。',
    },
    {
      id: uid(),
      title: '算法与数据基础',
      content: '了解 Python 数据处理、基础机器学习流程、向量检索和离线评估方法，能够完成实验脚本与原型服务开发。',
    },
  ],
  internships: [
    {
      id: uid(),
      date: '2026.03 - 2026.06',
      company: '星河前端实验室',
      role: '前端开发实习生',
      stack: 'React · TypeScript · Vite · Zustand',
      summary: '参与智能化运营后台的前端页面搭建，负责组件封装、交互状态管理和页面性能优化。',
      bullets: [
        '**组件工程化**：抽象表格、筛选器、弹窗表单等高频业务组件，统一交互规范并减少重复页面开发成本。',
        '**状态管理优化**：基于 Zustand 拆分页面状态与请求状态，降低跨组件通信复杂度，提升复杂表单维护体验。',
        '**体验与性能优化**：针对长列表渲染、路由切换和接口 loading 状态进行优化，使页面反馈更加稳定清晰。',
      ],
    },
    {
      id: uid(),
      date: '2025.09 - 2026.02',
      company: '云杉后端研发中心',
      role: '后端开发实习生',
      stack: 'Java · SpringBoot · MySQL · Redis · Kafka',
      summary:
        '参与企业级任务调度与数据同步服务建设，负责接口开发、缓存设计、异步消息处理和基础稳定性优化。',
      bullets: [
        '**接口与领域建模**：参与任务、规则、执行记录等核心表设计，完成 REST API 开发与参数校验逻辑封装。',
        '**缓存与并发控制**：基于 Redis 缓存热点配置与任务状态，减少数据库重复查询并提升高频访问稳定性。',
        '**异步链路处理**：接入 Kafka 处理任务执行事件，完成消息消费、失败重试和日志追踪等基础能力建设。',
      ],
    },
    {
      id: uid(),
      date: '2025.05 - 2025.08',
      company: '北辰移动端工作室',
      role: '客户端开发实习生',
      stack: 'Flutter · Dart · Android · SQLite',
      summary: '参与跨端移动应用迭代，负责核心页面开发、本地缓存、埋点上报和基础兼容性处理。',
      bullets: [
        '**页面与交互开发**：完成首页、详情页、设置页等模块开发，适配不同屏幕尺寸下的布局与交互状态。',
        '**本地数据能力**：基于 SQLite 缓存用户常用数据，支持弱网场景下的基础浏览与状态恢复。',
        '**质量与兼容性**：参与崩溃日志分析、埋点校验和 Android 机型适配，提升移动端发布质量。',
      ],
    },
  ],
  projects: [
    {
      id: uid(),
      name: '智能推荐算法实验平台',
      role: '算法开发',
      stack: 'Python · PyTorch · NumPy · Faiss · FastAPI',
      summary:
        '面向内容推荐场景搭建离线实验与在线推理原型，支持样本处理、向量召回、排序模型训练和效果评估。',
      bullets: [
        '完成用户行为日志清洗与特征构造，生成点击率、停留时长、类别偏好等训练特征。',
        '基于 Faiss 构建向量召回流程，支持相似内容检索与候选集生成。',
        '使用 PyTorch 训练轻量排序模型，并通过离线指标对比不同特征组合的效果。',
        '通过 FastAPI 封装推理接口，支持前端 Demo 调用并展示推荐结果。',
      ],
    },
  ],
  honors: {
    text: '',
  },
  customSections: [],
  sectionOrder: ['education', 'skills', 'internships', 'projects', 'honors', 'custom'],
}

const defaultStyle: ResumeStyle = {
  accent: '#2f6f8f',
  ink: '#111827',
  muted: '#3f4a54',
  paper: '#ffffff',
  fontFamily: '"Noto Sans CJK SC", "Microsoft YaHei", Inter, system-ui, sans-serif',
  monoFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
  fontSize: 10.8,
  lineHeight: 1.36,
  nameSize: 29,
  contactSize: 11.4,
  headingSize: 16,
  pageMargin: 30,
  sectionGap: 12,
  blockGap: 7,
  evidenceGap: 5,
  bulletGap: 2.5,
  ruleWeight: 1,
  bulletIndent: 19,
}

const onePageStyle: ResumeStyle = {
  ...defaultStyle,
  fontSize: 10.5,
  lineHeight: 1.32,
  nameSize: 28,
  contactSize: 11.1,
  headingSize: 15,
  pageMargin: 28,
  sectionGap: 10,
  blockGap: 6,
  evidenceGap: 4,
  bulletGap: 2,
  ruleWeight: 1,
  bulletIndent: 18,
}

const fitTargets = {
  minBlank: 28,
  targetBlank: 38,
  maxBlank: 52,
}

const stylePresets: { id: string; label: string; title: string; patch: Partial<ResumeStyle> }[] = [
  {
    id: 'standard',
    label: '标准',
    title: '清晰优先，适合内容不太多的投递版',
    patch: {
      fontSize: defaultStyle.fontSize,
      lineHeight: defaultStyle.lineHeight,
      nameSize: defaultStyle.nameSize,
      contactSize: defaultStyle.contactSize,
      headingSize: defaultStyle.headingSize,
      pageMargin: defaultStyle.pageMargin,
      sectionGap: defaultStyle.sectionGap,
      blockGap: defaultStyle.blockGap,
      evidenceGap: defaultStyle.evidenceGap,
      bulletGap: defaultStyle.bulletGap,
      bulletIndent: defaultStyle.bulletIndent,
    },
  },
  {
    id: 'compact',
    label: '一页',
    title: '内容较多时优先压到一页，保留可读字号',
    patch: {
      fontSize: onePageStyle.fontSize,
      lineHeight: onePageStyle.lineHeight,
      nameSize: onePageStyle.nameSize,
      contactSize: onePageStyle.contactSize,
      headingSize: onePageStyle.headingSize,
      pageMargin: onePageStyle.pageMargin,
      sectionGap: onePageStyle.sectionGap,
      blockGap: onePageStyle.blockGap,
      evidenceGap: onePageStyle.evidenceGap,
      bulletGap: onePageStyle.bulletGap,
      ruleWeight: onePageStyle.ruleWeight,
      bulletIndent: onePageStyle.bulletIndent,
    },
  },
  {
    id: 'conservative',
    label: '稳重',
    title: '更克制的蓝色和间距，偏传统中文技术简历',
    patch: {
      accent: '#245f78',
      fontSize: 10.7,
      lineHeight: 1.35,
      nameSize: 28,
      contactSize: 11.2,
      headingSize: 15,
      pageMargin: 31,
      sectionGap: 11,
      blockGap: 7,
      evidenceGap: 5,
      bulletGap: 2.5,
      bulletIndent: 19,
    },
  },
]

const legacyStyleDefaults: Partial<ResumeStyle> = {
  fontSize: 11.2,
  lineHeight: 1.5,
  nameSize: 29,
  contactSize: 11.6,
  headingSize: 17,
  pageMargin: 34,
  sectionGap: 18,
  blockGap: 10,
  evidenceGap: 7,
  bulletGap: 4,
  bulletIndent: 22,
}

const sectionLabels: Record<SectionKey, string> = {
  education: '教育背景',
  skills: '专业技能',
  internships: '实习经历',
  projects: '项目经历',
  honors: '荣誉证书',
  custom: '自定义模块',
}

const sectionIcons: Record<SectionKey, LucideIcon> = {
  education: GraduationCap,
  skills: Settings2,
  internships: BriefcaseBusiness,
  projects: FileText,
  honors: Trophy,
  custom: ListPlus,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toText(value: unknown, fallback = '') {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return fallback
  return String(value)
}

function toNumber(value: unknown, fallback: number) {
  const next = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(next) ? next : fallback
}

function toRecordArray(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function toTextArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return splitLines(value)
  }
  return []
}

function normalizeSectionOrder(value: unknown) {
  const valid = new Set<SectionKey>(schoolTagOptions ? ['education', 'skills', 'internships', 'projects', 'honors', 'custom'] : [])
  const fromInput = Array.isArray(value)
    ? value.filter((item): item is SectionKey => typeof item === 'string' && valid.has(item as SectionKey))
    : []
  return Array.from(new Set([...fromInput, ...defaultResume.sectionOrder]))
}

function loadState<T>(key: string, fallback: T, normalize: (value: unknown) => T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? normalize(JSON.parse(raw)) : fallback
  } catch {
    return fallback
  }
}

function normalizeResume(input: unknown = {}): ResumeData {
  const source = isRecord(input) ? input : {}
  const rawBasics = isRecord(source.basics) ? source.basics : {}
  const rawExtraInfo = rawBasics.extraInfo as unknown
  const extraInfo = Array.isArray(rawExtraInfo)
    ? rawExtraInfo.map((item) => ({
        id: isRecord(item) && typeof item.id === 'string' ? item.id : uid(),
        label: isRecord(item) ? toText(item.label ?? item.header) : '',
        value: isRecord(item) ? toText(item.value) : toText(item),
      }))
    : [
        rawBasics.location ? { id: uid(), label: '城市', value: rawBasics.location } : null,
        rawBasics.website ? { id: uid(), label: '网站', value: rawBasics.website } : null,
      ].filter((item): item is BasicExtraInfo => Boolean(item))

  const basics: Basics = {
    name: toText(rawBasics.name, defaultResume.basics.name),
    headline: toText(rawBasics.headline, defaultResume.basics.headline),
    phone: toText(rawBasics.phone, defaultResume.basics.phone),
    email: toText(rawBasics.email, defaultResume.basics.email),
    avatar: toText(rawBasics.avatar, defaultResume.basics.avatar) || emptyAvatar,
    extraInfo,
  }

  const legacyHonors = source.honors as unknown
  const honors =
    Array.isArray(legacyHonors)
      ? { text: legacyHonors.map((item) => (typeof item === 'string' ? item : item?.text)).filter(Boolean).join('\n') }
      : isRecord(legacyHonors)
        ? { text: toText(legacyHonors.text) }
        : typeof legacyHonors === 'string'
          ? { text: legacyHonors }
          : defaultResume.honors

  const skills = toRecordArray(source.skills).map((item) => ({
    id: toText(item.id) || uid(),
    title: toText(item.title),
    content: toText(item.content),
  }))

  const internships = Array.isArray(source.internships)
    ? toRecordArray(source.internships).map((item) => ({
        id: toText(item.id) || uid(),
        date: toText(item.date),
        company: toText(item.company),
        role: toText(item.role),
        stack: toText(item.stack),
        summary: toText(item.summary),
        bullets: toTextArray(item.bullets),
      }))
    : defaultResume.internships

  const projects = Array.isArray(source.projects)
    ? toRecordArray(source.projects).map((item) => ({
        id: toText(item.id) || uid(),
        name: toText(item.name),
        role: toText(item.role),
        stack: toText(item.stack),
        summary: toText(item.summary),
        bullets: toTextArray(item.bullets),
      }))
    : defaultResume.projects

  const education = Array.isArray(source.education)
    ? toRecordArray(source.education).map((item) => {
        const school = toText(item.school)
        const tagsFromSchool = schoolTagOptions.filter((tag) => school.includes(tag))
        const explicitTags = Array.isArray(item.tags) ? item.tags.filter((tag): tag is SchoolTag => schoolTagOptions.includes(tag as SchoolTag)) : []
        const tags = Array.from(new Set([...explicitTags, ...tagsFromSchool]))
        const cleanSchool = school.replace(/[（(]\s*(211|985|双一流)\s*[）)]/g, '').trim()
        return {
          id: toText(item.id) || uid(),
          date: toText(item.date),
          school: cleanSchool || school,
          major: toText(item.major),
          degree: toText(item.degree),
          tags,
          note: toText(item.note),
        }
      })
    : defaultResume.education

  const customSections = Array.isArray(source.customSections)
    ? toRecordArray(source.customSections).map((item) => ({
        id: toText(item.id) || uid(),
        title: toText(item.title),
        subtitle: toText(item.subtitle),
        items: toTextArray(item.items),
      }))
    : defaultResume.customSections

  return {
    ...defaultResume,
    basics,
    education,
    skills: skills.length ? skills : defaultResume.skills,
    internships,
    projects,
    honors,
    customSections,
    sectionOrder: normalizeSectionOrder(source.sectionOrder),
  }
}

function normalizeStyle(input: unknown = {}): ResumeStyle {
  const source = isRecord(input) ? input : {}
  const normalized: ResumeStyle = {
    accent: toText(source.accent, defaultStyle.accent) || defaultStyle.accent,
    ink: toText(source.ink, defaultStyle.ink) || defaultStyle.ink,
    muted: toText(source.muted, defaultStyle.muted) || defaultStyle.muted,
    paper: toText(source.paper, defaultStyle.paper) || defaultStyle.paper,
    fontFamily: toText(source.fontFamily, defaultStyle.fontFamily) || defaultStyle.fontFamily,
    monoFamily: toText(source.monoFamily, defaultStyle.monoFamily) || defaultStyle.monoFamily,
    fontSize: toNumber(source.fontSize, defaultStyle.fontSize),
    lineHeight: toNumber(source.lineHeight, defaultStyle.lineHeight),
    nameSize: toNumber(source.nameSize, defaultStyle.nameSize),
    contactSize: toNumber(source.contactSize, defaultStyle.contactSize),
    headingSize: toNumber(source.headingSize, defaultStyle.headingSize),
    pageMargin: toNumber(source.pageMargin, defaultStyle.pageMargin),
    sectionGap: toNumber(source.sectionGap, defaultStyle.sectionGap),
    blockGap: toNumber(source.blockGap, defaultStyle.blockGap),
    evidenceGap: toNumber(source.evidenceGap, defaultStyle.evidenceGap),
    bulletGap: toNumber(source.bulletGap, defaultStyle.bulletGap),
    ruleWeight: toNumber(source.ruleWeight, defaultStyle.ruleWeight),
    bulletIndent: toNumber(source.bulletIndent, defaultStyle.bulletIndent),
  }
  ;(Object.entries(legacyStyleDefaults) as [keyof ResumeStyle, number][]).forEach(([key, value]) => {
    if (source[key] === value) {
      normalized[key] = defaultStyle[key] as never
    }
  })
  if (source.pageMargin === 42) {
    normalized.pageMargin = defaultStyle.pageMargin
  }
  if (!source.muted || source.muted === '#53636b') {
    normalized.muted = defaultStyle.muted
  }
  return normalized
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = [...items]
  const target = index + direction
  if (target < 0 || target >= next.length) return next
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function formatExtraInfo(item: BasicExtraInfo) {
  const label = item.label.trim()
  const value = item.value.trim()
  if (label && value) return `${label}：${value}`
  return value || label
}

function getExtraInfoIcon(label: string) {
  const normalized = label.toLowerCase()
  if (/城市|地点|地址|地区|base|location/.test(normalized)) return MapPin
  if (/出生|年龄|生日|birth|age/.test(normalized)) return CalendarDays
  if (/网站|主页|博客|作品|github|link|url|portfolio/.test(normalized)) return Link
  if (/求职|岗位|方向|意向|职位|job|role/.test(normalized)) return BriefcaseBusiness
  if (/性别|gender/.test(normalized)) return UserRound
  return Info
}

function getSchoolTagClass(tag: SchoolTag) {
  if (tag === '985') return 'tag-985'
  if (tag === '211') return 'tag-211'
  return 'tag-double-first-class'
}

function RichText({ text }: { text: string }) {
  const renderLine = (line: string) => {
    const parts = line.split(/(\*\*.+?\*\*)/g)
    return parts.map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : <span key={index}>{part}</span>,
    )
  }

  return (
    <>
      {text.split('\n').map((line, index, lines) => (
        <span key={`${line}-${index}`}>
          {renderLine(line)}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextBlock({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="field field-wide">
      <span>{label}</span>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function IconButton({
  title,
  onClick,
  children,
  disabled,
  tone = 'plain',
}: {
  title: string
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  disabled?: boolean
  tone?: 'plain' | 'danger'
}) {
  return (
    <button type="button" className={`icon-btn ${tone}`} title={title} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function ItemShell({
  title,
  children,
  onUp,
  onDown,
  onDuplicate,
  onDelete,
  upDisabled,
  downDisabled,
}: {
  title: string
  children: ReactNode
  onUp?: () => void
  onDown?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  upDisabled?: boolean
  downDisabled?: boolean
}) {
  return (
    <section className="editor-item">
      <div className="item-toolbar">
        <span className="drag-label">
          <GripVertical size={15} />
          {title}
        </span>
        <div className="item-actions">
          {onUp && (
            <IconButton title="上移" onClick={onUp} disabled={upDisabled}>
              <ArrowUp size={15} />
            </IconButton>
          )}
          {onDown && (
            <IconButton title="下移" onClick={onDown} disabled={downDisabled}>
              <ArrowDown size={15} />
            </IconButton>
          )}
          {onDuplicate && (
            <IconButton title="复制" onClick={onDuplicate}>
              <Copy size={15} />
            </IconButton>
          )}
          {onDelete && (
            <IconButton title="删除" onClick={onDelete} tone="danger">
              <Trash2 size={15} />
            </IconButton>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

function ResumePreview({ resume, style, previewRef }: { resume: ResumeData; style: ResumeStyle; previewRef: RefObject<HTMLDivElement | null> }) {
  const rootStyle = {
    '--resume-accent': style.accent,
    '--resume-ink': style.ink,
    '--resume-muted': style.muted,
    '--resume-paper': style.paper,
    '--resume-font': style.fontFamily,
    '--resume-mono': style.monoFamily,
    '--resume-size': `${style.fontSize}px`,
    '--resume-line': style.lineHeight,
    '--resume-name': `${style.nameSize}px`,
    '--resume-contact': `${style.contactSize}px`,
    '--resume-heading': `${style.headingSize}px`,
    '--resume-margin': `${style.pageMargin}px`,
    '--resume-gap': `${style.sectionGap}px`,
    '--resume-block-gap': `${style.blockGap}px`,
    '--resume-evidence-gap': `${style.evidenceGap}px`,
    '--resume-bullet-gap': `${style.bulletGap}px`,
    '--resume-rule': `${style.ruleWeight}px`,
    '--resume-bullet': `${style.bulletIndent}px`,
  } as CSSProperties

  const honorLines = splitLines(resume.honors.text)

  const visibleSkills = resume.skills.filter((skill) => skill.title.trim() || skill.content.trim())
  const extraInfoItems = resume.basics.extraInfo
    .map((item) => ({ ...item, display: formatExtraInfo(item) }))
    .filter((item) => item.display)

  const sectionRenderers: Record<SectionKey, ReactNode> = {
    education: resume.education.length ? (
      <ResumeSection title="教育背景">
        {resume.education.map((item) => (
          <div className="education-block" key={item.id}>
            <HeaderRow left={item.date} center={<EducationSchool item={item} />} right={`${item.major} | ${item.degree}`} />
            {item.note && (
              <p className="education-note">
                <RichText text={item.note} />
              </p>
            )}
          </div>
        ))}
      </ResumeSection>
    ) : null,
    skills: visibleSkills.length ? (
      <ResumeSection title="专业技能">
        <ul className="resume-list">
          {visibleSkills.map((skill) => {
            const title = skill.title.trim()
            const content = skill.content.trim()
            return (
              <li key={skill.id}>
                {title && <strong>{title}</strong>}
                {title && content && '：'}
                {content && <RichText text={skill.content} />}
              </li>
            )
          })}
        </ul>
      </ResumeSection>
    ) : null,
    internships: resume.internships.length ? (
      <ResumeSection title="实习经历">
        {resume.internships.map((item) => (
          <ExperienceBlock key={item.id} item={item} />
        ))}
      </ResumeSection>
    ) : null,
    projects: resume.projects.length ? (
      <ResumeSection title="项目经历">
        {resume.projects.map((item) => (
          <ProjectBlock key={item.id} item={item} />
        ))}
      </ResumeSection>
    ) : null,
    honors: honorLines.length ? (
      <ResumeSection title="荣誉证书">
        <ul className="resume-list">
          {honorLines.map((honor, index) => (
            <li key={`${honor}-${index}`}>
              <RichText text={honor} />
            </li>
          ))}
        </ul>
      </ResumeSection>
    ) : null,
    custom: resume.customSections.length ? (
      <>
        {resume.customSections.map((section) => (
          <ResumeSection key={section.id} title={section.title || '自定义模块'} subtitle={section.subtitle}>
            <ul className="resume-list">
              {section.items.map((item, index) => (
                <li key={`${section.id}-${index}`}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          </ResumeSection>
        ))}
      </>
    ) : null,
  }

  return (
    <div className="paper-shell">
      <article className="resume-paper" ref={previewRef} style={rootStyle}>
        <header className="resume-header">
          <div className="header-content">
            <div className="identity-block">
              <h1>{resume.basics.name}</h1>
            </div>
            {resume.basics.headline && (
              <p className="headline">
                <RichText text={resume.basics.headline} />
              </p>
            )}
            <div className="contact-line">
              {resume.basics.phone && (
                <ContactItem icon={Phone}>
                  <RichText text={resume.basics.phone} />
                </ContactItem>
              )}
              {resume.basics.email && (
                <ContactItem icon={Mail}>
                  <RichText text={resume.basics.email} />
                </ContactItem>
              )}
              {extraInfoItems.map((item) => (
                <ContactItem icon={getExtraInfoIcon(item.label)} key={item.id}>
                  <RichText text={item.display} />
                </ContactItem>
              ))}
            </div>
          </div>
          <div className="avatar-frame">
            <img
              className={`avatar ${!resume.basics.avatar || resume.basics.avatar === emptyAvatar ? 'avatar-empty' : ''}`}
              src={resume.basics.avatar || emptyAvatar}
              alt=""
            />
          </div>
        </header>
        {resume.sectionOrder.map((key) => (
          <Fragment key={key}>{sectionRenderers[key]}</Fragment>
        ))}
      </article>
    </div>
  )
}

function ContactItem({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="contact-item">
      <Icon aria-hidden="true" size={12} strokeWidth={1.85} />
      <span className="contact-value">{children}</span>
    </span>
  )
}

function ResumeSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="resume-section">
      <h2>
        <span className="section-title-main">{title}</span>
        {subtitle && <small>{subtitle}</small>}
      </h2>
      {children}
    </section>
  )
}

function HeaderRow({ left, center, right }: { left: string; center: ReactNode; right: string }) {
  return (
    <div className="resume-row">
      <span className="mono">{left}</span>
      <strong>{center}</strong>
      <span>{right}</span>
    </div>
  )
}

function EducationSchool({ item }: { item: Education }) {
  return (
    <span className="school-name">
      <span>{item.school}</span>
      {item.tags.map((tag) => (
        <span className={`school-badge ${getSchoolTagClass(tag)}`} key={tag}>
          {tag}
        </span>
      ))}
    </span>
  )
}

function SchoolTagPicker({ value, onChange }: { value: SchoolTag[]; onChange: (value: SchoolTag[]) => void }) {
  const toggle = (tag: SchoolTag) => {
    onChange(value.includes(tag) ? value.filter((item) => item !== tag) : [...value, tag])
  }

  return (
      <div className="tag-field">
      <span>学校标签</span>
      <div className="tag-segment" aria-label="学校标签">
        {schoolTagOptions.map((tag) => (
          <button
            className={value.includes(tag) ? 'active' : ''}
            type="button"
            key={tag}
            aria-pressed={value.includes(tag)}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

function ExperienceBlock({ item }: { item: Experience }) {
  return (
    <div className="resume-block">
      <HeaderRow left={item.date} center={item.company} right={item.role} />
      {item.stack && (
        <p className="meta-line">
          <strong>技术栈：</strong>
          <RichText text={item.stack} />
        </p>
      )}
      {item.summary && (
        <p className="summary summary-lead">
          <strong>简介：</strong>
          <RichText text={item.summary} />
        </p>
      )}
      <ul className="resume-list evidence-list">
        {item.bullets.map((bullet, index) => (
          <li key={`${item.id}-${index}`}>
            <RichText text={bullet} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectBlock({ item }: { item: Project }) {
  return (
    <div className="resume-block">
      <div className="project-head">
        <strong>{item.name}</strong>
        {item.role && (
          <span>
            <RichText text={item.role} />
          </span>
        )}
      </div>
      {item.stack && (
        <p className="meta-line">
          <strong>技术栈：</strong>
          <RichText text={item.stack} />
        </p>
      )}
      {item.summary && (
        <p className="summary muted summary-lead">
          <RichText text={item.summary} />
        </p>
      )}
      <ul className="resume-list evidence-list">
        {item.bullets.map((bullet, index) => (
          <li key={`${item.id}-${index}`}>
            <RichText text={bullet} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const previewRef = useRef<HTMLDivElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const hasReportedStorageFailure = useRef(false)
  const [activeTab, setActiveTab] = useState<Tab>('content')
  const [resume, setResume] = useState<ResumeData>(() => loadState('resume-editor:data', defaultResume, normalizeResume))
  const [style, setStyle] = useState<ResumeStyle>(() => loadState('resume-editor:style', defaultStyle, normalizeStyle))
  const [status, setStatus] = useState('已自动保存')

  useEffect(() => {
    try {
      localStorage.setItem('resume-editor:data', JSON.stringify(resume))
      localStorage.setItem('resume-editor:style', JSON.stringify(style))
      hasReportedStorageFailure.current = false
    } catch {
      if (!hasReportedStorageFailure.current) {
        hasReportedStorageFailure.current = true
        window.setTimeout(() => setStatus('自动保存失败：头像或数据过大，建议导出 JSON 备份'), 0)
      }
    }
  }, [resume, style])

  const updateBasics = (patch: Partial<Basics>) =>
    setResume((current) => ({ ...current, basics: { ...current.basics, ...patch } }))

  const updateStyle = (patch: Partial<ResumeStyle>) => setStyle((current) => ({ ...current, ...patch }))

  const addExtraInfo = () =>
    setResume((current) => ({
      ...current,
      basics: {
        ...current.basics,
        extraInfo: [...current.basics.extraInfo, { id: uid(), label: '', value: '' }],
      },
    }))

  const updateExtraInfo = (id: string, patch: Partial<BasicExtraInfo>) =>
    setResume((current) => ({
      ...current,
      basics: {
        ...current.basics,
        extraInfo: current.basics.extraInfo.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    }))

  const removeExtraInfo = (id: string) =>
    setResume((current) => ({
      ...current,
      basics: {
        ...current.basics,
        extraInfo: current.basics.extraInfo.filter((item) => item.id !== id),
      },
    }))

  const handleAvatar = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus('头像上传失败：请选择图片文件')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus('头像图片过大：建议先压缩到 2MB 以内')
      return
    }
    const reader = new FileReader()
    reader.onload = () => updateBasics({ avatar: String(reader.result) })
    reader.readAsDataURL(file)
  }

  const measurePageFit = () => {
    const paper = previewRef.current
    if (!paper) return { overflow: 0, bottomBlank: 0 }
    const lastSection = [...paper.querySelectorAll('.resume-section')].at(-1)
    const bottom = lastSection ? lastSection.getBoundingClientRect().bottom : paper.getBoundingClientRect().bottom
    const paperBottom = paper.getBoundingClientRect().bottom
    return {
      overflow: Math.max(0, Math.ceil(bottom - paperBottom)),
      bottomBlank: Math.max(0, Math.floor(paperBottom - bottom)),
    }
  }

  const waitForPreviewImages = async () => {
    const images = [...(previewRef.current?.querySelectorAll('img') || [])]
    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve()
        return image.decode?.().catch(() => undefined) || Promise.resolve()
      }),
    )
  }

  const exportPdf = async () => {
    if (!previewRef.current) return
    const { overflow } = measurePageFit()
    if (overflow > 0) {
      setStatus(`内容超出一页约 ${overflow}px，请先使用“一页”预设或缩小字号`)
      return
    }
    setStatus('正在打开打印面板，选择“保存为 PDF”即可')
    await document.fonts?.ready
    await waitForPreviewImages()
    window.print()
    setStatus('已打开打印面板，可保存为 PDF')
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ resume, style }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume-data.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('JSON 已导出')
  }

  const importJson = async (file: File | null) => {
    if (!file) return
    try {
      const raw = await file.text()
      const parsed = JSON.parse(raw)
      const payload = isRecord(parsed) && 'resume' in parsed ? parsed : { resume: parsed }
      const nextResume = normalizeResume(isRecord(payload) ? payload.resume : parsed)
      const nextStyle = isRecord(payload) && 'style' in payload ? normalizeStyle(payload.style) : normalizeStyle(onePageStyle)
      setResume(nextResume)
      setStyle(nextStyle)
      setStatus(isRecord(payload) && 'style' in payload ? 'JSON 已导入' : 'JSON 已导入并套用一页样式')
    } catch {
      setStatus('JSON 导入失败，请检查文件')
    }
  }

  const resetAll = () => {
    if (!window.confirm('确定重置为匿名默认内容吗？当前编辑会被覆盖。')) return
    setResume(defaultResume)
    setStyle(defaultStyle)
    setStatus('已重置为默认内容')
  }

  const applyStylePreset = (patch: Partial<ResumeStyle>, label: string) => {
    setStyle((current) => ({ ...current, ...patch }))
    setStatus(`已套用${label}样式`)
  }

  const fitOnePage = () => {
    const candidates: Partial<ResumeStyle>[] = [
      { fontSize: 12.8, lineHeight: 1.56, nameSize: 36, contactSize: 13.4, headingSize: 21, pageMargin: 42, sectionGap: 28, blockGap: 18, evidenceGap: 12, bulletGap: 7, bulletIndent: 24 },
      { fontSize: 12.4, lineHeight: 1.52, nameSize: 35, contactSize: 13, headingSize: 20, pageMargin: 39, sectionGap: 24, blockGap: 15, evidenceGap: 10, bulletGap: 6, bulletIndent: 23 },
      { fontSize: 12.2, lineHeight: 1.49, nameSize: 34, contactSize: 12.8, headingSize: 19, pageMargin: 37, sectionGap: 22, blockGap: 13, evidenceGap: 9, bulletGap: 5.5, bulletIndent: 22 },
      { fontSize: 12, lineHeight: 1.46, nameSize: 33, contactSize: 12.6, headingSize: 19, pageMargin: 36, sectionGap: 20, blockGap: 12, evidenceGap: 8, bulletGap: 5, bulletIndent: 22 },
      { fontSize: 11.6, lineHeight: 1.38, nameSize: 31, contactSize: 12, headingSize: 17, pageMargin: 31, sectionGap: 14, blockGap: 9, evidenceGap: 6, bulletGap: 3, bulletIndent: 20 },
      { fontSize: 11.3, lineHeight: 1.37, nameSize: 30, contactSize: 11.8, headingSize: 16, pageMargin: 30, sectionGap: 13, blockGap: 8, evidenceGap: 6, bulletGap: 3, bulletIndent: 20 },
      { fontSize: 11, lineHeight: 1.36, nameSize: 29, contactSize: 11.5, headingSize: 16, pageMargin: 30, sectionGap: 12, blockGap: 7, evidenceGap: 5, bulletGap: 2.5, bulletIndent: 19 },
      { fontSize: 10.8, lineHeight: 1.35, nameSize: 29, contactSize: 11.4, headingSize: 16, pageMargin: 29, sectionGap: 11, blockGap: 7, evidenceGap: 5, bulletGap: 2.5, bulletIndent: 19 },
      { fontSize: 10.5, lineHeight: 1.32, nameSize: 28, contactSize: 11.1, headingSize: 15, pageMargin: 28, sectionGap: 10, blockGap: 6, evidenceGap: 4, bulletGap: 2, bulletIndent: 18 },
      { fontSize: 10.2, lineHeight: 1.3, nameSize: 27, contactSize: 10.8, headingSize: 15, pageMargin: 27, sectionGap: 9, blockGap: 5, evidenceGap: 3, bulletGap: 1.5, bulletIndent: 17 },
      { fontSize: 10, lineHeight: 1.28, nameSize: 26, contactSize: 10.6, headingSize: 14, pageMargin: 26, sectionGap: 8, blockGap: 5, evidenceGap: 3, bulletGap: 1, bulletIndent: 17 },
    ]
    let best: { patch: Partial<ResumeStyle>; overflow: number; bottomBlank: number; score: number } = {
      patch: candidates[0],
      overflow: Number.POSITIVE_INFINITY,
      bottomBlank: Number.POSITIVE_INFINITY,
      score: Number.POSITIVE_INFINITY,
    }

    for (const patch of candidates) {
      flushSync(() => setStyle((current) => ({ ...current, ...patch })))
      const fit = measurePageFit()
      const overflowPenalty = fit.overflow * 20
      const blankPenalty =
        fit.bottomBlank > fitTargets.maxBlank
          ? (fit.bottomBlank - fitTargets.targetBlank) * 1.2
          : Math.abs(fit.bottomBlank - fitTargets.targetBlank)
      const score = overflowPenalty + blankPenalty
      if (score < best.score) {
        best = { patch, overflow: fit.overflow, bottomBlank: fit.bottomBlank, score }
      }
    }

    flushSync(() => setStyle((current) => ({ ...current, ...best.patch })))
    if (best.overflow > 0) {
      setStatus(`已尽量压缩，仍超出一页约 ${best.overflow}px，建议删减内容`)
    } else if (best.bottomBlank > fitTargets.maxBlank) {
      setStatus(`已扩充版面，底部留白约 ${best.bottomBlank}px`)
    } else {
      setStatus(`已自动适配一页，底部留白约 ${best.bottomBlank}px`)
    }
  }

  const addEducation = () =>
    setResume((current) => ({
      ...current,
      education: [...current.education, { id: uid(), date: '', school: '', major: '', degree: '', tags: [], note: '' }],
    }))

  const updateEducation = (id: string, patch: Partial<Education>) =>
    setResume((current) => ({
      ...current,
      education: current.education.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const addSkill = () =>
    setResume((current) => ({
      ...current,
      skills: [...current.skills, { id: uid(), title: '新技能组', content: '' }],
    }))

  const updateSkill = (id: string, patch: Partial<SkillGroup>) =>
    setResume((current) => ({
      ...current,
      skills: current.skills.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const addExperience = () =>
    setResume((current) => ({
      ...current,
      internships: [...current.internships, { id: uid(), date: '', company: '', role: '', stack: '', summary: '', bullets: [''] }],
    }))

  const updateExperience = (id: string, patch: Partial<Experience>) =>
    setResume((current) => ({
      ...current,
      internships: current.internships.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const addProject = () =>
    setResume((current) => ({
      ...current,
      projects: [...current.projects, { id: uid(), name: '', role: '', stack: '', summary: '', bullets: [''] }],
    }))

  const updateProject = (id: string, patch: Partial<Project>) =>
    setResume((current) => ({
      ...current,
      projects: current.projects.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const addCustomSection = () =>
    setResume((current) => ({
      ...current,
      customSections: [...current.customSections, { id: uid(), title: '自定义模块', subtitle: '', items: [''] }],
    }))

  return (
    <main className="workspace">
      <aside className="editor-panel">
        <div className="app-bar">
          <div>
            <h1>Resume Studio</h1>
            <p role="status" aria-live="polite">
              {status}
            </p>
          </div>
          <div className="bar-actions">
            <button className="action-btn" type="button" onClick={exportPdf}>
              <Download size={16} />
              打印/保存 PDF
            </button>
            <IconButton title="重置" onClick={resetAll}>
              <RotateCcw size={16} />
            </IconButton>
          </div>
        </div>

        <nav className="tabs" aria-label="编辑区域" role="tablist">
          <button className={activeTab === 'content' ? 'active' : ''} role="tab" aria-selected={activeTab === 'content'} onClick={() => setActiveTab('content')}>
            <FileText size={16} />
            内容
          </button>
          <button className={activeTab === 'style' ? 'active' : ''} role="tab" aria-selected={activeTab === 'style'} onClick={() => setActiveTab('style')}>
            <Palette size={16} />
            样式
          </button>
          <button className={activeTab === 'order' ? 'active' : ''} role="tab" aria-selected={activeTab === 'order'} onClick={() => setActiveTab('order')}>
            <GripVertical size={16} />
            排序
          </button>
          <button className={activeTab === 'data' ? 'active' : ''} role="tab" aria-selected={activeTab === 'data'} onClick={() => setActiveTab('data')}>
            <Save size={16} />
            数据
          </button>
        </nav>

        {activeTab === 'content' && (
          <div className="panel-scroll">
            <CollapsiblePanel title="基本信息" icon={UserRound} defaultOpen>
              <div className="field-grid compact-basics">
                <Field label="姓名" value={resume.basics.name} onChange={(value) => updateBasics({ name: value })} />
                <Field label="求职方向" value={resume.basics.headline} onChange={(value) => updateBasics({ headline: value })} />
                <Field label="电话" value={resume.basics.phone} onChange={(value) => updateBasics({ phone: value })} />
                <Field label="邮箱" value={resume.basics.email} onChange={(value) => updateBasics({ email: value })} />
              </div>
              <div className="basic-tools">
                <label className="upload-zone compact-upload">
                  <Camera size={18} />
                  <span>上传头像</span>
                  <input type="file" accept="image/*" onChange={(event) => handleAvatar(event.target.files?.[0] || null)} />
                </label>
                <details className="optional-fields">
                  <summary>更多信息</summary>
                  <div className="optional-body">
                    <div className="extra-info-list">
                      {resume.basics.extraInfo.map((item) => (
                        <div className="extra-info-row" key={item.id}>
                          <Field
                            label="信息类型"
                            value={item.label}
                            placeholder="城市 / GitHub / 作品集"
                            onChange={(value) => updateExtraInfo(item.id, { label: value })}
                          />
                          <Field
                            label="信息内容"
                            value={item.value}
                            placeholder="北京 / github.com/..."
                            onChange={(value) => updateExtraInfo(item.id, { value })}
                          />
                          <IconButton title="删除" onClick={() => removeExtraInfo(item.id)} tone="danger">
                            <Trash2 size={15} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                    <button className="secondary-btn compact-add" type="button" onClick={addExtraInfo}>
                      <Plus size={16} />
                      新增自定义信息
                    </button>
                  </div>
                </details>
              </div>
            </CollapsiblePanel>

            <CollectionEditor
              title="教育背景"
              icon={GraduationCap}
              onAdd={addEducation}
              items={resume.education}
              defaultOpen
              render={(item, index) => (
                <ItemShell
                  key={item.id}
                  title={item.school || '教育经历'}
                  onUp={() => setResume((current) => ({ ...current, education: moveItem(current.education, index, -1) }))}
                  onDown={() => setResume((current) => ({ ...current, education: moveItem(current.education, index, 1) }))}
                  onDelete={() =>
                    setResume((current) => ({ ...current, education: current.education.filter((entry) => entry.id !== item.id) }))
                  }
                  upDisabled={index === 0}
                  downDisabled={index === resume.education.length - 1}
                >
                  <div className="field-grid">
                    <Field label="时间" value={item.date} onChange={(value) => updateEducation(item.id, { date: value })} />
                    <Field label="学校" value={item.school} onChange={(value) => updateEducation(item.id, { school: value })} />
                    <Field label="专业" value={item.major} onChange={(value) => updateEducation(item.id, { major: value })} />
                    <Field label="学历" value={item.degree} onChange={(value) => updateEducation(item.id, { degree: value })} />
                  </div>
                  <SchoolTagPicker value={item.tags} onChange={(tags) => updateEducation(item.id, { tags })} />
                  <TextBlock
                    label="补充说明"
                    value={item.note}
                    onChange={(value) => updateEducation(item.id, { note: value })}
                    rows={2}
                    placeholder="GPA、排名、核心课程、成绩说明等"
                  />
                </ItemShell>
              )}
            />

            <CollectionEditor
              title="专业技能"
              icon={Settings2}
              onAdd={addSkill}
              items={resume.skills}
              defaultOpen
              render={(item, index) => (
                <ItemShell
                  key={item.id}
                  title={item.title || '技能组'}
                  onUp={() => setResume((current) => ({ ...current, skills: moveItem(current.skills, index, -1) }))}
                  onDown={() => setResume((current) => ({ ...current, skills: moveItem(current.skills, index, 1) }))}
                  onDelete={() => setResume((current) => ({ ...current, skills: current.skills.filter((entry) => entry.id !== item.id) }))}
                  upDisabled={index === 0}
                  downDisabled={index === resume.skills.length - 1}
                >
                  <Field label="标题" value={item.title} onChange={(value) => updateSkill(item.id, { title: value })} />
                  <TextBlock label="内容" value={item.content} onChange={(value) => updateSkill(item.id, { content: value })} rows={3} />
                </ItemShell>
              )}
            />

            <CollectionEditor
              title="实习经历"
              icon={BriefcaseBusiness}
              onAdd={addExperience}
              items={resume.internships}
              render={(item, index) => (
                <ItemShell
                  key={item.id}
                  title={item.company || '实习经历'}
                  onUp={() => setResume((current) => ({ ...current, internships: moveItem(current.internships, index, -1) }))}
                  onDown={() => setResume((current) => ({ ...current, internships: moveItem(current.internships, index, 1) }))}
                  onDuplicate={() =>
                    setResume((current) => ({
                      ...current,
                      internships: [
                        ...current.internships.slice(0, index + 1),
                        { ...item, id: uid(), company: `${item.company} 副本` },
                        ...current.internships.slice(index + 1),
                      ],
                    }))
                  }
                  onDelete={() =>
                    setResume((current) => ({ ...current, internships: current.internships.filter((entry) => entry.id !== item.id) }))
                  }
                  upDisabled={index === 0}
                  downDisabled={index === resume.internships.length - 1}
                >
                  <div className="field-grid">
                    <Field label="时间" value={item.date} onChange={(value) => updateExperience(item.id, { date: value })} />
                    <Field label="公司" value={item.company} onChange={(value) => updateExperience(item.id, { company: value })} />
                    <Field label="岗位" value={item.role} onChange={(value) => updateExperience(item.id, { role: value })} />
                    <Field label="技术栈" value={item.stack} onChange={(value) => updateExperience(item.id, { stack: value })} />
                  </div>
                  <TextBlock label="简介" value={item.summary} onChange={(value) => updateExperience(item.id, { summary: value })} rows={3} />
                  <TextBlock
                    label="要点"
                    value={item.bullets.join('\n')}
                    onChange={(value) => updateExperience(item.id, { bullets: splitLines(value) })}
                    rows={5}
                  />
                </ItemShell>
              )}
            />

            <CollectionEditor
              title="项目经历"
              icon={FileText}
              onAdd={addProject}
              items={resume.projects}
              render={(item, index) => (
                <ItemShell
                  key={item.id}
                  title={item.name || '项目经历'}
                  onUp={() => setResume((current) => ({ ...current, projects: moveItem(current.projects, index, -1) }))}
                  onDown={() => setResume((current) => ({ ...current, projects: moveItem(current.projects, index, 1) }))}
                  onDuplicate={() =>
                    setResume((current) => ({
                      ...current,
                      projects: [
                        ...current.projects.slice(0, index + 1),
                        { ...item, id: uid(), name: `${item.name} 副本` },
                        ...current.projects.slice(index + 1),
                      ],
                    }))
                  }
                  onDelete={() =>
                    setResume((current) => ({ ...current, projects: current.projects.filter((entry) => entry.id !== item.id) }))
                  }
                  upDisabled={index === 0}
                  downDisabled={index === resume.projects.length - 1}
                >
                  <Field label="项目名" value={item.name} onChange={(value) => updateProject(item.id, { name: value })} />
                  <Field label="岗位 / 职责" value={item.role} onChange={(value) => updateProject(item.id, { role: value })} />
                  <Field label="技术栈" value={item.stack} onChange={(value) => updateProject(item.id, { stack: value })} />
                  <TextBlock label="简介" value={item.summary} onChange={(value) => updateProject(item.id, { summary: value })} rows={3} />
                  <TextBlock
                    label="要点"
                    value={item.bullets.join('\n')}
                    onChange={(value) => updateProject(item.id, { bullets: splitLines(value) })}
                    rows={5}
                  />
                </ItemShell>
              )}
            />

            <CollapsiblePanel title="荣誉证书" icon={Trophy}>
              <TextBlock
                label="荣誉内容"
                value={resume.honors.text}
                onChange={(value) => setResume((current) => ({ ...current, honors: { text: value } }))}
                rows={5}
                placeholder="每行一条，支持 **加粗**"
              />
            </CollapsiblePanel>

            <CollectionEditor
              title="自定义模块"
              icon={ListPlus}
              onAdd={addCustomSection}
              items={resume.customSections}
              render={(item, index) => (
                <ItemShell
                  key={item.id}
                  title={item.title || '自定义模块'}
                  onUp={() => setResume((current) => ({ ...current, customSections: moveItem(current.customSections, index, -1) }))}
                  onDown={() => setResume((current) => ({ ...current, customSections: moveItem(current.customSections, index, 1) }))}
                  onDelete={() =>
                    setResume((current) => ({ ...current, customSections: current.customSections.filter((entry) => entry.id !== item.id) }))
                  }
                  upDisabled={index === 0}
                  downDisabled={index === resume.customSections.length - 1}
                >
                  <Field
                    label="标题"
                    value={item.title}
                    onChange={(value) =>
                      setResume((current) => ({
                        ...current,
                        customSections: current.customSections.map((entry) => (entry.id === item.id ? { ...entry, title: value } : entry)),
                      }))
                    }
                  />
                  <Field
                    label="副标题"
                    value={item.subtitle}
                    onChange={(value) =>
                      setResume((current) => ({
                        ...current,
                        customSections: current.customSections.map((entry) => (entry.id === item.id ? { ...entry, subtitle: value } : entry)),
                      }))
                    }
                  />
                  <TextBlock
                    label="内容"
                    value={item.items.join('\n')}
                    onChange={(value) =>
                      setResume((current) => ({
                        ...current,
                        customSections: current.customSections.map((entry) =>
                          entry.id === item.id ? { ...entry, items: splitLines(value) } : entry,
                        ),
                      }))
                    }
                    rows={5}
                  />
                </ItemShell>
              )}
            />
          </div>
        )}

        {activeTab === 'style' && (
          <div className="panel-scroll">
            <CollapsiblePanel title="视觉样式" icon={Palette} defaultOpen>
              <div className="preset-row" aria-label="样式预设">
                {stylePresets.map((preset) => (
                  <button
                    className="preset-btn"
                    type="button"
                    key={preset.id}
                    title={preset.title}
                    onClick={() => applyStylePreset(preset.patch, preset.label)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <button className="secondary-btn fit-btn" type="button" onClick={fitOnePage}>
                <Settings2 size={16} />
                一键适配一页
              </button>
              <div className="field-grid">
                <label className="field">
                  <span>强调色</span>
                  <input type="color" value={style.accent} onChange={(event) => updateStyle({ accent: event.target.value })} />
                </label>
                <label className="field">
                  <span>文字色</span>
                  <input type="color" value={style.ink} onChange={(event) => updateStyle({ ink: event.target.value })} />
                </label>
                <Field label="正文字体" value={style.fontFamily} onChange={(value) => updateStyle({ fontFamily: value })} />
                <Field label="等宽字体" value={style.monoFamily} onChange={(value) => updateStyle({ monoFamily: value })} />
              </div>
              <Slider label="字号" value={style.fontSize} min={8} max={13} step={0.1} onChange={(value) => updateStyle({ fontSize: value })} />
              <Slider label="行高" value={style.lineHeight} min={1.15} max={1.85} step={0.01} onChange={(value) => updateStyle({ lineHeight: value })} />
              <Slider label="姓名字号" value={style.nameSize} min={18} max={38} step={1} onChange={(value) => updateStyle({ nameSize: value })} />
              <Slider
                label="个人信息字号"
                value={style.contactSize}
                min={9}
                max={15}
                step={0.1}
                onChange={(value) => updateStyle({ contactSize: value })}
              />
              <Slider label="标题字号" value={style.headingSize} min={12} max={22} step={1} onChange={(value) => updateStyle({ headingSize: value })} />
              <Slider label="页边距" value={style.pageMargin} min={24} max={72} step={1} onChange={(value) => updateStyle({ pageMargin: value })} />
              <Slider label="模块间距" value={style.sectionGap} min={6} max={28} step={1} onChange={(value) => updateStyle({ sectionGap: value })} />
              <Slider label="经历间距" value={style.blockGap} min={4} max={22} step={1} onChange={(value) => updateStyle({ blockGap: value })} />
              <Slider
                label="简介-要点间距"
                value={style.evidenceGap}
                min={2}
                max={16}
                step={1}
                onChange={(value) => updateStyle({ evidenceGap: value })}
              />
              <Slider label="要点间距" value={style.bulletGap} min={1} max={10} step={1} onChange={(value) => updateStyle({ bulletGap: value })} />
              <Slider label="分割线" value={style.ruleWeight} min={0} max={4} step={0.5} onChange={(value) => updateStyle({ ruleWeight: value })} />
              <Slider label="项目缩进" value={style.bulletIndent} min={12} max={34} step={1} onChange={(value) => updateStyle({ bulletIndent: value })} />
            </CollapsiblePanel>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="panel-scroll">
            <CollapsiblePanel title="模块顺序" icon={GripVertical} defaultOpen>
              <div className="order-list">
                {resume.sectionOrder.map((key, index) => {
                  const Icon = sectionIcons[key]
                  return (
                    <div className="order-row" key={key}>
                      <span>
                        <Icon size={16} />
                        {sectionLabels[key]}
                      </span>
                      <div>
                        <IconButton
                          title="上移"
                          onClick={() =>
                            setResume((current) => ({ ...current, sectionOrder: moveItem(current.sectionOrder, index, -1) }))
                          }
                          disabled={index === 0}
                        >
                          <ArrowUp size={15} />
                        </IconButton>
                        <IconButton
                          title="下移"
                          onClick={() =>
                            setResume((current) => ({ ...current, sectionOrder: moveItem(current.sectionOrder, index, 1) }))
                          }
                          disabled={index === resume.sectionOrder.length - 1}
                        >
                          <ArrowDown size={15} />
                        </IconButton>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CollapsiblePanel>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="panel-scroll">
            <CollapsiblePanel title="数据备份" icon={Save} defaultOpen>
              <div className="data-actions">
                <button className="secondary-btn" type="button" onClick={exportJson}>
                  <Download size={16} />
                  导出 JSON
                </button>
                <button className="secondary-btn" type="button" onClick={() => jsonInputRef.current?.click()}>
                  <Upload size={16} />
                  导入 JSON
                </button>
                <input
                  ref={jsonInputRef}
                  className="hidden-file"
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    void importJson(event.target.files?.[0] || null)
                    event.currentTarget.value = ''
                  }}
                />
              </div>
            </CollapsiblePanel>
          </div>
        )}
      </aside>

      <section className="preview-panel">
        <ResumePreview resume={resume} style={style} previewRef={previewRef} />
      </section>
    </main>
  )
}

function CollectionEditor<T>({
  title,
  icon: Icon,
  items,
  onAdd,
  render,
  defaultOpen = false,
}: {
  title: string
  icon: typeof GraduationCap
  items: T[]
  onAdd: () => void
  render: (item: T, index: number) => ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details className="control-section collapse-panel" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary className="collapse-summary">
        <span className="summary-title">
          <Icon size={17} />
          {title}
          <b>{items.length}</b>
        </span>
        <span className="summary-actions">
        <IconButton
          title="新增"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onAdd()
          }}
        >
          <Plus size={16} />
        </IconButton>
          <ChevronDown className="summary-chevron" size={16} />
        </span>
      </summary>
      <div className="item-stack collapse-body">{items.map(render)}</div>
    </details>
  )
}

function CollapsiblePanel({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: typeof GraduationCap
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details className="control-section collapse-panel" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary className="collapse-summary">
        <span className="summary-title">
          <Icon size={17} />
          {title}
        </span>
        <ChevronDown className="summary-chevron" size={16} />
      </summary>
      <div className="collapse-body">{children}</div>
    </details>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="slider">
      <span>
        {label}
        <b>{value}</b>
      </span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export default App
