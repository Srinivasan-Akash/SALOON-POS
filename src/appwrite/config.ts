import { Client } from "appwrite";
import { Account } from "appwrite";

const client = new Client();
client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('65db0d79644a07a03751');

export const account = new Account(client)