import React from 'react'
import DayPicker, { Modifier } from 'react-day-picker'
import useDateRange, {
  DateRangeChangeListener,
  DateRangeState,
} from './useDateRange'

import 'react-day-picker/lib/style.css'
import './DatePicker.css'

type DatePickerProps = {
  initialMonth: Date
  disabledDays?: Modifier | Modifier[]
  changeListener: DateRangeChangeListener
  initFrom: DateRangeState
  initTo: DateRangeState
}

export default function DatePicker(props: DatePickerProps) {
  const { changeListener, initialMonth, disabledDays, initFrom, initTo } = props
  const { selected, onDayClick, onDayMouseEnter, modifiers } = useDateRange(
    initFrom,
    initTo,
    changeListener
  )
  return (
    <DayPicker
      className="range"
      numberOfMonths={2}
      initialMonth={initialMonth}
      modifiers={modifiers}
      selectedDays={selected as any}
      disabledDays={disabledDays}
      onDayClick={onDayClick}
      onDayMouseEnter={onDayMouseEnter}
    />
  )
}
