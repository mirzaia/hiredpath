import techStacks from '../data/techStacks.json'

export default function TechStackSelector({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-3">
      {techStacks.map(stack => {
        const isSelected = selected.includes(stack.id)
        return (
          <button
            key={stack.id}
            onClick={() => onToggle(stack.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer select-none
              ${isSelected 
                ? 'shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }
            `}
            style={isSelected ? { borderColor: stack.color, color: stack.color, backgroundColor: `${stack.color}0f` } : {}}
          >
            <span className="text-lg leading-none">{stack.icon}</span>
            <span>{stack.name}</span>
            {isSelected && (
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stack.color }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
