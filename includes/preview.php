<?php
/**
 * Handle template part preview
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Hook into template redirect to handle preview requests
add_action( 'template_redirect', 'menu_designer_handle_preview' );

function menu_designer_handle_preview() {
	// Check if this is a preview request
	if ( ! isset( $_GET['menu_designer_preview'] ) ) {
		return;
	}

	// Check if user can edit theme options
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		wp_die( __( 'You do not have permission to preview menus.', 'ollie-menu-designer' ) );
	}

	// Get the template part slug
	$menu_slug = sanitize_text_field( $_GET['menu_designer_preview'] );
	
	if ( empty( $menu_slug ) ) {
		wp_die( __( 'No menu specified.', 'ollie-menu-designer' ) );
	}

	// Hook to print inline styles for blocks
	add_action( 'wp_footer', function() {
		// Print any block support styles that were generated during rendering
		if ( function_exists( 'wp_style_engine_get_stylesheet_from_context' ) ) {
			$styles = wp_style_engine_get_stylesheet_from_context( 'block-supports' );
			if ( ! empty( $styles ) ) {
				echo '<style id="wp-block-supports-inline-css">' . $styles . '</style>';
			}
		}
	}, 20 );
	
	// Set up a minimal HTML page for preview
	?>
	<!DOCTYPE html>
	<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head(); ?>
		<style>
			html {
				margin-top: 0 !important;
			}
			body {
				margin: 0;
				padding: 0;
			}
			#wpadminbar {
				display: none;
			}
			.mega-menu-preview-wrapper {
				margin: 0 auto;
			}
		</style>
	</head>
	<body <?php body_class( 'mega-menu-preview' ); ?>>
		<div class="mega-menu-preview-wrapper">
			<?php
			// Get the template part content  
			$template_part = get_block_template( get_stylesheet() . '//' . $menu_slug, 'wp_template_part' );
			
			if ( ! $template_part ) {
				echo '<p>' . __( 'Template part not found.', 'ollie-menu-designer' ) . '</p>';
			} else {
				// Use the content property which contains the raw block content
				$content = $template_part->content;
				
				// Render the blocks - this will process all blocks including inline styles
				echo do_blocks( $content );
			}
			?>
		</div>
		<?php 
		// Print any inline styles that were added during rendering
		wp_print_styles();
		wp_footer(); 
		?>
	</body>
	</html>
	<?php
	exit;
}
