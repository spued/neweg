var canvas = document.getElementById("cpe_canvas");
var ctx = canvas.getContext("2d");
var wifi_image = new Image();
var phone_image = new Image();
var fiber_image = new Image();

window.addEventListener('load', function() {
    //console.log('Device manager page are loaded');
    drawCPE(ctx);
    const port_y = 200;
    drawPort(ctx,320,port_y,'up');
    drawPort(ctx,370,port_y,'down');
    drawPort(ctx,420,port_y, 'up');
    drawPort(ctx,470,port_y, 'up');

    $('#search_button').on('click', function (evt) {
        //console.log('sEarch cli k!');
        const _post_data = {
            //cn : $('#search_keyword').val()
            cn : '2271'
        }
        $.post('/search_device',_post_data, (res) => {
            if(res.data.length <= 0) {
                alert("ไม่พบอุปกรณ์ที่ค้นหา");
            } else if(res.data.length == 1) {
                //console.log(res.data_t)
                //console.log(res.data)
                let cpe = res.data_t[0];
                let last_inform = moment(cpe.last_inform);
                $('#last_update').text(last_inform.format('DD/MMM/YYYY เวลา HH:mm'));
                $('#circuit_number').text(cpe.circuit_number);
                $('#sn').text(cpe.serial_number);
                $('#wan_ip').text( cpe.wan_ip + ' (' + cpe.wan_mac + ')');
                $('#model').text(cpe.manufacturer + ' : ' + cpe.product_class );
                $('#software_version').text(cpe.software_version);
                //console.log(cpe.device_summary);
                const device_summary_array = cpe.device_summary.split(',');
                
                device_summary = {};
                device_summary_array.forEach(element => {
                    let arr = element.split(':');
                    device_summary[arr[0].trim()] = parseInt(arr[1]);
                });
                console.log(device_summary);
               
            } else {
                // if found many devices
            }
        })
        
        
    })
});

function drawCPE(ctx) {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "green";
    ctx.rect((width / 2) - 300 , (height / 2) - 10, 600, 150);
    ctx.stroke();

    // Wait for the sprite sheet to load
    wifi_image.onload = () => {
        
        ctx.drawImage(wifi_image,(width / 2),20,50,50);
        ctx.drawImage(wifi_image,(width / 2)+ 200,20,50,50);
    }
    phone_image.onload = () => {
        
        ctx.drawImage(phone_image,(width / 2) + 170,(height/2) + 40,50,50);
        ctx.drawImage(phone_image,(width / 2) + 230,(height/2) + 40,50,50);
    }
    fiber_image.onload = () => {
        
        ctx.drawImage(fiber_image,(width / 4)- 50 ,(height/2) + 20,100,100);
        
    }
    // Load the sprite sheet from an image file
    wifi_image.src = 'pub/img/wifi_logo.png';
    phone_image.src = 'pub/img/phone.png';
    fiber_image.src = 'pub/img/fiber_2.png';
}

function drawPort(ctx, x, y, status = 0) {
    let line_color = "black";
    let fill_color = "grey";
    switch(status) {
        case 'up':
            line_color = "black";
            fill_color = "green";
        break;
        case 'down':
            line_color = "black";
            fill_color = "red";
        break;
        default:

        break;
    }

    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = line_color;
    ctx.rect(x , y, 40, 40);
    ctx.rect(x+15 , y-10, 10, 10);
    ctx.fillStyle = fill_color;
    ctx.fill();
    ctx.stroke();
}


