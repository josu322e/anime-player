const RemoteNetflixPlayer = {
    currentAnime: null,
    currentIndex: 0,

    init(data, epIndex = 0) {
        this.currentAnime = data;
        this.currentIndex = epIndex;
        const overlay = document.getElementById('remote-player-overlay');
        overlay.style.display = 'flex';
        
        this.render();
        this.enterFullExperience(overlay);
    },

    render() {
        const overlay = document.getElementById('remote-player-overlay');
        const ep = this.currentAnime.episodes[this.currentIndex];
        
        overlay.innerHTML = `
            <div class="netflix-player-container">
                <video id="main-video" src="${ep.url}" autoplay playsinline></video>
                
                <div class="video-ui">
                    <div class="top-bar">
                        <button class="icon-btn" onclick="RemoteNetflixPlayer.close()">✕</button>
                        <div class="video-info">
                            <span class="anime-name">${this.currentAnime.title}</span>
                            <span class="ep-name">${ep.name}</span>
                        </div>
                    </div>

                    <div class="center-controls">
                        <button class="skip-btn" onclick="this.parentElement.parentElement.querySelector('video').currentTime -= 10">↺ 10</button>
                        <button class="play-pause" onclick="RemoteNetflixPlayer.togglePlay(this)">⏸</button>
                        <button class="skip-btn" onclick="this.parentElement.parentElement.querySelector('video').currentTime += 10">10 ↻</button>
                    </div>

                    <div class="bottom-bar">
                        <div class="progress-container">
                            <input type="range" class="seek-bar" value="0" step="0.1">
                        </div>
                        <div class="action-buttons">
                            <button onclick="RemoteNetflixPlayer.showEpisodes()">📑 Episodios</button>
                            <button onclick="RemoteNetflixPlayer.showAudio()">🌐 Idioma</button>
                            <button onclick="RemoteNetflixPlayer.nextEpisode()">Siguiente ⏭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.setupEvents();
    },

    async enterFullExperience(el) {
        try {
            if (el.requestFullscreen) await el.requestFullscreen();
            else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
            
            // Bloqueo horizontal forzado
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape').catch(e => console.log("Permiso de rotación requerido"));
            }
        } catch (err) {
            console.error(err);
        }
    },

    togglePlay(btn) {
        const video = document.getElementById('main-video');
        if (video.paused) { video.play(); btn.innerText = '⏸'; }
        else { video.pause(); btn.innerText = '▶'; }
    },

    nextEpisode() {
        if (this.currentIndex < this.currentAnime.episodes.length - 1) {
            this.currentIndex++;
            this.render();
        }
    },

    close() {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
        document.getElementById('remote-player-overlay').style.display = 'none';
        document.getElementById('main-video').pause();
    },

    // Simulación de menús adicionales
    showEpisodes() { alert("Lista de episodios: \n" + this.currentAnime.episodes.map((e,i)=>`${i+1}. ${e.name}`).join('\n')); },
    showAudio() { alert("Seleccionar idioma: \n- Japonés (Original)\n- Español Latino"); },

    setupEvents() {
        const video = document.getElementById('main-video');
        const seek = document.querySelector('.seek-bar');
        video.ontimeupdate = () => { seek.value = (video.currentTime / video.duration) * 100; };
        seek.oninput = () => { video.currentTime = (seek.value / 100) * video.duration; };
    }
};
