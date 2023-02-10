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
    console.log(req.body);
    let resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    const last_day = moment().subtract(25, 'days').toDate();
    const last_hour = moment().subtract(1, 'hours').toDate();
    const last_3_months = moment().subtract(3, 'months').toDate();
    const filters = [ 
        {
            _lastInform : { 
                $gt: last_hour 
            }
        },
        {
            _lastInform : { 
                $lt: last_hour, 
                $gt: last_day 
            }
        },
        {
            _lastInform : { 
                $lt: last_day
            }
        },
        {
            _lastInform : { 
                $lt: last_3_months
            }
        }
    ]

    let promise = [];
    filters.forEach(filter => promise.push(db.countAllDevices(filter)));
    Promise.all(promise).then((results) => {
        //console.log(results);
        resData.data = results
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    })
    
}
const post_tasks_count = async (req, res) => {
    console.log("Controller: Dashboard : Post get tasks graph data");
    console.log(req.body);
    const result = await db.countAllTasks({});
    console.log(result);
    resData = {
        code : 1,
        msg : 'Error Default',
        data : []
    };
    res.json(resData);
}
module.exports = {
    post_user_prefix,
    post_online_graph_data,
    post_tasks_count
}