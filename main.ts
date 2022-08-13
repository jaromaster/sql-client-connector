import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { connect_mysql } from "./mysql.ts";
import { connect_postgres } from './postgres.ts';

const port = 8000;
const app = new Application();
const router = new Router();


// serve react app (frontend)


// persist users connections in json file

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
        exec_result.rowDescription?.columns.map(col => {
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


app.use(router.routes());
app.use(router.allowedMethods());
app.listen({port});
