module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //sass task defined for the compilation
        sass: {
            options: {
                style: 'expanded',
                sourceMap: true
            },
            dist: {
                files: {
                    'public/css/style.css': 'sass/style.scss'
                }
            }
        },
        //watch task to monitor the changes in any js or sass files
        watch: {
            js: {
                files: ['ngsrc/**/*.js'],
                tasks: ['concat']
            },
            sass: {
                files: [
                    'sass/*.scss'
                ],
                tasks: ['sass']
            }


        },
        //concat task to concat all the js files into one common file 
        concat: {
            options: {
                separator: "\n\n",
                sourceMap: true,
                sourceMapName: 'public/js/hackathon-<%=pkg.version%>.js.map',
                sourceMapStyle: "link",
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                src: ['ngsrc/hackathon.js',
                    'ngsrc/**/*.js'
                ],
                dest: 'public/js/hackathon-<%=pkg.version%>.js'
            }
        },

        //uglify task to minified the files to remove all the spaces and reduce the network load
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'public/js/hackathon-<%=pkg.version%>.min.js': ['public/js/hackathon-<%=pkg.version%>.js']
                }
            }
        }
    });

    //grunt task loaded to work with NPM
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //graunt tasks defined with custom name of commands
    grunt.registerTask('default', ['concat', 'sass']);
    grunt.registerTask('uglify', ['concat', 'uglify']);
    grunt.registerTask('copyLibs', ['copy']);

}