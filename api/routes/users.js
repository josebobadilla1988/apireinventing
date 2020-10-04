const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

module.exports = async (app) => {
    app.get("/api/users", async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const query = `SELECT * FROM public.users`;
            bitacora.control(query, req.url)
            const user = await BD.storePostgresql(query);
            res.json({ res: 'ok', message: "Session cerrada correctamente", user }).status(200)
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    app.post('/api/register', async (req, res) => {

    })

    app.post("/api/logout", async (req, res) => {

        req.session.userID = null
        req.session.username = null
        req.session.email = null
        req.session.logged = false
        res.json({ res: 'ok', message: "Session cerrada correctamente" }).status(200)

    })

}