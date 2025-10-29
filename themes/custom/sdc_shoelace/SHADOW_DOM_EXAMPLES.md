# Shadow DOM Styling Examples for Shoelace Components

## What is Shadow DOM?

Shadow DOM is a web standard that encapsulates a component's internal structure and styles. Shoelace uses Shadow DOM to prevent CSS conflicts and ensure consistent styling across different projects.

**The Challenge:** Regular CSS selectors **cannot** penetrate Shadow DOM.

```css
/* ❌ This WON'T work */
sl-card {
  background: red;
}

sl-card .card__body {
  padding: 2rem;
}
```

**The Solution:** Use `::part()` pseudo-element and CSS custom properties.

---

## Example 1: Styling sl-card with ::part()

### The Component Structure

Shoelace components expose "parts" that you can style. Check the [Shoelace Card docs](https://shoelace.style/components/card) to see available parts.

**Available parts for sl-card:**
- `base` - The card's outer container
- `header` - The header slot container
- `body` - The body slot container
- `footer` - The footer slot container
- `image` - The image slot container

### CSS Example

Add this to `/themes/custom/sdc_shoelace/css/style.css`:

```css
/* Style the card container */
sl-card::part(base) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: none;
  color: white;
}

/* Style the header section */
sl-card::part(header) {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* Style the body section */
sl-card::part(body) {
  padding: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Style the footer section */
sl-card::part(footer) {
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
}

/* Style the image container */
sl-card::part(image) {
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}
```

### Usage in Template

```twig
{% include 'sdc_shoelace:card' with {
  slots: {
    header: '<h3>Featured Article</h3>',
    image: '<img src="/themes/custom/sdc_shoelace/images/hero.jpg" alt="Hero">',
    footer: '<sl-button variant="primary">Read More</sl-button>'
  },
  content: '<p>This card has custom Shadow DOM styling with gradient background and glass morphism effects.</p>'
} %}
```

---

## Example 2: Styling sl-button with CSS Custom Properties

### Using CSS Variables (Custom Properties)

Shoelace provides CSS custom properties (variables) that you can override. This is the **easiest** way to customize components.

```css
/* Override default button colors */
sl-button {
  /* Primary button colors */
  --sl-color-primary-600: #7c3aed;
  --sl-color-primary-500: #8b5cf6;
  
  /* Button styling */
  --sl-input-height-medium: 3rem;
  --sl-input-border-radius-medium: 12px;
  --sl-spacing-medium: 1rem 2rem;
  
  /* Font */
  --sl-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --sl-font-weight-semibold: 600;
  
  /* Shadows */
  --sl-shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Hover effects using ::part() */
sl-button::part(base) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

sl-button::part(base):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Specific variant styling */
sl-button[variant="primary"]::part(base) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
```

### All Available CSS Custom Properties

Find the complete list in [Shoelace's Design Tokens](https://shoelace.style/tokens/color):

```css
/* Color tokens */
--sl-color-primary-50 through --sl-color-primary-950
--sl-color-success-50 through --sl-color-success-950
--sl-color-warning-50 through --sl-color-warning-950
--sl-color-danger-50 through --sl-color-danger-950
--sl-color-neutral-50 through --sl-color-neutral-950

/* Spacing tokens */
--sl-spacing-3x-small: 0.125rem;
--sl-spacing-2x-small: 0.25rem;
--sl-spacing-x-small: 0.5rem;
--sl-spacing-small: 0.75rem;
--sl-spacing-medium: 1rem;
--sl-spacing-large: 1.25rem;
--sl-spacing-x-large: 1.75rem;
--sl-spacing-2x-large: 2.25rem;
--sl-spacing-3x-large: 3rem;
--sl-spacing-4x-large: 4.5rem;

/* Border radius */
--sl-border-radius-small: 0.1875rem;
--sl-border-radius-medium: 0.25rem;
--sl-border-radius-large: 0.5rem;
--sl-border-radius-x-large: 1rem;
--sl-border-radius-circle: 50%;
--sl-border-radius-pill: 9999px;

/* Shadows */
--sl-shadow-x-small: 0 1px 2px rgba(0, 0, 0, 0.05);
--sl-shadow-small: 0 1px 3px rgba(0, 0, 0, 0.1);
--sl-shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
--sl-shadow-large: 0 10px 15px rgba(0, 0, 0, 0.1);
--sl-shadow-x-large: 0 20px 25px rgba(0, 0, 0, 0.1);
```

---

## Example 3: Custom Badge Styles

### Component with Multiple Parts

```css
/* Badge container */
sl-badge::part(base) {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  border: 2px solid transparent;
}

/* Success variant - green gradient */
sl-badge[variant="success"]::part(base) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

/* Warning variant - orange with animation */
sl-badge[variant="warning"]::part(base) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

/* Danger variant - red with border */
sl-badge[variant="danger"]::part(base) {
  background: white;
  color: #dc2626;
  border-color: #dc2626;
  font-weight: 700;
}
```

---

## Example 4: Styling sl-menu (Navigation)

### Complex Component Styling

```css
/* Menu container */
sl-menu::part(base) {
  border: none;
  background: var(--sl-color-neutral-0);
  padding: 0.5rem;
}

/* Individual menu items */
sl-menu-item::part(base) {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
}

sl-menu-item::part(base):hover {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
}

/* Active/selected menu item */
sl-menu-item[checked]::part(base) {
  background: var(--sl-color-primary-50);
  border-left: 4px solid var(--sl-color-primary-600);
  color: var(--sl-color-primary-600);
  font-weight: 600;
}

/* Menu item label */
sl-menu-item::part(label) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Menu item icon styling */
sl-menu-item sl-icon {
  font-size: 1.25rem;
}
```

---

## Example 5: Debugging Shadow DOM

### How to Find Available Parts

**Method 1: Browser DevTools**

1. Open Chrome/Edge DevTools (F12)
2. Inspect a Shoelace component (e.g., `<sl-card>`)
3. Look for `#shadow-root (open)` in the Elements panel
4. Inside you'll see elements with `part="base"`, `part="header"`, etc.

**Example:**
```html
<sl-card>
  #shadow-root (open)
    <div part="base" class="card">
      <div part="header" class="card__header">
        <slot name="header"></slot>
      </div>
      <div part="body" class="card__body">
        <slot></slot>
      </div>
      <div part="footer" class="card__footer">
        <slot name="footer"></slot>
      </div>
    </div>
</sl-card>
```

**Method 2: Shoelace Documentation**

Each component page lists available parts in the "Parts" section:
- https://shoelace.style/components/card#parts
- https://shoelace.style/components/button#parts
- https://shoelace.style/components/badge#parts

---

## Example 6: Complete Real-World Implementation

### Create a Styled Stats Card

**Add to style.css:**

```css
/* Stats card with glass morphism */
.stats-card::part(base) {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;
}

.stats-card:hover::part(base) {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
}

.stats-card::part(body) {
  padding: 2rem;
  text-align: center;
}

/* Stat value styling */
.stat-value {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.stat-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--sl-color-neutral-600);
  margin-top: 0.5rem;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-trend.up {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.stat-trend.down {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
```

**Create the component usage in page--front.html.twig:**

```twig
{% set stats_card %}
  <sl-card class="stats-card">
    <div slot="body">
      <p class="stat-value">1,234</p>
      <p class="stat-label">Total Users</p>
      <span class="stat-trend up">
        <sl-icon name="arrow-up"></sl-icon>
        +12.5%
      </span>
    </div>
  </sl-card>
  
  <sl-card class="stats-card">
    <div slot="body">
      <p class="stat-value">$45.2K</p>
      <p class="stat-label">Revenue</p>
      <span class="stat-trend up">
        <sl-icon name="arrow-up"></sl-icon>
        +8.3%
      </span>
    </div>
  </sl-card>
  
  <sl-card class="stats-card">
    <div slot="body">
      <p class="stat-value">89</p>
      <p class="stat-label">Active Now</p>
      <span class="stat-trend down">
        <sl-icon name="arrow-down"></sl-icon>
        -3.2%
      </span>
    </div>
  </sl-card>
{% endset %}

{% include 'sdc_shoelace:grid' with {
  columns: 3,
  gap: 'large',
  content: stats_card
} %}
```

---

## Example 7: Theming Entire Application

### Global Theme Customization

Add to the top of `style.css` or create `css/theme.css`:

```css
:root {
  /* Brand Colors */
  --sl-color-primary-50: #f5f3ff;
  --sl-color-primary-100: #ede9fe;
  --sl-color-primary-200: #ddd6fe;
  --sl-color-primary-300: #c4b5fd;
  --sl-color-primary-400: #a78bfa;
  --sl-color-primary-500: #8b5cf6;
  --sl-color-primary-600: #7c3aed;
  --sl-color-primary-700: #6d28d9;
  --sl-color-primary-800: #5b21b6;
  --sl-color-primary-900: #4c1d95;
  --sl-color-primary-950: #2e1065;
  
  /* Typography */
  --sl-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --sl-font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Spacing Scale */
  --sl-spacing-medium: 1.5rem;
  --sl-spacing-large: 2rem;
  
  /* Border Radius - More rounded */
  --sl-border-radius-medium: 12px;
  --sl-border-radius-large: 16px;
  --sl-border-radius-x-large: 24px;
  
  /* Shadows - Softer */
  --sl-shadow-small: 0 2px 4px rgba(0, 0, 0, 0.05);
  --sl-shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.08);
  --sl-shadow-large: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* Transitions */
  --sl-transition-fast: 150ms;
  --sl-transition-medium: 250ms;
  --sl-transition-slow: 350ms;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --sl-color-neutral-0: #1e1e1e;
    --sl-color-neutral-50: #2d2d2d;
    --sl-color-neutral-100: #3a3a3a;
    /* ... etc */
  }
}
```

---

## Quick Reference

### Finding Parts for Any Component

**Formula:**
```
component-name::part(part-name)
```

**Common patterns:**
- `base` - Always the main container
- `label` - Text labels
- `prefix` / `suffix` - Before/after content
- `icon` - Icon containers

**Check documentation:**
```
https://shoelace.style/components/[component-name]#parts
```

### Can't Style Something?

1. **Check if part exists** in Shoelace docs
2. **Use CSS custom properties** if available
3. **Wrap in regular element** and style that:
   ```twig
   <div class="custom-wrapper">
     <sl-card>...</sl-card>
   </div>
   ```
4. **Add custom class** to component:
   ```twig
   <sl-card class="my-custom-card">
   ```

---

## Testing Your Styles

**After adding CSS:**

1. Clear Drupal cache:
   ```bash
   docker-compose exec web vendor/bin/drush cr
   ```

2. Hard refresh browser:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` or `Cmd+Shift+R`

3. Inspect in DevTools to verify styles are applied

---

## Resources

- **Shoelace Parts Documentation:** https://shoelace.style/getting-started/customizing#parts
- **CSS Custom Properties:** https://shoelace.style/tokens/overview
- **Shadow DOM Explained:** https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
- **All Components:** https://shoelace.style/components/overview
