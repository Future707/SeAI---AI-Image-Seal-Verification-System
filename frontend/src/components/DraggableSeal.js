import React, { useState, useRef, useEffect } from 'react';

const DraggableSeal = ({ onLocked }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 50, y: 100 });
  const [isHolding, setIsHolding] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const sealRef = useRef(null);
  const holdTimerRef = useRef(null);
  const holdStartTime = useRef(null);

  // Follow cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isLocked && !isStamping) {
        setPosition({
          x: e.clientX - 50,
          y: e.clientY - 50
        });
      }
    };

    const handleMouseDown = (e) => {
      // Check if clicking on the preview image
      const previewImage = document.querySelector('.preview-image');
      if (previewImage && !isLocked && !isStamping) {
        const imgRect = previewImage.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;

        // Check if click is within image bounds
        if (clickX >= imgRect.left && clickX <= imgRect.right &&
            clickY >= imgRect.top && clickY <= imgRect.bottom) {
          setIsHolding(true);
          setIsStamping(true);
          holdStartTime.current = Date.now();

          // Progress animation
          const progressInterval = setInterval(() => {
            const elapsed = Date.now() - holdStartTime.current;
            const progress = Math.min((elapsed / 1500) * 100, 100);
            setHoldProgress(progress);

            if (progress >= 100) {
              clearInterval(progressInterval);
            }
          }, 16);

          // Complete stamp after holding
          holdTimerRef.current = setTimeout(() => {
            setIsLocked(true);
            setIsHolding(false);
            setHoldProgress(100);

            // Start breaking effect after lock animation
            setTimeout(() => {
              setIsBreaking(true);

              // Remove seal completely after breaking animation finishes
              setTimeout(() => {
                if (onLocked) {
                  onLocked();
                }
              }, 500); // Breaking animation is 0.5s
            }, 800);
          }, 1500);
        }
      }
    };

    const handleMouseUp = () => {
      if (isHolding && !isLocked) {
        // Released too early
        setIsHolding(false);
        setIsStamping(false);
        setHoldProgress(0);
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, [isHolding, isLocked, isStamping, onLocked]);

  return (
    <div
      ref={sealRef}
      className={`draggable-seal ${isHolding ? 'stamping' : ''} ${isLocked ? 'locked' : ''} ${isBreaking ? 'breaking' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isLocked
          ? 'perspective(1000px) scale(1.5) rotateZ(0deg)'
          : isHolding
          ? 'perspective(1000px) scale(1.2) translateZ(-20px)'
          : 'perspective(1000px) scale(1) translateZ(0px)'
      }}
    >
      <div className="seal-inner">
        <div className="seal-glow"></div>
        <img src="/gifs/SeAl.gif" alt="Seal Logo" className="seal-logo" />

        {isBreaking && (
          <div className="break-particles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--angle': `${(i * 360) / 12}deg`,
                  '--delay': `${i * 0.03}s`
                }}
              />
            ))}
          </div>
        )}

        {isHolding && !isLocked && (
          <div className="hold-progress">
            <svg width="120" height="120" style={{ position: 'absolute', top: '-10px', left: '-10px' }}>
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="4"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - holdProgress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.016s linear' }}
              />
            </svg>
          </div>
        )}
        <div className="seal-text">
          {isLocked ? 'SEALED ✓' : isHolding ? 'HOLD...' : 'CLICK & HOLD'}
        </div>
      </div>
      {!isLocked && !isHolding && (
        <div className="seal-instruction">
          Click and hold on image to seal
        </div>
      )}
    </div>
  );
};

export default DraggableSeal;
