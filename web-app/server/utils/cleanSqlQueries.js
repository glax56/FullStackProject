// Removes line breaks etc (/t/n)
const cleanQuery = (rawQuery) => {
  return rawQuery.replace(/[\t\n]/g, "");
};

module.exports = { cleanQuery };
