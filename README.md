# 📚 Custom Meta Sidebar for Posts

## Description
This plugin adds a custom sidebar panel to the WordPress block editor for posts, advocacy entries, chapters, and events.  
It validates required meta information and prevents publishing until all necessary fields are properly completed.

- Adds custom fields to different post types
- Validates meta fields before allowing publishing
- Highlights the panel with visual warnings when fields are incomplete
- Supports description fields, external link toggles, and event date pickers
- Enforces URL formatting (must start with `https://`)

---

## Features
- **Custom sidebar fields** for different post types
- **Field validation** based on post type rules
- **Lock publishing** if validation fails
- **Visual warnings** inside the editor
- **Strict external URL checking** (must start with `https://`)
- **Red highlight** if required meta fields are missing

---

## Post Type Behaviors

| Post Type | Required Meta Fields |
|:---|:---|
| `post` | Excerpt (text) |
| `advocacy` | Description (text) always required. If external link toggle is enabled, a valid `https://` URL is also required |
| `chapters` | Page or popup selection (toggle) |
| `events` | Event description and event date required. If external link toggle is enabled, a valid `https://` URL is also required |

---

## Installation

1. Copy the plugin folder into your `wp-content/plugins/` or `wp-content/mu-plugins/` directory.
2. Activate the plugin if using `plugins/`.
3. Ensure your WordPress site is using the block editor (Gutenberg).
4. The custom sidebar will appear when editing posts, advocacy entries, chapters, or events.

---

## File Structure

custom-meta-sidebar/ ├── sidebar.js (Main JavaScript file for the sidebar functionality) ├── styles.css (Optional editor styles for panel highlighting) └── plugin.php (Main plugin registration and asset enqueuing)


---

## Development Notes

- Built using WordPress Gutenberg `@wordpress/*` packages.
- Pure `createElement` based structure (no JSX or external build tools needed).
- Dynamically locks or unlocks publishing based on meta field validity.
- Styled using dynamic class names and standard WordPress editor styling conventions.

---

## Credits

Developed by Jennifer Vobis (SheSays team)

---

## License

Licensed under the GPLv2 or later.  
You are free to modify, distribute, or extend the plugin following WordPress licensing guidelines.
