// script.js
fetch('data/players/150/2425-01.json')
  .then(response => response.json())
  .then(data => {
    const heatmapData = {
      max: 10,
      data: data.shots.map(shot => ({
        x: Math.floor(shot.x * 5), // scale for heatmap
        y: Math.floor(shot.y * 5),
        value: 1 // each shot counts as 1
      }))
    };

    const heatmap = h337.create({
      container: document.getElementById('heatmapContainer'),
      radius: 20,
      maxOpacity: 0.6,
      minOpacity: 0.1,
      blur: 0.85,
      gradient: {
        '.3': 'blue',
        '.6': 'orange',
        '.9': 'red'
      }
    });

    heatmap.setData(heatmapData);
  });