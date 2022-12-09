/* eslint-disable no-plusplus */
export function maskCPF(cpf: string) {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function validateCPF(cpf?: string) {
  if (!cpf) return false;

  // eslint-disable-next-line no-param-reassign
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf === '') return false;

  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }

  let add = 0;

  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i), 10) * (10 - i);
  }

  let rev = 11 - (add % 11);

  if (rev === 10 || rev === 11) rev = 0;

  if (rev !== parseInt(cpf.charAt(9), 10)) return false;

  add = 0;

  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i), 10) * (11 - i);

  rev = 11 - (add % 11);

  if (rev === 10 || rev === 11) rev = 0;

  if (rev !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}
