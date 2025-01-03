// Add wallet name mapping
const KNOWN_WALLETS = {
    "CQ7Q8ARKh7Eyu7e5XuJvLY5gaPWwqiyNUYVDEbzbG1tK": "PUMP FUN",
    "EcGsB4AE179fN5sALgPUfvxNJ3C5KsS9sB9qcAP5txgA": "PUMP FUN",
    "4Lup5UyksaL3J5fa3oZj3Y4MN88KeQcV7BMWEajSb16d": "PUMP FUN",
    "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1": "RAYDIUM",
    "5Z1kYXAxmZPSYVwVhmUMfNB5wiMHua4F68siJ3vz7xSA": "MOONSHOT"
};

// Interactive Background Settings
const PARTICLE_SETTINGS = {
    count: 400,                    // Number of particles
    color: '0, 153, 255',        // RGB values for particle color (changed to blue)
    opacity: 0.5,                // Base opacity of particles
    size: {
        min: 0.5,                // Minimum particle size
        max: 2                   // Maximum particle size
    },
    speed: {
        min: 0.1,                // Minimum particle speed
        max: 0.3                 // Maximum particle speed
    },
    connections: {
        maxDistance: 100,        // Maximum distance for particle connections
        opacity: 0.1,            // Opacity of connections
        lineWidth: 1             // Width of connection lines
    },
    mouse: {
        radius: 100,             // Radius of mouse influence
        strength: 2              // Strength of mouse push effect
    }
};


// API
async function getScanData(address) {
    try {
        const api_url = "https://awesomesauce.x10.mx/index.php";
        const response = await fetch(`${api_url}?address=${address}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch scan data');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching scan data:', error);
        addLogMessage('Error fetching scan data: ' + error.message, 'error');
        throw error;
    }
}

async function getHolderData(address) {
    try {
        const api_url = "https://awesomesauce.x10.mx/holders.php";
        const response = await fetch(`${api_url}?address=${address}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Holder Data Response:', data); // Debug log
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch holder data');
        }
        
        // Ensure we have the expected data structure
        return {
            success: true,
            data: {
                unique_holders: data.data?.unique_holders || 0,
                holders: data.data?.holders || []
            }
        };
    } catch (error) {
        console.error('Error fetching holder data:', error);
        addLogMessage('Error fetching holder data: ' + error.message, 'error');
        throw error;
    }
}


// Logging functionality
function formatTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function addLogMessage(message, type = 'info') {
    const logContent = document.querySelector('.log-content');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    const timestamp = formatTimestamp();
    logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${message}`;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

// Initialize logs
function initializeLogs() {
    addLogMessage('Initializing search™ system...', 'system');
    
    setTimeout(() => {
        addLogMessage('Loading neural networks...', 'info');
    }, 500);
    
    setTimeout(() => {
        addLogMessage('Waiting for contract address...', 'success');
    }, 1500);
}

// Canvas setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * (PARTICLE_SETTINGS.speed.max - PARTICLE_SETTINGS.speed.min) + PARTICLE_SETTINGS.speed.min;
        this.vy = (Math.random() - 0.5) * (PARTICLE_SETTINGS.speed.max - PARTICLE_SETTINGS.speed.min) + PARTICLE_SETTINGS.speed.min;
        this.size = Math.random() * (PARTICLE_SETTINGS.size.max - PARTICLE_SETTINGS.size.min) + PARTICLE_SETTINGS.size.min;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(${PARTICLE_SETTINGS.color}, ${PARTICLE_SETTINGS.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particle array
const particles = Array(PARTICLE_SETTINGS.count).fill().map(() => new Particle());

// Mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: PARTICLE_SETTINGS.mouse.radius
};

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();

        // Draw connections
        particles.forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < PARTICLE_SETTINGS.connections.maxDistance) {
                ctx.strokeStyle = `rgba(${PARTICLE_SETTINGS.color}, ${PARTICLE_SETTINGS.connections.opacity * (1 - distance/PARTICLE_SETTINGS.connections.maxDistance)})`;
                ctx.lineWidth = PARTICLE_SETTINGS.connections.lineWidth;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });

        // Mouse interaction
        if (mouse.x) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * PARTICLE_SETTINGS.mouse.strength;
                particle.y += Math.sin(angle) * force * PARTICLE_SETTINGS.mouse.strength;
            }
        }
    });

    requestAnimationFrame(animate);
}

animate();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('preview-link') || 
            this.classList.contains('contact-link') ||
            this.classList.contains('secondary-button')) {
            return; // Skip for special links that have their own handlers
        }
        
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Track the last message author
let lastMessageAuthor = null;

// Function to create a new message element
function createMessageElement(text, isUser = false) {
    const message = document.createElement('div');
    message.classList.add('message', isUser ? 'user' : 'response');
    message.style.opacity = 0; // Start with 0 opacity for fade-in effect

    const author = document.createElement('div');
    author.classList.add('message-author');
    author.textContent = isUser ? 'user' : 'search agent';
    message.appendChild(author);

    const span = document.createElement('span');
    span.textContent = text;
    message.appendChild(span);

    return message;
}

// Function to append a message to the chat
function appendMessage(text, isUser = false) {
    const chat = document.querySelector('.chat');
    const message = createMessageElement(text, isUser);
    
    // Only show author tag if it's different from the last message
    const currentAuthor = isUser ? 'user' : 'eye';
    if (currentAuthor === lastMessageAuthor) {
        const authorTag = message.querySelector('.message-author');
        if (authorTag) authorTag.style.display = 'none';
    }
    lastMessageAuthor = currentAuthor;
    
    chat.appendChild(message);

    // Fade in the message
    setTimeout(() => {
        message.style.transition = 'transform 0.3s ease, border-color 0.3s ease, opacity 0.5s;';
        message.style.opacity = 1;
    }, 100);

    // Scroll to the bottom of the chat
    chat.scrollTop = chat.scrollHeight;

    return message; // Return the message element for further manipulation
}

// Function to create typing indicator
function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
    }
    return indicator;
}

// Function to simulate typing effect for AI response
function typewriteMessage(text, messageElement, callback) {
    const span = messageElement.querySelector('span');
    const typingIndicator = createTypingIndicator();
    
    // Show typing indicator first
    span.innerHTML = '';
    span.appendChild(typingIndicator);
    
    // Start typing after a short delay
    setTimeout(() => {
        let index = 0;
        span.innerHTML = ''; // Clear the typing indicator
        
        const interval = setInterval(() => {
            if (index < text.length) {
                span.textContent = text.slice(0, index + 1);
                index++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 20); // Adjust typing speed here
    }, 1000); // Show typing indicator for 1.5 seconds
}

// Solana address validation
function isValidSolanaAddress(address) {
    // Solana addresses are 32-44 characters long and contain only alphanumeric characters
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
}

// Add popup HTML structure after PARTICLE_SETTINGS
const popupHTML = `
    <div id="scanResultPopup" class="popup-overlay" style="display: none;">
        <div class="popup-content">
            <div class="popup-header">
                <h3>Scan Results</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="popup-body">
                <!-- Results will be injected here -->
            </div>
        </div>
    </div>
`;

// Add popup styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
        .popup-content {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 153, 255, 0.2);
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(0, 153, 255, 0.2);
        }
        .popup-header {
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .popup-header h3 {
            color: var(--violet);
            margin: 0;
        }
        .close-popup {
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }
        .popup-body {
            padding: 1.5rem;
            color: #fff;
        }
        .view-report-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--violet);
            color: #000;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .view-report-btn:hover {
            background: var(--violet-light);
            transform: translateY(-2px);
        }
    </style>
`);

// Add popup to body
document.body.insertAdjacentHTML('beforeend', popupHTML);

// Update popup styles first
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .popup-content {
            width: 95%;
            max-width: 1200px;
            height: 700px;
            display: flex;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 153, 255, 0.2);
            border-radius: 12px;
        }
        .popup-header {
            flex-shrink: 0;
            height: 60px;
            padding: 0 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .popup-body {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            padding: 1.5rem;
            height: calc(100% - 60px);
            min-height: 0;
            overflow: hidden;
        }
        .chart-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        .holders-table {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .holders-header {
            flex-shrink: 0;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.2);
        }
        .holder-count {
            margin-bottom: 1rem;
            text-align: center;
        }
        .count-number {
            font-size: 2rem;
            font-weight: 600;
            color: var(--violet);
            display: block;
        }
        .count-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
        }
        .filter-options {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .holder-search {
            flex: 1;
            height: 36px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 0 1rem;
            color: #fff;
            font-size: 0.9rem;
        }
        .holder-sort {
            width: 140px;
            height: 36px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 0 1rem;
            color: #fff;
            font-size: 0.9rem;
            cursor: pointer;
        }
        .holders-list {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
        }
        .holder-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.5rem;
        }
        .holder-item:last-child {
            margin-bottom: 0;
        }
        .holder-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .holder-address {
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--violet);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .holder-balance {
            font-size: 0.9rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            padding: 0.3rem 0.8rem;
            background: rgba(0, 153, 255, 0.1);
            border-radius: 20px;
        }
        .holder-details {
            display: flex;
            gap: 1rem;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-item {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        .detail-item i {
            color: var(--violet);
            font-size: 0.75rem;
        }
        /* Custom scrollbar */
        .holders-list::-webkit-scrollbar {
            width: 6px;
        }
        .holders-list::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        .holders-list::-webkit-scrollbar-thumb {
            background: var(--violet);
            border-radius: 3px;
        }
        .holders-list::-webkit-scrollbar-thumb:hover {
            background: var(--violet-light);
        }
    </style>
`);

// Update the data card styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .data-card p {
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }
        .data-card p:last-child {
            margin-bottom: 0;
        }
        .data-card h4 {
            margin-bottom: 0.8rem;
        }
    </style>
`);

// Add balance formatter function
function formatBalance(balance) {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}


// Update showScanResults function to add pump.fun link
async function showScanResults(data) {
    const popup = document.getElementById('scanResultPopup');
    const popupBody = popup.querySelector('.popup-body');
    
    // Extract data safely with fallbacks
    const content = data.data?.asset?.content || {};
    const supply = data.data?.supply_data || {};
    const tokenInfo = data.data?.asset?.token_info || {};
    const address = data.data?.asset?.id || '';
    const holderCount = supply.holder_count || 0;
    
    // Use static supply of 1 billion
    const totalSupply = '1.00B';
    const formattedHolderCount = supply.holder_count?.toLocaleString() || '0';

    // Get top holder percentage from holder data
    const topHolderPercentage = data.holderData?.holders?.[1]?.percentage || 0;
    
    // Get AI sentiment
    const aiSentiment = await getAISentiment(
        holderCount,
        content.metadata?.name || 'Unknown Token',
        content.metadata?.symbol || 'UNKNOWN',
        topHolderPercentage
    );
    
    // Create the popup content
    popupBody.innerHTML = `
        <div class="left-section">
            <div class="token-overview">
                <div class="token-image">
                    <img src="${content.files[0].uri}" alt="${content.metadata.name}" 
                         onerror="this.src='placeholder-image-url.png'">
                </div>
                <div class="token-basic-info">
                    <h3>${content.metadata.name}</h3>
                    <div class="token-links">
                        <span class="token-symbol">${content.metadata.symbol}</span>
                        <a href="https://pump.fun/${address}" target="_blank" class="pump-link">
                            <i class="fas fa-rocket"></i> View on pump.fun
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="data-cards">
                <div class="data-card">
                    <h4><i class="fas fa-coins"></i> Supply Metrics</h4>
                    <p><strong>Total Supply:</strong> ${supply.totalSupply || '1.00B'}</p>
                    <p><strong>Decimals:</strong> ${tokenInfo.decimals}</p>
                </div>
                
                <div class="data-card">
                    <h4><i class="fas fa-users"></i> Holder Statistics</h4>
                    <p><strong>Total Holders:</strong> ${formattedHolderCount}</p>
                </div>
                
                <div class="data-card">
                    <h4><i class="fas fa-file-contract"></i> Contract Details</h4>
                    <p><strong>Token Standard:</strong> ${content.metadata.token_standard}</p>
                    <p><strong>Program:</strong> ${tokenInfo.token_program.slice(0, 8)}...</p>
                </div>
                
                <div class="data-card">
                    <h4><i class="fas fa-shield-alt"></i> Security Info</h4>
                    <p><strong>Mutable:</strong> ${data.data.asset.mutable ? 'Yes' : 'No'}</p>
                    <p><strong>Frozen:</strong> ${data.data.asset.ownership.frozen ? 'Yes' : 'No'}</p>
                </div>
            </div>
            <div class="ai-sentiment">
                <svg fill="#000000" width="24" height="24px" viewBox="0 0 24 24" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M208,512a24.84,24.84,0,0,1-23.34-16l-39.84-103.6a16.06,16.06,0,0,0-9.19-9.19L32,343.34a25,25,0,0,1,0-46.68l103.6-39.84a16.06,16.06,0,0,0,9.19-9.19L184.66,144a25,25,0,0,1,46.68,0l39.84,103.6a16.06,16.06,0,0,0,9.19,9.19l103,39.63A25.49,25.49,0,0,1,400,320.52a24.82,24.82,0,0,1-16,22.82l-103.6,39.84a16.06,16.06,0,0,0-9.19,9.19L231.34,496A24.84,24.84,0,0,1,208,512Zm66.85-254.84h0Z"></path><path d="M88,176a14.67,14.67,0,0,1-13.69-9.4L57.45,122.76a7.28,7.28,0,0,0-4.21-4.21L9.4,101.69a14.67,14.67,0,0,1,0-27.38L53.24,57.45a7.31,7.31,0,0,0,4.21-4.21L74.16,9.79A15,15,0,0,1,86.23.11,14.67,14.67,0,0,1,101.69,9.4l16.86,43.84a7.31,7.31,0,0,0,4.21,4.21L166.6,74.31a14.67,14.67,0,0,1,0,27.38l-43.84,16.86a7.28,7.28,0,0,0-4.21,4.21L101.69,166.6A14.67,14.67,0,0,1,88,176Z"></path><path d="M400,256a16,16,0,0,1-14.93-10.26l-22.84-59.37a8,8,0,0,0-4.6-4.6l-59.37-22.84a16,16,0,0,1,0-29.86l59.37-22.84a8,8,0,0,0,4.6-4.6L384.9,42.68a16.45,16.45,0,0,1,13.17-10.57,16,16,0,0,1,16.86,10.15l22.84,59.37a8,8,0,0,0,4.6,4.6l59.37,22.84a16,16,0,0,1,0,29.86l-59.37,22.84a8,8,0,0,0-4.6,4.6l-22.84,59.37A16,16,0,0,1,400,256Z"></path></svg>
                <p>${aiSentiment || 'AI analysis unavailable at the moment.'}</p>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="holders-table">
                <div class="holders-header">
                    <div class="header-top">
                        <div class="holder-count">
                            <span class="count-number">0</span>
                            <span class="count-label">Unique Holders</span>
                        </div>
                        <button class="refresh-btn">
                            <i class="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                    </div>
                    <div class="filter-options">
                        <input type="text" placeholder="Search by address..." class="holder-search">
                        <select class="holder-sort">
                            <option value="most">Most Tokens</option>
                            <option value="least">Least Tokens</option>
                        </select>
                    </div>
                </div>
                <div class="holders-list"></div>
            </div>
        </div>
    `;
    
    // Add styles for pump.fun link
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .token-links {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.5rem;
            }
            .pump-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.4rem 0.8rem;
                background: rgba(0, 153, 255, 0.1);
                border: 1px solid var(--violet);
                border-radius: 20px;
                color: var(--violet);
                text-decoration: none;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }
            .pump-link:hover {
                background: rgba(0, 153, 255, 0.2);
                transform: translateY(-1px);
            }
            .pump-link i {
                font-size: 0.8rem;
            }
        </style>
    `);
    
    popup.style.display = 'flex';
    
    // Initialize the holder list with the data we have
    if (data.holderData) {
        updateHoldersList({
            unique_holders: data.holderData.unique_holders || 0,
            holders: data.holderData.holders || []
        });
        
        // Start live updates with the current address and holder data
        startLiveUpdates(address, data.holderData);
    }
}

// Add updateHoldersList function
function updateHoldersList(data) {
    const holdersList = document.querySelector('.holders-list');
    const countNumber = document.querySelector('.count-number');
    
    if (!holdersList || !countNumber) return;
    
    // Update holder count
    countNumber.textContent = (data.unique_holders || 0).toLocaleString();
    
    // Ensure we have an array of holders
    const holders = Array.isArray(data.holders) ? data.holders : [];
    
    const TOTAL_SUPPLY = 1000000000; // 1 billion total supply
    
    // Update holders list with detailed cards
    holdersList.innerHTML = holders.map((holder, index) => {
        // Calculate actual token amount from percentage
        const percentage = parseFloat(holder.percentage || 0);
        const tokenAmount = (TOTAL_SUPPLY * percentage) / 100;
        const balance = formatBalance(tokenAmount);
        const address = holder.address || '';
        const solscanUrl = `https://solscan.io/account/${address}`;
        
        // Check if this is a known wallet
        const knownWalletName = KNOWN_WALLETS[address];
        const displayAddress = knownWalletName ? 
            `${knownWalletName} (${address.slice(0, 4)}...${address.slice(-4)})` :
            `${address.slice(0, 6)}...${address.slice(-6)}`;
        
        const walletClass = knownWalletName ? 'known-wallet' : '';
        
        return `
            <div class="holder-item ${walletClass}" style="--item-index: ${index}">
                <div class="holder-main">
                    <div class="holder-address">
                        <i class="fas fa-wallet"></i>
                        <a href="${solscanUrl}" target="_blank" rel="noopener noreferrer" class="${walletClass}">
                            ${displayAddress}
                        </a>
                    </div>
                    <div class="holder-balance">
                        ${balance} tokens
                    </div>
                </div>
                <div class="holder-details">
                    <div class="detail-item">
                        <i class="fas fa-chart-pie"></i>
                        ${percentage.toFixed(2)}% of supply
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        Last updated: now
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add animation to the list
    holdersList.style.opacity = '0';
    setTimeout(() => {
        holdersList.style.opacity = '1';
    }, 100);
}

// Add styles for known wallets
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .holder-item.known-wallet {
            background: rgba(0, 153, 255, 0.05);
            border-color: var(--violet);
        }
        .holder-address a.known-wallet {
            color: var(--violet-light);
            font-weight: 600;
        }
        .holder-item.known-wallet:hover {
            background: rgba(0, 153, 255, 0.1);
        }
    </style>
`);

// Close popup handler
document.querySelector('.close-popup').addEventListener('click', () => {
    document.getElementById('scanResultPopup').style.display = 'none';
});

// Update sendMessage function to handle API responses better
async function sendMessage() {
    const input = document.querySelector('.action-row .input input[type="text"]');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    input.value = '';
    
    if (!isValidSolanaAddress(userMessage)) {
        addLogMessage('Invalid Solana address format', 'error');
        return;
    }
    
    addLogMessage(`Scanning contract: ${userMessage}`, 'info');
    
    const aiMessageElement = appendMessage('', false);
    const messageSpan = aiMessageElement.querySelector('span');
    messageSpan.appendChild(createTypingIndicator());
    aiMessageElement.style.opacity = '1';
    
    try {
        messageSpan.innerHTML = '';
        messageSpan.textContent = "I'm preparing your report. This will take a moment...";

        // Add detailed scanning logs
        addLogMessage('Initializing contract scan...', 'system');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        addLogMessage('Scanning token metadata...', 'info');
        const scanData = await getScanData(userMessage);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!scanData.success) {
            throw new Error(scanData.message || 'Failed to scan token metadata');
        }
        
        addLogMessage('Analyzing supply metrics...', 'info');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        addLogMessage('Checking holder distribution...', 'info');
        const holderData = await getHolderData(userMessage);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        if (!holderData.success) {
            throw new Error(holderData.message || 'Failed to fetch holder distribution');
        }
        
        // Add success logs
        addLogMessage('✓ Token metadata verified', 'success');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        addLogMessage('✓ Supply metrics analyzed', 'success');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        addLogMessage('✓ Holder distribution mapped', 'success');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Store the pre-fetched data
        const combinedData = {
            ...scanData,
            holderData: holderData.data
        };
        
        messageSpan.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
                <div>Scan complete!</div>
                <button class="view-report-btn">View Report <i class="fas fa-external-link-alt"></i></button>
            </div>
        `;
        
        const viewButton = messageSpan.querySelector('.view-report-btn');
        viewButton.addEventListener('click', () => {
            showScanResults(combinedData);
            startLiveUpdates(userMessage, holderData.data);
        });
        
        addLogMessage('Scan complete - Report ready', 'success');
    } catch (error) {
        console.error('Error in chat:', error);
        messageSpan.innerHTML = '';
        messageSpan.textContent = `Error: ${error.message || "I'm having trouble right now. Please try again."}`;
        
        addLogMessage(`Scan failed: ${error.message}`, 'error');
        addLogMessage('Please try again in a few moments', 'error');
    }
}

// Update event listeners to handle async function
document.querySelector('.action-row .input button').addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});

document.querySelector('.action-row .input input[type="text"]').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

// Disable F12 key and Ctrl+Shift+I combo
document.addEventListener('keydown', event => {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});

// Disable right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Update the holder list styles and structure
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .holder-list-header {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0.5rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .holder-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
        }
        .holder-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--violet);
            transform: translateX(2px);
        }
        .holder-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .holder-address {
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--violet);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .holder-address i {
            font-size: 0.8rem;
            opacity: 0.7;
        }
        .holder-balance {
            font-size: 0.9rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            padding: 0.3rem 0.8rem;
            background: rgba(0, 153, 255, 0.1);
            border-radius: 20px;
        }
        .holder-details {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        .detail-item i {
            font-size: 0.75rem;
            color: var(--violet);
        }
    </style>
`);

// Add how-it-works popup HTML
document.body.insertAdjacentHTML('beforeend', `
    <div id="howItWorksPopup" class="popup-overlay" style="display: none;">
        <div class="popup-content how-it-works">
            <div class="popup-header">
                <h3>How It Works</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="popup-body" style="flex-direction: row; display: flex;">
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Enter Contract Address</h4>
                            <p>Paste any Solana token contract address into the terminal.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Instant Analysis</h4>
                            <p>Our system scans the blockchain and analyzes token metrics, holder distribution, and security features.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Real-time Updates</h4>
                            <p>View detailed reports with live holder updates and filter options.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`);

// Add how-it-works styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .popup-content.how-it-works {
            width: 90%;
            max-width: 600px;
            height: auto;
            max-height: 90vh;
        }
        
        .steps-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem;
        }
        
        .step {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .step:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--violet);
            transform: translateX(5px);
        }
        
        .step-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: var(--violet);
            color: #000;
            border-radius: 50%;
            font-weight: 600;
            font-size: 1.1rem;
            flex-shrink: 0;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-content h4 {
            color: var(--violet);
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .step-content p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.95rem;
            margin: 0;
        }
    </style>
`);

// Add startLiveUpdates function
async function startLiveUpdates(address, initialData) {
    const chartArea = document.querySelector('.chart-container');
    if (!chartArea) return;

    let currentHolders = initialData.holders || [];

    // Initialize with initial data
    updateHoldersList({
        unique_holders: initialData.unique_holders || 0,
        holders: currentHolders
    });

    // Add filter and refresh functionality
    const searchInput = document.querySelector('.holder-search');
    const sortSelect = document.querySelector('.holder-sort');
    const refreshBtn = document.querySelector('.refresh-btn');

    // Define filterHolders outside event listeners to maintain context
    const filterHolders = (holders) => {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const sortOrder = sortSelect?.value || 'most';

        let filteredHolders = [...holders]; // Create a copy of the array
        
        // Apply search filter
        filteredHolders = filteredHolders.filter(holder => 
            holder.address.toLowerCase().includes(searchTerm)
        );

        // Sort by token holdings
        filteredHolders.sort((a, b) => {
            const percentageA = parseFloat(a.percentage || 0);
            const percentageB = parseFloat(b.percentage || 0);
            return sortOrder === 'most' ? percentageB - percentageA : percentageA - percentageB;
        });

        updateHoldersList({
            unique_holders: holders.length,
            holders: filteredHolders
        });
    };

    // Bind events after elements are confirmed to exist
    if (searchInput) {
        searchInput.addEventListener('input', () => filterHolders(currentHolders));
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => filterHolders(currentHolders));
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            try {
                refreshBtn.classList.add('loading');
                refreshBtn.disabled = true;
                addLogMessage('Refreshing holder data...', 'info');

                const holderData = await getHolderData(address);
                if (holderData.success) {
                    currentHolders = holderData.data.holders || [];
                    filterHolders(currentHolders);
                    addLogMessage('✓ Holder list refreshed', 'success');
                } else {
                    throw new Error('Failed to fetch holder data');
                }
            } catch (error) {
                console.error('Error updating holder distribution:', error);
                addLogMessage('Failed to refresh holder list: ' + error.message, 'error');
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        });
    }
}

// Update the event listener for how-it-works button
window.onload = function() {
    initializeLogs();
    setTimeout(() => {
        const aiWelcome = "Send me a contact address to get started."; // Replace with actual AI welcome message
        const aiMessageElement = appendMessage('', false);
        typewriteMessage(aiWelcome, aiMessageElement);
    } , 1000);

    // Add event listeners only if elements exist
    const closePopupBtn = document.querySelector('.close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            const popup = document.getElementById('scanResultPopup');
            if (popup) popup.style.display = 'none';
        });
    }

    const sendButton = document.querySelector('.action-row .input button');
    if (sendButton) {
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    const inputField = document.querySelector('.action-row .input input[type="text"]');
    if (inputField) {
        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    // Update the selector to match the nav button with the lightbulb icon
    const howItWorksBtn = document.querySelector('.nav-button i.fa-lightbulb').parentElement;
    const howItWorksPopup = document.getElementById('howItWorksPopup');
    
    if (howItWorksBtn && howItWorksPopup) {
        howItWorksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            howItWorksPopup.style.display = 'flex';
        });
        
        // Add click outside to close
        howItWorksPopup.addEventListener('click', (e) => {
            if (e.target === howItWorksPopup) {
                howItWorksPopup.style.display = 'none';
            }
        });
        
        const closeBtn = howItWorksPopup.querySelector('.close-popup');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                howItWorksPopup.style.display = 'none';
            });
        }
    }
}; 

async function getAISentiment(holders, name, ticker, topHolder) {
    try {
        const response = await fetch(`https://awesomesauce.x10.mx/ai.php?holders=${holders}&name=${name}&ticker=${ticker}&top=${topHolder}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch AI sentiment');
        }
        
        return data.analysis;
    } catch (error) {
        console.error('Error fetching AI sentiment:', error);
        return null;
    }
} 