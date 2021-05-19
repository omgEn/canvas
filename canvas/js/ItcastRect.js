/*
	1.封装属性： x,y,w,h, fillStyle,strokeStyle,rotation,opacity
	2. render
*/

// 封装绘制的矩形
function ItcastRect(option){
	this._init(option);
}
ItcastRect.prototype = {
	_init: function(option){
		this.x = option.x ||0;
		this.y = option.y ||0;
		this.w = option.w ||0;
		this.h = option.h ||0;
		// 旋转角度
		this.rotation = option.rotation||0; 
		// 透明度
		this.opacity = option.opacity===0?0:option.opacity||1 
		// 缩放
		this.scaleX = option.scaleX||1;
		this.scaleY = option.scaleY||1;
		// 描边颜色
		this.strokeStyle = option.strokeStyle || 'red';
		// 填充颜色
		this.fillStyle = option.fillStyle || 'blue'
	},
	render: function(ctx){
		ctx.save();
		ctx.beginPath() // 不加会到导致一直叠加
		// 绕着自己旋转
		ctx.translate(this.x,this.y)
		
		ctx.rotate(this.rotation*Math.PI/180)
		ctx.globalAlpha = this.opacity
		ctx.scale(this.scaleX,this.scaleY)
		ctx.rect(0,0,this.w,this.h)
		
		
		ctx.fillStyle = this.fillStyle;
		ctx.fill()
		
		ctx.strokeStyle = this.strokeStyle;
		ctx.stroke()
		
		// 回归到原始的绘制状态，
		ctx.restore();
	}
}