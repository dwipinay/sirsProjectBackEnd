import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS }  from "../config/Database.js"

export const icd10 = databaseSIRS.define('icd_10', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING     
    }
}, {
    freezeTableName: true
})