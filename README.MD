# SQL Client Connector

## Connect to relational databases

## Features:
- dark mode :)
- connect to database
- store connection
- run sql commands
- display query results
- store session
- error handling

## Supported Databases:
- MySQL
- PostgreSQL

## UI Repo:
[SQL Client](https://github.com/jaromaster/sql-client)

# UI:
![ui](./preview/ui.png "user interface")

# Error:
![error](./preview/error.png "example error")

# Add or edit:
![edit](./preview/add.png "add or edit connection")

# Build:
`git clone https://github.com/jaromaster/sql-client-connector.git`<br>
`git clone https://github.com/jaromaster/sql-client.git` (UI)<br>
In UI repo:<br>
`npm run build`<br>
Copy build-directory to cloned sql-client-connector and build it:<br>
`deno compile --allow-read --allow-write --allow-env --allow-net main.ts`<br>
Run:<br>
`./sql-client-connector`<br>
Access UI: <br>
`http://localhost:8000`