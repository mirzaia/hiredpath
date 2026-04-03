import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'hiredpath-state'

const initialState = {
  onboardingDone: false,
  selectedStacks: [],
  topicProgress: {},   // { [topicId]: { completed: bool, confidence: 1-5 } }
  completedQuestions: [], // array of question IDs
  sidebarOpen: true,
  customPlan: null, // this will be deprecated/used for legacy state
  jdText: '',
  apiKey: '',
  savedPlans: [], // array of { id, companyName, jdText, modules }
  activePlanId: null,
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...initialState, ...parsed }
    }
  } catch {
    // ignore parse errors
  }
  return initialState
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingDone: true, selectedStacks: action.stacks }

    case 'SET_STACKS':
      return { ...state, selectedStacks: action.stacks }

    case 'TOGGLE_TOPIC_COMPLETE': {
      const existing = state.topicProgress[action.topicId] || { completed: false, confidence: 0 }
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.topicId]: { ...existing, completed: !existing.completed },
        },
      }
    }

    case 'SET_CONFIDENCE': {
      const existing = state.topicProgress[action.topicId] || { completed: false, confidence: 0 }
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.topicId]: { ...existing, confidence: action.confidence },
        },
      }
    }

    case 'TOGGLE_QUESTION_COMPLETE': {
      const isCompleted = state.completedQuestions.includes(action.questionId)
      return {
        ...state,
        completedQuestions: isCompleted
          ? state.completedQuestions.filter(id => id !== action.questionId)
          : [...state.completedQuestions, action.questionId],
      }
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'SET_API_KEY':
      return { ...state, apiKey: action.key }

    case 'SAVE_NEW_PLAN':
      return {
        ...state,
        savedPlans: [...state.savedPlans, action.planData],
        activePlanId: action.planData.id,
        onboardingDone: true
      }

    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlanId: action.planId }

    case 'SAVE_TOPIC_CONTENT': {
      const planIndex = state.savedPlans.findIndex(p => p.id === action.planId);
      if (planIndex === -1) return state;

      const plan = state.savedPlans[planIndex];
      const modIndex = plan.modules.findIndex(m => m.id === action.moduleId);
      if (modIndex === -1) return state;

      const topIndex = plan.modules[modIndex].topics.findIndex(t => t.id === action.topicId);
      if (topIndex === -1) return state;

      const updatedTopics = [...plan.modules[modIndex].topics];
      updatedTopics[topIndex] = {
        ...updatedTopics[topIndex],
        ...action.content,
        contentGenerated: true
      };

      const updatedModules = [...plan.modules];
      updatedModules[modIndex] = {
        ...updatedModules[modIndex],
        topics: updatedTopics
      };

      const updatedPlans = [...state.savedPlans];
      updatedPlans[planIndex] = {
        ...plan,
        modules: updatedModules
      };

      return {
        ...state,
        savedPlans: updatedPlans
      };
    }

    case 'DELETE_PLAN':
      return {
        ...state,
        savedPlans: state.savedPlans.filter(p => p.id !== action.planId),
        activePlanId: state.activePlanId === action.planId ? null : state.activePlanId
      }

    // Legacy handler
    case 'SET_CUSTOM_PLAN':
      return { 
        ...state, 
        customPlan: action.plan, 
        jdText: action.jdText, 
        onboardingDone: true 
      }

    case 'RESET_ONBOARDING':
      return { ...state, onboardingDone: false, selectedStacks: [], customPlan: null, jdText: '' }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage)

  useEffect(() => {
    const { sidebarOpen, ...toSave } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Selector helpers
export function useModuleProgress(moduleTopics) {
  const { state } = useApp()
  const total = moduleTopics.length
  const completed = moduleTopics.filter(t => state.topicProgress[t.id]?.completed).length
  return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
}

export function useTopicState(topicId) {
  const { state, dispatch } = useApp()
  const progress = state.topicProgress[topicId] || { completed: false, confidence: 0 }
  const toggle = () => dispatch({ type: 'TOGGLE_TOPIC_COMPLETE', topicId })
  const setConfidence = (confidence) => dispatch({ type: 'SET_CONFIDENCE', topicId, confidence })
  return { ...progress, toggle, setConfidence }
}

export function useQuestionState(questionId) {
  const { state, dispatch } = useApp()
  const isCompleted = state.completedQuestions.includes(questionId)
  const toggle = () => dispatch({ type: 'TOGGLE_QUESTION_COMPLETE', questionId })
  return { isCompleted, toggle }
}
