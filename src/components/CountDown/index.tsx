import { ChangeEvent, useState, useCallback } from "react";
import { useInterval } from "hooks";
import "./style.scss";
const initialTime = "00:00:00";
const svgHeight = 250;

function Countdown() {
  const [time, setTime] = useState(initialTime);
  const [initSeconds, setInitSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const parseTime = useCallback((timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const totalSeconds = parseTime(e.target.value);
      setTime(e.target.value);
      setInitSeconds(totalSeconds);
    },
    [parseTime]
  );

  const handleStart = useCallback(() => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
    setInitSeconds(0);
  }, []);

  useInterval(
    () => {
      if (parseTime(time)) {
        const totalSeconds = parseTime(time);
        const newTotalSeconds = totalSeconds > 0 ? totalSeconds - 1 : 0;
        const newHours = Math.floor(newTotalSeconds / 3600);
        const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
        const newSeconds = newTotalSeconds % 60;
        const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
          .toString()
          .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
        setTime(newTime);
      } else {
        handleReset();
      }
    },
    isRunning ? 1000 : null // Only run the interval when isRunning is true
  );

  const timeRemaining = initSeconds && svgHeight - (svgHeight / initSeconds) * parseTime(time);

  return (
    <div className="main-wrapper">
      <div className="countdown-container">
        <svg className="time-level" height={svgHeight}>
          <rect width="200" height={svgHeight} fill="#CFE2F3" />
          <rect width="200" height={timeRemaining} fill="#fff" />
        </svg>
      </div>
      <div className="input-wrapper">
        <input
          min="0"
          step="1"
          type="time"
          value={time}
          disabled={isRunning || initSeconds !== parseTime(time)}
          onChange={handleChange}
        />
      </div>
      <div className="btn-wrapper">
        <button className="btn" onClick={handleStart} disabled={!initSeconds}>
          {isRunning ? "Pause" : "Play"}
        </button>
        <button className="btn" onClick={handleReset} disabled={!initSeconds}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Countdown;
