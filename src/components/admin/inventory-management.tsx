"use client";

import { useEffect, useState } from "react";
import { Card, Button, Input, Spinner, Alert, Badge } from "@/components/ui/modern-components";
import { Trash2, Edit2, Plus, Search } from "lucide-react";
import { getParts } from "@/server/actions";

interface Part {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category: string;
  retailPrice: any;
  totalStock: number;
  manufacturer?: string | null;
  createdAt: Date;
  variants?: any[];
}

export default function InventoryManagement() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "ENGINE",
    retailPrice: 0,
    totalStock: 0,
  });

  useEffect(() => {
    loadParts();
  }, []);

  async function loadParts() {
    setLoading(true);
    const result = await getParts();
    if (result.success && result.data) {
      setParts(result.data);
    }
    setLoading(false);
  }

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || part.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPart = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "ENGINE",
      retailPrice: 0,
      totalStock: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API endpoint for creating/updating parts
    console.log("Part submitted:", formData);
    setShowForm(false);
  };

  const handleDeletePart = async (partId: string) => {
    if (!confirm("Are you sure you want to delete this part?")) return;
    // TODO: Implement API endpoint for deleting parts
    console.log("Delete part:", partId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Parts Inventory</h2>
        <Button variant="primary" size="sm" onClick={handleAddPart}>
          <Plus className="w-5 h-5 mr-2" />
          Add Part
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingId ? "Edit Part" : "Add New Part"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Part Name"
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="SKU"
                type="text"
                value={formData.sku}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>

            <Input
              label="Description"
              type="text"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                >
                  <option>ENGINE</option>
                  <option>SUSPENSION</option>
                  <option>BRAKES</option>
                  <option>EXHAUST</option>
                  <option>COOLING</option>
                  <option>ELECTRICAL</option>
                </select>
              </div>
              <Input
                label="Price (₱)"
                type="number"
                value={formData.retailPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) })}
                required
              />
              <Input
                label="Stock"
                type="number"
                value={formData.totalStock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                {editingId ? "Update Part" : "Create Part"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by part name or SKU..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
          className="input sm:w-48"
        >
          <option value="all">All Categories</option>
          <option value="ENGINE">Engine</option>
          <option value="SUSPENSION">Suspension</option>
          <option value="BRAKES">Brakes</option>
          <option value="EXHAUST">Exhaust</option>
          <option value="COOLING">Cooling</option>
          <option value="ELECTRICAL">Electrical</option>
        </select>
      </div>

      {/* Parts List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-nardo-gray-700">
              <tr>
                <th className="text-nardo-gray-300 font-semibold pb-3">Part Name</th>
                <th className="text-nardo-gray-300 font-semibold pb-3">SKU</th>
                <th className="text-nardo-gray-300 font-semibold pb-3">Category</th>
                <th className="text-nardo-gray-300 font-semibold pb-3">Price</th>
                <th className="text-nardo-gray-300 font-semibold pb-3">Stock</th>
                <th className="text-nardo-gray-300 font-semibold pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-nardo-gray-400">
                    No parts found
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr
                    key={part.id}
                    className="border-b border-nardo-gray-700 hover:bg-nardo-gray-800/50"
                  >
                    <td className="py-3 text-white">{part.name}</td>
                    <td className="py-3 text-nardo-gray-400">{part.sku}</td>
                    <td className="py-3">
                      <Badge variant="info">{part.category}</Badge>
                    </td>
                    <td className="py-3 font-semibold">₱{(part.retailPrice as any).toLocaleString()}</td>
                    <td className="py-3">
                      <Badge
                        variant={part.totalStock > 0 ? "success" : "danger"}
                      >
                        {part.totalStock} units
                      </Badge>
                    </td>
                    <td className="py-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(part.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePart(part.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredParts.length > 0 && (
        <Alert type="info">
          💡 Total Parts: {filteredParts.length} | Total Inventory Value: ₱
          {filteredParts
            .reduce((sum, p) => sum + (p.retailPrice as any) * p.totalStock, 0)
            .toLocaleString()}
        </Alert>
      )}
    </div>
  );
}
