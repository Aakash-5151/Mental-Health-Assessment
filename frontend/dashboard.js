document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("http://localhost:3000/moods", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
            // Data is sent in descending order (newest first).
            // We reverse it to show chronological order on the chart.
            const moods = data.data.slice().reverse();

            const labels = moods.map(m => {
                const date = new Date(m.created);
                return `${date.getDate()}/${date.getMonth() + 1}`;
            });

            const moodValues = moods.map(m => {
                const moodMap = { "Happy": 5, "Calm": 4, "Neutral": 3, "Sad": 2, "Stressed": 1 };
                return moodMap[m.mood] || 3;
            });

            const ctx = document.getElementById('moodChart');
            if (ctx) {
                new Chart(ctx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Mood Trend',
                            data: moodValues,
                            borderColor: '#56ab91',
                            backgroundColor: 'rgba(86, 171, 145, 0.2)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true,
                            pointBackgroundColor: '#5b9bd5'
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                min: 0,
                                max: 6,
                                ticks: {
                                    stepSize: 1,
                                    callback: function (value) {
                                        const labels = { 1: 'Stressed', 2: 'Sad', 3: 'Neutral', 4: 'Calm', 5: 'Happy' };
                                        return labels[value] || '';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error fetching mood data for chart:", error);
    }
});
