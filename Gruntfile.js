module.exports=function(grunt){
    var banner = [];
    banner.push("bootstrap plugins v" + require("./package.json").version);
    banner.push("build date : "+grunt.template.today('yyyy-mm-dd'));
    grunt.initConfig({
        uglify:{
            options: {
                banner: "/*! \n * "+banner.join("\n * ")+"\n */\n",
                sourceMapRoot: 'public/plugins-dist',
                sourceMap:function(path) {
                    return path.replace('.js',".map")
                }
            },
            dist: {
                files:{
                    'public/plugins-dist/bootstrap-plugins.min.js':['public/javascripts/jquery-ui.js', 'public/plugins/*.js']
                }
            }
        },
        less:{
            dist:{
                options: {
                    cleancss:true
                },
                files:{
                    "public/plugins-dist/bootstrap-plugins.min.css": "public/plugins-less/bootstrap-plugins.less"
                }
            },
            debug : {
                options: {
                    cleancss:false
                },
                files:{
                    "public/plugins-dist/bootstrap-plugins.min.debug.css": "public/plugins-less/bootstrap-plugins.less"
                }
            }
        },
        copy:{
            main:{
                files:[
                    { expand: true, flatten: true, src: ['public/plugins-img/*'], dest: 'public/plugins-dist/resources', filter: 'isFile'}
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ["uglify","less","copy"]);

};