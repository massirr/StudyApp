import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GLYPH_H, glyphRectsFor, labelWidth } from '../../lib/pixelFont';

interface PixelLogoProps {
  text: string;
  scale?: number;
  animated?: boolean;
  showCursor?: boolean;
  fill?: string;
}

export function PixelLogo({
  text,
  scale = 6,
  animated = true,
  showCursor = true,
  fill = '#d58400'
}: PixelLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const unitWidth = labelWidth(text);
  const width = unitWidth * scale;
  const height = GLYPH_H * scale;
  const cursorSize = 4 * scale;
  const rects = glyphRectsFor(text);

  useEffect(() => {
    if (!animated) return;
    const svg = svgRef.current;
    const cursor = cursorRef.current;
    if (!svg) return;

    // gsap.context + ctx.revert() is the StrictMode-safe pattern: revert()
    // restores rects to their original (visible) inline state on cleanup, so
    // the dev double-invoke can't leave pixels stuck at opacity 0.
    const ctx = gsap.context(() => {
      const rectEls = svg.querySelectorAll('rect');
      gsap.fromTo(
        rectEls,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.02,
          stagger: { each: 0.008, from: 'random' },
          ease: 'none',
          onComplete: () => {
            gsap.to(svg, { y: -4, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            if (cursor) {
              cursor.style.opacity = '1';
              cursor.classList.add('pixel-cursor-blink');
            }
          }
        }
      );
    }, svgRef);

    return () => ctx.revert();
    // Re-run when the rendered text changes so a switched subject re-animates.
  }, [animated, text]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 ${unitWidth} ${GLYPH_H}`}
          shapeRendering="crispEdges"
          role="img"
          aria-label={text}
          style={{ imageRendering: 'pixelated', display: 'block', maxWidth: '100%', height: 'auto' }}
        >
          {rects.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={1} height={1} fill={fill} />
          ))}
        </svg>
        {showCursor && (
          <span
            ref={cursorRef}
            aria-hidden="true"
            style={{
              opacity: 0,
              color: fill,
              fontFamily: 'monospace',
              fontSize: `${cursorSize}px`,
              lineHeight: 1,
              userSelect: 'none',
              flexShrink: 0,
              marginLeft: `${scale}px`
            }}
          >▌</span>
        )}
      </div>
    </div>
  );
}
