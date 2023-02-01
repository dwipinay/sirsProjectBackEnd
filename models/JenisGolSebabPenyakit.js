import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const jenisGolSebabPenyakit = databaseSIRS.define("jenis_gol_sebab_penyakit",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    rl_id: {
        type: DataTypes.INTEGER,
    },
    no: {
        type: DataTypes.STRING,
    },
    no_dtd: {
        type: DataTypes.STRING,
    },
    no_daftar_terperinci: {
        type: DataTypes.STRING,
    },
    nama: {
        type: DataTypes.STRING,
    }
},{
    freezeTableName: true,
})