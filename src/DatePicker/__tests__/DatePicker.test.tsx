import React from 'react'
import { render, act, fireEvent, cleanup } from '@testing-library/react'

import DatePicker from '../DatePicker'
import { DateRangeState } from '../useDateRange'

function createDatePickerFixture(
  initFrom: DateRangeState = undefined,
  initTo: DateRangeState = undefined
) {
  const changeListener = jest.fn()
  return {
    element: (
      <DatePicker
        initialMonth={new Date('Mon Jul 01 2019')}
        disabledDays={{
          before: new Date('Thu Jul 04 2019'),
          after: new Date('Wed Aug 07 2019'),
        }}
        changeListener={changeListener}
        initFrom={initFrom}
        initTo={initTo}
      />
    ),
    changeListener,
  }
}

describe('[INTEGRATION] DatePicker', () => {
  afterEach(() => {
    cleanup()
  })
  it('can select dates', () => {
    const { element } = createDatePickerFixture()
    const { getAllByText } = render(element)
    const from = getAllByText('11')[0]
    const to = getAllByText('20')[0]
    expect(from.getAttribute('aria-selected')).toBe('false')
    expect(to.getAttribute('aria-selected')).toBe('false')
    act(() => {
      fireEvent.click(from)
    })
    act(() => {
      fireEvent.click(to)
    })
    expect(from.getAttribute('aria-selected')).toBe('true')
    expect(to.getAttribute('aria-selected')).toBe('true')
  })
  it('can calls changeListener with the selected dates when dates are selected', () => {
    const { element, changeListener } = createDatePickerFixture()
    const { getAllByText } = render(element)
    const from = getAllByText('11')[0]
    const to = getAllByText('20')[0]
    act(() => {
      fireEvent.click(from)
    })
    act(() => {
      fireEvent.click(to)
    })
    expect(changeListener).toBeCalledTimes(1)
    // TODO: clean this, somehow it's returning dates one day back?
    expect(changeListener.mock.calls[0][0].getTime() / 1000).toEqual(1562839200)
    expect(changeListener.mock.calls[0][1].getTime() / 1000).toEqual(1563616800)
  })
  it('cannot select dates in disabled fields', () => {
    const { element } = createDatePickerFixture()
    const { getAllByText } = render(element)
    const from = getAllByText('14')[1] // select next month
    const to = getAllByText('22')[1] // select next month
    expect(from.getAttribute('aria-selected')).toBe('false')
    expect(to.getAttribute('aria-selected')).toBe('false')
    act(() => {
      fireEvent.click(from)
    })
    act(() => {
      fireEvent.click(to)
    })
    expect(from.getAttribute('aria-selected')).toBe('false')
    expect(to.getAttribute('aria-selected')).toBe('false')
  })
  it('accepts and pre-selects dates when passed initFrom and initTo', () => {
    const initFrom = new Date('Wed 17 Jul 2019')
    const initTo = new Date('Sat 20 Jul 2019')
    const { element } = createDatePickerFixture(initFrom, initTo)
    const { getAllByText } = render(element)
    const from = getAllByText('17')[0]
    const to = getAllByText('20')[0]
    expect(from.getAttribute('aria-selected')).toBe('true')
    expect(to.getAttribute('aria-selected')).toBe('true')
  })
  it('rerenders with new dates when they are passed in as props', () => {
    const initFrom = new Date('Wed 17 Jul 2019')
    const initTo = new Date('Sat 20 Jul 2019')
    const { element } = createDatePickerFixture(initFrom, initTo)
    const { rerender, getAllByText } = render(element)

    const newFrom = new Date('Sun 21 Jul 2019')
    const newTo = new Date('Sat 27 Jul 2019')

    rerender(createDatePickerFixture(newFrom, newTo).element)

    const from = getAllByText('21')[0]
    const to = getAllByText('27')[0]

    expect(from.getAttribute('aria-selected')).toBe('true')
    expect(to.getAttribute('aria-selected')).toBe('true')
  })
})
