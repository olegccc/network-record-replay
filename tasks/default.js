module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['clean', 'build:dev', 'copy', 'pack']);
    grunt.registerTask('release', ['clean', 'build:release', 'copy', 'pack', 'clean:build']);
};
