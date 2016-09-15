module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sync');
    grunt.registerTask('copy', ['sync:record', 'sync:replay']);
};