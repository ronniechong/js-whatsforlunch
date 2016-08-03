module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
		compass: {                  
		    dist: {                   
		      options: {              
		        sassDir: 'src/scss/',
		        cssDir: 'build/css/',
		        environment: 'production',
		        outputStyle:'expanded',
		        noLineComments:true
		      }
		    }
		 },

		jade: {
		  compile: {
		    options: {
		      pretty:true,
		      data: {
		        debug: false
		      }
		    },
		    files: [{
		   		cwd: "src/jade/",
                src: ["**/*.jade", "!**/_*.jade"],
                dest: "build/",
                expand:true,
                ext: ".html"
            }]
		  }
		},

		uglify: {
	      build: {
					options:{
						beautify:false,
						mangle: true
					},
	        files: [{
	            expand: true,
	            cwd: 'src/js/',
			    src: [ '**/*.js' ],
			    dest: 'build/js',
			    ext: '.js'
	        }]
	      }
	    },

		watch: {
		    css: {
		        files: ['src/scss/**/*.scss'],
		        tasks: ['buildcss']
		    },
		    jade: {
		      files: ['src/jade/*.jade'],
		      tasks: ['buildhtml']
		    },
		    js: {
		      files: ['src/js/**/*.js'],
		      tasks: ['buildjs']
		    }
		}
    });

     grunt.registerTask('default', []);
     grunt.registerTask('buildcss',  ['compass']);
     grunt.registerTask('buildjs',  ['uglify']);
     grunt.registerTask('buildhtml',  ['jade']);
  
}