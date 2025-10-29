/**
 * Notification Card - Native JavaScript (Framework Agnostic)
 * 
 * This is a pure vanilla JavaScript implementation that can work
 * in any environment: Drupal, WordPress, static HTML, React, etc.
 * 
 * No framework dependencies!
 */

(function (window) {
  'use strict';

  /**
   * Auto-initialize on DOM ready
   */
  function autoInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initializeAll();
      });
    } else {
      initializeAll();
    }
  }
  
  /**
   * Initialize all notification cards on page
   */
  function initializeAll() {
    document.querySelectorAll('.notification-card').forEach(function(card) {
      // Skip if already initialized
      if (card.dataset.notificationInitialized === 'true') {
        return;
      }
      card.dataset.notificationInitialized = 'true';
      initializeCard(card);
    });
  }

  /**
   * Initialize a single notification card
   */
  function initializeCard(card) {
    const dismissButton = card.querySelector('.notification-dismiss');
    
    // Handle dismiss button click
    if (dismissButton) {
      dismissButton.addEventListener('click', function (e) {
        e.preventDefault();
        dismissCard(card);
      });
    }

    // Auto-dismiss for certain variants after timeout
    const variant = getVariant(card);
    if (variant === 'success' && card.dataset.autoDismiss !== 'false') {
      setTimeout(function () {
        dismissCard(card);
      }, 5000); // Dismiss success notifications after 5 seconds
    }

    // Add entrance animation
    animateIn(card);

    // Make card interactive - highlight on hover
    card.addEventListener('mouseenter', function () {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });

    // Keyboard accessibility - dismiss with Escape key
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dismissButton) {
        dismissCard(card);
      }
    });

    // Log notification for analytics (example)
    logNotification(card);
  }

  /**
   * Dismiss/remove a notification card with animation
   */
  function dismissCard(card) {
    // Trigger Drupal event before dismissing
    const event = new CustomEvent('notificationDismiss', {
      detail: {
        variant: getVariant(card),
        title: card.querySelector('.notification-title')?.textContent
      }
    });
    document.dispatchEvent(event);

    // Animate out
    card.style.transition = 'all 0.3s ease-out';
    card.style.opacity = '0';
    card.style.transform = 'translateX(100%)';
    
    // Remove from DOM after animation
    setTimeout(function () {
      card.remove();
      
      // Trigger removed event
      const removedEvent = new CustomEvent('notificationRemoved', {
        detail: { variant: getVariant(card) }
      });
      document.dispatchEvent(removedEvent);
    }, 300);
  }

  /**
   * Animate card entrance
   */
  function animateIn(card) {
    // Start hidden
    card.style.opacity = '0';
    card.style.transform = 'translateX(100%)';
    
    // Animate in
    setTimeout(function () {
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateX(0)';
    }, 50);
  }

  /**
   * Get variant from card classes
   */
  function getVariant(card) {
    const classes = card.className;
    if (classes.includes('notification-card--success')) return 'success';
    if (classes.includes('notification-card--warning')) return 'warning';
    if (classes.includes('notification-card--danger')) return 'danger';
    return 'info';
  }

  /**
   * Log notification view (example - could send to analytics)
   */
  function logNotification(card) {
    const data = {
      variant: getVariant(card),
      title: card.querySelector('.notification-title')?.textContent,
      timestamp: new Date().toISOString()
    };
    
    // Example: Send to analytics
    // if (window.gtag) {
    //   gtag('event', 'notification_view', data);
    // }
    
    // Or store in localStorage
    const logs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
    logs.push(data);
    localStorage.setItem('notificationLogs', JSON.stringify(logs.slice(-50))); // Keep last 50
    
    console.log('Notification viewed:', data);
  }

  /**
   * Public API - Create notification programmatically
   */
  window.NotificationCard = {
    /**
     * Initialize a specific element or all cards
     */
    init: function(element) {
      if (element) {
        if (element.dataset.notificationInitialized !== 'true') {
          element.dataset.notificationInitialized = 'true';
          initializeCard(element);
        }
      } else {
        initializeAll();
      }
    },
    /**
     * Create and show a notification
     * 
     * @param {Object} options
     * @param {string} options.variant - info, success, warning, danger
     * @param {string} options.title - Notification title
     * @param {string} options.message - Notification message (HTML)
     * @param {boolean} options.dismissible - Can be dismissed
     * @param {number} options.duration - Auto-dismiss after X ms (0 = no auto-dismiss)
     */
    show: function (options) {
      const defaults = {
        variant: 'info',
        title: 'Notification',
        message: '',
        dismissible: true,
        duration: 0,
        icon: getDefaultIcon(options.variant)
      };
      
      const config = Object.assign({}, defaults, options);
      
      // Create container if it doesn't exist
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
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `;
        document.body.appendChild(container);
      }
      
      // Create notification HTML
      const notification = document.createElement('div');
      notification.innerHTML = `
        <sl-card class="notification-card notification-card--${config.variant}">
          <div slot="header" class="notification-header">
            <div class="notification-icon">
              <sl-icon name="${config.icon}"></sl-icon>
            </div>
            <div class="notification-title-wrapper">
              <h3 class="notification-title">${escapeHtml(config.title)}</h3>
            </div>
            ${config.dismissible ? '<sl-icon-button name="x-lg" label="Dismiss" class="notification-dismiss"></sl-icon-button>' : ''}
          </div>
          <div class="notification-message">
            ${config.message}
          </div>
        </sl-card>
      `;
      
      const card = notification.firstElementChild;
      container.appendChild(card);
      
      // Initialize the new card
      initializeCard(card);
      
      // Auto-dismiss if duration specified
      if (config.duration > 0) {
        setTimeout(function () {
          dismissCard(card);
        }, config.duration);
      }
      
      return card;
    }
  };

  /**
   * Get default icon for variant
   */
  function getDefaultIcon(variant) {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      danger: 'exclamation-octagon'
    };
    return icons[variant] || icons.info;
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Auto-initialize on page load
  autoInit();

})(window);
