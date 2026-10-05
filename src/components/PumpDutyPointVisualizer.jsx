import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ReferenceDot } from 'recharts';
import { Target, Droplets, Ruler } from 'lucide-react';
import './PumpVisualizer.css';

const PumpDutyPointVisualizer = ({ curves }) => {
  const [inputDepth, setInputDepth] = useState('');
  const [inputFlow, setInputFlow] = useState('');

  const chartData = useMemo(() => {
    if (!curves || curves.length === 0) return [];
    return curves
      .filter((c) => c.flow_rate_m3h != null && c.flow_rate_m3h !== '' && c.head_m != null && c.head_m !== '')
      .map((c) => ({
        flow: parseFloat(c.flow_rate_m3h) || 0,
        head: parseFloat(c.head_m) || 0,
        label: `${c.flow_rate_m3h}`,
      }));
  }, [curves]);

  if (chartData.length === 0) return null;

  const depth = parseFloat(inputDepth) || 0;
  const flow = parseFloat(inputFlow) || 0;

  const getNearestCurvePoint = (targetFlow) => {
    if (chartData.length === 0) return null;
    let closest = chartData[0];
    let minDiff = Math.abs(chartData[0].flow - targetFlow);
    for (const point of chartData) {
      const diff = Math.abs(point.flow - targetFlow);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest;
  };

  const isMatch = depth > 0 && flow > 0 && (() => {
    const curvePoint = getNearestCurvePoint(flow);
    if (!curvePoint) return false;
    const depthRange = depth;
    const safeMargin = depthRange * 1.15;
    return curvePoint.head >= depthRange && curvePoint.head <= safeMargin;
  })();

  const getRecommendation = () => {
    if (depth === 0 && flow === 0) return null;
    if (depth === 0 || flow === 0) return { type: 'info', text: 'Enter both depth and flow rate to check compatibility.' };
    const curvePoint = getNearestCurvePoint(flow);
    if (!curvePoint) return { type: 'info', text: 'Insufficient performance data for this flow rate.' };
    if (curvePoint.head >= depth * 1.15) {
      return { type: 'success', text: `Good match! At ${flow} m³/h, this pump delivers ~${curvePoint.head}m head, exceeding your ${depth}m depth requirement.` };
    }
    if (curvePoint.head >= depth) {
      return { type: 'warning', text: `Marginal match. At ${flow} m³/h, the pump delivers ~${curvePoint.head}m head for your ${depth}m depth. Consider a safety margin.` };
    }
    return { type: 'error', text: `Not suitable. At ${flow} m³/h, this pump only delivers ~${curvePoint.head}m head, which is below your ${depth}m depth requirement.` };
  };

  const recommendation = getRecommendation();

  return (
    <div className="card pump-visualizer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <Target size={20} color="var(--clr-brand-secondary)" />
        <h3 style={{ margin: 0 }}>Duty Point Checker</h3>
      </div>
      <p className="pump-visualizer-subtitle">
        Enter your borehole specifications to check if this pump matches your requirements.
      </p>

      <div className="pump-visualizer-inputs">
        <div className="pump-visualizer-field">
          <label>
            <Ruler size={14} />
            Depth (meters)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={inputDepth}
            onChange={(e) => setInputDepth(e.target.value)}
            placeholder="e.g. 40"
          />
        </div>
        <div className="pump-visualizer-field">
          <label>
            <Droplets size={14} />
            Target Flow (m³/h)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={inputFlow}
            onChange={(e) => setInputFlow(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {recommendation && (
        <div className={`pump-visualizer-result ${recommendation.type}`}>
          {recommendation.type === 'success' && '✓'}
          {recommendation.type === 'warning' && '⚠'}
          {recommendation.type === 'error' && '✗'}
          {recommendation.type === 'info' && 'ℹ'}
          <span>{recommendation.text}</span>
        </div>
      )}

      <div className="pump-visualizer-chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--clr-text-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--clr-border)' }}
              label={{ value: 'Flow Rate (m³/h)', position: 'insideBottom', offset: -3, style: { fontSize: 11, fill: 'var(--clr-text-muted)' } }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--clr-text-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--clr-border)' }}
              label={{ value: 'Head (m)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: 'var(--clr-text-muted)' } }}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid var(--clr-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
              }}
              formatter={(value) => [`${value} m`, 'Head']}
              labelFormatter={(label) => `Flow: ${label} m³/h`}
            />
            {depth > 0 && (
              <ReferenceLine
                y={depth}
                stroke="#ef4444"
                strokeDasharray="6 3"
                label={{ value: `Your Depth: ${depth}m`, position: 'right', fontSize: 11, fill: '#ef4444' }}
              />
            )}
            {depth > 0 && flow > 0 && (() => {
              const pt = getNearestCurvePoint(flow);
              if (!pt) return null;
              return (
                <ReferenceDot
                  x={pt.label}
                  y={pt.head}
                  r={8}
                  fill={isMatch ? '#10b981' : '#ef4444'}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            })()}
            <Bar dataKey="head" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => {
                const intensity = 0.3 + (index / chartData.length) * 0.7;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(2, 101, 192, ${intensity})`}
                    stroke="rgba(2, 101, 192, 0.4)"
                    strokeWidth={1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PumpDutyPointVisualizer;
