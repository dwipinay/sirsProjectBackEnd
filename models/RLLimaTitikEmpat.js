import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'

export const rlLimaTitikEmpat = databaseSIRS.define("rl_lima_titik_empat",{
    rs_id: {
        type: DataTypes.STRING,
    },
    tahun: {
        type: DataTypes.DATEONLY,
    },
    user_id: {
        type: DataTypes.INTEGER,
    }
})

export const rlLimaTitikEmpatDetail = databaseSIRS.define("rl_lima_titik_empat_detail",{
    rl_lima_titik_empat_id: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    no_urut_id: {
        type: DataTypes.INTEGER,
    },
    kode_icd_10: {
        type: DataTypes.STRING,
        unique:true
    },
    deskripsi: {
        type: DataTypes.STRING,
    },
    kasus_baru_Lk: {
        type: DataTypes.INTEGER,
    },
    kasus_baru_Pr: {
        type: DataTypes.INTEGER,
    },
    jumlah_kasus_baru: {
        type: DataTypes.INTEGER,
    },
    jumlah_kunjungan: {
        type: DataTypes.INTEGER,
    }, 
    tahun: {
        type: DataTypes.DATEONLY,
    },
    rs_id: {
        type: DataTypes.INTEGER,
    }
})

export const noUrut = databaseSIRS.define('no_urut', {
    no: {
        type: DataTypes.NUMBER
    }
})

export const icd10 = databaseSIRS.define('icd_10', {
    code: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
})

rlLimaTitikEmpat.hasMany(rlLimaTitikEmpatDetail, {
    foreignKey:'rl_lima_titik_empat_id'
})
rlLimaTitikEmpatDetail.belongsTo(rlLimaTitikEmpat, {
    foreignKey:'id'
})
noUrut.hasMany(rlLimaTitikEmpatDetail, {
    foreignKey:'id'
})
rlLimaTitikEmpatDetail.belongsTo(noUrut, {
    foreignKey:'no_urut_id'
})
icd10.hasMany(rlLimaTitikEmpatDetail, {
    foreignKey:'id'
})
rlLimaTitikEmpatDetail.belongsTo(icd10, {
    foreignKey:'kode_icd_10'
})