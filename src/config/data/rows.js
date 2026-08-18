import { faker } from "@faker-js/faker";
import { schedulingModes } from "../scheduling/index.js";

const SEED = 27;
const STATUSES = ["active", "idle", "failed"];
const COUNTRIES = ["BR", "US", "PT", "DE", "JP", "SE", "NG", "IN"];

const rowCache = new Map();

function pad(value, length) {
  return String(value).padStart(length, "0");
}

function groupThousands(digits) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatAmount(cents) {
  const [whole, fraction] = (cents / 100).toFixed(2).split(".");

  return `${groupThousands(whole)}.${fraction}`;
}

function createFakerRow(index) {
  const year = faker.number.int({ min: 1945, max: 2007 });
  const month = pad(faker.number.int({ min: 1, max: 12 }), 2);
  const day = pad(faker.number.int({ min: 1, max: 28 }), 2);

  return {
    index: pad(index + 1, 7),
    status: faker.helpers.arrayElement(STATUSES),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    company: faker.company.name(),
    role: faker.person.jobTitle(),
    country: faker.helpers.arrayElement(COUNTRIES),
    amount: formatAmount(faker.number.int({ min: 1000, max: 9999999 })),
    dob: `${year}-${month}-${day}`,
    id: faker.string.alphanumeric({ length: 8, casing: "upper" }),
  };
}

function createCheapRow(index) {
  const n = index + 1;

  return {
    index: pad(n, 7),
    status: STATUSES[n % STATUSES.length],
    name: `Person Number ${n}`,
    email: `person.${n}@example.com`,
    company: `Company Group ${n % 9973}`,
    role: `Operations Analyst ${n % 41}`,
    country: COUNTRIES[n % COUNTRIES.length],
    amount: formatAmount(1000 + (n % 9998999)),
    dob: `${1945 + (n % 63)}-${pad(1 + (n % 12), 2)}-${pad(1 + (n % 28), 2)}`,
    id: pad((n * 2654435761) % 100000000, 8),
  };
}

const builders = {
  faker: createFakerRow,
  cheap: createCheapRow,
};

export function generateRows(count, { source = "faker", cache = true } = {}) {
  const key = `${source}:${count}`;

  if (cache && rowCache.has(key)) return rowCache.get(key);

  if (source === "faker") faker.seed(SEED);

  const build = builders[source];
  const rows = [];

  for (let i = 0; i < count; i++) {
    rows.push(build(i));
  }

  if (cache) rowCache.set(key, rows);

  return rows;
}

export async function generateRowsChunked(count, options = {}) {
  const {
    source = "faker",
    cache = true,
    scheduling = "synchronous",
    chunkRows = count,
  } = options;

  const mode = schedulingModes[scheduling];

  if (!mode.chunked || chunkRows >= count) {
    return generateRows(count, { source, cache });
  }

  const key = `${source}:${count}`;

  if (cache && rowCache.has(key)) return rowCache.get(key);

  if (source === "faker") faker.seed(SEED);

  const build = builders[source];
  const rows = new Array(count);

  for (let start = 0; start < count; start += chunkRows) {
    const end = Math.min(start + chunkRows, count);

    for (let i = start; i < end; i++) rows[i] = build(i);

    if (end < count) await mode.nextTick();
  }

  if (cache) rowCache.set(key, rows);

  return rows;
}

export function cacheSummary() {
  let datasets = 0;
  let rows = 0;

  for (const cached of rowCache.values()) {
    datasets += 1;
    rows += cached.length;
  }

  return { datasets, rows };
}

export function clearRowCache() {
  rowCache.clear();
}
