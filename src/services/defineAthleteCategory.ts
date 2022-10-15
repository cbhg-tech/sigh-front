import dayjs from 'dayjs';

export function defineAthleteCategory(date: string) {
  const birthDate = dayjs(date);
  const today = dayjs();
  const age = today.diff(birthDate, 'year');

  if (age < 15) {
    return 'Sub-15';
  }

  if (age < 18 && age >= 15) {
    return 'Sub-18';
  }

  if (age > 18 && age < 21) {
    return 'Sub-21';
  }

  if (age > 21) {
    return 'Adulto';
  }
}
