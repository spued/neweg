const { DbNoResult } = require('../../errors');
const { Devices, DeviceNote } = require('../core/Schemas');
const ObjectId = require('mongoose').Types.ObjectId; 

async function listDevices(data) {
    const res = await Devices.findOne(data);
    //console.log(res);
    return res;
}

async function countAllDevices(data) {
    let res = undefined;
    res = await Devices.countDocuments(data);
    //console.log(res);
    return res;
}

function countGroupDevices(data) {
    let _filter = '';
    if(data != '0') {
        _filter =  new RegExp('^' + data);
    } else {
        _filter =  new RegExp('');
    }
    const aggregatorOpts = [
        { 
            $match : { 
                "VirtualParameters.circuit_number._value": { 
                    $regex : _filter, 
                    $options : 'm' 
                }
            }
        },
        {
            $unwind: "$_deviceId"
        },
        {
            $group: {
                _id: "$_deviceId._ProductClass",
                count: { $sum: 1 }
                
            }
        },
        { 
            $sort : { count : -1 }
        }
    ];
    const result = Devices.aggregate(aggregatorOpts);
    return result.toArray();   
}

function countPrefixDevices() {
    const aggregatorOpts = [
            /* {
                $unwind: '$VirtualParameters.circuit_number'
            }, */
            {
                $group: {
                    _id: {  $substr: ['$VirtualParameters.circuit_number._value',0,2]  },
                    count: { $sum: 1 }
                }
            },
            { $sort : { count : -1 }}];
    const result = Devices.aggregate(aggregatorOpts);
    //console.log(result);
    return result.toArray();   
}

async function save_note(data) {
    //console.log(data);
    const doc = await DeviceNote.findOneAndUpdate({ 
        circuit_number : data.circuit_number }, data, {
            new: true,
            upsert: true // Make this update into an upsert
        });
    //console.log(doc);
    return doc;
  }
async function getNotefromCircuit(data) {
    //console.log(data);
    const u = await DeviceNote.findOne({ circuit_number : data });
    //if (!u) throw new DbNoResult();
    if(!u) return 'no result';
    return u;
}
module.exports = {
    listDevices,
    countAllDevices,
    countGroupDevices,
    countPrefixDevices,
    save_note,
    getNotefromCircuit

}