import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlSatuTitikTigaHeader = databaseSIRS.define('rl_satu_titik_tiga', 
    {
        rs_id: {
            type: DataTypes.STRING
        },
        tahun: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
    }
)

export const rlSatuTitikTigaDetail = databaseSIRS.define('rl_satu_titik_tiga_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    rl_satu_titik_tiga_id: {
        type: DataTypes.INTEGER
    },
    jenis_pelayanan_id: {
        type: DataTypes.INTEGER
    },
    jumlah_tempat_tidur: {
        type: DataTypes.INTEGER
    },
    kelas_VVIP: {
        type: DataTypes.INTEGER
    },
    kelas_VIP: {
        type: DataTypes.INTEGER
    },
    kelas_1: {
        type: DataTypes.INTEGER
    },
    kelas_2: {
        type: DataTypes.INTEGER
    },
    kelas_3: {
        type: DataTypes.INTEGER
    },
    kelas_khusus: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    }
})

export const jenisPelayanan = databaseSIRS.define('jenis_pelayanan', 
    {
        nama: {
            type: DataTypes.STRING
        },
    }
)


rlSatuTitikTigaHeader.hasMany(rlSatuTitikTigaDetail, {
    foreignKey:'rl_satu_titik_tiga_id'
})
rlSatuTitikTigaDetail.belongsTo(rlSatuTitikTigaHeader, {
    foreignKey:'id'
})

jenisPelayanan.hasMany(rlSatuTitikTigaDetail, {
    foreignKey:'id'
})
rlSatuTitikTigaDetail.belongsTo(jenisPelayanan, {
    foreignKey:'jenis_pelayanan_id'
})