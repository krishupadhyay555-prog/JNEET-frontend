const RE_NEET_ACTIVE = import.meta.env.VITE_RE_NEET_ACTIVE === "true";

export const TARGET_EXAMS = [
  ...(RE_NEET_ACTIVE && import.meta.env.VITE_RE_NEET_DATE
    ? [{
        key: "RE_NEET",
        label: "Re-NEET",
        date: import.meta.env.VITE_RE_NEET_DATE,
      }]
    : []),
  { key: "NEET_2026", label: "NEET 2026", date: "2026-05-03T03:30:00.000Z" },
  { key: "NEET_2027", label: "NEET 2027", date: "2027-05-02T03:30:00.000Z" },
  { key: "NEET_2028", label: "NEET 2028", date: "2028-05-07T03:30:00.000Z" },
  { key: "NEET_2029", label: "NEET 2029", date: "2029-05-06T03:30:00.000Z" },
  { key: "NEET_2030", label: "NEET 2030", date: "2030-05-05T03:30:00.000Z" },
];

export function getTargetExam(key) {
  return TARGET_EXAMS.find((exam) => exam.key === key) ?? null;
}
