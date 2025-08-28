# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Menu Designer is a WordPress Block Plugin that enhances WordPress navigation with custom mega menus and mobile menus. The plugin provides:

- **Mega Menu Block**: Adds expandable mega menu functionality to navigation blocks
- **Mobile Menu Feature**: Allows custom template parts to replace default mobile navigation

The plugin uses modern WordPress block development practices with React, the WordPress Block Editor APIs, and the WordPress Interactivity API for frontend behavior.

## Development Commands

```bash
# Start development server with hot reloading
npm start

# Build for production
npm run build

# Lint JavaScript files
npm run lint:js
npm run lint:js:src        # Lint only src directory
npm run lint:js:src:fix    # Auto-fix linting issues in src

# Lint CSS/SCSS files
npm run lint:css

# Format code
npm run format

# Generate translation files
npm run update-pot

# Create plugin zip (for distribution)
npm run plugin-zip
```

## Architecture and Key Components

### Plugin Structure
```
src/
├── blocks/
│   └── mega-menu/         # Mega menu block component
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── mobile-menu/           # Mobile menu navigation extension
└── utils/                 # Utility functions
```

### Block Registration Flow
1. **PHP Entry** (`menu-designer.php`): Registers the block server-side and adds a custom "menu" template part area
2. **JavaScript Entry** (`src/blocks/mega-menu/index.js`): Registers the block client-side and integrates it with navigation blocks
3. **Block Definition** (`src/blocks/mega-menu/block.json`): Defines block metadata, attributes, and dependencies

### Frontend Rendering
- **Server-side**: `src/blocks/mega-menu/render.php` handles PHP rendering using WordPress template parts
- **Client-side**: `src/blocks/mega-menu/view.js` implements interactivity using WordPress Interactivity API for menu behaviors (open/close, keyboard navigation, focus management)

### Editor Interface
- **Mega Menu Block**: `src/blocks/mega-menu/edit.js` provides the block editor UI
- **Mobile Menu**: `src/mobile-menu/navigation-edit.js` extends navigation block settings
- **Shared Components**: Components in `src/components/` directory including `TemplateSelector.js` used by both features

### Key Features Implementation
- **Template Part Integration**: Both mega menu and mobile menu content use WordPress template parts, allowing flexible design through the Site Editor
- **Interactivity API**: Uses WordPress's modern approach for frontend JavaScript with stores, actions, and callbacks
- **Responsive Behavior**: Includes edge detection and mobile menu handling with optional disable for mobile
- **Mobile Menu Replacement**: Automatically replaces default navigation with custom template on mobile devices

## Important Development Notes

1. **ES Modules**: The build process uses `--experimental-modules` flag for ES module support in the WordPress scripts build tool

2. **Block Attributes**: 
   - **Mega Menu Block**:
     - `menuSlug`: Template part slug reference
     - `width`: Menu width (content/wide/full/custom)
     - `justifyMenu`: Alignment (left/center/right)
     - `disableWhenCollapsed`: Mobile behavior toggle
     - `collapsedUrl`: Alternative URL for mobile devices
     - `showOnHover`: Open menu on mouse hover
     - `topSpacing`: Space between toggle and menu
   - **Navigation Block Extension**:
     - `mobileMenuSlug`: Template part for mobile menu
     - `mobileMenuBackgroundColor`: Background color for mobile menu
     - `mobileIconBackgroundColor`: Background color for mobile icon
     - `mobileIconColor`: Color for mobile icon

3. **Navigation Block Integration**: The plugin extends WordPress navigation blocks by adding the mega menu as a navigation item variation

4. **Focus Management**: The view.js implements comprehensive keyboard navigation and focus trapping for accessibility

5. **Styling**: Uses SCSS with separate files for editor (`edit.scss`) and frontend (`style.scss`) styles

6. **Plugin Update System**: Uses GitHub-based plugin update checker located in `includes/plugin-update-checker/` for automatic updates from releases

## Development Principles

- Always use WordPress core components first when creating components, adding UI to the block editor, settings to blocks, etc. 
- Always use WordPress core development standards and modern tooling
- Maintain compatibility with WordPress 6.5+ and PHP 7.0+
- Follow WordPress coding standards for PHP, JavaScript, and CSS
- Use the WordPress Interactivity API for frontend JavaScript interactions
- Ensure all user-facing strings use WordPress i18n functions for translation