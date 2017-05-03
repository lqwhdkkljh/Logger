function randstr (length, letters) {
  let string = ''
  for (let i = length; i > 0; --i) {
    string += letters[Math.round(Math.random() * (letters.length - 1))]
  }
  return string
}

export { randstr }
