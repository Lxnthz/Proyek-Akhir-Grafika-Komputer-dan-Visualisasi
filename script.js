document.addEventListener("DOMContentLoaded", function() {
    fetch('data.csv')
        .then(response => response.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            const data2014 = data.filter(d => d.Year === 2014);

            const cropTypes = ["Padi", "Jagung", "Ubi Kayu", "Ubi Jalar"];
            const lineChartData = cropTypes.map(crop => {
                return {
                    label: crop,
                    data: data2014.filter(d => d.Crop === crop && d.Region !== "TOTAL").map(d => d.Value),
                    fill: false,
                    borderColor: getRandomColor(),
                    tension: 0.1
                };
            });

            // Line Chart
            const lineCtx = document.getElementById('line-chart').getContext('2d');
            new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: data2014.map(d => d.Region).filter((v, i, a) => a.indexOf(v) === i && v !== "TOTAL"),
                    datasets: lineChartData
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Hasil Produksi pada 2014'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const barChartData = cropTypes.map(crop => {
                return {
                    label: crop,
                    data: data.filter(d => d.Crop === crop).reduce((acc, d) => {
                        const yearIndex = d.Year - 2011;
                        acc[yearIndex] = (acc[yearIndex] || 0) + d.Value;
                        return acc;
                    }, Array(5).fill(0)),
                    backgroundColor: getRandomColor()
                };
            });

            // Bar Chart
            const barCtx = document.getElementById('bar-chart').getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: [2011, 2012, 2013, 2014, 2015],
                    datasets: barChartData
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Produksi 2011 to 2015'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const regions = ["JAWA BARAT", "JAWA TENGAH", "JAWA TIMUR", "DI YOGYAKARTA", "BANTEN"];
            const horizontalBarChartData = data2014.filter(d => d.Crop === "Padi" && regions.includes(d.Region));

            // Horizontal Bar Chart
            const horizontalBarCtx = document.getElementById('horizontal-bar-chart').getContext('2d');
            new Chart(horizontalBarCtx, {
                type: 'bar',
                data: {
                    labels: horizontalBarChartData.map(d => d.Region),
                    datasets: [{
                        label: 'Produksi Padi pada 2014',
                        data: horizontalBarChartData.map(d => d.Value),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Produksi Padi di Pulau Jawa pada 2014'
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });

    function parseCSV(csvText) {
        const rows = csvText.split('\n').slice(1);
        return rows.map(row => {
            const [Region, Year, Value, Crop] = row.split(',');
            return { Region, Year: +Year, Value: +Value, Crop };
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
