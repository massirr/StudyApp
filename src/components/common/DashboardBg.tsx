import React from 'react';

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

function Bricks({ size, color = '#d58400' }: { size: number; color?: string }) {
  const h = Math.round(size * 5 / 9);
  return (
    <svg width={size} height={h} viewBox="0 0 9 5" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={0} y={0} width={4} height={2} fill={color} />
      <rect x={5} y={0} width={4} height={2} fill={color} />
      <rect x={2} y={3} width={5} height={2} fill={color} />
    </svg>
  );
}

type Shape = 'delta' | 'bolt' | 'bricks';

interface Item {
  type: Shape;
  size: number;
  opacity: number;
  pos: React.CSSProperties;
}

// position: fixed means pos values are % of the VIEWPORT (full screen width/height)
const ITEMS: Item[] = [
  // ── FAR LEFT EDGE ──
  { type: 'delta',  size: 62,  opacity: 0.065, pos: { top: '3%',  left: '1%'  } },
  { type: 'bolt',   size: 46,  opacity: 0.07,  pos: { top: '27%', left: '2%'  } },
  { type: 'bricks', size: 90,  opacity: 0.07,  pos: { top: '50%', left: 0      } },
  { type: 'delta',  size: 50,  opacity: 0.06,  pos: { top: '72%', left: '1%'  } },
  { type: 'bolt',   size: 38,  opacity: 0.065, pos: { top: '90%', left: '3%'  } },

  // ── LEFT COLUMN ──
  { type: 'bricks', size: 62,  opacity: 0.055, pos: { top: '12%', left: '11%' } },
  { type: 'delta',  size: 52,  opacity: 0.055, pos: { top: '48%', left: '13%' } },
  { type: 'bolt',   size: 40,  opacity: 0.06,  pos: { top: '80%', left: '9%'  } },

  // ── CENTRE-LEFT ──
  { type: 'delta',  size: 44,  opacity: 0.045, pos: { top: '6%',  left: '30%' } },
  { type: 'bolt',   size: 36,  opacity: 0.055, pos: { top: '40%', left: '26%' } },
  { type: 'bricks', size: 54,  opacity: 0.048, pos: { top: '70%', left: '28%' } },

  // ── CENTRE-RIGHT ──
  { type: 'bricks', size: 52,  opacity: 0.045, pos: { top: '18%', right: '28%' } },
  { type: 'delta',  size: 46,  opacity: 0.048, pos: { top: '56%', right: '30%' } },
  { type: 'bolt',   size: 34,  opacity: 0.05,  pos: { top: '84%', right: '26%' } },

  // ── RIGHT COLUMN ──
  { type: 'bolt',   size: 56,  opacity: 0.075, pos: { top: '9%',  right: '12%' } },
  { type: 'delta',  size: 130, opacity: 0.06,  pos: { top: '38%', right: '8%'  } },
  { type: 'bricks', size: 70,  opacity: 0.06,  pos: { top: '76%', right: '10%' } },

  // ── FAR RIGHT EDGE (large, bleeds) ──
  { type: 'delta',  size: 260, opacity: 0.07,  pos: { top: -20,   right: -30   } },
  { type: 'bricks', size: 82,  opacity: 0.065, pos: { top: '24%', right: '1%'  } },
  { type: 'delta',  size: 86,  opacity: 0.06,  pos: { top: '60%', right: '0%'  } },
  { type: 'bolt',   size: 44,  opacity: 0.065, pos: { top: '88%', right: '2%'  } },
];

function Piece({ type, size }: { type: Shape; size: number }) {
  if (type === 'bolt')   return <Bolt size={size} />;
  if (type === 'bricks') return <Bricks size={size} />;
  return <Delta size={size} />;
}

export function DashboardBg() {
  return (
    // position: fixed + inset: 0 = covers the full viewport regardless of container width
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 0 }}>
      {ITEMS.map((item, i) => (
        <div key={i} style={{ position: 'absolute', opacity: item.opacity, ...item.pos }}>
          <Piece type={item.type} size={item.size} />
        </div>
      ))}
    </div>
  );
}
