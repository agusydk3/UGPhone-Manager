// UGPhone LocalStorage Manager - Content Script
console.log('🎮 UGPhone Extension loaded on:', window.location.href);

class UGPhoneManager {
    constructor() {
        console.log('🚀 Initializing UGPhone Manager...');
        this.balloon = null;
        this.popup = null;
        this.isPopupOpen = false;
        this.init();
    }

    init() {
        console.log('📝 Creating balloon and popup...');
        this.createBalloon();
        this.createPopup();
        this.attachEventListeners();
        console.log('✅ UGPhone Manager initialized successfully!');
    }

    createBalloon() {
        // Create floating balloon with image
        this.balloon = document.createElement('div');
        this.balloon.id = 'ugphone-balloon';
        this.balloon.innerHTML = `
            <div class="balloon-container">
                <div class="balloon-image">
                    <img src="${chrome.runtime.getURL('img/miku.jpeg')}" alt="Balloon" />
                </div>
                <div class="balloon-pulse"></div>
            </div>
        `;
        
        document.body.appendChild(this.balloon);
        console.log('🎈 Balloon created and added to body');
        
        // Prevent any potential overflow
        this.preventOverflow();

        // Add entrance animation
        setTimeout(() => {
            this.balloon.classList.add('show');
            console.log('🎯 Balloon animation triggered');
        }, 500);
    }

    preventOverflow() {
        // Make sure balloon doesn't cause overflow
        const style = document.createElement('style');
        style.textContent = `
            body { 
                overflow-x: hidden !important; 
            }
            #ugphone-balloon {
                max-width: 300px !important;
                max-height: 300px !important;
                contain: layout style !important;
            }
        `;
        document.head.appendChild(style);
    }

    createPopup() {
        this.popup = document.createElement('div');
        this.popup.id = 'ugphone-popup';
        this.popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-panel">
                <div class="popup-header">
                    <div class="header-icon">
                        <img src="${chrome.runtime.getURL('img/miku.jpeg')}" alt="Icon" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" />
                    </div>
                    <h2>UGPhone Manager</h2>
                    <button class="close-btn" id="close-popup">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="popup-content">
                    <!-- Import Section -->
                    <div class="section">
                        <div class="section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <h3>Import LocalStorage</h3>
                        </div>
                        <p>Masukkan kode localStorage dalam format JSON:</p>
                        <div class="textarea-container">
                            <textarea 
                                id="localstorage-input"
                            ></textarea>
                        </div>
                        <button class="btn btn-import" id="import-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span>Import & Masuk</span>
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="section-divider"></div>

                    <!-- Logout Section -->
                    <div class="section">
                        <div class="section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m9 21 5-5-5-5"></path>
                                <path d="M20 4v7a4 4 0 0 1-4 4H3"></path>
                            </svg>
                            <h3>Logout</h3>
                        </div>
                        <p>Hapus semua data localStorage dan keluar dari akun</p>
                        <button class="btn btn-logout" id="logout-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18l-2 13H5L3 6z"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Logout & Hapus Data</span>
                        </button>
                    </div>
                    
                    <!-- Divider -->
                    <div class="section-divider"></div>
                    
                    <!-- Promo Section -->
                    <div class="section">
                        <div class="section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                            <h3>Order Account</h3>
                        </div>

                        <button class="btn btn-promo" id="promo-btn" onclick="window.open('https://t.me/ratsstore', '_blank')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span>Order Here</span>
                        </button>
                    </div>
                </div>

                <!-- Status Bar -->
                <div class="status-bar" id="status-bar">
                    <div class="status-content">
                        <span class="status-icon"></span>
                        <span class="status-text"></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.popup);
    }

    attachEventListeners() {
        // Balloon click to toggle popup
        this.balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup();
        });

        // Close popup events
        document.getElementById('close-popup').addEventListener('click', () => {
            this.closePopup();
        });

        this.popup.querySelector('.popup-overlay').addEventListener('click', () => {
            this.closePopup();
        });

        // Import button
        document.getElementById('import-btn').addEventListener('click', () => {
            this.importLocalStorage();
        });

        // Logout button  
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupOpen) {
                this.closePopup();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isPopupOpen && !this.popup.contains(e.target) && !this.balloon.contains(e.target)) {
                this.closePopup();
            }
        });
    }

    togglePopup() {
        if (this.isPopupOpen) {
            this.closePopup();
        } else {
            this.openPopup();
        }
    }

    openPopup() {
        this.popup.classList.add('show');
        this.balloon.classList.add('active');
        this.isPopupOpen = true;
        
        // Focus textarea
        setTimeout(() => {
            document.getElementById('localstorage-input').focus();
        }, 300);
    }

    closePopup() {
        this.popup.classList.remove('show');
        this.balloon.classList.remove('active');
        this.isPopupOpen = false;
        this.hideStatus();
    }

    async importLocalStorage() {
        const input = document.getElementById('localstorage-input');
        const importBtn = document.getElementById('import-btn');

        try {
            const data = input.value.trim();
            if (!data) {
                this.showStatus('error', 'Mohon masukkan data localStorage');
                return;
            }

            // Set loading state
            importBtn.classList.add('loading');
            importBtn.querySelector('span').textContent = 'Importing...';

            // Parse JSON
            let parsedData;
            try {
                parsedData = JSON.parse(data);
            } catch (e) {
                throw new Error('Format JSON tidak valid. Periksa syntax JSON Anda.');
            }

            // Clear existing localStorage
            localStorage.clear();

            // Import new data
            for (const [key, value] of Object.entries(parsedData)) {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, String(value));
                }
            }

            this.showStatus('success', 'Import berhasil! Mengarahkan ke dashboard...');

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'https://ugphone.com/toc-portal/#/dashboard/index';
            }, 2000);

        } catch (error) {
            this.showStatus('error', `Error: ${error.message}`);
            importBtn.classList.remove('loading');
            importBtn.querySelector('span').textContent = 'Import & Masuk';
        }
    }

    async logout() {
        const logoutBtn = document.getElementById('logout-btn');
        
        try {
            // Set loading state
            logoutBtn.classList.add('loading');
            logoutBtn.querySelector('span').textContent = 'Logging out...';

            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear cookies if possible
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });

            this.showStatus('success', 'Logout berhasil! Refreshing halaman...');

            // Refresh page
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            this.showStatus('error', `Error: ${error.message}`);
            logoutBtn.classList.remove('loading');
            logoutBtn.querySelector('span').textContent = 'Logout & Hapus Data';
        }
    }

    showStatus(type, message) {
        const statusBar = document.getElementById('status-bar');
        const statusIcon = statusBar.querySelector('.status-icon');
        const statusText = statusBar.querySelector('.status-text');

        statusText.textContent = message;
        statusBar.className = `status-bar show ${type}`;

        if (type === 'success') {
            statusIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>`;
        } else if (type === 'error') {
            statusIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
        }

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideStatus();
        }, 5000);
    }

    hideStatus() {
        const statusBar = document.getElementById('status-bar');
        statusBar.classList.remove('show');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new UGPhoneManager());
} else {
    new UGPhoneManager();
}