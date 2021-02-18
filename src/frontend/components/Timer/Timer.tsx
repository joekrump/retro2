import React, { FormEvent, useRef } from "react";

function calculateTimeDurationInMilliseconds(unitSelected: string, numberInput: number) {
  const millisecondsPerSeconds = 1000;
  const secondsPerMinute = 60;
  let multiplier: number = millisecondsPerSeconds;

  if (unitSelected === "min") {
    multiplier = secondsPerMinute * millisecondsPerSeconds;
  }
  return numberInput * multiplier
}

export const Timer = ({ socket, boardId }: {
  socket: SocketIOClient.Socket,
  boardId: string,
}) => {
  let unitSelectRef = useRef<HTMLSelectElement>(null);
  let numberInputRef = useRef<HTMLInputElement>(null);
  function submit(e: FormEvent) {
    e.preventDefault();
    console.log("fired")
    socket.emit(`board:start-timer`, {
      boardId,
      durationMS: calculateTimeDurationInMilliseconds(
        unitSelectRef?.current?.value ?? "",
        parseInt(numberInputRef?.current?.value ?? "1"),
      )
    });
    return false;
  }

  return <form onSubmit={submit}>
    <input type="number" min="1" ref={numberInputRef} />
    <select defaultValue="min" ref={unitSelectRef}>
      <option value="sec">seconds</option>
      <option value="min">minutes</option>
    </select>
    <button type="submit">Start</button>
    {/* TODO: allow a running time to be paused and cleared. */}
  </form>
};