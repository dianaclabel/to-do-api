import { serve } from "bun";
import { withCors } from "./utils/cors";
import { dbQuery } from "./db";

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return withCors(new Response());
    }

    // #region GET /contactos
    if (req.method === "GET" && url.pathname === "/tasks") {
      try {
        const rows = await dbQuery("SELECT * FROM `tasks`");
        return withCors(Response.json(rows));
      } catch (err) {
        console.log(err);
        return withCors(new Response("Error al leer la bd", { status: 500 }));
      }
    }

    // #region POST /agregar-contacto
    if (req.method === "POST" && url.pathname === "/agregar-task") {
      const data = await req.formData();
      const tarea = data.get("task") as string;
      const id = crypto.randomUUID();

      try {
        await dbQuery("INSERT INTO tasks (id,task, done) values (?, ?, ?)", [
          id,
          tarea,
          0,
        ]);

        return withCors(new Response("Tarea creada", { status: 201 }));
      } catch (error) {
        console.error(error);
        return withCors(
          new Response("Error en la consulta hacia la bd", { status: 500 })
        );
      }
    }

    // #region DELETE /borrar-task?contacto-id=123
    if (req.method === "DELETE" && url.pathname === "/borrar-task") {
      const taskId = url.searchParams.get("id");

      if (!taskId) {
        return withCors(
          new Response("El id en el parámetro es requerido", { status: 400 })
        );
      }

      try {
        await dbQuery("DELETE FROM tasks  WHERE id = ?", [taskId]);
        return withCors(new Response("task eliminado", { status: 204 }));
      } catch (error) {
        console.log(error);
        return withCors(
          new Response("Error al intentar eliminar el tarea de la bd", {
            status: 500,
          })
        );
      }
    }

    return withCors(Response.json({ message: "Not found" }, { status: 404 }));
  },
});
