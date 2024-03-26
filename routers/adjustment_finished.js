const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const {profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, suppliers_payment, expenses_type, all_expenses, adjustment, adjustment_finished, email_settings, supervisor_settings} = require("../models/all_models");
const users = require("../public/language/languages.json");
const nodemailer = require('nodemailer');


router.get("/view", auth, async(req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()

        let warehouse_data
        if(role_data.role == "staff"){
            const staff_data = await staff.findOne({ email: role_data.email })
            warehouse_data = await warehouse.find({status : 'Enabled', name: staff_data.warehouse });
        }else{
            warehouse_data = await warehouse.find({status : 'Enabled'});
        }


        const product_data = await product.find()


        // const adjustment_data = await adjustment.find()
        let adjustment_data
        if(role_data.role == "staff"){
            const staff_data = await staff.findOne({ email: role_data.email })
            adjustment_data = await adjustment_finished.find({ warehouse_name : staff_data.warehouse })
        }else{
            // adjustment_data = await adjustment_finished.find()
            adjustment_data = await adjustment_finished.aggregate([
                {
                    $unwind: "$product"
                },
                {
                  $group: {
                    _id: "$_id",
                    invoice: { $first: "$invoice" },
                    date: { $first: "$date" },
                    warehouse_name: { $first: "$warehouse_name" },
                    room: { $addToSet: "$product.room_names" },
                    finalize: { $first: "$finalize" }
                  }
                  
                },
                {
                  $project: {
                    _id: 1,
                    invoice: 1,
                    suppliers: 1,
                    date: 1,
                    warehouse_name: 1,
                    room: 1,
                    finalize: 1
                    
                  }
               }
          ]);
        }

        

        if (master[0].language == "English (US)") {
            var lan_data = users.English
            console.log(lan_data);
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }
        res.render("adjustment_finished", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            warehouse : warehouse_data,
            product : product_data,
            adjustment : adjustment_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
    
})
async function getRandom8DigitNumber() {
    const min = 10000000;
    const max = 99999999; 
    
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    var IDInvoice;


    const new_purchase = await adjustment_finished.findOne({ invoice: "ADJ-"+random });
    if (new_purchase && new_purchase.length > 0) {
        IDInvoice = "ADJ-"+random;
    }else{
        IDInvoice = "ADJ-"+random; 
    }
    return IDInvoice ;
}


router.get("/view/add_adjustment", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        const profile_data = await profile.findOne({email : role_data.email})
        const master = await master_shop.find()
        let warehouse_data
        if(role_data.role == "staff"){
            const staff_data = await staff.findOne({ email: role_data.email })
            warehouse_data = await warehouse.aggregate([
                {
                    $match: { 
                        "status" : 'Enabled', 
                        name: staff_data.warehouse,
                        "name": { $ne: "Return Goods" }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        name: { $first: "$name"}
                    }
                },
            ])
        }else{
            // warehouse_data = await warehouse.find({status : 'Enabled'});
            warehouse_data = await warehouse.aggregate([
                {
                    $match: { 
                        "status" : 'Enabled',
                        "name": { $ne: "Return Goods" }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        name: { $first: "$name"}
                    }
                },
            ])
        }
        const product_data = await product.find({});

        const adjustment_data = await adjustment_finished.find({})
        const invoice_noint = adjustment_data.length + 1
        const invoice_no = "ADJ-" + invoice_noint.toString().padStart(5, "0")
        var rooms_data = ["Ambient", "Enclosed", "Return Rooms"];

        if (master[0].language == "English (US)") {
            var lan_data = users.English
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }
        const randominv = getRandom8DigitNumber();
        randominv.then(invoicedata => {
            res.render("add_adjustment_finished", {
                success: req.flash('success'),
                errors: req.flash('errors'),
                role : role_data,
                profile : profile_data,
                warehouse: warehouse_data,
                product: product_data,
                master_shop : master,
                language : lan_data,
                rooms_data,
                invoice_no: invoicedata
            })
        }).catch(error => {
            req.flash('errors', `There's a error in this transaction`)
            res.redirect("/adjustment_finished/view");
        })
    } catch (error) {
        console.log(error);
    }
})


router.post("/view/add_adjustment", auth, async(req, res) => {
    try{
        const {warehouse_name, date, prod_name, note, invoice } = req.body
        
        if(typeof prod_name == "string"){
            var product_name_array = [req.body.prod_name]
            var status_array = [req.body.status]
            var from_status_array = [req.body.from_status]
            var txtDate_array = [req.body.txtDate]
            var txtNote_array = [req.body.txtNote]
            var unit = [req.body.unit]
          
            var product_code_array = [req.body.prod_code]
            var Rooms_array = [req.body.Rooms]
            var level_array1 = [req.body.type]
            var rack_array = [req.body.level2]
            var prod_invoice_array = [req.body.prod_invoice]
            var idfromtransaction_array = [req.body.idfromtransaction]
            var product_id_array = [req.body.product_id]
            var warehouse_id_detl_array = [req.body.warehouse_id_detl]
        }else{
            var product_name_array = [...req.body.prod_name]
            var status_array = [...req.body.status]
            var from_status_array = [...req.body.from_status]
            var txtDate_array = [...req.body.txtDate]
            var txtNote_array = [...req.body.txtNote]
            var unit = [...req.body.unit]
            var product_code_array = [...req.body.prod_code]
            var Rooms_array = [...req.body.Rooms]
            var level_array1 = [...req.body.type]
            var rack_array = [...req.body.level2]
            var prod_invoice_array = [...req.body.prod_invoice]
            var idfromtransaction_array = [...req.body.idfromtransaction]
            var product_id_array = [...req.body.product_id]
            var warehouse_id_detl_array = [...req.body.warehouse_id_detl]
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    } 
        })
        
        

        rack_array.forEach((value,i) => {
            newproduct[i].rack = value
        });

        level_array1.forEach((value, i) => {
            newproduct[i].level = value
        })

        status_array.forEach((value,i) => {
            newproduct[i].status = value
        });

        from_status_array.forEach((value, i) => {
            newproduct[i].from_status = value
        })

        txtDate_array.forEach((value,i) => {
            newproduct[i].date = value
        });

        txtNote_array.forEach((value,i) => {
            newproduct[i].note = value
        });

        unit.forEach((value,i) => {
            newproduct[i].unit = value
        });

       

        product_code_array.forEach((value,i) => {
            newproduct[i].product_code = value
        });

       


        Rooms_array.forEach((value, i) => {
            newproduct[i].room_names = value
        })


    
        idfromtransaction_array.forEach((value, i) => {
            newproduct[i].idfromtransaction = value
        })

        prod_invoice_array.forEach((value, i) =>{
            newproduct[i].invoice = value
        })


        product_id_array.forEach((value, i) => {
            newproduct[i].product_id = value
        })


        warehouse_id_detl_array.forEach((value, i) => {
            newproduct[i].warehouse_detl_id = value
        })
       
    
        // const newFilter = newproduct.filter(obj => obj.new_adjust_qty !== "0" && obj.new_adjust_qty !== "");
        // var error = 0
        // newFilter.forEach(data => {
        //     console.log("foreach newproduct", data);
        //     if (parseInt(data.new_adjust_qty) < 0 ) {
                
        //         error++
        //     }
        // })
        // if (error != 0) {
            
        //     req.flash("errors", `You can't subtract, the current stock is 0`)
        //     return res.redirect("back")
        // }

        const data = new adjustment_finished({ warehouse_name, date, product:newproduct, note, invoice })

        const adjustment_data = await data.save() ;

    

       
        const promises = data.product.map(async(product_details) => {
                warehouse_data = await warehouse.findOne({ name: warehouse_name, room: product_details.room_names });
            
                const match_data = warehouse_data.product_details.map((data) => {
                        if (data.product_name == product_details.product_name  && data.level == product_details.level && data.rack == product_details.rack  && data.invoice == product_details.invoice && data.idfromtransaction == product_details.idfromtransaction && data._id == product_details.warehouse_detl_id) {
                            data.status = product_details.status
                            data.date = product_details.date
                            data.note = product_details.note
                        }
                })
            return warehouse_data;
        })


        Promise.all(promises)
            .then(async (updatedWarehouseDataArray) => {
                try {
                    
                    
                    for (const warehouseData of updatedWarehouseDataArray) {
                        
                        await warehouseData.save();
                    }
                    
            
                    // const adjustment_data = await data.save()

                    var product_list = data.product
                    const master = await master_shop.find()
                    const email_data = await email_settings.findOne()
                    const supervisor_data = await supervisor_settings.find();

                    let mailTransporter = nodemailer.createTransport({
                        host: email_data.host,
                        port: Number(email_data.port),
                        secure: false,
                        auth: {
                            user: email_data.email,
                            pass: email_data.password
                        }
                    });

                    var arrayItems = "";
                        var n;
                        for (n in product_list) {
                            arrayItems +=  '<tr>'+
                                                '<td style="border: 1px solid black;">' + product_list[n].product_name + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].new_adjust_qty + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].unit + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].room_names + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].level + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].isle+product_list[n].pallet + '</td>' +
                                                
                                            '</tr>'
                        }


                        let mailDetails = {
                            from: email_data.email,
                            to: supervisor_data[0].RMSEmail,
                            subject:'Sale Product Mail',
                            attachments: [{
                                filename: 'Logo.png',
                                path: __dirname + '/../public' +'/upload/'+master[0].image,
                                cid: 'logo'
                           }],
                            html:'<!DOCTYPE html>'+
                                '<html><head><title></title>'+
                                '</head><body>'+
                                    '<div>'+
                                        '<div style="display: flex; align-items: center; justify-content: center;">'+
                                            '<div>'+
                                                '<img src="cid:logo" class="rounded" width="66.5px" height="66.5px"></img>'+
                                            '</div>'+
                                        
                                            '<div>'+
                                                '<h2> '+ master[0].site_title +' </h2>'+
                                            '</div>'+
                                        '</div>'+
                                        '<hr class="my-3">'+
                                        '<div>'+
                                            '<h5 style="text-align: left;">'+
                                                ' Order Number : '+ data.invoice +' '+
                                                '<span style="float: right;">'+
                                                    ' Order Date : '+ data.date +' '+
                                                '</span>'+
                                                
                                            '</h5>'+
                                        '</div>'+
                                        '<table style="width: 100% !important;">'+
                                            '<thead style="width: 100% !important;">'+
                                                '<tr>'+
                                                    '<th style="border: 1px solid black;"> Product Name </th>'+
                                                    '<th style="border: 1px solid black;"> Quantity </th>'+
                                                    '<th style="border: 1px solid black;"> Unit of measure </th>'+
                                                    '<th style="border: 1px solid black;"> Room </th>'+
                                                    '<th style="border: 1px solid black;"> Level </th>'+
                                                    '<th style="border: 1px solid black;"> Location </th>'+
                                                    
                                                    
                                                '</tr>'+
                                            '</thead>'+
                                            '<tbody style="text-align: center;">'+
                                                ' '+ arrayItems +' '+
                                            '</tbody>'+
                                        '</table>'+
                                        
                                        
                                        '<div>'+
                                            '<strong> Regards </strong>'+
                                            '<h5>'+ master[0].site_title +'</h5>'+
                                        '</div>'+
                                    '</div>'+
                                '</body></html>'
                        };
                        
                        mailTransporter.sendMail(mailDetails, function(err, data) {
                            if(err) {
                                console.log(err);
                                console.log('Error Occurs');
                            } else {
                                console.log('Email sent successfully');
                            }
                        });

                    req.flash('success', `Adjustment Finalize Successfully`)
                    res.redirect("/adjustment_finished/view/")
                } catch (error) {
                    console.error(error);
                    res.json({ error: 'An error occurred while saving data.' });
                }
            })
            .catch((error) => {
                // Handle any errors that might have occurred during the process.
                console.error(error);
                res.json({ error: 'An error occurred.' });
            });
        
        // req.flash('success', `adjustment add successfull`)
        // res.redirect("/adjustment_finished/view/")
    }catch(error){
        console.log(error);
        res.json({ message: error.message })
    }
})


// finalize process
router.get("/preview/:id", auth , async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        
        const _id = req.params.id
        const adjustment_data = await adjustment_finished.findById({_id})

        const purchases_data = await purchases.aggregate([
            {
                $match: { "warehouse_name": adjustment_data.warehouse_name }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.product_name", 
                }
            },
        ])
       

        const product_data = await product.find({})


        const stock_data = await warehouse.aggregate([
            {
                $match: { 
                    "name": adjustment_data.warehouse_name,
                    // "room": adjustment_data.room 
                }
            },
            {
                $unwind: "$product_details"
            },
            {
                $group: {
                    _id: "$product_details._id",
                    name: { $first: "$product_details.product_name" },
                    product_stock: { $first: "$product_details.product_stock" },
                    primary_code: { $first: "$product_details.primary_code" },
                    secondary_code: {$first: "$product_details.secondary_code" },
                    product_code: { $first: "$product_details.product_code" },
                    level: { $first: "$product_details.level" },
                    unit: { $first: "$product_details.unit" },
                    rack: { $first: "$product_details.rack" },
                    roomNamed : { $first: "$room" },
                    invoice : { $first: "$product_details.invoice" },
                    idfromtransaction : { $first : "$product_details.idfromtransaction"},
                    status: { $first : "$product_details.status" },
                    date: { $first : "$product_details.date" },
                    note: { $first : "$product_details.note" },
                    product_id: { $first : "$product_details.product_id" },
                    warehouse_id_detl: { $first : "$product_details._id" },
                }
            },
        ])

        // const RoomAll = adjustment_data.product;
        
        // const results = [];
        // async function fetchStockData(value) {
        //     const stock_data = await warehouse.aggregate([
        //         {
        //             $match: { 
        //                 "name": adjustment_data.warehouse_name,
        //                 "room": value 
        //             }
        //         },
        //         {
        //             $unwind: "$product_details"
        //         },
        //         {
        //             $group: {
        //                 _id: "$product_details._id",
        //                 name: { $first: "$product_details.product_name"},
        //                 product_stock: { $first: "$product_details.product_stock" },
        //                 bay: { $first: "$product_details.bay" },
        //                 bin: { $first: "$product_details.bin" },
        //                 type: { $first: "$product_details.type" },
        //                 floorlevel: { $first: "$product_details.floorlevel" },
        //                 primary_code: { $first: "$product_details.primary_code" },
        //                 secondary_code: { $first: "$product_details.secondary_code" },
        //                 product_code: { $first: "$product_details.product_code" },
        //                 storage: { $first: "$product_details.storage" },
        //                 rack: { $first: "$product_details.rack" },
        //                 expiry_date: { $first: "$product_details.expiry_date" },
        //                 production_date: { $first: "$product_details.production_date" },
        //                 batch_code: { $first: "$product_details.batch_code"},
        //                 maxPerUnit: { $first: "$product_details.maxPerUnit"},
        //             }
        //         },
        //     ])

        //     results.push(stock_data);

        // }


        // const promises = RoomAll.map((value) => fetchStockData(value.room_names));
        // await Promise.all(promises);

        if (master[0].language == "English (US)") {
            var lan_data = users.English
            console.log(lan_data);
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }

        res.render("edit_adjustment_finished_view", {
            success: req.flash('success'), 
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            adjustment: adjustment_data,
            stock: stock_data,  
            master_shop : master,
            warehouse_name : purchases_data,
            unit: product_data,
            language : lan_data,

        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message })
    }
})

router.post("/preview/:id", auth , async (req, res) => {
    try{

        const {invoice, warehouse_name, Room_name } = req.body
        const _id = req.params.id

        const data = await adjustment_finished.findById({_id})
        var warehouse_data;
        // const warehouse_data = await warehouse.findOne({ name: warehouse_name, room: Room_name });
        const promises = data.product.map( async (product_details) => {
            
            if(product_details.adjust_qty > 0){
                warehouse_data = await warehouse.findOne({ name: warehouse_name, room: product_details.room_names });
                
                const match_data = warehouse_data.product_details.map((data) => {
                    console.log(product_details.types)
                    if (product_details.types == "minus") {
                        if (data.product_name == product_details.product_name  && data.level == product_details.level && data.isle == product_details.isle && data.pallet == product_details.pallet && data.expiry_date == product_details.expiry_date  && data.production_date == product_details.production_date && data.batch_code == product_details.batch_code && data.invoice == product_details.invoice) {
                            data.product_stock = data.product_stock - product_details.adjust_qty
                        }
                    } else if(product_details.types == "add") {
                        
                        if (data.product_name == product_details.product_name && data.level == product_details.level && data.isle == product_details.isle && data.pallet == product_details.pallet && data.expiry_date == product_details.expiry_date  && data.production_date == product_details.production_date && data.batch_code == product_details.batch_code && data.invoice == product_details.invoice) {
                            data.product_stock = data.product_stock + product_details.adjust_qty
                        }
                    }
        
        
                })
            }

            // res.json(warehouse_data)

            return warehouse_data;

        })



        Promise.all(promises)
            .then(async (updatedWarehouseDataArray) => {
                try {
                    // res.json(updatedWarehouseDataArray)
                    for (const warehouseData of updatedWarehouseDataArray) {
                        await warehouseData.save();
                    }
                    
                    data.finalize = "True";
                    const adjustment_data = await data.save()

                    var product_list = data.product
                    const master = await master_shop.find()
                    const email_data = await email_settings.findOne()
                    const supervisor_data = await supervisor_settings.find();

                    let mailTransporter = nodemailer.createTransport({
                        host: email_data.host,
                        port: Number(email_data.port),
                        secure: false,
                        auth: {
                            user: email_data.email,
                            pass: email_data.password
                        }
                    });

                    var arrayItems = "";
                        var n;
                        for (n in product_list) {
                            arrayItems +=  '<tr>'+
                                                '<td style="border: 1px solid black;">' + product_list[n].product_name + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].new_adjust_qty + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].unit + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].room_names + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].level + '</td>' +
                                                '<td style="border: 1px solid black;">' + product_list[n].isle+product_list[n].pallet + '</td>' +
                                                
                                            '</tr>'
                        }


                        let mailDetails = {
                            from: email_data.email,
                            to: supervisor_data[0].RMSEmail,
                            subject:'Sale Product Mail',
                            attachments: [{
                                filename: 'Logo.png',
                                path: __dirname + '/../public' +'/upload/'+master[0].image,
                                cid: 'logo'
                           }],
                            html:'<!DOCTYPE html>'+
                                '<html><head><title></title>'+
                                '</head><body>'+
                                    '<div>'+
                                        '<div style="display: flex; align-items: center; justify-content: center;">'+
                                            '<div>'+
                                                '<img src="cid:logo" class="rounded" width="66.5px" height="66.5px"></img>'+
                                            '</div>'+
                                        
                                            '<div>'+
                                                '<h2> '+ master[0].site_title +' </h2>'+
                                            '</div>'+
                                        '</div>'+
                                        '<hr class="my-3">'+
                                        '<div>'+
                                            '<h5 style="text-align: left;">'+
                                                ' Order Number : '+ data.invoice +' '+
                                                '<span style="float: right;">'+
                                                    ' Order Date : '+ data.date +' '+
                                                '</span>'+
                                                
                                            '</h5>'+
                                        '</div>'+
                                        '<table style="width: 100% !important;">'+
                                            '<thead style="width: 100% !important;">'+
                                                '<tr>'+
                                                    '<th style="border: 1px solid black;"> Product Name </th>'+
                                                    '<th style="border: 1px solid black;"> Quantity </th>'+
                                                    '<th style="border: 1px solid black;"> Unit of measure </th>'+
                                                    '<th style="border: 1px solid black;"> Room </th>'+
                                                    '<th style="border: 1px solid black;"> Level </th>'+
                                                    '<th style="border: 1px solid black;"> Location </th>'+
                                                    
                                                    
                                                '</tr>'+
                                            '</thead>'+
                                            '<tbody style="text-align: center;">'+
                                                ' '+ arrayItems +' '+
                                            '</tbody>'+
                                        '</table>'+
                                        
                                        
                                        '<div>'+
                                            '<strong> Regards </strong>'+
                                            '<h5>'+ master[0].site_title +'</h5>'+
                                        '</div>'+
                                    '</div>'+
                                '</body></html>'
                        };
                        
                        mailTransporter.sendMail(mailDetails, function(err, data) {
                            if(err) {
                                console.log(err);
                                console.log('Error Occurs');
                            } else {
                                console.log('Email sent successfully');
                            }
                        });

                    req.flash('success', `Adjustment Finalize Successfully`)
                    // res.redirect("/picking_list/PDF_adjustmentFinal/" + adjustment_data._id )
                    res.redirect("/adjustment_finished/view/")
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'An error occurred while saving data.' });
                }
            })
            .catch((error) => {
                // Handle any errors that might have occurred during the process.
                console.error(error);
                res.status(500).json({ error: 'An error occurred.' });
            });
            
    
    }catch(error){
        res.json({ message: error.message })
    }
})

// end Finalize


router.get("/view/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id
        const adjustment_data = await adjustment_finished.findById({_id})

        let expiry_date = new Date(adjustment_data.expiry_date)
        let ed_day = ('0' + expiry_date.getDate()).slice(-2)
        let ed_month = ('0' + (expiry_date.getMonth() + 1)).slice(-2)
        let ed_year = expiry_date.getFullYear()
        let ed_fullDate = `${ed_year}-${ed_month}-${ed_day}`
        // console.log(adjustment_data);
        var rooms_data = ["Ambient", "Enclosed", "Return Rooms"];
        const purchases_data = await purchases.aggregate([
            {
                $match: { "warehouse_name": adjustment_data.warehouse_name }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.product_name", 
                }
            },
        ])
        console.log("purchases_data" , purchases_data);

        const product_data = await product.find({})


        const stock_data = await warehouse.aggregate([
            {
                $match: { 
                    "name": adjustment_data.warehouse_name,
                    "room": adjustment_data.room 
                }
            },
            {
                $unwind: "$product_details"
            },
            {
                $group: {
                    _id: "$product_details._id",
                    name: { $first: "$product_details.product_name"},
                    product_stock: { $first: "$product_details.product_stock" },
                    bay: { $first: "$product_details.bay" },
                    bin: { $first: "$product_details.bin" },
                    type: { $first: "$product_details.type" },
                    floorlevel: { $first: "$product_details.floorlevel" },
                    primary_code: { $first: "$product_details.primary_code" },
                    secondary_code: { $first: "$product_details.secondary_code" },
                    product_code: { $first: "$product_details.product_code" },
                    storage: { $first: "$product_details.storage" },
                    rack: { $first: "$product_details.rack" },
                }
            },
        ])


        // res.status(200).json(stock_data)
        if (master[0].language == "English (US)") {
            var lan_data = users.English
            console.log(lan_data);
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }

        res.render("edit_adjustment_finished", {
            success: req.flash('success'), 
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            adjustment: adjustment_data,
            stock: stock_data,  
            master_shop : master,
            warehouse_name : purchases_data,
            unit: product_data,
            language : lan_data,
            rooms_data,
            ed_fullDate
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ message: error.message })
    }
})

router.post("/view/:id", auth, async (req, res) => {
    try{
        const _id = req.params.id;
        const old_adjustment = await adjustment_finished.findById({_id})

        const old_warehouse_data = await warehouse.findOne({name : old_adjustment.warehouse_name, room: old_adjustment.room })


        const { warehouse_name, date, prod_name, level, isle, pallet, stock, types, adjust_qty, new_adjust_qty, note, Room_name, invoice, JO_number } = req.body
        

        if(typeof prod_name == "string"){
            var product_name_array = [req.body.prod_name]
            var level_array = [req.body.level]
            var stock_array = [req.body.stock]
            var types_array = [req.body.types]
            var adjust_qty_array = [req.body.adjust_qty]
            var new_adjust_qty_array = [req.body.new_adjust_qty]
            var product_code_array = [req.body.prod_code]
            var unit_units_array = [req.body.unit]
            var Secondary_units_array = [req.body.Secondary_units]
            var batch_code_array = [req.body.batch_code]
            var expiry_date_array = [req.body.expiry_date]
        
        }else{
            var product_name_array = [...req.body.prod_name]
            var level_array = [...req.body.level]
            var stock_array = [...req.body.stock]
            var types_array = [...req.body.types]
            var adjust_qty_array = [...req.body.adjust_qty]
            var new_adjust_qty_array = [...req.body.new_adjust_qty]
            var product_code_array = [...req.body.prod_code]
            var unit_units_array = [...req.body.unit]
            var Secondary_units_array = [...req.body.Secondary_units]
            var batch_code_array = [...req.body.batch_code]
            var expiry_date_array = [...req.body.expiry_date]
        }
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    } 
            })
                    
            level_array.forEach((value,i) => {
                newproduct[i].bay = value
            });
       
    
            stock_array.forEach((value,i) => {
                newproduct[i].stockBefore = value
            });
    
            types_array.forEach((value, i) => {
                newproduct[i].types = value
            })
    
            adjust_qty_array.forEach((value,i) => {
                newproduct[i].adjust_qty = value
            });
    
            new_adjust_qty_array.forEach((value,i) => {
                newproduct[i].new_adjust_qty = value
            });

            unit_units_array.forEach((value,i) => {
                newproduct[i].unit = value
            });
    
            Secondary_units_array.forEach((value,i) => {
                newproduct[i].secondary_unit = value
            });
    
            product_code_array.forEach((value,i) => {
                newproduct[i].product_code = value
            });

            batch_code_array.forEach((value,i) => {
                newproduct[i].batch_code = value
            });


            expiry_date_array.forEach((value, i) => {
                newproduct[i].expiry_date = value
            })



        const newFilter = newproduct.filter(obj => obj.adjust_qty !== "0" && obj.adjust_qty !== "");
        var error = 0
        newFilter.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.adjust_qty) <= 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `You can't subtract, the current stock is 0`)
            return res.redirect("back")
        }



        // old_adjustment.product.forEach(product_details => {
        //     // console.log("if product_details", product_details);

        //     const match_data = old_warehouse_data.product_details.map((data) => {
        //         // console.log("map", data);

        //         if (product_details.types == "minus") {
                    
        //             if (data.product_name == product_details.product_name && data.floorlevel == product_details.floorlevel && data.type == product_details.type && data.bin == product_details.bin && data.bay == product_details.bay && data.rack == product_details.rack && data.storage == product_details.storage) {
                        
        //                 data.product_stock = parseInt(data.product_stock) + parseInt(product_details.adjust_qty)
        //             }
        //         } else {
                    
        //             // if (data.product_name == product_details.product_name && product_details.pallet == data.pallet) {
        //             if (data.product_name == product_details.product_name && data.floorlevel == product_details.floorlevel && data.type == product_details.type && data.bin == product_details.bin && data.bay == product_details.bay && data.rack == product_details.rack && data.storage == product_details.storage) {
        //                 data.product_stock = parseInt(data.product_stock) - parseInt(product_details.adjust_qty)
        //             }
        //         }

        //     })
        // })
        // await old_warehouse_data.save()


        old_adjustment.warehouse_name = warehouse_name
        old_adjustment.date = date
        old_adjustment.product = newFilter
        old_adjustment.note = note
        old_adjustment.room = Room_name
        old_adjustment.invoice = invoice
        old_adjustment.JO_number = JO_number

        const adjustment_data = await old_adjustment.save()

        const new_warehouse_data = await warehouse.findOne({ name: warehouse_name, room: Room_name });

        adjustment_data.product.forEach(product_details => {

            const match_data = new_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (product_details.types == "minus") {

                    if (data.product_name == product_details.product_name && data.bay == product_details.bay) {
                        data.product_stock = parseInt(data.product_stock) - parseInt(product_details.adjust_qty)
                    }
                } else {

                    // if (data.product_name == product_details.product_name && product_details.pallet == data.pallet) {
                    if (data.product_name == product_details.product_name && data.bay == product_details.bay) {
                        
                        data.product_stock = parseInt(data.product_stock) + parseInt(product_details.adjust_qty)
                    }
                }

            })
        })
        
        await new_warehouse_data.save()

        req.flash('success', `adjustment data update successfully`)
        res.redirect("/adjustment_finished/view")

    } catch (error) {
        console.log(error);
    }
})


router.post("/barcode_scanner", async (req, res) => {
    const { primary_code, warehouse_data, rooms_data, Roomslist } = req.body;
    const RoomAll = Roomslist.split(",");
    // console.log(req.body)
    const results = [];

    // Define a function to fetch stock data asynchronously
    async function fetchStockData(value) {
        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": warehouse_data, "room" : value }
            },
            {
                $unwind: "$product_details"
            },
            {
                $match: { "product_details.product_code": primary_code }
            },
            {
                $group: {
                    _id: "$product_details._id",
                    name: { $first: "$product_details.product_name" },
                    product_stock: { $first: "$product_details.product_stock" },
                    primary_code: { $first: "$product_details.primary_code" },
                    secondary_code: {$first: "$product_details.secondary_code" },
                    product_code: { $first: "$product_details.product_code" },
                    level: { $first: "$product_details.level" },
                    isle: { $first: "$product_details.isle" },
                    pallet: { $first: "$product_details.pallet" },
                    unit: { $first: "$product_details.unit" },
                    secondary_unit: { $first: "$product_details.secondary_unit" },
                    storage: { $first: "$product_details.storage" },
                    rack: { $first: "$product_details.rack" },
                    expiry_date: { $first: "$product_details.expiry_date" },
                    production_date: { $first: "$product_details.production_date" },
                    batch_code: { $first: "$product_details.batch_code"},
                    product_cat: { $first: "P" },
                    maxPerUnit: { $first: "$product_details.maxPerUnit"},
                    roomNamed : { $first: "$room" },
                    CBM : { $first: { $toDouble: "$product_details.CBM" } },
                    maxProducts: { $first: "$product_details.maxProducts" },
                    invoice : { $first: "$product_details.invoice" },
                    idfromtransaction : { $first : "$product_details.idfromtransaction"},
                    status: { $first : "$product_details.status" },
                    date: { $first : "$product_details.date" },
                    note: { $first : "$product_details.note" },
                    product_id: { $first : "$product_details.product_id" },
                    warehouse_id_detl: { $first : "$product_details._id" },

                }
            },
        ]);

       

        if (stock_data.length > 0) {
            results.push(stock_data);
        } 
    }

    // Create an array of promises for each value
    const promises = RoomAll.map((value) => fetchStockData(value));

    // Wait for all promises to resolve before sending the response
    await Promise.all(promises);

    res.json(results);
});



router.post("/CheckingWarehouse", async (req, res) => {

    const { productCode, bay, warehouses, room } = req.body
    console.log(req.body)
    try{
        const stock_data = await warehouse.aggregate([
            {
                $match: { 
                    "name": warehouses,
                    "room": room
                }
            },
            {
                $unwind: "$product_details"
            },
            {
                $match: {
                    "product_details.bay" : parseInt(bay),
                }
            },
            {
                $group: {
                    _id: "$product_details._id",
                    name: { $first: "$product_details.product_name"},
                    product_stock: { $first: "$product_details.product_stock" },
                    bay: { $first: "$product_details.bay" },
                    maxProducts: { $first: "$product_details.maxProducts" }
                }
            },
        ])


        res.status(200).json(stock_data)
    }catch(error){
        res.status(404).json({ message: error.message })
    }

})


module.exports = router;