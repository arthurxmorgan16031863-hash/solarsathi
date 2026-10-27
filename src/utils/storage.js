import { useEffect, useState } from 'react'

export const SEED_OPEN = 3 // demo tickets shown on Overview/Sidebar

export function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event('ss:update'))
    return true
  } catch {
    return false
  }
}

export function getComplaints() {
  const list = readJSON('ss_complaints', [])
  return Array.isArray(list) ? list.filter(c => c && c.id) : []
}

export function useComplaints() {
  const [list, setList] = useState(getComplaints)
  useEffect(() => {
    const sync = () => setList(getComplaints())
    window.addEventListener('ss:update', sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('ss:update', sync); window.removeEventListener('storage', sync) }
  }, [])
  return list
}
