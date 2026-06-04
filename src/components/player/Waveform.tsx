'use client';

import { useRef, useEffect } from 'react';

interface WaveformProps {
  analyserNode?: AnalyserNode | null;
  isPlaying: boolean;
  className?: string;
}

export function Waveform({ analyserNode, isPlaying, className = '' }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Read the live --accent / --accent-hover values so the waveform follows
    // the theme tokens (no hardcoded brand color - flips automatically when
    // we change the palette in globals.css).
    const rootStyle = getComputedStyle(document.documentElement);
    const accent = rootStyle.getPropertyValue('--accent').trim() || '#4FD929';
    const accentHover = rootStyle.getPropertyValue('--accent-hover').trim() || '#6FE54B';

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserNode && isPlaying) {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(dataArray);

        const barCount = 64;
        const barWidth = width / barCount - 1;
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step];
          const barHeight = (value / 255) * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, accent);
          gradient.addColorStop(1, accentHover);

          ctx.fillStyle = gradient;
          ctx.fillRect(
            i * (barWidth + 1),
            height - barHeight,
            barWidth,
            barHeight
          );
        }
      } else {
        // Static bars when paused
        const barCount = 64;
        const barWidth = width / barCount - 1;
        for (let i = 0; i < barCount; i++) {
          const barHeight = 2 + Math.sin(i * 0.3) * 2;
          ctx.fillStyle = 'rgba(161, 161, 170, 0.3)';
          ctx.fillRect(
            i * (barWidth + 1),
            height - barHeight,
            barWidth,
            barHeight
          );
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyserNode, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={128}
      className={`w-full ${className}`}
      aria-hidden="true"
    />
  );
}
