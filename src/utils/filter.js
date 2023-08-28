import { FilterType } from './const.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrAfter(dayjs(new Date()))),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(new Date()).isSameOrAfter(dayjs(point.dateFrom)) && dayjs(new Date()).isSameOrBefore(dayjs(point.dateTo))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isSameOrBefore(dayjs(new Date()))),
};

export { filter };
