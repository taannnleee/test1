import React, { useState, useEffect } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { toast } from 'react-toastify';
import { API_URL } from "../../config/url";
interface Address {
    id: string;
    fullName: string;
    phone: string;
    additionalInfo: string;
    street: string;
    district: string;
    city: string;
    isDefault: boolean;
}

interface UpdateAddressModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAddress: Address;
}

const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    selectedAddress,
}) => {

    const [formData, setFormData] = useState<Address>(selectedAddress);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(selectedAddress); // Update form data when selectedAddress changes
    }, [selectedAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateAddress = async () => {
        setLoading(true); // Set loading to true at the start of the API call
        const token = localStorage.getItem("accessToken");

        const updatedAddress = {
            houseNumber: formData.additionalInfo,
            street: formData.street,
            district: formData.district,
            city: formData.city,
            nameDelivery: formData.fullName,
            phoneNumberDelivery: formData.phone,
            status: formData.isDefault ? "DEFAULT" : "NORMAL",
        };

        try {
            const response = await fetch(`${API_URL}/api/address/update/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedAddress),
            });

            if (response.ok) {
                setIsModalOpen(false);
                // toast.sendToast("Success", "Cập nhật địa chỉ thành công");
                toast.success("Cập nhật địa chỉ thành công!", {
                    position: "top-right",  // Định vị trí của Toast
                    autoClose: 3000,        // Thời gian tự động đóng
                });
            } else {
                // toast.sendToast("Error", "Cập nhật địa chỉ thất bại");
                toast.success("Cập nhật địa chỉ thất bại", {
                    position: "top-right",  // Định vị trí của Toast
                    autoClose: 3000,        // Thời gian tự động đóng
                });
            }
        } catch (error) {
            console.error("Error updating address", error);
        } finally {
            setLoading(false); // Set loading to false after the API call completes
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "block" : "hidden"
                }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Cập nhật địa chỉ</h3>
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
                        name="additionalInfo"
                        value={formData.additionalInfo}
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
                        label="Quận/Huyện"
                        fullWidth
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Tỉnh/Thành phố"
                        fullWidth
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </form>
                <div className="mt-4 flex justify-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateAddress}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cập nhật"}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAddressModal;
