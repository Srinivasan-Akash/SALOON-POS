// DataContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { customerCollection, databaseID, databases, inventoryCollection, invoiceCollection, servicesCollection } from '../appwrite/config';
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
    filterInventory: (searchInput: string) => void;
    reFetch: (dataType: 'customers' | 'invoices' | 'inventory' | 'services') => void;
    intialLoading: { invoices: boolean; customers: boolean };
    inventory: any;
    services: any;
    replenishedInventory: any;
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
    const [inventory, setInventory] = useState<Inventory []>();
    const [services, setServices] = useState<Inventory []>();
    const [replenishedInventory, setReplenishedInventory] = useState<Inventory []>();
    //   const filteredInventory = inventory.filter((product: any) => product.quantity < 5);


    const [intialLoading, setIntialLoading] = useState<{ invoices: boolean; customers: boolean, inventory: boolean, services: boolean }>({
        invoices: false,
        customers: false,
        inventory: false,
        services: false,
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
            setReplenishedInventory(inventoryData.filter((product: any) => product.quantity < 5));
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            alert('Error fetching inventory data');
        } finally {
            setIntialLoading((prevLoading) => ({ ...prevLoading, inventory: false }));  // Corrected line
        }
    };

    const fetchServicesData = async () => {
        try {
            setIntialLoading((prevLoading) => ({ ...prevLoading, services: true }));
    
            const servicesResponse: any = await databases.listDocuments(databaseID, servicesCollection);
            const servicesData: any[] = servicesResponse.documents;
            console.log(servicesResponse, servicesData);
            setServices(servicesData);  // Corrected line
        } catch (error) {
            console.error('Error fetching services data:', error);
            alert('Error fetching services data');
        } finally {
            setIntialLoading((prevLoading) => ({ ...prevLoading, services: false }));
        }
    };

    useEffect(() => {
        fetchInvoicesData();
        fetchCustomerData();
        fetchInventoryData();
        fetchServicesData();
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

    const filterInventory = async (searchInput: string) => {
        try {
            const response = await databases.listDocuments(
                databaseID,
                inventoryCollection,
                [Query.search("name", searchInput)]
            );

            const data: any = response.documents;
            console.log(data, searchInput);
            setInventory(data);
        } catch (error) {
            console.error('Error searching for customers:', error);
            alert('Error searching for customers');
        }
    };

    const reFetch = (dataType: 'customers' | 'invoices' | 'inventory' | 'services') => {
        switch (dataType) {
            case 'customers':
                fetchCustomerData();
                break;
            case 'invoices':
                fetchInvoicesData();
                break;
            case 'inventory':
                fetchInventoryData();
                break;
            case 'services':
                fetchServicesData();
                break;
            default:
                console.error('Invalid data type for reFetch');
                break;
        }
    };

    return <DataContext.Provider value={{ invoices, customers, inventory, filterCustomers, replenishedInventory, reFetch, intialLoading, filterInventory, services }}>{children}</DataContext.Provider>;
};

