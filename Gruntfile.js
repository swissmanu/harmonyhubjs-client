module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		, shell: {
			options: {
				stdout: true
				, stderr: true
			}
			, jshint: {
				command: './node_modules/.bin/jshint index.js lib/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', [
		'shell:jshint'
	]);

};
