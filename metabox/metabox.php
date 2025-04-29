<?php

 add_action( 'init', function () {

	$meta_fields = [
        'post' => [
			[
				'key'  => 'excerpt',
				'type' => 'string',
			],
		],
		'advocacy' => [
			[
				'key'  => 'description',
				'type' => 'string',
			],
			[
				'key'  => 'external_link',
				'type' => 'boolean',
			],
			[
				'key'  => 'external_url',
				'type' => 'string',
			],
		],
        'chapters' => [
			[
				'key'  => 'is_popup',
				'type' => 'boolean',
			],
		],
        'events' => [
            [
				'key'  => 'description',
				'type' => 'string',
			],
            [
				'key'  => 'event_date',
				'type' => 'string',
			],
			[
				'key'  => 'external_link',
				'type' => 'boolean',
			],
            [
				'key'  => 'external_url',
				'type' => 'string',
			],
		],
	];

	foreach ( $meta_fields as $post_type => $fields ) {
		foreach ( $fields as $field ) {
			register_post_meta( $post_type, $field['key'], [
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => $field['type'],
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				}
			] );
		}
	}

} );

add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'advocacy-meta-sidebar',
		plugin_dir_url( __FILE__ ) . 'sidebar.js',
		[
			'wp-plugins',
			'wp-edit-post',
			'wp-element',
			'wp-components',
			'wp-data',
			'wp-compose',
		],
		filemtime( __DIR__ . '/sidebar.js' ),
		true
	);
} );

add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_style(
		'my-meta-panel-editor-styles',
		plugin_dir_url( __FILE__ ) . 'styles.css',
		[],
		filemtime( __DIR__ . '/styles.css' )
	);
});