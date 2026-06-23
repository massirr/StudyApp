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

const ITEMS: Item[] = [
  // ── FAR LEFT (left: 0–4%) ──
  { type: 'delta',  size: 66,  opacity: 0.06,  pos: { top: '4%',  left: '1%'  } },
  { type: 'bolt',   size: 48,  opacity: 0.07,  pos: { top: '28%', left: '2%'  } },
  { type: 'bricks', size: 100, opacity: 0.065, pos: { top: '50%', left: 0      } },
  { type: 'delta',  size: 50,  opacity: 0.055, pos: { top: '70%', left: '1%'  } },
  { type: 'bolt',   size: 38,  opacity: 0.06,  pos: { top: '88%', left: '3%'  } },

  // ── LEFT (left: 10–22%) ──
  { type: 'bricks', size: 66,  opacity: 0.05,  pos: { top: '14%', left: '11%' } },
  { type: 'delta',  size: 55,  opacity: 0.052, pos: { top: '42%', left: '14%' } },
  { type: 'bolt',   size: 36,  opacity: 0.055, pos: { top: '74%', left: '10%' } },

  // ── CENTRE-LEFT (left: 25–42%) ──
  { type: 'delta',  size: 44,  opacity: 0.042, pos: { top: '7%',  left: '28%' } },
  { type: 'bolt',   size: 40,  opacity: 0.052, pos: { top: '55%', left: '26%' } },
  { type: 'bricks', size: 58,  opacity: 0.045, pos: { top: '82%', left: '32%' } },

  // ── CENTRE-RIGHT (left: 48–65%) ──
  { type: 'bricks', size: 54,  opacity: 0.042, pos: { top: '20%', left: '52%' } },
  { type: 'delta',  size: 48,  opacity: 0.044, pos: { top: '60%', left: '50%' } },
  { type: 'bolt',   size: 34,  opacity: 0.048, pos: { top: '90%', left: '58%' } },

  // ── RIGHT (right: 8–28%) ──
  { type: 'bolt',   size: 56,  opacity: 0.08,  pos: { top: '8%',  right: '22%' } },
  { type: 'bricks', size: 70,  opacity: 0.055, pos: { top: '33%', right: '18%' } },
  { type: 'delta',  size: 130, opacity: 0.055, pos: { top: '52%', right: '6%'  } },
  { type: 'bolt',   size: 44,  opacity: 0.055, pos: { top: '78%', right: '14%' } },

  // ── FAR RIGHT (right: 0–8%, bleeds edge) ──
  { type: 'delta',  size: 250, opacity: 0.07,  pos: { top: -20,   right: -30   } },
  { type: 'bricks', size: 80,  opacity: 0.058, pos: { top: '24%', right: '2%'  } },
  { type: 'delta',  size: 88,  opacity: 0.055, pos: { top: '64%', right: '1%'  } },
  { type: 'bolt',   size: 42,  opacity: 0.065, pos: { top: '86%', right: '4%'  } },
];

function Piece({ type, size }: { type: Shape; size: number }) {
  if (type === 'bolt')   return <Bolt size={size} />;
  if (type === 'bricks') return <Bricks size={size} />;
  return <Delta size={size} />;
}

export function DashboardBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: -1 }}>
      {ITEMS.map((item, i) => (
        <div key={i} style={{ position: 'absolute', opacity: item.opacity, ...item.pos }}>
          <Piece type={item.type} size={item.size} />
        </div>
      ))}
    </div>
  );
}
