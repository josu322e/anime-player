const RemoteNetflixPlayer = {
    currentData: null,
    currentIndex: 0,

    init(data, index = 0) {
        this.currentData = data;
        this.currentIndex = index;
        const overlay = document.getElementById('remote-player-overlay');
        overlay.style.display = 'flex';
        this.render();
        this.startFullExperience(overlay);
    },

    render() {
        const overlay = document.getElementById('remote-player-overlay');
        const ep = this.currentData.episodes[this.currentIndex];
        overlay.innerHTML = `
            <div class="nt-container">
                <video id="video-player" src="${ep.url}" autoplay playsinline></video>
                <div class="nt-ui">
                    <div class="nt-top">
                        <button onclick="RemoteNetflixPlayer.close()">✕</button>
                        <span>${this.currentData.title} - ${ep.name}</span>
                    </div>
                    <div class="nt-center">
                        <button onclick="document.getElementById('video-player').currentTime -= 10">↺ 10</button>
                        <button id="pp-btn" onclick="RemoteNetflixPlayer.togglePlay()">⏸</button>
                        <button onclick="document.getElementById('video-player').currentTime += 10">10 ↻</button>
                    </div>
                    <div class="nt-bottom">
                        <input type="range" id="seek" value="0" step="0.1" oninput="RemoteNetflixPlayer.seek(this.value)">
                        <div class="nt-actions">
                            <button onclick="alert('Próximamente: Lista de Episodios')">📑 Episodios</button>
                            <button onclick="alert('Idioma: Japonés / Español Latino')">🌐 Idioma</button>
                            <button onclick="RemoteNetflixPlayer.next()">Siguiente ⏭</button>
                        </div>
                    </div>
                </div>
            </div>`;
        this.syncSeek();
    },

    async startFullExperience(el) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape').catch(() => {});
        }
    },

    togglePlay() {
        const v = document.getElementById('video-player');
        v.paused ? v.play() : v.pause();
        document.getElementById('pp-btn').innerText = v.paused ? '▶' : '⏸';
    },

    seek(val) { const v = document.getElementById('video-player'); v.currentTime = (val/100) * v.duration; },

    syncSeek() {
        const v = document.getElementById('video-player');
        v.ontimeupdate = () => { document.getElementById('seek').value = (v.currentTime/v.duration)*100; };
    },

    next() { if(this.currentIndex < this.currentData.episodes.length - 1) { this.currentIndex++; this.render(); } },

    close() {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        document.getElementById('remote-player-overlay').style.display = 'none';
        document.getElementById('video-player').pause();
    }
};
