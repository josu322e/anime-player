const RemoteNetflixPlayer = {
    init(data, epIndex = 0) {
        const overlay = document.getElementById('remote-player-overlay');
        overlay.style.display = 'flex';
        this.render(data, epIndex);
        this.enterFullScreen(overlay);
    },

    render(data, index) {
        const overlay = document.getElementById('remote-player-overlay');
        const episode = data.episodes[index] || { name: "Cargando...", url: "" };
        
        overlay.innerHTML = `
            <div class="video-container">
                <div class="player-controls-top">
                    <button class="back-btn" onclick="RemoteNetflixPlayer.close()">✕</button>
                    <span id="remote-playing-title">${data.title} - ${episode.name}</span>
                </div>
                <video id="main-video" controls autoplay playsinline>
                    <source src="${episode.url}" type="video/mp4">
                </video>
            </div>
        `;
    },

    async enterFullScreen(element) {
        try {
            // Activa pantalla completa
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            }

            // Bloquea en horizontal (Solo funciona en móviles/Chrome/App24 si tiene permisos)
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape').catch(err => console.log("Bloqueo de orientación no soportado"));
            }
        } catch (e) {
            console.error("Error al entrar a pantalla completa:", e);
        }
    },

    close() {
        const video = document.getElementById('main-video');
        if (video) video.pause();
        
        // Salir de pantalla completa y desbloquear orientación
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch(() => {});
        }
        
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }

        document.getElementById('remote-player-overlay').style.display = 'none';
    }
};        video.play();
    },

    close() {
        const video = document.getElementById('main-video');
        if(video) video.pause();
        document.getElementById('remote-player-overlay').style.display = 'none';
    }
};
