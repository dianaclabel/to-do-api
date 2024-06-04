import { dbQuery, pool } from "../db";

await dbQuery("DROP TABLE IF EXISTS tasks");
await dbQuery(`
CREATE TABLE tasks ( 
	id char(36) primary key,
    task varchar(100),
    done  tinyint default 0,
    created_at datetime default now()
)`);

await dbQuery(
  `INSERT INTO tasks (id,task, done) values ( "9d091274-4d79-41a4-a9b5-402df7e81ba3","Pasear con mis perros", 0)`
);

await pool.end();
console.log("fin");
process.exit();
