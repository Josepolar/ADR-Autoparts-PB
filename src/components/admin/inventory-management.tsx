"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Button, Input, Spinner, Alert, Badge } from "@/components/ui/modern-components";
import { Trash2, Edit2, Plus, Search, Upload, ImageIcon, X } from "lucide-react";
import { getParts, createPart, updatePart, deletePart } from "@/server/actions";

const CATEGORIES = [
  { value: "ENGINE_OILS", label: "Engine Oils" },
  { value: "TRANSMISSION_FLUIDS", label: "Transmission Fluids" },
  { value: "COOLANTS", label: "Coolants" },
  { value: "BRAKE_PADS", label: "Brake Pads" },
  { value: "FILTERS", label: "Filters" },
  { value: "SPARK_PLUGS", label: "Spark Plugs" },
  { value: "BELTS_HOSES", label: "Belts & Hoses" },
  { value: "BATTERIES", label: "Batteries" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "SUSPENSION", label: "Suspension" },
  { value: "OTHER", label: "Other" },
];

interface Part {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category: string;
  costPrice: any;
  retailPrice: any;
  totalStock: number;
  manufacturer?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  variants?: any[];
}

export default function InventoryManagement() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "ENGINE_OILS",
    costPrice: 0,
    retailPrice: 0,
    totalStock: 0,
    manufacturer: "",
    imageUrl: "",
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
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "ENGINE_OILS",
      costPrice: 0,
      retailPrice: 0,
      totalStock: 0,
      manufacturer: "",
      imageUrl: "",
    });
  };

  const handleEditPart = (part: Part) => {
    setShowForm(true);
    setEditingId(part.id);
    setImageFile(null);
    setImagePreview(part.imageUrl || null);
    setUploadError(null);
    setFormData({
      name: part.name,
      sku: part.sku,
      description: part.description || "",
      category: part.category,
      costPrice: parseFloat(String(part.costPrice)) || 0,
      retailPrice: parseFloat(String(part.retailPrice)) || 0,
      totalStock: part.totalStock,
      manufacturer: part.manufacturer || "",
      imageUrl: part.imageUrl || "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setUploadError("Invalid file type. Use JPG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Max 5MB.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return formData.imageUrl || null;

    const fd = new FormData();
    fd.append("file", imageFile);

    const res = await fetch("/api/upload/product-image", { method: "POST", body: fd });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Upload failed");
    return result.imageUrl;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadError(null);

    try {
      let imageUrl = formData.imageUrl || null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      if (editingId) {
        const result = await updatePart(editingId, {
          ...formData,
          imageUrl,
        });
        if (!result.success) throw new Error(result.error);
      } else {
        const result = await createPart({
          ...formData,
          imageUrl: imageUrl || undefined,
        });
        if (!result.success) throw new Error(result.error);
      }

      setShowForm(false);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      await loadParts();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to save part");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePart = async (partId: string) => {
    if (!confirm("Are you sure you want to delete this part?")) return;
    const result = await deletePart(partId);
    if (result.success) {
      await loadParts();
    }
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

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Cost Price (₱)"
                type="number"
                value={formData.costPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="Retail Price (₱)"
                type="number"
                value={formData.retailPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="Stock"
                type="number"
                value={formData.totalStock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, totalStock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Product Image</label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#2a2a35] bg-[#16161d] shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-28 h-28 rounded-xl border-2 border-dashed border-[#2a2a35] hover:border-[#3a3a45] bg-[#16161d] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[#16161d] border border-[#2a2a35] rounded-lg text-gray-300 hover:bg-[#1e1e28] hover:text-white transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview ? "Change Image" : "Choose File"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5">JPG, PNG, WebP, or GIF. Max 5MB.</p>
                  {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update Part" : "Create Part"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowForm(false); setEditingId(null); }}
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
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Parts List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-nardo-gray-700">
              <tr>
                <th className="text-nardo-gray-300 font-semibold pb-3">Image</th>
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
                  <td colSpan={7} className="py-8 text-center text-nardo-gray-400">
                    No parts found
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr
                    key={part.id}
                    className="border-b border-nardo-gray-700 hover:bg-nardo-gray-800/50"
                  >
                    <td className="py-3">
                      {part.imageUrl ? (
                        <img src={part.imageUrl} alt={part.name} className="w-10 h-10 rounded-lg object-cover border border-[#2a2a35]" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#16161d] border border-[#2a2a35] flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </td>
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
                        onClick={() => handleEditPart(part)}
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
