module.exports = function(source) {
    console.log("loaders3")
    return source.replace(/明天/g, "大学园")
}