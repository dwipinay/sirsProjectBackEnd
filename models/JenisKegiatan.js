import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS }  from "../config/Database.js"

export const jenisKegiatan = databaseSIRS.define('jenis_kegiatan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rl_id: {
        type: DataTypes.INTEGER     
    },
    no: {
        type: DataTypes.INTEGER
    },
    nama: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

export const groupJenisKegiatan = databaseSIRS.define("group_jenis_kegiatan", {
    no: {
        type: DataTypes.STRING,
    },
    nama: {
        type: DataTypes.STRING,
    },
    group_jenis_kegiatan_header_id: {
        type: DataTypes.INTEGER,
    }
})

export const groupJenisKegiatanHeader = databaseSIRS.define("group_jenis_kegiatan_header", {
    nama: {
        type: DataTypes.STRING,
    }
})
export const jenisGroupKegiatanHeader = databaseSIRS.define('group_jenis_kegiatan_header', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    
    nama: {
        type: DataTypes.STRING
    },
    
    no: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

jenisGroupKegiatanHeader.hasMany(jenisKegiatan, {foreignKey: 'id'})
jenisKegiatan.belongsTo(jenisGroupKegiatanHeader, {foreignKey: 'group_jenis_kegiatan_id'})