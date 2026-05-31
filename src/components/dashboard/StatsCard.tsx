import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number;
  href?: string;
}

export default function StatsCard({ title, value, href }: StatsCardProps) {
  const content = (
    <>
      <h3 className="text-sm text-slate-500 dark:text-slate-300">{title}</h3>

      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </>
  );

  const cardClass =
    "block rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
