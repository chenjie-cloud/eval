import ReplicaCard from "@/components/ReplicaCard";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070411] text-white">
      <div className="replica-bg relative min-h-screen">
        <div className="absolute inset-0 replica-grain" />

        <div className="pointer-events-none absolute -left-24 top-[-140px] h-[520px] w-[520px] rounded-full bg-[#EC4899]/30 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-160px] top-[-120px] h-[620px] w-[620px] rounded-full bg-[#60A5FA]/22 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-220px] left-[12%] h-[720px] w-[720px] rounded-full bg-[#8B5CF6]/18 blur-[120px]" />

        <main className="relative mx-auto flex min-h-screen max-w-[1200px] items-center justify-center px-6 py-16">
          <ReplicaCard />
        </main>
      </div>
    </div>
  );
}
