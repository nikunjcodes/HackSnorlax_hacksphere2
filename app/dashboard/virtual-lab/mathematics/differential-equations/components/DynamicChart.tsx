import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DynamicChartProps {
  data: Array<{ x: number; y: number }>
  timeStart?: number
  timeEnd?: number
}

export function DynamicChart({ data, timeStart = 0, timeEnd = 10 }: DynamicChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="x"
          label={{ value: 'x', position: 'bottom' }}
          domain={[timeStart, timeEnd]}
        />
        <YAxis
          label={{ value: 'y', angle: -90, position: 'left' }}
        />
        <Tooltip />
        <Line 
          type="monotone"
          dataKey="y"
          stroke="#2563eb"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 