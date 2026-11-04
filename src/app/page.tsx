import Dock from "@/components/Dock";
import Motion from "@/components/Motion";
import Hand from "@/components/Hand";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import NowBuilding from "@/components/NowBuilding";
import Numbers from "@/components/Numbers";
import Passport from "@/components/Passport";
import Receipts from "@/components/Receipts";
import SideB from "@/components/SideB";
import Tickets from "@/components/Tickets";
import Toolbox from "@/components/Toolbox";

export default function Home() {
  return (
    <Motion>
    <main id="main" className="overflow-x-clip">
      <Hero />
      <Numbers />
      <NowBuilding />
      <Tickets />
      <Receipts />
      <Lab />
      <Passport />
      <Hand />
      <Toolbox />
      <SideB />
      <Dock />
    </main>
    </Motion>
  );
}
