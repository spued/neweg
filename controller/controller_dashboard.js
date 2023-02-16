const db = require('../model');
const logger = require('../lib/logger');
const moment = require('moment');

const post_user_prefix = (req, res) => {
    console.log("Controller: Dashboard : Post get user prefix");
    resData = {
        code : 1,
        msg : 'Error : Default',
        data : []
    };

    const data = req.user.right.split(',')
    if(data.length > 0) {
        resData.data = data;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }
    else {
        res.json(resData);
    }
}
const post_online_graph_data = async (req, res) => {
    console.log("Controller: Dashboard : Post get graph data by user prefix");
    //console.log(req.body);
    let resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    const last_day = moment().subtract(25, 'days').toDate();
    const last_hour = moment().subtract(1, 'hours').toDate();
    const last_3_months = moment().subtract(3, 'months').toDate();
    const _regex_prefix = req.body.prefix.split(',');
    let regex_prefix = '^';
    if(_regex_prefix.length > 1) {
        for(prefix of _regex_prefix){
            regex_prefix += prefix + '|';
        }
        regex_prefix = regex_prefix.slice(0, -1);
    } else {
        regex_prefix += _regex_prefix[0];
    }
    const filters = [ 
        {
            $and : [
                {   "VirtualParameters.circuit_number._value" : { 
                        $regex :  regex_prefix, 
                        $options :'m'}   
                    },
                {   _lastInform : { $gt: last_hour }    }
                ]
        },
        {
            $and : [
                {   "VirtualParameters.circuit_number._value" : { 
                        $regex :  regex_prefix, 
                        $options :'m'}   
                    },
                {   _lastInform : { 
                        $lt: last_hour, 
                        $gt: last_day 
                    } 
                }
            ]
        },
        {
            $and : [
                {   "VirtualParameters.circuit_number._value" : { 
                        $regex :  regex_prefix, 
                        $options :'m'}   
                    },
                {   _lastInform : { $lt: last_day }    }
                ]
        },
        {
            $and : [
                {   "VirtualParameters.circuit_number._value" : { 
                        $regex :  regex_prefix, 
                        $options :'m'}   
                    },
                {   _lastInform : { $lt: last_3_months }    }
                ]
        },
        { 
            "VirtualParameters.circuit_number._value": {
                "$regex": regex_prefix ,
                "$options":"m"
            }
        }
    ]
    //console.log(JSON.stringify(filters));
    let promise = [];
    filters.forEach(filter => promise.push(db.countAllDevices(filter)));
    Promise.all(promise).then((results) => {
        //console.log(results);
        resData.data = results
        //resData.total = results.pop();
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    })
    
}
const post_tasks_count = async (req, res) => {
    console.log("Controller: Dashboard : Post get tasks graph data");
    //console.log(req.body);
    const result = await db.countAllTasks({});
    console.log(result);
    resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    res.json(resData);
}

const post_devices_group_count = async (req, res) => {
    console.log("Controller: Dashboard : Post get devices group count");
    resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    
    const result = await db.countGroupDevices(req.body.prefix);
    //console.log(result);
    if(result) {
        resData.code = 0;
        resData.msg = "OK";
        resData.data = result;
        res.json(resData);
    } else
    res.json(resData);
}

const post_devices_prefix_count = async (req, res) => {
    console.log("Controller: Dashboard : Post get devices prefix count");
    resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    const result = await db.countPrefixDevices();
    if(result) {
        resData.code = 0;
        resData.msg = "OK";
        resData.data = result;
        res.json(resData);
    } else
    res.json(resData);
}
module.exports = {
    post_user_prefix,
    post_online_graph_data,
    post_tasks_count,
    post_devices_group_count,
    post_devices_prefix_count
}