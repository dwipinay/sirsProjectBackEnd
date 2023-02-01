import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS }  from "../config/Database.js"

export const jenisSpesialis = databaseSIRS.define('jenis_spesialisasi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rl_id: {
        type: DataTypes.INTEGER
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

RL.hasMany(jenisSpesialis, {foreignKey:'id'})
jenisSpesialis.belongsTo(RL, {foreignKey:'rl_tiga_titik_enam_id'})