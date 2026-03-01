import { CategoryForm } from "@/components/admin/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Category</h2>
      <CategoryForm />
    </div>
  );
}
