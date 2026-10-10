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
} from "@mui/icons-material";
import LogoutButton from "@/app/components/LogoutButton";
import { createClient } from "@/app/utils/supabase/Client";

// --- Types ---
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  dropNode: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Preparing" | "Ready for Pickup" | "Delivered";
  time: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  quota: number;
  prepTime: string;
  image: string;
  available: boolean;
}

// --- Mock Data ---
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-9021",
    customerName: "David Okon",
    dropNode: "SST Building",
    items: [
      { name: "Jollof Rice & Chicken", quantity: 2, price: 1500 },
      { name: "Chilled Zobo Juice", quantity: 1, price: 400 },
    ],
    total: 3400,
    status: "Pending",
    time: "2 mins ago",
  },
  {
    id: "ORD-9018",
    customerName: "Amina Bello",
    dropNode: "Student Center",
    items: [{ name: "Fried Rice & Diced Beef", quantity: 1, price: 1600 }],
    total: 1600,
    status: "Preparing",
    time: "10 mins ago",
  },
  {
    id: "ORD-9015",
    customerName: "Chidi Nnamdi",
    dropNode: "Main Library Quad",
    items: [{ name: "Golden Flaky Meat Pie", quantity: 3, price: 600 }],
    total: 1800,
    status: "Ready for Pickup",
    time: "22 mins ago",
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Jollof Rice & Chicken",
    price: 1500,
    category: "Rice",
    quota: 8,
    prepTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop&q=80",
    available: true,
  },
  {
    id: "p2",
    name: "Fried Rice & Diced Beef",
    price: 1600,
    category: "Rice",
    quota: 14,
    prepTime: "10 min",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80",
    available: true,
  },
  {
    id: "p3",
    name: "Golden Flaky Meat Pie",
    price: 600,
    category: "Snacks",
    quota: 5,
    prepTime: "Ready",
    image:
      "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=600&h=400&fit=crop&q=80",
    available: true,
  },
];

export default function VendorDashboardPage() {
  const supabase = createClient();
  const [tabValue, setTabValue] = useState(0);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Products State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // New Product Form State
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Rice");
  const [newProductQuota, setNewProductQuota] = useState("");
  const [newProductPrepTime, setNewProductPrepTime] = useState("");
  const [newProductImage, setNewProductImage] = useState("");

  // Vendor Profile State matching Supabase Schema
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("vendor");
  const [subRole, setSubRole] = useState("standard");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Profile UI State
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch logged-in vendor profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          setEmail(user.email || "");

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
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, available: !p.available } : p
      )
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newItem: Product = {
      id: `p-${Date.now()}`,
      name: newProductName,
      price: parseFloat(newProductPrice),
      category: newProductCategory,
      quota: parseInt(newProductQuota) || 10,
      prepTime: newProductPrepTime || "10 min",
      image:
        newProductImage ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
      available: true,
    };

    setProducts([newItem, ...products]);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductQuota("");
    setNewProductPrepTime("");
    setNewProductImage("");
    setTabValue(1);
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
          sub_role: subRole,
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
            {orders.length === 0 ? (
              <Card sx={{ p: 6, textAlign: "center", borderRadius: 4, boxShadow: "none", border: "1px solid #e2e8f0" }}>
                <Typography variant="body2" color="text.secondary">
                  No active orders at the moment.
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
                {orders.map((order) => (
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
                        <Chip label={order.id} size="small" sx={{ bgcolor: "#eff6ff", color: "#377EE9", fontWeight: 700 }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {order.time}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Dropoff: <strong>{order.dropNode}</strong>
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {order.items.map((item, idx) => (
                          <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#334155" }}>
                              {item.quantity}x {item.name}
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
                          ₦{order.total.toLocaleString()}
                        </Typography>
                      </Box>

                      <FormControl size="small">
                        <Select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
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
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Card>
                ))}
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
                        <CardMedia component="img" image={product.image} alt={product.name} sx={{ height: "100%", width: "100%", objectFit: "cover" }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category} • {product.prepTime}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#377EE9", mt: 0.5 }}>
                          ₦{product.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          Quota Left
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {product.quota} portions
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleProductAvailability(product.id)}
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
          </Box>
        )}

        {/* TAB 2: ADD PRODUCT */}
        {tabValue === 2 && (
          <Card sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1E293B" }}>
              Add New Food Item
            </Typography>

            <Box component="form" onSubmit={handleAddProduct} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Item Name"
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
                    <MenuItem value="Rice">Rice</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                    <MenuItem value="Proteins">Proteins</MenuItem>
                    <MenuItem value="Drinks">Drinks</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Daily Quota"
                  type="number"
                  fullWidth
                  size="small"
                  value={newProductQuota}
                  onChange={(e) => setNewProductQuota(e.target.value)}
                  placeholder="20"
                />
                <TextField
                  label="Prep Time"
                  fullWidth
                  size="small"
                  value={newProductPrepTime}
                  onChange={(e) => setNewProductPrepTime(e.target.value)}
                  placeholder="10 min"
                />
              </Box>

              <TextField
                label="Image URL"
                type="url"
                fullWidth
                size="small"
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 1, bgcolor: "#377EE9", textTransform: "none", borderRadius: "12px", fontWeight: 600 }}
              >
                Save Product
              </Button>
            </Box>
          </Card>
        )}

        {/* TAB 3: VENDOR PROFILE (CONNECTED TO SUPABASE PROFILES TABLE) */}
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

                  <FormControl fullWidth size="small">
                    <InputLabel>Sub Role</InputLabel>
                    <Select
                      value={subRole}
                      label="Sub Role"
                      onChange={(e) => setSubRole(e.target.value)}
                    >
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
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