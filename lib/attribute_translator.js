
// function for translate/mapping attributes
const translator =  {
    map_attribute : function(data) {
        //console.log(data);
        var objData = {
            device_id : data._id
        };
        let _deviceInfo = data.InternetGatewayDevice.DeviceInfo;
        let _deviceId = data._deviceId;
        let _wifi = {};
        let _voip = {};
        let _lan = {};
        let _wan = {};
        console.log('UTIL: Translate data from ACS for ' + JSON.stringify(data._id));
        // standard parameters
        if('_lastInform' in data) objData.last_inform = data._lastInform;
        if('SerialNumber' in _deviceInfo) objData.serial_number = _deviceInfo.SerialNumber._value;
        if('_SerialNumber' in _deviceId) objData.serial_number = _deviceId._SerialNumber;
        if('ProductClass' in _deviceInfo) objData.product_class = _deviceInfo.ProductClass._value;
        if('_ProductClass' in _deviceId) objData.product_class = _deviceId._ProductClass;
        if('Manufacturer' in _deviceInfo) objData.manufacturer = _deviceInfo.Manufacturer._value;
        if('_Manufacturer' in _deviceId) objData.manufacturer = _deviceId._Manufacturer;
        if('SoftwareVersion' in _deviceInfo) objData.software_version = _deviceInfo.SoftwareVersion._value;
        if('HardwareVersion' in _deviceInfo) objData.hardware_version = _deviceInfo.HardwareVersion._value;
        // specific by model parameters
        switch(objData.product_class) {
            case "F680":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');
                }
                break;
            case "IP400":
                if(data.InternetGatewayDevice.hasOwnProperty('LANDevice')) {
                    _wifi = data.InternetGatewayDevice.LANDevice[1].WLANConfiguration[1];
                    _lan = data.InternetGatewayDevice.LANDevice[1].LANHostConfigManagement.IPInterface[1];

                    if('SSID' in _wifi) objData.ssid = _wifi.SSID._value;
                    if('KeyPassphrase' in _wifi.PreSharedKey[1]) objData.wifi_password = _wifi.PreSharedKey[1].KeyPassphrase._value;
                    if('IPInterfaceIPAddress' in _lan) objData.lan_ip_address = _lan.IPInterfaceIPAddress._value;
                    if('IPInterfaceSubnetMask' in _lan) objData.lan_ip_netmask = _lan.IPInterfaceSubnetMask._value;
                }
                if(data.InternetGatewayDevice.Services.hasOwnProperty('VoiceService')) {
                    _voip = data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1].Account[1];
                    if('AuthUserName' in _voip) objData.voip_number = _voip.AuthUserName._value;
                    if('AuthPassword' in _voip) objData.voip_password = _voip.AuthPassword._value;
                }
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    _wan = data.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANIPConnection[1];
                    if('MACAddress' in _wan) objData.wan_mac = _wan.MACAddress._value;
                }
                break;
            case "NR3661": 
                if(data.InternetGatewayDevice.hasOwnProperty('LANDevice')) {
                    _lan = data.InternetGatewayDevice.LANDevice[1].LANHostConfigManagement.IPInterface[1];
                    _wifi = data.InternetGatewayDevice.LANDevice[1].WLANConfiguration[1];
                    if('SSID' in _wifi) objData.ssid = _wifi.SSID._value;
                    if('KeyPassphrase' in _wifi.PreSharedKey[1]) objData.wifi_password = _wifi.PreSharedKey[1].KeyPassphrase._value;
                    if('IPInterfaceIPAddress' in _lan) objData.lan_ip_address = _lan.IPInterfaceIPAddress._value;
                    if('IPInterfaceSubnetMask' in _lan) objData.lan_ip_netmask = _lan.IPInterfaceSubnetMask._value;
                }
                if(data.InternetGatewayDevice.Services.hasOwnProperty('VoiceService')) {
                    if(data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1].hasOwnProperty('Line')) {
                        _voip = data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1].Line[1].SIP;
                    } else {
                        _voip = data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1].Account[1];
                    }
                    
                    if('AuthUserName' in _voip) objData.voip_number = _voip.AuthUserName._value;
                    if('AuthPassword' in _voip) objData.voip_password = _voip.AuthPassword._value;
                }
                break;
            case "S01":
                if(data.InternetGatewayDevice.hasOwnProperty('LANDevice')) {
                    _wifi = data.InternetGatewayDevice.LANDevice[1].WLANConfiguration[1];
                    if('SSID' in _wifi) objData.ssid = _wifi.SSID._value;
                    if('PreSharedKey' in _wifi.PreSharedKey[1]) objData.wifi_password = _wifi.PreSharedKey[1].PreSharedKey._value;
                }
                if(data.InternetGatewayDevice.Services.hasOwnProperty('VoiceService')) {
                    _voip = data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1].Line[1].SIP;
                    //VirtualParameters.wlan1_key
                    if('AuthUserName' in _voip) objData.voip_number = _voip.AuthUserName._value;
                    if('AuthPassword' in _voip) objData.voip_password = _voip.AuthPassword._value;
                }
                if(data.InternetGatewayDevice.hasOwnProperty('LAN')) {
                    _lan = data.InternetGatewayDevice.LAN;
                    if('IPInterfaceIPAddress' in _lan) objData.lan_ip_address = _lan.IPAddress._value;
                    if('IPInterfaceSubnetMask' in _lan) objData.lan_ip_netmask = _lan.IPAddress._value;
                }
                break;    
            default:
                objData.ssid = '-';
                objData.wifi_password = "-";

                objData.voip_number = "-";
                objData.voip_password = "-";

                objData.lan_ip_address = "-";
                objData.lan_ip_netmask = "-";
                break;
        }

        //console.log('Out data =' + JSON.stringify(objData));
        return objData;
    },
    map_acs :function(data) {
        var objData = {};
        //console.log('In data =' + JSON.stringify(data));
        objData.device_id = data.device_id;
        objData.parameterValues = [];
        switch(data.product_class) {
            case 'IP400':
                if('ssid' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.ssid, "xsd:string"]);
                if('passwd' in data)
                    //filter out the masking password
                    if(data.passwd != '********')
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.passwd, "xsd:string"]);
                if('voip_number' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthUserName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthDispName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.DirectoryNumber", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.Enable","Enabled","xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxyServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxyServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxySwitch",'ON',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.RegistrarServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.RegistrarServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.X_ATP_SIPDomain",'10.0.15.43',"xsd:string"]);
                }   
                if('voip_passwd' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthPassword", data.voip_passwd, "xsd:string"]);
                }
                
                break;
            case 'NR3661':
                if('ssid' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.ssid, "xsd:string"]);
                if('passwd' in data)
                //filter out the masking password
                    if(data.passwd != '********')
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.passwd, "xsd:string"]);
                if('voip_number' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthUserName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthDispName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.DirectoryNumber", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.Enable","Enabled","xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxyServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxyServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.ProxySwitch",'ON',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.RegistrarServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.RegistrarServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.SipServer.1.X_ATP_SIPDomain",'10.0.15.43',"xsd:string"]);
                }   
                if('voip_passwd' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Account.1.AuthPassword", data.voip_passwd, "xsd:string"]);
                
                break;
            case 'S01':
                if('ssid' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.ssid, "xsd:string"]);
                if('passwd' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.passwd, "xsd:string"]);
                if('voip_number' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.AuthDispName", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.DirectoryNumber", data.voip_number, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.Enable","Enabled","xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxySwitch",'ON',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer",'10.0.15.43',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServerPort",'5060',"xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain",'10.0.15.43',"xsd:string"]);
                }   
                if('voip_passwd' in data)
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_passwd, "xsd:string"]);
                
                break;
            default:
                break;
        }
        //console.log('Return data =' + JSON.stringify(objData));
        return objData;
    },
    map_cmd_acs :function(data) {
        var objData = {};
        //console.log(data);
        /* device_id: '209AE9-IP400-353246060534650',
        product_class: 'IP400',
        sn: '353246060534650',
        ssid: 'IP400_262F',
        passwd: '********' */
        objData.device_id = data.device_id;
        objData.cmd = '';
        switch(data.product_class) {
            case 'IP400':
                if(data.cmd == 'reboot') objData.cmd = "reboot";
                if(data.cmd == 'reset') objData.cmd = "factoryReset";
                break;
            case 'NR3661':
                if(data.cmd == 'reboot') objData.cmd = "reboot";
                if(data.cmd == 'reset') objData.cmd = "factoryReset";
                break;
            case 'S01':
                if(data.cmd == 'reboot') objData.cmd = "reboot";
                if(data.cmd == 'reset') objData.cmd = "factoryReset";
                break;
            default:
                break;
            }
        //console.log('Return data =' + JSON.stringify(objData));
        return objData;
    }
}
module.exports = translator;