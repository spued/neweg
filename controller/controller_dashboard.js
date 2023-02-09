const db = require('../model');
const logger = require('../lib/logger');

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
const post_graph_prefix = async (req, res) => {
    console.log("Controller: Dashboard : Post get graph data by user prefix");
    console.log(req.body);
    const result = await db.countAllDevices({});
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
    post_graph_prefix
}