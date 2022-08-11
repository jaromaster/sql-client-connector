import { Client } from "https://deno.land/x/mysql/mod.ts";

// connect to mysql database and return client
export const connect_mysql = async (conn_details: any): Promise<Client> => {
    const client = new Client();

    await client.connect({
        hostname: conn_details["host"],
        username: conn_details["user"],
        password: conn_details["password"],
        db: conn_details["database"]
    });

    return client;
};