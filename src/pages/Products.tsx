import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

const Products = () => {
  const {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    costPrice: 0,
    quantity: 0,
    minStockLevel: 0,
    categoryId: ""
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      description: "",
      sku: "",
      price: 0,
      costPrice: 0,
      quantity: 0,
      minStockLevel: 10,
      categoryId: ""
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      sku: product.sku,
      price: product.price,
      costPrice: product.costPrice,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel,
      categoryId: product.categoryId
    });
  };

  const handleSave = async () => {
    if (isCreating) {
      await createProduct(formData);
      setIsCreating(false);
    } else if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    }
    setFormData({
      name: "",
      description: "",
      sku: "",
      price: 0,
      costPrice: 0,
      quantity: 0,
      minStockLevel: 10,
      categoryId: ""
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      sku: "",
      price: 0,
      costPrice: 0,
      quantity: 0,
      minStockLevel: 10,
      categoryId: ""
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number, minStockLevel: number) => {
    if (quantity === 0) return { status: "Out of Stock", variant: "destructive" as const };
    if (quantity <= minStockLevel) return { status: "Low Stock", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products</span>
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleCreate} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(isCreating || editingProduct) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <Input
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                  <Input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                  <Input
                    placeholder="Cost Price"
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                  <Input
                    placeholder="Min Stock Level"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({...formData, minStockLevel: parseInt(e.target.value)})}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantity, product.minStockLevel);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>UGX {product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
