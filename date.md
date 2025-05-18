```js
import dayjs from "dayjs"

export const INVALID_DATE = "Invalid Date"
export const DATE_FORMAT = "DD-MMM-YYYY"
export const API_DATE_FORMAT = "YYYY-MM-DD"
export const DATE_TIME_FORMAT = "DD-MMM-YYYY HH:mm"

export function formatDate(datejs) {
  if (datejs && new Date(datejs).toString() !== INVALID_DATE) {
    return dayjs(datejs).format(DATE_FORMAT)
  }
  return null
}

export function formatDateTime(datejs) {
  if (datejs && new Date(datejs).toString() !== INVALID_DATE) {
    return dayjs(datejs).format(DATE_TIME_FORMAT)
  }
  return null
}

export function parseDate(datestr) {
  return dayjs(datestr, DATE_FORMAT)
}

export function now() {
  return formatDate(dayjs())
}

export function nowDayDefaultTime() {
  const nowTime = new Date().toLocaleDateString("zh-CN")
  return formatDateTime(nowTime)
}

export function isValidityDate(val) {
  if (val && new Date(val).toString() !== INVALID_DATE) {
    return true
  }
  return false
}

export function diffDate(start, end) {
  if (isValidityDate(start) && isValidityDate(end)) {
    return dayjs(end).diff(dayjs(start), "days", true)
  }
  return null
}
```
