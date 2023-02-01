import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const jenisTindakan = databaseSIRS.define('jenis_tindakan', {
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

RL.hasMany(jenisTindakan, {foreignKey:'id'})
jenisTindakan.belongsTo(RL, {foreignKey:'rl_tiga_titik_sembilan_id'})