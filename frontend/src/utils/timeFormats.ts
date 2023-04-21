export function msToHMS(ms: number) {
  let seconds = ms / 1000;
  const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
  seconds = Math.floor(seconds % 60);

  const fHours = hours < 10 ? "0" + hours : hours;
  const fMinutes = minutes < 10 ? "0" + minutes : minutes;
  const fSeconds = seconds < 10 ? "0" + seconds : seconds;

  return fHours + ":" + fMinutes + ":" + fSeconds;
}
