import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Baby,
  CalendarClock,
  CircleCheck,
  Clock,
  CreditCard,
  House,
  Leaf,
  Luggage,
  MapPin,
  PlaneLanding,
  Receipt,
  ShieldCheck,
  Tag,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { BENEFITS, BENEFITS_LEAD, BENEFITS_TITLE, ORDER_STEPS, ORDER_STEPS_TITLE, type BenefitIcon } from "@/content/benefits";

const ICONS: Record<BenefitIcon, LucideIcon> = {
  home: House,
  clock: Clock,
  user: User,
  receipt: Receipt,
  card: CreditCard,
  armchair: Armchair,
  leaf: Leaf,
  shield: ShieldCheck,
  calendar: CalendarClock,
  zap: Zap,
  check: CircleCheck,
  plane: PlaneLanding,
  sign: UserCheck,
  luggage: Luggage,
  baby: Baby,
  tag: Tag,
  map: MapPin,
};

/** Zdieľaná sekcia výhod (trasové stránky, homepage SK). */
export function BenefitsSection({
  title = BENEFITS_TITLE,
  lead = BENEFITS_LEAD,
  headingLevel = 2,
  items,
}: {
  title?: string;
  lead?: string;
  headingLevel?: 2 | 3;
  /** Preložené výhody v rovnakom poradí ako BENEFITS (ikony sa berú z BENEFITS). */
  items?: { title: string; text: string }[];
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <section aria-labelledby="vyhody">
      <H id="vyhody" className="font-display font-bold text-2xl mb-3">{title}</H>
      <p className="text-muted-foreground leading-relaxed mb-6">{lead}</p>
      <ul className="grid sm:grid-cols-2 gap-4">
        {BENEFITS.map((base, i) => {
          const Icon = ICONS[base.icon];
          const b = items?.[i] ?? base;
          return (
            <li key={b.title} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <Icon className="w-6 h-6 shrink-0 text-[#282462] dark:text-yellow-400" aria-hidden="true" />
              <div>
                <h3 className="font-display font-semibold text-base text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Postup objednávky v 4 krokoch. */
export function OrderStepsSection({ title = ORDER_STEPS_TITLE, steps = ORDER_STEPS }: { title?: string; steps?: { title: string; text: string }[] } = {}) {
  return (
    <section aria-labelledby="ako-objednat">
      <h2 id="ako-objednat" className="font-display font-bold text-2xl mb-4">{title}</h2>
      <ol className="grid sm:grid-cols-2 gap-4">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 font-display font-bold text-primary">{i + 1}</span>
              <h3 className="font-display font-semibold text-base">{s.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
