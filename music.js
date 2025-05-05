
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cover = document.querySelector('.cover');
    const songTitle = document.querySelector('.song-info h2');
    const artistName = document.querySelector('.song-info p');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-btn');
    const repeatBtn = document.querySelector('.repeat-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    // NewJeans playlist data
    const playlist = [
        {
            title: "Attention",
            artist: "NewJeans",
            cover: "Cover/attention.jpg",
            audio: "audio/attention-official-audio.mp3"
        },
        {
            title: "Hype Boy",
            artist: "NewJeans",
            cover: "Cover/hypeboy.jpg",
            audio: "audio/hype-boy-official-audio.mp3"
        },
        {
            title: "Cookie",
            artist: "NewJeans",
            cover: "Cover/cookie.jpg",
            audio: "audio/cookie-mp3-audio-1st-mini-album.mp3"
        },
        {
            title: "Hurt",
            artist: "NewJeans",
            cover: "Cover/hurt.jpg",
            audio: "audio/hurt.mp3"
        },
        {
            title: "Ditto",
            artist: "NewJeans",
            cover: "Cover/ditto.jpg",
            audio: "audio/ditto.mp3"
        }
    ];
    
    // Audio object
    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    
    // Initialize player
    function loadSong(songIndex) {
        const song = playlist[songIndex];
        
        // Update UI
        cover.querySelector('img').src = song.cover;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        
        // Load audio
        audio.src = song.audio;
        
        // Update active playlist item
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[songIndex].classList.add('active');
        
        // Play the song if player was playing
        if (isPlaying) {
            playSong();
        }
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        cover.style.animationPlayState = 'running';
        audio.play();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        cover.style.animationPlayState = 'paused';
        audio.pause();
    }
    
    // Next song
    function nextSong() {
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentSongIndex && playlist.length > 1);
            
            currentSongIndex = newIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }
    
    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time display
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        
        if (duration) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
    
    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    });
    
    progressContainer.addEventListener('click', setProgress);
    
    shuffleBtn.addEventListener('click', function() {
        isShuffle = !isShuffle;
        this.style.color = isShuffle ? 'var(--color2)' : 'var(--text-dark)';
    });
    
    repeatBtn.addEventListener('click', function() {
        isRepeat = !isRepeat;
        this.style.color = isRepeat ? 'var(--color2)' : 'var(--text-dark)';
    });
    
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
    });
    
    // Click on playlist item
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
    });
    
    // Load first song
    loadSong(0);
});
