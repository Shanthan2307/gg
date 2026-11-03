import Dock from "@/components/Dock";
import Hand from "@/components/Hand";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import Numbers from "@/components/Numbers";
import Passport from "@/components/Passport";
import Receipts from "@/components/Receipts";
import SideB from "@/components/SideB";
import Tickets from "@/components/Tickets";
import Toolbox from "@/components/Toolbox";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Numbers />
      <Tickets />
      <Receipts />
      <Lab />
      <Passport />
      <Hand />
      <Toolbox />
      <SideB />
      <Dock />
    </main>
  );
}
