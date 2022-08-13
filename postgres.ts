import { Client } from "https://deno.land/x/postgres/mod.ts";

// connect to postgresql db and return client
export const connect_postgres = async (conn_details: any): Promise<Client> => {

    const client = new Client({
        user: conn_details["user"],
        password: conn_details["password"],
        database: conn_details["database"],
        hostname: conn_details["host"]
    });

    await client.connect();
    return client;
}