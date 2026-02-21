'use client';

import { useRef, useEffect, useState } from 'react';

export function useWaveform() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const initAnalyser = (audioElement?: HTMLAudioElement) => {
    if (!audioElement) return null;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      analyserRef.current = analyser;
      setAnalyserNode(analyser);
      return analyser;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return { analyserNode, initAnalyser };
}
