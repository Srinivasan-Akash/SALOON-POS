// DataContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { customerCollection, databaseID, databases, inventoryCollection, invoiceCollection } from '../appwrite/config';
import { Query } from 'appwrite';

interface Invoice {
    id: number;
    customerName: string;
    amount: number;
    status: boolean;
    services: string; // Define the structure of your services data
    $updatedAt: string;
}

interface Customer {
    id: string;
    name: string;
    gmail: string;
    phone: string;
    $id: string;
    lifeTimeBilling: number;
    credits: number;
}

interface Inventory {
    id: string;
    name: string;
    gmail: string;
    phone: string;
    $id: string;
    lifeTimeBilling: number;
    credits: number;
}

interface DataContextProps {
    invoices: Invoice[];
    customers: Customer[];
    filterCustomers: (searchInput: string) => void;
    reFetch: (dataType: 'customers' | 'invoices') => void;
    intialLoading: { invoices: boolean; customers: boolean };
    inventory: any
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useDataContext = (): DataContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
};

interface DataContextProviderProps {
    children: ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventory, setInventory] = useState<Inventory []>()


    const [intialLoading, setIntialLoading] = useState<{ invoices: boolean; customers: boolean, inventory: boolean }>({
        invoices: false,
        customers: false,
        inventory: false
    });

    const fetchInvoicesData = async () => {
        try {
            setIntialLoading((prevLoading) => ({ ...prevLoading, invoices: true }));

            const invoiceResponse: any = await databases.listDocuments(databaseID, invoiceCollection);
            const invoiceData: Invoice[] = invoiceResponse.documents;

            setInvoices(invoiceData);
        } catch (error) {
            console.error('Error fetching invoices data:', error);
            alert('Error fetching invoices data');
        } finally {
            setIntialLoading((prevLoading) => ({ ...prevLoading, invoices: false }));
        }
    };

    const fetchCustomerData = async () => {
        try {
            setIntialLoading((prevLoading) => ({ ...prevLoading, customers: true }));

            const customerResponse: any = await databases.listDocuments(databaseID, customerCollection);
            const customerData: Customer[] = customerResponse.documents;

            setCustomers(customerData);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            alert('Error fetching customer data');
        } finally {
            setIntialLoading((prevLoading) => ({ ...prevLoading, customers: false }));
        }
    };

    const fetchInventoryData = async () => {
        try {
            setIntialLoading((prevLoading) => ({ ...prevLoading, inventory: true }));

            const inventoryResponse: any = await databases.listDocuments(databaseID, inventoryCollection);
            const inventoryData: Customer[] = inventoryResponse.documents;
            console.log(inventoryResponse, inventoryData)
            setInventory(inventoryData);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            alert('Error fetching inventory data');
        } finally {
            setIntialLoading((prevLoading) => ({ ...prevLoading, customers: false }));
        }
    };


    useEffect(() => {
        fetchInvoicesData();
        fetchCustomerData();
        fetchInventoryData();
    }, [])

    const filterCustomers = async (searchInput: string) => {
        let searchIndex: string = '';

        switch (true) {
            case /^\d{1,}$/.test(searchInput):
                searchIndex = 'phone';
                break;
            case /^[a-zA-Z\s]+$/.test(searchInput):
                searchIndex = 'name';
                break;
            case /@gmail\.com$/.test(searchInput):
                searchIndex = 'gmail';
                break;
            default:
                alert('Invalid input');
                return;
        }

        try {
            const response = await databases.listDocuments(
                databaseID,
                customerCollection,
                [Query.search(searchIndex, searchInput)]
            );

            const data: any = response.documents;
            console.log(data, searchInput);
            setCustomers(data);
        } catch (error) {
            console.error('Error searching for customers:', error);
            alert('Error searching for customers');
        }
    };

    const reFetch = (dataType: 'customers' | 'invoices' | 'inventory') => {
        switch (dataType) {
            case 'customers':
                fetchCustomerData();
                break;
            case 'invoices':
                fetchInvoicesData();
                break;
            case 'inventory':
                fetchInvoicesData();
                break;
            // Add more cases for other data types if needed
            default:
                console.error('Invalid data type for reFetch');
                break;
        }
    };

    return <DataContext.Provider value={{ invoices, customers, inventory, filterCustomers, reFetch, intialLoading }}>{children}</DataContext.Provider>;
};

