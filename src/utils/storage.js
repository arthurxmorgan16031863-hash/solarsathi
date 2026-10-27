import { useEffect, useState } from 'react'

export const SEED_OPEN = 0 // no fake tickets: counts come only from real submissions

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

export const getLastCalc = () => readJSON('ss_last_calc', null)
export const getSurveyCount = () => Number(readJSON('ss_survey_count', 0)) || 0

export const getProfileName = () => {
  const n = readJSON('ss_profile_name', '')
  return typeof n === 'string' ? n.trim() : ''
}

export function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function useProfileName() {
  const [name, setName] = useState(getProfileName)
  useEffect(() => {
    const sync = () => setName(getProfileName())
    window.addEventListener('ss:update', sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('ss:update', sync); window.removeEventListener('storage', sync) }
  }, [])
  const edit = () => {
    const next = window.prompt('Enter your name (saved only in this browser):', name)
    if (next !== null) writeJSON('ss_profile_name', next.trim().slice(0, 40))
  }
  return [name, edit]
}
