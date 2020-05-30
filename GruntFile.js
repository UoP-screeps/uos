module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-screeps");


  /*
  Fill .grunt-options.json with
   {
    "email": "<YOUR EMAIL HERE>",
    "password": "<YOUR PASSWORD HERE>",
    "branch": "default",
    "ptr": false
   }
   */
  const config = require("./.grunt-options.json");

  grunt.initConfig({
    screeps: {
      options: {
        email: config.email,
        password: config.password,
        branch: config.branch,
        ptr: config.ptr
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "dist/",
            src: "**",
            flatten: true
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['screeps']);
};