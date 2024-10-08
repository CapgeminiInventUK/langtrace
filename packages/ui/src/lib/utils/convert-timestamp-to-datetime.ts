interface DateTime {
  date: string;
  time: string;
}

export function convertTimestampToDatetime(timestamp: string | number): DateTime {
  const dateObj = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);

  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return { date, time };
}
