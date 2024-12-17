'use client'
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/url";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Divider,
} from "@mui/material";

interface Address {
    id: number;
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    status: string;
    nameDelivery: string;
    phoneNumberDelivery: string;
}

const AddressList: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [houseNumber, setHouseNumber] = useState("");
    const [street, setStreet] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [nameDelivery, setNameDelivery] = useState("");
    const [phoneNumberDelivery, setPhoneNumberDelivery] = useState("");

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/api/address/get-address`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tải địa chỉ. Bạn cần thêm địa chỉ mới.");
            }

            const data = await response.json();
            setAddresses(data.data || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddClick = () => {
        setIsEditMode(false);
        setSelectedAddress(null);
        setHouseNumber("");
        setStreet("");
        setDistrict("");
        setCity("");
        setNameDelivery("");
        setPhoneNumberDelivery("");
        setOpen(true);
    };

    const handleEditClick = (address: Address) => {
        setIsEditMode(true);
        setSelectedAddress(address);
        setHouseNumber(address.houseNumber);
        setStreet(address.street);
        setDistrict(address.district);
        setCity(address.city);
        setNameDelivery(address.nameDelivery);
        setPhoneNumberDelivery(address.phoneNumberDelivery);
        setOpen(true);
    };

    const handleDeleteClick = (address: Address) => {
        setSelectedAddress(address);
        setOpenDeleteConfirm(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAddress(null);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
        setSelectedAddress(null);
    };

    const handleUpdateAddress = async () => {
        const token = localStorage.getItem("accessToken");
        if (selectedAddress) {
            const updatedAddress = {
                ...selectedAddress,
                houseNumber,
                street,
                district,
                city,
                nameDelivery,
                phoneNumberDelivery,
            };

            try {
                await fetch(`${API_URL}/api/address/update/${selectedAddress.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedAddress),
                });
                await fetchAddresses();
                handleClose();
            } catch (error) {
                console.error("Lỗi khi cập nhật địa chỉ", error);
            }
        }
    };

    const handleCreateAddress = async () => {
        const token = localStorage.getItem("accessToken");
        const newAddress = {
            houseNumber,
            street,
            district,
            city,
            status: "NORMAL",
            nameDelivery,
            phoneNumberDelivery,
        };

        try {
            await fetch(`${API_URL}/api/address/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newAddress),
            });
            await fetchAddresses();
            handleClose();
        } catch (error) {
            console.error("Lỗi khi tạo địa chỉ", error);
        }
    };

    const handleDeleteAddress = async () => {
        const token = localStorage.getItem("accessToken");
        if (selectedAddress) {
            try {
                await fetch(`${API_URL}/api/address/delete/${selectedAddress.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                await fetchAddresses();
                handleCloseDeleteConfirm();
            } catch (error) {
                console.error("Lỗi khi xóa địa chỉ", error);
            }
        }
    };

    const handleSave = async () => {
        if (isEditMode) {
            await handleUpdateAddress();
        } else {
            await handleCreateAddress();
        }
    };

    const handleSetDefaultStatus = async (address: Address) => {
        const token = localStorage.getItem("accessToken");
        if (address.status !== "DEFAULT") {
            try {
                await fetch(`${API_URL}/api/address/set-default/${address.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                await fetchAddresses();
            } catch (error) {
                console.error("Lỗi khi thiết lập địa chỉ mặc định", error);
            }
        }
    };

    return (
        <Box sx={{ padding: "1px", width: "900px", margin: "0 auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Danh sách địa chỉ
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAddClick}>
                    Thêm địa chỉ
                </Button>
            </Box>
            <Paper sx={{ padding: "20px" }}>
                {loading ? (
                    <Typography>Đang tải...</Typography>
                ) : error ? (
                    <Typography color="error">Lỗi: {error}</Typography>
                ) : (
                    <List sx={{ width: '100%', maxWidth: 900, bgcolor: 'background.paper', padding: 2 }}>
                        {addresses.map((address, index) => (
                            <div key={address.id}>
                                <ListItem>
                                    <Box>
                                        <ListItemText
                                            primary={`${address.nameDelivery} ${address.phoneNumberDelivery}`}
                                            secondary={[address.houseNumber, address.street, address.district, address.city].filter(Boolean).join(", ")}
                                        />
                                        <ListItemText
                                            secondary={address.status === 'DEFAULT' ? "Trạng thái: mặc định" : undefined}
                                        />
                                    </Box>
                                    <ListItemSecondaryAction sx={{ marginRight: 0, marginBottom: 1, backgroundColor: 'lightgray', borderRadius: 1 }}>
                                        <Button variant="outlined" color="primary" onClick={() => handleEditClick(address)}>
                                            Chỉnh sửa
                                        </Button>
                                        <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }} onClick={() => handleDeleteClick(address)} disabled={address.status === 'DEFAULT'}>
                                            Xóa
                                        </Button>
                                        <Button variant="outlined" color="success" sx={{ marginLeft: 1 }} onClick={() => handleSetDefaultStatus(address)} disabled={address.status === 'DEFAULT'}>
                                            Thiết lập mặc định
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < addresses.length - 1 && <Divider />}
                            </div>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Dialog for Add/Edit Address */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Họ và tên người nhận" fullWidth value={nameDelivery} onChange={(e) => setNameDelivery(e.target.value)} />
                    <TextField margin="dense" label="Sdt người nhận" fullWidth value={phoneNumberDelivery} onChange={(e) => setPhoneNumberDelivery(e.target.value)} />
                    <TextField margin="dense" label="Số nhà" fullWidth value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
                    <TextField margin="dense" label="Đường" fullWidth value={street} onChange={(e) => setStreet(e.target.value)} />
                    <TextField margin="dense" label="Quận/Huyện" fullWidth value={district} onChange={(e) => setDistrict(e.target.value)} />
                    <TextField margin="dense" label="Tỉnh/Thành phố" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Delete Address Confirmation */}
            <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa địa chỉ này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteAddress} color="secondary">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddressList;
