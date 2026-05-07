import { Wizard } from '@/components/wizard/Wizard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">PassportSnap</h1>
        <div className="text-sm text-gray-500">Free passport photo tool</div>
      </header>
      <Wizard />
    </div>
  );
}
