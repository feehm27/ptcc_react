export function maskProcessNumber(str) {
  const characteres = ['-', '.'];
  const newStr = str;

  return (
    newStr.substring(0, 7) +
    characteres[0] +
    newStr.substring(7, 9) +
    characteres[1] +
    newStr.substring(9, 13) +
    characteres[1] +
    newStr.substring(13, 14) +
    characteres[1] +
    newStr.substring(14, 16) +
    characteres[1] +
    newStr.substring(16, 20)
  );
}

export function formattedDate(date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}
