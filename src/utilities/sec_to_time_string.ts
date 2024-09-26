export function SecToTimeString(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const minutesDisplay = minutes > 0 ? `${minutes}m ` : '';
    const secondsDisplay = remainingSeconds > 0 ? `${remainingSeconds}s` : '';

    return `${hours}h ${minutesDisplay}${secondsDisplay}`.trim();
}