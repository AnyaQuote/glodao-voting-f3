import moment, { Moment } from 'moment'

/**
 * Convert string date and time to ISO format date (YYYY-MM-DDTHH:mm:ss000z), if no time is provided, use 00:00 as default
 * @param param shape: {date: YYYY-MM-DD, time: HH:mm}
 * @returns date converted to ISO format, if date is undefined, return empty string
 */
export const toISO = ({ date, time }: { date: string; time: string }): string => {
  if (!date) return ''
  return toMoment({ date, time }).toISOString()
}

/**
 * Convert string date and time to moment date, if no time is provided, use 00:00 as default
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
 * Get date part (the YYYY-MM-DD) from ISO string
 * @param iso ISO 8061 format YYYY-MM-DDTHH:mm:ss000z
 * @param pattern format pattern, default YYYY-MM-DD
 * @returns date string matched the format pattern
 */
export const getDateFromISO = (iso: string, pattern = 'YYYY-MM-DD') => {
  return moment(iso).format(pattern)
}

/**
 * Get time part (the HH:mm) from ISO string
 * @param iso ISO 8061 format YYYY-MM-DDTHH:mm:ss000z
 * @param pattern format pattern, default HH:mm
 * @returns time string matched the format pattern
 */
export const getTimeFromISO = (iso: string, pattern = 'HH:mm') => {
  return moment(iso).format(pattern)
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
