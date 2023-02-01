import { getData, propinsi, kabKota, rumahSakit } from '../models/RumahSakit.js'

export const getDataRumahSakit = (req, res) => {
    const data = [
        req.params.id
    ]

    // getData(data, (err, results) => {
    //     if (err) {
    //         res.status(422).send({
    //             status: false,
    //             message: err
    //         })
    //         return
    //     }
    //     res.status(200).send({
    //         status: true,
    //         message: "data found",
    //         data: results
    //     })
    // })


    rumahSakit.findAll({
        attributes: [
            ['RUMAH_SAKIT', 'nama'],
            ['ALAMAT', 'alamat']
        ],
        where: {
            Propinsi: req.params.id
        },
        include:[
            {
                model: propinsi,
                as: "propinsi",
                attributes:[
                    ['propinsi_kode', 'id'],
                    ['propinsi_name', 'nama']
                ]
            },
            {
                model: kabKota,
                as: 'kabKota',
                attributes:[
                    ['link', 'id'],
                    ['KAB/KOTA', 'nama']
                ]
            }
        ]
    })
    .then((results) => {
        const message = results.length ? 'data found' : 'data not found'
        res.status(200).send({
            status: true,
            message: message,
            data: results
        })
    })
    .catch((err) => {
        res.status(422).send({
            status: false,
            message: err
        })
        return
    })
    
}