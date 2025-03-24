// Game data structure
const games = {
    bored: {
        action: [
            {
                title: "MTB Downhill Extreme",
                description: "Master the mountain with super OffRoad bikes in this extreme biking adventure!",
                thumbnail: "https://img.y8.com/cloud/v2-y8-thumbs-small-thumbnails-001/163049/small.gif",
                url: "https://www.y8.com/embed/mtb_downhill_extreme",
                duration: "∞ Endless",
                category: "Action"
            }
        ],
        arcade: [],
        puzzle: [],
        relaxation: []
    },
    anxiety: {
        action: [
            {
                title: "Slope",
                description: "Speed down on a randomized slope in this adrenaline-pumping 3D game!",
                thumbnail: "https://images.crazygames.com/games/slope/cover-1683032397035.png?auto=format,compress&q=75&cs=strip",
                url: "https://www.y8.com/embed/slope",
                duration: "∞ Endless",
                category: "Action"
            }
        ],
        puzzle: [],
        arcade: [],
        relaxation: []
    },
    happy: {
        action: [],
        puzzle: [
            {
                title: "Happy Bucket",
                description: "Can you fill the bucket with water by drawing paths? Collect stars for bonus points!",
                thumbnail: "https://img.y8.com/cloud/v2-y8-thumbs-small-thumbnails-001/181783/small.gif",
                url: "https://www.y8.com/games/happy_bucket/index.html?embedgame=1",
                duration: "5-15 min",
                category: "Puzzle"
            }
        ],
        arcade: [],
        relaxation: []
    },
    focus: {
        action: [],
        puzzle: [
            {
                title: "Sudoku Royal",
                description: "Master this classic number puzzle game with multiple difficulty levels",
                thumbnail: "https://img.y8.com/cloud/v2-y8-thumbs-small-thumbnails-001/146787/small.gif",
                url: "https://www.y8.com/embed/sudoku_royal",
                duration: "10-30 min",
                category: "Puzzle"
            }
        ],
        arcade: [],
        relaxation: []
    }
};

// DOM Elements
const moodButtons = document.querySelectorAll('.mood-btn');
const gameModal = document.getElementById('gameModal');
const gameFrame = document.getElementById('gameFrame');
const gameTitle = document.getElementById('gameTitle');
const closeModal = document.querySelector('.close-modal');
const gameGrids = document.querySelectorAll('.game-grid');

// Current selected mood
let currentMood = 'bored';

// Initialize the page
function initializePage() {
    // Set default mood
    moodButtons[2].classList.add('active'); // Bored is default
    
    // Load games for default mood
    loadGamesForMood(currentMood);
    
    // Add event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Mood selection
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            moodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentMood = button.dataset.mood;
            loadGamesForMood(currentMood);
        });
    });

    // Modal close button
    closeModal.addEventListener('click', closeGameModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });

    // Handle escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameModal.style.display === 'block') {
            closeGameModal();
        }
    });
}

// Load games for selected mood
function loadGamesForMood(mood) {
    if (!games[mood]) return;

    // Clear existing games
    gameGrids.forEach(grid => grid.innerHTML = '');

    // Load games for each category
    Object.entries(games[mood]).forEach(([category, gameList]) => {
        const grid = document.querySelector(`#${category}-games .game-grid`);
        if (!grid) return;

        if (gameList.length === 0) {
            grid.innerHTML = '<div class="no-games">More games coming soon!</div>';
            return;
        }

        gameList.forEach(game => {
            const gameCard = createGameCard(game);
            grid.appendChild(gameCard);
        });
    });
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-game', game.title);
    
    // Add category badge if available
    if (game.category) {
        const categoryBadge = document.createElement('div');
        categoryBadge.className = 'game-category';
        categoryBadge.textContent = game.category;
        card.appendChild(categoryBadge);
    }
    
    card.innerHTML += `
        <div class="game-thumbnail-wrapper">
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <div class="play-overlay">
                <i class="fas fa-play-circle"></i>
            </div>
        </div>
        <div class="game-info">
            <h4 class="game-title">${game.title}</h4>
            <p class="game-description">${game.description}</p>
            <div class="game-meta">
                <span><i class="fas fa-clock"></i> ${game.duration}</span>
                <span><i class="fas fa-gamepad"></i> Y8 Games</span>
            </div>
        </div>
    `;
    
    // Add click event to open game in modal
    card.addEventListener('click', () => {
        openGameInModal(game);
    });
    
    return card;
}

// Open game in modal
function openGameInModal(game) {
    console.log('Opening game:', game.title, game.url);
    gameTitle.textContent = game.title;
    gameModal.style.display = 'block';
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Create a loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading game...</p>';
    gameFrame.parentNode.appendChild(loadingDiv);
    
    // Reset the iframe first
    gameFrame.src = 'about:blank';
    
    // Handle iframe errors
    gameFrame.onerror = (event) => {
        console.error('Game iframe error:', event);
        if (loadingDiv.parentNode) {
            loadingDiv.innerHTML = `
                <p>Error loading game. Please try again.</p>
                <button id="retryButton" class="retry-button">Retry</button>
            `;
            const retryButton = document.getElementById('retryButton');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    openGameInModal(game);
                });
            }
        }
    };
    
    // Wait a moment before setting the actual URL
    setTimeout(() => {
        // Set up iframe
        gameFrame.style.visibility = 'hidden';
        
        // For Happy Bucket, use the special URL
        if (game.title === "Happy Bucket") {
            gameFrame.src = "https://www.y8.com/games/happy_bucket/index.html?embedgame=1";
        } else {
            gameFrame.src = game.url;
        }
        
        // Log iframe load status
        console.log('Setting game URL:', gameFrame.src);
        
        // Set a timeout for loading
        const loadTimeout = setTimeout(() => {
            if (loadingDiv.parentNode) {
                // If the game is taking too long, show a retry button
                loadingDiv.innerHTML = `
                    <p>Game is taking longer than expected to load.</p>
                    <button id="retryButton" class="retry-button">Retry</button>
                `;
                
                const retryButton = document.getElementById('retryButton');
                if (retryButton) {
                    retryButton.addEventListener('click', () => {
                        // Reload the game
                        openGameInModal(game);
                    });
                }
            }
        }, 15000); // 15 seconds timeout
        
        // Handle iframe load
        gameFrame.onload = () => {
            console.log('Game iframe loaded:', gameFrame.src);
            if (gameFrame.src === 'about:blank') return;
            
            clearTimeout(loadTimeout);
            
            // Remove loading indicator and show game
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
            
            gameFrame.style.visibility = 'visible';
            gameFrame.parentNode.classList.add('game-frame-loaded');
            
            // Try to focus the iframe for better game control
            try {
                gameFrame.focus();
            } catch (e) {
                console.log('Could not focus iframe');
            }
        };
    }, 100);
}

// Close game modal
function closeGameModal() {
    gameModal.classList.remove('active');
    setTimeout(() => {
        gameModal.style.display = 'none';
        gameFrame.src = '';
        document.body.style.overflow = ''; // Restore scrolling
        gameFrame.parentNode.classList.remove('game-frame-loaded');
    }, 300);
    
    // Remove any loading indicators that might be present
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 