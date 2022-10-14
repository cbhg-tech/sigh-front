import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

export function DateService() {
  dayjs.extend(utc);
  dayjs.extend(isBetweenPlugin);

  function format(data: string | number, format?: string) {
    const dataTobeUsed = typeof data === 'string' ? data : data * 1000;

    return dayjs(dataTobeUsed)
      .utc()
      .format(format || 'DD/MM/YYYY');
  }

  function isBetween(initialData: string | number, endDate: string | number) {
    const initial =
      typeof initialData === 'string' ? initialData : initialData * 1000;
    const end = typeof endDate === 'string' ? endDate : endDate * 1000;

    return dayjs().isBetween(dayjs(initial), dayjs(end));
  }

  return {
    format,
    isBetween,
  };
}
