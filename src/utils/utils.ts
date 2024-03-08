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
        width: '120%',
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
