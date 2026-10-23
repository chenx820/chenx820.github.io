// Run after `npm run build`: node --test tests/notes-institutions.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const cheerio = require("cheerio");

const root = path.resolve(__dirname, "..");
const notesDir = path.join(root, "content/notes");

for (const language of ["en", "zh"]) {
  const prefix = language === "en" ? "" : "/zh";
  const institutions = new Map();
  for (const directory of fs.readdirSync(notesDir)) {
    const file = path.join(notesDir, directory, `index.${language}.md`);
    if (!fs.existsSync(file)) continue;
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const group = institutions.get(data.institution_slug) || {
      name: data.institution,
      titles: [],
    };
    group.titles.push(data.title);
    institutions.set(data.institution_slug, group);
  }

  for (const [slug, { name, titles }] of institutions) {
    test(`${language}: clicking institution ${name} lists its notes`, () => {
      const index = cheerio.load(
        fs.readFileSync(
          path.join(root, `public${prefix}/notes/index.html`),
          "utf8",
        ),
      );
      const link = index("a")
        .toArray()
        .find(
          (element) => index(element).text() === `${name}, ${titles.length}`,
        );
      assert.ok(link, `Institution link for ${name} must exist`);
      const href = index(link).attr("href");
      assert.equal(href, `${prefix}/notes/institution/${slug}/`);
      const { result } = JSON.parse(
        fs.readFileSync(
          path.join(root, `public/page-data${href}page-data.json`),
          "utf8",
        ),
      );
      assert.equal(result.pageContext.language, language);
      assert.equal(result.data.allMarkdownRemark.totalCount, titles.length);
      assert.deepEqual(
        result.data.allMarkdownRemark.edges
          .map(({ node }) => node.frontmatter.title)
          .sort(),
        [...titles].sort(),
      );
      const page = cheerio.load(
        fs.readFileSync(path.join(root, `public${href}index.html`), "utf8"),
      );
      assert.ok(
        page("h1").text().includes(name),
        "Heading uses the local institution name",
      );
      assert.deepEqual(
        page("article h2")
          .toArray()
          .map((el) => page(el).text())
          .sort(),
        [...titles].sort(),
      );
    });
  }
}
