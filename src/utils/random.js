const getRandomInt = (min, max, includeMax = false) => {
  const minEl = Math.ceil(min);
  const maxEl = Math.floor(max);
  return Math.floor(Math.random() * (maxEl - minEl + +includeMax)) + minEl;
};
export default getRandomInt;
