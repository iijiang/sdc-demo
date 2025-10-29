# Native JavaScript vs Drupal JavaScript in SDC Components

## Side-by-Side Comparison

### Initialization

**Native JavaScript:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.notification-card').forEach(function(card) {
    // Initialize each card
  });
});
```

**Drupal JavaScript:**
```javascript
Drupal.behaviors.notificationCard = {
  attach: function (context, settings) {
    once('notification-card', '.notification-card', context).forEach(function(card) {
      // Initialize each card
    });
  }
};
```

---

### Preventing Double Initialization

**Native JavaScript:**
```javascript
function initializeCard(card) {
  // Manual check required
  if (card.dataset.initialized === 'true') {
    return;
  }
  card.dataset.initialized = 'true';
  
  // Your code...
}
```

**Drupal JavaScript:**
```javascript
// 'once' utility handles this automatically
once('notification-card', '.notification-card', context).forEach(function(card) {
  // Will only run once per card, even with AJAX
});
```

---

### AJAX Support

**Native JavaScript:**
```javascript
// ❌ New content from AJAX won't be initialized
document.addEventListener('DOMContentLoaded', function() {
  // Only runs on initial page load
});
```

**Drupal JavaScript:**
```javascript
// ✅ Runs on initial load AND after every AJAX request
Drupal.behaviors.notificationCard = {
  attach: function (context, settings) {
    // Runs whenever new content is added to the page
  }
};
```

---

### Context Awareness

**Native JavaScript:**
```javascript
// Searches entire document every time
document.querySelectorAll('.notification-card').forEach(...)
```

**Drupal JavaScript:**
```javascript
// Only searches newly added content (context)
once('notification-card', '.notification-card', context).forEach(...)
```

**Why context matters:**

```html
<!-- Initial page load -->
<div id="content">
  <div class="notification-card">...</div> <!-- Gets initialized -->
</div>

<!-- After AJAX loads more content -->
<div id="content">
  <div class="notification-card">...</div> <!-- Already initialized, skip -->
  <div class="notification-card">...</div> <!-- NEW, initialize this one -->
</div>
```

---

### Accessing Drupal Settings

**Native JavaScript:**
```javascript
// ❌ Can't access Drupal settings
const apiKey = '???'; // Have to hardcode
```

**Drupal JavaScript:**
```javascript
// ✅ Can access settings passed from PHP
Drupal.behaviors.notificationCard = {
  attach: function (context, settings) {
    const apiKey = settings.notificationCard.apiKey;
    const timeout = settings.notificationCard.timeout;
  }
};
```

In PHP:
```php
$build['#attached']['drupalSettings']['notificationCard'] = [
  'apiKey' => 'abc123',
  'timeout' => 5000,
];
```

---

### Library Dependencies

**Native JavaScript:**
```yaml
# .libraries.yml
notification_card_native:
  js:
    notification_card_native.js: {}
  # No dependencies needed
```

**Drupal JavaScript:**
```yaml
# .libraries.yml
notification_card:
  js:
    notification_card.js: {}
  dependencies:
    - core/drupal    # Provides Drupal object
    - core/once      # Provides once utility
```

---

### Global API

**Both support global APIs the same way:**

```javascript
// Native
window.NotificationCard = {
  show: function(options) { ... }
};

// Drupal (can also add to Drupal namespace)
Drupal.notificationCard = {
  show: function(options) { ... }
};

// Either way, can be called:
NotificationCard.show({ variant: 'success' });
// or
Drupal.notificationCard.show({ variant: 'success' });
```

---

## Real-World Scenarios

### Scenario 1: Static Website

**Use Native JS:**
```javascript
// No AJAX, no Drupal behaviors needed
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.notification-card').forEach(initCard);
});
```

### Scenario 2: Drupal with Views AJAX

**Use Drupal JS:**
```javascript
// View with AJAX pager - needs Drupal behaviors
Drupal.behaviors.notificationCard = {
  attach: function (context, settings) {
    // Runs when view loads new page via AJAX
    once('notification-card', '.notification-card', context).forEach(initCard);
  }
};
```

### Scenario 3: Drupal Layout Builder

**Use Drupal JS:**
```javascript
// Layout Builder adds blocks dynamically - needs Drupal behaviors
Drupal.behaviors.notificationCard = {
  attach: function (context, settings) {
    // Runs when new block is added
    once('notification-card', '.notification-card', context).forEach(initCard);
  }
};
```

### Scenario 4: Form with AJAX Submit

**Use Drupal JS:**
```javascript
Drupal.behaviors.formNotifications = {
  attach: function (context, settings) {
    // Form replaces itself after AJAX submit
    // This re-runs on the new form
    once('form-submit', 'form', context).forEach(function(form) {
      form.addEventListener('submit', function() {
        // Show notification after submit
      });
    });
  }
};
```

---

## The Hybrid Approach (Recommended)

Write portable native JS, wrap in Drupal behaviors:

```javascript
(function (Drupal, once) {
  'use strict';
  
  /**
   * Pure native JavaScript - works anywhere
   * Can be extracted and used in non-Drupal projects
   */
  function NotificationCardCore(element) {
    this.element = element;
    this.dismissButton = element.querySelector('.notification-dismiss');
    
    if (this.dismissButton) {
      this.dismissButton.addEventListener('click', this.dismiss.bind(this));
    }
  }
  
  NotificationCardCore.prototype.dismiss = function() {
    this.element.style.opacity = '0';
    setTimeout(() => this.element.remove(), 300);
  };
  
  NotificationCardCore.prototype.animateIn = function() {
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      this.element.style.transition = 'all 0.4s ease';
      this.element.style.opacity = '1';
      this.element.style.transform = 'translateX(0)';
    }, 50);
  };
  
  /**
   * Drupal behavior wrapper - handles AJAX/BigPipe
   */
  Drupal.behaviors.notificationCard = {
    attach: function (context, settings) {
      once('notification-card', '.notification-card', context).forEach(function(element) {
        const card = new NotificationCardCore(element);
        card.animateIn();
        
        // Store instance on element for later access
        element.notificationCard = card;
      });
    }
  };
  
  /**
   * Public API - accessible from anywhere
   */
  Drupal.notificationCard = {
    show: function(options) {
      // Create element
      const element = document.createElement('div');
      element.className = 'notification-card';
      // ... create HTML ...
      document.body.appendChild(element);
      
      // Use core logic
      const card = new NotificationCardCore(element);
      card.animateIn();
      
      return card;
    }
  };
  
})(Drupal, once);
```

**Benefits:**
- ✅ Core logic is pure JavaScript (portable)
- ✅ Wrapped in Drupal behaviors (AJAX support)
- ✅ Works in Drupal AND can be extracted for other uses
- ✅ Object-oriented approach
- ✅ Testable (can unit test the core class)

---

## Which Should You Use?

### For Your Drupal Theme: **Use Drupal JavaScript**

**Why?**
1. Your site uses Drupal features (Views, Blocks, Forms)
2. Many of these use AJAX
3. Layout Builder/Paragraphs add dynamic content
4. Other developers expect Drupal patterns
5. Future-proof for Drupal updates

### File to Use:

Keep the existing `notification_card.js` (Drupal version), because:
- ✅ Works with Drupal AJAX
- ✅ Works with BigPipe
- ✅ Integrates with Drupal ecosystem
- ✅ Follows Drupal standards
- ✅ Other developers can understand/maintain it

### When You Might Use Native JS:

If you're building a component library that will be used:
- In WordPress sites
- In static HTML sites
- In React/Vue apps
- Outside Drupal entirely

Then provide both versions:
- `notification_card.js` - Drupal version
- `notification_card_native.js` - Standalone version

---

## Summary

**Native JavaScript:**
- Simple, portable, framework-agnostic
- Good for standalone components
- Doesn't work well with Drupal AJAX

**Drupal JavaScript:**
- Drupal-specific patterns
- Excellent AJAX support
- Integrates with Drupal ecosystem
- **Recommended for Drupal sites**

**Hybrid Approach:**
- Best of both worlds
- Core logic is portable
- Wrapped in Drupal patterns
- **Best for component libraries**

**For your SDC Shoelace theme: Stick with Drupal JavaScript!** Your existing `notification_card.js` is already the right approach. 👍
