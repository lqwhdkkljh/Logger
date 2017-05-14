function randstr (length) {
  let letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let string = ''
  for (let i = length; i > 0; --i) {
    string += letters[Math.round(Math.random() * (letters.length - 1))]
  }
  return string
}

export { randstr }
