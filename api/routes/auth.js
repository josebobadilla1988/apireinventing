var bcrypt = require('bcrypt');
const BD = require("../database/pg/postgres");

module.exports = async (app) => {
    app.post("/api/login", async (req, res, next) => {

        var email = req.body.email,
            password = req.body.password;

        const query = `SELECT * FROM public.users where email = '${email}'`;
        const user = await BD.storePostgresql(query);
        if (!user) {
            res.json({ res: "ko", message: "El usuario no se ha identificado" }).status(404)
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    req.session.userID = user.id
                    req.session.username = user.username
                    req.session.email = user.email
                    req.session.logged = true
                    delete user.password
                    res.json({ res: 'ok', message: "Wellcome", user }).status(200)
                } else {
                    res.json({ res: 'ko', message: "Password Incorrecto", user, result, err }).status(400)
                }
            })
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