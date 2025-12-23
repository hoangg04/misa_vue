const getInitials = (name: string) => {
  if (!name) return '--'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default getInitials
