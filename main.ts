import { existsSync } from "https://deno.land/std@0.104.0/fs/exists.ts";
import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { connect_mysql } from "./mysql.ts";
import { connect_postgres } from './postgres.ts';
import { delete_connection, get_connections, update_connection } from "./user_connections.ts";

const port = 8000;
const file_path = "./connections.json";
const app = new Application();
const router = new Router();


// serve react app (frontend)


// create connections.json if not exists
const exists: boolean = existsSync(file_path);
if (!exists) {
    Deno.create(file_path);
    Deno.writeTextFile(file_path, JSON.stringify([]));
    console.log("created file")
}


// handle mysql queries from client
router.post("/mysql", async (ctx: Context) => {
    const body = await ctx.request.body({type: "json"}).value; // {conn, query}

    const conn_details = body["conn"]; // {id, name, database, host, user, type, password}
    const query: string = body["query"]; // some string

    try {
        // connect and execute
        const client: Client = await connect_mysql(conn_details);
        const exec_result = await client.execute(query);

        // return results
        ctx.response.status = 200;
        ctx.response.body = {affectedRows: exec_result.affectedRows, rows: exec_result.rows};

    } catch (error: any) {
        const err = error as Error;
        if (err.message.startsWith("Access denied")) {
            ctx.response.status = 401;
        }
        else {
            ctx.response.status = 400;
            ctx.response.body = err.message;
        }
    }
});


// handle postgresql queries from client
router.post("/postgres", async (ctx: Context) => {
    const body = await ctx.request.body({type: "json"}).value; // {conn, query}

    const conn_details = body["conn"]; // {id, name, database, host, user, type, password}
    const query: string = body["query"]; // some string

    try {
        // connect and execute
        const client = await connect_postgres(conn_details);
        const exec_result = await client.queryArray<[string, string]>(query);

        // get column names
        const column_names: string[] = [];
        exec_result.rowDescription?.columns.forEach(col => {
            column_names.push(col.name);
        });

        // return results
        ctx.response.status = 200;
        ctx.response.body = {affectedRows: exec_result.rowCount, rows: exec_result.rows, colNames: column_names};

    } catch (error: any) {
        const err = error as Error;
        if (err.message.startsWith("role")) {
            ctx.response.status = 401;
        }
        else {
            ctx.response.status = 400;
            ctx.response.body = err.message;
        }
    }
});

// get all user connections
router.get("/connections", get_connections);

// delete connection
router.delete("/connections/:id", delete_connection);

// update connection, add if not exists
router.put("/connections/:id", update_connection);

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({port});
