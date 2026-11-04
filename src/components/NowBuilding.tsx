import ResQFigure from "./figures/resq/figure";
import { SectionHead } from "./ui";

export default function NowBuilding() {
  return (
    <section id="resq" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-16">
          <SectionHead
            kicker="00 · Now building"
            title={<>GPS for <em>drones</em></>}
            blurb="ResQ began as a relief network that matched wildfire donations to the right center by ZIP code. Now it is growing into GPS for drones. The figure shows the idea that joins the two: a request names a ZIP, and the aid lands on the pad of the center that owns it."
          />
        </div>
        <ResQFigure />
      </div>
    </section>
  );
}
