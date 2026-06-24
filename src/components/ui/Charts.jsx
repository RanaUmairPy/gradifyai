import React, { useState } from "react";

// 1. Sleek Area Chart (Submission Trends)
export const SubmissionActivityChart = ({ data = [], height = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    // Default values if empty
    data = [
      { label: "Mon", value: 12 },
      { label: "Tue", value: 19 },
      { label: "Wed", value: 15 },
      { label: "Thu", value: 25 },
      { label: "Fri", value: 32 },
      { label: "Sat", value: 9 },
      { label: "Sun", value: 14 },
    ];
  }

  const padding = 35;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...data.map(d => d.value), 10);
  const pointsCount = data.length;

  // Generate SVG coordinates
  const getCoordinates = () => {
    return data.map((d, index) => {
      const x = padding + (index / (pointsCount - 1)) * (100 - (padding * 2) / 4.5 * 10) + "%"; // Will use SVG viewbox coordinate system instead for reliability
      // Let's use absolute numbers inside viewBox="0 0 500 200"
      const absX = padding + (index / (pointsCount - 1)) * (500 - padding * 2);
      const absY = height - padding - (d.value / maxValue) * chartHeight;
      return { x: absX, y: absY, value: d.value, label: d.label };
    });
  };

  const coords = getCoordinates();
  const pathData = coords.reduce((acc, c, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${c.x} ${c.y} `;
  }, "");

  // Create area path ending at bottom
  const areaData = pathData + `L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  return (
    <div className="relative w-full bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Submission Activity</h4>
          <p className="text-xs text-slate-500">Weekly upload statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Uploads</span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 500 ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = padding + (i / 3) * chartHeight;
            const val = Math.round(maxValue - (i / 3) * maxValue);
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={padding}
                  y1={y}
                  x2={500 - padding}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="dark:stroke-slate-800"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  className="fill-slate-400 dark:fill-slate-600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path
            d={areaData}
            fill="url(#indigoGradient)"
            opacity="0.15"
          />

          {/* Main Spline line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Hover interaction points */}
          {coords.map((c, idx) => (
            <g key={idx}>
              <circle
                cx={c.x}
                cy={c.y}
                r={hoveredIndex === idx ? "7" : "4"}
                className="fill-indigo-600 stroke-white dark:stroke-slate-900 shadow-md cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Invisible interactive vertical area */}
              <rect
                x={c.x - 20}
                y={padding}
                width="40"
                height={height - padding * 2}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* X Axis labels */}
              <text
                x={c.x}
                y={height - padding + 18}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                className="fill-slate-400 dark:fill-slate-500"
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip HTML Overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-slate-900/90 text-white px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md text-[10px] font-bold border border-slate-700 pointer-events-none transition-all duration-200"
            style={{
              left: `${(coords[hoveredIndex].x / 500) * 100}%`,
              top: `${(coords[hoveredIndex].y / height) * 100 - 24}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {data[hoveredIndex].value} Submissions
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Interactive SVG Bar Chart (Grade Distribution)
export const GradeDistributionChart = ({ data = [], height = 180 }) => {
  if (!data || data.length === 0) {
    data = [
      { label: "A+ (85-100)", count: 0, color: "bg-emerald-600" },
      { label: "A (80-84)", count: 0, color: "bg-emerald-500" },
      { label: "B (65-79)", count: 0, color: "bg-indigo-500" },
      { label: "C (55-64)", count: 0, color: "bg-purple-500" },
      { label: "D (50-54)", count: 0, color: "bg-amber-500" },
      { label: "F (<50)", count: 0, color: "bg-rose-500" },
    ];
  }

  const maxCount = Math.max(...data.map(d => d.count), 5);

  return (
    <div className="bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Grade Distribution</h4>
        <p className="text-xs text-slate-500">Student score classifications</p>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => {
          const pct = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {item.count} <span className="font-normal text-slate-400">students</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-50 dark:bg-slate-800/60 rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${item.color || "bg-indigo-500"} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Circle Progress Ring (Performance Gauge)
export const PerformanceGauge = ({ score = 84, label = "Average Class Marks", color = "text-indigo-600" }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between gap-4">
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">{label}</span>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white">{score}%</h3>
        <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
          <span>↑ 3.2%</span> <span className="font-normal text-slate-400">vs last month</span>
        </p>
      </div>

      <div className="relative shrink-0 select-none">
        <svg height={radius * 2} width={radius * 2} className="overflow-visible">
          {/* Background circle */}
          <circle
            stroke="#F1F5F9"
            className="dark:stroke-slate-800/60"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active progress */}
          <circle
            stroke="url(#gaugeGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
          />
          
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating text inside ring */}
        <span className="absolute inset-0 flex items-center justify-center font-black text-sm text-indigo-600 dark:text-indigo-400">
          {score}
        </span>
      </div>
    </div>
  );
};
