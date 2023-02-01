import { DataTypes, QueryTypes } from "sequelize"
import {databaseSIRS} from "../config/Database.js"

export const rlTigaTitikDuaHeader = databaseSIRS.define('rl_tiga_titik_dua', 
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

export const rlTigaTitikDuaDetail = databaseSIRS.define('rl_tiga_titik_dua_detail',{
    rl_tiga_titik_dua_id: {
        type: DataTypes.INTEGER
    },
    rs_id: {
        type: DataTypes.INTEGER
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    jenis_pelayanan_id: {
        type: DataTypes.INTEGER
    },
    total_pasien_rujukan: {
        type: DataTypes.INTEGER
    },
    total_pasien_non_rujukan: {
        type: DataTypes.INTEGER
    },
    tindak_lanjut_pelayanan_dirawat: {
        type: DataTypes.INTEGER
    },
    tindak_lanjut_pelayanan_dirujuk: {
        type: DataTypes.INTEGER
    },
    tindak_lanjut_pelayanan_pulang: {
        type: DataTypes.INTEGER
    },
    mati_di_ugd: {
        type: DataTypes.INTEGER
    },
    doa: {
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
        no: {
            type: DataTypes.NUMBER
        },
    }
)


rlTigaTitikDuaHeader.hasMany(rlTigaTitikDuaDetail, {
    foreignKey:'rl_tiga_titik_dua_id'
})
rlTigaTitikDuaDetail.belongsTo(rlTigaTitikDuaHeader, {
    foreignKey:'id'
})

jenisPelayanan.hasMany(rlTigaTitikDuaDetail, {
    foreignKey:'id'
})
rlTigaTitikDuaDetail.belongsTo(jenisPelayanan, {
    foreignKey:'jenis_pelayanan_id'
})