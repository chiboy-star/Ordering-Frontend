"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingBag,
  Inventory2,
  AddCircle,
  Store,
  AccessTime,
  CloudUpload,
} from "@mui/icons-material";
import LogoutButton from "@/app/components/LogoutButton";
import { createClient } from "@/app/utils/supabase/Client";

// --- Types ---
interface OrderItemDisplay {
  id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
  } | {
    name: string;
  }[];
}

interface SupabaseOrder {
  id: string;
  token: string;
  created_at: string;
  fulfillment_type: string;
  dropoff_location?: string;
  delivery_note?: string;
  total: number;
  status: string;
  student_id: string;
  profiles?: {
    full_name?: string;
    phone_number?: string;
  } | {
    full_name?: string;
    phone_number?: string;
  }[];
  order_items: OrderItemDisplay[];
}

interface DbProduct {
  id: string;
  vendor_id: string;
  name: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url: string;
  available: boolean;
  created_at?: string;
}

export default function VendorDashboardPage() {
  const supabase = createClient();
  const [tabValue, setTabValue] = useState(0);

  // User & Profile State
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("vendor");
  const [subRole, setSubRole] = useState("standard");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Products & Orders State
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // New Product Form State
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Food");
  const [newProductStock, setNewProductStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile UI State
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch logged-in user, profile, products, and real orders
  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          setEmail(user.email || "");

          // 1. Load Profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || "");
            setRole(profile.role || "vendor");
            setSubRole(profile.sub_role || "standard");
            setPhoneNumber(profile.phone_number || "");
          }

          // 2. Load Vendor Products & Orders
          fetchProducts(user.id);
          fetchVendorOrders(user.id);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setProfileLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  const fetchProducts = async (vendorId: string) => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setProductsLoading(false);
  };

  const fetchVendorOrders = async (vendorId: string) => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          token,
          created_at,
          fulfillment_type,
          dropoff_location,
          delivery_note,
          total,
          status,
          student_id,
          profiles:student_id (
            full_name,
            phone_number
          ),
          order_items (
            id,
            quantity,
            price,
            products (
              name
            )
          )
        `)
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as SupabaseOrder[]);
      }
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update order status in database:", error.message);
    }
  };

  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !currentStatus } : p))
    );

    await supabase
      .from("products")
      .update({ available: !currentStatus })
      .eq("id", productId);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !userId) return;

    setAddingProduct(true);
    setProductMessage(null);

    try {
      let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const newProduct = {
        vendor_id: userId,
        name: newProductName,
        price: parseFloat(newProductPrice),
        category: newProductCategory,
        stock_quantity: parseInt(newProductStock) || 0,
        image_url: imageUrl,
        available: true,
      };

      const { error } = await supabase.from("products").insert(newProduct);

      if (error) {
        throw new Error(error.message);
      }

      setProductMessage({ type: "success", text: "Product added successfully!" });
      setNewProductName("");
      setNewProductPrice("");
      setNewProductStock("");
      setImageFile(null);
      fetchProducts(userId);
      setTabValue(1);
    } catch (err: any) {
      setProductMessage({ type: "error", text: err.message || "Failed to add product." });
    } finally {
      setAddingProduct(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber || null,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        setProfileMessage({ type: "error", text: error.message });
      } else {
        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err) {
      setProfileMessage({ type: "error", text: "An unexpected error occurred while saving." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Helper to extract customer name & phone
  const getCustomerInfo = (profField: SupabaseOrder["profiles"]) => {
    if (!profField) return { name: "Student Buyer", phone: "" };
    if (Array.isArray(profField)) {
      return {
        name: profField[0]?.full_name || "Student Buyer",
        phone: profField[0]?.phone_number || "",
      };
    }
    return {
      name: profField.full_name || "Student Buyer",
      phone: profField.phone_number || "",
    };
  };

  // Helper to extract product name
  const getProductName = (prodField: OrderItemDisplay["products"]) => {
    if (!prodField) return "Item";
    if (Array.isArray(prodField)) {
      return prodField[0]?.name || "Item";
    }
    return prodField.name || "Item";
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", pb: 6 }}>
      {/* Top Header */}
      <Box
        component="header"
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid",
          borderColor: "slate.200",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "#377EE9",
                  fontWeight: "bold",
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                }}
              >
                {fullName ? fullName.charAt(0).toUpperCase() : "V"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B", lineHeight: 1.2 }}>
                  {fullName || "Vendor Outlet"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Vendor Management Console
                </Typography>
              </Box>
            </Box>

            <LogoutButton variant="danger" showText={true} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* MUI Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
                color: "text.secondary",
              },
              "& .Mui-selected": { color: "#377EE9 !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#377EE9" },
            }}
          >
            <Tab icon={<ShoppingBag fontSize="small" />} iconPosition="start" label={`Orders (${orders.length})`} />
            <Tab icon={<Inventory2 fontSize="small" />} iconPosition="start" label={`Inventory (${products.length})`} />
            <Tab icon={<AddCircle fontSize="small" />} iconPosition="start" label="Add Product" />
            <Tab icon={<Store fontSize="small" />} iconPosition="start" label="Vendor Profile" />
          </Tabs>
        </Box>

        {/* TAB 0: ORDERS */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1E293B" }}>
              Live Customer Orders
            </Typography>
            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={32} sx={{ color: "#377EE9" }} />
              </Box>
            ) : orders.length === 0 ? (
              <Card sx={{ p: 6, textAlign: "center", borderRadius: 4, boxShadow: "none", border: "1px solid #e2e8f0" }}>
                <Typography variant="body2" color="text.secondary">
                  No active customer orders yet. Orders placed by students will appear here in real-time.
                </Typography>
              </Card>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 3,
                }}
              >
                {orders.map((order) => {
                  const customer = getCustomerInfo(order.profiles);
                  const timeFormatted = new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <Card
                      key={order.id}
                      sx={{
                        borderRadius: 4,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        p: 1,
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Chip label={order.token || "#PND"} size="small" sx={{ bgcolor: "#eff6ff", color: "#377EE9", fontWeight: 700 }} />
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                              {timeFormatted}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {customer.name} {customer.phone && `(${customer.phone})`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Fulfillment: <strong className="capitalize">{order.fulfillment_type?.replace("-", " ")}</strong>
                        </Typography>
                        {order.dropoff_location && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Drop-off: <strong>{order.dropoff_location}</strong>
                          </Typography>
                        )}
                        {order.delivery_note && (
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontStyle: "italic", mb: 2 }}>
                            Note: "{order.delivery_note}"
                          </Typography>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {order.order_items?.map((item) => (
                            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                              <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#334155" }}>
                                {item.quantity}x {getProductName(item.products)}
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
                            TOTAL
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                            ₦{Number(order.total).toLocaleString()}
                          </Typography>
                        </Box>

                        <FormControl size="small">
                          <Select
                            value={order.status || "Pending"}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              borderRadius: "12px",
                              bgcolor:
                                order.status === "Pending"
                                  ? "#fffbeb"
                                  : order.status === "Preparing"
                                  ? "#eff6ff"
                                  : order.status === "Ready for Pickup"
                                  ? "#f5f3ff"
                                  : "#ecfdf5",
                              color:
                                order.status === "Pending"
                                  ? "#d97706"
                                  : order.status === "Preparing"
                                  ? "#377EE9"
                                  : order.status === "Ready for Pickup"
                                  ? "#7c3aed"
                                  : "#059669",
                            }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Preparing">Preparing</MenuItem>
                            <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* TAB 1: INVENTORY */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
                Product Inventory
              </Typography>
              <Button
                variant="contained"
                onClick={() => setTabValue(2)}
                startIcon={<AddCircle />}
                sx={{ bgcolor: "#377EE9", textTransform: "none", borderRadius: "12px", fontWeight: 600 }}
              >
                Add Item
              </Button>
            </Box>

            {productsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={32} sx={{ color: "#377EE9" }} />
              </Box>
            ) : products.length === 0 ? (
              <Card sx={{ p: 6, textAlign: "center", borderRadius: 4, boxShadow: "none", border: "1px solid #e2e8f0" }}>
                <Typography variant="body2" color="text.secondary">
                  No products in your catalog yet. Click "Add Item" to list your first food product!
                </Typography>
              </Card>
            ) : (
              <Card sx={{ borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none" }}>
                {products.map((product, idx) => (
                  <Box key={product.id}>
                    <Box
                      sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            position: "relative",
                            width: 56,
                            height: 56,
                            borderRadius: "12px",
                            overflow: "hidden",
                            bgcolor: "slate.100",
                            flexShrink: 0,
                          }}
                        >
                          <CardMedia component="img" image={product.image_url} alt={product.name} sx={{ height: "100%", width: "100%", objectFit: "cover" }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.category}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#377EE9", mt: 0.5 }}>
                            ₦{Number(product.price).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            Stock Qty
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {product.stock_quantity} remaining
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => toggleProductAvailability(product.id, product.available)}
                          sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: product.available ? "#a7f3d0" : "#cbd5e1",
                            bgcolor: product.available ? "#ecfdf5" : "#f8fafc",
                            color: product.available ? "#059669" : "#64748b",
                          }}
                        >
                          {product.available ? "In Stock" : "Sold Out"}
                        </Button>
                      </Box>
                    </Box>
                    {idx < products.length - 1 && <Divider />}
                  </Box>
                ))}
              </Card>
            )}
          </Box>
        )}

        {/* TAB 2: ADD PRODUCT */}
        {tabValue === 2 && (
          <Card sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1E293B" }}>
              Add New Food Item
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload product image and publish details to your store menu.
            </Typography>

            {productMessage && (
              <Alert severity={productMessage.type} sx={{ mb: 2.5, borderRadius: "12px" }}>
                {productMessage.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleAddProduct} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Product Name"
                required
                fullWidth
                size="small"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="e.g. Asun Fried Rice"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Price (₦)"
                  type="number"
                  required
                  fullWidth
                  size="small"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="2000"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newProductCategory}
                    label="Category"
                    onChange={(e) => setNewProductCategory(e.target.value)}
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                    <MenuItem value="Drinks">Drinks</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Stock Quantity"
                type="number"
                required
                fullWidth
                size="small"
                value={newProductStock}
                onChange={(e) => setNewProductStock(e.target.value)}
                placeholder="20"
              />

              <Box
                sx={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px",
                  p: 2.5,
                  textAlign: "center",
                  bgcolor: "#f8fafc",
                }}
              >
                <input
                  accept="image/*"
                  type="file"
                  id="product-image-file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="product-image-file" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <CloudUpload sx={{ color: "#377EE9", fontSize: 28 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                    {imageFile ? imageFile.name : "Click to upload product image file"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, WEBP up to 5MB
                  </Typography>
                </label>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={addingProduct}
                sx={{ mt: 1, bgcolor: "#377EE9", textTransform: "none", borderRadius: "12px", fontWeight: 600 }}
              >
                {addingProduct ? "Uploading & Saving..." : "Save Product"}
              </Button>
            </Box>
          </Card>
        )}

        {/* TAB 3: VENDOR PROFILE */}
        {tabValue === 3 && (
          <Card sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1E293B" }}>
              Vendor Profile Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage your account profile details stored in Supabase.
            </Typography>

            {profileLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} sx={{ color: "#377EE9" }} />
              </Box>
            ) : (
              <Box component="form" onSubmit={handleUpdateProfile} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {profileMessage && (
                  <Alert severity={profileMessage.type} sx={{ borderRadius: "12px" }}>
                    {profileMessage.text}
                  </Alert>
                )}

                <TextField
                  label="Full Name / Vendor Name"
                  required
                  fullWidth
                  size="small"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Okon"
                />

                <TextField
                  label="Email Address"
                  disabled
                  fullWidth
                  size="small"
                  value={email}
                  helperText="Email is managed via authentication."
                />

                <TextField
                  label="Phone Number"
                  fullWidth
                  size="small"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 812 345 6789"
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      label="Role"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="vendor">Vendor</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={savingProfile}
                  sx={{ mt: 1, bgcolor: "#377EE9", textTransform: "none", borderRadius: "12px", fontWeight: 600 }}
                >
                  {savingProfile ? "Saving Changes..." : "Update Profile"}
                </Button>
              </Box>
            )}
          </Card>
        )}
      </Container>
    </Box>
  );
}