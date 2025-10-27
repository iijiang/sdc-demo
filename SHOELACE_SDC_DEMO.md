# Integrating Shoelace Web Components with Drupal SDC

## Presentation Outline

---

## Slide 1: Title
**Integrating Shoelace Web Components with Drupal Single Directory Components (SDC)**

*A Modern Approach to Component-Based Theming*

---

## Slide 2: What is Shoelace?

### A Professional Web Component Library

- **Framework-agnostic** - Works with any JavaScript framework or vanilla HTML
- **50+ highly customizable components** - Buttons, cards, dialogs, forms, navigation, etc.
- **Built on Web Standards** - Uses native Web Components (Custom Elements, Shadow DOM)
- **Accessible by default** - WCAG 2.0 compliant with ARIA support
- **Beautiful design** - Modern, clean aesthetic with extensive theming options
- **MIT Licensed** - Free for commercial use

**Official Site:** https://shoelace.style/

---

## Slide 3: What is Drupal SDC?

### Single Directory Components (Drupal 10+)

A new component architecture that enables:

- **Self-contained components** - Each component in its own directory
- **Reusable across themes** - Share components between projects
- **Schema validation** - Component props defined in YAML with type checking
- **Twig integration** - Seamless integration with Drupal's template system
- **Better organization** - Clear structure: component.yml + .twig + .css

**Structure:**
```
components/
  card/
    card.component.yml    # Component definition & schema
    card.twig            # Template
    card.css             # Styles (optional)
```

---

## Slide 4: Why Combine Shoelace + Drupal SDC?

### The Perfect Marriage

**Shoelace Benefits:**
- ✅ Production-ready, battle-tested components
- ✅ Consistent UX patterns
- ✅ Accessibility built-in
- ✅ Active development & community
- ✅ No build process required (CDN available)

**SDC Benefits:**
- ✅ Drupal-native component system
- ✅ Type-safe props with validation
- ✅ Seamless integration with Drupal's render system
- ✅ Reusable across projects
- ✅ Clear separation of concerns

**Together:**
🎯 Rapid theme development with enterprise-grade components

---

## Slide 5: Architecture Overview

### How They Work Together

```
┌─────────────────────────────────────┐
│     Drupal Templates (.twig)        │
│   (page.html.twig, node.html.twig)  │
└──────────────┬──────────────────────┘
               │ includes SDC components
               ↓
┌─────────────────────────────────────┐
│    SDC Components (components/)      │
│  ├── card/card.component.yml         │
│  ├── alert/alert.component.yml       │
│  └── header/header.component.yml     │
└──────────────┬──────────────────────┘
               │ renders Shoelace components
               ↓
┌─────────────────────────────────────┐
│   Shoelace Web Components (CDN)      │
│   <sl-card>, <sl-alert>, <sl-icon>  │
└─────────────────────────────────────┘
```

**Flow:**
1. Drupal renders page template
2. Template includes SDC components with data
3. SDC components output Shoelace HTML
4. Browser loads & initializes Shoelace web components

---

## Slide 6: Component Example

### SDC Card Component

**card.component.yml:**
```yaml
name: Card
status: experimental
props:
  type: object
  properties:
    header:
      type: string
      title: Header
    content:
      type: string
      title: Content
    footer:
      type: string
      title: Footer
slots:
  header:
    title: Header Slot
  footer:
    title: Footer Slot
  image:
    title: Image Slot
```

**card.twig:**
```twig
<sl-card>
  {% if slots.image %}
    <div slot="image">
      {{ slots.image|raw }}
    </div>
  {% endif %}
  
  {% if slots.header or header %}
    <div slot="header">
      {{ slots.header|default(header)|raw }}
    </div>
  {% endif %}
  
  {{ content|raw }}
  
  {% if slots.footer or footer %}
    <div slot="footer">
      {{ slots.footer|default(footer)|raw }}
    </div>
  {% endif %}
</sl-card>
```

---

## Slide 7: Using the Component

### In Drupal Templates

**node.html.twig:**
```twig
{% set node_content %}
  {{ content|without('links') }}
{% endset %}

<article>
  {% include 'sdc_shoelace:card' with {
    slots: {
      header: '<h2>' ~ label ~ '</h2>'
    },
    content: node_content
  } %}
</article>
```

**Result:**
A beautifully styled card with the node title and body content, featuring:
- Shadow and hover effects
- Responsive padding
- Accessible markup
- Zero custom CSS needed

---

## Slide 8: Implementation Challenges

### Challenge 1: ES6 Module Loading

**Problem:**
- Shoelace requires ES6 modules (`<script type="module">`)
- Drupal's library system uses regular `<script>` tags

**Solution:**
Load Shoelace directly in `html.html.twig`:

```twig
<script type="module">
  import { setBasePath } from 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/utilities/base-path.js';
  setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/');
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/shoelace-autoloader.js"></script>
```

⚠️ **Critical:** Base path must be set BEFORE autoloader loads!

---

## Slide 9: Implementation Challenges

### Challenge 2: Twig Forward References

**Problem:**
Twig doesn't support forward references - variables must be defined before use.

**Wrong:**
```twig
<article>
  {% include 'sdc_shoelace:card' with {
    content: node_content  {# ❌ Variable not defined yet #}
  } %}
</article>

{% set node_content %}
  {{ content }}
{% endset %}
```

**Correct:**
```twig
{% set node_content %}
  {{ content }}
{% endset %}

<article>
  {% include 'sdc_shoelace:card' with {
    content: node_content  {# ✅ Variable defined above #}
  } %}
</article>
```

💡 **Best Practice:** Always define `{% set %}` blocks at the top of your template.

---

## Slide 10: Implementation Challenges

### Challenge 3: HTML Auto-Escaping

**Problem:**
Twig auto-escapes HTML for security. Shoelace components render as text.

**Without |raw filter:**
```twig
{{ '<sl-icon name="check"></sl-icon>' }}
```
Renders as: `&lt;sl-icon name="check"&gt;&lt;/sl-icon&gt;`

**With |raw filter:**
```twig
{{ '<sl-icon name="check"></sl-icon>'|raw }}
```
Renders as: ✅ (actual icon)

**Solution:**
Add `|raw` filter to component templates for trusted HTML content:

```twig
{# card.twig #}
{{ content|raw }}
{{ slots.header|default(header)|raw }}
```

⚠️ **Security Note:** Only use `|raw` on trusted content you control.

---

## Slide 11: Implementation Challenges

### Challenge 4: Component Positioning Misunderstandings

**Problem:**
`<sl-drawer>` is an overlay component (position: absolute), not a fixed sidebar.

**Wrong Approach:**
```twig
<aside class="sidebar">
  {% include 'sdc_shoelace:drawer' with {
    label: 'Navigation',
    open: true,
    content: menu
  } %}
</aside>
```
Result: ❌ Drawer overlaps content, sidebar doesn't work.

**Correct Approach:**
```twig
<aside class="sidebar">
  {% include 'sdc_shoelace:menu' with {
    items: navigation_items
  } %}
</aside>
```
Result: ✅ Proper fixed sidebar with CSS flexbox layout.

💡 **Lesson:** Understand component behavior before using. Read Shoelace docs!

---

## Slide 12: Implementation Challenges

### Challenge 5: Template Cache

**Problem:**
Drupal aggressively caches templates. Changes don't appear immediately.

**Symptoms:**
- Changed template but see old content
- Added component but it doesn't render
- Fixed bugs but issues persist

**Solution:**
Clear cache after EVERY template change:
```bash
drush cr
# or
vendor/bin/drush cr
```

**Development Tip:**
Disable Twig cache during development:

```yaml
# sites/development.services.yml
parameters:
  twig.config:
    debug: true
    auto_reload: true
    cache: false
```

---

## Slide 13: Best Practices

### 1. Component Organization

**Good Structure:**
```
components/
  layout/               # Layout components
    container/
    grid/
  ui/                   # UI components
    card/
    alert/
    badge/
  navigation/           # Navigation components
    header/
    menu/
    breadcrumb/
```

### 2. Props vs Slots

**Use Props for:**
- Simple values (strings, numbers, booleans)
- Configuration options (variant, size, color)

**Use Slots for:**
- Complex HTML content
- Drupal render arrays
- Multiple child elements

---

## Slide 14: Best Practices

### 3. Define Variables First

**Always use this pattern:**
```twig
{# 1. Define all variables at the top #}
{% set header_content %}
  <h1>{{ title }}</h1>
{% endset %}

{% set main_content %}
  {{ page.content }}
{% endset %}

{% set footer_content %}
  <p>&copy; {{ 'now'|date('Y') }}</p>
{% endset %}

{# 2. Then use them in components #}
{% include 'sdc_shoelace:container' with {
  content: main_content
} %}
```

---

## Slide 15: Best Practices

### 4. Component Styling

**Shoelace uses Shadow DOM - regular CSS won't work!**

**Wrong:**
```css
sl-card {
  background: red;  /* ❌ Won't affect internal elements */
}
```

**Correct:**
```css
/* Style the component host */
sl-card {
  margin: 1rem;
}

/* Use ::part() for internal elements */
sl-card::part(base) {
  background: var(--sl-color-primary-50);
  box-shadow: var(--sl-shadow-large);
}

sl-card::part(header) {
  border-bottom: 2px solid var(--sl-color-primary-600);
}
```

**Discover parts:**
Check Shoelace docs for available `part` names per component.

---

## Slide 16: Best Practices

### 5. Accessibility Considerations

**Shoelace is accessible by default, but:**

✅ Always provide labels:
```twig
<sl-button>
  <sl-icon name="search"></sl-icon>
  Search  {# ✅ Text label for screen readers #}
</sl-button>
```

✅ Use semantic HTML in slots:
```twig
{% include 'sdc_shoelace:card' with {
  slots: {
    header: '<h2>Title</h2>'  {# ✅ Proper heading hierarchy #}
  }
} %}
```

✅ Test with keyboard navigation:
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close dialogs

---

## Slide 17: Performance Considerations

### CDN vs Local Installation

**CDN (Current Implementation):**
- ✅ No build process
- ✅ Easy updates
- ✅ Cached across sites
- ❌ External dependency
- ❌ Requires internet
- ❌ Can't modify library

**Local Installation:**
```bash
npm install @shoelace-style/shoelace
```
- ✅ Full control
- ✅ Works offline
- ✅ Can customize/patch
- ❌ Requires build process
- ❌ Larger repo size
- ❌ Manual updates

**Recommendation:**
- Development: CDN (faster setup)
- Production: Local (better reliability)

---

## Slide 18: Real-World Example

### Stats Dashboard Card

**page--front.html.twig:**
```twig
{% set stats_grid %}
  {% include 'sdc_shoelace:grid' with {
    columns: 3,
    gap: 'medium',
    content: stats_cards
  } %}
{% endset %}

{% set stats_cards %}
  {% include 'sdc_shoelace:card' with {
    slots: {
      header: '<h3>Total Users</h3>'
    },
    content: '<div style="font-size: 2rem; font-weight: bold; color: var(--sl-color-primary-600);">1,234</div>'
  } %}
  
  {% include 'sdc_shoelace:card' with {
    slots: {
      header: '<h3>Active Sessions</h3>'
    },
    content: '<div style="font-size: 2rem; font-weight: bold; color: var(--sl-color-success-600);">89</div>'
  } %}
  
  {% include 'sdc_shoelace:card' with {
    slots: {
      header: '<h3>Pending Tasks</h3>'
    },
    content: '<div style="font-size: 2rem; font-weight: bold; color: var(--sl-color-warning-600);">23</div>'
  } %}
{% endset %}
```

**Result:** Beautiful, responsive dashboard with zero custom CSS!

---

## Slide 19: Results & Benefits

### What We Achieved

**Components Created:**
- ✅ 12 SDC components (container, card, grid, header, menu, breadcrumb, alert, badge, dialog, drawer, progress_bar, divider)
- ✅ 6 Drupal templates (page, page--front, node, html, region, status-messages)
- ✅ Complete theme with responsive layout

**Development Time:**
- Traditional approach: 2-3 weeks
- With Shoelace + SDC: ~1 day

**Code Quality:**
- ✅ Type-safe component props
- ✅ WCAG 2.0 accessible
- ✅ Mobile responsive
- ✅ Cross-browser compatible
- ✅ Minimal custom CSS

**Maintainability:**
- ✅ Reusable components
- ✅ Clear separation of concerns
- ✅ Easy to update (just change CDN version)

---

## Slide 20: Lessons Learned

### Key Takeaways

1. **Read the docs** - Both Shoelace and SDC have excellent documentation
2. **Understand component behavior** - Don't assume how components work
3. **Template variables must be defined first** - Twig doesn't hoist
4. **Use |raw filter judiciously** - Security vs functionality balance
5. **Clear cache frequently** - Drupal caching can hide issues
6. **Test accessibility** - Use keyboard navigation and screen readers
7. **Start simple** - Build basic components first, then compose complex ones
8. **Shadow DOM requires ::part()** - Regular CSS won't work
9. **ES6 modules need special handling** - Can't use normal Drupal libraries
10. **Cache is your enemy in development** - Disable Twig cache!

---

## Slide 21: Future Enhancements

### What's Next?

**Short Term:**
- 🎯 Add form components (input, select, checkbox, radio)
- 🎯 Create layout builder integration
- 🎯 Build component library UI (Storybook-style)
- 🎯 Add JavaScript interaction examples

**Medium Term:**
- 🎯 Convert to local Shoelace installation
- 🎯 Create custom Shoelace theme (brand colors)
- 🎯 Add animation components (animate.css integration)
- 🎯 Build admin theme using Shoelace

**Long Term:**
- 🎯 Contribute SDC components back to community
- 🎯 Create Shoelace-based theme starter kit
- 🎯 Explore other web component libraries
- 🎯 Build wysiwyg integration for component insertion

---

## Slide 22: Resources

### Learn More

**Shoelace:**
- Website: https://shoelace.style/
- GitHub: https://github.com/shoelace-style/shoelace
- Components: https://shoelace.style/components/overview

**Drupal SDC:**
- Documentation: https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components
- Change Record: https://www.drupal.org/node/3289097
- Examples: https://git.drupalcode.org/project/sdc_examples

**This Demo:**
- Repository: https://github.com/iijiang/sdc-demo
- Components: `/themes/custom/sdc_shoelace/components/`
- Templates: `/themes/custom/sdc_shoelace/templates/`

---

## Slide 23: Questions & Discussion

### Common Questions

**Q: Can I use other web component libraries?**
A: Yes! Lit, Stencil, or any web components work the same way.

**Q: Does this work with Drupal 9?**
A: SDC was added in Drupal 10.1. For D9, use traditional theme hooks.

**Q: What about IE11 support?**
A: Shoelace requires modern browsers. Use polyfills or traditional components for legacy support.

**Q: Can I mix Shoelace with Bootstrap?**
A: Yes, but be careful with CSS conflicts. Consider using one or the other.

**Q: How do I customize Shoelace colors?**
A: Use CSS custom properties: `--sl-color-primary-600`, etc.

**Q: Is this production-ready?**
A: Yes! Both Shoelace and SDC are stable and actively maintained.

---

## Slide 24: Thank You!

### Let's Build Something Amazing

**Contact:**
- Demo Site: [Your Drupal site URL]
- GitHub: https://github.com/iijiang/sdc-demo
- Questions: [Your contact info]

**Try it yourself:**
```bash
git clone https://github.com/iijiang/sdc-demo.git
cd sdc-demo
composer install
drush site:install
drush theme:enable sdc_shoelace
drush config:set system.theme default sdc_shoelace
```

**Happy Theming! 🎨**

---

## Additional Resources

### Troubleshooting Guide

**Component not rendering?**
1. Check browser console for JS errors
2. Verify Shoelace CDN is loading (Network tab)
3. Ensure base path is set before autoloader
4. Clear Drupal cache: `drush cr`

**Styles not applying?**
1. Check if you're using `::part()` selectors
2. Verify CSS custom property names
3. Inspect element to see Shadow DOM structure
4. Check for CSS specificity issues

**Content not showing?**
1. Verify `{% set %}` blocks are BEFORE usage
2. Check if `|raw` filter is needed
3. Inspect Drupal render array output
4. Enable Twig debugging to see template suggestions

**Layout issues?**
1. Don't use drawer for fixed sidebars
2. Use proper flexbox/grid CSS
3. Check responsive breakpoints
4. Test in different viewport sizes

---

## Code Examples Repository

All code examples from this presentation are available at:
**https://github.com/iijiang/sdc-demo**

Includes:
- Complete working Drupal theme
- 12 SDC components with documentation
- Template examples
- CSS with Shadow DOM styling
- Troubleshooting examples
- Best practices implementation
