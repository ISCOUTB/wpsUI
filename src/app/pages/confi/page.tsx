import WPSInitialConfig from "@/components/initialConfigs";

export default function vista() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-yellow-200 animate-bg min-h-screen">
      <main className="min-h-screen">
        <WPSInitialConfig />
      </main>
    </div>
  );
}
