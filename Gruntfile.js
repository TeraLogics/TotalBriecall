'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		project: {
			sass_dir: ['build/sass'],

			http_path: ['/'],
			http_asset_path: ['<%= project.http_path %>'],
			http_css_path: ['<%= project.http_asset_path %>/css'],
			http_js_path: ['<%= project.http_asset_path %>/js'],
			http_img_path: ['<%= project.http_asset_path %>/img'],
			http_gen_img_path: ['<%= project.http_img_path %>'],
			http_font_path: ['<%= project.http_asset_path %>/fonts'],

			web_dir: ['public'],
			css_dir: ['<%= project.web_dir %>/<%= project.http_css_path %>'],
			js_dir: ['<%= project.web_dir %>/<%= project.http_js_path %>'],
			img_dir: ['<%= project.web_dir %>/<%= project.http_img_path %>'],
			gen_img_dir: ['<%= project.img_dir %>'],
			font_dir: ['<%= project.web_dir %>/<%= project.http_font_path %>']
		},
		sass: {
			options: {
				includePaths: [
					'./bower_components',
					'./build/sass'
				]
			},
			development: {
				options: {
					style: 'expanded'
				},
				files: {
					'<%= project.css_dir %>/brie.css': '<%= project.sass_dir %>/brie.scss'
				}
			},
			production: {
				options: {
					style: 'compressed',
					sourceMap: false
				},
				files: {
					'<%= project.css_dir %>/brie.css': '<%= project.sass_dir %>/brie.scss'
				}
			}
		},
		copy: {
			js: {
				src: [
					'bower_components/jquery/dist/*',
					'bower_components/bootstrap-sass-official/assets/fonts/javascript/*'
				],
				dest: 'public/js/',
				expand: true
			},
			css: {
				src: [],
				dest: '',
				expand: true
			},
			fonts: {
				src: [
					'bower_components/bootstrap-sass-official/assets/fonts/*'
				],
				dest: 'public/fonts/',
				expand: true
			},
			fontawesome: {
				files: [
					// Fonts
					{
						expand: true,
						filter: 'isFile',
						flatten: true,
						cwd: 'bower_components/',
						src: ['components-font-awesome/fonts/**'],
						dest: 'public/fonts'
					}/*,
					 // CSS
					 {
					 expand: true,
					 filter: 'isFile',
					 flatten: true,
					 cwd: 'bower_components/',
					 src: ['components-font-awesome/css/**'],
					 dest: 'public/css'
					 }
					 */
				]
			},
			"bootstrap-tour": {
				files: [
					// CSS
					{
						expand: true,
						filter: 'isFile',
						flatten: true,
						cwd: 'bower_components/',
						src: ['bootstrap-tour/build/css/**'],
						dest: 'public/css'
					},
					// JS
					{
						expand: true,
						filter: 'isFile',
						flatten: true,
						cwd: 'bower_components/',
						src: ['bootstrap-tour/build/js/**'],
						dest: 'public/js'
					}
				]
			}
		},
		watch: {
			css: {
				files: '<%= project.sass_dir %>/{,*/}*.{scss,sass}',
				tasks: ['sass:development']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass:production', 'copy:fontawesome', 'copy:bootstrap-tour']);
};