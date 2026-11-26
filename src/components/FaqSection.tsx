import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    id: 'upfront',
    q: 'Do I pay anything upfront?',
    a: 'No. You pay the delivery person in cash after you have opened and checked the shirt.',
  },
  {
    id: 'delivery',
    q: 'How fast is delivery?',
    a: 'Inside Dhaka in 1–2 days. Outside Dhaka in 2–4 days. We call to confirm before dispatch.',
  },
  {
    id: 'exchange',
    q: 'What if the size is wrong?',
    a: "Exchange within 7 days for another size. You only cover delivery. Printed shirts can't be exchanged.",
  },
  {
    id: 'restock',
    q: 'Will you restock at this price?',
    a: "No. These are the last units of the season. When a size is gone, it's gone.",
  },
];

export function FaqSection() {
  return (
    <section
      className="max-w-[1360px] mx-auto pt-16 px-6 max-[560px]:pt-12 max-[560px]:px-4"
      aria-labelledby="faqH"
    >
      <div className="flex justify-between items-end gap-6 mb-6">
        <h2
          id="faqH"
          className="font-display font-extrabold text-[clamp(36px,4.2vw,64px)] leading-[0.92] uppercase max-w-[14ch]"
        >
          Before you order
        </h2>
      </div>

      <Accordion
        multiple
        className="grid grid-cols-2 max-[1040px]:grid-cols-1 gap-x-4 gap-y-3 items-start"
      >
        {FAQS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="bg-paper rounded-[20px] px-6 border-0 not-last:border-b-0"
          >
            <AccordionTrigger className="py-[22px] text-[16px] font-semibold text-ink hover:no-underline cursor-pointer [&_[data-slot=accordion-trigger-icon]]:text-ink [&_[data-slot=accordion-trigger-icon]]:size-5 [&_[data-slot=accordion-trigger-icon]]:mt-0.5">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-[16px] text-ink-2 pb-[22px] pt-0 max-w-[56ch] leading-[1.55]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
