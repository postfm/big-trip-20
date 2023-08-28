import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const ETime = {
  MsInHour: 1000 * 60 * 60,
  MsInDay: 1000 * 60 * 60 * 24,
};

dayjs.extend(duration);

function getTimeTravel(date1, date2) {
  const timeDiff = dayjs(date2).diff(dayjs(date1));

  if (timeDiff >= ETime.MsInDay) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  }
  if (timeDiff >= ETime.MsInHour) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  if (timeDiff < ETime.MsInHour) {
    return dayjs.duration(timeDiff).format('mm[M]');
  }
}

export { getTimeTravel };
