// TODO: reescrever função com metodos novos
export function formatPhone(phoneNumber: string): string {
  const cleanValue = phoneNumber.replace(/\D/g, "");
  const { length } = cleanValue;
  let maskNumber = cleanValue;

  if (length < 2) {
    return maskNumber;
  }

  if (length === 2) {
    maskNumber = `(${cleanValue}`;
  } else if (length >= 3 && length <= 6) {
    maskNumber = `(${cleanValue.substr(0, 2)}) ${cleanValue.substr(
      2,
      length - 2
    )}`;
  } else if (length >= 7 && length <= 10) {
    maskNumber = `(${cleanValue.substr(0, 2)}) ${cleanValue.substr(
      2,
      4
    )}-${cleanValue.substr(6, length - 6)}`;
  } else {
    maskNumber = `(${cleanValue.substr(0, 2)}) ${cleanValue.substr(
      2,
      5
    )}-${cleanValue.substring(7, 11)}`;
  }

  return maskNumber;
}
