# Notification Card Component - Real Example

## What Was Created

A complete, production-ready notification card component demonstrating Shadow DOM styling with Shoelace in Drupal SDC.

### Files Created:

1. **Component Definition** (`notification_card.component.yml`)
   - Defines props (variant, icon, title, message, etc.)
   - Defines slots (actions for buttons)
   - Schema validation

2. **Component Template** (`notification_card.twig`)
   - Uses Shoelace `<sl-card>`, `<sl-icon>`, `<sl-icon-button>`
   - Proper slot structure
   - Uses `|raw` filter for HTML content

3. **Component Styles** (`notification_card.css`)
   - **Shadow DOM styling with `::part()` selectors**
   - 4 variants (info, success, warning, danger)
   - Animations and transitions
   - Responsive design
   - Dark mode support

4. **Demo Page** (`page--notifications-demo.html.twig`)
   - 6 real examples showing different use cases
   - Code examples
   - Documentation

---

## How to Use

### Step 1: Clear Drupal Cache

```bash
docker-compose exec web vendor/bin/drush cr
```

### Step 2: View the Demo

Create a page in Drupal at path `/notifications-demo` or visit any page and the component will be available.

### Step 3: Use in Your Templates

**Simple Example:**
```twig
{% include 'sdc_shoelace:notification_card' with {
  variant: 'success',
  icon: 'check-circle',
  title: 'Welcome!',
  message: '<p>Your account has been created successfully.</p>'
} %}
```

**With Timestamp:**
```twig
{% include 'sdc_shoelace:notification_card' with {
  variant: 'info',
  icon: 'info-circle',
  title: 'New Message',
  message: '<p>You have 3 unread messages.</p>',
  show_timestamp: true,
  timestamp: '5 minutes ago'
} %}
```

**With Action Buttons:**
```twig
{% include 'sdc_shoelace:notification_card' with {
  variant: 'warning',
  icon: 'exclamation-triangle',
  title: 'Action Required',
  message: '<p>Please verify your email address.</p>',
  slots: {
    actions: '<sl-button variant="primary" size="small">Verify Now</sl-button>
              <sl-button variant="text" size="small">Later</sl-button>'
  }
} %}
```

**In Node Template (node.html.twig):**
```twig
{% if node.isPublished() %}
  {% include 'sdc_shoelace:notification_card' with {
    variant: 'success',
    icon: 'check-circle',
    title: 'This content is published',
    message: '<p>Created by ' ~ author_name ~ ' on ' ~ date ~ '</p>',
    show_timestamp: false
  } %}
{% endif %}
```

---

## Shadow DOM Styling Explained

### The Key Technique: `::part()` Selector

In `notification_card.css`, we style Shoelace's `<sl-card>` using `::part()`:

```css
/* Target the card's base container */
.notification-card::part(base) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Target the header section */
.notification-card::part(header) {
  padding: 1.25rem;
  background: #f9fafb;
}

/* Target the body section */
.notification-card::part(body) {
  padding: 1.25rem;
}

/* Target the footer section */
.notification-card::part(footer) {
  padding: 1rem 1.25rem;
}
```

### Why We Need This

**Without `::part()` - Won't Work:**
```css
/* ❌ This won't work - can't penetrate Shadow DOM */
.notification-card .card__header {
  background: red;
}
```

**With `::part()` - Works:**
```css
/* ✅ This works - pierces Shadow DOM */
.notification-card::part(header) {
  background: red;
}
```

### Finding Available Parts

Inspect the component in browser DevTools:

```html
<sl-card>
  #shadow-root (open)
    <div part="base" class="card">
      <div part="header" class="card__header">
        <!-- header content -->
      </div>
      <div part="body" class="card__body">
        <!-- body content -->
      </div>
      <div part="footer" class="card__footer">
        <!-- footer content -->
      </div>
    </div>
</sl-card>
```

See `part="base"`, `part="header"`, etc? Those are what you can style with `::part()`.

---

## CSS Custom Properties (Variables)

We use CSS custom properties for easy variant customization:

```css
.notification-card--success {
  --notification-border-color: #bbf7d0;
  --notification-header-bg: #f0fdf4;
  --notification-icon-bg: #dcfce7;
  --notification-icon-color: #16a34a;
}
```

These variables are then used throughout the component:

```css
.notification-icon {
  background: var(--notification-icon-bg);
  color: var(--notification-icon-color);
}
```

This makes it easy to create new variants without duplicating code.

---

## Advanced Examples

### Custom Variant Colors

Add to your theme's `style.css`:

```css
/* Purple variant */
.notification-card--purple {
  --notification-border-color: #e9d5ff;
  --notification-header-bg: #faf5ff;
  --notification-icon-bg: #f3e8ff;
  --notification-icon-color: #9333ea;
  --notification-title-color: #7e22ce;
}

.notification-card--purple::part(base) {
  border-left: 4px solid #a855f7;
}
```

Use it:
```twig
{% include 'sdc_shoelace:notification_card' with {
  variant: 'purple',
  icon: 'star',
  title: 'Premium Feature',
  message: '<p>Upgrade to unlock this feature!</p>'
} %}
```

### Add Animations

```css
/* Slide in from right */
.notification-card::part(base) {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Interactive Hover Effects

```css
.notification-card:hover::part(base) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.notification-card:hover .notification-icon {
  transform: rotate(360deg);
  transition: transform 0.5s ease;
}
```

---

## Real-World Use Cases

### 1. User Dashboard Notifications

```twig
{# In your dashboard template #}
{% for notification in user_notifications %}
  {% include 'sdc_shoelace:notification_card' with {
    variant: notification.type,
    icon: notification.icon,
    title: notification.title,
    message: notification.message,
    show_timestamp: true,
    timestamp: notification.created|date('g:i a'),
    slots: {
      actions: '<sl-button size="small">Mark Read</sl-button>'
    }
  } %}
{% endfor %}
```

### 2. Form Validation Messages

```twig
{# After form submission #}
{% if messages %}
  {% for message in messages %}
    {% include 'sdc_shoelace:notification_card' with {
      variant: message.type,
      icon: message.type == 'error' ? 'x-circle' : 'check-circle',
      title: message.type == 'error' ? 'Error' : 'Success',
      message: message.text,
      dismissible: true
    } %}
  {% endfor %}
{% endif %}
```

### 3. Content Moderation Alerts

```twig
{# In node edit form #}
{% if node.moderation_state == 'draft' %}
  {% include 'sdc_shoelace:notification_card' with {
    variant: 'info',
    icon: 'pencil-square',
    title: 'Draft Mode',
    message: '<p>This content is in draft mode and not visible to the public.</p>',
    slots: {
      actions: '<sl-button variant="primary" size="small">Publish</sl-button>'
    }
  } %}
{% endif %}
```

### 4. System Status Messages

```twig
{# In admin dashboard #}
{% if cache_needs_clear %}
  {% include 'sdc_shoelace:notification_card' with {
    variant: 'warning',
    icon: 'exclamation-triangle',
    title: 'Cache Optimization',
    message: '<p>Cache hasn\'t been cleared in 7 days. Performance may be affected.</p>',
    slots: {
      actions: '<sl-button variant="warning" size="small" onclick="clearCache()">
                  Clear Now
                </sl-button>'
    }
  } %}
{% endif %}
```

---

## Testing the Shadow DOM Styling

1. **Open browser DevTools** (F12)
2. **Inspect the notification card**
3. **Look for `#shadow-root`** inside `<sl-card>`
4. **Check the Styles panel** to see your `::part()` styles applied
5. **Modify styles live** to experiment

---

## Troubleshooting

### Styles Not Applying?

1. **Check you're using `::part()`:**
   ```css
   ✅ .notification-card::part(base) { }
   ❌ .notification-card .base { }
   ```

2. **Clear Drupal cache:**
   ```bash
   docker-compose exec web vendor/bin/drush cr
   ```

3. **Hard refresh browser:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

4. **Check DevTools for errors**

### Component Not Rendering?

1. **Verify component exists:**
   ```bash
   ls themes/custom/sdc_shoelace/components/notification_card/
   ```

2. **Check file permissions**

3. **Validate YAML syntax** in `.component.yml`

4. **Clear cache again**

---

## Next Steps

1. **Customize colors** to match your brand
2. **Add more variants** (e.g., neutral, purple, custom)
3. **Integrate with Drupal messages system**
4. **Add JavaScript** for dismiss functionality
5. **Create animated entrance/exit** effects
6. **Build notification center** component

---

## Key Takeaways

✅ **Shadow DOM requires `::part()` selectors** to style internal elements
✅ **CSS custom properties** make variants easy to manage
✅ **Regular CSS** works for wrapper elements (outside Shadow DOM)
✅ **Shoelace components expose parts** documented in their API
✅ **DevTools is your friend** for inspecting Shadow DOM
✅ **`|raw` filter is needed** for HTML content in slots

This is a production-ready example you can use and customize for your projects!
