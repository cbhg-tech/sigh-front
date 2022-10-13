import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

export function DataService() {
  dayjs.extend(utc);
  dayjs.extend(isBetweenPlugin);

  function format(data: number, format?: string) {
    return dayjs(data * 1000)
      .utc()
      .format(format || 'DD/MM/YYYY');
  }

  function isBetween(initialData: number, endDate: number) {
    return dayjs().isBetween(dayjs(initialData * 1000), dayjs(endDate * 1000));
  }

  return {
    format,
    isBetween,
  };
}
