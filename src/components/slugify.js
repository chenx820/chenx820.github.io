const slugify = (str) =>
  str
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric characters except space and dash
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // collapse multiple dashes

module.exports = slugify;
