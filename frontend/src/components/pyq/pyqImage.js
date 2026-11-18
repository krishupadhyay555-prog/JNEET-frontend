// NTA's images are cut from the official PDF. qimgW / optImgW are their printed widths
// (PDF points). Every image of a question is drawn at ONE scale, so question and
// options have the same text size: PX_PER_PT on wide screens, shrunk together to fit
// a phone (100cqw = width of the question card's content box).
const PX_PER_PT = 1.15;
const PAD = 18;                                     // white frame padding + border
export const fitW = (w, qW) => `min(${Math.round(w * PX_PER_PT)}px, calc((100cqw - ${PAD}px) * ${(w / qW).toFixed(4)}))`;
