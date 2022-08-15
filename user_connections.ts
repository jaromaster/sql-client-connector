import { Context } from "https://deno.land/x/oak@v10.6.0/mod.ts";

// supported database types
export enum DatabaseTypes {
    MYSQL = "MySQL",
    POSTGRES = "PostgreSQL"
}

// define fields of Connection
export interface Connection {
    id: string
    name: string
    host: string
    user: string
    password: string
    type: DatabaseTypes
    database: string
}

// read in all connections
const read_connections = async (file_path: string): Promise<any[]> => {
    const conn = await Deno.readTextFile(file_path);
    if (conn.length === 0) {
        return [];
    }
    return JSON.parse(conn);
}

// get all user connections
export const get_connections = async (ctx: Context) => {
    const file_path = "./connections.json";

    try {
        const json_connections = await read_connections(file_path);

        ctx.response.status = 200;
        ctx.response.body = json_connections;
    } catch (error) {
        const err: Error = error as Error;

        ctx.response.status = 500;
        ctx.response.body = err.message;
    }
}

// get all user connections
export const add_connection = async (ctx: Context) => {
    const file_path = "./connections.json";

    try {
        const json_connections = await read_connections(file_path);

        const json_connection = await ctx.request.body({type: "json"}).value;
        json_connections.push(json_connection);

        await Deno.writeTextFile(file_path, JSON.stringify(json_connections));

        ctx.response.status = 200;
    } catch (error) {
        const err: Error = error as Error;

        ctx.response.status = 500;
        ctx.response.body = err.message;
    }
}

// delete connection with id
export const delete_connection = async (ctx: any) => {
    const file_path = "./connections.json";
    const conn_id: number = ctx.params.id as number;

    try {
        const json_connections = await read_connections(file_path);

        for (let i = 0; i < json_connections.length; i++) {
            const conn = json_connections[i];

            if (conn.conn.id === conn_id) {
                json_connections.splice(i, 1);
            }
        }

        await Deno.writeTextFile(file_path, JSON.stringify(json_connections));

        ctx.response.status = 200;
    } catch (error) {
        ctx.response.status = 500;
    }
}