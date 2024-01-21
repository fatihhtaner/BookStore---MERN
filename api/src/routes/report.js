const express = require('express');
const Report = require('../models/report');
const Order = require('../models/order');
const router = express.Router();
const json2csv = require('json2csv').parse;

let converter = require('json-2-csv');
let fs = require('fs');

  /*const reportsToDone = async () => {
    const filter = { status: 'Pending' };
    const report = await Report.findOneAndUpdate(filter, { status: 'Processing' });
  
    if (!report) return;
    
    try{
      const { orderStatusToFilter, beginDate, endDate } = report.params;
      let orders = [];
  
      if (orderStatusToFilter === "all") {
        orders = await Order.find({ createdAt: { $gte: beginDate, $lte: endDate } })
      }else {
        orders = await Order.find({ status: orderStatusToFilter, createdAt: { $gte: beginDate, $lte: endDate } })
      }
  
      if (report.type === 'orders') {
        const filedOrder = Object.keys(Order.schema.obj)
        converter.json2csv(orders, { keys: filedOrder }, (err, csv) => {
  
          if(err) console.log(err);
          updateReportTo(report.id, 'Error')
  
          fs.stat('./src/reports', function(err) {
            if (err.code === 'ENOENT') {
              fs.mkdirSync('./src/reports', () => {})
              fs.writeFileSync(`./src/reports/${report.id}.csv`, csv)
            }else if(!err) {
              fs.writeFileSync(`./src/reports/${report.id}.csv`, csv)
            }
          });
  
        })
        await report.update({ downloadLink: `http://localhost:5000/reports/${report.id}.csv` })
        updateReportTo(report.id, 'Done')
    }
      
    } catch (error) {
      console.log(error)
      await report.update({ status: 'Error' })
      res.status(500).json({message: error.message});
    }
    
  }*/
  const limit = 10;

  router.get('/reports', async (req, res) => {
    try {
      const reports = await Report.find().limit(limit);
      res.header('Access-Control-Expose-Headers', 'X-Total-Count', 'Content-Range');
      res.header('X-Total-Count', reports.length);
      res.set('Content-Range', `books 0-${limit-1}/${reports.length}`);
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/reports', async (req, res) => {
    const { orderStatusToFilter, beginDate, endDate } = req.body;
  
    try {
      let orders = [];
      const filter = {
        status: orderStatusToFilter,
        createdAt: { $gte: new Date(beginDate), $lte: new Date(endDate) },
      };
      console.log(filter)
      if (orderStatusToFilter === 'all') {
        orders = await Order.find({ createdAt: { $gte: new Date(beginDate), $lte: new Date(endDate) } });
      } else {
        orders = await Order.find(filter);
      }

  
      if (orders.length === 0) {
        console.log('Specified order not found.');
        res.status(404).json({ error: 'Specified order not found.' });
        return;
      }
      const fields = ['id', 'status', 'createdAt', 'user', 'orderBooks', 'totalPrice'];
      const csv = json2csv(orders, { fields });
  
      const csvFileName = `orders_${orderStatusToFilter}_${beginDate}_to_${endDate}.csv`;
      
      fs.stat('./src/reports', function(err) {
        if(!err) {
          fs.writeFileSync(`./src/reports/${csvFileName}`, csv);
        }
        else if(err.code === 'ENOENT') {
          fs.mkdirSync('./src/reports', () => {})
          fs.writeFileSync(`./src/reports/${csvFileName}`, csv);
        }
      });
      
  
      console.log(`CSV file created successfully: ${csvFileName}`);
  
      const newReport = new Report({
        params: {
          orderStatusToFilter,
          beginDate,
          endDate,
        },
        type: 'orders',
        status: 'Pending',
        downloadLink: `http://localhost:5000/reports/download/${csvFileName}`,
      });
  
      await newReport.save();
      console.log(newReport)
      console.log('Report created successfully.');
  
      await new Promise(resolve => setTimeout(resolve, 5000));
      await Report.findByIdAndUpdate({ _id: newReport._id }, { status: 'Done' });
  
      console.log('Report status updated to Done.');
  
      res.status(200).json({ message: 'CSV file created successfully', fileName: csvFileName, downloadLink: newReport.downloadLink });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/reports/download/:fileName', async (req, res) => {
    const { fileName } = req.params;
    const file = `./src/reports/${fileName}`;
    res.download(file);
  });
  
  module.exports = router;