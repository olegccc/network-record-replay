const config = require('../config/webpack.config');
const webpack = require('webpack');

module.exports = function(grunt) {
    grunt.registerTask('build', function(param) {

        var done = this.async();
        var configInstance = config(grunt, param === 'release');

        const compiler = webpack(configInstance);
        compiler.run(function(error, stats) {
            if (error) {
                grunt.log.debug('Compile errors', error);
                done(false);
                return;
            }

            if (stats.hasErrors()) {
                grunt.log.error('Compile errors', stats.toJson('errors-only'));
                done(false);
                return;
            }

            grunt.log.ok('compiled successfully');
            done();
        });
    });
};
