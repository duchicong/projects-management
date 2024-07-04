module.exports = (data) => {
  let empty = true;
  if (Array.isArray(data) && data.length) empty = false;
  if (typeof data === "object" && Object.keys(data).length) empty = false;
  return empty;
};
