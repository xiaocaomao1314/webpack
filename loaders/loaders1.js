module.exports = function(source) {
    console.log("loaders1")
    return source.replace(/明天/g, this.query.name)
}