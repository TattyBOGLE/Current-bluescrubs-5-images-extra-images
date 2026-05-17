import { useEffect, useState } from "react";

interface TimerProps {
  timeRemaining: number;
  className?: string;
}

export default function Timer({ timeRemaining, className = "" }: TimerProps) {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (displayTime <= 60) return "timer-critical"; // Last minute
    if (displayTime <= 300) return "timer-warning"; // Last 5 minutes
    return "timer-display";
  };

  const getProgressPercentage = () => {
    // Assuming a 20-minute session
    const totalTime = 20 * 60;
    return Math.max(0, (displayTime / totalTime) * 100);
  };

  return (
    <div className={`text-right ${className}`}>
      <div className={`text-3xl font-bold ${getTimerColor()}`}>
        {formatTime(displayTime)}
      </div>
      <div className="text-sm opacity-90 mb-2">Time Remaining</div>
      
      {/* Progress Ring or Bar */}
      <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            displayTime <= 60 ? "bg-destructive" :
            displayTime <= 300 ? "bg-warning" : "bg-white"
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      
      {/* Warning Messages */}
      {displayTime <= 60 && (
        <div className="text-xs text-destructive-foreground mt-2 animate-pulse">
          ⚠️ Final minute!
        </div>
      )}
      {displayTime <= 300 && displayTime > 60 && (
        <div className="text-xs text-warning-foreground mt-2">
          ⏰ 5 minutes left
        </div>
      )}
    </div>
  );
}
