const SPECS = [
  {
    title: 'Fabric',
    body: 'Lightweight knit with laser-cut vents under the arms. Dries fast in Dhaka heat.',
  },
  {
    title: 'Fit',
    body: 'Slim athletic cut, the same pattern players wear. Size up for a relaxed fit.',
  },
  {
    title: 'Finish',
    body: 'Heat-pressed crest and sponsor. Wash inside out, cold, and they stay sharp.',
  },
];

export function MatchDaySpecs() {
  return (
    <section
      className="max-w-[1360px] mx-auto pt-16 px-6 max-[560px]:pt-12 max-[560px]:px-4"
      aria-labelledby="specH"
    >
      <div className="flex justify-between items-end gap-6 mb-6">
        <h2
          id="specH"
          className="font-display font-extrabold text-[clamp(36px,4.2vw,64px)] leading-[0.92] uppercase max-w-[14ch]"
        >
          Made for match day
        </h2>
      </div>
      <div className="grid grid-cols-3 max-[1040px]:grid-cols-1 gap-4">
        {SPECS.map((spec) => (
          <div key={spec.title} className="bg-paper rounded-[24px] p-7">
            <h3 className="font-display font-extrabold text-[28px] leading-none uppercase mb-[10px]">
              {spec.title}
            </h3>
            <p className="text-ink-2 max-w-[36ch]">{spec.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
