function randint(start, end) {
  if (end - start <= 0) throw new Error("Invalid domain");
  return Math.floor(start + (end - start + 1) * Math.random());
}

module.exports = { randint };
