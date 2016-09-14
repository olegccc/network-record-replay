module.exports = (grunt) => {
    let config = require('./config/grunt.config');
    grunt.initConfig(config);
    grunt.task.loadTasks('./tasks');
};
