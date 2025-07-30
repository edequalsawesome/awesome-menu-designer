<?php
/**
 * Plugin Name:       Menu Designer
 * Description:       Design custom mega menus and mobile menus for WordPress
 * Requires at least: 6.5
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Mike McAlister
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       menu-designer
 *
 * @package           menu-designer
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function menu_designer_block_init() {
	register_block_type( __DIR__ . '/build/blocks/mega-menu' );
}
add_action( 'init', 'menu_designer_block_init' );

/**
 * Adds a custom template part area for mega menus to the list of template part areas.
 *
 * This function introduces a new area specifically for menu templates, allowing
 * the creation of sections within a mega menu. The new area is appended to the 
 * existing list of template part areas.
 * 
 * @see https://developer.wordpress.org/reference/hooks/default_wp_template_part_areas/
 *
 * @param array $areas Existing array of template part areas.
 * @return array Modified array of template part areas including the new mega menu area.
 */
function menu_designer_template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'menu',
		'area_tag'    => 'div',
		'description' => __( 'Menu templates are used to create mega menus and mobile menus.', 'menu-designer' ),
		'icon' 		  => 'layout',
		'label'       => __( 'Menu', 'menu-designer' ),
	);

	return $areas;
}
add_filter( 'default_wp_template_part_areas', 'menu_designer_template_part_areas' );

// Include preview functionality
require_once plugin_dir_path( __FILE__ ) . 'includes/preview.php';

// Include mobile menu functionality
require_once plugin_dir_path( __FILE__ ) . 'includes/mobile-menu-filter.php';

/**
 * Register block patterns for menu templates.
 */
function menu_designer_register_patterns() {
	// Register pattern category
	register_block_pattern_category(
		'ollie/menu',
		array(
			'label' => __( 'Menu Templates', 'menu-designer' ),
		)
	);

	// Register patterns from files
	$patterns_dir = plugin_dir_path( __FILE__ ) . 'includes/patterns/';
	if ( is_dir( $patterns_dir ) ) {
		$pattern_files = glob( $patterns_dir . '*.php' );
		foreach ( $pattern_files as $pattern_file ) {
			// Get pattern metadata from file header
			$pattern_data = get_file_data( $pattern_file, array(
				'title'         => 'Title',
				'slug'          => 'Slug',
				'description'   => 'Description',
				'categories'    => 'Categories',
				'keywords'      => 'Keywords',
				'viewportWidth' => 'Viewport Width',
				'blockTypes'    => 'Block Types',
				'postTypes'     => 'Post Types',
				'inserter'      => 'Inserter',
			) );

			// Skip if no slug
			if ( empty( $pattern_data['slug'] ) ) {
				continue;
			}

			// Get pattern content without executing PHP
			ob_start();
			include $pattern_file;
			$pattern_content = ob_get_clean();

			// Remove the PHP opening/closing tags and header comment
			$pattern_content = preg_replace( '/^<\?php.*?\?>/s', '', $pattern_content );
			$pattern_content = trim( $pattern_content );

			// Prepare pattern properties
			$pattern_properties = array(
				'title'       => $pattern_data['title'] ?: $pattern_data['slug'],
				'content'     => $pattern_content,
				'categories'  => array_map( 'trim', explode( ',', $pattern_data['categories'] ) ),
			);

			// Add optional properties
			if ( ! empty( $pattern_data['description'] ) ) {
				$pattern_properties['description'] = $pattern_data['description'];
			}
			if ( ! empty( $pattern_data['keywords'] ) ) {
				$pattern_properties['keywords'] = array_map( 'trim', explode( ',', $pattern_data['keywords'] ) );
			}
			if ( ! empty( $pattern_data['viewportWidth'] ) ) {
				$pattern_properties['viewportWidth'] = intval( $pattern_data['viewportWidth'] );
			}
			if ( ! empty( $pattern_data['blockTypes'] ) ) {
				$pattern_properties['blockTypes'] = array_map( 'trim', explode( ',', $pattern_data['blockTypes'] ) );
			}
			if ( ! empty( $pattern_data['postTypes'] ) ) {
				$pattern_properties['postTypes'] = array_map( 'trim', explode( ',', $pattern_data['postTypes'] ) );
			}
			if ( isset( $pattern_data['inserter'] ) && $pattern_data['inserter'] === 'false' ) {
				$pattern_properties['inserter'] = false;
			}

			// Register the pattern
			register_block_pattern( $pattern_data['slug'], $pattern_properties );
		}
	}
}
add_action( 'init', 'menu_designer_register_patterns' );
