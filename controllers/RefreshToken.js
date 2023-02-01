import { users } from "../models/UserModel.js";
import jsonWebToken from 'jsonwebtoken'

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        res.status(403).json({
            status: false,
            message: 'Unauthorized'
        })
        return
    }
    users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    .then((results) => {
        if(!results[0]) {
            res.status(403).json({
                status: false,
                message: 'Unauthorized'
            })
            return
        }
        jsonWebToken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, jwtRes) => {
            if (err) return res.sendStatus(403)
            const payloadObject = {
                id: jwtRes.id,
                nama: jwtRes.nama,
                email: jwtRes.email,
                rsId: jwtRes.rsId
            }
            const accessToken = jsonWebToken.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
            res.json({ accessToken })
        })
    })
    .catch((err) => {
        res.status(404).send({
            status: false,
            message: err
        })
        return
    })
}