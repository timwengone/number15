// 说明:只支持15位数字计算
// 参考链接:https://github.com/nefe/number-precision
// 引用:
// import number15 from "@/libs/number15.js";
// 例子:
// let number1 = new number15(0.07);
// console.log(number1.multipliedBy(100).val());
// console.log(0.07 * 100);
// let number2 = new number15(0.2353);
// console.log(number2.dividedBy(10).val());
// console.log((0.2353 / 10));
// let number3 = new number15(0.2);
// console.log(number3.plus(0.1).val());
// console.log(0.2 + 0.1);
// let number4 = new number15(0.3);
// console.log(number4.minus(0.1).val());
// console.log(0.3 - 0.1);
// let number5 = new number15(0.855);  
// console.log(number5.toFixedFloat(2).val());
// console.log(0.855.toFixed(2));
// let number6 = new number15(1.335);
// console.log(number6.toFixedFloat(2).val());
// console.log(1.335.toFixed(2));
// let number7 = new number15(1.01);
// console.log(number7.plus(1.02).val());
// console.log(1.01 + 1.02);
// let number8 = new number15(1.01);
// console.log(number8.minus(1.02).val());
// console.log(1.01 - 1.02);
// let number9 = new number15(0.000001);
// console.log(number9.dividedBy(0.0001).val());
// console.log(0.000001 / 0.0001);
// let number10 = new number15(0.012345);
// console.log(number10.dividedBy(0.0001).val());
// console.log(0.012345 / 0.0001);
// let number11 = new number15(0.2);
// console.log(number11.plus(0.4).val());
// console.log(0.2 + 0.4);
// let number12 = new number15(19.9);
// console.log(number12.multipliedBy(100).val());
// console.log(19.9 * 100);
// let number13 = new number15(0.105);
// console.log(number13.toFixedFloat(2).val());
// console.log(0.105.toFixed(2));
// let number14 = new number15(2.3);
// console.log(number14.plus(2.4).val());
// console.log(2.3 + 2.4);
// let number16 = new number15(1);
// console.log(number16.minus(0.9).val());
// console.log(1 - 0.9);
// let number17 = new number15(3);
// console.log(number17.multipliedBy(0.3).val());
// console.log(3 * 0.3);
// let number18 = new number15(0.362);
// console.log(number18.multipliedBy(100).val());
// console.log(0.362 * 100);
// let number19 = new number15(1.21);
// console.log(number19.dividedBy(1.1).val());
// console.log(1.21 / 1.1);
// let number20 = new number15(1.105);
// console.log(number20.round(2).val());

/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision) {
    if (precision === void 0) { precision = 12; }
    return +parseFloat(num.toPrecision(precision));
}
/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
    // Get digit length of e
    let eSplit = num.toString().split(/[eE]/);
    let len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    let dLen = digitLength(num);
    return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num;
}
/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num) {
    if (_boundaryCheckingState) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    }
}
/**
 * 精确乘法
 */
function times(num1, num2) {
    let others = [];
    for (let _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return times.apply(void 0, [times(num1, num2), others[0]].concat(others.slice(1)));
    }
    let num1Changed = float2Fixed(num1);
    let num2Changed = float2Fixed(num2);
    let baseNum = digitLength(num1) + digitLength(num2);
    let leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
}
/**
 * 精确加法
 */
function plus(num1, num2) {
    let others = [];
    for (let _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return plus.apply(void 0, [plus(num1, num2), others[0]].concat(others.slice(1)));
    }
    let baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}
/**
 * 精确减法
 */
function minus(num1, num2) {
    let others = [];
    for (let _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return minus.apply(void 0, [minus(num1, num2), others[0]].concat(others.slice(1)));
    }
    let baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
/**
 * 精确除法
 */
function divide(num1, num2) {
    let others = [];
    for (let _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return divide.apply(void 0, [divide(num1, num2), others[0]].concat(others.slice(1)));
    }
    let num1Changed = float2Fixed(num1);
    let num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
}
/**
 * 四舍五入
 */
function round(num, ratio) {
    let base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
}
let _boundaryCheckingState = true;

let number15 = function (argument) {
    this.value = argument || 0;
}
number15.prototype.plus = function (argument) { // 加法
    this.value = plus(this.value, argument);
    return this;
}
number15.prototype.minus = function (argument) { // 减法
    this.value = minus(this.value, argument);
    return this;
}
number15.prototype.multipliedBy = function (argument) { // 乘法
    this.value = times(this.value, argument);
    return this;
}
number15.prototype.dividedBy = function (argument) { // 除法
    this.value = divide(this.value, argument);
    return this;
}
number15.prototype.round = function (argument) { // 除法
    this.value = round(this.value, argument);
    return this;
}
number15.prototype.toFixedString = function (lengthNumber) { // lengthNumber:指定小数位，返回带小数位字符串
    let temporaryArray = this.value.toString().split('.');
    let temporaryEnd = 0;
    if (parseInt(temporaryArray[1])) {
        let temporaryLength = parseInt(temporaryArray[1]) ? temporaryArray[1].length : 0;
        let temporaryNumber = '';
        if (temporaryLength > lengthNumber) {
            temporaryNumber = this.value.toString() + this.value.toString().substr(this.value.toString().length - 1, 1);
        } else {
            temporaryNumber = this.value.toString();
        }
        temporaryEnd = parseFloat(temporaryNumber);
    } else {
        temporaryEnd = parseFloat(this.value);
    }
    this.value = temporaryEnd.toFixed(lengthNumber);
    return this;
}
number15.prototype.toFixedFloat = function (lengthNumber) { // lengthNumber:指定小数位，返回带小数位浮点数
    let temporaryArray = this.value.toString().split('.');
    let temporaryEnd = 0;
    if (parseInt(temporaryArray[1])) {
        let temporaryLength = parseInt(temporaryArray[1]) ? temporaryArray[1].length : 0;
        let temporaryNumber = '';
        if (temporaryLength > lengthNumber) {
            temporaryNumber = this.value.toString() + this.value.toString().substr(this.value.toString().length - 1, 1);
        } else {
            temporaryNumber = this.value.toString();
        }
        temporaryEnd = parseFloat(temporaryNumber);
    } else {
        temporaryEnd = parseFloat(this.value);
    }
    this.value = parseFloat(temporaryEnd.toFixed(lengthNumber));
    return this;
}
number15.prototype.val = function () {
    return this.value;
}
export default number15;