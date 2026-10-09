import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

/**
 * useEChart — attaches an ECharts instance to a container ref.
 *
 * @param {object|null} option  – ECharts option object (updates when reference changes)
 * @returns React ref to attach to the chart container div
 */
export function useEChart(option) {
  const ref    = useRef(null)
  const chart  = useRef(null)

  // Init on mount, dispose on unmount
  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current, null, { renderer: 'svg' })

    const handleResize = () => chart.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.current?.dispose()
      chart.current = null
    }
  }, [])

  // Update whenever option changes
  useEffect(() => {
    if (!chart.current || !option) return
    chart.current.setOption(option, { notMerge: true })
  }, [option])

  return ref
}
