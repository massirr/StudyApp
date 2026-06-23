import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function PixelLogo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const cursor = cursorRef.current;
    if (!svg || !cursor) return;

    const rects = svg.querySelectorAll('rect');

    gsap.from(rects, {
      opacity: 0,
      duration: 0.02,
      stagger: { each: 0.008, from: 'random' },
      ease: 'none',
      onComplete: () => {
        gsap.to(svg, { y: -4, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        cursor.style.opacity = '1';
        cursor.classList.add('pixel-cursor-blink');
      },
    });

    return () => {
      gsap.killTweensOf(rects);
      gsap.killTweensOf(svg);
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/*
        viewBox cropped to content bounds: x=0..57, y=8..23
        Pixel art lives at x=9..52, y=12..19 — 4px padding each side.
        At 6× scale: width = 58×6 = 348px, height = 16×6 = 96px
      */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width={348}
        height={96}
        viewBox="0 8 58 16"
        shapeRendering="crispEdges"
        style={{ imageRendering: 'pixelated', display: 'block', maxWidth: '100%', height: 'auto' }}
      >
        <rect x={9} y={12} width={2} height={1} fill="#d58400" />
        <rect x={11} y={12} width={1} height={1} fill="#000000" />
        <rect x={14} y={12} width={4} height={1} fill="#d58400" />
        <rect x={18} y={12} width={1} height={1} fill="#000000" />
        <rect x={23} y={12} width={3} height={1} fill="#d58400" />
        <rect x={26} y={12} width={1} height={1} fill="#000000" />
        <rect x={27} y={12} width={3} height={1} fill="#d58400" />
        <rect x={30} y={12} width={1} height={1} fill="#000000" />
        <rect x={31} y={12} width={3} height={1} fill="#d58400" />
        <rect x={34} y={12} width={1} height={1} fill="#000000" />
        <rect x={43} y={12} width={1} height={1} fill="#d58400" />
        <rect x={44} y={12} width={1} height={1} fill="#000000" />
        <rect x={9} y={13} width={4} height={1} fill="#d58400" />
        <rect x={13} y={13} width={1} height={1} fill="#000000" />
        <rect x={14} y={13} width={1} height={1} fill="#d58400" />
        <rect x={15} y={13} width={1} height={1} fill="#000000" />
        <rect x={17} y={13} width={1} height={1} fill="#d58400" />
        <rect x={18} y={13} width={1} height={1} fill="#000000" />
        <rect x={25} y={13} width={1} height={1} fill="#d58400" />
        <rect x={26} y={13} width={1} height={1} fill="#000000" />
        <rect x={27} y={13} width={1} height={1} fill="#d58400" />
        <rect x={28} y={13} width={1} height={1} fill="#000000" />
        <rect x={31} y={13} width={1} height={1} fill="#d58400" />
        <rect x={32} y={13} width={1} height={1} fill="#000000" />
        <rect x={33} y={13} width={1} height={1} fill="#d58400" />
        <rect x={34} y={13} width={1} height={1} fill="#000000" />
        <rect x={43} y={13} width={1} height={1} fill="#d58400" />
        <rect x={44} y={13} width={1} height={1} fill="#000000" />
        <rect x={51} y={13} width={1} height={1} fill="#63c74d" />
        <rect x={52} y={13} width={1} height={1} fill="#000000" />
        <rect x={9} y={14} width={1} height={1} fill="#d58400" />
        <rect x={10} y={14} width={1} height={1} fill="#000000" />
        <rect x={12} y={14} width={1} height={1} fill="#d58400" />
        <rect x={13} y={14} width={1} height={1} fill="#000000" />
        <rect x={14} y={14} width={1} height={1} fill="#d58400" />
        <rect x={15} y={14} width={1} height={1} fill="#000000" />
        <rect x={17} y={14} width={1} height={1} fill="#d58400" />
        <rect x={18} y={14} width={1} height={1} fill="#000000" />
        <rect x={25} y={14} width={1} height={1} fill="#d58400" />
        <rect x={26} y={14} width={1} height={1} fill="#000000" />
        <rect x={27} y={14} width={1} height={1} fill="#d58400" />
        <rect x={28} y={14} width={1} height={1} fill="#000000" />
        <rect x={31} y={14} width={1} height={1} fill="#d58400" />
        <rect x={32} y={14} width={1} height={1} fill="#000000" />
        <rect x={33} y={14} width={1} height={1} fill="#d58400" />
        <rect x={34} y={14} width={1} height={1} fill="#000000" />
        <rect x={43} y={14} width={1} height={1} fill="#d58400" />
        <rect x={44} y={14} width={1} height={1} fill="#000000" />
        <rect x={50} y={14} width={1} height={1} fill="#63c74d" />
        <rect x={51} y={14} width={1} height={1} fill="#000000" />
        <rect x={9} y={15} width={1} height={1} fill="#d58400" />
        <rect x={10} y={15} width={1} height={1} fill="#000000" />
        <rect x={12} y={15} width={1} height={1} fill="#d58400" />
        <rect x={13} y={15} width={1} height={1} fill="#000000" />
        <rect x={14} y={15} width={4} height={1} fill="#d58400" />
        <rect x={18} y={15} width={1} height={1} fill="#000000" />
        <rect x={25} y={15} width={1} height={1} fill="#d58400" />
        <rect x={26} y={15} width={1} height={1} fill="#000000" />
        <rect x={27} y={15} width={3} height={1} fill="#d58400" />
        <rect x={30} y={15} width={1} height={1} fill="#000000" />
        <rect x={31} y={15} width={1} height={1} fill="#d58400" />
        <rect x={32} y={15} width={1} height={1} fill="#000000" />
        <rect x={33} y={15} width={1} height={1} fill="#d58400" />
        <rect x={34} y={15} width={1} height={1} fill="#000000" />
        <rect x={43} y={15} width={1} height={1} fill="#d58400" />
        <rect x={44} y={15} width={1} height={1} fill="#000000" />
        <rect x={49} y={15} width={1} height={1} fill="#63c74d" />
        <rect x={50} y={15} width={1} height={1} fill="#000000" />
        <rect x={9} y={16} width={1} height={1} fill="#d58400" />
        <rect x={10} y={16} width={1} height={1} fill="#000000" />
        <rect x={12} y={16} width={1} height={1} fill="#d58400" />
        <rect x={13} y={16} width={1} height={1} fill="#000000" />
        <rect x={14} y={16} width={1} height={1} fill="#d58400" />
        <rect x={15} y={16} width={1} height={1} fill="#000000" />
        <rect x={19} y={16} width={3} height={1} fill="#d58400" />
        <rect x={22} y={16} width={1} height={1} fill="#000000" />
        <rect x={25} y={16} width={1} height={1} fill="#d58400" />
        <rect x={26} y={16} width={1} height={1} fill="#000000" />
        <rect x={29} y={16} width={1} height={1} fill="#d58400" />
        <rect x={30} y={16} width={1} height={1} fill="#000000" />
        <rect x={31} y={16} width={1} height={1} fill="#d58400" />
        <rect x={32} y={16} width={1} height={1} fill="#000000" />
        <rect x={33} y={16} width={1} height={1} fill="#d58400" />
        <rect x={34} y={16} width={1} height={1} fill="#000000" />
        <rect x={43} y={16} width={1} height={1} fill="#d58400" />
        <rect x={44} y={16} width={1} height={1} fill="#000000" />
        <rect x={46} y={16} width={1} height={1} fill="#63c74d" />
        <rect x={47} y={16} width={1} height={1} fill="#000000" />
        <rect x={48} y={16} width={1} height={1} fill="#63c74d" />
        <rect x={49} y={16} width={1} height={1} fill="#000000" />
        <rect x={9} y={17} width={1} height={1} fill="#d58400" />
        <rect x={10} y={17} width={1} height={1} fill="#000000" />
        <rect x={12} y={17} width={1} height={1} fill="#d58400" />
        <rect x={13} y={17} width={1} height={1} fill="#000000" />
        <rect x={14} y={17} width={1} height={1} fill="#d58400" />
        <rect x={15} y={17} width={1} height={1} fill="#000000" />
        <rect x={25} y={17} width={1} height={1} fill="#d58400" />
        <rect x={26} y={17} width={1} height={1} fill="#000000" />
        <rect x={29} y={17} width={1} height={1} fill="#d58400" />
        <rect x={30} y={17} width={1} height={1} fill="#000000" />
        <rect x={31} y={17} width={1} height={1} fill="#d58400" />
        <rect x={32} y={17} width={1} height={1} fill="#000000" />
        <rect x={33} y={17} width={1} height={1} fill="#d58400" />
        <rect x={34} y={17} width={1} height={1} fill="#000000" />
        <rect x={43} y={17} width={1} height={1} fill="#d58400" />
        <rect x={44} y={17} width={1} height={1} fill="#000000" />
        <rect x={45} y={17} width={1} height={1} fill="#63c74d" />
        <rect x={46} y={17} width={1} height={1} fill="#000000" />
        <rect x={47} y={17} width={1} height={1} fill="#63c74d" />
        <rect x={48} y={17} width={1} height={1} fill="#000000" />
        <rect x={9} y={18} width={4} height={1} fill="#d58400" />
        <rect x={13} y={18} width={1} height={1} fill="#000000" />
        <rect x={14} y={18} width={1} height={1} fill="#d58400" />
        <rect x={15} y={18} width={1} height={1} fill="#000000" />
        <rect x={25} y={18} width={1} height={1} fill="#d58400" />
        <rect x={26} y={18} width={1} height={1} fill="#000000" />
        <rect x={29} y={18} width={1} height={1} fill="#d58400" />
        <rect x={30} y={18} width={1} height={1} fill="#000000" />
        <rect x={31} y={18} width={1} height={1} fill="#d58400" />
        <rect x={32} y={18} width={1} height={1} fill="#000000" />
        <rect x={33} y={18} width={1} height={1} fill="#d58400" />
        <rect x={34} y={18} width={1} height={1} fill="#000000" />
        <rect x={43} y={18} width={1} height={1} fill="#d58400" />
        <rect x={44} y={18} width={1} height={1} fill="#63c74d" />
        <rect x={45} y={18} width={1} height={1} fill="#000000" />
        <rect x={9} y={19} width={2} height={1} fill="#d58400" />
        <rect x={11} y={19} width={1} height={1} fill="#000000" />
        <rect x={14} y={19} width={1} height={1} fill="#d58400" />
        <rect x={15} y={19} width={1} height={1} fill="#000000" />
        <rect x={25} y={19} width={1} height={1} fill="#d58400" />
        <rect x={26} y={19} width={1} height={1} fill="#000000" />
        <rect x={27} y={19} width={3} height={1} fill="#d58400" />
        <rect x={30} y={19} width={1} height={1} fill="#000000" />
        <rect x={31} y={19} width={3} height={1} fill="#d58400" />
        <rect x={34} y={19} width={1} height={1} fill="#000000" />
        <rect x={43} y={19} width={9} height={1} fill="#d58400" />
        <rect x={52} y={19} width={1} height={1} fill="#000000" />
      </svg>
      <span
        ref={cursorRef}
        aria-hidden="true"
        style={{
          opacity: 0,
          color: '#d58400',
          fontFamily: 'monospace',
          fontSize: '48px',
          lineHeight: 1,
          userSelect: 'none',
          flexShrink: 0,
          marginLeft: '4px',
        }}
      >▌</span>
    </div>
  );
}
