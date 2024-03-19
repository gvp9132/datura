const { getElementById } = require("./js/select");

// 模块动态导入,按需加载
document.getElementById("my-btn").addEventListener("click", () => {
  import("./js/handler").then((handler) => {
    handler.print("hello world", true);
  })
  .catch((err) => {
    console.error("模块导入失败",err);
  });
});