const SIZE_ROWS = [
  { size: 'S', chest: '36 in', length: '27 in', height: '5′0″–5′3″' },
  { size: 'M', chest: '38 in', length: '28 in', height: '5′3″–5′6″' },
  { size: 'L', chest: '40 in', length: '29 in', height: '5′6″–5′9″' },
  { size: 'XL', chest: '42 in', length: '30 in', height: '5′9″–6′0″' },
  { size: 'XXL', chest: '44 in', length: '31 in', height: '6′0″ and up' },
];

export function SizeGuide() {
  return (
    <section
      id="guide"
      className="max-w-[1360px] mx-auto pt-16 px-6 max-[560px]:pt-12 max-[560px]:px-4"
      aria-labelledby="guideH"
    >
      <div className="grid grid-cols-[1fr_1.4fr] max-[1040px]:grid-cols-1 gap-4 items-stretch">
        <div className="bg-ink text-white rounded-[24px] p-8 flex flex-col justify-between gap-6">
          <h3
            id="guideH"
            className="font-display font-extrabold text-[40px] leading-[0.95] uppercase"
          >
            Find your size
          </h3>
          <p className="text-[#C4C7D0]">
            Measure a T-shirt that fits you well, flat across the chest, and match it to the table.
            Wrong size? Exchange it within 7 days.
          </p>
        </div>

        <div className="bg-paper rounded-[24px] py-2 px-6 overflow-x-auto">
          <table className="w-full border-collapse tabular-nums">
            <thead>
              <tr>
                <th className="py-4 px-2 text-left border-b border-rule text-[13px] font-medium text-ink-2">
                  Size
                </th>
                <th className="py-4 px-2 text-left border-b border-rule text-[13px] font-medium text-ink-2">
                  Chest
                </th>
                <th className="py-4 px-2 text-left border-b border-rule text-[13px] font-medium text-ink-2">
                  Length
                </th>
                <th className="py-4 px-2 text-left border-b border-rule text-[13px] font-medium text-ink-2">
                  Height
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row, index) => {
                const isLast = index === SIZE_ROWS.length - 1;
                const borderClass = isLast ? 'border-b-0' : 'border-b border-rule';
                return (
                  <tr key={row.size}>
                    <td
                      className={`py-4 px-2 text-left font-display font-extrabold text-[24px] leading-none ${borderClass}`}
                    >
                      {row.size}
                    </td>
                    <td className={`py-4 px-2 text-left ${borderClass}`}>{row.chest}</td>
                    <td className={`py-4 px-2 text-left ${borderClass}`}>{row.length}</td>
                    <td className={`py-4 px-2 text-left ${borderClass}`}>{row.height}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
