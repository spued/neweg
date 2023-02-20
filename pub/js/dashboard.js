var onlinePieChart = undefined;

window.addEventListener('load', function() {
    //console.log('All assets are loaded');
    drawGraph();

    $.post('/dashboard_prefix',{}, (res) => {
        $('#select_prefix > option').val(res.data.join(','));
        $.each(res.data, function (i, item) {
            $('#select_prefix').append($('<option>', {
                value: item,
                text : item
            }));
        });
    }).then(() => {
        $.post('/dashboard_online_data',{
            prefix : $('#select_prefix').val()
        }, (res) => {
            //console.log(res);
            let html = "<tr>";
            $("#tableOnline tbody").append();
            res.data.forEach(element => {
                html +="<td>" + element + "</td>";
            });
            html += "</tr>";
            $("#tableOnline tbody").append(html);

            onlinePieChart.data.datasets[0].data = res.data.slice(0,-1);
            onlinePieChart.update();
            
        })
    })
});

$('#select_prefix').on('change',(evt) => {
    $.post('/dashboard_online_data',{
        prefix : $('#select_prefix').val()
    }, (res) => {
        //console.log(res);
        onlinePieChart.data.datasets[0].data = res.data;
        onlinePieChart.update();
        $("#tableOnline tbody").empty();
        let html = "<tr>";
        $("#tableOnline tbody").append();
        res.data.forEach(element => {
            html +="<td>" + element + "</td>";
        });
        html += "</tr>";
        $("#tableOnline tbody").append(html);
    })
})

function drawGraph() {
    var ctx = document.getElementById('pie-chart').getContext('2d');
    onlinePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Online', 'Last 24H', 'More 24H', 'Dead'],
            datasets: [{
                label: 'CPE status',
                data: [12, 12, 12, 12],
                backgroundColor: [
                    '#1F8A70',
                    '#FC7200',
                    '#473C33',
                    '#FF0000'
                ],
                borderColor: [
                    '#1F8A70',
                    '#FC7200',
                    '#473C33',
                    '#FF0000'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                /* yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }] */
            },
            responsive: true
        }
    });
}
