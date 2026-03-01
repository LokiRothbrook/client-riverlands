import { CountyForm } from "@/components/admin/counties/county-form";

export default function NewCountyPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New County</h2>
      <CountyForm />
    </div>
  );
}
