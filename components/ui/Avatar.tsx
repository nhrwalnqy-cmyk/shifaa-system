import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={cn("rounded-full object-cover border border-line", className)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        "flex items-center justify-center rounded-full bg-teal-800 font-display font-bold text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}
