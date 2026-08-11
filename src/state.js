export const rowCountSteps = {
  1: 100,
  2: 1000,
  3: 10000,
  4: 100000,
  5: 1000000,
};

export const dataSources = ["faker", "cheap"];

export const state = {
  rowCount: rowCountSteps[1],
  dataSource: "faker",
  cache: true,
  buildStrategy: "inner_html",
  virtualization: "off",
  bufferRows: 8,
};

export function stepForRowCount(count) {
  const step = Object.entries(rowCountSteps).find(
    ([, value]) => value === count,
  );

  return step ? step[0] : "1";
}
