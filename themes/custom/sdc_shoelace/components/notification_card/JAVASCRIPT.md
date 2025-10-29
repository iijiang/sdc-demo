# JavaScript in SDC Components

## Yes! Components Can Have JavaScript

SDC components support JavaScript files alongside templates and styles.

## File Structure

```
components/
  notification_card/
    notification_card.component.yml  ← Schema definition
    notification_card.twig           ← Template
    notification_card.css            ← Styles
    notification_card.js             ← JavaScript ✨
    notification_card.libraries.yml  ← Library definition (registers JS)
```

## How It Works

### 1. Create the JavaScript File

`notification_card.js`:
```javascript
(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.notificationCard = {
    attach: function (context, settings) {
      // Find all notification cards
      once('notification-card', '.notification-card', context).forEach(function (card) {
        // Your initialization code here
        initializeCard(card);
      });
    }
  };

})(Drupal, once);
```

### 2. Register in libraries.yml

`notification_card.libraries.yml`:
```yaml
notification_card:
  js:
    notification_card.js: {}
  dependencies:
    - core/drupal
    - core/once
```

### 3. Declare Dependencies in component.yml

`notification_card.component.yml`:
```yaml
id: sdc_shoelace:notification_card
label: "Notification Card"
libraryOverrides:
  dependencies:
    - core/once
    - core/drupal
props:
  # ... your props
```

## What the JavaScript Does

### 1. **Dismiss Functionality**
- Click X button to dismiss
- Animated fade + slide out
- Removes from DOM after animation

### 2. **Auto-dismiss**
- Success notifications auto-dismiss after 5 seconds
- Configurable timeout

### 3. **Animations**
- Entrance: Slide in from right
- Exit: Fade + slide out
- Hover: Elevation effect

### 4. **Keyboard Support**
- Press ESC to dismiss (when focused)
- Tab navigation support

### 5. **Analytics Tracking**
- Logs all notifications to localStorage
- Tracks variant, title, timestamp
- Can integrate with Google Analytics

### 6. **Event System**
- `notificationDismiss` - Fired when dismissed
- `notificationRemoved` - Fired when removed from DOM
- Listen to events for custom integrations

### 7. **Programmatic API**
Create notifications from JavaScript:

```javascript
Drupal.notificationCard.show({
  variant: 'success',
  title: 'Saved!',
  message: '<p>Your changes have been saved.</p>',
  dismissible: true,
  duration: 3000  // Auto-dismiss after 3 seconds
});
```

## Using Drupal Behaviors

### Why `Drupal.behaviors`?

Standard Drupal pattern for JavaScript that:
- ✅ Works with AJAX/BigPipe
- ✅ Runs on dynamic content
- ✅ Integrates with Drupal's JS system
- ✅ Prevents double initialization

### The `once` Utility

```javascript
once('notification-card', '.notification-card', context).forEach(...)
```

**Why use `once`?**
- Prevents running same code twice on same element
- Required for AJAX compatibility
- Part of Drupal core (dependency: `core/once`)

## Real-World Examples

### Example 1: Form Submission

```javascript
// In your custom module/theme JS
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Simulate form submission
  setTimeout(function() {
    Drupal.notificationCard.show({
      variant: 'success',
      title: 'Form Submitted',
      message: '<p>Your form has been submitted successfully!</p>',
      duration: 5000
    });
  }, 1000);
});
```

### Example 2: AJAX Callback

```php
// In your Drupal controller
public function ajaxCallback(array &$form, FormStateInterface $form_state) {
  $response = new AjaxResponse();
  
  // Add command to show notification
  $response->addCommand(new InvokeCommand(null, 'showNotification', [[
    'variant' => 'success',
    'title' => 'Success',
    'message' => '<p>Content updated!</p>'
  ]]));
  
  return $response;
}
```

```javascript
// Receive AJAX command
window.showNotification = function(options) {
  Drupal.notificationCard.show(options);
};
```

### Example 3: Integration with Drupal Messages

```javascript
// Convert Drupal status messages to notifications
Drupal.behaviors.convertMessages = {
  attach: function (context, settings) {
    once('convert-messages', '.messages', context).forEach(function(messageEl) {
      const type = messageEl.classList.contains('messages--status') ? 'success' :
                   messageEl.classList.contains('messages--warning') ? 'warning' :
                   messageEl.classList.contains('messages--error') ? 'danger' : 'info';
      
      const title = messageEl.querySelector('.messages__title')?.textContent || 'Notification';
      const message = messageEl.querySelector('.messages__content')?.innerHTML || '';
      
      Drupal.notificationCard.show({
        variant: type,
        title: title,
        message: message,
        dismissible: true,
        duration: type === 'success' ? 5000 : 0
      });
      
      // Hide original message
      messageEl.style.display = 'none';
    });
  }
};
```

## Testing the JavaScript

### 1. Clear Cache
```bash
docker-compose exec web vendor/bin/drush cr
```

### 2. Check Browser Console
Open DevTools and look for:
- ✅ No JavaScript errors
- ✅ "Notification viewed:" log messages
- ✅ localStorage data

### 3. Test Features
- Click dismiss button
- Press ESC key
- Wait for auto-dismiss
- Check animations

### 4. View Demo Page
Create a page at `/js-demo` or use `page--js-demo.html.twig`

## Debugging Tips

### JavaScript Not Running?

1. **Check library is loaded:**
   - Open DevTools → Network tab
   - Look for `notification_card.js`
   - Should return 200 status

2. **Check for errors:**
   - Open DevTools → Console tab
   - Look for red error messages

3. **Verify Drupal behaviors:**
   ```javascript
   // In console
   console.log(Drupal.behaviors.notificationCard);
   // Should show your behavior object
   ```

4. **Check dependencies:**
   ```yaml
   # Make sure these are in .libraries.yml
   dependencies:
     - core/drupal
     - core/once
   ```

### Common Issues

**"Drupal is not defined"**
- Missing `core/drupal` dependency

**"once is not defined"**
- Missing `core/once` dependency

**JavaScript runs twice**
- Not using `once()` utility properly

**Doesn't work with AJAX**
- Not using `Drupal.behaviors` pattern

## Best Practices

### 1. Always Use Drupal Behaviors
```javascript
// ✅ Good
Drupal.behaviors.myComponent = {
  attach: function (context, settings) {
    // ...
  }
};

// ❌ Bad
document.addEventListener('DOMContentLoaded', function() {
  // Won't work with AJAX
});
```

### 2. Always Use `once`
```javascript
// ✅ Good
once('my-key', '.my-selector', context).forEach(function(el) {
  // Runs once per element
});

// ❌ Bad
context.querySelectorAll('.my-selector').forEach(function(el) {
  // May run multiple times
});
```

### 3. Namespace Your Code
```javascript
// ✅ Good - Won't conflict
Drupal.behaviors.notificationCard = { ... };

// ❌ Bad - Generic name
Drupal.behaviors.init = { ... };
```

### 4. Use Events for Communication
```javascript
// Emit custom events
const event = new CustomEvent('notificationDismiss', {
  detail: { variant: 'success' }
});
document.dispatchEvent(event);

// Listen for events
document.addEventListener('notificationDismiss', function(e) {
  console.log(e.detail);
});
```

### 5. Clean Up Resources
```javascript
Drupal.behaviors.myComponent = {
  attach: function (context, settings) {
    once('my-component', '.my-selector', context).forEach(function(el) {
      
      function handleClick() { /* ... */ }
      
      // Add listener
      el.addEventListener('click', handleClick);
      
      // Store reference for cleanup
      el._handleClick = handleClick;
    });
  },
  
  detach: function (context, settings, trigger) {
    // Clean up when element is removed
    if (trigger === 'unload') {
      context.querySelectorAll('.my-selector').forEach(function(el) {
        if (el._handleClick) {
          el.removeEventListener('click', el._handleClick);
          delete el._handleClick;
        }
      });
    }
  }
};
```

## Advanced: Integrating with Shoelace Events

Shoelace components emit events too:

```javascript
// Listen for Shoelace button click
const button = card.querySelector('sl-button');
button.addEventListener('sl-click', function(e) {
  console.log('Shoelace button clicked!');
});

// Listen for Shoelace dialog close
const dialog = document.querySelector('sl-dialog');
dialog.addEventListener('sl-hide', function(e) {
  console.log('Dialog hidden');
});
```

See: https://shoelace.style/getting-started/usage#events

## Summary

✅ **SDC components can have JavaScript**
✅ **Register JS in `.libraries.yml` file**
✅ **Use Drupal.behaviors pattern**
✅ **Always use `once` utility**
✅ **Emit events for integration**
✅ **Works with AJAX and BigPipe**
✅ **Can create programmatic API**

JavaScript makes your components interactive and powerful! 🚀
