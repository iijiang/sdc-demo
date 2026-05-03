# Shoelace Alert Block Recipe

This recipe provides a custom block type for rendering Shoelace alerts with full Layout Builder integration.

## What's Included

- **Block Content Type**: `shoelace_alert` - A custom block type for Shoelace alerts
- **Fields**:
  - `field_variant` (list_string): Alert style (primary, success, neutral, warning, danger)
  - `field_icon` (string): Optional Shoelace icon name
  - `field_message` (text_long): Alert message content (supports HTML)
  - `field_closable` (boolean): Show close button
- **Form Display**: Configured form with all fields visible
- **View Display**: All fields hidden (template reads entity directly)
- **Template**: Custom block template that maps fields to SDC component props

## Prerequisites

- Drupal 11.2+
- `sdc_shoelace` theme installed and enabled
- Layout Builder enabled for your content types

## Installation

### Option 1: Apply via Drush (Recommended)

```bash
drush recipe recipes/contrib/shoelace_blocks/shoelace_alert
```

### Option 2: Manual Installation

1. Enable the `shoelace_blocks` module:
   ```bash
   drush pm:enable shoelace_blocks -y
   ```

2. Clear cache:
   ```bash
   drush cr
   ```

## Usage

1. Edit a node with Layout Builder enabled
2. Click "Layout" tab
3. Click "Add block" in any region
4. Select "Create content block" → "Shoelace Alert"
5. Fill in the form:
   - **Title**: Block title (can be hidden)
   - **Variant**: Choose alert style
   - **Icon**: Enter Shoelace icon name (e.g., `check2-circle`, `exclamation-triangle`)
   - **Closable**: Check to show close button
   - **Message**: Enter alert content (HTML allowed)
6. Click "Add block" → "Save layout"

## Template Integration

The recipe includes a custom template (`block--block-content--shoelace-alert.html.twig`) that:
- Reads field values directly from the block entity
- Maps them to SDC component props
- Renders via `sdc_shoelace:alert` component
- Includes contextual links for Layout Builder editing

## Configuration Details

- **Block Type ID**: `shoelace_alert`
- **Template Suggestion**: `block--block-content--shoelace-alert.html.twig`
- **SDC Component**: `sdc_shoelace:alert`
- **Entity Type**: `block_content`
- **Bundle**: `shoelace_alert`

## Extending

To add more Shoelace components:

1. Create additional block content types (e.g., `shoelace_badge`, `shoelace_card`)
2. Add field definitions for component props
3. Create matching templates in `templates/`
4. Add hook_theme_suggestions_block_alter() to map bundle to template

## Notes

- All fields are hidden in the view display; the template reads values directly
- This allows precise control over SDC component props
- The pattern follows "Path A" of SDC editorial integration
- Layout Builder contextual links are supported for editing blocks
