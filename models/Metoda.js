import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS }  from "../config/Database.js"

export const metoda = databaseSIRS.define('metoda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rl_id: {
        type: DataTypes.INTEGER     
    },
    no: {
        type: DataTypes.INTEGER
    },
    nama: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})