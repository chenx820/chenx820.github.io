// Check the real generated pages after `npm run build`.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const cheerio = require("cheerio");
const matter = require("gray-matter");
const tags = require("../src/data/noteTags.json");
const { getNoteTagSlug } = require("../src/components/Notes/noteTag");
const en = require("../locales/en/common.json");
const zh = require("../locales/zh/common.json");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = (route) =>
  cheerio.load(
    read(`public${route}${route.endsWith(".html") ? "" : "index.html"}`),
  );
const pageData = (route) =>
  JSON.parse(read(`public/page-data${route}page-data.json`));

function leaves(value, prefix = "", result = {}) {
  for (const [key, item] of Object.entries(value)) {
    const name = `${prefix}${key}`;
    if (typeof item === "object" && !Array.isArray(item))
      leaves(item, `${name}.`, result);
    else result[name] = item;
  }
  return result;
}

test("translations cover the same keys and interpolation variables", () => {
  const a = leaves(en),
    b = leaves(zh);
  const base = (key) => key.replace(/_(one|other)$/, "");
  assert.deepEqual(
    [...new Set(Object.keys(a).map(base))].sort(),
    [...new Set(Object.keys(b).map(base))].sort(),
  );
  for (const [key, value] of Object.entries(a)) {
    const translated = b[key] ?? b[base(key)];
    const variables = (text) =>
      [...String(text).matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort();
    assert.deepEqual(variables(value), variables(translated), key);
  }
  assert.deepEqual(
    en.about.news.map((x) => x.slice(0, 10)),
    zh.about.news.map((x) => x.slice(0, 10)),
  );
  assert.equal(en.home.words.length, zh.home.words.length);
});

test("patent records retain matching identifiers, dates, statuses and files", () => {
  const a = require("../content/json/patents.json"),
    b = require("../content/json/patents_zh.json");
  assert.deepEqual(
    a.map((p) => p.number),
    b.map((p) => p.number),
  );
  const statuses = { Published: "已公布", Issued: "已授权", Filed: "已申请" };
  a.forEach((p, i) => {
    assert.equal(b[i].date, p.date, p.number);
    assert.equal(b[i].status, statuses[p.status], p.number);
    assert.equal(b[i].links.file, p.links.file, p.number);
  });
});

for (const language of ["en", "zh"]) {
  const prefix = language === "zh" ? "/zh" : "";
  const notes = fs
    .readdirSync(path.join(root, "content/notes"))
    .map(
      (dir) => matter(read(`content/notes/${dir}/index.${language}.md`)).data,
    );
  for (const [slug, labels] of Object.entries(tags)) {
    test(`${language}: tag ${slug} links to all matching notes`, () => {
      const expected = notes.filter((note) =>
        note.notetags.includes(labels[language]),
      );
      assert.ok(expected.length > 0);
      assert.equal(getNoteTagSlug(labels[language]), slug);
      const route = `${prefix}/notes/tags/${slug}/`;
      const index = html(`${prefix}/notes/`);
      assert.ok(
        index(`a[href="${route}"]`).length > 0,
        "sidebar/card route exists",
      );
      const { result } = pageData(route);
      assert.equal(result.data.allMarkdownRemark.totalCount, expected.length);
      assert.deepEqual(
        result.data.allMarkdownRemark.edges
          .map(({ node }) => node.frontmatter.title)
          .sort(),
        expected.map((n) => n.title).sort(),
      );
      const page = html(route);
      assert.ok(page("h1").text().includes(labels[language]));
      const active = page('a[aria-selected="true"]');
      assert.equal(active.text(), `${labels[language]}, ${expected.length}`);
      assert.equal(active.attr("href"), `${prefix}/notes/`);
    });
  }

  test(`${language}: all generated pages have matching language, metadata and counterpart`, () => {
    const files = fs
      .readdirSync(path.join(root, "public/page-data"), { recursive: true })
      .filter(
        (file) => file.endsWith("page-data.json") && !file.startsWith("sq/"),
      );
    let checked = 0;
    for (const file of files) {
      const data = JSON.parse(read(`public/page-data/${file}`));
      if (data.result?.pageContext?.language !== language) continue;
      const route = data.path;
      const page = html(route);
      assert.equal(page("html").attr("lang"), language, route);
      assert.ok(page("head title").text(), `${route}: server-rendered title`);
      assert.equal(
        page('link[rel="canonical"]').attr("href"),
        `https://chenx820.github.io${route === "/404.html" ? "/404/" : route}`,
        route,
      );
      const other =
        language === "zh" ? route.replace(/^\/zh/, "") : `/zh${route}`;
      assert.ok(
        fs.existsSync(
          path.join(
            root,
            `public${other}${other.endsWith(".html") ? "" : "index.html"}`,
          ),
        ),
        other,
      );
      assert.ok(
        !page('a[href*="/notes/tags//"]').length,
        `${route}: no empty tag slugs`,
      );
      if (data.result.data?.markdownRemark && route.includes("/notes/")) {
        const sourcePath = data.result.data.markdownRemark.fields.sourcePath;
        assert.ok(fs.existsSync(path.join(root, sourcePath)));
        assert.ok(sourcePath.endsWith(`.${language}.md`));
        for (const element of page(".note__social-share a").toArray()) {
          const url = new URL(page(element).attr("href"));
          assert.equal(
            url.searchParams.get("url") || url.searchParams.get("u"),
            `https://chenx820.github.io${route}`,
          );
        }
      }
      checked += 1;
    }
    assert.ok(
      checked > 50,
      "audit covers all routes, not just the landing page",
    );
  });
}

test("Chinese note dates and publication statuses are localized", () => {
  const page = html("/zh/notes/");
  assert.match(
    page('span[aria-label^="发布日期"]').first().text(),
    /\d{4}年\d{1,2}月\d{1,2}日/,
  );
  const publications = html("/zh/publications/");
  assert.ok(publications("body").text().includes("已接收"));
  assert.ok(!publications("body").text().includes("Accepted"));
});
