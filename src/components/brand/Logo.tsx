import Image from "next/image";
import logo from "../../../public/brand/tj-logo.webp";

/** The official TechnoJam ribbon mark. */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <Image
      src={logo}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      priority
      sizes="40px"
      className={`w-auto object-contain ${className}`}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`items-center gap-2.5 ${className || "inline-flex"}`}>
      <Mark className="h-8 shrink-0" />
      <span className="text-[0.95rem] font-extrabold tracking-[0.02em] uppercase font-wide">TechnoJam</span>
    </span>
  );
}
