import { StylesConfig } from "react-select";

export default function calculateTotalPrice(services: string): number {
    const parsedServices = JSON.parse(services);
    const totalPrice = parsedServices.reduce((acc: number, service: any) => acc + service.price, 0);
    return totalPrice;
}

interface Option {
    value: string;
    price?: number;
    label: string;
}

export const customStyles: StylesConfig<Option, false> = {
    container: (provided) => ({
        ...provided,
        position: 'relative',
        border: '2px solid #1b1f29',
        borderRadius: '5px',
        outline: 'none',
        fontSize: ".8rem",
    }),
    control: () => ({
        display: "flex",
        borderRadius: '5px',
        outline: 'none',
    }),
    menu: (provided) => ({
        ...provided,
        position: 'absolute',
        top: '90%',
        left: '50%',
        transform: "translate(-50%, 0)",
        width: '150%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxHeight: "150px",
        overflowY: "hidden",
        border: '2px solid #1b1f29',
        borderRadius: "5px",
    }),
    option: (provided, { isSelected }: { isSelected: boolean }) => ({
        ...provided,
        color: isSelected ? '#fff' : '#1b1f29',
        backgroundColor: isSelected ? '#1b1f29' : '#fff',
        border: '2px solid #1b1f29',
        borderRadius: '5px',
        marginTop: '.25em',
        marginRight: '.25em',
        cursor: 'pointer',
    }),
};


export const customStylesV2: StylesConfig<Option, false> = {
    container: (provided) => ({
        ...provided,
        position: 'relative',
        border: '2px solid #1b1f29',
        borderRadius: '5px',
        outline: 'none',
        fontSize: ".8rem",
    }),
    control: () => ({
        display: "flex",
        borderRadius: '5px',
        outline: 'none',
    }),
    menu: (provided) => ({
        ...provided,
        position: 'absolute',
        top: '90%',
        left: '50%',
        transform: "translate(-50%, 0)",
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxHeight: "150px",
        overflowY: "auto",
        border: '2px solid #1b1f29',
        padding: '5px',
        borderRadius: "5px",
    }),
    option: (provided, { isSelected }: { isSelected: boolean }) => ({
        ...provided,
        color: isSelected ? '#fff' : '#1b1f29',
        backgroundColor: isSelected ? '#1b1f29' : '#fff',
        border: '2px solid #1b1f29',
        borderRadius: '5px',
        marginTop: '.25em',
        cursor: 'pointer',
    }),
};

export function dataURLtoBlob(dataURL: string) {
    console.log(dataURL)
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];

    try {
        const base64String = parts[1];
        console.log("Base64 String:", base64String);

        const decodedData = atob(base64String);
        const rawLength = decodedData.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = decodedData.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    } catch (error) {
        console.error("Error decoding base64 string:", error);
        throw new Error("Failed to decode base64 string");
    }
}