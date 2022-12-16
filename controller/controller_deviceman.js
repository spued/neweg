const db = require('../model');
const logger = require('../lib/logger');
const { PasswordNoMatch, PasswordHashFailed, DbNoResult } = require('../errors');
const axios = require('axios').default;
const dotenv = require('dotenv').config();
const translator = require('../lib/attribute_translator');



const getDeviceManPage = (req,res) => {
    console.log("Controller: Main: Get Device Manager page");
    res.render('pages/deviceman', req.user);
}

const post_search_device = (req, res) => {
    console.log("Controller: Main: Post Device search");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    const device_url = process.env.ACS_API_DEVICES;
    const search_query = '{ "VirtualParameters.circuit_number._value" : "/'+ req.body.cn +'/" }'
    axios.get(device_url, { params: { query:  search_query }}).then((response) => {
        // handle success
        //console.log(response.data);
        let data_t = [];

        for(const element of response.data) {
            //console.log(element);
            data_t.push(translator.map_attribute(element));
        }
        
        resData.data = response.data;
        resData.data_t = data_t;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors
        console.log('Error : ' + error)
        res.json(resData);
    });
}

module.exports = {
    getDeviceManPage,
    post_search_device
}