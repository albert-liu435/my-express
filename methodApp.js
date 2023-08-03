let app = (exports = module.exports = {});

app["ab"] = "abc";
app["cd"] = "cda";
console.log(app.ab);
console.log(app.cd);
