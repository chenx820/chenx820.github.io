const tags = require("../../data/noteTags.json");

const getNoteTagSlug = (label) =>
  Object.keys(tags).find((slug) => Object.values(tags[slug]).includes(label)) ||
  label.trim().toLowerCase().replace(/\s+/g, "-");

const getNoteTagLabel = (slug, language, fallback) =>
  tags[slug]?.[language] || fallback;

module.exports = { getNoteTagSlug, getNoteTagLabel };
