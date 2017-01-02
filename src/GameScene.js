/*
    游戏场景的类
    本游戏场景 绑定了一个MVC结构
    * 一个controller(GameSceneController)负责场景的进入、退出等场景主逻辑处理以及逻辑与显示、三消与对战两个游戏模块间的通信
    * 一个view(GameSceneView)作为场景渲染对象,其应实时将游戏model的状态及其变化反映在屏幕上
    * 两个model(GameSceneEliminateModel、GameSceneFightModel)分别存储三消部分与对战部分的游戏数据、相关算法、以及进行各自部分的
      逻辑循环,二者之间通过GameSceneController来实现通信
*/
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        var controller = new GameSceneController();
        //controller.init();
        this.addChild(controller);
        
    }
});
