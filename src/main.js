const print = (msg,up) => console.log( up ? msg : msg.toUpperCase());
const { getElementById } = require("./js/handler");

getElementById("sime").innerHTML = "hello my is main" ;
print("hello my is main");
print("hello my is main upcase",true)