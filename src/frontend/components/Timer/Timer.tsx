import React, { FormEvent, MouseEvent, useRef } from "react";

import "./Timer.css";

const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const millisecondsPerHour = millisecondsPerSecond * secondsPerMinute * minutesPerHour;
const millisecondsPerMinute = millisecondsPerSecond * secondsPerMinute;

function calculateTimeDurationInMilliseconds(unitSelected: string, numberInput: number) {
  const millisecondsPerSeconds = 1000;
  const secondsPerMinute = 60;
  let multiplier: number = millisecondsPerSeconds;

  if (unitSelected === "min") {
    multiplier = secondsPerMinute * millisecondsPerSeconds;
  }
  return numberInput * multiplier
}

function getFormattedRemainingTimerTime(timerClockMS: number): string {
  // FIXME: this can probably be made more efficient.
  const hours = Math.floor(timerClockMS / millisecondsPerHour);
  const minutes = Math.floor((timerClockMS - (hours * millisecondsPerHour)) /millisecondsPerMinute);
  const seconds = ((timerClockMS - (minutes * millisecondsPerMinute) - (hours * millisecondsPerHour)) / millisecondsPerSecond);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export const Timer = ({ socket, boardId, remainingTimeMS, state }: {
  socket: SocketIOClient.Socket,
  boardId: string,
  remainingTimeMS: number,
  state: "running" | "paused" | "stopped",
}) => {
  let unitSelectRef = useRef<HTMLSelectElement>(null);
  let numberInputRef = useRef<HTMLInputElement>(null);
  const specialInitialTimerMS = -1;

  function stopTimer(e: MouseEvent) {
    const sessionId = sessionStorage.getItem("retroSessionId");
    e.preventDefault();
    socket.emit(`board:timer-stop`, { boardId, sessionId });
  }

  function toggleTimerRunning(e: FormEvent) {
    const sessionId = sessionStorage.getItem("retroSessionId");
    e.preventDefault();

    if (state === "running") {
      socket.emit(`board:timer-pause`, { boardId, sessionId });
    } else if (state === "paused") {
      socket.emit(`board:timer-start`, {
        boardId,
        sessionId,
        durationMS: remainingTimeMS,
      });
    } else {
      socket.emit(`board:timer-start`, {
        boardId,
        sessionId,
        durationMS: calculateTimeDurationInMilliseconds(
          unitSelectRef?.current?.value ?? "",
          parseInt(numberInputRef?.current?.value ?? "1"),
        )
      });
    }

    return false;
  }

  if (remainingTimeMS === specialInitialTimerMS) {
    return null;
  } else if (state === "running" || state === "paused") {
    return (
      <>
        { getFormattedRemainingTimerTime(remainingTimeMS) }
        <form className="timer-control" onSubmit={toggleTimerRunning}>
          <button type="submit">{ state === "running" ? "pause" : "start" }</button>
          <button type="button" onClick={stopTimer}>stop</button>
        </form>
      </>
    )
  } else {
    return (
      <form className="timer-control" onSubmit={toggleTimerRunning}>
        <input type="number" min="1" ref={numberInputRef} defaultValue={30}/>
        <select defaultValue="min" ref={unitSelectRef}>
          <option value="sec">seconds</option>
          <option value="min">minutes</option>
        </select>
        <button type="submit">start</button>
      </form>
    );
  }
};
