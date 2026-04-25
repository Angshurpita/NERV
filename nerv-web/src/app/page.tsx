import Hero from "@/components/Hero";
import Architecture from "@/components/Evolution";
import Logos from "@/components/Logos";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Logos />
      <Architecture />
    </main>
  );
}
