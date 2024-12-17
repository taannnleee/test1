import React, { useState, useEffect } from "react";
import { Button, Skeleton } from "@mui/material";
import AddAddressModal from './AddAddressModal';
import MyListAddressModal from "@/app/(main)/checkout/MyListAddressModal";
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

interface AddressSelectionProps {

    selectedAddressId: string;
    setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
    isAddressValid: boolean;
    setIsAddressValid: React.Dispatch<React.SetStateAction<boolean>>;

}

const AddressSelection: React.FC<AddressSelectionProps> = ({

    selectedAddressId,
    setSelectedAddressId,
    isAddressValid,
    setIsAddressValid
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [shippingInfo, setShippingInfoState] = useState<any>(null);


    const validateAddress = (address: Address) => {
        if (
            address &&
            address.street && address.street !== "" &&
            address.district && address.district !== "" &&
            address.city && address.city !== "" &&
            address.fullName && address.fullName !== "" &&
            address.phone && address.phone !== ""
        ) {
            setIsAddressValid(true);  // Cập nhật trực tiếp trạng thái là hợp lệ
        } else {
            setIsAddressValid(false);  // Cập nhật trạng thái là không hợp lệ
        }
    };


    const openAddModal = () => {
        setIsModalOpen(true);
        setIsListModalOpen(false);
    };

    const openListModal = () => {
        setIsListModalOpen(true);
        setIsModalOpen(false);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleAddressSelect = (address: Address) => {
        console.log("tan1111111")
        console.log(address.id)
        setShippingInfoState({
            fullName: address.fullName,
            phone: address.phone,
            address: {
                id: address.id,
                houseNumber: address.street,
                street: address.street,
                district: address.district,
                city: address.city,
                additionalInfo: address.additionalInfo
            }
        });

        setSelectedAddressId(address.id);

        setIsListModalOpen(false);
        validateAddress(address);
    };

    // Fetch the default address when component mounts
    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
                if (!accessToken) {
                    console.error("No access token found.");
                    return;
                }

                const response = await fetch(`${API_URL}/api/user/get-user-address-default`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                if (data.status === 200) {
                    const { id, houseNumber, street, district, city, nameDelivery, phoneNumberDelivery } = data.data;
                    const address = {
                        id,
                        houseNumber,
                        street,
                        district,
                        city,
                        additionalInfo: ""
                    };

                    // Set shipping info state
                    setShippingInfoState({
                        fullName: nameDelivery,
                        phone: phoneNumberDelivery,
                        address: address
                    });

                    // Set selected address ID
                    setSelectedAddressId(id);

                    // Validate the address after setting the shipping info
                    // validateAddress(address);
                } else {
                    console.error("Failed to fetch address:", data.message);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
            }
        };

        fetchDefaultAddress();
    }, []);

    return (
        <div className="p-5 bg-gray-300 rounded-lg shadow-md">
            {/* <div className="flex">
                <LocationOnIcon className="text-2xl text-red-500" />
                <h2 className="text-xl font-bold mb-4 mx-2 text-orange-600">Địa chỉ nhận hàng</h2>
            </div> */}

            {!shippingInfo ? (
                <div className="space-y-2">
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={60} />
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between w-full">
                        <p className="font-bold">
                            Họ và tên: {shippingInfo.fullName} - Số điện thoại  {shippingInfo.phone}
                        </p>
                        {shippingInfo.address.houseNumber && (
                            <p className="border border-solid border-[#ee4d2d] rounded-[1px] text-[#ee4d2d] text-[10px] leading-[12px] mt-0 mb-0 ml-[15px] px-[5px] py-[2px] capitalize text-sm font-semibold text-right">
                                Mặc định
                            </p>
                        )}
                    </div>
                    <p>
                        Tỉnh: {shippingInfo.address.city}, Huyện: {shippingInfo.address.district}, Đường: {shippingInfo.address.street}

                    </p>
                </div>

            )}

            <button
                onClick={openListModal}
                className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-200 bg-gray-500"
            >
                Chọn địa chỉ
            </button>

            {/* {isModalOpen && <AddAddressModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                addNewAddress={addNewAddress}
            />}

            {isListModalOpen && (
                <MyListAddressModal
                    addresses={addresses}
                    isModalOpen={isListModalOpen}
                    closeModal={() => setIsListModalOpen(false)}
                    onAddressSelect={handleAddressSelect}
                    openAddAddressModal={openAddModal}
                />
            )} */}
        </div>
    );
};

export default AddressSelection;
