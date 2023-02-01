import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS }  from "../config/Database.js"

export const caraPembayaran = databaseSIRS.define('cara_pembayaran', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rl_id: {
        type: DataTypes.INTEGER
    },
    no: {
        type: DataTypes.STRING
    },
    nama: {
        type: DataTypes.STRING
    }
})

export const RL = databaseSIRS.define('rl', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true
    },
    nama: {
        type: DataTypes.STRING
    }
})

RL.hasMany(caraPembayaran, {foreignKey:'id'})
caraPembayaran.belongsTo(RL, {foreignKey:'rl_tiga_titik_lima_belas_id'})