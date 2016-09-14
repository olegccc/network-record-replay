module.exports = {
    sync: {
        record: {
            files: [{
                expand: true,
                src: ['**'],
                dest: 'build/record/',
                filter: 'isFile',
                cwd: 'record'
            }]
        },
        replay: {
            files: [{
                expand: true,
                src: ['**/*.{html,json,png}', 'main.js'],
                dest: 'build/replay/',
                filter: 'isFile',
                cwd: 'replay'
            }]
        }
    },
    compress: {
        record: {
            options: {
                mode: 'zip',
                archive: 'archive/extension.zip'
            },
            expand: true,
            cwd: 'build/record',
            src: ['**/*']
        },
        replay: {
            options: {
                mode: 'zip',
                archive: 'archive/application.zip'
            },
            expand: true,
            cwd: 'build/replay',
            src: ['**/*']
        }
    },
    clean: {
        build: ['build/**'],
        archive: ['archive/**']
    }
};