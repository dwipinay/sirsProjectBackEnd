import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";


export const rlTigaTitikEnamHeader = databaseSIRS.define('rl_tiga_titik_enam', 
    {
        rs_id:{
            type: DataTypes.STRING
        },
        tahun:{
            type: DataTypes.INTEGER
        },
        user_id:{
            type: DataTypes.INTEGER
        }
    }
)

export const rlTigaTitikEnamDetail = databaseSIRS.define('rl_tiga_titik_enam_detail', 
    {
        rl_tiga_titik_enam_id:{
            type: DataTypes.INTEGER
        },
        rs_id: {
            type: DataTypes.STRING
        },
        tahun: {
            type: DataTypes.INTEGER
        },
        jenis_spesialis_id:{
            type: DataTypes.INTEGER
        },
        total:{
            type: DataTypes.INTEGER
        },
        khusus:{
            type: DataTypes.INTEGER
        },
        besar:{
            type: DataTypes.INTEGER
        },
        sedang:{
            type: DataTypes.INTEGER
        },
        kecil:{
            type: DataTypes.INTEGER
        },
        user_id:{
            type: DataTypes.INTEGER
        }
    }
)

export const rlTigaTItikEnamSpesialis = databaseSIRS.define('jenis_spesialisasi', 
    {
        rl_id:{
            type: DataTypes.INTEGER
        },
        no:{
            type: DataTypes.INTEGER
        },
        nama:{
            type: DataTypes.STRING
        }
    }
)

rlTigaTitikEnamHeader.hasMany(rlTigaTitikEnamDetail, {foreignKey:'rl_tiga_titik_enam_id'})
rlTigaTitikEnamDetail.belongsTo(rlTigaTitikEnamHeader, {foreignKey:'id'})

rlTigaTItikEnamSpesialis.hasMany(rlTigaTitikEnamDetail, {foreignKey:'id'})
rlTigaTitikEnamDetail.belongsTo(rlTigaTItikEnamSpesialis, {foreignKey:'jenis_spesialis_id'})
