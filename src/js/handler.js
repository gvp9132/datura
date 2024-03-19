export const getElement = (selector) => {
    return document.querySelector(selector);
}
/**
 * 使用id获取元素
 */
export const getElementById = (id) => {
    return document.querySelector("#" + id);
}