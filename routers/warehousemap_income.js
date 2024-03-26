const express = require("express");
const app = express();
const router = express.Router();
const multer  = require('multer');
const { profile, master_shop, email_settings, warehouse, purchases, staff } = require("../models/all_models");
const auth = require("../middleware/auth");
var timezones = require('timezones-list');
const users = require("../public/language/languages.json");





router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        let warehouse_data
        if(role_data.role == "staff"){
            const staff_data = await staff.findOne({ email: role_data.email })
            // warehouse_data = await warehouse.find({status : 'Enabled', name: staff_data.warehouse });
            warehouse_data = await warehouse.aggregate([
              {
                  $match: { 
                      "status" : 'Enabled', 
                      "name": staff_data.warehouse
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
                      "status" : 'Enabled'
                  }
              },
              {
                  $group: {
                      _id: "$name",
                      name: { $first: "$name"}
                  }
              },
              {
                  $sort: {
                      name: 1 
                  }
              }
          ])
        }

        const nDate = new Date().toLocaleString('en-US', {
            timeZone: master[0].timezone
        });
        console.log("timezone",nDate);

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
        
        res.render("warehousemap_incoming", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            timezones,
            language : lan_data,
            warehouse: warehouse_data
        }) 
    } catch (error) {
        console.log(error);
        res.status(200).json( { message: error.message } )
    }
})


router.post('/MapData', async (req, res) => {
  const { warehouseNew, level, rooms } = req.body 


  
    const warehouse_data =  await warehouse.aggregate([
      
      {
        $unwind: "$product_details" // Split the "product" array into separate documents
      },
      {
        $match: {
          name: warehouseNew,
          "product_details.level": parseInt(level),
          room: rooms
        }
      },
      {
        $group: {
          _id: {
                rack: "$product_details.rack",
                product_code: "$product_details.product_code",
                product_name: "$product_details.product_name",
                status: "$product_details.status",
                
          },
          products: {
            $push: {
              product_name: "$product_details.product_name",
              product_code: "$product_details.product_code",
              status: "$product_details.status",

            }
          },
          
        }
      },
      {
        $project: {
          _id: 0,
          rack: "$_id.rack",
          product_code: "$_id.product_code",
          products: "$products",
          status: "$_id.status"
          }
        
      },
      {
        $lookup: {
          from: "products",
          localField: "product_code",
          foreignField: "product_code",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $project: {
          _id: 0,
          rack: 1,
          product_code: 1,
          products: 1,
          status: 1,
          image: "$productDetails.image",
          name: "$productDetails.name",
          category: "$productDetails.category",
          brand: "$productDetails.brand",
        }
      }
    ]);

    console.log(warehouse_data)
  res.json(warehouse_data);
})




router.post('/MapData2', async (req, res) => {
    const { warehouseNew, rooms, room_cat } = req.body 
    
    let warehouse_data;
    if(room_cat == "All"){

      
      warehouse_data = await warehouse.aggregate([
        {
          $unwind: "$product_details"
        },
        {
          $match: {
            name: warehouseNew,
          }
        },
        {
          $group: {
            _id: {
              bay: "$product_details.bay",
              product: "$product_details.product_name",
              expiry: "$product_details.expiry_date"
            },
            count: { $sum: "$product_details.product_stock" },
            production_date: { $first : "$product_details.production_date" },
            expiry_date: { $first : "$product_details.expiry_date" },
            batch_code: { $first : "$product_details.batch_code" },
          }
        },
        {
          $group: {
            _id: "$_id.bay",
            products: {
              $push: {
                product: "$_id.product",
                quantity: "$count",
                production_date: "$production_date",
                expiry_date: "$expiry_date",
                batch_code: "$batch_code"
              }
            },
            totalQuantity: { $sum: "$count" }
          }
        },
        {
          $match: {
            totalQuantity: { $gt: 0 } // Only include documents with non-zero totalQuantity
          }
        },
        {
          $project: {
            _id: 0,
            bay: "$_id",
            products: 1,
            totalQuantity: 1
          }
        }

      
    ]);
    console.log(room_cat)

    }else{
    //  warehouse_data = await warehouse.aggregate([
    //     {
    //       $unwind: "$product_details"
    //     },
    //     {
    //       $match: {
    //         name: warehouseNew,
    //         room: rooms,
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: {
    //           bay: "$product_details.bay"
    //         },
    //         count: { $sum: "$product_details.product_stock" }
    //       }
    //     }
    //   ]);


    // warehouse_data = await warehouse.aggregate([
    //   {
    //     $unwind: "$product_details"
    //   },
    //   {
    //     $match: {
    //       name: warehouseNew,
    //       room: rooms,
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         bay: "$product_details.bay",
    //         product: "$product_details.product_name"
    //       },
    //       count: { $sum: "$product_details.product_stock" },
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$_id.bay",
    //       products: {
    //         $push: {
    //           product: "$_id.product",
    //           quantity: "$count"
    //         }
    //       },
    //       totalQuantity: { $sum: "$count" }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       bay: "$_id",
    //       products: 1,
    //       totalQuantity: 1
    //     }
    //   }
    // ]);

    }
    
  
  
  res.json(warehouse_data);
  })

router.post("/Rooms_data", async (req, res) => {

  try{
      const { warehouse_name, A, B } = req.body

      // warehouse_data = await warehouse.find({status : 'Enabled', name: warehouse_name });

    

      var include = '';
      if(A == "raw"){
        if(B == "pack"){
          include = [
            {
                $match: { 
                    "name": warehouse_name,
                    "status" : 'Enabled',
                    "room" :  "Rack A"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    room_name: { $first: "$room"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ]
        }else{
          include = [
            {
                $match: { 
                    "name": warehouse_name,
                    "status" : 'Enabled',
              
                }
            },
            {
                $group: {
                    _id: "$_id",
                    room_name: { $first: "$room"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ]
        }

      }else{
        
        include = [
          {
              $match: { 
                  "name": warehouse_name,
                  "status" : 'Enabled',
            
              }
          },
          {
              $group: {
                  _id: "$_id",
                  room_name: { $first: "$room"}
              }
          },
          {
            $sort: {
                room_name: 1 // 1 for ascending order, -1 for descending order
            }
        }
      ]
      }
      const warehouse_data = await warehouse.aggregate(include)
        
  

      res.status(200).json(warehouse_data)
  }catch(error){
      res.status(400).json({ errorMessage: error.message })
  }
  

})


router.post("/Rooms_data2", async (req, res) => {

    try{
        const { warehouse_name, cat, valNew } = req.body
  
        // warehouse_data = await warehouse.find({status : 'Enabled', name: warehouse_name });
        var notInclude = '';
        var Include = '';
        if(cat == "Raw Materials"){
          notInclude = "Return Goods";
          if(valNew == "pack"){
            Include = [
                {
                    $match: { 
                        "status" : 'Enabled',
                        "warehouse_category" : cat,
                        "name": { $ne: notInclude },
                        "name": "DRY STORAGE"                        
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        room_name: { $first: "$name"}
                    }
                },
                {
                  $sort: {
                      room_name: 1 // 1 for ascending order, -1 for descending order
                  }
              }
            ]
          }else{
            Include = [
              {
                  $match: { 
                      "status" : 'Enabled',
                      "warehouse_category" : cat,
                      "name": { $ne: notInclude },
                                          
                  }
              },
              {
                  $group: {
                      _id: "$name",
                      room_name: { $first: "$name"}
                  }
              },
              {
                $sort: {
                    room_name: 1 // 1 for ascending order, -1 for descending order
                }
            }
          ]
          }




        }else if(cat == "Finished Goods"){
          notInclude = "QA Warehouse";
          Include = [
            {
                $match: { 
                    "status" : 'Enabled',
                    "warehouse_category" : cat,
                    "name": { $ne: notInclude },
                                        
                }
            },
            {
                $group: {
                    _id: "$name",
                    room_name: { $first: "$name"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ]
        }else{
          Include = [
            {
                $match: { 
                    "status" : 'Enabled',
                    // "warehouse_category" : cat,
                    // "name": { $ne: notInclude },
                                        
                }
            },
            {
                $group: {
                    _id: "$name",
                    room_name: { $first: "$name"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ]
      }
        // const warehouse_data = await warehouse.aggregate([
        //     {
        //         $match: { 
        //             "status" : 'Enabled',
        //             "warehouse_category" : cat,
        //             "name": { $ne: notInclude },
                    
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$name",
        //             room_name: { $first: "$name"}
        //         }
        //     },
        //     {
        //       $sort: {
        //           room_name: 1 // 1 for ascending order, -1 for descending order
        //       }
        //   }
        // ])
          
        const warehouse_data = await warehouse.aggregate(Include)
  
        res.status(200).json(warehouse_data)
    }catch(error){
        res.status(400).json({ errorMessage: error.message })
        console.log(error)
    }
    
  
  })


  router.post("/Rooms_data3", async (req, res) => {

    try{
        const { warehouse_name, cat } = req.body
  
        // warehouse_data = await warehouse.find({status : 'Enabled', name: warehouse_name });
  
  
        const warehouse_data = await warehouse.aggregate([
            {
                $match: { 
                    "status" : 'Enabled',
                    "warehouse_category" : cat,
                    "name": warehouse_name
                }
            },
            {
                $group: {
                    _id: "$room",
                    room_name: { $first: "$room"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ])
          
    
  
        res.status(200).json(warehouse_data)
    }catch(error){
        res.status(400).json({ errorMessage: error.message })
    }
    
  
  })



router.post("/Rooms_dataStock", async (req, res) => {

  try{
      const { warehouse_name, A, B } = req.body


      var include = '';
      if(warehouse_name == "All"){
        
          include = [
            {
                $match: { 
                    "status" : 'Enabled',
              
                }
            },
            {
                $group: {
                    _id: "$room",
                    room_name: { $first: "$room"}
                }
            },
            {
              $sort: {
                  room_name: 1 // 1 for ascending order, -1 for descending order
              }
          }
        ]
        

      }else{
        
        include = [
          {
              $match: { 
                  "name": warehouse_name,
                  "status" : 'Enabled',
            
              }
          },
          {
              $group: {
                  _id: "$_id",
                  room_name: { $first: "$room"}
              }
          },
          {
            $sort: {
                room_name: 1 // 1 for ascending order, -1 for descending order
            }
        }
      ]
      }
      const warehouse_data = await warehouse.aggregate(include)
        
  

      res.status(200).json(warehouse_data)
  }catch(error){
      res.status(400).json({ errorMessage: error.message })
  }
  

})


router.get("/test", auth, async (req, res) => {
  try {
      const {username, email, role} = req.user
      const role_data = req.user

      const profile_data = await profile.findOne({email : role_data.email})

      const master = await master_shop.find()
      let warehouse_data
      if(role_data.role == "staff"){
          const staff_data = await staff.findOne({ email: role_data.email })
          // warehouse_data = await warehouse.find({status : 'Enabled', name: staff_data.warehouse });
          warehouse_data = await warehouse.aggregate([
            {
                $match: { 
                    "status" : 'Enabled', 
                    "name": staff_data.warehouse
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
                    "status" : 'Enabled'
                }
            },
            {
                $group: {
                    _id: "$name",
                    name: { $first: "$name"}
                }
            },
            {
                $sort: {
                    name: 1 
                }
            }
        ])
      }

      const nDate = new Date().toLocaleString('en-US', {
          timeZone: master[0].timezone
      });
      console.log("timezone",nDate);

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
      
      res.render("warehouse_test", {
          success: req.flash('success'),
          errors: req.flash('errors'),
          role : role_data,
          profile : profile_data,
          master_shop : master,
          timezones,
          language : lan_data,
          warehouse: warehouse_data
      }) 
  } catch (error) {
      console.log(error);
      res.status(200).json( { message: error.message } )
  }
})

module.exports = router