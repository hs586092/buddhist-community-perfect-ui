/**
 * ActivityChart Component
 * 
 * Displays user activity data in various chart formats:
 * - Line charts for trends over time
 * - Bar charts for discrete periods
 * - Area charts for cumulative data
 * - Multiple metrics visualization
 * - Interactive tooltips and period selection
 */

import React, { useState, useMemo, useCallback } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import type { ActivityChartData, ActivityChartConfig, StatsPeriod } from '../../types/profile'

interface ActivityChartProps {
  data: StatsPeriod
  config?: Partial<ActivityChartConfig>
  onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void
  className?: string
}

interface ChartPoint {
  x: number
  y: number
  date: string
  value: number
  label: string
}

interface TooltipData {
  x: number
  y: number
  data: ActivityChartData
  visible: boolean
}

/**
 * Metric configuration for styling and display
 */
const metricConfig = {
  posts: { color: '#3B82F6', name: 'Posts', icon: '📝' },
  comments: { color: '#10B981', name: 'Comments', icon: '💬' },
  reactions: { color: '#F59E0B', name: 'Reactions', icon: '👍' },
  meditation: { color: '#8B5CF6', name: 'Meditation (min)', icon: '🧘' },
  events: { color: '#EF4444', name: 'Events', icon: '📅' }
} as const

/**
 * Generate SVG path for line chart
 */
const generateLinePath = (points: ChartPoint[]): string => {
  if (points.length === 0) return ''
  
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '')
  
  return pathData.trim()
}

/**
 * Generate SVG path for area chart
 */
const generateAreaPath = (points: ChartPoint[], height: number): string => {
  if (points.length === 0) return ''
  
  const linePath = generateLinePath(points)
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  
  return `${linePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`
}

/**
 * Main ActivityChart component
 */
export const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  config = {},
  onPeriodChange,
  className
}) => {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, data: null as any, visible: false })
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(config.metrics || ['posts', 'comments', 'reactions'])
  )

  // Chart configuration with defaults
  const chartConfig: ActivityChartConfig = {
    type: 'line',
    period: 'month',
    metrics: ['posts', 'comments', 'reactions'],
    showComparison: false,
    showTrend: true,
    animated: true,
    ...config
  }

  // Chart dimensions
  const width = 400
  const height = 200
  const padding = { top: 20, right: 20, bottom: 40, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Process data for selected metrics
  const chartData = useMemo(() => {
    const metrics = Array.from(selectedMetrics)
    const processedData: Record<string, ChartPoint[]> = {}

    metrics.forEach(metric => {
      const maxValue = Math.max(...data.data.map(d => {
        switch (metric) {
          case 'posts': return d.postsCount
          case 'comments': return d.commentsCount
          case 'reactions': return d.reactionsCount
          case 'meditation': return d.meditationMinutes
          case 'events': return d.eventsCount
          default: return 0
        }
      }))

      processedData[metric] = data.data.map((item, index) => {
        const value = (() => {
          switch (metric) {
            case 'posts': return item.postsCount
            case 'comments': return item.commentsCount
            case 'reactions': return item.reactionsCount
            case 'meditation': return item.meditationMinutes
            case 'events': return item.eventsCount
            default: return 0
          }
        })()

        return {
          x: padding.left + (index / (data.data.length - 1)) * chartWidth,
          y: padding.top + (1 - value / (maxValue || 1)) * chartHeight,
          date: item.date,
          value,
          label: `${value} ${metricConfig[metric as keyof typeof metricConfig]?.name || metric}`
        }
      })
    })

    return processedData
  }, [data.data, selectedMetrics, chartWidth, chartHeight, padding])

  // Handle metric toggle
  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(metric)) {
        newSet.delete(metric)
      } else {
        newSet.add(metric)
      }
      return newSet
    })
  }, [])

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find closest data point
    const dataIndex = Math.round(((x - padding.left) / chartWidth) * (data.data.length - 1))
    const dataPoint = data.data[dataIndex]

    if (dataPoint && x >= padding.left && x <= width - padding.right) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        data: dataPoint,
        visible: true
      })
    } else {
      setTooltip(prev => ({ ...prev, visible: false }))
    }
  }, [data.data, chartWidth, padding, width])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }, [])

  // Generate date labels
  const dateLabels = useMemo(() => {
    const step = Math.ceil(data.data.length / 5) // Show max 5 labels
    return data.data
      .filter((_, index) => index % step === 0)
      .map((item, index) => ({
        x: padding.left + (index * step / (data.data.length - 1)) * chartWidth,
        date: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }))
  }, [data.data, chartWidth, padding])

  return (
    <div className={cn("bg-white/5 dark:bg-black/20 rounded-lg border border-white/20 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Activity Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Period selector */}
        {onPeriodChange && (
          <div className="flex gap-1 bg-white/10 dark:bg-black/20 rounded-lg p-1">
            {(['week', 'month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => onPeriodChange(period)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all capitalize",
                  data.period === period
                    ? "bg-primary-500 text-white"
                    : "hover:bg-white/20 dark:hover:bg-white/10"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Metric toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(metricConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleMetricToggle(key)}
            className={cn(
              "flex items-center gap-1 px-3 py-1 text-sm rounded-full border transition-all",
              selectedMetrics.has(key)
                ? "border-primary-500 bg-primary-500/20 text-primary-600"
                : "border-white/20 hover:border-primary-500/50"
            )}
          >
            <span>{config.icon}</span>
            <span>{config.name}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-300 dark:text-gray-600"
                opacity="0.3"
              />
            </pattern>
          </defs>
          
          <rect
            x={padding.left}
            y={padding.top}
            width={chartWidth}
            height={chartHeight}
            fill="url(#grid)"
          />

          {/* Chart content */}
          {chartConfig.type === 'line' && Object.entries(chartData).map(([metric, points]) => (
            <g key={metric}>
              {/* Line */}
              <path
                d={generateLinePath(points)}
                fill="none"
                stroke={metricConfig[metric as keyof typeof metricConfig]?.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={chartConfig.animated ? "animate-pulse" : ""}
              />
              
              {/* Points */}
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={metricConfig[metric as keyof typeof metricConfig]?.color}
                  className="hover:r-4 transition-all"
                />
              ))}
            </g>
          ))}

          {chartConfig.type === 'area' && Object.entries(chartData).map(([metric, points]) => (
            <g key={metric}>
              {/* Area */}
              <path
                d={generateAreaPath(points, height - padding.bottom)}
                fill={metricConfig[metric as keyof typeof metricConfig]?.color}
                fillOpacity="0.3"
              />
              
              {/* Line */}
              <path
                d={generateLinePath(points)}
                fill="none"
                stroke={metricConfig[metric as keyof typeof metricConfig]?.color}
                strokeWidth="2"
              />
            </g>
          ))}

          {chartConfig.type === 'bar' && Object.entries(chartData).map(([metric, points], metricIndex) => (
            <g key={metric}>
              {points.map((point, index) => {
                const barWidth = chartWidth / data.data.length * 0.8
                const barX = point.x - barWidth / 2 + (metricIndex * barWidth / selectedMetrics.size)
                const barHeight = height - padding.bottom - point.y
                
                return (
                  <rect
                    key={index}
                    x={barX}
                    y={point.y}
                    width={barWidth / selectedMetrics.size}
                    height={barHeight}
                    fill={metricConfig[metric as keyof typeof metricConfig]?.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                )
              })}
            </g>
          ))}

          {/* X-axis labels */}
          {dateLabels.map((label, index) => (
            <text
              key={index}
              x={label.x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500 dark:fill-gray-400"
            >
              {label.date}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="fixed z-50 bg-black/80 text-white p-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="text-sm font-medium mb-1">
              {new Date(tooltip.data.date).toLocaleDateString()}
            </div>
            <div className="space-y-1 text-xs">
              <div>📝 Posts: {tooltip.data.postsCount}</div>
              <div>💬 Comments: {tooltip.data.commentsCount}</div>
              <div>👍 Reactions: {tooltip.data.reactionsCount}</div>
              <div>🧘 Meditation: {tooltip.data.meditationMinutes}m</div>
              <div>📅 Events: {tooltip.data.eventsCount}</div>
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {data.summary.totalPosts}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {Math.floor(data.summary.totalMeditation / 60)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Meditation</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {data.summary.averageDaily.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Daily Avg</div>
        </div>
        <div className="text-center">
          <div className={cn(
            "text-lg font-medium flex items-center justify-center gap-1",
            data.summary.improvement > 0 ? "text-green-600" : "text-red-500"
          )}>
            <span>{data.summary.improvement > 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(data.summary.improvement)}%</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Change</div>
        </div>
      </div>
    </div>
  )
}

ActivityChart.displayName = 'ActivityChart'