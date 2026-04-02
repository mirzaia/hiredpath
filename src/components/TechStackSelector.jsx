import techStacks from '../data/techStacks.json'

export default function TechStackSelector({ selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {techStacks.map(stack => {
        const isSelected = selected.includes(stack.id)
        return (
          <button
            key={stack.id}
            onClick={() => onToggle(stack.id)}
            className={`chip ${isSelected ? 'selected' : ''}`}
            style={isSelected ? { borderColor: stack.color, color: stack.color, background: `${stack.color}18` } : {}}
          >
            <span style={{ fontSize: '1.1rem' }}>{stack.icon}</span>
            <span>{stack.name}</span>
            {isSelected && (
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: stack.color, flexShrink: 0
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
