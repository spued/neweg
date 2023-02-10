var onlinePieChart = undefined;

window.addEventListener('load', function() {
    console.log('All assets are loaded');
    drawGraph();

    $.post('/dashboard_prefix',{}, (res) => {
        $.each(res.data, function (i, item) {
            $('#select_prefix').append($('<option>', {
                value: item,
                text : item
            }));
        });
    })

    $.post('/dashboard_online_data',{
        prefix : 25
    }, (res) => {
        //console.log(res);
        onlinePieChart.data.datasets[0].data = res.data;
        onlinePieChart.update();
        let html = "<tr>";
        $("#tableOnline tbody").append();
        res.data.forEach(element => {
            html +="<td>" + element + "</td>";
        });
        html += "</tr>";
        $("#tableOnline tbody").append(html);
    })

});

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
                    '#00425A'
                ],
                borderColor: [
                    '#1F8A70',
                    '#FC7200',
                    '#473C33',
                    '#00425A'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true
        }
    });
}
