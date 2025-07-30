# Mega Menu Block

> Create beautiful, content-rich mega menus in WordPress using the power of the block editor.

[![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net)

## Overview

Mega Menu Block revolutionizes how you create navigation menus in WordPress. Instead of wrestling with complex menu configurations, you can now design rich, multi-column dropdown menus using the familiar WordPress block editor. 

Build mega menus with any combination of blocks - from simple text and images to dynamic content like recent posts, product grids, or custom forms. Everything is visual, intuitive, and seamlessly integrated with WordPress.

## Features

- **Visual Design** - Build your menus in the Site Editor with live preview
- **Block-Based** - Use any WordPress block to create rich menu content
- **Responsive** - Smart mobile handling with optional fallback URLs
- **Smart Positioning** - Automatic edge detection keeps menus on screen
- **Accessible** - Full keyboard navigation and screen reader support
- **Performance First** - Menus load only when needed
- **Developer Friendly** - Clean code, hooks, and modern development practices

## Getting Started

### Installation

1. Download the latest release or clone this repository
3. Activate the plugin through the WordPress admin
4. Start adding mega menus to your navigation!

### Basic Usage

1. Add a **Navigation block** to your site (typically in the header)
2. Click the **+** button to add a block to your navigation
3. Search for **"Mega Menu"** and insert the block
4. Choose an existing menu template or create a new one
5. Design your mega menu content in the Site Editor
6. Save and enjoy your new mega menu!

## Adding Starter Patterns

You can create custom starter patterns for menu templates to give users quick starting points for their mega menus. This is especially useful for theme developers who want to provide pre-designed menu layouts.

### How to Add Starter Patterns

1. Create a `/patterns` folder in your theme or plugin directory
2. Add your pattern files (PHP format) to this folder
3. In each pattern file, ensure you include the following in your pattern header:

```php
/**
 * Title: My Mega Menu Pattern
 * Slug: mytheme/mega-menu-starter
 * Categories: menu
 * Block Types: core/template-part/menu
 */
```

The key requirement is the `Block Types: core/template-part/menu` line - this ensures your pattern appears as an option when creating new menu template parts.

## License

Mega Menu Block is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## Credits

Built with love by the [OllieWP](https://olliewp.com) team. Shout out to [Nick Diego](https://x.com/nickmdiego) who created the initial [proof of concept](https://github.com/ndiego/mega-menu-block) that this is based on. Nick is a legend.
