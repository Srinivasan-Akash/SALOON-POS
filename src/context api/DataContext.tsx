// DataContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { databaseID, databases, invoiceCollection } from '../appwrite/config';

interface Invoice {
  // Define the structure of your invoice data
  // For example:
  id: number;
  customerName: string;
  amount: number;
}

interface DataContextProps {
  invoices: Invoice[];
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
  // State to store the fetched invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Your data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this with your actual data fetching logic
        const invoiceResponse: any = await databases.listDocuments(databaseID, invoiceCollection);
        const invoiceData: Invoice[] = invoiceResponse.documents;
        setInvoices(invoiceData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data');
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs only once when the component mounts

  // Provide the fetched invoices through the context
  return <DataContext.Provider value={{ invoices }}>{children}</DataContext.Provider>;
};
