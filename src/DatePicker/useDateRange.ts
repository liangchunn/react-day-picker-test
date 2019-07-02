import { useState, useCallback, useEffect } from 'react'
import { DayModifiers } from 'react-day-picker'
import noop from '../util/noop'

export type DateRangeChangeListener = (fromDate: Date, toDate: Date) => void
export type DateRangeState = Date | undefined

export default function useDateRange(
  initFrom: DateRangeState = undefined,
  initTo: DateRangeState = undefined,
  changeListener: DateRangeChangeListener = noop
) {
  const [from, setFrom] = useState<DateRangeState>(initFrom)
  const [to, setTo] = useState<DateRangeState>(initTo)

  // we want to update the `from` and `to` when
  // the arguments for this hook changes
  useEffect(() => {
    setFrom(initFrom)
  }, [initFrom])
  useEffect(() => {
    setTo(initTo)
  }, [initTo])

  const resetHandler = () => {
    setFrom(undefined)
    setTo(undefined)
  }

  const handleDayClick: (
    day: Date,
    modifiers: DayModifiers,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void = useCallback(
    (day, modifiers) => {
      // if the dates are disabled, do nothing
      if (modifiers.disabled) {
        return
      }
      // select first date or selected date is before first date
      if (!from || (from && !to && day < from)) {
        setFrom(day)
        return
      }
      // select second date
      if (from && !to) {
        setTo(day)
        changeListener(from, day)
        return
      }
      // select date before `from` date
      if (from && day < from) {
        setFrom(day)
        setTo(undefined)
        return
      }
      // select date after `to` date
      if (to && day > to) {
        setFrom(day)
        setTo(undefined)
        return
      }
      // select date in between selected `from` and `to`
      if (from && to && from <= day && to >= day) {
        setFrom(undefined)
        setTo(undefined)
        return
      }
    },
    [from, to, changeListener]
  )

  const handleDayMouseEnter = (
    day: Date,
    modifiers: DayModifiers,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {}

  return {
    selected: [from, { from, to }] as const,
    onDayClick: handleDayClick,
    onDayMouseEnter: handleDayMouseEnter,
    modifiers: { start: from, end: to },
    reset: resetHandler,
  }
}
