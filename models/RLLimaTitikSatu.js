import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlLimaTitikSatuHeader = databaseSIRS.define('rl_lima_titik_satu', 
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

export const rlLimaTitikSatuDetail = databaseSIRS.define('rl_lima_titik_satu_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.DATE
    },
    rl_lima_titik_satu_id: {
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


rlLimaTitikSatuHeader.hasMany(rlLimaTitikSatuDetail, {
    foreignKey:'rl_lima_titik_satu_id'
})
rlLimaTitikSatuDetail.belongsTo(rlLimaTitikSatuHeader, {
    foreignKey:'id'
})

jenisKegiatan.hasMany(rlLimaTitikSatuDetail, {
    foreignKey:'id'
})
rlLimaTitikSatuDetail.belongsTo(jenisKegiatan, {
    foreignKey:'jenis_kegiatan_id'
})