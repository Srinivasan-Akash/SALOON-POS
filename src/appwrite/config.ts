import { Account, Databases, Client } from "appwrite";

const client = new Client();
client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('65db0d79644a07a03751');

export const account = new Account(client)
export const databases = new Databases(client);

export const databaseID = "65dffc2a989e2a914a6c"
export const customerCollection = "65e051ecdbe1c4094d09"
export const invoiceCollection = "65e051ecdbe1c4094d09"
export const employeeCollection = "65e051ecdbe1c4094d09"
export const inventoryCollection = "65e051ecdbe1c4094d09"