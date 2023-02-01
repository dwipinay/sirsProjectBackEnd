import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikSatuHeader = databaseSIRS.define('rl_tiga_titik_satu', 
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

export const rlTigaTitikSatuDetail = databaseSIRS.define('rl_tiga_titik_satu_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    rl_tiga_titik_satu_id: {
        type: DataTypes.INTEGER
    },
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    jenis_pelayanan_id: {
        type: DataTypes.INTEGER
    },
    jumlah_pasien_awal_tahun: {
        type: DataTypes.INTEGER
    },
    jumlah_pasien_masuk: {
        type: DataTypes.INTEGER
    },
    pasien_keluar_hidup: {
        type: DataTypes.INTEGER
    },
    kurang_dari_48_Jam: {
        type: DataTypes.INTEGER
    },
    lebih_dari_atau_sama_dengan_48_jam: {
        type: DataTypes.INTEGER
    },
    jumlah_lama_dirawat: {
        type: DataTypes.INTEGER
    },
    jumlah_pasien_akhir_tahun: {
        type: DataTypes.INTEGER
    },
    jumlah_hari_perawatan: {
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


rlTigaTitikSatuHeader.hasMany(rlTigaTitikSatuDetail, {
    foreignKey:'rl_tiga_titik_satu_id'
})
rlTigaTitikSatuDetail.belongsTo(rlTigaTitikSatuHeader, {
    foreignKey:'id'
})

jenisPelayanan.hasMany(rlTigaTitikSatuDetail, {
    foreignKey:'id'
})
rlTigaTitikSatuDetail.belongsTo(jenisPelayanan, {
    foreignKey:'jenis_pelayanan_id'
})