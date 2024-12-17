import React, { useState, useEffect } from "react";
import { Button, Skeleton } from "@mui/material";
import UpdateAddressModal from "./UpdateAddressModal";
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

interface MyListAddressModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    openAddAddressModal: () => void;
    onAddressSelect: (address: Address) => void; // Specify type here
}

const MyListAddressModal: React.FC<MyListAddressModalProps> = ({
    isModalOpen,
    closeModal,
    openAddAddressModal,
    onAddressSelect, // Add onAddressSelect here
}) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    // Fetch addresses from the API
    const fetchAddresses = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/address/get-address`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await response.json();

            if (data.status === 200) {
                const fetchedAddresses = data.data.map((address: any) => ({
                    id: address.id,
                    fullName: address.nameDelivery || "",
                    phone: address.phoneNumberDelivery || "",
                    additionalInfo: "",
                    street: address.street,
                    district: address.district,
                    city: address.city,
                    isDefault: address.status === "DEFAULT",
                }));
                setAddresses(fetchedAddresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchAddresses();
        }
    }, [isModalOpen]);

    // Handler to select an address
    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
    };

    // Open the UpdateAddressModal when updating an address
    const handleUpdateClick = () => {
        setIsUpdateModalOpen(true);
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "block" : "hidden"}`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                {/* <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-4">Địa chỉ của tôi</h3>
                    <CachedIcon className="cursor-pointer" onClick={fetchAddresses} />
                </div> */}

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={120} />
                    ) : (
                        <ul className="list-disc pl-6">
                            {addresses.map((address, index) => (
                                <div key={index}>
                                    <li
                                        className={`cursor-pointer ${selectedAddress?.phone === address.phone ? "bg-gray-200" : ""}`}
                                        onClick={() => handleAddressSelect(address)}
                                    >
                                        <div className="flex justify-between">
                                            <p className="text-sm">{address.fullName}</p>
                                            <p className="text-sm">{address.phone}</p>
                                            <span
                                                className="text-blue-500 mr-2 cursor-pointer"
                                                onClick={handleUpdateClick} // Trigger update modal
                                            >
                                                Cập nhật
                                            </span>
                                        </div>
                                        <p className="text-sm">{address.additionalInfo}</p>
                                        <p className="text-sm">
                                            {address.street}, {address.district}, {address.city}
                                        </p>
                                        {address.isDefault && (
                                            <p className="border border-solid border-[#ee4d2d] rounded-[1px] text-[#ee4d2d] text-xs leading-[12px] mt-0 mb-0 ml-[15px] px-[5px] py-[2px] capitalize inline-block max-w-max text-center font-semibold">
                                                Mặc định
                                            </p>
                                        )}
                                    </li>
                                    <div className="border-b-2 border-black-500 my-4" />
                                </div>
                            ))}
                        </ul>
                    )}
                    <Button variant="contained" color="primary" onClick={openAddAddressModal}>
                        Thêm địa chỉ mới
                    </Button>
                </div>

                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => {
                            closeModal();
                            if (selectedAddress) {
                                onAddressSelect(selectedAddress); // Use onAddressSelect here
                            }
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => {
                            console.log("Cancel");
                            closeModal();

                        }}
                        className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </div>

            {/* Open the Update Address modal */}
            {isUpdateModalOpen && selectedAddress && (
                <UpdateAddressModal
                    isModalOpen={isUpdateModalOpen}
                    setIsModalOpen={setIsUpdateModalOpen}
                    selectedAddress={selectedAddress}
                />
            )}
        </div>
    );
};

export default MyListAddressModal;
