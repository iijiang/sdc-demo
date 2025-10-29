/**
 * Drupal integration for Notification Card component
 * 
 * This file wraps the native notification_card.js component
 * to work with Drupal's AJAX and BigPipe systems.
 * 
 * The component itself (notification_card.js) remains framework-agnostic.
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Drupal behavior to initialize notification cards
   * This makes the component work with AJAX and BigPipe
   */
  Drupal.behaviors.notificationCard = {
    attach: function (context, settings) {
      // Use 'once' to prevent double-initialization
      // Then delegate to the native component's init method
      once('notification-card', '.notification-card', context).forEach(function (card) {
        // Call the native component's init method
        if (window.NotificationCard) {
          window.NotificationCard.init(card);
        }
      });
    }
  };

  /**
   * Provide Drupal-namespaced API
   * This allows other Drupal code to use: Drupal.notificationCard.show()
   */
  Drupal.notificationCard = {
    /**
     * Show a notification (delegates to native component)
     */
    show: function (options) {
      if (window.NotificationCard) {
        return window.NotificationCard.show(options);
      }
    },
    
    /**
     * Initialize cards (delegates to native component)
     */
    init: function (element) {
      if (window.NotificationCard) {
        window.NotificationCard.init(element);
      }
    }
  };

  /**
   * Optional: Listen to Drupal-specific events
   * Example: Convert Drupal status messages to notifications
   */
  Drupal.behaviors.convertDrupalMessages = {
    attach: function (context, settings) {
      once('convert-messages', '.messages', context).forEach(function (messageEl) {
        // Determine variant from Drupal message type
        let variant = 'info';
        if (messageEl.classList.contains('messages--status')) variant = 'success';
        if (messageEl.classList.contains('messages--warning')) variant = 'warning';
        if (messageEl.classList.contains('messages--error')) variant = 'danger';
        
        const title = messageEl.querySelector('.messages__title')?.textContent || 'Notification';
        const content = messageEl.querySelector('.messages__content, .messages__list') || messageEl;
        const message = content.innerHTML;
        
        // Use the native component to show notification
        if (window.NotificationCard) {
          window.NotificationCard.show({
            variant: variant,
            title: title,
            message: message,
            dismissible: true,
            duration: variant === 'success' ? 5000 : 0
          });
        }
        
        // Hide the original Drupal message
        messageEl.style.display = 'none';
      });
    }
  };

})(Drupal, once);
