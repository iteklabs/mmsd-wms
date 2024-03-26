const express = require("express");
const res = require("express/lib/response");
const app = express();
const router = express.Router();
const multer = require('multer');
const { profile, master_shop, categories, brands, units, product, purchases, warehouse, sales_finished, sales, transfers_finished, adjustment_finished, purchases_finished, sales_return_finished, adjustment, transfers, supervisor_settings } = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");
const excelJS = require("exceljs");
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const blobStream  = require('blob-stream');



function formatTime(timeString) {
  // console.log(typeof timeString)
  if(typeof timeString == "undefined"){
    return "N/A";
  }else{
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM " : " PM ");
  }
  
}


function formatNumber(number) {
  if (Number.isInteger(number)) {
    return number.toString(); // Convert whole number to a string
  } else {
    return number.toFixed(2); // Display number with 2 decimal places
  }
}


// router.get("/PDF/:id", auth, async (req, res) => {
//     try {
//         const { username, email, role } = req.user;
//         const role_data = req.user;

//         const profile_data = await profile.findOne({ email: role_data.email });

//         const master = await master_shop.find();

//         const _id = req.params.id;
//         const user_id = await sales_finished.findById(_id);

//         const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
//         doc.undash();

//         res.setHeader('Content-disposition', 'inline; filename="'+user_id.invoice+'.pdf"');
//         res.setHeader('Content-type', 'application/pdf');
//         var x=0;
//         var y=0;
//         var x1 =10;
//         var y1 = 20;

//         doc.pipe(res);


//         doc.image('./public/upload/JDI Logo.jpg', 20, 0, {fit: [100, 100]})

//         doc
//         .fontSize(10)
//         .font('Helvetica-Bold')
//         .text('JOB ORDER - '+ user_id.customer, x+=190, y+=10);
        
//         doc
//         .fontSize(9)
//         .text('Name of Client', x+=80, y+=25);

//         doc
//         .fontSize(9)
//         .text(user_id.customer, x+150, y-3);

//         doc
//         .fontSize(9)
//         .text('J.O. #', x, y+=13);


//         doc
//         .fontSize(9)
//         .text(user_id.invoice, x+150, y-3);

        

//         doc.moveTo(x+100, y+5); // Move to the starting point
//         doc.lineTo(x+310, y+5); // Draw a line to the ending point
//         doc.stroke();


        

//         doc
//         .fontSize(9)
//         .text('J.O. Date', x, y+=13);

//         doc
//         .fontSize(9)
//         .text(user_id.date, x+150, y-3);

//         doc.moveTo(x+100, y+5); // Move to the starting point
//         doc.lineTo(x+310, y+5); // Draw a line to the ending point
//         doc.stroke();

//         doc
//         .fontSize(9)
//         .text('Requested By', x, y+=23);

//         doc.moveTo(x+100, y+5); // Move to the starting point
//         doc.lineTo(x+310, y+5); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.RequestedBy, x+150, y-3);


//         doc
//         .fontSize(9)
//         .text('Date of Request', x, y+=13);

//         doc.moveTo(x+100, y+5); // Move to the starting point
//         doc.lineTo(x+310, y+5); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.DateofRequest, x+150, y-3);


//         doc
//         .fontSize(9)
//         .text('PO Number', x, y+=13);

//         doc.moveTo(x+100, y+5); // Move to the starting point
//         doc.lineTo(x+310, y+5); // Draw a line to the ending point
//         doc.stroke();


//         doc
//       .fontSize(9)
//       .text(user_id.PO_number, x+150, y-3);

        

//         doc.dash(4, { space: 1 }); // Adjust the numbers for the desired dash length and space

//         // Draw the horizontal line
//         doc.moveTo(x1, y1+=y); // Starting point
//         doc.lineTo(x1+570, y1); // Ending point
//         doc.stroke();


//         doc
//         .fontSize(9)
//         .text('JOB DETAILS', x, y1+=3);

//         doc.moveTo(x1, y1+=10); // Starting point
//         doc.lineTo(x1+570, y1); // Ending point
//         doc.stroke();

//         doc.undash();


//         doc
//         .fontSize(9)
//         .text('TYPE OF SERVICES', x1, y1+=13);


//         doc
//         .fontSize(9)
//         .text(':', x1+90, y1);

//         var x3, y3;
//         if (user_id.typeservices == "F") {
//           x3 = x1+104;
//           y3 = y1+3;
//         }else if(user_id.typeservices == "HI"){
//           x3 = x1+405; //164
//           y3 = y1+3;

//         }else if(user_id.typeservices == "S"){
//           x3 = x1+244;
//           y3 = y1+3;

//         }else if(user_id.typeservices == "PA"){
//           x3 = x1+325;
//           y3 = y1+3;

//         }else if(user_id.typeservices == "OTH"){
//           x3 = x1+115;
//           y3 = y1+3;

//         }
//         if(x3 > 0 && y3 > 0 ){
//           doc
//             .fontSize(9)
//             .text("X", x3, y3);
//         }

//         // // Define the outer rectangle
//         // doc.rect(50, 50, 300, 100).stroke(); // (x, y, width, height)

//         // Define the inner rectangle
//         doc.rect(x1+100, y1, 55, 12).stroke(); // (x, y, width, height)

//         const checkboxSize = 12;
//         doc.rect(x1+100, y1, checkboxSize, checkboxSize).stroke()


//         doc.fontSize(9);
//         doc.text('Freight', x1+115, y1+3, { width: 130 }); // (text, x, y, options)


//         // Define the inner rectangle
//         doc.rect(x1+160, y1, 70, checkboxSize).stroke(); // (x, y, width, height)
//         doc.rect(x1+160, y1, checkboxSize, checkboxSize).stroke()
//         doc.fontSize(9);
//         doc.text('Handling In', x1+175, y1+3, { width: 130 }); // (text, x, y, options)


//         // Define the inner rectangle
//         doc.rect(x1+240, y1, 70, checkboxSize).stroke(); // (x, y, width, height)
//         doc.rect(x1+240, y1, checkboxSize, checkboxSize).stroke()
//         doc.fontSize(9);
//         doc.text('Stripping', x1+260, y1+3, { width: 130 }); // (text, x, y, options)


//         doc.rect(x1+320, y1, 70, checkboxSize).stroke(); // (x, y, width, height)
//         doc.rect(x1+320, y1, checkboxSize, checkboxSize).stroke()
//         doc.fontSize(9);
//         doc.text('PUT AWAY', x1+340, y1+3, { width: 130 }); // (text, x, y, options)

//         doc.rect(x1+400, y1, 70, checkboxSize).stroke(); // (x, y, width, height)
//         doc.rect(x1+400, y1, checkboxSize, checkboxSize).stroke()
//         doc.fontSize(9);
//         doc.text('Others', x1+420, y1+3, { width: 130 }); // (text, x, y, options)
        

//         doc
//         .fontSize(9)
//         .text('TYPE OF VEHICLE', x1, y1+=20);

//         doc.moveTo(x1+100, y1+10); // Move to the starting point
//         doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
//         doc.stroke();

//         doc
//         .fontSize(9)
//         .text(':', x1+90, y1);
//         doc
//       .fontSize(9)
//       .text(user_id.typevehicle, x1+120, y1);


//         doc
//         .fontSize(9)
//         .text('DESTINATION', x1, y1+=15);

//         doc
//         .fontSize(9)
//         .text(':', x1+90, y1);

//         doc
//         .fontSize(9)
//         .text(user_id.destination, x1+120, y1);

//         doc.moveTo(x1+100, y1+10); // Move to the starting point
//         doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
//         doc.stroke();


//         doc
//         .fontSize(9)
//         .text('PICK UP/DELIVERY DATE', x, y+=68);
//         doc.moveTo(x+100, y+8); // Move to the starting point
//         doc.lineTo(x+310, y+8); // Draw a line to the ending point
//         doc.stroke();

//         doc
//         .fontSize(9)
//         .text(user_id.deliverydate, x+150, y);


//         doc
//         .fontSize(9)
//         .text('NAME OF TRUCKER/DRIVER', x, y+=20);
//         doc.moveTo(x+100, y+8); // Move to the starting point
//         doc.lineTo(x+310, y+8); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.driver, x+150, y);

//         doc
//         .fontSize(9)
//         .text('PLATE #', x, y+=15);
//         doc.moveTo(x+100, y+8); // Move to the starting point
//         doc.lineTo(x+310, y+8); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.plate, x+150, y);

//         doc
//         .fontSize(9)
//         .text('VAN/SEAL #', x, y+=20);

//         doc.moveTo(x+100, y+8); // Move to the starting point
//         doc.lineTo(x+310, y+8); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.van, x+150, y);

//         doc
//         .fontSize(9)
//         .text('D.R. /S.I. #', x, y+=15);

//         doc.moveTo(x+100, y+8); // Move to the starting point
//         doc.lineTo(x+310, y+8); // Draw a line to the ending point
//         doc.stroke();

//         doc
//       .fontSize(9)
//       .text(user_id.DRSI, x+150, y);

//         const table = {
//             headers: [
//               { label: "MATERIAL CODE", property: 'itemcode', width: 60, renderer: null },
//               { label: "MATERIAL DESCRIPTION", property: 'itemdescription', width: 165, renderer: null },
//               { label: "CBM", property: 'CBM', width: 40, renderer: null },
//               { label: "LOT#", property: 'LOT', width: 40, renderer: null },
//               { label: "UOM", property: 'unit', width: 40, renderer: null },
//               { label: "QTY", property: 'qty', width: 60, renderer: null },
//               // { label: "NO. OF BOX", property: 'nobox', width: 40, renderer: null },
//               { label: "BATCH NO.", property: 'batchno', width: 63, renderer: null },
//               { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
//             ],
//             datas: [],
//           };
//           var totalQTY = 0; 
//           let warecode = "";
//           var totalPerUnit =0;
//           var totalPCS = 0;
//           var palletsno= 0;
//           user_id.sale_product.forEach((ProductDetl) => {

//             let dataUnit = '';
            
//             const qtydata = ProductDetl.quantity;
//             for (let index = 1; index <= qtydata; index++) {
              
//               if(qtydata == index){
//                 dataUnit += ProductDetl.maxperunit;
//               }else{
//                 dataUnit += ProductDetl.maxperunit+',';
//               }
              
              
//               totalPerUnit +=ProductDetl.maxperunit;
//               totalPCS += ProductDetl.maxperunit
//             }
            
//             // dataUnit += ' / ' + ProductDetl.secondary_unit ;
//             const rowData = {
//               itemcode: ProductDetl.product_code,
//               itemdescription: ProductDetl.product_name,
//               qty: ProductDetl.quantity,
//               unit: ProductDetl.unit,
//               proddate: ProductDetl.production_date,
//               batchno: ProductDetl.batch_code,
//               binloc: ProductDetl.isle+ProductDetl.pallet,
//             };
//             totalQTY += ProductDetl.quantity
//             palletsno += 1; 
//             table.datas.push(rowData);
//           });

         
//           let number = 14-table.datas.length;

//           for(var x = 1; x <= number; x++){

//             var rowData;
//             if(x == 1){
//               rowData = {

              
//                 itemcode: "",
//                 itemdescription: "",
//                 nobox: "",
//                 unit: "",
//                 qty:"",
//                 proddate: "",
//                 batchno: "",
//                 binloc: ""
//               };
  

//             }else{
//               rowData = {

              
//                 itemcode: "",
//                 itemdescription: "",
//                 nobox: "",
//                 unit: "",
//                 qty:"",
//                 proddate: "",
//                 batchno: "",
//                 binloc: ""
//               };
  
//             }

            
            
//             table.datas.push(rowData);
//           }

     

//         doc.table(table, {
//             x: x1,
//             y: y+=25,
//             prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
//             prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
            
           
//           });
//           var lastTableY = doc.page.height -300
//           var lastTableX = doc.x
 

//           doc
//           .fontSize(9)
//           .text('NUMBER OF PALLETS', lastTableX, lastTableY);

          

//           doc
//           .fontSize(9)
//           .text(':', lastTableX+100, lastTableY);


//           doc
//           .fontSize(9)
//           .text(palletsno, lastTableX+150, lastTableY);

//           doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();


//           doc
//           .fontSize(9)
//           .text('NUMBER OF CARTONS', lastTableX+270, lastTableY);

//           doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();

//           doc
//           .fontSize(9)
//           .text(totalQTY, lastTableX+400, lastTableY);


//           doc
//           .fontSize(9)
//           .text('NUMBER OF CBM', lastTableX, lastTableY+=13);

//           doc
//           .fontSize(9)
//           .text(':', lastTableX+100, lastTableY);

//           doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();



          


//           doc
//           .fontSize(9)
//           .text('NUMBER OF PCS', lastTableX+270, lastTableY);
//           doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();

//           doc
//           .fontSize(9)
//           .text(totalPCS, lastTableX+400, lastTableY);



//           doc
//           .fontSize(9)
//           .text('TIME START UNLOADING', lastTableX, lastTableY+=50);

//           doc
//           .fontSize(9)
//           .text(':', lastTableX+110, lastTableY);

//           doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();

//           doc
//           .fontSize(9)
//           .text('TIME FINISH UNLOADING', lastTableX, lastTableY+=20);

//           doc
//           .fontSize(9)
//           .text(':', lastTableX+110, lastTableY);

//           doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
//           doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
//           doc.stroke();



//           doc.rect(lastTableX+235, lastTableY-50, (lastTableX+660)/2, 120).stroke(); // (x, y, width, height)


//           doc.rect(lastTableX, lastTableY+75, lastTableX+565, 20).stroke(); // (x, y, width, height)

//           doc
//           .fontSize(9)
//           .text('NOTE: THE ABOVE STOCKS ARE RECEIVED IN GOOD CONDITION', lastTableX+=155, lastTableY+=82);


//           doc
//           .fontSize(9)
//           .text('Checked by:', lastTableX-=155, lastTableY+=25);


//           doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
//           doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
//           doc.stroke();


//           doc
//           .fontSize(9)
//           .text('Checker', lastTableX+35, lastTableY+=35);


//           doc
//           .fontSize(9)
//           .text('Counter Checked by:', lastTableX+=150, lastTableY-=35);

//           doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
//           doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
//           doc.stroke();


//           doc
//           .fontSize(9)
//           .text('Guard on duty', lastTableX+20, lastTableY+=35);


//           doc
//           .fontSize(9)
//           .text('Checked by:', lastTableX+=150, lastTableY-=35);

//           doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
//           doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
//           doc.stroke();


//           doc
//           .fontSize(9)
//           .text('Truck Driver Signature', lastTableX, lastTableY+=35);



//           doc
//           .fontSize(9)
//           .text('Noted by:', lastTableX+=150, lastTableY-=35);

//           doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
//           doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
//           doc.stroke();


//           doc
//           .fontSize(9)
//           .text('Warehouse Supervisor', lastTableX, lastTableY+=35);


//         let pages = doc.bufferedPageRange();

//         // let pages = doc.bufferedPageRange();
//         for (let i = 0; i < pages.count; i++) {
//         doc.switchToPage(i);

//         //Footer: Add page number
//         let oldBottomMargin = doc.page.margins.bottom;
//         doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
//         doc
//             .text(
//             `Page: ${i + 1} of ${pages.count}`,
//             0,
//             doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
//             { align: 'center' }
//             );
//         doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
//         }
      
        
//         const lasttextY = doc.y
//         const lasttextX = doc.x


//         // Finalize the PDF
//         doc.end();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("An error occurred while generating the PDF.");
//     }
// });

router.get("/PDF/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });
      const supervisor_data = await supervisor_settings.find();
      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await sales_finished.findById(_id);
      var Title;
      var SubTitle;
      Title = "Picking List";
      SubTitle = "(OUTGOING)";
      if(user_id.finalize == "True"){
       Title = "Outgoing";
       SubTitle ="";

      }
      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('JAKA Distribution Incorporated', x, y);
      // doc
      // .fontSize(10)
      // .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text(SubTitle, x, y+=20);

      doc
      .fontSize(9)
      .text('Warehouse ', x, y+=40);

      doc
      .fontSize(9)
      .text(' : '+user_id.warehouse_name, x+63, y);
      
      // doc
      // .fontSize(9)
      // .text('Customer : ' + user_id.customer, 400, 210, { underline: true });
      // doc
      // .fontSize(9)
      // .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date ', x, y+=11);


      doc
      .fontSize(9)
      .text(' : '+user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : '+user_id.invoice, x+63, y);


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 170, renderer: null },
            { label: "Quantity", property: 'qty', width: 60, renderer: null },
            { label: "UOM", property: 'unit', width: 60, renderer: null },
            // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
            { label: "Production Date", property: 'proddate', width: 80, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        if(user_id.to_warehouse == "DRY GOODS"){
          warecode = "DG";
        }else{
          warecode = "FG";
        }
        user_id.sale_product.forEach((ProductDetl) => {
          var prod_cat = ProductDetl.prod_cat;
          var Unit, TotalQTYS ;
          Unit = ProductDetl.unit;
          TotalQTYS = ProductDetl.quantity;
          if(prod_cat == "S"){
            
            Unit = ProductDetl.secondary_unit;
            TotalQTYS = ProductDetl.quantity * ProductDetl.maxperunit
          }
          const rowData = {

            
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: TotalQTYS,
            unit: Unit,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.isle+ProductDetl.pallet,
          };
          totalQTY += TotalQTYS
          
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x

        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY: ", lastTableX, lastTableY+=300);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+215, lastTableY,{ underline: true});

      doc
      .fontSize(10)
      .text('Picked By   : ', lastTableX, lastTableY+=25);


      doc
      .fontSize(10)
      .text(" ".repeat(60), lastTableX+62, lastTableY,{ underline: true});

      


      doc
      .fontSize(10)
      .text("Checked By: ", lastTableX, lastTableY+=50);

      doc
        .fontSize(10)
        .text("      "+supervisor_data[0].RMSName+"              ", lastTableX+60, lastTableY,{ underline: true});
        
        doc
        .fontSize(10)
        .text("Warehouse Supervisor", lastTableX+60, lastTableY+12);

      // doc
      // .fontSize(10)
      // .text("ARMAN CRUZ", lastTableX+60, lastTableY+30,{ underline: true});
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});

router.get("/PDFFinal/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });
      const supervisor_data = await supervisor_settings.find();
      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await sales_finished.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
      doc.undash();

      res.setHeader('Content-disposition', 'inline; filename="'+user_id.invoice+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=0;
      var y=0;
      var x1 =10;
      var y1 = 20;

      doc.pipe(res);


      doc.image('./public/upload/JDI Logo.jpg', 20, 0, {fit: [100, 100]})

      doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('JOB ORDER - '+ user_id.customer, x+=190, y+=10);
      
      doc
      .fontSize(9)
      .text('Name of Client', x+=80, y+=25);


      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.customer, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('J.O. #', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc
      .fontSize(9)
      .text(user_id.invoice, x+150, y-3);

      

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      

      doc
      .fontSize(9)
      .text('J.O. Date', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.date, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('Requested By', x, y+=23);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.RequestedBy, x+150, y-3);


      doc
      .fontSize(9)
      .text('Date of Request', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DateofRequest, x+150, y-3);


      doc
      .fontSize(9)
      .text('PO Number', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      doc
    .fontSize(9)
    .text(user_id.PO_number, x+150, y-3);

      

      doc.dash(4, { space: 1 }); // Adjust the numbers for the desired dash length and space

      // Draw the horizontal line
      doc.moveTo(x1, y1+=y); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('JOB DETAILS', x, y1+=3);

      doc.moveTo(x1, y1+=10); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();

      doc.undash();


      doc
      .fontSize(9)
      .text('TYPE OF SERVICES', x1, y1+=13);


      doc
      .fontSize(9)
      .text(':', x1+90, y1);



      doc.fontSize(9);
      doc.text(user_id.typeservices, x1+110, y1); // (text, x, y, options)

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+570, y1+10); // Draw a line to the ending point
      doc.stroke();
      

      doc
      .fontSize(9)
      .text('TYPE OF VEHICLE', x1, y1+=20);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(':', x1+90, y1);
      doc
    .fontSize(9)
    .text(user_id.typevehicle, x1+120, y1);


      doc
      .fontSize(9)
      .text('DESTINATION', x1, y1+=15);

      doc
      .fontSize(9)
      .text(':', x1+90, y1);

      doc
      .fontSize(9)
      .text(user_id.destination, x1+120, y1);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('PICK UP/DELIVERY DATE', x, y+=68);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.deliverydate, x+150, y);


      doc
      .fontSize(9)
      .text('NAME OF TRUCKER/DRIVER', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      

      doc
    .fontSize(9)
    .text(user_id.driver, x+150, y);

      doc
      .fontSize(9)
      .text('PLATE #', x, y+=15);


      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.plate, x+150, y);

      doc
      .fontSize(9)
      .text('VAN/SEAL #', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);

      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.van, x+150, y);

      doc
      .fontSize(9)
      .text('D.R. /S.I. #', x, y+=15);


      doc
      .fontSize(9)
      .text(':', x+130, y);

      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DRSI, x+150, y);

      const table = {
          headers: [
            { label: "MATERIAL CODE", property: 'itemcode', width: 60, renderer: null },
            { label: "MATERIAL DESCRIPTION", property: 'itemdescription', width: 165, renderer: null },
            { label: "CBM", property: 'CBM', width: 40, renderer: null },
            { label: "LOT#", property: 'LOT', width: 40, renderer: null },
            { label: "UOM", property: 'unit', width: 40, renderer: null },
            { label: "QTY", property: 'qty', width: 60, renderer: null },
            // { label: "NO. OF BOX", property: 'nobox', width: 40, renderer: null },
            { label: "BATCH NO.", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        var totalPCS = 0;
        var palletsno= 0;
        var TotalCBM = 0;
        var totalSecondary =0;
        user_id.sale_product.forEach((ProductDetl) => {

          var Units;       
          Units = ProductDetl.unit
          totalPerUnit = ProductDetl.quantity
          if(ProductDetl.prod_cat == "S"){
            Units = ProductDetl.secondary_unit
            totalPerUnit = ProductDetl.quantity * ProductDetl.maxperunit
          }
          
          // dataUnit += ' / ' + ProductDetl.secondary_unit ;
          var cbm = ProductDetl.quantity * ProductDetl.CBM
          const rowData = {
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: formatNumber(totalPerUnit),
            unit: Units,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.isle+ProductDetl.pallet,
            CBM: cbm.toFixed(3)
          };
          // totalQTY += ProductDetl.quantity
          if(ProductDetl.prod_cat == "S"){
            totalSecondary += ProductDetl.quantity * ProductDetl.maxperunit
          }else{
            totalQTY += ProductDetl.quantity
          }
          palletsno += 1; 
          TotalCBM += cbm
          table.datas.push(rowData);
        });

       
        let number = 14-table.datas.length;

        for(var x = 1; x <= number; x++){

          var rowData;
          if(x == 1){
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };


          }else{
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };

          }

          
          
          table.datas.push(rowData);
        }

   

      doc.table(table, {
          x: x1,
          y: y+=25,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.page.height -300
        var lastTableX = doc.x


        doc
        .fontSize(9)
        .text('NUMBER OF PALLETS', lastTableX, lastTableY);

        

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);


        doc
        .fontSize(9)
        .text(formatNumber(palletsno), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('NUMBER OF CARTONS', lastTableX+270, lastTableY);

        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalQTY), lastTableX+400, lastTableY);


        doc
        .fontSize(9)
        .text('NUMBER OF CBM', lastTableX, lastTableY+=13);

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);

        doc
        .fontSize(9)
        .text(TotalCBM.toFixed(3), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        


        doc
        .fontSize(9)
        .text('NUMBER OF PCS', lastTableX+270, lastTableY);
        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalSecondary), lastTableX+400, lastTableY);


        const StartUnloading = formatTime(user_id.TSU);
        const FinishUnloading = formatTime(user_id.TFU);

        
        doc
        .fontSize(9)
        .text('TIME START LOADING', lastTableX, lastTableY+=50);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(StartUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text('TIME FINISH LOADING', lastTableX, lastTableY+=20);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(FinishUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        doc.rect(lastTableX+235, lastTableY-50, (lastTableX+660)/2, 120).stroke(); // (x, y, width, height)


        doc.rect(lastTableX, lastTableY+75, lastTableX+565, 20).stroke(); // (x, y, width, height)

        doc
        .fontSize(9)
        .text('NOTE: THE ABOVE STOCKS ARE RECEIVED IN GOOD CONDITION', lastTableX+=155, lastTableY+=82);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX-=155, lastTableY+=25);


        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Checker', lastTableX+35, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Counter Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Guard on duty', lastTableX+20, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Truck Driver Signature', lastTableX, lastTableY+=35);



        doc
        .fontSize(9)
        .text('Noted by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text(supervisor_data[0].RMSName, lastTableX+5, lastTableY+20);


        doc
        .fontSize(9)
        .text('Warehouse Supervisor', lastTableX, lastTableY+=35);


      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x


      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});


router.get("/PDF_transfer/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });
      const supervisor_data = await supervisor_settings.find();
      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await transfers_finished.findById(_id);
      var Title;
      var SubTitle;
      Title = "Picking List";
      SubTitle = "(STOCKS TRANSFER)";
      if(user_id.finalize == "True"){
       Title = "STOCKS TRANSFER";
       SubTitle ="";

      }
      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('JAKA Distribution Incorporated', x, y);
      // doc
      // .fontSize(10)
      // .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text(SubTitle, x, y+=20);


      doc
      .fontSize(9)
      .text('From Warehouse ', x, y+=40);

      doc
      .fontSize(9)
      .text('   : '+user_id.to_warehouse, x+63, y);

      doc
      .fontSize(9)
      .text('To Warehouse ', x, y+=10);

      doc
      .fontSize(9)
      .text('   : '+user_id.to_warehouse, x+63, y);
      
  
      doc
      .fontSize(9)
      .text('Date ', x, y+=11);


      doc
      .fontSize(9)
      .text('   : '+user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);

      doc
      .fontSize(9)
      .text('   : '+user_id.invoice, x+63, y);


      const table1 = {
        headers: [
          { label: "", property: 'itemcode', width: 443, renderer: null, textCenter: true },
          { label: "  FROM", property: 'itemcode', width: 63, renderer: null, textCenter: true },
          { label: "  TO", property: 'itemdescription', width: 63, renderer: null, textCenter: true  },
         
        ],
        datas: [],
      };

      doc.table(table1, {
        x: 5,
        y: 263,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
        
        
       
      });


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 150, renderer: null },
            { label: "Quantity", property: 'qty', width: 40, renderer: null },
            { label: "UOM", property: 'unit', width: 55, renderer: null },
            // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
            { label: "Production Date", property: 'proddate', width: 75, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'Frombinloc', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        if(user_id.to_warehouse == "DRY GOODS"){
          warecode = "DG";
        }else{
          warecode = "FG";
        }
        user_id.product.forEach((ProductDetl) => {
          var prod_cat = ProductDetl.prod_cat;
          var Unit, TotalQTYS ;
          Unit = ProductDetl.unit;
          TotalQTYS = ProductDetl.to_quantity;
          if(prod_cat == "S"){
            
            Unit = ProductDetl.secondary_unit;
            TotalQTYS = ProductDetl.to_quantity * ProductDetl.maxPerUnit
          }
          const rowData = {

            
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: TotalQTYS,
            unit: Unit,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.to_isle+ProductDetl.to_pallet,
            Frombinloc: ProductDetl.from_isle+ProductDetl.from_pallet
          };
          totalQTY += TotalQTYS
          
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 5,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x

        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY: ", lastTableX, lastTableY+=350);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+215, lastTableY,{ underline: true});

      doc
      .fontSize(10)
      .text('Picked By   : ', lastTableX, lastTableY+=25);


      doc
      .fontSize(10)
      .text(" ".repeat(60), lastTableX+62, lastTableY,{ underline: true});

      


      doc
      .fontSize(10)
      .text("Checked By: ", lastTableX, lastTableY+=50);

      doc
        .fontSize(10)
        .text("      "+supervisor_data[0].RMSName+"           ", lastTableX+60, lastTableY,{ underline: true});
        
        doc
        .fontSize(10)
        .text("Warehouse Supervisor", lastTableX+60, lastTableY+12);

      // doc
      // .fontSize(10)
      // .text("ARMAN CRUZ", lastTableX+60, lastTableY+30,{ underline: true});
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});
router.get("/PDF_transferFinal/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;
      const supervisor_data = await supervisor_settings.find();
      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await transfers_finished.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
      doc.undash();

      res.setHeader('Content-disposition', 'inline; filename="'+user_id.invoice+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=0;
      var y=0;
      var x1 =10;
      var y1 = 20;

      doc.pipe(res);


      doc.image('./public/upload/JDI Logo.jpg', 20, 0, {fit: [100, 100]})

      doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('JOB ORDER - Transfer', x+=190, y+=10);
      
      doc
      .fontSize(9)
      .text('Name of Client', x+=80, y+=25);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.customer, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('J.O. #', x, y+=13);


      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc
      .fontSize(9)
      .text(user_id.invoice, x+150, y-3);

      

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      

      doc
      .fontSize(9)
      .text('J.O. Date', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.date, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('Requested By', x, y+=23);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.RequestedBy, x+150, y-3);


      doc
      .fontSize(9)
      .text('Date of Request', x, y+=13);


      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DateofRequest, x+150, y-3);


      doc
      .fontSize(9)
      .text('PO Number', x, y+=13);


      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      doc
    .fontSize(9)
    .text(user_id.PO_number, x+150, y-3);

      

      doc.dash(4, { space: 1 }); // Adjust the numbers for the desired dash length and space

      // Draw the horizontal line
      doc.moveTo(x1, y1+=y); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('JOB DETAILS', x, y1+=3);

      

      doc.moveTo(x1, y1+=10); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();

      doc.undash();


      doc
      .fontSize(9)
      .text('TYPE OF SERVICES', x1, y1+=13);


      doc
      .fontSize(9)
      .text(':', x1+90, y1);

    
      
      doc.fontSize(9);
      doc.text(user_id.typeservices, x1+110, y1); // (text, x, y, options)

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+570, y1+10); // Draw a line to the ending point
      doc.stroke();
      
      doc
      .fontSize(9)
      .text('TYPE OF VEHICLE', x1, y1+=20);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(':', x1+90, y1);
      doc
    .fontSize(9)
    .text(user_id.typevehicle, x1+120, y1);


      doc
      .fontSize(9)
      .text('DESTINATION', x1, y1+=15);

      doc
      .fontSize(9)
      .text(':', x1+90, y1);

      doc
      .fontSize(9)
      .text(user_id.destination, x1+120, y1);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('PICK UP/DELIVERY DATE', x, y+=68);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.deliverydate, x+150, y);


      doc
      .fontSize(9)
      .text('NAME OF TRUCKER/DRIVER', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);



      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.driver, x+150, y);

      doc
      .fontSize(9)
      .text('PLATE #', x, y+=15);

      doc
      .fontSize(9)
      .text(':', x+130, y);



      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.plate, x+150, y);

      doc
      .fontSize(9)
      .text('VAN/SEAL #', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.van, x+150, y);

      doc
      .fontSize(9)
      .text('D.R. /S.I. #', x, y+=15);
      
      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DRSI, x+150, y);

      const table = {
          headers: [
            { label: "MATERIAL CODE", property: 'itemcode', width: 60, renderer: null },
            { label: "MATERIAL DESCRIPTION", property: 'itemdescription', width: 165, renderer: null },
            { label: "CBM", property: 'CBM', width: 40, renderer: null },
            { label: "LOT#", property: 'LOT', width: 40, renderer: null },
            { label: "UOM", property: 'unit', width: 40, renderer: null },
            { label: "QTY", property: 'qty', width: 60, renderer: null },
            // { label: "NO. OF BOX", property: 'nobox', width: 40, renderer: null },
            { label: "BATCH NO.", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        var totalPCS = 0;
        var palletsno= 0;
        var TotalCBM = 0;
        var totalSecondary = 0;
        user_id.product.forEach((ProductDetl) => {

          var Units;       
          Units = ProductDetl.unit
          totalPerUnit = ProductDetl.to_quantity
          if(ProductDetl.prod_cat == "S"){
            Units = ProductDetl.secondary_unit
            totalPerUnit = ProductDetl.to_quantity * ProductDetl.maxPerUnit
          }


          var cbm = ProductDetl.to_quantity * ProductDetl.CBM
          const rowData = {
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: formatNumber(totalPerUnit),
            unit: Units,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.to_isle+ProductDetl.to_pallet,
            CBM: cbm.toFixed(3)
          };
          // totalQTY += ProductDetl.to_quantity
          if(ProductDetl.prod_cat == "S"){
            totalSecondary += ProductDetl.to_quantity * ProductDetl.maxPerUnit
          }else{
            totalQTY += ProductDetl.to_quantity
          }
          palletsno += 1; 
          TotalCBM += cbm;
          table.datas.push(rowData);
        });

       
        let number = 14-table.datas.length;

        for(var x = 1; x <= number; x++){

          var rowData;
          if(x == 1){
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };


          }else{
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };

          }

          
          
          table.datas.push(rowData);
        }

   

      doc.table(table, {
          x: x1,
          y: y+=25,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.page.height -300
        var lastTableX = doc.x


        doc
        .fontSize(9)
        .text('NUMBER OF PALLETS', lastTableX, lastTableY);

        

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);


        doc
        .fontSize(9)
        .text(formatNumber(palletsno), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('NUMBER OF CARTONS', lastTableX+270, lastTableY);

        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalQTY), lastTableX+400, lastTableY);


        doc
        .fontSize(9)
        .text('NUMBER OF CBM', lastTableX, lastTableY+=13);

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);

        doc
        .fontSize(9)
        .text(TotalCBM.toFixed(3), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        

        


        doc
        .fontSize(9)
        .text('NUMBER OF PCS', lastTableX+270, lastTableY);
        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalSecondary), lastTableX+400, lastTableY);


        const StartUnloading = formatTime(user_id.TSU);
        const FinishUnloading = formatTime(user_id.TFU);



        doc
        .fontSize(9)
        .text('TIME START LOADING', lastTableX, lastTableY+=50);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(StartUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text('TIME FINISH LOADING', lastTableX, lastTableY+=20);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(FinishUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        doc.rect(lastTableX+235, lastTableY-50, (lastTableX+660)/2, 120).stroke(); // (x, y, width, height)


        doc.rect(lastTableX, lastTableY+75, lastTableX+565, 20).stroke(); // (x, y, width, height)

        doc
        .fontSize(9)
        .text('NOTE: THE ABOVE STOCKS ARE RECEIVED IN GOOD CONDITION', lastTableX+=155, lastTableY+=82);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX-=155, lastTableY+=25);


        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Checker', lastTableX+35, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Counter Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Guard on duty', lastTableX+20, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Truck Driver Signature', lastTableX, lastTableY+=35);



        doc
        .fontSize(9)
        .text('Noted by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(supervisor_data[0].RMSName, lastTableX+5, lastTableY+20);


        doc
        .fontSize(9)
        .text('Warehouse Supervisor', lastTableX, lastTableY+=35);


      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x


      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});


router.get("/PDF_adjustment/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });
      const supervisor_data = await supervisor_settings.find();
      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await adjustment_finished.findById(_id);
      var Title;
      var SubTitle;
      Title = "PICKING LIST";
      SubTitle = "(INVENTORY ADJUSTMENT)";
      if(user_id.finalize == "True"){
        Title = "INVENTORY ADJUSTMENT";
        SubTitle = "";

      }
      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('JAKA Distribution Incorporated', x, y);
      // doc
      // .fontSize(10)
      // .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text(SubTitle, x, y+=20);

      doc
      .fontSize(9)
      .text('Warehouse ', x, y+=40);

      doc
        .fontSize(9)
        .text(' : '+user_id.warehouse_name, x+63, y);
      
      // doc
      // .fontSize(9)
      // .text('Customer : ' + user_id.customer, 400, 210, { underline: true });
      // doc
      // .fontSize(9)
      // .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date ', x, y+=11);

      doc
        .fontSize(9)
        .text(' : '+user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : '+user_id.invoice, x+63, y);


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 150, renderer: null },
            { label: "Quantity", property: 'qty', width: 60, renderer: null },
            { label: "UOM", property: 'unit', width: 60, renderer: null },
            // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
            { label: "Production Date", property: 'proddate', width: 80, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        if(user_id.warehouse_name == "DRY GOODS"){
          warecode = "DG";
        }else{
          warecode = "FG";
        }
        user_id.product.forEach((ProductDetl) => {
       
        console.log(ProductDetl)
            
            var prod_cat = ProductDetl.prod_cat;
            var Unit, TotalQTYS ;
            Unit = ProductDetl.unit;
            TotalQTYS = ProductDetl.adjust_qty;
            if(prod_cat == "S"){
              
              Unit = ProductDetl.secondary_unit;
              TotalQTYS = ProductDetl.adjust_qty * ProductDetl.maxPerUnit
            }
          const rowData = {

            
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: TotalQTYS,
            unit: Unit,
            // unitConversion:dataUnit,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.isle+ProductDetl.pallet,
          };
          totalQTY += TotalQTYS
          
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x


        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY : ", lastTableX, lastTableY+=350);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+200, lastTableY);

      // doc
      // .fontSize(10)
      // .text(totalPerUnit, lastTableX+280, lastTableY,{ underline: true});

      


      doc
      .fontSize(10)
      .text("Checked By ", lastTableX, lastTableY+=50);


      doc
      .fontSize(10)
      .text(" : ", lastTableX + 55, lastTableY);

      doc
      .fontSize(10)
      .text("   "+supervisor_data[0].RMSName+"                ", lastTableX+60, lastTableY,{ underline: true});
        
        doc
        .fontSize(10)
        .text("Warehouse Supervisor", lastTableX+60, lastTableY+12);

      // doc
      // .fontSize(10)
      // .text("ARMAN CRUZ", lastTableX+60, lastTableY+30,{ underline: true});
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});

router.get("/PDF_adjustmentFinal/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });
      const supervisor_data = await supervisor_settings.find();
      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await adjustment_finished.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
      doc.undash();

      res.setHeader('Content-disposition', 'inline; filename="'+user_id.invoice+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=0;
      var y=0;
      var x1 =10;
      var y1 = 20;

      doc.pipe(res);


      doc.image('./public/upload/JDI Logo.jpg', 20, 0, {fit: [100, 100]})

      doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('JOB ORDER - Adjustment', x+=190, y+=10);
      
      doc
      .fontSize(9)
      .text('Name of Client', x+=80, y+=25);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.customer, x+150, y-3);

      doc
      .fontSize(9)
      .text('J.O. #', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc
      .fontSize(9)
      .text(user_id.invoice, x+150, y-3);

      

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      

      doc
      .fontSize(9)
      .text('J.O. Date', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.date, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('Requested By', x, y+=23);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.RequestedBy, x+150, y-3);


      doc
      .fontSize(9)
      .text('Date of Request', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DateofRequest, x+150, y-3);


      doc
      .fontSize(9)
      .text('PO Number', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      doc
    .fontSize(9)
    .text(user_id.PO_number, x+150, y-3);

      

      doc.dash(4, { space: 1 }); // Adjust the numbers for the desired dash length and space

      // Draw the horizontal line
      doc.moveTo(x1, y1+=y); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('JOB DETAILS', x, y1+=3);

      doc.moveTo(x1, y1+=10); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();

      doc.undash();


      doc
      .fontSize(9)
      .text('TYPE OF SERVICES', x1, y1+=13);


      doc
      .fontSize(9)
      .text(':', x1+90, y1);

      doc.fontSize(9);
      doc.text(user_id.typeservices, x1+110, y1); // (text, x, y, options)

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+570, y1+10); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('TYPE OF VEHICLE', x1, y1+=20);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(':', x1+90, y1);
      doc
    .fontSize(9)
    .text(user_id.typevehicle, x1+120, y1);


      doc
      .fontSize(9)
      .text('DESTINATION', x1, y1+=15);

      doc
      .fontSize(9)
      .text(':', x1+90, y1);

      doc
      .fontSize(9)
      .text(user_id.destination, x1+120, y1);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('PICK UP/DELIVERY DATE', x, y+=68);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.deliverydate, x+150, y);


      doc
      .fontSize(9)
      .text('NAME OF TRUCKER/DRIVER', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.driver, x+150, y);

      doc
      .fontSize(9)
      .text('PLATE #', x, y+=15);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.plate, x+150, y);

      doc
      .fontSize(9)
      .text('VAN/SEAL #', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);

      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.van, x+150, y);

      doc
      .fontSize(9)
      .text('D.R. /S.I. #', x, y+=15);

      doc
      .fontSize(9)
      .text(':', x+130, y);



      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
    .fontSize(9)
    .text(user_id.DRSI, x+150, y);

      const table = {
          headers: [
            { label: "MATERIAL CODE", property: 'itemcode', width: 60, renderer: null },
            { label: "MATERIAL DESCRIPTION", property: 'itemdescription', width: 165, renderer: null },
            { label: "CBM", property: 'CBM', width: 40, renderer: null },
            { label: "LOT#", property: 'LOT', width: 40, renderer: null },
            { label: "UOM", property: 'unit', width: 40, renderer: null },
            { label: "QTY", property: 'qty', width: 60, renderer: null },
            // { label: "NO. OF BOX", property: 'nobox', width: 40, renderer: null },
            { label: "BATCH NO.", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
        var totalPCS = 0;
        var palletsno= 0;
        var TotalCBM = 0;
        var totalSecondary =0;
        user_id.product.forEach((ProductDetl) => {

          var Units;       
          Units = ProductDetl.unit
          totalPerUnit = ProductDetl.adjust_qty
          if(ProductDetl.prod_cat == "S"){
            Units = ProductDetl.secondary_unit
            totalPerUnit = ProductDetl.adjust_qty * ProductDetl.maxPerUnit
          }
          

          var cbm = ProductDetl.adjust_qty*ProductDetl.CBM
          const rowData = {
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: formatNumber(totalPerUnit),
            unit: Units,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.isle+ProductDetl.pallet,
            CBM: cbm.toFixed(3)
          };
         
          if(ProductDetl.prod_cat == "S"){
            totalSecondary += ProductDetl.adjust_qty * ProductDetl.maxPerUnit
          }else{
            totalQTY += ProductDetl.adjust_qty
          }
          palletsno += 1; 
          TotalCBM += cbm;
          table.datas.push(rowData);
        });

       
        let number = 14-table.datas.length;

        for(var x = 1; x <= number; x++){

          var rowData;
          if(x == 1){
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };


          }else{
            rowData = {

            
              itemcode: "",
              itemdescription: "",
              nobox: "",
              unit: "",
              qty:"",
              proddate: "",
              batchno: "",
              binloc: ""
            };

          }

          
          
          table.datas.push(rowData);
        }

   

      doc.table(table, {
          x: x1,
          y: y+=25,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.page.height -300
        var lastTableX = doc.x


        doc
        .fontSize(9)
        .text('NUMBER OF PALLETS', lastTableX, lastTableY);

        

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);


        doc
        .fontSize(9)
        .text(formatNumber(palletsno), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('NUMBER OF CARTONS', lastTableX+270, lastTableY);

        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalQTY), lastTableX+400, lastTableY);


        doc
        .fontSize(9)
        .text('NUMBER OF CBM', lastTableX, lastTableY+=13);

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);


        doc
        .fontSize(9)
        .text(TotalCBM.toFixed(3), lastTableX+150, lastTableY);
        
        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        


        doc
        .fontSize(9)
        .text('NUMBER OF PCS', lastTableX+270, lastTableY);
        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalSecondary), lastTableX+400, lastTableY);

        const StartUnloading = formatTime(user_id.TSU);
        const FinishUnloading = formatTime(user_id.TFU);

        doc
        .fontSize(9)
        .text('TIME START UNLOADING', lastTableX, lastTableY+=50);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(StartUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text('TIME FINISH UNLOADING', lastTableX, lastTableY+=20);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(FinishUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        doc.rect(lastTableX+235, lastTableY-50, (lastTableX+660)/2, 120).stroke(); // (x, y, width, height)


        doc.rect(lastTableX, lastTableY+75, lastTableX+565, 20).stroke(); // (x, y, width, height)

        doc
        .fontSize(9)
        .text('NOTE: THE ABOVE STOCKS ARE RECEIVED IN GOOD CONDITION', lastTableX+=155, lastTableY+=82);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX-=155, lastTableY+=25);


        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Checker', lastTableX+35, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Counter Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Guard on duty', lastTableX+20, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Truck Driver Signature', lastTableX, lastTableY+=35);



        doc
        .fontSize(9)
        .text('Noted by:', lastTableX+=150, lastTableY-=35);

        doc
        .fontSize(9)
        .text(supervisor_data[0].RMSName, lastTableX+5, lastTableY+20);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Warehouse Supervisor', lastTableX, lastTableY+=35);


      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x


      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});



router.get("/pdf_puchases_fin/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();
      const supervisor_data = await supervisor_settings.find();
      const _id = req.params.id;
      const user_id = await purchases_finished.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=0;
      var y=0;
      var x1 =10;
      var y1 = 20;

      doc.pipe(res);


      doc.image('./public/upload/JDI Logo.jpg', 20, 0, {fit: [100, 100]})

      doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('JOB ORDER - ' + user_id.suppliers, x+=190, y+=10);
      
      doc
      .fontSize(9)
      .text('Name of Client', x+=80, y+=25);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.suppliers, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('J.O. #', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc
      .fontSize(9)
      .text(user_id.invoice, x+150, y-3);

      

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      

      doc
      .fontSize(9)
      .text('J.O. Date', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.date, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text('Requested By', x, y+=23);
      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.RequestedBy, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('Date of Request', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);


      doc
      .fontSize(9)
      .text(user_id.DateofRequest, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('PO Number', x, y+=13);

      doc
      .fontSize(9)
      .text(":", x+80, y-3);

      doc
      .fontSize(9)
      .text(user_id.POnumber, x+150, y-3);

      doc.moveTo(x+100, y+5); // Move to the starting point
      doc.lineTo(x+310, y+5); // Draw a line to the ending point
      doc.stroke();
      

      doc.dash(4, { space: 1 }); // Adjust the numbers for the desired dash length and space

      // Draw the horizontal line
      doc.moveTo(x1, y1+=y); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('JOB DETAILS', x, y1+=3);

      doc.moveTo(x1, y1+=10); // Starting point
      doc.lineTo(x1+570, y1); // Ending point
      doc.stroke();

      doc.undash();


      doc
      .fontSize(9)
      .text('TYPE OF SERVICES', x1, y1+=13);


      doc
      .fontSize(9)
      .text(':', x1+90, y1);

      doc.fontSize(9);
      doc.text(user_id.typeservices, x1+110, y1); // (text, x, y, options)

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+570, y1+10); // Draw a line to the ending point
      doc.stroke();

     
      

      doc
      .fontSize(9)
      .text('TYPE OF VEHICLE', x1, y1+=20);

      doc
      .fontSize(9)
      .text(user_id.typevehicle, x1+120, y1);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();

      

      doc
      .fontSize(9)
      .text(':', x1+90, y1);


      doc
      .fontSize(9)
      .text('DESTINATION', x1, y1+=15);

      doc
      .fontSize(9)
      .text(':', x1+90, y1);


      doc
      .fontSize(9)
      .text(user_id.destination, x1+120, y1);

      doc.moveTo(x1+100, y1+10); // Move to the starting point
      doc.lineTo(x1+200, y1+10); // Draw a line to the ending point
      doc.stroke();


      doc
      .fontSize(9)
      .text('PICK UP/DELIVERY DATE', x, y+=68);


      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.deliverydate, x+150, y);


      doc
      .fontSize(9)
      .text('NAME OF TRUCKER/DRIVER', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.driver, x+150, y);

      doc
      .fontSize(9)
      .text('PLATE #', x, y+=15);

      doc
      .fontSize(9)
      .text(':', x+130, y);


      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.plate, x+150, y);


      doc
      .fontSize(9)
      .text('VAN/SEAL #', x, y+=20);

      doc
      .fontSize(9)
      .text(':', x+130, y);

      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.van, x+150, y);


      doc
      .fontSize(9)
      .text('D.R. /S.I. #', x, y+=15);

      doc
      .fontSize(9)
      .text(':', x+130, y);

      doc.moveTo(x+135, y+8); // Move to the starting point
      doc.lineTo(x+310, y+8); // Draw a line to the ending point
      doc.stroke();

      doc
      .fontSize(9)
      .text(user_id.DRSI, x+150, y);



      const table = {
          headers: [
            { label: "MATERIAL CODE", property: 'itemcode', width: 60, renderer: null },
            { label: "MATERIAL DESCRIPTION", property: 'itemdescription', width: 165, renderer: null },
            { label: "CBM", property: 'CBM', width: 40, renderer: null },
            { label: "LOT#", property: 'LOT', width: 40, renderer: null },
            { label: "UOM", property: 'unit', width: 40, renderer: null },
            { label: "QTY", property: 'qty', width: 70, renderer: null },
            // { label: "NO. OF BOX", property: 'nobox', width: 40, renderer: null },
            { label: "BATCH NO.", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalSecondary = 0;;
        var pallet = 0;
        var totalPCS = 0;
        var TotalCBM = 0;
        user_id.product.forEach((ProductDetl) => {

          let dataUnit = '';
          var totalPerUnit =  0;
          
          var Units;       
            Units = ProductDetl.standard_unit
            totalPerUnit = ProductDetl.quantity
            if(ProductDetl.product_cat == "S"){
              Units = ProductDetl.secondary_unit
              totalPerUnit = ProductDetl.quantity * ProductDetl.maxperunit
            }


          var cbm = ProductDetl.quantity*ProductDetl.CBM;
          const rowData = {
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: formatNumber(totalPerUnit) ,
            unit: Units,
            CBM: cbm.toFixed(3),
            expdate: ProductDetl.expiry_date,
            batchno: ProductDetl.batch_code,
            // binloc: ProductDetl.storage+ProductDetl.rack+ProductDetl.bay+ProductDetl.bin+ProductDetl.type[0]+ProductDetl.floorlevel,
            binloc: ProductDetl.isle+ProductDetl.pallet,
          };
          pallet += 1;

          if(ProductDetl.product_cat == "S"){
            totalSecondary += ProductDetl.quantity * ProductDetl.maxperunit
          }else{
            totalQTY += ProductDetl.quantity
          }
          
          
          TotalCBM +=cbm
          table.datas.push(rowData);
        });




        let number = 14-table.datas.length;

          for(var x = 1; x <= number; x++){

            var rowData;
            if(x == 1){
              rowData = {

              
                itemcode: "",
                itemdescription: "",
                // nobox: "",
                unit: "",
                qty:"",
                proddate: "",
                batchno: "",
                binloc: ""
              };
  

            }else{
              rowData = {

              
                itemcode: "",
                itemdescription: "",
                // nobox: "",
                unit: "",
                qty:"",
                proddate: "",
                batchno: "",
                binloc: ""
              };
  
            }

            
            
            table.datas.push(rowData);
          }

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        // var lastTableY = doc.y
        var lastTableY = doc.page.height -300
        var lastTableX = doc.x




        doc
        .fontSize(9)
        .text('NUMBER OF PALLETS', lastTableX, lastTableY);

        

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);


        doc
        .fontSize(9)
        .text(formatNumber(pallet), lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('NUMBER OF CARTONS', lastTableX+270, lastTableY);

        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalQTY), lastTableX+400, lastTableY);


        doc
        .fontSize(9)
        .text('NUMBER OF CBM', lastTableX, lastTableY+=13);

        doc
        .fontSize(9)
        .text(':', lastTableX+100, lastTableY);

        doc
        .fontSize(9)
        .text(TotalCBM.toFixed(3), lastTableX+150, lastTableY);

        

        doc.moveTo(lastTableX+105, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        


        doc
        .fontSize(9)
        .text('NUMBER OF PCS', lastTableX+270, lastTableY);
        doc.moveTo(lastTableX+380, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+570, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text(formatNumber(totalSecondary), lastTableX+400, lastTableY);



        
        doc
        .fontSize(9)
        .text('TIME START UNLOADING', lastTableX, lastTableY+=50);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        const StartUnloading = formatTime(user_id.TSU);
        const FinishUnloading = formatTime(user_id.TFU);

        doc
        .fontSize(9)
        .text(StartUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();

        doc
        .fontSize(9)
        .text('TIME FINISH UNLOADING', lastTableX, lastTableY+=20);

        doc
        .fontSize(9)
        .text(':', lastTableX+110, lastTableY);

        doc
        .fontSize(9)
        .text(FinishUnloading, lastTableX+150, lastTableY);

        doc.moveTo(lastTableX+115, lastTableY+10); // Move to the starting point
        doc.lineTo(lastTableX+210, lastTableY+10); // Draw a line to the ending point
        doc.stroke();



        doc.rect(lastTableX+235, lastTableY-50, (lastTableX+645)/2, 120).stroke(); // (x, y, width, height)


        doc.rect(lastTableX, lastTableY+75, lastTableX+547, 20).stroke(); // (x, y, width, height)

        doc
        .fontSize(9)
        .text('NOTE: THE ABOVE STOCKS ARE RECEIVED IN GOOD CONDITION', lastTableX+=155, lastTableY+=82);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX-=155, lastTableY+=25);


        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Checker', lastTableX+35, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Counter Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Guard on duty', lastTableX+20, lastTableY+=35);


        doc
        .fontSize(9)
        .text('Checked by:', lastTableX+=150, lastTableY-=35);

        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();


        doc
        .fontSize(9)
        .text('Truck Driver Signature', lastTableX, lastTableY+=35);



        doc
        .fontSize(9)
        .text('Noted by:', lastTableX+=150, lastTableY-=35);
       
        doc
        .fontSize(9)
        .text(supervisor_data[0].RMSName, lastTableX+5, lastTableY+20);

        
        doc.moveTo(lastTableX, lastTableY+30); // Move to the starting point
        doc.lineTo(lastTableX+100, lastTableY+30); // Draw a line to the ending point
        doc.stroke();
        

        doc
        .fontSize(9)
        .text('Warehouse Supervisor', lastTableX, lastTableY+=35);

       
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
}); 


router.get("/pdf_sales_return_fin/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await sales_return_finished.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=100;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('DELI MONDO FOOD SPECIALTIES INC.', x, y);
      doc
      .fontSize(10)
      .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text('PICKING LIST', x, y+=50);

      doc
      .fontSize(10)
      .text("(RETURN)", x, y+=30);

      doc
      .fontSize(9)
      .text('Warehouse : ' + user_id.ToWarehouse, x, y+=40);
      
      doc
      .fontSize(9)
      .text('Customer : ' + user_id.customer, 400, 210, { underline: true });
      doc
      .fontSize(9)
      .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date : ' + user_id.date, x, y+=11);

      doc
      .fontSize(9)
      .text('Control Number : ' + user_id.invoice, x, y+=11);


     

        
        var table = '';
        var rowData ='';
        var totalQTY = 0; 
        var warcode;
        console.log(user_id.warehouse_cat)
        if(user_id.warehouse_cat == "GS"){
          
          if(user_id.warehouse_name == "DRY GOODS"){
            warecode = "DG";
          }else{
            warecode = "FG";
          }


          table = {
            headers: [
              { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
              { label: "Item Description", property: 'itemdescription', width: 200, renderer: null },
              { label: "Quantity", property: 'qty', width: 60, renderer: null },
              { label: "UOM", property: 'unit', width: 60, renderer: null },
              // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
              { label: "Expiration Date", property: 'expdate', width: 80, renderer: null },
              { label: "Batch No", property: 'batchno', width: 63, renderer: null },
              { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
            ],
            datas: [],
          };
          
          // let warecode = "";

          user_id.return_sale.forEach((ProductDetl) => {

            let dataUnit = '';
            var totalPerUnit =  0;
            
            rowData = {
              itemcode: ProductDetl.product_code,
              itemdescription: ProductDetl.product_name,
              qty: ProductDetl.return_qty,
              unit: ProductDetl.unit,
              // unitConversion:dataUnit,
              expdate: ProductDetl.expiry_date,
              batchno: ProductDetl.batch_code,
              binloc: warecode+ProductDetl.bay,
            };
            totalQTY += ProductDetl.return_qty

            console.log(ProductDetl)
            table.datas.push(rowData);
          });

        }else{
          table = {
            headers: [
              { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
              { label: "Item Description", property: 'itemdescription', width: 200, renderer: null },
              { label: "Quantity", property: 'qty', width: 60, renderer: null },
              { label: "UOM", property: 'unit', width: 60, renderer: null },
              // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
              { label: "Expiration Date", property: 'expdate', width: 80, renderer: null },
              { label: "Batch No", property: 'batchno', width: 63, renderer: null },
              // { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
            ],
            datas: [],
          };


          user_id.return_sale_QA.forEach((ProductDetl) => {

            let dataUnit = '';
            var totalPerUnit =  0;
            
            rowData = {
              itemcode: ProductDetl.product_code,
              itemdescription: ProductDetl.product_name,
              qty: ProductDetl.return_qty,
              unit: ProductDetl.unit,
              expdate: ProductDetl.expiry_date,
              batchno: ProductDetl.batch_code,
              // binloc: ProductDetl.bay,
            };
            totalQTY += ProductDetl.return_qty
            console.log(totalQTY + " <> " + ProductDetl.return_qty)
            table.datas.push(rowData);
          });

        }
        

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x

        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY: ", lastTableX, lastTableY+=400);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+55, lastTableY,{ underline: true});


      doc
      .fontSize(10)
      .text("Check By: ", lastTableX, lastTableY+30);

      doc
      .fontSize(10)
      .text("ARMAN CRUZ", lastTableX+50, lastTableY+30,{ underline: true});

      
      
      let pages = doc.bufferedPageRange();

 
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
}); 





router.get("/pdf_puchases/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();
      const supervisor_data = await supervisor_settings.find();

      const _id = req.params.id;
      const user_id = await purchases.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('DELI MONDO FOOD SPECIALTIES INC.', x, y);
      doc
      .fontSize(10)
      .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text('RAW MATERIALS TRANSFER SLIP', x, y+=50);

      doc
      .fontSize(10)
      .text("(INCOMING)", x, y+=20);

      doc
      .fontSize(9)
      .text('Warehouse ', x, y+=45);

      doc
      .fontSize(9)
      .text(' : ' + user_id.warehouse_name, x+63, y);
      
      doc
      .fontSize(9)
      .text('Supplier : ' + user_id.suppliers, x+380, y, { underline: true });


      // doc
      // .fontSize(9)
      // .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : ' + user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);


      doc
      .fontSize(9)
      .text(' : ' + user_id.invoice, x+63, y);


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 180, renderer: null },
            { label: "Quantity", property: 'qty', width: 60, renderer: null },
            { label: "UOM", property: 'unit', width: 60, renderer: null },
            // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
            { label: "Expiration Date", property: 'expdate', width: 80, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
   
        user_id.product.forEach((ProductDetl) => {

          let dataUnit = '';
          var totalPerUnit =  0;
          // const qtydata = ProductDetl.quantity;
            // for (let index = 1; index <= qtydata; index++) {
              
            //   if(qtydata == index){
            //     dataUnit += ProductDetl.maxperunit;
            //   }else{
            //     dataUnit += ProductDetl.maxperunit+',';
            //   }
              
              
            //   totalPerUnit +=ProductDetl.maxperunit;
            // }
            // dataUnit += ' / ' + ProductDetl.secondary_unit ;
          
          const rowData = {
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: ProductDetl.quantity,
            unit: ProductDetl.standard_unit,
            // unitConversion:dataUnit,
            expdate: ProductDetl.expiry_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.storage+ProductDetl.rack+ProductDetl.bay+ProductDetl.bin+ProductDetl.type[0]+ProductDetl.floorlevel,
          };
          totalQTY += ProductDetl.quantity
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x


        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY: ", lastTableX, lastTableY+=350);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+240, lastTableY,{ underline: true});

      // doc
      // .fontSize(10)
      // .text('Picked By       : ', lastTableX, lastTableY+=25);


      // doc
      // .fontSize(10)
      // .text(" ".repeat(60), lastTableX+64, lastTableY,{ underline: true});


      // doc
      // .fontSize(10)
      // .text("Check By: ", lastTableX, lastTableY+30);

      // doc
      // .fontSize(10)
      // .text("                                                                           ", lastTableX+50, lastTableY+30,{ underline: true});


      doc
      .fontSize(10)
      .text("Checked By   : ", lastTableX, lastTableY+40);

      doc
      .fontSize(10)
      .text("               RICHARD BAET                   ", lastTableX+64, lastTableY+40,{ underline: true});
      
      doc
      .fontSize(10)
      .text("Raw Materials Warehouse Supervisor", lastTableX+64, lastTableY+50);


      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
}); 


router.get("/PDF_Sales/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await sales.findById(_id);

      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      var Title;
      Title = "PICKING LIST";
      if(user_id.finalize == "True"){
        Title = "DELIVERY RECEIPT";

      }


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=100;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('DELI MONDO FOOD SPECIALTIES INC.', x, y);
      doc
      .fontSize(10)
      .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text("(OUTGOING)", x, y+=20);

      doc
      .fontSize(9)
      .text('Date ', x, y+=25);

      doc
      .fontSize(9)
      .text(' : ' + user_id.date, x+63, y);
      

      doc
      .fontSize(9)
      .text('REF MRIS# ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : ' + user_id.invoice, x+63, y);



      const table = {
          headers: [
            { label: "ITEM NO", property: 'itemcode',  align: "center", width: 15, renderer: null },
            { label: "MATERIAL DESCRIPTION", property: 'itemdescription',  align: "center", width: 100, renderer: null },
            { label: "REQUESTED QUANTITY", property: 'rqty',  align: "center", width: 60, renderer: null },
            { label: "QUANTITY ISSUED", property: 'iqty',  align: "center", width: 60, renderer: null },
            { label: "UOM", property: 'unit',  align: "center", width: 40, renderer: null },
            { label: "LOCATION", property: 'blocation',  align: "center", width: 50, renderer: null },
            { label: "PRODUCTION DATE", property: 'proddate',  align: "center", width: 60, renderer: null },
            { label: "EXPIRATION DATE", property: 'expdate',  align: "center", width: 60, renderer: null },
            { label: "DELIVERY DATE", property: 'del_date',  align: "center", width: 63, renderer: null },
            { label: "DELIVERY CODE", property: 'del_code',  align: "center", width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
      
        var x=1;
        user_id.sale_product.forEach((ProductDetl) => {
          
          const d = new Date(ProductDetl.production_date);
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          const formattedDate = d.toLocaleDateString('en-US', options);

          const ed = new Date(ProductDetl.expiry_date);
          const optionsed = { year: 'numeric', month: 'short', day: 'numeric' };
          const formattedDateed = ed.toLocaleDateString('en-US', optionsed);
          
          
          const dd = new Date(ProductDetl.delivery_date);
          const optionsdd = { year: 'numeric', month: 'short', day: 'numeric' };
          var formattedDatedd = dd.toLocaleDateString('en-US', optionsdd);

          if(typeof ProductDetl.delivery_date == "undefined"){
            formattedDatedd = "";
          }
          const rowData = {
            
            
            itemcode: x,
            itemdescription: ProductDetl.product_name,
            rqty: ProductDetl.requested_qty,
            iqty: ProductDetl.quantity,
            unit: ProductDetl.unit,
            blocation: ProductDetl.storage+ProductDetl.rack+ProductDetl.bay+ProductDetl.bin+ProductDetl.type[0]+ProductDetl.floorlevel,
            proddate: formattedDate,
            expdate: formattedDateed,
            del_date: formattedDatedd,
            del_code: ProductDetl.delivery_code
          };
     
          x++;
          table.datas.push(rowData);
        });

                  
        // console.log(x)
      doc.table(table, {
          x: x+17,
          y: y+=30,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(6.5),
          // prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            const {x, y, width, height} = rectCell;
            doc.font("Helvetica").fontSize(8),
            doc
            .lineWidth(.5)
            .moveTo(x, y)
            .lineTo(x, y + height)
            .stroke(); 
          },
          
         
        });
        

        

        
        var lastTableY = doc.y
        var lastTableX = doc.x
        var lineTable = lastTableY-=8
        doc.lineWidth(5);
        doc.lineCap('butt')
        .moveTo(625, lineTable)
        .lineTo(17, lineTable)
        .stroke();


        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY+=15);
 
        doc
        .fontSize(11)
        .text('PREPARED BY : ', lastTableX, lastTableY+=400);

        doc
      .fontSize(10)
      .text("                                                            ", lastTableX+82, lastTableY,{ underline: true});
        
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});

router.get("/PDF_adjustment_rm/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await adjustment.findById(_id);
      var Title;
      var SubTitle;
      Title = "PICKING LIST";
      SubTitle = "(INVENTORY ADJUSTMENT)";
      if(user_id.finalize == "True"){
        Title = "INVENTORY ADJUSTMENT";
        SubTitle = "";

      }
      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('DELI MONDO FOOD SPECIALTIES INC.', x, y);
      doc
      .fontSize(10)
      .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text(SubTitle, x, y+=20);

      doc
      .fontSize(9)
      .text('Warehouse ', x, y+=40);

      doc
        .fontSize(9)
        .text(' : '+user_id.warehouse_name, x+63, y);
      
      // doc
      // .fontSize(9)
      // .text('Customer : ' + user_id.customer, 400, 210, { underline: true });
      // doc
      // .fontSize(9)
      // .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date ', x, y+=11);

      doc
        .fontSize(9)
        .text(' : '+user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : '+user_id.invoice, x+63, y);


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 150, renderer: null },
            { label: "Quantity", property: 'qty', width: 60, renderer: null },
            { label: "UOM", property: 'unit', width: 60, renderer: null },
            // { label: "Quantity", property: 'unitConversion', width: 60, renderer: null },
            { label: "Production Date", property: 'proddate', width: 80, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
    
        var totalPerUnit =0;
      
        user_id.product.forEach((ProductDetl) => {
    
          let dataUnit = '';
          
          const qtydata = ProductDetl.to_quantity;
          for (let index = 1; index <= qtydata; index++) {
            
            if(qtydata == index){
              dataUnit += ProductDetl.maxperunit;
            }else{
              dataUnit += ProductDetl.maxperunit+',';
            }
            
            
            totalPerUnit +=ProductDetl.maxperunit;
          }
          dataUnit += ' / ' + ProductDetl.secondary_unit ;
          const rowData = {

            
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: ProductDetl.new_adjust_qty,
            unit: ProductDetl.unit,
            // unitConversion:dataUnit,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.storage+ProductDetl.rack+ProductDetl.bay+ProductDetl.bin+ProductDetl.type[0]+ProductDetl.floorlevel,
          };
          totalQTY += ProductDetl.new_adjust_qty 
          
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x


        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY : ", lastTableX, lastTableY+=350);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+200, lastTableY);     
      
      doc
      .fontSize(10)
      .text('Picked By     : ', lastTableX, lastTableY+=25);


      doc
      .fontSize(10)
      .text(" ".repeat(60), lastTableX+62, lastTableY,{ underline: true});


      doc
      .fontSize(10)
      .text("Checked By ", lastTableX, lastTableY+=50);


      doc
      .fontSize(10)
      .text(" : ", lastTableX + 55, lastTableY);

      doc
      .fontSize(10)
      .text("              RICHARD BAET                   ", lastTableX+60, lastTableY,{ underline: true});
        
        doc
        .fontSize(10)
        .text("Raw Materials Warehouse Supervisor", lastTableX+60, lastTableY+12);

      // doc
      // .fontSize(10)
      // .text("ARMAN CRUZ", lastTableX+60, lastTableY+30,{ underline: true});
      // const pageNumber = doc.bufferedPageRange().start + 1; 
      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});


router.get("/PDF_transfer_rm/:id", auth, async (req, res) => {
  try {
      const { username, email, role } = req.user;
      const role_data = req.user;

      const profile_data = await profile.findOne({ email: role_data.email });

      const master = await master_shop.find();

      const _id = req.params.id;
      const user_id = await transfers.findById(_id);
      var Title;
      var SubTitle;
      Title = "Picking List";
      SubTitle = "(STOCKS TRANSFER)";
      if(user_id.finalize == "True"){
       Title = "STOCKS TRANSFER";
       SubTitle ="";

      }
      const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });


      res.setHeader('Content-disposition', 'inline; filename="OUT-'+ _id+'.pdf"');
      res.setHeader('Content-type', 'application/pdf');
      var x=20;
      var y=60;

      doc.pipe(res);


      doc.image('./public/upload/'+master[0].image, 20, 0, {fit: [100, 100]})

      doc
      .fontSize(20)
      .text('JAKA Distrubution Incorporated', x, y);
      // doc
      // .fontSize(10)
      // .text('BRGY.HALAYHAY, TANZA CAVITE', x, y+=15);

      doc
      .fontSize(15)
      .text(Title, x, y+=50);

      doc
      .fontSize(10)
      .text(SubTitle, x, y+=20);

      doc
      .fontSize(9)
      .text('Warehouse ', x, y+=40);

      doc
      .fontSize(9)
      .text(' : '+user_id.to_warehouse, x+63, y);
      
      // doc
      // .fontSize(9)
      // .text('Customer : ' + user_id.customer, 400, 210, { underline: true });
      // doc
      // .fontSize(9)
      // .text('Pick By : ', x, y+=11);

      doc
      .fontSize(9)
      .text('Date ', x, y+=11);


      doc
      .fontSize(9)
      .text(' : '+user_id.date, x+63, y);

      doc
      .fontSize(9)
      .text('Control Number ', x, y+=11);

      doc
      .fontSize(9)
      .text(' : '+user_id.invoice, x+63, y);


      const table = {
          headers: [
            { label: "Item Code", property: 'itemcode', width: 60, renderer: null },
            { label: "Item Description", property: 'itemdescription', width: 150, renderer: null },
            { label: "Quantity", property: 'qty', width: 60, renderer: null },
            { label: "UOM", property: 'unit', width: 60, renderer: null },
            { label: "Production Date", property: 'proddate', width: 80, renderer: null },
            { label: "Batch No", property: 'batchno', width: 63, renderer: null },
            { label: "Bin Location", property: 'binloc', width: 63, renderer: null },
          ],
          datas: [],
        };
        var totalQTY = 0; 
        let warecode = "";
        var totalPerUnit =0;
   
        user_id.product.forEach((ProductDetl) => {
          // console.log(ProductDetl)
          var prod_cat = ProductDetl.prod_cat;
          var Unit ;
          Unit = ProductDetl.unit;
          if(prod_cat == "S"){
            
            Unit = ProductDetl.secondary_unit;
          }
          
          const rowData = {

            
            itemcode: ProductDetl.product_code,
            itemdescription: ProductDetl.product_name,
            qty: ProductDetl.to_quantity,
            unit: Unit,
            // unitConversion:dataUnit,
            proddate: ProductDetl.production_date,
            batchno: ProductDetl.batch_code,
            binloc: ProductDetl.storage+ProductDetl.rack+ProductDetl.to_bay+ProductDetl.to_bin+ProductDetl.to_types[0]+ProductDetl.to_floorlevel,
          };
          totalQTY += ProductDetl.to_quantity 
          
          table.datas.push(rowData);
        });

                  

      doc.table(table, {
          x: 20,
          y: 280,
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
          
         
        });
        var lastTableY = doc.y
        var lastTableX = doc.x

        doc
        .fontSize(10)
        .text("*********************** NOTHING TO FOLLOWS ***********************", lastTableX+125, lastTableY);

      doc
      .fontSize(10)
      .text("TOTAL QTY: ", lastTableX, lastTableY+=300);

      doc
      .fontSize(10)
      .text(totalQTY, lastTableX+215, lastTableY,{ underline: true});   
      
      // doc
      // .fontSize(10)
      // .text('Picked By   : ', lastTableX, lastTableY+=25);


      // doc
      // .fontSize(10)
      // .text(" ".repeat(60), lastTableX+62, lastTableY,{ underline: true});



      doc
      .fontSize(10)
      .text("Checked By: ", lastTableX, lastTableY+=50);

      doc
        .fontSize(10)
        .text("                             ", lastTableX+60, lastTableY,{ underline: true});
        
        doc
        .fontSize(10)
        .text("Warehouse Supervisor", lastTableX+60, lastTableY+12);

      let pages = doc.bufferedPageRange();

      // let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      //Footer: Add page number
      let oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0 //Dumb: Have to remove bottom margin in order to write into it
      doc
          .text(
          `Page: ${i + 1} of ${pages.count}`,
          0,
          doc.page.height - (oldBottomMargin/2), // Centered vertically in bottom margin
          { align: 'center' }
          );
      doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
      }
    
      
      const lasttextY = doc.y
      const lasttextX = doc.x
      // doc
      // .fontSize(10)
      // .text("X: " + lasttextX + " Y : " + lasttextY, lasttextX, lasttextY);

      // Finalize the PDF
      doc.end();
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating the PDF.");
  }
});









module.exports = router;