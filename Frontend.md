position: function (point, params, dom, rect, size) {
　　// 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
　　// 提示框位置
　　var x = 0; // x坐标位置
　　var y = 0; // y坐标位置
 
　　// 当前鼠标位置
　　var pointX = point[0];
　　var pointY = point[1];
 
　　// 外层div大小
　　// var viewWidth = size.viewSize[0];
　　// var viewHeight = size.viewSize[1];
 
　　// 提示框大小
　　var boxWidth = size.contentSize[0];
　　var boxHeight = size.contentSize[1];
 
　　// boxWidth > pointX 说明鼠标左边放不下提示框
　　if (boxWidth > pointX) {
　　　　x = pointX + 10;
　　} else { // 左边放的下
　　　　x = pointX - boxWidth-10;
　　}
 
　　// boxHeight > pointY 说明鼠标上边放不下提示框
　　if (boxHeight > pointY) {
　　　　y = 5;
　　} else { // 上边放得下
　　　　y = pointY - boxHeight;
　　}
 
　　return [x, y];
 
},
