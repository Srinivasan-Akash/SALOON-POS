// DataContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { customerCollection, databaseID, databases, invoiceCollection } from '../appwrite/config';

interface Invoice {
    id: number;
    customerName: string;
    amount: number;
}

interface Customer {
    name: string;
    phone: string;
    gmail: string;
    $id: string;
}

interface DataContextProps {
    invoices: Invoice[];
    customers: Customer[];
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

    useEffect(() => {
        const fetchInvoicesData = async () => {
            try {
                const invoiceResponse: any = await databases.listDocuments(databaseID, invoiceCollection);
                const invoiceData: Invoice[] = invoiceResponse.documents;
                setInvoices(invoiceData);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data');
            }
        };

        const fetchCustomerData = async () => {
            try {
                const customerResponse: any = await databases.listDocuments(databaseID, customerCollection);
                const customerData: Customer[] = customerResponse.documents;
                setCustomers(customerData);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data');
            }
        };

        fetchCustomerData()
        fetchInvoicesData();
    }, []);

    return <DataContext.Provider value={{ invoices, customers }}>{children}</DataContext.Provider>;
};

