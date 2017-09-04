/*
    游戏标题界面的场景类
    由于场景比较简单,这里仅用了一个游戏场景下绑定一个层的简单结构
 */
var StartLayer = cc.Layer.extend({
    m_patternSprites:[],

    m_patternSpritesCircleMovement:{
        center:cc.p(0,0),
        radius:0,
        degreePerFrame:0,
        initDegree:[],
        currDegree:[],
    },

    ctor:function () {
         this._super();
         //cc.log("StartScene.ctor!");
         var bgSprite = new cc.Sprite(res.startSceneScrollBg_png);
         bgSprite.setAnchorPoint(0.5,0.0);

         bgSprite.setPosition(cc.winSize.width/2,cc.winSize.height - bgSprite.getContentSize().height);
         this.addChild(bgSprite,1);

         this.runAction(cc.sequence(
             cc.callFunc(
                 function(){
                     this.runAction(cc.moveTo(3.0,cc.p(cc.winSize.width/2,0)));
                 }.bind(bgSprite)
             ),
             cc.delayTime(0.5),
             cc.callFunc(
                 function(){
                     var titleSprite = new cc.Sprite();
                     titleSprite.setScale(1.2);
                     titleSprite.initWithSpriteFrameName(START_SCENE_TITLE_SPRITE_FRAME_NAME);
                     titleSprite.setPosition(cc.winSize.width/2,cc.winSize.height/5.0*3);
                     titleSprite.setOpacity(0);
                     titleSprite.runAction(cc.fadeIn(0.5));
                     titleSprite.runAction(cc.moveTo(0.5,cc.p(cc.winSize.width/2,cc.winSize.height/3.0*2)));
                     this.addChild(titleSprite,2);

                 }.bind(this)
             ),
             cc.delayTime(0.5),
             cc.callFunc(
                 function(){
                     var watchRoleSprite1 = new cc.Sprite();

                     watchRoleSprite1.setFlippedX(true);
                     watchRoleSprite1.setAnchorPoint(0.5,0);
                     watchRoleSprite1.setPosition(cc.winSize.width/2-START_SCENE_WATCHROLE_OFFSET_X_TO_WIN_CENTER,
                         cc.winSize.height/2+START_SCENE_WATCHROLE_OFFSET_Y_TO_WIN_CENTER);
                     watchRoleSprite1.setOpacity(0);

                     var swordAttackAnimation = cc.animationCache.getAnimation(FIGHTER_1_SWORD_ATTACK_ANIMATION_NAME);
                     swordAttackAnimation.setDelayPerUnit(g_swordAttackDuration/swordAttackAnimation.getFrames().length);
                     watchRoleSprite1.runAction(cc.repeatForever(
                         cc.animate(swordAttackAnimation)
                     ));

                     watchRoleSprite1.runAction(cc.fadeIn(0.5));

                     this.addChild(watchRoleSprite1,3);

                     var watchRoleSprite2 = new cc.Sprite();
                     watchRoleSprite2.setAnchorPoint(0.5,0);
                     watchRoleSprite2.setPosition(cc.winSize.width/2+START_SCENE_WATCHROLE_OFFSET_X_TO_WIN_CENTER,
                         cc.winSize.height/2+START_SCENE_WATCHROLE_OFFSET_Y_TO_WIN_CENTER);
                     watchRoleSprite2.setOpacity(0);

                     var arrowAttackAnimation = cc.animationCache.getAnimation(FIGHTER_1_ARROW_ATTACK_ANIMATION_NAME);
                     arrowAttackAnimation.setDelayPerUnit(g_arrowAttackDuration/arrowAttackAnimation.getFrames().length);
                     watchRoleSprite2.runAction(cc.repeatForever(
                         cc.animate(arrowAttackAnimation)
                     ));

                     // watchRoleSprite2.runAction(cc.repeatForever(cc.animate(
                     //     cc.animationCache.getAnimation(FIGHTER_1_ARROW_ATTACK_ANIMATION_NAME))
                     // ));
                     watchRoleSprite2.runAction(cc.fadeIn(0.5));

                     this.addChild(watchRoleSprite2,3);
                 }.bind(this)
             ),
             cc.delayTime(0.5),
             cc.callFunc(
                 function(){
                     var startBtn = new cc.MenuItemImage(
                         cc.spriteFrameCache.getSpriteFrame(START_BTN_1_SPRITE_FRAME_NAME),
                         cc.spriteFrameCache.getSpriteFrame(START_BTN_2_SPRITE_FRAME_NAME),
                         function(){
                             cc.audioEngine.playMusic(res.button_wav);

                             var sceneTransition = new cc.TransitionFade(g_sceneTransitionDuration,new GameScene());
                             cc.director.runScene(sceneTransition);
                         }.bind(this)
                     )
                     startBtn.setPosition(cc.winSize.width/2,cc.winSize.height/6.0);
                     startBtn.setScale(START_MENU_START_BTN_SCALE);

                     startBtn.setOpacity(0);

                     var menu = new cc.Menu(startBtn);
                     menu.setPosition(0,0);
                     this.addChild(menu,2);

                     startBtn.runAction(cc.fadeIn(0.5));
                 }.bind(this)
             )
         ));
         var patternSprites = [];
         for(var i=0;i<g_patternTypeNum;i++){
             patternSprites[i] = new cc.Sprite();
             patternSprites[i].setAnchorPoint(0.5,0.5);
             patternSprites[i].setOpacity(0);
             patternSprites[i].setScale(1.2);
             //patternSprites[i].runAction(cc.fadeTo(2.0,188));

             this.addChild(patternSprites[i],5);
         }
         patternSprites[0].initWithSpriteFrameName(PATTERN_SWORD_SPRITE_FRAME_NAME);
         patternSprites[1].initWithSpriteFrameName(PATTERN_ARROW_SPRITE_FRAME_NAME);
         patternSprites[2].initWithSpriteFrameName(PATTERN_DEFEND_SPRITE_FRAME_NAME);
         patternSprites[3].initWithSpriteFrameName(PATTERN_HEAL_SPRITE_FRAME_NAME);
         patternSprites[4].initWithSpriteFrameName(PATTERN_SPEED_UP_SPRITE_FRAME_NAME);
         patternSprites[5].initWithSpriteFrameName(PATTERN_FREEZE_SPRITE_FRAME_NAME);

        this.m_patternSpritesCircleMovement.center = cc.p(cc.winSize.width/2-4,cc.winSize.height/2-72);
        this.m_patternSpritesCircleMovement.radius = 108;
        this.m_patternSpritesCircleMovement.degreePerFrame = 360/(2.0*60.0);

         for(var i=0;i<g_patternTypeNum;i++){
             this.m_patternSprites[i] = patternSprites[i];

             this.m_patternSpritesCircleMovement.initDegree[i]=360.0/g_patternTypeNum*i;
             this.m_patternSpritesCircleMovement.currDegree[i]=360.0/g_patternTypeNum*i;
             //var circleMove = new CircleMove();
             //circleMove.initWithDuration(2,1,cc.p(cc.winSize.width/2-4,cc.winSize.height/2-72),108,60.0*i);
             //patternSprites[i].runAction(cc.repeatForever(circleMove));
         }

        this.updatePatternSpritesPosition();
        // cc.log("this.m_patternSpritesCircleMovement.center.x:"+this.m_patternSpritesCircleMovement.center.x);
        // cc.log("this.m_patternSpritesCircleMovement.center.y:"+this.m_patternSpritesCircleMovement.center.y);
         return true;
     },

    onEnterTransitionDidFinish:function(){
        this._super();
        //cc.log("StartScene.onEnterTransitionDidFinish!");
        for(var i=0;i<g_patternTypeNum;i++){
            this.m_patternSprites[i].setOpacity(0);
            this.m_patternSprites[i].runAction(cc.fadeTo(2.0,188));
        }

        //cc.log("onEnterTransitionDidFinish");
        cc.audioEngine.playMusic(res.startSceneBGM_wav,true);
        //this.scheduleUpdate(1/60.0);
        this.schedule(this.update,1/60.0);
    },

    update:function(dt){
        //cc.log("StartLayer.update!");
        this.updatePatternSpritesPosition();
    },

    updatePatternSpritesPosition:function(){
        for(var i=0;i<g_patternTypeNum;i++){
            this.m_patternSpritesCircleMovement.currDegree[i] += this.m_patternSpritesCircleMovement.degreePerFrame;
            while(this.m_patternSpritesCircleMovement.currDegree[i]>360){
                this.m_patternSpritesCircleMovement.currDegree[i] -= 360;
            }

            var radian = this.m_patternSpritesCircleMovement.currDegree[i]/180.0*Math.PI;

            var offsetX = this.m_patternSpritesCircleMovement.radius*Math.cos(radian);
            var offsetY = this.m_patternSpritesCircleMovement.radius*Math.sin(radian);

            var newPos = cc.p(
                this.m_patternSpritesCircleMovement.center.x+offsetX,
                this.m_patternSpritesCircleMovement.center.y+offsetY);

            // cc.log("newPos.x:"+newPos.x);
            // cc.log("newPos.y:"+newPos.y);

            this.m_patternSprites[i].setPosition(newPos);
        }
    },

    onExitTransitionDidStart:function(){
        this._super();
        //cc.log("onExitTransitionDidStart");
        this.unschedule(this.update);
    }
});

var StartScene = cc.Scene.extend({
     onEnter:function () {
         this._super();
         var layer = new StartLayer();
         //layer.init();
         this.addChild(layer);
     }
 });

