import { ExternalLink as ExternalLinkIcon, BookOpen, Youtube, FileText, Code2 } from 'lucide-react'

const PLATFORM_CONFIG = {
  docs: { icon: BookOpen, color: '#22d3ee', label: 'Docs' },
  blog: { icon: FileText, color: '#a855f7', label: 'Article' },
  youtube: { icon: Youtube, color: '#ef4444', label: 'YouTube' },
  course: { icon: BookOpen, color: '#f59e0b', label: 'Course' },
  leetcode: { icon: Code2, color: '#f59e0b', label: 'LeetCode' },
  default: { icon: ExternalLinkIcon, color: 'var(--accent-secondary)', label: 'Link' },
}

export default function ExternalLink({ title, url, platform = 'default', description }) {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default
  const Icon = config.icon

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card interactive"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        textDecoration: 'none',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `${config.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} color={config.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
          <ExternalLinkIcon size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        </div>
        {description && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{description}</p>
        )}
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, color: config.color,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          marginTop: 4, display: 'block'
        }}>
          {config.label}
        </span>
      </div>
    </a>
  )
}
