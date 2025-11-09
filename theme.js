(function() {
  'use strict';

  class ThemeManager {
    constructor() {
      this.storageKey = 'ecommerce_theme';
      this.theme = this.loadTheme();
      this.init();
    }

    loadTheme() {
      try {
        return localStorage.getItem(this.storageKey) || 'light';
      } catch (error) {
        console.error('Error loading theme:', error);
        return 'light';
      }
    }

    saveTheme(theme) {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }

    init() {
      this.applyTheme(this.theme, false);
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createToggleButton());
      } else {
        this.createToggleButton();
      }
    }

    createToggleButton() {
      const navbar = document.querySelector('.navbar-nav');
      if (!navbar) return;

      const themeToggle = document.createElement('li');
      themeToggle.className = 'nav-item ms-2';
      themeToggle.innerHTML = `
        <button id="theme-toggle" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" title="Toggle theme">
          <i class="ri-moon-line" id="theme-icon"></i>
          <span class="d-none d-lg-inline" id="theme-text">Dark</span>
        </button>
      `;
      
      navbar.appendChild(themeToggle);
      this.updateToggleButton();

      document.getElementById('theme-toggle').addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.theme, true);
      this.saveTheme(this.theme);
    }

    applyTheme(theme, animate = false) {
      const body = document.body;
      
      if (animate) {
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      }

      if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }

      this.updateToggleButton();

      if (animate) {
        setTimeout(() => {
          body.style.transition = '';
        }, 300);
      }
    }

    updateToggleButton() {
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      if (icon && text) {
        if (this.theme === 'dark') {
          icon.className = 'ri-sun-line';
          text.textContent = 'Light';
        } else {
          icon.className = 'ri-moon-line';
          text.textContent = 'Dark';
        }
      }
    }
  }

  window.themeManager = new ThemeManager();
})();
