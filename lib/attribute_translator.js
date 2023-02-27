
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
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F612":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F670":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F670L":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F660":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F600W":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "F620":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

                }
                break;
            case "DIR-1251":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANIPConnection[1].ExternalIPAddress._value;
                    objData.wan_mac = data.InternetGatewayDevice.LANDevice[1].LANEthernetInterfaceConfig[1].MACAddress._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = '0,0,Up';
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
                    objData.device_summary = data.InternetGatewayDevice.DeviceSummary._value.replace(/\[\]\(/,',').replace(/\)/,'');

            }
            break;
            case "DIR-842":
                if(data.InternetGatewayDevice.hasOwnProperty('WANDevice')) {
                    objData.wan_ip = data.VirtualParameters.wan_ip._value;
                    objData.wan_mac = data.VirtualParameters.wan_mac._value;
                    objData.circuit_number = data.VirtualParameters.circuit_number._value;
                    objData.ethernet_status = data.VirtualParameters.ethernet_status._value;
                    objData.pon_status = data.VirtualParameters.pon_status._value;
                    objData.lan_ip_status = data.VirtualParameters.lan_ip_status._value;
                    objData.wlan_status = data.VirtualParameters.wlan_status._value;
                    objData.voip_status = data.VirtualParameters.voip_status._value;
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
        objData.device_id = data.deviceId;
        objData.parameterValues = [];
        switch(data.product_class) {
            case 'F680':
                // system config
                if('provisioning_code' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                }
                if('remote_config_enable' in data) {
                    if( data.remote_config_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                    }
                }
                // LAN
                if('lan_ip' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                }
                if('lan_netmask' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                }
                if('lan_dhcp_status' in data) {  
                    if(data.lan_dhcp_status == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                    }
                }
                if('lan_dhcp_pool_start' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                }
                if('lan_dhcp_pool_end' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                }
                if('lan_dhcp_lease_time' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                }
                if('lan_dns_servers' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                }
                // WLAN
                if('wlan_channel_24' in data) { 
                    if(data.wlan_channel_24 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                    }
                }
                if('wlan_key_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                }
                if('wlan_ssid_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                }
                if('wlan_channel_5' in data) { 
                    if(data.wlan_channel_5 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                    }
                }
                if('wlan_key_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                }
                if('wlan_ssid_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                }
                //VOIP
                if('voip_number_1' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                }
                if('voip_password_1' in data) {
                    if(data.voip_password_1 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                    }
                }
                if('voip_number_2' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                }
                if('voip_password_2' in data) {
                    if(data.voip_password_2 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                    }
                }
                if('voip_proxy_server' in data) {
                    if(data.voip_proxy_server != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                    }
                }
                //DDNS
                if('ddns_enable' in data) {
                    if( data.ddns_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                    }
                }
                if('ddns_provider' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                }
                if('ddns_hostname' in data) {
                    if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                }
                if('ddns_password' in data) {
                    if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                }
                if('ddns_username' in data) {
                    if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                }
                if('ddns_server' in data) {
                    if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                }
                break;
            case 'F670':
                // system config
                if('provisioning_code' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                }
                if('remote_config_enable' in data) {
                    if( data.remote_config_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                    }
                }
                // LAN
                if('lan_ip' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                }
                if('lan_netmask' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                }
                if('lan_dhcp_status' in data) {  
                    if(data.lan_dhcp_status == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                    }
                }
                if('lan_dhcp_pool_start' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                }
                if('lan_dhcp_pool_end' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                }
                if('lan_dhcp_lease_time' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                }
                if('lan_dns_servers' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                }
                // WLAN
                if('wlan_channel_24' in data) { 
                    if(data.wlan_channel_24 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                    }
                }
                if('wlan_key_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                }
                if('wlan_ssid_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                }
                if('wlan_channel_5' in data) { 
                    if(data.wlan_channel_5 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                    }
                }
                if('wlan_key_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                }
                if('wlan_ssid_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                }
                //VOIP
                if('voip_number_1' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                }
                if('voip_password_1' in data) {
                    if(data.voip_password_1 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                    }
                }
                if('voip_number_2' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                }
                if('voip_password_2' in data) {
                    if(data.voip_password_2 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                    }
                }
                if('voip_proxy_server' in data) {
                    if(data.voip_proxy_server != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                    }
                }
                //DDNS
                if('ddns_enable' in data) {
                    if( data.ddns_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                    }
                }
                if('ddns_provider' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                }
                if('ddns_hostname' in data) {
                    if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                }
                if('ddns_password' in data) {
                    if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                }
                if('ddns_username' in data) {
                    if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                }
                if('ddns_server' in data) {
                    if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                }
                break;
            case 'F670L':
                // system config
                if('provisioning_code' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                }
                if('remote_config_enable' in data) {
                    if( data.remote_config_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                        objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                    }
                }
                // LAN
                if('lan_ip' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                }
                if('lan_netmask' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                }
                if('lan_dhcp_status' in data) {  
                    if(data.lan_dhcp_status == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                    }
                }
                if('lan_dhcp_pool_start' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                }
                if('lan_dhcp_pool_end' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                }
                if('lan_dhcp_lease_time' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                }
                if('lan_dns_servers' in data) { 
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                }
                // WLAN
                if('wlan_channel_24' in data) { 
                    if(data.wlan_channel_24 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                    }
                }
                if('wlan_key_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                }
                if('wlan_ssid_24' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                }
                if('wlan_channel_5' in data) { 
                    if(data.wlan_channel_5 == '0') {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                    }
                }
                if('wlan_key_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                }
                if('wlan_ssid_5' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                }
                //VOIP
                if('voip_number_1' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                }
                if('voip_password_1' in data) {
                    if(data.voip_password_1 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                    }
                }
                if('voip_number_2' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                }
                if('voip_password_2' in data) {
                    if(data.voip_password_2 != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                    }
                }
                if('voip_proxy_server' in data) {
                    if(data.voip_proxy_server != '') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                    }
                }
                //DDNS
                if('ddns_enable' in data) {
                    if( data.ddns_enable == 'true') {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                    } else {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                    }
                }
                if('ddns_provider' in data) {
                    objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                }
                if('ddns_hostname' in data) {
                    if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                }
                if('ddns_password' in data) {
                    if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                }
                if('ddns_username' in data) {
                    if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                }
                if('ddns_server' in data) {
                    if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                }
                break;
            case 'F660':
                    // system config
                    if('provisioning_code' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                    }
                    if('remote_config_enable' in data) {
                        if( data.remote_config_enable == 'true') {
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                        } else {
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                            objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                        }
                    }
                    // LAN
                    if('lan_ip' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                    }
                    if('lan_netmask' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                    }
                    if('lan_dhcp_status' in data) {  
                        if(data.lan_dhcp_status == 'true') {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                        } else {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                        }
                    }
                    if('lan_dhcp_pool_start' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                    }
                    if('lan_dhcp_pool_end' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                    }
                    if('lan_dhcp_lease_time' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                    }
                    if('lan_dns_servers' in data) { 
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                    }
                    // WLAN
                    if('wlan_channel_24' in data) { 
                        if(data.wlan_channel_24 == '0') {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                        } else {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                        }
                    }
                    if('wlan_key_24' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                    }
                    if('wlan_ssid_24' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                    }
                    if('wlan_channel_5' in data) { 
                        if(data.wlan_channel_5 == '0') {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                        } else {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                        }
                    }
                    if('wlan_key_5' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                    }
                    if('wlan_ssid_5' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                    }
                    //VOIP
                    if('voip_number_1' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                    }
                    if('voip_password_1' in data) {
                        if(data.voip_password_1 != '') {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                        }
                    }
                    if('voip_number_2' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                    }
                    if('voip_password_2' in data) {
                        if(data.voip_password_2 != '') {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                        }
                    }
                    if('voip_proxy_server' in data) {
                        if(data.voip_proxy_server != '') {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                        }
                    }
                    //DDNS
                    if('ddns_enable' in data) {
                        if( data.ddns_enable == 'true') {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                        } else {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                        }
                    }
                    if('ddns_provider' in data) {
                        objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                    }
                    if('ddns_hostname' in data) {
                        if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                    }
                    if('ddns_password' in data) {
                        if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                    }
                    if('ddns_username' in data) {
                        if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                    }
                    if('ddns_server' in data) {
                        if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                    }
                    break;
            case 'F612':
                        // system config
                        if('provisioning_code' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                        }
                        if('remote_config_enable' in data) {
                            if( data.remote_config_enable == 'true') {
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                            } else {
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                                objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                            }
                        }
                        // LAN
                        if('lan_ip' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                        }
                        if('lan_netmask' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                        }
                        if('lan_dhcp_status' in data) {  
                            if(data.lan_dhcp_status == 'true') {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                            } else {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                            }
                        }
                        if('lan_dhcp_pool_start' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                        }
                        if('lan_dhcp_pool_end' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                        }
                        if('lan_dhcp_lease_time' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                        }
                        if('lan_dns_servers' in data) { 
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                        }
                        // WLAN
                        if('wlan_channel_24' in data) { 
                            if(data.wlan_channel_24 == '0') {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                            } else {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                            }
                        }
                        if('wlan_key_24' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                        }
                        if('wlan_ssid_24' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                        }
                        if('wlan_channel_5' in data) { 
                            if(data.wlan_channel_5 == '0') {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                            } else {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                            }
                        }
                        if('wlan_key_5' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                        }
                        if('wlan_ssid_5' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                        }
                        //VOIP
                        if('voip_number_1' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                        }
                        if('voip_password_1' in data) {
                            if(data.voip_password_1 != '') {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                            }
                        }
                        if('voip_number_2' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                        }
                        if('voip_password_2' in data) {
                            if(data.voip_password_2 != '') {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                            }
                        }
                        if('voip_proxy_server' in data) {
                            if(data.voip_proxy_server != '') {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                            }
                        }
                        //DDNS
                        if('ddns_enable' in data) {
                            if( data.ddns_enable == 'true') {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                            } else {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                            }
                        }
                        if('ddns_provider' in data) {
                            objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                        }
                        if('ddns_hostname' in data) {
                            if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                        }
                        if('ddns_password' in data) {
                            if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                        }
                        if('ddns_username' in data) {
                            if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                        }
                        if('ddns_server' in data) {
                            if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                        }
                        break;
            case 'F620':
                            // system config
                            if('provisioning_code' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.DeviceInfo.ProvisioningCode", data.provisioning_code, "xsd:string"]);
                            }
                            if('remote_config_enable' in data) {
                                if( data.remote_config_enable == 'true') {
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", true , "xsd:boolean"])
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false , "xsd:boolean"])
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081 , "xsd:integer"])
                                } else {
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.Enable", false, "xsd:boolean"])
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.AclServices.1.FilterTarget", false, "xsd:boolean"])
                                    objData.parameterValues.push(["InternetGatewayDevice.X_ZTE-COM_Security.IPV4RemoteServicePortControl.1.Port", 8081, "xsd:integer"])
                                }
                            }
                            // LAN
                            if('lan_ip' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters", data.lan_ip, "xsd:string"]);
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress", data.lan_ip, "xsd:string"]);
                            }
                            if('lan_netmask' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask", data.lan_netmask, "xsd:string"]);
                            }
                            if('lan_dhcp_status' in data) {  
                                if(data.lan_dhcp_status == 'true') {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", true, "xsd:boolean"]);
                                } else {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable", false, "xsd:boolean"]);
                                }
                            }
                            if('lan_dhcp_pool_start' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", data.lan_dhcp_pool_start, "xsd:string"]);
                            }
                            if('lan_dhcp_pool_end' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", data.lan_dhcp_pool_end, "xsd:string"]);
                            }
                            if('lan_dhcp_lease_time' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime", data.lan_dhcp_lease_time, "xsd:integer"]);
                            }
                            if('lan_dns_servers' in data) { 
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers", data.lan_dns_servers, "xsd:string"]);
                            }
                            // WLAN
                            if('wlan_channel_24' in data) { 
                                if(data.wlan_channel_24 == '0') {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", true, "xsd:boolean"]);
                                } else {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable", false, "xsd:boolean"]);
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel", parseInt(data.wlan_channel_24), "xsd:integer"]);
                                }
                            }
                            if('wlan_key_24' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase", data.wlan_key_24, "xsd:string"]);
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", data.wlan_key_24, "xsd:string"]);
                            }
                            if('wlan_ssid_24' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", data.wlan_ssid_24, "xsd:string"]);
                            }
                            if('wlan_channel_5' in data) { 
                                if(data.wlan_channel_5 == '0') {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", true, "xsd:boolean"]);
                                } else {
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.AutoChannelEnable", false, "xsd:boolean"]);
                                    objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.Channel", parseInt(data.wlan_channel_5), "xsd:integer"]);
                                }
                            }
                            if('wlan_key_5' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.KeyPassphrase", data.wlan_key_5, "xsd:string"]);
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey", data.wlan_key_5, "xsd:string"]);
                            }
                            if('wlan_ssid_5' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID", data.wlan_ssid_5, "xsd:string"]);
                            }
                            //VOIP
                            if('voip_number_1' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName", data.voip_number_1, "xsd:string"]);
                            }
                            if('voip_password_1' in data) {
                                if(data.voip_password_1 != '') {
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword", data.voip_password_1, "xsd:string"]);
                                }
                            }
                            if('voip_number_2' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthUserName", data.voip_number_2, "xsd:string"]);
                            }
                            if('voip_password_2' in data) {
                                if(data.voip_password_2 != '') {
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.2.SIP.AuthPassword", data.voip_password_2, "xsd:string"]);
                                }
                            }
                            if('voip_proxy_server' in data) {
                                if(data.voip_proxy_server != '') {
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer", data.voip_proxy_server, "xsd:string"]);
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy", data.voip_proxy_server, "xsd:string"]);
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer", data.voip_proxy_server, "xsd:string"]);
                                }
                            }
                            //DDNS
                            if('ddns_enable' in data) {
                                if( data.ddns_enable == 'true') {
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", true, "xsd:boolean"]);
                                } else {
                                    objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Enable", false , "xsd:boolean"]);
                                }
                            }
                            if('ddns_provider' in data) {
                                objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.ServiceType", data.ddns_provider, "xsd:string"]);
                            }
                            if('ddns_hostname' in data) {
                                if(data.ddns_hostname != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Hostname", data.ddns_hostname, "xsd:string"]);
                            }
                            if('ddns_password' in data) {
                                if(data.ddns_password != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Password", data.ddns_password, "xsd:string"])
                            }
                            if('ddns_username' in data) {
                                if(data.ddns_username != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Username", data.ddns_username, "xsd:string"]);
                            }
                            if('ddns_server' in data) {
                                if(data.ddns_server != '') objData.parameterValues.push(["InternetGatewayDevice.Services.X_ZTE-COM_DDNS.Server", data.ddns_server, "xsd:string"]);
                            }
                            break;
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