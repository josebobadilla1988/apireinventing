const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // para traer todos los usuarios
    app.get("/api/users", async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const query = `SELECT * from fwconacc.tbusuari`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            // con esto muestro msj
            res.json({ res: 'ok', message: "Session cerrada correctamente", user }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para agregar un usuario
    app.post("/api/users", async (req, res, next) => {
        try {
            const idUsuer = req.body.id;
            const noUsuer = req.body.name;
            const query = `SELECT * from fwconacc.tbusuari where co_usuari = ${idUsuer} and no_usuari = '${noUsuer}'`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            // con esto muestro msj
            res.json({ res: 'ok', message: "Session cerrada correctamente", user }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para actualizar usuarios
    app.put("/api/users", async (req, res, next) => {
        try {
            const idUsuer = req.body.id;
            const query = `select * from fwconacc.tbusuari(${idUsuer})`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            // con esto muestro msj
            res.json({ res: 'ok', message: "Session cerrada correctamente", user }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para borrar
    app.delete("/api/users", async (req, res, next) => {
        try {
            const idUsuer = req.body.id;
            const noUsuer = req.body.name;
            const query = `SELECT * from fwconacc.tbusuari where co_usuari = ${idUsuer} and no_usuari = '${noUsuer}'`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            // con esto muestro msj
            res.json({ res: 'ok', message: "Session cerrada correctamente", user }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })



}