let deepCopy = function (obj) {//深拷贝一个Json对象的函数
    let str = JSON.stringify(obj);//json对象转字符串
    let objNew = JSON.parse(str); //字符串转json对象
    return objNew
}

let class2type = {},
    //用于记录[object class]样式  
arrObjs = "Boolean Number String Function Array Date RegExp Null Undefined".split(" ");
for (var i = 0, l = arrObjs.length; i < l; i++) {
    class2type["[object " + arrObjs[i] + "]"] = arrObjs[i].toLowerCase();
}

let type = function (obj) {
    //函数：{返回对象类型函数}
    return class2type[Object.prototype.toString.call(obj)] || "object";
};

export default {
    deepCopy,type
}