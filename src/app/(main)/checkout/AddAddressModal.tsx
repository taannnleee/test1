import React, { useState } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
import { API_URL } from "../../config/url";
import { toast } from 'react-toastify';
interface Address {
    fullName: string;
    phone: string;
    numberHours: string;
    street: string;
    district: string;
    city: string;
    isDefault: boolean;
}

interface AddAddressModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAddresses: () => void;  // Function to fetch the updated address list
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    fetchAddresses,
}) => {
    const [formData, setFormData] = useState<Address>({
        fullName: "",
        phone: "",
        numberHours: "",
        street: "",
        district: "",
        city: "",
        isDefault: false,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateAddress = async () => {
        const token = localStorage.getItem("accessToken");
        const newAddress = {
            houseNumber: formData.numberHours,
            street: formData.street,
            district: formData.district,
            city: formData.city,
            status: "NORMAL",
            nameDelivery: formData.fullName,
            phoneNumberDelivery: formData.phone,
        };

        setLoading(true);
        try {
            await fetch(`${API_URL}/api/address/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newAddress),
            });
            // toast.sendToast("Success", "Thêm địa chỉ thành công");
            toast.success("Thêm địa chỉ thành công", {
                position: "top-right",  // Định vị trí của Toast
                autoClose: 3000,        // Thời gian tự động đóng
            });
            setIsModalOpen(false);  // Close the modal

        } catch (error) {
            console.error("Error creating address", error);
        } finally {
            setLoading(false);  // Reset loading state
        }
    };

    const handleSubmit = () => {
        handleCreateAddress();  // Call API on submit
    };

    const handleModalClose = () => {
        setIsModalOpen(false);  // Close modal without adding
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "block" : "hidden"
                }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h3>
                <form className="space-y-4">
                    <TextField
                        label="Họ tên"
                        fullWidth
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số nhà"
                        fullWidth
                        name="numberHours"
                        value={formData.numberHours}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Đường"
                        fullWidth
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Quận / Huyện"
                        fullWidth
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Tỉnh / Thành phố"
                        fullWidth
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />

                    <div className="flex justify-between mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}  // Disable button when loading
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? "Đang thêm..." : "Thêm"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleModalClose}
                            disabled={loading}  // Disable close button when loading
                        >
                            Hủy
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
