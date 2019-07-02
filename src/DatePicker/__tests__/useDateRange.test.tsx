import { renderHook, act, HookResult } from '@testing-library/react-hooks'
import useDateRange, {
  DateRangeState,
  DateRangeChangeListener,
} from '../useDateRange'
import noop from '../../util/noop'

const fireOnDayClick = (
  result: HookResult<ReturnType<typeof useDateRange>>
) => (date: Date, modifiers: any = {}): void => {
  result.current.onDayClick(date, modifiers, {} as any)
}

const useDateRangeHookCallback = (
  {
    initFrom,
    initTo,
    changeListener,
  }: {
    initFrom: DateRangeState
    initTo: DateRangeState
    changeListener: DateRangeChangeListener
  } = {
    initFrom: undefined,
    initTo: undefined,
    changeListener: noop,
  }
) => useDateRange(initFrom, initTo, changeListener)

describe('[UNIT] useDateRange hook', () => {
  it('can initialize properly', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])
  })
  it('can set the `from` date when clicked', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = undefined
    act(() => {
      fireOnDayClick(result)(from)
    })
    expect(result.current.selected).toEqual([from, { from, to }])
  })
  it('can set the `to` date when the `from` date is already selected', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })
    expect(result.current.selected).toEqual([from, { from, to }])
  })
  it('clears the range if there is a selected range and the new date is within the range of the selected range ', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')
    const mid = new Date('Tue Jul 23 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })
    act(() => {
      fireOnDayClick(result)(mid)
    })
    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])
  })
  it('sets `from` date if the selected date is before the `from` date (if there is already a `to` date)', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')
    const before = new Date('Mon Jul 08 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })
    act(() => {
      fireOnDayClick(result)(before)
    })
    expect(result.current.selected).toEqual([
      before,
      { from: before, to: undefined },
    ])
  })
  it('sets `from` date if the selected date is before the `from` date (if there is no `to` date)', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const before = new Date('Mon Jul 08 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(before)
    })
    expect(result.current.selected).toEqual([
      before,
      { from: before, to: undefined },
    ])
  })
  it('sets `from` date if the selected date is after the `to` date', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')
    const after = new Date('Wed Jul 31 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })
    act(() => {
      fireOnDayClick(result)(after)
    })
    expect(result.current.selected).toEqual([
      after,
      { from: after, to: undefined },
    ])
  })
  it('should be able to select the same date', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const sameDate = new Date('Tue Jul 09 2019')
    const testEndDate = new Date('Sat Jul 27 2019')

    act(() => {
      fireOnDayClick(result)(sameDate)
    })
    act(() => {
      fireOnDayClick(result)(sameDate)
    })

    expect(result.current.selected).toEqual([
      sameDate,
      { from: sameDate, to: sameDate },
    ])
    // this is a regression to test if the mechanism above works
    // if it does, it should select the testEndDate as the `from` date
    act(() => {
      fireOnDayClick(result)(testEndDate)
    })

    expect(result.current.selected).toEqual([
      testEndDate,
      { from: testEndDate, to: undefined },
    ])
  })
  it('can reset the dates', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')
    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })

    expect(result.current.selected).toEqual([from, { from, to }])

    act(() => result.current.reset())

    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])
  })
  it('does nothing when disabled dates are clicked', () => {
    const { result } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')

    act(() => {
      fireOnDayClick(result)(from, { disabled: true })
    })

    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])
  })
  it('updates the state when new init props are passed in', () => {
    const { result, rerender } = renderHook(useDateRangeHookCallback)

    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])

    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')

    rerender({ initFrom: from, initTo: to, changeListener: noop })

    expect(result.current.selected).toEqual([from, { from, to }])
  })
  it('updates the date internally when passed new dates', () => {
    const { result, rerender } = renderHook(useDateRangeHookCallback)
    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')

    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])

    rerender({ initFrom: from, initTo: to, changeListener: noop })

    expect(result.current.selected[0]).toBe(from)
    expect(result.current.selected[1].from).toBe(from)
    expect(result.current.selected[1].to).toBe(to)
  })
  it("doesn't update the state if the dependencies of the prop update mechanism (useEffect) are referentially equal", () => {
    const { result, rerender } = renderHook(useDateRangeHookCallback)

    expect(result.current.selected).toEqual([
      undefined,
      { from: undefined, to: undefined },
    ])

    const from = new Date('Tue Jul 09 2019')
    const to = new Date('Sat Jul 27 2019')

    rerender({ initFrom: from, initTo: to, changeListener: noop })
    rerender({ initFrom: from, initTo: to, changeListener: noop })

    expect(result.current.selected[0]).toBe(from)
    expect(result.current.selected[1].from).toBe(from)
    expect(result.current.selected[1].to).toBe(to)
  })
  it('calls the changeListener when valid dates are selected', () => {
    const { rerender, result } = renderHook(useDateRangeHookCallback)
    const changeListener = jest.fn()
    const initFrom = new Date('Tue Jul 09 2019')
    const initTo = new Date('Sat Jul 27 2019')

    rerender({ initFrom, initTo, changeListener })

    const from = new Date('Mon Jul 08 2019')
    const to = new Date('Sun Jul 28 2019')

    act(() => {
      fireOnDayClick(result)(from)
    })
    act(() => {
      fireOnDayClick(result)(to)
    })

    expect(changeListener).toBeCalledTimes(1)
    expect(changeListener).toBeCalledWith(from, to)
  })
})
