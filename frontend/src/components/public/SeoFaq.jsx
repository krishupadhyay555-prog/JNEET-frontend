// Visible FAQ for public SEO pages (same text as the page's FAQ JSON-LD).
export default function SeoFaq({ faq }) {
  if (!faq?.length) return null;
  return (
    <section aria-labelledby="faq-h" className="space-y-3">
      <h2 id="faq-h" className="text-[22px] font-bold tracking-tight">Frequently asked questions</h2>
      {faq.map(([q, a]) => (
        <details key={q} className="rounded-xl border border-[#E7E4DD] bg-white px-4 py-3 group">
          <summary className="cursor-pointer font-semibold text-[15.5px] text-[#17161C] list-none flex justify-between gap-3">
            {q}<span aria-hidden="true" className="text-[#0D9488] group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#5F5B67]">{a}</p>
        </details>
      ))}
    </section>
  );
}
