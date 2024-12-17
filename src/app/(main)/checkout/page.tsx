'use client';
import { useState, useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from 'react-toastify';
import { API_URL } from "../../config/url";

import React, { FormEvent } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    CircularProgress,
} from "@mui/material";
import AddressSelection from "@/app/(main)/checkout/AddressSelection";
import { useRouter, useSearchParams } from "next/navigation";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    currentVariant: any;
}

const Checkout: React.FC = () => {
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [addressId, setAddressId] = useState<string>(""); // Lưu id địa chỉ
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false); // Trạng thái loading khi đặt hàng
    const router = useRouter();

    // Hàm kiểm tra tính hợp lệ của địa chỉ
    const handleAddressValidation = (isValid: boolean) => {
        setIsAddressValid(isValid);
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    const fetchCart = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await fetch(`${API_URL}/api/cart/show-cart`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch cart");

                const data = await response.json();
                setProducts(data.data.cartItem.map((item: any) => ({
                    id: item.product.id,
                    title: item.product.title,
                    quantity: item.quantity,
                    price: item.product.price,
                    currentVariant: item.currentVariant,
                })));
                setTotalPrice(data.data.totalPrice);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePaymentVNPay = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            const token = localStorage.getItem("accessToken");
            setOrderLoading(true);
            const orderData = {
                addressId,
                paymentMethod,
            };

            try {
                const response = await fetch(`${API_URL}/api/payment/vn-pay?amount=${totalPrice}&bankCode=NCB`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) throw new Error("Failed to initiate VNPay payment");

                const data = await response.json();
                const paymentUrl = data.data.paymentUrl;
                setOrderLoading(false);
                router.push(paymentUrl);
            } catch (error: any) {
                console.error("Error initiating VNPay payment:", error.message);
                setError(error.message);
                // toast.sendToast("Error", "Error initiating VNPay payment");
                toast.success("Error initiating VNPay payment", {
                    position: "top-right",  // Định vị trí của Toast
                    autoClose: 3000,        // Thời gian tự động đóng
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === "vnpay") {
            await handlePaymentVNPay();
        } else {
            await createOrder();
        }
    };

    const createOrder = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            const token = localStorage.getItem("accessToken");
            setOrderLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/order/create-order`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        addressId,
                        paymentMethod,
                        products: products.map((product) => ({
                            id: product.id,
                            quantity: product.quantity,
                            variant: product.currentVariant,
                        })),
                    }),
                });

                if (!response.ok) throw new Error("Failed to create order");

                const data = await response.json();
                console.log("Order created successfully:", data);
                // toast.sendToast("Success", "Đặt hàng thành công");
                toast.success("Đặt hàng thành công", {
                    position: "top-right",  // Định vị trí của Toast
                    autoClose: 3000,        // Thời gian tự động đóng
                });
                router.replace("/status-order");
            } catch (error: any) {
                console.error("Error creating order:", error.message);
                setError(error.message);
                // toast.sendToast("Error", "Error creating order");
                toast.success("Error creating order", {
                    position: "top-right",  // Định vị trí của Toast
                    autoClose: 3000,        // Thời gian tự động đóng
                });
            } finally {
                setOrderLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    const handleConfirmOrder = async () => {
        handleCloseConfirmDialog();
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                    Checkout
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <AddressSelection
                            selectedAddressId={addressId}
                            setSelectedAddressId={setAddressId}
                            isAddressValid={isAddressValid}
                            setIsAddressValid={setIsAddressValid}
                        />
                        <Paper sx={{ padding: "20px", marginTop: "20px" }}>
                            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                                Payment Method
                            </Typography>
                            <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
                                <FormControlLabel value="creditCard" control={<Radio />} label="Credit/Debit Card" />
                                <FormControlLabel value="vnpay" control={<Radio />} label="VNPAY" />
                                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery (COD)" />
                            </RadioGroup>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ padding: "20px" }}>
                            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                                Order Summary
                            </Typography>
                            <Divider sx={{ marginBottom: "10px" }} />
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : products.length > 0 ? (
                                <>
                                    {products.map((product) => (
                                        <Box display="flex" justifyContent="space-between" key={product.id} sx={{ marginBottom: "10px" }}>
                                            <Typography>{product.title} (x{product.quantity})</Typography>
                                            <Typography>{(product.price * product.quantity).toLocaleString()} VND</Typography>
                                        </Box>
                                    ))}
                                    <Divider sx={{ marginBottom: "10px" }} />
                                    <Typography variant="h6">Total: {totalPrice.toLocaleString()} VND</Typography>
                                </>
                            ) : (
                                <Typography>Cart is empty</Typography>
                            )}
                            <Button disabled={!isAddressValid}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: "20px" }}
                                onClick={handleOpenConfirmDialog}
                            >
                                {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Đặt hàng"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to place this order?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog} color="primary">
                            Huỷ
                        </Button>
                        <Button onClick={handleConfirmOrder} color="primary" autoFocus>
                            {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Đặt hàng"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Suspense>
    );
};

export default Checkout;
