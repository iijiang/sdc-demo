/**
 * Notification Card - NATIVE JAVASCRIPT VERSION
 * 
 * This version uses pure vanilla JavaScript with no Drupal dependencies.
 * 
 * PROS:
 * - Simple and portable
 * - No framework dependencies
 * - Works anywhere (Drupal, WordPress, static HTML)
 * 
 * CONS:
 * - Won't work with Drupal AJAX
 * - Won't work with BigPipe
 * - No protection against double-initialization
 * - Can't access Drupal settings
 */

(function() {
  'use strict';
  
  /**
   * Initialize when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Find all notification cards
    const cards = document.querySelectorAll('.notification-card');
    cards.forEach(initializeCard);
  }
  
  /**
   * Initialize a single card
   */
  function initializeCard(card) {
    // Skip if already initialized (manual check)
    if (card.dataset.initialized === 'true') {
      return;
    }
    card.dataset.initialized = 'true';
    
    const dismissButton = card.querySelector('.notification-dismiss');
    
    if (dismissButton) {
      dismissButton.addEventListener('click', function(e) {
        e.preventDefault();
        dismissCard(card);
      });
    }
    
    // Auto-dismiss success notifications
    if (card.classList.contains('notification-card--success')) {
      setTimeout(function() {
        dismissCard(card);
      }, 5000);
    }
    
    // Entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateX(100%)';
    
    setTimeout(function() {
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateX(0)';
    }, 50);
    
    // Hover effect
    card.addEventListener('mouseenter', function() {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  }
  
  /**
   * Dismiss a card with animation
   */
  function dismissCard(card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateX(100%)';
    
    setTimeout(function() {
      card.remove();
    }, 300);
  }
  
  /**
   * Public API - Can be called from anywhere
   */
  window.NotificationCard = {
    /**
     * Show a notification programmatically
     */
    show: function(options) {
      const defaults = {
        variant: 'info',
        title: 'Notification',
        message: '',
        dismissible: true
      };
      
      const config = Object.assign({}, defaults, options);
      
      // Create container if needed
      let container = document.querySelector('.notification-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          max-width: 400px;
        `;
        document.body.appendChild(container);
      }
      
      // Create notification
      const card = document.createElement('div');
      card.className = 'notification-card notification-card--' + config.variant;
      card.innerHTML = `
        <sl-card>
          <div slot="header" class="notification-header">
            <div class="notification-icon">
              <sl-icon name="info-circle"></sl-icon>
            </div>
            <div class="notification-title-wrapper">
              <h3 class="notification-title">${escapeHtml(config.title)}</h3>
            </div>
            ${config.dismissible ? '<sl-icon-button name="x-lg" class="notification-dismiss"></sl-icon-button>' : ''}
          </div>
          <div class="notification-message">${config.message}</div>
        </sl-card>
      `;
      
      container.appendChild(card);
      
      // Initialize the new card
      initializeCard(card);
      
      return card;
    }
  };
  
  /**
   * Helper: Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
})();
