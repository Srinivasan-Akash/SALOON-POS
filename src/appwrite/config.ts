import { Account, Databases, Client, Storage } from "appwrite";

const client = new Client();
client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('65db0d79644a07a03751');

export const account = new Account(client)
export const databases = new Databases(client);
export const storage = new Storage(client);
export const projectId = "65db0d79644a07a03751"

export const databaseID = "65dffc2a989e2a914a6c"
export const customerCollection = "65e051ecdbe1c4094d09"
export const invoiceCollection = "65e043578f69e288f5d5"
export const servicesCollection = "65e01b67e07c4ebcbe3a"
export const expensesCollection = "65ede5db9add54dc0881"
export const inventoryCollection = "65e479f4a71fe05211f3"
export const invoicesBucket = "65ed39277c0abb68df7a"

// export const whatsapp_endpoint = "http://localhost:3000"
export const whatsapp_endpoint = "https://cooperative-volleyball-production.up.railway.app"