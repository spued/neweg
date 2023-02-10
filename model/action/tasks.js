const { DbNoResult } = require('../../errors');
const { Tasks } = require('../core/Schemas');
const ObjectId = require('mongoose').Types.ObjectId; 

async function listTasks(data) {
    const res = await Tasks.findOne(data);
    //console.log(res);
    return res;
}

async function countAllTasks(data) {
    const res = await Tasks.countDocuments();
    //console.log(res);
    return res;
}

module.exports = {
    listTasks,
    countAllTasks
}