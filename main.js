cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(480, 720, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources

    cc.LoaderScene.preload(g_resources, function () {

        cc.spriteFrameCache.addSpriteFrames(res.fightersFrames_plist);
        cc.spriteFrameCache.addSpriteFrames(res.effectsFrames_plist);
        cc.spriteFrameCache.addSpriteFrames(res.values_plist);
        cc.spriteFrameCache.addSpriteFrames(res.patterns_plist);
        cc.spriteFrameCache.addSpriteFrames(res.titles_plist);
        cc.spriteFrameCache.addSpriteFrames(res.btns_plist);

        cc.animationCache.addAnimations(res.fightersAnimations_plist);
        cc.animationCache.addAnimations(res.effectsAnimations_plist);

        cc.director.runScene(new StartScene());
    }, this);

 
};
cc.game.run();