import { useEffect, useRef, useState } from 'react';

function CustomCursor() {
  const cursorRef = useRef(null);
  const labelRef = useRef('');
  const isPointerRef = useRef(false);
  const visibleRef = useRef(false);

  const [label, setLabel] = useState('');
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      const target = e.target;
      const cursorTarget = target?.closest?.('[data-cursor]');
      const nextLabel = cursorTarget
        ? cursorTarget.getAttribute('data-cursor') || ''
        : '';
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }

      const pointerTarget = target?.closest?.(
        'button, a, input, select, textarea, [role="button"], label, .cursor-pointer, [data-cursor]'
      );
      const nextIsPointer = Boolean(pointerTarget);
      if (nextIsPointer !== isPointerRef.current) {
        isPointerRef.current = nextIsPointer;
        setIsPointer(nextIsPointer);
      }
    };

    const handleMouseLeave = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        setIsVisible(false);
      }
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] hidden md:flex items-center justify-center rounded-full will-change-transform transition-[width,height,background-color,opacity,border-color] duration-150 ${
        !isVisible ? 'opacity-0' : 'opacity-100'
      } ${
        label
          ? 'w-16 h-16 bg-secondary text-primary border-2 border-secondary shadow-lg'
          : isPointer
          ? 'w-9 h-9 bg-secondary/15 border-2 border-secondary'
          : 'w-4 h-4 bg-secondary border-2 border-surface shadow-sm'
      }`}
    >
      {label && (
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
          {label}
        </span>
      )}
      {!label && isPointer && (
        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
      )}
    </div>
  );
}

export default CustomCursor;
