import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlLimaTitikDuaHeader = databaseSIRS.define('rl_lima_titik_dua', 
    {
        rs_id: {
            type: DataTypes.STRING
        },
        tahun: {
            type: DataTypes.DATE
        },
        user_id: {
            type: DataTypes.INTEGER
        },
    }
)

export const rlLimaTitikDuaDetail = databaseSIRS.define('rl_lima_titik_dua_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.DATE
    },
    rl_lima_titik_dua_id: {
        type: DataTypes.INTEGER
    },
    jenis_kegiatan_id: {
        type: DataTypes.INTEGER
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    }
})

export const jenisKegiatan = databaseSIRS.define('jenis_kegiatan', 
    {
        nama: {
            type: DataTypes.STRING
        },
    }
)


rlLimaTitikDuaHeader.hasMany(rlLimaTitikDuaDetail, {
    foreignKey:'rl_lima_titik_dua_id'
})
rlLimaTitikDuaDetail.belongsTo(rlLimaTitikDuaHeader, {
    foreignKey:'id'
})

jenisKegiatan.hasMany(rlLimaTitikDuaDetail, {
    foreignKey:'id'
})
rlLimaTitikDuaDetail.belongsTo(jenisKegiatan, {
    foreignKey:'jenis_kegiatan_id'
})