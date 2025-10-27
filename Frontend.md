function isGreaterPercent(a: string, b: string): boolean {
  const toNum = (s: string) => {
    if (typeof s !== 'string') return NaN
    const n = parseFloat(s.replace(/\s+/g, '').replace('%', ''))
    return Number.isFinite(n) ? n : NaN
  }
  const na = toNum(a)
  const nb = toNum(b)
  if (!Number.isFinite(na) || !Number.isFinite(nb)) return false
  return na > nb
}
