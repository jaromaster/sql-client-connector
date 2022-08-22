import { Context } from "https://deno.land/x/oak/mod.ts";

// store content of worksheet as file
export const store_worksheet = async (ctx: Context) => {
    const file_path = "./worksheet.txt";
    const code = ctx.request.body({type: "text"});

    try {
        Deno.writeTextFile(file_path, await code.value);
        ctx.response.status = 200;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "could not persist worksheet content";
    }
}

// get content of worksheet
export const get_worksheet = async (ctx: Context) => {
    const file_path = "./worksheet.txt";

    try {
        const code = await Deno.readTextFile(file_path);
        ctx.response.status = 200;
        ctx.response.body = code;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "could not load worksheet content";
    }
}