# Component Architecture: Native JS + Drupal Integration

## The Right Way to Structure JavaScript in SDC Components

### Principle: Separation of Concerns

**Components = Framework Agnostic (Portable)**
- Pure native JavaScript
- No Drupal dependencies
- Can be used anywhere

**Theme = Framework Integration (Drupal-specific)**
- Wraps native component
- Adds Drupal behaviors
- Handles AJAX/BigPipe

---

## File Structure

```
components/notification_card/
├── notification_card.component.yml    # Component definition
├── notification_card.twig            # Template
├── notification_card.css             # Styles
├── notification_card.js              # ⭐ Native JS (no Drupal)
└── notification_card.libraries.yml   # Registers JS (no dependencies)

themes/custom/sdc_shoelace/
├── js/
│   └── notification-card-drupal.js   # ⭐ Drupal wrapper
└── sdc_shoelace.libraries.yml        # Registers Drupal wrapper
```

---

## Component JS (Native)

**Location:** `components/notification_card/notification_card.js`

**Purpose:** Framework-agnostic functionality

**Pattern:**
```javascript
(function (window) {
  'use strict';
  
  // Native initialization
  function initializeCard(card) {
    // Pure vanilla JS
    const button = card.querySelector('.dismiss');
    button.addEventListener('click', function() {
      card.remove();
    });
  }
  
  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
  } else {
    initializeAll();
  }
  
  // Public API
  window.NotificationCard = {
    init: function(element) {
      initializeCard(element);
    },
    show: function(options) {
      // Create and show notification
    }
  };
  
})(window);
```

**Key Points:**
- ✅ No Drupal dependencies
- ✅ Works in any environment
- ✅ Auto-initializes on page load
- ✅ Provides global API
- ✅ Manual double-init protection

---

## Theme JS (Drupal Integration)

**Location:** `themes/custom/sdc_shoelace/js/notification-card-drupal.js`

**Purpose:** Make component work with Drupal

**Pattern:**
```javascript
(function (Drupal, once) {
  'use strict';
  
  // Drupal behavior wrapper
  Drupal.behaviors.notificationCard = {
    attach: function (context, settings) {
      // Use 'once' for AJAX protection
      once('notification-card', '.notification-card', context).forEach(function (card) {
        // Delegate to native component
        if (window.NotificationCard) {
          window.NotificationCard.init(card);
        }
      });
    }
  };
  
  // Optional: Drupal-namespaced API
  Drupal.notificationCard = {
    show: function(options) {
      return window.NotificationCard.show(options);
    }
  };
  
})(Drupal, once);
```

**Key Points:**
- ✅ Wraps native component
- ✅ Adds Drupal behaviors
- ✅ Uses `once` utility
- ✅ Handles AJAX/BigPipe
- ✅ Provides Drupal API

---

## Library Registration

### Component Library (Native)

**File:** `components/notification_card/notification_card.libraries.yml`

```yaml
notification_card:
  js:
    notification_card.js: {}
  # No dependencies!
```

### Theme Library (Drupal)

**File:** `themes/custom/sdc_shoelace/sdc_shoelace.libraries.yml`

```yaml
notification-card-drupal:
  js:
    js/notification-card-drupal.js: {}
  dependencies:
    - core/drupal
    - core/once
    - sdc_shoelace/notification_card  # Load native component first
```

---

## Usage

### 1. Component Auto-Loads (Native)

When you include the component in a template:

```twig
{% include 'sdc_shoelace:notification_card' with {
  variant: 'success',
  title: 'Welcome'
} %}
```

The native JS automatically initializes on page load.

### 2. Manually Load Drupal Wrapper

If you need AJAX support, attach the Drupal library:

**In template:**
```twig
{{ attach_library('sdc_shoelace/notification-card-drupal') }}

{% include 'sdc_shoelace:notification_card' with { ... } %}
```

**In PHP:**
```php
$build['#attached']['library'][] = 'sdc_shoelace/notification-card-drupal';
```

### 3. Use from JavaScript

**Native API (works everywhere):**
```javascript
NotificationCard.show({
  variant: 'success',
  title: 'Success!',
  message: '<p>Operation completed</p>'
});
```

**Drupal API (if Drupal wrapper loaded):**
```javascript
Drupal.notificationCard.show({
  variant: 'success',
  title: 'Success!',
  message: '<p>Operation completed</p>'
});
```

---

## When AJAX is Involved

### Without Drupal Wrapper ❌

```twig
{# Component template #}
{% include 'sdc_shoelace:notification_card' with { ... } %}
```

**Result:**
- ✅ Works on initial page load
- ❌ New cards from AJAX won't initialize
- ❌ BigPipe content won't initialize

### With Drupal Wrapper ✅

```twig
{# Attach Drupal integration #}
{{ attach_library('sdc_shoelace/notification-card-drupal') }}

{% include 'sdc_shoelace:notification_card' with { ... } %}
```

**Result:**
- ✅ Works on initial page load
- ✅ AJAX content initializes automatically
- ✅ BigPipe content initializes automatically

---

## Benefits of This Architecture

### For Component Authors

**Portability:**
```javascript
// Same component works in:
// - Drupal 10
// - WordPress
// - Static HTML
// - React app
// - Vue app
```

**No Framework Lock-in:**
```javascript
// Component has zero dependencies
// Can be extracted and reused anywhere
```

**Easier Testing:**
```javascript
// Pure functions, no framework magic
// Can unit test without Drupal
```

### For Theme Developers

**AJAX Support:**
```javascript
// Drupal wrapper handles complexity
// Component doesn't need to know about AJAX
```

**Drupal Integration:**
```javascript
// Can access Drupal settings
// Can emit Drupal events
// Can integrate with other modules
```

**Gradual Enhancement:**
```javascript
// Component works without wrapper
// Wrapper adds Drupal features
// Progressive enhancement!
```

---

## Real-World Example

### Scenario: Views with AJAX Pager

**Without Drupal Wrapper:**
```
Page 1: Notification initializes ✅
Click "Next Page" (AJAX)
Page 2: Notification doesn't initialize ❌
```

**With Drupal Wrapper:**
```
Page 1: Notification initializes ✅
Click "Next Page" (AJAX)
Page 2: Notification initializes ✅  ← Drupal.behaviors re-runs!
```

### Scenario: Using in WordPress

**Extract native component:**
```bash
cp components/notification_card/notification_card.js ~/wordpress/wp-content/themes/my-theme/js/
cp components/notification_card/notification_card.css ~/wordpress/wp-content/themes/my-theme/css/
```

**Enqueue in WordPress:**
```php
wp_enqueue_script('notification-card', 
  get_template_directory_uri() . '/js/notification_card.js'
);
```

**It just works!** No modifications needed.

---

## Migration Guide

### If You Have Drupal-Dependent Component JS

**Before (Drupal-dependent):**
```javascript
// components/my_component/my_component.js
(function (Drupal, once) {
  Drupal.behaviors.myComponent = {
    attach: function (context, settings) {
      once('my-component', '.my-component', context).forEach(init);
    }
  };
})(Drupal, once);
```

**After (Native with Drupal wrapper):**

**Step 1:** Make component native
```javascript
// components/my_component/my_component.js
(function (window) {
  function init(element) {
    // Your code here
  }
  
  // Auto-init
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.my-component').forEach(function(el) {
      if (!el.dataset.initialized) {
        el.dataset.initialized = 'true';
        init(el);
      }
    });
  });
  
  // Public API
  window.MyComponent = { init: init };
})(window);
```

**Step 2:** Create Drupal wrapper
```javascript
// themes/my_theme/js/my-component-drupal.js
(function (Drupal, once) {
  Drupal.behaviors.myComponent = {
    attach: function (context, settings) {
      once('my-component', '.my-component', context).forEach(function(el) {
        window.MyComponent.init(el);
      });
    }
  };
})(Drupal, once);
```

**Step 3:** Update libraries
```yaml
# Component library - no dependencies
my_component:
  js:
    my_component.js: {}

# Theme library - Drupal integration
my-component-drupal:
  js:
    js/my-component-drupal.js: {}
  dependencies:
    - core/drupal
    - core/once
    - my_theme/my_component
```

---

## Summary

✅ **Components = Native JS** (portable, reusable)
✅ **Theme = Drupal wrapper** (AJAX support, integration)
✅ **Component loads automatically** (works on page load)
✅ **Wrapper is optional** (only needed for AJAX)
✅ **Best of both worlds** (portable + powerful)

This architecture gives you:
- **Portability** - Component works anywhere
- **Power** - Drupal wrapper adds advanced features
- **Flexibility** - Use with or without wrapper
- **Maintainability** - Clear separation of concerns

**Use this pattern for all your SDC components!** 🚀
