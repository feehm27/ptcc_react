export function maskProcessNumber(str) {
  const characteres = ['-', '.'];
  const newStr = str;

  return (
    newStr.substring(0, 7) +
    characteres[0] +
    newStr.substring(7, 9) +
    characteres[1] +
    newStr.substring(10, 14) +
    characteres[1] +
    newStr.substring(15, 16) +
    characteres[1] +
    newStr.substring(17, 19) +
    characteres[1] +
    str.substring(16)
  );
}
