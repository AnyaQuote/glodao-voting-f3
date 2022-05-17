import moment from 'moment'

export const toISO = ({ date, time }: { date: string; time: string }) => {
  const isoDate = moment(date, 'DD/MM/YYYY')
  const isoTime = moment(time, 'HH:mm')
  isoDate.set({
    hour: isoTime.get('hour'),
    minute: isoTime.get('minute'),
    second: isoTime.get('second'),
  })
  return isoDate.toISOString()
}
