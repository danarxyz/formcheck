# Muscles use our own taxonomy, independent of the body-map display

Target Muscles are named with a precise taxonomy owned by this project (e.g. Latissimus dorsi, Rhomboids, Middle trapezius), and the body-map display maps each Muscle to whatever region its renderer supports. The first renderer, `react-body-highlighter`, has a single "upper-back" region and cannot tell the lats from the rhomboids, which is exactly the difference between a pulldown and a row. Using its names directly would have been faster but would bake that imprecision into the content; keeping the taxonomy ours lets the renderer be replaced (later by our own SVG figure) without touching any Exercise.

## Consequences

- Every Muscle must have a display mapping; a build-time check enforces it.
- The body map may highlight a coarser region than the text names. The text is the source of truth.
