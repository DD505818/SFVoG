"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer, useCallback, useRef } from "react"

interface ShortcutHandler {
  id: string
  keys: string
  callback: () => void
}

interface KeyboardShortcutsState {
  shortcuts: ShortcutHandler[]
}

type KeyboardShortcutsAction =
  | { type: "REGISTER_SHORTCUT"; payload: ShortcutHandler }
  | { type: "UNREGISTER_SHORTCUT"; payload: string }

interface KeyboardShortcutsContextType {
  registerShortcut: (keys: string, callback: () => void) => string
  unregisterShortcut: (id: string) => void
  shortcuts: ShortcutHandler[]
}

const initialState: KeyboardShortcutsState = {
  shortcuts: [],
}

function keyboardShortcutsReducer(
  state: KeyboardShortcutsState,
  action: KeyboardShortcutsAction,
): KeyboardShortcutsState {
  switch (action.type) {
    case "REGISTER_SHORTCUT":
      return {
        ...state,
        shortcuts: [...state.shortcuts, action.payload],
      }
    case "UNREGISTER_SHORTCUT":
      return {
        ...state,
        shortcuts: state.shortcuts.filter((shortcut) => shortcut.id !== action.payload),
      }
    default:
      return state
  }
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  registerShortcut: () => "",
  unregisterShortcut: () => {},
  shortcuts: [],
})

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(keyboardShortcutsReducer, initialState)
  const isMountedRef = useRef(true)

  const registerShortcut = useCallback((keys: string, callback: () => void) => {
    const id = `shortcut-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    dispatch({
      type: "REGISTER_SHORTCUT",
      payload: { id, keys, callback },
    })

    return id
  }, [])

  const unregisterShortcut = useCallback((id: string) => {
    dispatch({
      type: "UNREGISTER_SHORTCUT",
      payload: id,
    })
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key representation like "ctrl+shift+p"
      const keys: string[] = []
      if (event.ctrlKey) keys.push("ctrl")
      if (event.shiftKey) keys.push("shift")
      if (event.altKey) keys.push("alt")
      if (event.metaKey) keys.push("meta")

      // Add the key if it's not a modifier
      if (!["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
        keys.push(event.key.toLowerCase())
      }

      const keyCombo = keys.join("+")

      // Find and execute matching shortcuts
      state.shortcuts.forEach((shortcut) => {
        if (shortcut.keys.toLowerCase() === keyCombo) {
          event.preventDefault()
          shortcut.callback()
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      isMountedRef.current = false
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [state.shortcuts])

  const contextValue = {
    registerShortcut,
    unregisterShortcut,
    shortcuts: state.shortcuts,
  }

  return <KeyboardShortcutsContext.Provider value={contextValue}>{children}</KeyboardShortcutsContext.Provider>
}

export const useKeyboardShortcuts = () => useContext(KeyboardShortcutsContext)
