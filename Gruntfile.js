module.exports = function(grunt) {
    var config = require('./config/grunt.config');
    grunt.initConfig(config);
    grunt.task.loadTasks('./tasks');
};
