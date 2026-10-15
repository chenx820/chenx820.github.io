import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  project,
  clusterCities,
  clampView,
  zoomView,
  WORLD_VIEW,
  MAX_ZOOM,
} from "../src/components/Gallery/mapGeometry.mjs";

const cities = JSON.parse(
  readFileSync(new URL("../content/json/photos.json", import.meta.url)),
);

test("all 12 original photos have exactly one city and bilingual labels", () => {
  assert.equal(cities.length, 8);
  const files = cities.flatMap((city) =>
    city.photos.map((photo) => photo.links.image),
  );
  assert.equal(files.length, 12);
  assert.equal(new Set(files).size, 12);
  for (const city of cities) {
    assert.ok(city.coordinates[0] >= -180 && city.coordinates[0] <= 180);
    assert.ok(city.coordinates[1] >= -90 && city.coordinates[1] <= 90);
    for (const label of [
      city.name,
      city.country,
      ...city.photos.map((photo) => photo.title),
    ]) {
      assert.match(label.zh, /\p{Script=Han}/u);
      assert.doesNotMatch(label.en, /\p{Script=Han}/u);
      assert.ok(label.en.length > 0);
    }
    for (const photo of city.photos)
      assert.ok(
        existsSync(
          new URL(`../src/static/images/${photo.links.image}`, import.meta.url),
        ),
      );
  }
  assert.equal(
    cities.find((city) => city.slug === "tangier").photos[0].links.image,
    "photo_morocco.jpeg",
  );
  assert.equal(
    cities.find((city) => city.slug === "chefchaouen").photos[0].links.image,
    "photo_morocco2.jpeg",
  );
  assert.ok(
    cities
      .find((city) => city.slug === "london")
      .photos.some((photo) => photo.links.image === "photo_epping-forest.jpeg"),
  );
  assert.equal(
    cities.find((city) => city.slug === "dover").photos[0].links.image,
    "photo_white-cliff.jpeg",
  );
});

test("projection aligns geographic landmarks with the local equirectangular basemap", () => {
  assert.deepEqual(project([0, 0]), [500, 250]);
  assert.deepEqual(project([-180, 90]), [0, 0]);
  assert.deepEqual(project([180, -90]), [1000, 500]);
  const [x, y] = project(
    cities.find((city) => city.slug === "beijing").coordinates,
  );
  assert.ok(x > 800 && y < 150);
});

test("clusters preserve each city once and separate at maximum zoom on a 288px mobile map", () => {
  const overview = clusterCities(cities, 0.288);
  assert.ok(overview.some((group) => group.cities.length > 1));
  assert.deepEqual(
    overview.flatMap((group) => group.cities.map((city) => city.slug)).sort(),
    cities.map((city) => city.slug).sort(),
  );
  const closeup = clusterCities(cities, 0.288 * MAX_ZOOM);
  assert.equal(closeup.length, cities.length);
});

test("panning and zooming never lose the world or exceed the supported zoom range", () => {
  assert.deepEqual(clampView({ x: -1000, y: 9000, zoom: 0.1 }), WORLD_VIEW);
  const view = clampView({ x: -1000, y: 9000, zoom: 9999 });
  assert.equal(view.zoom, MAX_ZOOM);
  assert.ok(view.x > 0 && view.y < 500);
  assert.deepEqual(zoomView({ x: 300, y: 200, zoom: 10 }, 0.001), WORLD_VIEW);
});

test("wheel and pinch zoom keep the chosen world point under the cursor", () => {
  const before = { x: 500, y: 200, zoom: 4 };
  const anchor = [530, 185];
  const after = zoomView(before, 2, anchor);
  assert.equal(
    (anchor[0] - before.x) * before.zoom,
    (anchor[0] - after.x) * after.zoom,
  );
  assert.equal(
    (anchor[1] - before.y) * before.zoom,
    (anchor[1] - after.y) * after.zoom,
  );
});
