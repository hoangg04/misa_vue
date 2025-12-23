function randomColor(): string {
  // Generate a random 6-digit hex value
  const randomColor =
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  // Apply the color to the CSS style of the element
  return randomColor as string
}
export default randomColor
