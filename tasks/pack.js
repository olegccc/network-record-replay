module.exports = grunt => {
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('pack', ['compress:record', 'compress:replay']);
};