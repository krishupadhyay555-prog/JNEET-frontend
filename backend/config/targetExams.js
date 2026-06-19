import { env } from "./env.js";

const NEET_EXAM_DATES = {
  2026: "2026-05-03T03:30:00.000Z",
  2027: "2027-05-02T03:30:00.000Z",
  2028: "2028-05-07T03:30:00.000Z",
  2029: "2029-05-06T03:30:00.000Z",
  2030: "2030-05-05T03:30:00.000Z",
};

export function getTargetExamOptions() {
  const options = [];

  if (env.RE_NEET_ACTIVE && env.RE_NEET_DATE) {
    options.push({
      key: "RE_NEET",
      label: "Re-NEET",
      date: env.RE_NEET_DATE,
      year: null,
    });
  }

  Object.entries(NEET_EXAM_DATES).forEach(([year, date]) => {
    options.push({
      key: `NEET_${year}`,
      label: `NEET ${year}`,
      date,
      year: Number(year),
    });
  });

  return options;
}

export function getTargetExamOption(key) {
  return getTargetExamOptions().find((option) => option.key === key) ?? null;
}
