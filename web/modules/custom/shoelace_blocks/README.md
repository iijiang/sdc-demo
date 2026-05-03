# Shoelace Blocks

Editor-facing block content types backed by Shoelace SDC components.
This module is **Path A** of the "Editorial Experience" deck: map a custom
block bundle's fields to a Single Directory Component once, then let editors
place as many instances as they want via the Block Library or Layout Builder.

## 📦 Recipe Available

This module includes a **Drupal recipe** at `recipes/shoelace_alert/` that packages the complete Shoelace Alert block configuration. You can apply it to quickly set up the block type in any Drupal site.

**Apply the recipe:**
```bash
drush recipe web/modules/custom/shoelace_blocks/recipes/shoelace_alert
```

Or install the module normally (see below).

## What it ships

A `shoelace_alert` block content type with four fields:

| Field          | Type        | SDC prop / slot |
| -------------- | ----------- | --------------- |
| `field_variant`  | List (text) | `variant` (primary, success, neutral, warning, danger) |
| `field_icon`     | Text        | `icon` (Shoelace icon name, optional) |
| `field_closable` | Boolean     | `closable` |
| `field_message`  | Long text   | `content` slot |

Plus:

- A view display that hides every field (the template renders the SDC component instead).
- `templates/block--block-content--shoelace-alert.html.twig` which `include`s `sdc_shoelace:alert` with the field values.
- `hook_theme_suggestions_block_alter()` so the override is picked up everywhere the block is placed.

## Install

```bash
vendor/bin/drush en shoelace_blocks -y
vendor/bin/drush cr
```

## Use

1. **Block admin → Custom block library → + Add custom block → Shoelace Alert.**
2. Pick a variant, optionally type an icon name (e.g. `info-circle`), write the message.
3. Place the block in any region, or drop it into a Layout Builder section.

## Demo script (for the talk)

1. Show the Block Library with the new "Shoelace Alert" type.
2. Create one with `variant: warning`, `icon: exclamation-triangle`, message "Maintenance tonight at 22:00 UTC."
3. Place it in the Highlighted region.
4. Reload the front page — `<sl-alert variant="warning">` renders.
5. Inspect element: editors never wrote a tag; the SDC schema enforced the variant enum.

## Why this approach

- **Schema is the contract.** The select list's allowed values mirror the `variant` enum in [`alert.component.yml`](../../../themes/custom/sdc_shoelace/components/alert/alert.component.yml). Change one, change the other.
- **No PHP plugin needed.** Custom blocks already have placement, access, caching, and translation built in.
- **Theme-overridable.** The template lives in a module so it ships with the feature, but any theme can still override `block--block-content--shoelace-alert.html.twig`.
