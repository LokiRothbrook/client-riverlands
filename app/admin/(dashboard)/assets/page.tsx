import { AssetsGrid } from "@/components/admin/assets/assets-grid";

export default function AdminAssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assets</h2>
      </div>
      <AssetsGrid />
    </div>
  );
}
