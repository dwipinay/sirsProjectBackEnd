import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const jenisGroupTindakanHeader = databaseSIRS.define('group_jenis_tindakan_header', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nama:{
        type: DataTypes.STRING
    },    
    rl_id: {
        type: DataTypes.INTEGER
    },
})

export const jenisGroupTindakan = databaseSIRS.define('group_jenis_tindakan', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    group_jenis_tindakan_header_id: {
        type: DataTypes.INTEGER,
    },
    no:{
        type: DataTypes.STRING
    },
    nama:{
        type: DataTypes.STRING
    }, 
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

RL.hasMany(jenisGroupTindakanHeader, {foreignKey: 'id'})
jenisGroupTindakanHeader.belongsTo(RL, {foreignKey:'rl_id'})


jenisGroupTindakanHeader.hasMany(jenisGroupTindakan, {foreignKey: 'id'})
jenisGroupTindakan.belongsTo(jenisGroupTindakanHeader, {foreignKey: 'group_jenis_tindakan_header_id'})