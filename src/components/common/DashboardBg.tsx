import React from 'react';

// Delta triangle (▲) — Delta Lake symbol, viewBox 0 0 11 6
function Delta({ size, color = '#d58400' }: { size: number; color?: string }) {
  const h = Math.round(size * 6 / 11);
  return (
    <svg width={size} height={h} viewBox="0 0 11 6" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={5} y={0} width={1} height={1} fill={color} />
      <rect x={4} y={1} width={3} height={1} fill={color} />
      <rect x={3} y={2} width={5} height={1} fill={color} />
      <rect x={2} y={3} width={7} height={1} fill={color} />
      <rect x={1} y={4} width={9} height={1} fill={color} />
      <rect x={0} y={5} width={11} height={1} fill={color} />
    </svg>
  );
}

// Lightning bolt (⚡) — Apache Spark symbol, viewBox 0 0 5 5
function Bolt({ size, color = '#d58400' }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 5 5" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={1} y={0} width={4} height={1} fill={color} />
      <rect x={2} y={1} width={3} height={1} fill={color} />
      <rect x={1} y={2} width={3} height={1} fill={color} />
      <rect x={0} y={3} width={3} height={1} fill={color} />
      <rect x={0} y={4} width={4} height={1} fill={color} />
    </svg>
  );
}

// Stacked data bricks — Databricks logo motif, viewBox 0 0 9 5
function Bricks({ size, color = '#d58400' }: { size: number; color?: string }) {
  const h = Math.round(size * 5 / 9);
  return (
    <svg width={size} height={h} viewBox="0 0 9 5" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* top row: two bricks */}
      <rect x={0} y={0} width={4} height={2} fill={color} />
      <rect x={5} y={0} width={4} height={2} fill={color} />
      {/* bottom row: one offset brick */}
      <rect x={2} y={3} width={5} height={2} fill={color} />
    </svg>
  );
}

type Pos = React.CSSProperties;

export function DashboardBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>

      {/* ── Delta triangles ── */}
      <div style={{ position: 'absolute', top: -20, right: -30, opacity: 0.07 } as Pos}>
        <Delta size={240} />
      </div>
      <div style={{ position: 'absolute', top: '38%', right: '6%', opacity: 0.055 } as Pos}>
        <Delta size={130} />
      </div>
      <div style={{ position: 'absolute', top: '62%', right: '26%', opacity: 0.048 } as Pos}>
        <Delta size={66} />
      </div>
      <div style={{ position: 'absolute', bottom: '18%', left: '3%', opacity: 0.055 } as Pos}>
        <Delta size={88} />
      </div>
      <div style={{ position: 'absolute', top: '22%', left: '40%', opacity: 0.038 } as Pos}>
        <Delta size={44} />
      </div>

      {/* ── Spark lightning bolts ── */}
      <div style={{ position: 'absolute', top: '8%', right: '22%', opacity: 0.08 } as Pos}>
        <Bolt size={56} />
      </div>
      <div style={{ position: 'absolute', bottom: '12%', right: '8%', opacity: 0.065 } as Pos}>
        <Bolt size={40} />
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '18%', opacity: 0.05 } as Pos}>
        <Bolt size={32} />
      </div>

      {/* ── Databricks stacked bricks ── */}
      <div style={{ position: 'absolute', top: '44%', left: 0, opacity: 0.065 } as Pos}>
        <Bricks size={96} />
      </div>
      <div style={{ position: 'absolute', bottom: '32%', right: '3%', opacity: 0.055 } as Pos}>
        <Bricks size={72} />
      </div>
      <div style={{ position: 'absolute', top: '16%', right: '40%', opacity: 0.042 } as Pos}>
        <Bricks size={54} />
      </div>

    </div>
  );
}
