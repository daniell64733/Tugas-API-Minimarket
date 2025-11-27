// Page Loader Functionality
class PageLoader {
  constructor() {
    this.loader = document.getElementById("page-loader");
    this.init();
  }

  init() {
    if (!this.loader) {
      this.createLoader();
    }
    this.show();
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.hide();
      }, 1000);
    });
  }

  createLoader() {
    this.loader = document.createElement("div");
    this.loader.id = "page-loader";
    this.loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Memuat...</p>
            </div>
        `;
    document.body.prepend(this.loader);

    // Add styles
    const styles = `
            #page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
                color: white;
            }
            
            .loader-spinner {
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loader-content p {
                margin: 0;
                font-size: 1.1rem;
            }
            
            #page-loader.hidden {
                opacity: 0;
                pointer-events: none;
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  show() {
    this.loader.classList.remove("hidden");
  }

  hide() {
    this.loader.classList.add("hidden");
    setTimeout(() => {
      if (this.loader.parentNode) {
        this.loader.parentNode.removeChild(this.loader);
      }
    }, 500);
  }
}

// Initialize page loader
document.addEventListener("DOMContentLoaded", () => {
  new PageLoader();
});
