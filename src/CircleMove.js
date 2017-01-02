/*
   自定义圆周运动类
*/
var CircleMove = cc.ActionInterval.extend({
    m_duration:0.0,
    m_center:cc.p(0,0),
    m_radius:0,
    m_initRadian:0,
    m_radianPerFrame:0,
    m_counter:0,
    

    initWithDuration:function(duration,loop,center,radius,initRadian){
        this._super(duration);

        this.m_center = center;
        this.m_radius = radius;
        this.m_initRadian = initRadian;
        this.m_radianPerFrame = 2*Math.PI*loop/(duration/cc.director.getAnimationInterval());

        return true;

    },
    startWithTarget:function(pTarget){
        this._super(pTarget);
    },
    update:function(dt){
        this.m_counter += 1;
        this.m_angle += this.m_anglePerFrame;
        while(this.m_angle>360){
            this.m_angle -= 360;
        }

        //var radian = this.m_angle/180.0*Math.PI;
        var radian = this.m_counter*this.m_radianPerFrame + this.m_initRadian;

        var offsetX = this.m_radius*Math.sin(radian);
        var offsetY = this.m_radius*Math.cos(radian);

        var newPos = cc.p(this.m_center.x+offsetX,this.m_center.y+offsetY);

        //cc.log("newPos is "+newPos.x+","+newPos.y);

        var target = this.getTarget();
        target.setPosition(newPos);
        
    }

});