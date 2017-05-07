var src = 'src';     
var dest = 'dist';  

module.exports = {
    base: {
        src: './' + src,
        dest: './' + dest
    },
    images: {
        src: src + "/img/*",      
        dest: dest + "/img"
    },
    css: {
        src: src + "/sys/less/*",   
        dest: dest + "/sys/css"
    },
    js: {
        base: src + "/sys/js/",
        src: src + "/sys/js/*",    
        dest: dest + "/sys/js"
    },
    html: {
        src: src + "/*.html",
        dest: dest 
    },
    lib: {
        src: [src + '/lib/*/*.js', src + '/lib/*/*.css'],
        dest: dest + '/lib'
    }
}