'use client';

import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GameTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playAlarm = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isActive) {
        playAlarm();
        setIsActive(false);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setPreset = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100 font-semibold">
        <Timer size={20} className="text-indigo-500" />
        <h3>Discussion Timer</h3>
      </div>

      <div className={`text-4xl font-mono font-bold text-center mb-6 transition-colors ${timeLeft <= 10 && timeLeft > 0 && isActive ? 'text-red-500 animate-pulse' : 'text-zinc-900 dark:text-zinc-100'
        }`}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 5].map((min) => (
          <button
            key={min}
            onClick={() => setPreset(min)}
            className="px-3 py-1 text-sm rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {min}m
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          disabled={timeLeft === 0}
          className={`p-3 rounded-full text-white transition-colors ${isActive
            ? 'bg-amber-500 hover:bg-amber-600'
            : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          disabled={timeLeft === 0}
          className="p-3 rounded-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
