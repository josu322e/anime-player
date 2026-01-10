const RemoteNetflixPlayer = {
    init(data) {
        const overlay = document.getElementById('remote-player-overlay');
        overlay.style.display = 'flex';
        this.render(data);
    },

    render(data) {
        const overlay = document.getElementById('remote-player-overlay');
        overlay.innerHTML = `
            <div class="video-container">
                <div class="player-controls-top">
                    <button class="back-btn" onclick="RemoteNetflixPlayer.close()">✕</button>
                    <span id="remote-playing-title">${data.title} - ${data.episodes[0].name}</span>
                </div>
                <video id="main-video" controls autoplay>
                    <source src="${data.episodes[0].url}" type="video/mp4">
                </video>
            </div>
            <div class="netflix-panel">
                <h3 style="margin-bottom:15px">Episodios</h3>
                <div class="ep-list-remote">
                    ${data.episodes.map((ep, index) => `
                        <div class="ep-item-remote" onclick="RemoteNetflixPlayer.changeEp('${ep.url}', '${ep.name}')">
                            ${ep.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    changeEp(url, name) {
        const video = document.getElementById('main-video');
        document.getElementById('remote-playing-title').innerText = name;
        video.src = url;
        video.play();
    },

    close() {
        const video = document.getElementById('main-video');
        if(video) video.pause();
        document.getElementById('remote-player-overlay').style.display = 'none';
    }
};
