import moment, { Moment } from 'moment'

/**
 * Convert object contains date and time value to ISO format date (YYYY-MM-DDTHH:mm:ss000z), if no time is provided, use 00:00 as default
 * @param param shape: {date: YYYY-MM-DD, time: HH:mm}
 * @returns date converted to ISO format, if date is undefined, return empty string
 */
export const toISO = ({ date, time }: { date: string; time: string }): string => {
  if (!date) return ''
  return toMoment({ date, time }).toISOString()
}

/**
 * Convert object contains date and time value to moment date, if no time is provided, use 00:00 as default
 * @param param shape: {date: YYYY-MM-DD, time: HH:mm}
 * @returns date converted to moment
 */
export const toMoment = ({ date, time }: { date: string; time: string }): Moment => {
  if (!date) return moment()
  const momentDate = moment(date, 'YYYY-MM-DD')
  if (time) {
    const momentTime = moment(time, 'HH:mm')
    momentDate.set({
      hour: momentTime.get('hour'),
      minute: momentTime.get('minute'),
      second: momentTime.get('second'),
    })
  }
  return momentDate
}

/**
 * Get formatted value that the pattern from the original value
 * @param value string date and iso date
 * @param pattern format pattern, default is YYYY-MM-DD
 * @returns the formatted moment of the date that matched the pattern
 */
export const getValueByFormat = (value: string, pattern = 'YYYY-MM-DD') => {
  return moment(value).format(pattern)
}

/**
 * Get the date after the date in ISO string date
 * @param iso ISO 8061 format YYYY-MM-DDTHH:mm:ss000z
 * @param pattern format pattern, default YYYY-MM-DD
 * @returns date string matched the format pattern and after the date in ISO format
 */
export const getTheDateAfterISO = (iso: string, pattern = 'YYYY-MM-DD') => {
  return moment(iso).add(1, 'd').format(pattern)
}

/**
 * Check if a date in in valid in the provided range restricted by start and end date
 * @param isoCheckDate the date to check in iso 8601 format YYYY-MM-DDTHH:mm:ss000z
 * @param isoStartDate the min date in iso format
 * @param isoEndDate the max date in iso format
 * @returns true if date is in valid range, false if checking has problem or not in valid range
 */
export const isDateInRange = (isoCheckDate: string, isoStartDate: string, isoEndDate: string) => {
  try {
    return moment(isoCheckDate).isSameOrAfter(moment(isoStartDate)) && moment(isoCheckDate).isBefore(moment(isoEndDate))
  } catch (error) {
    return false
  }
}
