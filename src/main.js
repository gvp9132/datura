import {countGVPPrivate} from "./js/count"
import "./css/index.css" ;
import "./less/index.less" ;
import "./sass/index.sass" ;
import "./css/iconfont.css" ;

// console.log("你好世界 咱俩一起玩啊!")


countGVPPrivate() ;

if(module.hot){
    console.log("支持热更新") // 1
    module.hot.accept("./js/count", () => {
        console.log("热更新了") // 3
        countGVPPrivate() ;
    })
}


console.log("hello world.222") // 2