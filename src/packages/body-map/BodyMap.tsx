"use client";

import Model from "react-body-highlighter";
import type { TargetMuscle } from "@/packages/library";
import { highlightFor } from "./lib/regions";

/**
 * The project's Muscle Map interface (ADR-0002). Callers pass Target Muscles;
 * the renderer behind it is swappable. Colours come from CSS tokens
 * `--muscle-primary` / `--muscle-secondary` / `--muscle-idle` in globals.css.
 */
export function BodyMap({ targetMuscles, className }: { targetMuscles: readonly TargetMuscle[]; className?: string }) {
  const { primary, secondary } = highlightFor(targetMuscles);
  const data = [
    { name: "secondary", muscles: secondary, frequency: 1 },
    { name: "primary", muscles: primary, frequency: 2 },
  ];
  const colors = ["var(--muscle-secondary)", "var(--muscle-primary)"];

  return (
    <div className={className} role="img" aria-label="Peta otot target: depan dan belakang">
      <div className="grid grid-cols-2 gap-4">
        {(["anterior", "posterior"] as const).map((type) => (
          <Model
            key={type}
            type={type}
            data={data}
            highlightedColors={colors}
            bodyColor="var(--muscle-idle)"
            style={{ width: "100%" }}
          />
        ))}
      </div>
    </div>
  );
}
