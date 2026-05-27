/**
 * Return the month in French. Starting by 0.
 * @param {*} monthNumber
 * @returns
 */
export function getMonth(monthNumber) {
  return [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ][(monthNumber - 1) % 12];
}
