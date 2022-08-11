import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { connect_mysql } from "./mysql.ts";

const port = 8000;
const app = new Application();
const router = new Router();


// handle mysql queries from client
router.post("/mysql", async (ctx: Context) => {
    const body = await ctx.request.body({type: "json"}).value; // {conn, query}

    const conn_details = body["conn"]; // {id, name, database, host, user, type, password}
    const query: string = body["query"]; // some string

    try {
        // connect to mysql database
        const client: Client = await connect_mysql(conn_details);

        // run query
        const exec_result = await client.execute(query);

        // return results
        ctx.response.status = 200;
        ctx.response.body = exec_result;

    } catch (error: any) {
        const err = error as Error;
        if (err.message.startsWith("Access denied")) {
            ctx.response.status = 401;
        }
        else {
            ctx.response.status = 400;
        }
    }
});


// handle postgresql queries from client
// ...


app.use(router.routes());
app.use(router.allowedMethods());
app.listen({port});
