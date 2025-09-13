import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MultiChain from "@/components/MultiChain";
import DeveloperTools from "@/components/DeveloperTools";
import Enterprise from "@/components/Enterprise";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <MultiChain />
      <DeveloperTools />
      <Enterprise />
    </div>
  );
};

export default Index;
