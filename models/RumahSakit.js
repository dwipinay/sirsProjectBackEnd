import { DataTypes, QueryTypes } from "sequelize"
import { databaseRSOnline } from "../config/Database.js"

export const rumahSakit = databaseRSOnline.define(`data`, 
    {
        usrpwd2: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        RUMAH_SAKIT: {
            type: DataTypes.STRING
        },
        ALAMAT: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING,
            unique: true,
        }
    }
)

export const propinsi = databaseRSOnline.define(`propinsi`, 
    {
        propinsi_kode:  {
            type: DataTypes.STRING,
            primaryKey: true
        },
        propinsi_name: {
            type: DataTypes.STRING
        }
    }
)

export const kabKota = databaseRSOnline.define(`kab/kota`,
    {
        link: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        'KAB/KOTA': {
            type: DataTypes.STRING
        }
    }
)

export const getData = (data, callback) => {
    const sqlSelect = 'SELECT ' + 
        '`data`.RUMAH_SAKIT as nama, ' +
        '`data`.ALAMAT as alamat, ' +
        'propinsi.propinsi_name as namaPropinsi, ' +
        '`kab/kota`.`KAB/KOTA` as namaKabKota ' +
    'FROM ' +
        '`data` INNER JOIN propinsi ON  propinsi.propinsi_kode = `data`.usrpwd2 ' +
        'INNER JOIN `kab/kota` ON `kab/kota`.link = `data`.link ' +
    'WHERE `data`.Propinsi = ? '
    databaseRSOnline.query(sqlSelect, {
        type: QueryTypes.SELECT,
        replacements: [data]
    })
    .then((res) => {
        callback(null, res)
    })
    .catch((error) => {
        callback(error, null)
    })
}

rumahSakit.hasOne(propinsi, { 
    foreignKey: 'propinsi_kode',
    sourceKey: 'usrpwd2',
    as: 'propinsi'
})

rumahSakit.hasOne(kabKota, { 
    foreignKey: 'link',
    sourceKey: 'link',
    as: 'kabKota'
})
