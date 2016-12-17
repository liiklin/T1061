module.exports = {
  apps: [{
    name: "t1060",
    script: "./bin/www.js",
    watch: true,
    ignore_watch: ["[\/\\]\./", "node_modules"]
  }]
}