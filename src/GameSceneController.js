/*
    游戏场景MVC中controller类
    用于
    1、作为model类与view类间通信的媒介
      监听接收model类传来的各类事件,并依据事件信息对view类作出相应的调整
       实现逻辑(model类管理)与显示(view类管理)的分离
    2、作为两个model类(管理对战部分的model类与管理三消部分的model类)间通信的媒介
       监听接收任一方model类传来的事件,若接收到某方model类的事件与另一方model类数据或处理相关,则需要将一方model传递的事件信息
       交给另一方model类处理
    GameSceneController可以直接通过GameSceneView类 与GameSceneEliminateModel、GameSceneFightModel类的指针获取他们的信息
*/
var GameSceneController = cc.Layer.extend({
    m_gameState:null,
    m_counter:0,
    m_view:null,           //view的接口

    m_eliminateModel:null, //三消部分model的接口
    m_fightModel:null,     //对战部分model的接口

    ctor:function(){
        this._super();
        this.m_eliminateModel = new GameSceneEliminateModel();
        this.addChild(this.m_eliminateModel,0);

        this.m_fightModel = new GameSceneFightModel();
        this.addChild(this.m_fightModel,1);
        
        this.m_view = new GameSceneView(this.m_eliminateModel.m_patternMatrixRowNum,this.m_eliminateModel.m_patternMatrixColNum);
        this.m_view.delegate = this;

        this.addChild(this.m_view,2);

        this.m_view.m_testLabel1 = new cc.LabelTTF("","",20);
        this.m_view.m_testLabel1.setAnchorPoint(0,1);
        this.m_view.m_testLabel1.setPosition(0,cc.winSize.height);
        this.m_view.addChild(this.m_view.m_testLabel1,3);

        this.m_view.m_testLabel2 = new cc.LabelTTF("","",20);
        this.m_view.m_testLabel2.setAnchorPoint(0,1);
        this.m_view.m_testLabel2.setPosition(0,cc.winSize.height-32);
        this.m_view.addChild(this.m_view.m_testLabel2,3);

        this.m_view.m_testLabel3 = new cc.LabelTTF("","",20);
        this.m_view.m_testLabel3.setAnchorPoint(0,1);
        this.m_view.m_testLabel3.setPosition(0,cc.winSize.height-64);
        this.m_view.addChild(this.m_view.m_testLabel3,3);


        return true;
    },
    //在即将进入场景前添加两个model各种事件的监听器,并播放背景音乐
    onEnterTransitionDidFinish:function(){
        this._super();
        cc.log("onEnterTransitionDidFinish");
        cc.audioEngine.playMusic(res.gameSceneBGM_wav,true);

        //添加触摸时间监听器
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan.bind(this),
            onTouchMoved:this.onTouchMoved.bind(this),
        },this.m_view);


        //添加eliminate部分model的事件通知Notification的监听器及其回调函数
        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_INIT_PATTERNS,
            callback:this.initPatternsCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_SELECT_PATTERN,
            callback:this.selectPatternCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_SWAP_PATTERNS,
            callback:this.swapPatternsCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_ELIMINATE_PATTERNS,
            callback:this.eliminatePatternsCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FILL_PATTERN_MATRIX_VACANCIES,
            callback:this.fillPatternMatrixVacanciesCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_REMOVE_ALL_PATTERNS,
            callback:this.removeAllPatternsCallBack.bind(this)
        },this);

        //添加fight部分model的事件通知Notification的监听器及其回调函数
        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_INIT_FIGHT,
            callback:this.initFightCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_ATTACK,
            callback:this.fighterAttackCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_GET_DEFEND,
            callback:this.fighterGetDefendCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_GET_HURT,
            callback:this.fighterGetHurtCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_HEAL,
            callback:this.fighterHealCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_SPEED_UP,
            callback:this.fighterSpeedUpCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_SPEED_UP_BUFF_END,
            callback:this.fighterSpeedUpBuffEndCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_FREEZE,
            callback:this.fighterFreezeCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_GET_FROZEN,
            callback:this.fighterGetFrozenCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHTER_GO_DIE,
            callback:this.fighterGoDieCallBack.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName: NOTIFICATION_FIGHT_GAME_OVER,
            callback:this.fightGameOverCallBack.bind(this)
        },this);


        this.m_gameState = GameState.init;

        this.scheduleUpdate();
    },
    //游戏场景的主循环(尽管大部分游戏逻辑都是在事件及事件回调函数中处理)
    update:function(dt){
        //cc.log("GameSceneController update");
        
        //游戏状态
        switch(this.m_gameState){
            //暂停
            case GameState.pause:
                break;
            
            //初始化
            case GameState.init:
                this.m_counter += 1;
                if(this.m_counter == 1){
                    this.m_gameState = GameState.inTheGame;
                }

                break;
            //游戏进行中
            case GameState.inTheGame:
                this.m_eliminateModel.update(dt);
                this.m_fightModel.update(dt);
                this.m_view.update(dt);

                this.m_view.m_testLabel1.setString("fighter 0 state is: "+this.m_fightModel.m_fightersVars[0].state);
                this.m_view.m_testLabel2.setString("fighter 0 outOfPlace is: "+this.m_fightModel.m_fightersVars[0].outOfPlace);
                this.m_view.m_testLabel3.setString("fighter 0 frozen is: "+this.m_fightModel.m_fightersVars[0].debuffState.frozen);
                break;
            //游戏结束
            case GameState.end:
                break;
            default:
                break;
        }
    },
    //玩家开始触摸事件的回调函数
    onTouchBegan:function(touch,event){
        cc.log("onTouchBegan1");
        if(this.m_gameState != GameState.inTheGame){
            return false;
        }
        if(this.m_fightModel.m_fightersVars[0].debuffState.frozen == true){
            cc.audioEngine.playEffect(res.disable_wav);
            return false;
        }
        
        if(this.m_eliminateModel.m_eliminateGameState != EliminateGameState.waitForInput){
            return false;
        }

        var touchLocation = touch.getLocation();
        var patternIndex = this.m_eliminateModel.getPatternMatrixIndex(touchLocation);

        //判断是否按中某个三消图案
        if(patternIndex != null){
            this.m_eliminateModel.selectPattern(patternIndex);
        }else{
            this.m_eliminateModel.m_firstSelectedPatternIndex = null;
            this.m_view.m_selectCursor.setPosition(SELECT_CURSOR_SPRITE_HIDE_POSITION);
        }

        return true;
    },
    //用户移动触摸事件的回调函数
    onTouchMoved:function(touch,event){
        //cc.log("GameSceneController onTouchMoved");

        if(this.m_eliminateModel.m_eliminateGameState != EliminateGameState.waitForInput){
            return;
        }
        if(this.m_eliminateModel.m_firstSelectedPatternIndex == null){
            return;
        }
        var firstSelectedPatternRow = this.m_eliminateModel.m_firstSelectedPatternIndex.row;
        var firstSelectedPatternCol = this.m_eliminateModel.m_firstSelectedPatternIndex.col;

        var firstSelectedPatternPos = this.m_eliminateModel.m_patternsPos[firstSelectedPatternRow][firstSelectedPatternCol];
        var currentTouchPosition = touch.getLocation();
        var offX = currentTouchPosition.x - firstSelectedPatternPos.x;
        var offY = currentTouchPosition.y - firstSelectedPatternPos.y;

        if(Math.abs(offX)>Math.abs(offY)){
            if(offX>this.m_eliminateModel.m_colWidth*0.5 &&
                firstSelectedPatternCol < this.m_eliminateModel.m_patternMatrixColNum-1){
                this.m_eliminateModel.m_secondSelectedPatternIndex =
                {row:this.m_eliminateModel.m_firstSelectedPatternIndex.row,
                col:this.m_eliminateModel.m_firstSelectedPatternIndex.col+1};
            }else if(offX<-this.m_eliminateModel.m_colWidth*0.5 &&
                firstSelectedPatternCol > 0){
                this.m_eliminateModel.m_secondSelectedPatternIndex =
                {row:this.m_eliminateModel.m_firstSelectedPatternIndex.row,
                    col:this.m_eliminateModel.m_firstSelectedPatternIndex.col-1};
            }
        }else{
            if(offY>this.m_eliminateModel.m_rowHeight*0.5 &&
                firstSelectedPatternRow < this.m_eliminateModel.m_patternMatrixRowNum-1){
                this.m_eliminateModel.m_secondSelectedPatternIndex =
                {row:this.m_eliminateModel.m_firstSelectedPatternIndex.row+1,
                    col:this.m_eliminateModel.m_firstSelectedPatternIndex.col};
            }else if(offY<-this.m_eliminateModel.m_rowHeight*0.5 &&
                firstSelectedPatternRow > 0){
                this.m_eliminateModel.m_secondSelectedPatternIndex =
                {row:this.m_eliminateModel.m_firstSelectedPatternIndex.row-1,
                    col:this.m_eliminateModel.m_firstSelectedPatternIndex.col};
            }
        }
        if(this.m_eliminateModel.m_secondSelectedPatternIndex != null){
            this.m_eliminateModel.m_eliminateGameState = EliminateGameState.swapPatternsForth;
            this.m_eliminateModel.swapPatterns(this.m_eliminateModel.m_firstSelectedPatternIndex,this.m_eliminateModel.m_secondSelectedPatternIndex);

            this.m_eliminateModel.m_firstSelectedPatternIndex = null;
            this.m_eliminateModel.m_secondSelectedPatternIndex = null;
            this.m_view.m_selectCursor.setPosition(SELECT_CURSOR_SPRITE_HIDE_POSITION);
        }

    },
    //EliminateModel初始化三消图案时的回调函数
    initPatternsCallBack:function(event){
        cc.log("initPatternsCallBack");
        var eventData = event.getUserData();
        var patternsVars = eventData.patternsVars;
        var gameSpeed = eventData.gameSpeed;
        this.createAndDropPatternSprites(patternsVars,gameSpeed);
    },
    createAndDropPatternSprites:function(newPatternsVars,gameSpeed){
        for(var row = 0;row<this.m_eliminateModel.m_patternMatrixRowNum;row++){
            for(var col = 0;col<this.m_eliminateModel.m_patternMatrixColNum;col++){
                if(newPatternsVars[row][col] != null){
                    this.createAndDropPatternSprite(newPatternsVars[row][col],row,col,gameSpeed);
                }
            }
        }
    },
    //生成若干行若干列的三消图案的精灵,并使它们移动归位
    createAndDropPatternSprite:function(patternVars,row,col,gameSpeed){
        var spriteName;
        switch(patternVars.type){
            case PatternType.sword:
                spriteName = PATTERN_SWORD_SPRITE_FRAME_NAME;
                break;
            case PatternType.arrow:
                spriteName = PATTERN_ARROW_SPRITE_FRAME_NAME;
                break;
            case PatternType.defend:
                spriteName = PATTERN_DEFEND_SPRITE_FRAME_NAME;
                break;
            case PatternType.heal:
                spriteName = PATTERN_HEAL_SPRITE_FRAME_NAME;
                break;
            case PatternType.speedUp:
                spriteName = PATTERN_SPEED_UP_SPRITE_FRAME_NAME;
                break;
            case PatternType.freeze:
                spriteName = PATTERN_FREEZE_SPRITE_FRAME_NAME;
                break;
        }
        if(this.m_view.m_patternSprites[row][col]!=null){
            this.m_view.m_patternSprites[row][col].removeFromParent(true);
        }
        this.m_view.m_patternSprites[row][col] = new cc.Sprite();
        this.m_view.m_patternSprites[row][col].initWithSpriteFrameName(spriteName);
        this.m_view.m_patternSprites[row][col].setAnchorPoint(0.5,0.5);
        this.m_view.m_patternSprites[row][col].setScale(PATTERN_SCALE);

        var startPosition = cc.p(this.m_eliminateModel.m_patternsPos[row][col].x,
            this.m_eliminateModel.m_patternsPos[row][col].y + PATTERN_SPRITE_DROP_HEIGHT);
        var endPosition = new cc.p(this.m_eliminateModel.m_patternsPos[row][col].x,this.m_eliminateModel.m_patternsPos[row][col].y);

        this.m_view.m_patternSprites[row][col].setPosition(startPosition);

        var patternFallDuration = (startPosition.y-endPosition.y)/g_patternDropSpeed/gameSpeed;
        this.m_view.m_patternSprites[row][col].runAction(cc.sequence(cc.moveTo(patternFallDuration,endPosition)));

        //this.m_view.m_patternBatchNode.addChild(this.m_view.m_patternSprites[row][col],3);
        this.m_view.addChild(this.m_view.m_patternSprites[row][col],PATTERN_GAME_SCENE_VIEW_Z_ORDER);
    },
    //model处理选择图案的逻辑时触发的回调函数
    selectPatternCallBack:function(event){
        cc.audioEngine.playEffect(res.cursor_wav);

        var eventData = event.getUserData();
        var selectedPatternIndex = eventData.selectedPatternIndex;
        this.m_view.m_selectCursor.setPosition(this.m_eliminateModel.m_patternsPos[selectedPatternIndex.row][selectedPatternIndex.col]);
    },
    //model处理交换图案的逻辑时触发的回调函数
    swapPatternsCallBack:function(event){
        this.m_view.m_selectCursor.setPosition(SELECT_CURSOR_SPRITE_HIDE_POSITION);

        var eventData = event.getUserData();
        var firstPatternIndex = eventData.firstPatternIndex;
        var secondPatternIndex = eventData.secondPatternIndex;
        var gameSpeed = eventData.gameSpeed;

        var firstPatternSprite = this.m_view.m_patternSprites[firstPatternIndex.row][firstPatternIndex.col];
        this.m_view.m_patternSprites[firstPatternIndex.row][firstPatternIndex.col] = this.m_view.m_patternSprites[secondPatternIndex.row][secondPatternIndex.col];
        this.m_view.m_patternSprites[secondPatternIndex.row][secondPatternIndex.col] = firstPatternSprite;

        this.m_view.m_patternSprites[firstPatternIndex.row][firstPatternIndex.col].stopAllActions();
        this.m_view.m_patternSprites[firstPatternIndex.row][firstPatternIndex.col].runAction(
            cc.moveTo(g_patternSwapDuration/gameSpeed,
                this.m_eliminateModel.m_patternsPos[firstPatternIndex.row][firstPatternIndex.col]));

        this.m_view.m_patternSprites[secondPatternIndex.row][secondPatternIndex.col].stopAllActions();
        this.m_view.m_patternSprites[secondPatternIndex.row][secondPatternIndex.col].runAction(
            cc.moveTo(g_patternSwapDuration/gameSpeed,
                this.m_eliminateModel.m_patternsPos[secondPatternIndex.row][secondPatternIndex.col]));
    },
    //model处理图案被消除的逻辑时触发的回调函数
    eliminatePatternsCallBack:function(event){
        //cc.log("eliminatePatternSprites");
        var eventData  = event.getUserData();
        var eliminablePatternsVars = eventData.eliminablePatternsVars;
        // var eliminablePatternTypes = eventData.eliminablePatternTypes;
        // var eliminablePatternNum = eventData.eliminablePatternNum;
        var gameSpeed = eventData.gameSpeed;

        var eliminablePatternsNum=[];
        eliminablePatternsNum[PatternType.sword]=0;
        eliminablePatternsNum[PatternType.arrow]=0;
        eliminablePatternsNum[PatternType.defend]=0;
        eliminablePatternsNum[PatternType.heal]=0;
        eliminablePatternsNum[PatternType.speedUp]=0;
        eliminablePatternsNum[PatternType.freeze]=0;

        for(var row=0;row<this.m_eliminateModel.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_eliminateModel.m_patternMatrixColNum;col++){
                if(eliminablePatternsVars[row][col]!=null){
                    switch(eliminablePatternsVars[row][col].type){
                        case PatternType.sword:
                            eliminablePatternsNum[PatternType.sword]+=1;
                            break;
                        case PatternType.arrow:
                            eliminablePatternsNum[PatternType.arrow]+=1;
                            break;
                        case PatternType.defend:
                            eliminablePatternsNum[PatternType.defend]+=1;
                            break;
                        case PatternType.heal:
                            eliminablePatternsNum[PatternType.heal]+=1;
                            break;
                        case PatternType.speedUp:
                            eliminablePatternsNum[PatternType.speedUp]+=1;
                            break;
                        case PatternType.freeze:
                            eliminablePatternsNum[PatternType.freeze]+=1;
                            break;
                    }

                    //消除动画
                    var effectSprite = new cc.Sprite();
                    effectSprite.setPosition(this.m_eliminateModel.m_patternsPos[row][col]);
                    this.addChild(effectSprite,ELIMINATE_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

                    var eliminatePatternAnimation = cc.animationCache.getAnimation(ELIMINATE_PATTERN_EFFECT_ANIMATION_NAME);

                    var effectAnimationUnitDelay = g_patternEliminateDuration
                        /eliminatePatternAnimation.getFrames().length /gameSpeed;

                    eliminatePatternAnimation.setDelayPerUnit(effectAnimationUnitDelay);

                    effectSprite.runAction(cc.sequence(
                        cc.animate(eliminatePatternAnimation),
                        cc.callFunc(
                            function(){
                            this.removeFromParent(true);
                            }.bind(effectSprite)
                        )
                    ));

                    this.fadeOutAndRemovePatternSprite(row,col,gameSpeed)
                }
            }
        }
        cc.audioEngine.playEffect(res.explosion_wav);
        var eliminableTypes=[];

        for(var i=PatternType.sword;i<PatternType.sword+g_patternTypeNum;i++){
            if(eliminablePatternsNum[i]!=0){
                eliminableTypes.push(i);
            }
        }

        var eliminateType;
        if(eliminableTypes.length>1){
            if(eliminablePatternsNum[eliminableTypes[0]]>eliminablePatternsNum[eliminableTypes[1]]){
                eliminateType = eliminableTypes[0];
            }else if(eliminablePatternsNum[eliminableTypes[1]]>eliminablePatternsNum[eliminableTypes[0]]){
                eliminateType = eliminableTypes[1];

            }else{
                var rand = getIntRandBetween(0,1);
                eliminateType = eliminableTypes[rand];
            }
        }else{
            eliminateType = eliminableTypes[0];
        }

        cc.log("eliminate num is: "+eliminablePatternsNum[eliminateType]);
        if(this.m_fightModel.m_fightersVars[0].state == FighterState.alert
        && this.m_fightModel.m_fightersVars[0].debuffState.frozen == false) {
            switch(eliminateType){
                case PatternType.sword:
                    this.m_fightModel.fighterAttack(0, FighterAttackType.swordAttack,eliminablePatternsNum[eliminateType]);
                    break;
                case PatternType.arrow:
                    this.m_fightModel.fighterAttack(0, FighterAttackType.arrowAttack,eliminablePatternsNum[eliminateType]);
                    break;
                case PatternType.defend:
                    this.m_fightModel.fighterGetDefend(0,eliminablePatternsNum[eliminateType]);
                    break;
                case PatternType.heal:
                    this.m_fightModel.fighterHeal(0,eliminablePatternsNum[eliminateType]);
                    break;
                case PatternType.speedUp:
                    this.m_fightModel.fighterSpeedUp(0,eliminablePatternsNum[eliminateType]);
                    break;
                case PatternType.freeze:
                    this.m_fightModel.fighterFreeze(0,eliminablePatternsNum[eliminateType]);
                    break;
            }
        }

    },
    //model处理填补图案消除后矩阵空缺时的回调函数
    fillPatternMatrixVacanciesCallBack:function(event){
        var eventData = event.getUserData();
        var gameSpeed = eventData.gameSpeed;
        var oldPatternsIndexChanges = eventData.oldPatternsIndexChanges;
        
        for(var row = 0;row<this.m_eliminateModel.m_patternMatrixRowNum;row++){
            for(var col = 0;col<this.m_eliminateModel.m_patternMatrixColNum;col++){
                if(oldPatternsIndexChanges[row][col] != null){
                    this.movePatternSprite(oldPatternsIndexChanges[row][col].oldPatternIndex,
                        oldPatternsIndexChanges[row][col].newPatternIndex,gameSpeed);
                }
            }
        }
        var newPatternsVars = eventData.newPatternsVars;
        this.createAndDropPatternSprites(newPatternsVars,gameSpeed);
    },
    movePatternSprite:function(oldPatternIndex,newPatternIndex,gameSpeed) {
        //cc.log("movePatternSprite");

        this.m_view.m_patternSprites[newPatternIndex.row][newPatternIndex.col]=this.m_view.m_patternSprites[oldPatternIndex.row][oldPatternIndex.col];
        this.m_view.m_patternSprites[oldPatternIndex.row][oldPatternIndex.col]=null;

        var oldPosition = this.m_eliminateModel.m_patternsPos[oldPatternIndex.row][oldPatternIndex.col];
        var newPosition = this.m_eliminateModel.m_patternsPos[newPatternIndex.row][newPatternIndex.col];
        var patternFallDuration = (oldPosition.y-newPosition.y)/g_patternDropSpeed/gameSpeed;
        this.m_view.m_patternSprites[newPatternIndex.row][newPatternIndex.col].runAction(
            cc.moveTo(patternFallDuration,newPosition));
    },
    //移除所有pattern,此处与elimiatePatterns不同,这里的移除是指当矩阵中不存在可通过变换消除的图案时移除全部图案以刷新
    // 图案矩阵,而elimiatePattern是指通过变换图案后因三连而获得的消除
    removeAllPatternsCallBack:function(event){
        var eventData = event.getUserData();
        var gameSpeed = eventData.gameSpeed;
        
        for(var row=0;row<this.m_eliminateModel.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_eliminateModel.m_patternMatrixColNum;col++){
                this.fadeOutAndRemovePatternSprite(row,col,gameSpeed );
            }
        }
    },
    fadeOutAndRemovePatternSprite:function(row,col,gameSpeed){
        this.m_view.m_patternSprites[row][col].runAction(
            cc.sequence(cc.fadeOut(g_patternEliminateDuration/gameSpeed),
                cc.callFunc(
                    function(){
                        this.m_view.m_patternSprites[row][col].removeFromParent(true);
                        this.m_view.m_patternSprites[row][col]=null;
                    }.bind(this)
                )
            ));
    },

    /***
     * 以下为fight部分model事件的回调函数
     */
    initFightCallBack:function(event){
        //cc.log("initFightCallBack");
        var eventData = event.getUserData();
        var fightersVars = eventData.fightersVars;

        this.m_view.m_fighterSprites[0] = new cc.Sprite();
        this.m_view.m_fighterSprites[0].setAnchorPoint(0.5,0.0);

        this.m_view.m_fighterSprites[0].setPosition(PLAYER_FIGHTER_SPRITE_INIT_POSITION_X,PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y);

        this.m_view.m_fighterSprites[0].setFlippedX(true);
        this.m_view.m_fighterSprites[0].setOpacity(0);
        this.m_view.addChild(this.m_view.m_fighterSprites[0],PLAYER_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        this.m_view.m_fighterSprites[0].runAction(cc.sequence(
            cc.callFunc(
                function(){
                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    this.m_view.m_fighterSprites[0].runAction(repeatAnimateAlertAction);
                }.bind(this)
            ),
            cc.fadeIn(g_fighterFadeInDuration)
        ));

        this.m_view.m_fighterSprites[1] = new cc.Sprite();
        this.m_view.m_fighterSprites[1].setAnchorPoint(0.5,0.0);

        this.m_view.m_fighterSprites[1].setPosition(COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X,COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y);
        this.m_view.m_fighterSprites[1].setOpacity(0);
        this.m_view.addChild(this.m_view.m_fighterSprites[1],ENEMY_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        this.m_view.m_fighterSprites[1].runAction(cc.sequence(
            cc.callFunc(
                function(){
                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    this.m_view.m_fighterSprites[1].runAction(repeatAnimateAlertAction);
                }.bind(this)
            ),
            cc.fadeIn(g_fighterFadeInDuration)
        ));

        for(var i=0;i<g_fighterNum;i++){
            this.m_view.m_fighterHpBarBgSprites[i] = new cc.Sprite(res.hpbarBg_png);

            this.m_view.m_fighterHpBarBgSprites[i].setPosition(
                this.m_view.m_fighterSprites[i].getPositionX(),
                this.m_view.m_fighterSprites[i].getPositionY()+ HPBAR_SPRITE_OFFSET_Y_TO_FIGHTER);
            this.m_view.addChild(this.m_view.m_fighterHpBarBgSprites[i],HPBAR_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

            this.m_view.m_fighterHpBarFillSprites[i] = new cc.Sprite(res.hpbarFill_png);
            this.m_view.m_fighterHpBarFillSprites[i].setAnchorPoint(0.0,0.5);
        
            this.m_view.m_fighterHpBarFillSprites[i].setPosition(
                this.m_view.m_fighterHpBarBgSprites[i].getContentSize().width/2-
                this.m_view.m_fighterHpBarFillSprites[i].getContentSize().width/2,
                this.m_view.m_fighterHpBarBgSprites[i].getContentSize().height/2);
            this.m_view.m_fighterHpBarBgSprites[i].addChild(this.m_view.m_fighterHpBarFillSprites[i],1);

        }

        var playerTitle = new cc.Sprite();
        playerTitle.initWithSpriteFrameName(PLAYER_TITLE_SPRITE_FRAME_NAME);
        playerTitle.setPosition( this.m_view.m_fighterSprites[0].getPositionX(),
            this.m_view.m_fighterSprites[0].getPositionY()+PLAYER_TITLE_SPRITE_OFFSET_Y_TO_FIGHTER);
        this.m_view.addChild(playerTitle,PLAYER_TITLE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var computerTitle = new cc.Sprite();
        computerTitle.initWithSpriteFrameName(COMPUTER_TITLE_SPRITE_FRAME_NAME);
        computerTitle.setPosition( this.m_view.m_fighterSprites[1].getPositionX(),
            this.m_view.m_fighterSprites[1].getPositionY()+PLAYER_TITLE_SPRITE_OFFSET_Y_TO_FIGHTER);
        this.m_view.addChild(computerTitle,PLAYER_TITLE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

    },
    //mode逻辑处理战斗者攻击时调用的回调函数
    fighterAttackCallBack:function(event){

        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var attackType = eventData.attackType;
        var targetFighterId = eventData.targetFighterId;
        var fighterSpeed = eventData.fighterSpeed;

        //当角色的攻击是用弓箭攻击时
        switch(attackType){
            //当角色的攻击是用剑攻击时
            case FighterAttackType.swordAttack:
                //this.resetFighterSprite(fighterId);
                //this.m_view.m_fighterSprites[fighterId].stopAllActions();

                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
                this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);

                this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
                this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

                var oldPosition;// = this.m_view.m_fighterSprites[fighterId].getPosition();
                if(fighterId == 0){
                    oldPosition = cc.p(PLAYER_FIGHTER_SPRITE_INIT_POSITION_X,PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y);
                }else if(fighterId == 1){
                    oldPosition = cc.p(COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X,COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y);
                }
                var attackPosition;
                if(this.m_view.m_fighterSprites[fighterId].getPositionX()<
                    this.m_view.m_fighterSprites[targetFighterId].getPositionX()){
                    attackPosition = cc.p(this.m_view.m_fighterSprites[targetFighterId].getPositionX() - FIGHTER_SWORD_ATTACK_DISTANCE,
                        this.m_view.m_fighterSprites[targetFighterId].getPositionY());
                }else{
                    attackPosition = cc.p(this.m_view.m_fighterSprites[targetFighterId].getPositionX() + FIGHTER_SWORD_ATTACK_DISTANCE,
                        this.m_view.m_fighterSprites[targetFighterId].getPositionY());
                }

                var swordAttackAnimation = cc.animationCache.getAnimation(FIGHTER_1_SWORD_ATTACK_ANIMATION_NAME);
                swordAttackAnimation.setDelayPerUnit(g_swordAttackDuration/swordAttackAnimation.getFrames().length
                    / fighterSpeed);


                var swordAttackAction = cc.sequence(
                    cc.fadeOut(g_fighterFadeOutDuration / fighterSpeed),
                    cc.callFunc(
                        function(){
                            this.setPosition(attackPosition);
                            this.runAction(cc.fadeIn(g_fighterFadeInDuration / fighterSpeed));
                        }.bind(this.m_view.m_fighterSprites[fighterId])
                    ),
                    cc.animate(swordAttackAnimation),
                    cc.callFunc(
                        function(){
                            cc.log("from sword attack restore to repeat alert");
                            this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                            
                            var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                            repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG)

                            this.runAction(repeatAnimateAlertAction);
                        }.bind(this.m_view.m_fighterSprites[fighterId])
                    ),
                    cc.fadeOut(g_fighterFadeOutDuration / fighterSpeed),
                    cc.callFunc(
                        function(){
                            this.setPosition(oldPosition);

                        }.bind(this.m_view.m_fighterSprites[fighterId])
                    ),
                    cc.fadeIn(g_fighterFadeInDuration / fighterSpeed)
                );

                swordAttackAction.setTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);

                this.m_view.m_fighterSprites[fighterId].runAction(swordAttackAction);

                break;

            //当角色的攻击是用弓箭攻击时
            case FighterAttackType.arrowAttack:
                //this.resetFighterSprite(fighterId);
                //this.m_view.m_fighterSprites[fighterId].stopAllActions();


                this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                //this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);


                this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
                this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

                var heldArrowSprite = new cc.Sprite(res.arrow_png);
                var heldArrowSpriteInitPosX;
                var heldArrowSpriteInitPosY =  this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().y+ARROW_SPRITE_INIT_OFFSET_Y_TO_INVENTOR;
                if(this.m_view.m_fighterSprites[fighterId].isFlippedX()==true){
                    heldArrowSprite.setFlippedX(true);
                    heldArrowSpriteInitPosX = this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().x+ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR;
                }else{
                    heldArrowSprite.setFlippedX(false);
                    heldArrowSpriteInitPosX = this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().x-ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR;
                }
                heldArrowSprite.setPosition(heldArrowSpriteInitPosX, heldArrowSpriteInitPosY)
                heldArrowSprite.setName("arrow");
                this.m_view.m_fighterSprites[fighterId].addChild(heldArrowSprite,1);

                var arrowAttackAnimation=cc.animationCache.getAnimation(FIGHTER_1_ARROW_ATTACK_ANIMATION_NAME);
                arrowAttackAnimation.setDelayPerUnit(g_arrowAttackDuration/arrowAttackAnimation.getFrames().length
                    /fighterSpeed);
                
                var  arrowAttackAction = cc.sequence(
                    cc.spawn(
                        cc.animate(arrowAttackAnimation),
                        cc.sequence(
                            cc.delayTime(g_arrowAttackDuration/3.0*2/fighterSpeed),
                            cc.callFunc(
                                function(){
                                    heldArrowSprite.removeFromParent();

                                    var arrowSprite = new cc.Sprite(res.arrow_png);
                                    var arrowSpriteInitPosX;
                                    var arrowSpriteInitPosY = this.m_view.m_fighterSprites[fighterId].getPositionY()+ARROW_SPRITE_INIT_OFFSET_Y_TO_INVENTOR;
                                    var arrowSpriteDestPosX;
                                    if(this.m_view.m_fighterSprites[fighterId].isFlippedX()==true){
                                        arrowSprite.setFlippedX(true);
                                        // arrowSpriteInitPosX = this.m_view.m_fighterSprites[fighterId].getPositionX()+ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR;
                                        // arrowSpriteDestPosX = this.m_view.m_fighterSprites[targetFighterId].getPositionX()-ARROW_SPRITE_DEST_OFFSET_X_TO_TARGET;
                                        arrowSpriteInitPosX = PLAYER_FIGHTER_SPRITE_INIT_POSITION_X+ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR;
                                        arrowSpriteDestPosX = COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X-ARROW_SPRITE_DEST_OFFSET_X_TO_TARGET;
                                    }else{
                                        arrowSprite.setFlippedX(false);
                                        arrowSpriteInitPosX = COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X-ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR;
                                        arrowSpriteDestPosX = PLAYER_FIGHTER_SPRITE_INIT_POSITION_X+ARROW_SPRITE_DEST_OFFSET_X_TO_TARGET;
                                    }

                                    arrowSprite.setPosition(arrowSpriteInitPosX, arrowSpriteInitPosY)
                                    this.m_view.addChild(arrowSprite,ARROW_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

                                    arrowSprite.runAction(cc.sequence(
                                        //cc.delayTime(g_arrowAttackDuration*2.0/3.0 /fighterSpeed),
                                        //cc.delayTime(g_arrowAttackDuration*2.0/3.0 /fighterSpeed),
                                        cc.moveTo(g_arrowFlyDuration,cc.p(arrowSpriteDestPosX,arrowSpriteInitPosY)),
                                        cc.callFunc(
                                            function(){
                                                this.removeFromParent(true);
                                            }.bind(arrowSprite)
                                        )
                                    ));
                                }.bind(this)
                            )
                        )
                    ),
                    cc.callFunc(
                        function(){
                            //this.stopAllActions();
                            this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

                            this.setAnchorPoint(0.5,0.0);
                            this.setOpacity(255);

                            var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                            repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG)
                            this.runAction(repeatAnimateAlertAction);
                            //this.runAction(cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME))));
                        }.bind(this.m_view.m_fighterSprites[fighterId])
                    )
                );

                arrowAttackAction.setTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);

                this.m_view.m_fighterSprites[fighterId].runAction(arrowAttackAction);


                break;

        }

    },
    //model逻辑处理战斗者增加防御buff时调用的回调函数
    fighterGetDefendCallBack:function(event){
        cc.log("playerDefendCallBack");
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var fighterSpeed = eventData.fighterSpeed;
        var degree = eventData.degree;

        //this.m_view.m_fighterSprites[fighterId].stopAllActions();
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5,0.0);
        this.m_view.m_fighterSprites[fighterId].setOpacity(255);

        var defendSpriteFrame = cc.spriteFrameCache.getSpriteFrame(FIGHTER_1_DEFEND_SPRITE_FRAME_NAME);
        this.m_view.m_fighterSprites[fighterId].setSpriteFrame(defendSpriteFrame);
        
        var getDefendAction = cc.sequence(
            cc.delayTime(g_fighterGetDefendDuration/fighterSpeed),
            cc.callFunc(
                function(){
                    cc.log("getDefendActionDidFinish!");
                    //this.stopAllActions();
                    // this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    // this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    // this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    //
                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)))
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

                    this.setAnchorPoint(0.5, 0.0);
                    this.setOpacity(255);
                    
                    this.runAction(repeatAnimateAlertAction);
                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );

        getDefendAction.setTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].runAction(getDefendAction);

        var defendEffect = new cc.Sprite();
        defendEffect.initWithSpriteFrameName(DEFEND_EFFECT_SPRITE_FRAME_NAME);

        defendEffect.setPosition(
            this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().x,
            this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().y
            +this.m_view.m_fighterSprites[fighterId].getContentSize().height/2+FIGHTER_DEFEND_EFFECT_OFFSET_Y_TO_FIGHTER_CENTER_HEIGHT);

        //defendEffect.setAnchorPoint(0.5,0.0);
        defendEffect.setScale(g_fighterDefendEffectScaleSmallDuration);
        defendEffect.setOpacity(g_fighterDefendEffectMaxOpacity);

        this.m_view.m_fighterSprites[fighterId].addChild(defendEffect,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

        defendEffect.runAction(cc.sequence(
            cc.callFunc(
                function(){
                    this.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(g_fighterDefendEffectScaleBigDuration,g_fighterDefendEffectBigScale),
                            cc.scaleTo(g_fighterDefendEffectScaleSmallDuration,g_fighterDefendEffectSmallScale)
                        )
                    ));
                    this.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.fadeTo(g_fighterDefendEffectScaleBigDuration,g_fighterDefendEffectMinOpacity),
                            cc.fadeTo(g_fighterDefendEffectScaleSmallDuration,g_fighterDefendEffectMaxOpacity)
                        )
                    ));
                }.bind(defendEffect)
            ),
            cc.delayTime(g_defendBuffDurationPerDegree*degree),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(defendEffect)
            )
        ));

        this.addBuffOrDebuffMarkSprite(fighterId,DEFEND_BUFF_MARK_SPRITE_NODE_NAME,degree);

    },
    //model逻辑处理战斗者受伤时的回调函数
    fighterGetHurtCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var hurtValue = eventData.hurtValue;
        var fighterSpeed = eventData.fighterSpeed;
        var isFighterFrozen = eventData.isFighterFrozen;
        
        this.m_view.m_fighterHpBarFillSprites[fighterId].setScaleX(
            this.m_fightModel.m_fightersVars[fighterId].hp/this.m_fightModel.m_fightersVars[fighterId].maxHp
        );

        // this.m_view.m_fighterSprites[fighterId].stopAllActions();
        // this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5,0.0);
        // this.m_view.m_fighterSprites[fighterId].setOpacity(255);


        // this.m_view.m_fighterSprites[fighterId].runAction(
        //     cc.animate(cc.animationCache.getAnimation(FIGHTER_1_HURT_ANIMATION_NAME))
        // );


        //var oldPosition = this.m_view.m_fighterSprites[fighterId].getPosition();
        if(isFighterFrozen == false){
            cc.log("hurt action!");
            //this.resetFighterSprite(fighterId);
            //this.m_view.m_fighterSprites[fighterId].stopAllActions();
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
            var heldArrow = this.m_view.m_fighterSprites[fighterId].getChildByName("arrow");
            if(heldArrow != null){
                heldArrow.removeFromParent();
            }
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
            //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
            //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
            this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

            this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
            this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

            var getHurtAction = cc.sequence(
                cc.callFunc(
                    function(){
                        this.setSpriteFrame(FIGHTER_1_HURT_SPRITE_FRAME_NAME);
                        // var repeatAnimateHurtAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_HURT_ANIMATION_NAME)));
                        // repeatAnimateHurtAction.setTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);
                        // this.runAction(
                        //     repeatAnimateHurtAction
                        // );
                    }.bind(this.m_view.m_fighterSprites[fighterId])
                ),
                //new cc.EaseExponentialOut(cc.moveBy(g_fighterHurtDuration/2.0,cc.p(0,FIGHTER_HURT_MOVE_UP_HEIGHT))),
                //new cc.EaseExponentialIn(cc.moveBy(g_fighterHurtDuration/2.0,cc.p(0,-FIGHTER_HURT_MOVE_UP_HEIGHT)))
                new cc.EaseOut(cc.moveBy(g_fighterHurtDuration/2.0 / fighterSpeed,cc.p(0,FIGHTER_HURT_MOVE_UP_HEIGHT)),4),
                new cc.EaseIn(cc.moveBy(g_fighterHurtDuration/2.0 / fighterSpeed,cc.p(0,-FIGHTER_HURT_MOVE_UP_HEIGHT)),4),
                cc.callFunc(
                    function(){
                        //this.stopAllActions();
                        cc.log("stop repeat alert hurt action");
                        //this.stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);
                        //this.stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);
                        //this.stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);
                        //this.stopAllActions();

                        this.setAnchorPoint(0.5, 0.0);
                        this.setOpacity(255);

                        var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                        repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                        this.runAction(repeatAnimateAlertAction);


                    }.bind(this.m_view.m_fighterSprites[fighterId])
                )
            );
            getHurtAction.setTag(GET_HURT_FIGHTER_SPRITE_ACTION_TAG);

            this.m_view.m_fighterSprites[fighterId].runAction(getHurtAction);
        }

        var valueSprite = getValueSprite(ValueSpriteType.hurt,hurtValue);
        var digitSprites = valueSprite.getChildren();
        cc.log("digitSprites length is "+digitSprites.length);
        //
        valueSprite.setPosition(
            cc.p(this.m_view.m_fighterSprites[fighterId].getPositionX()+(digitSprites.length-1)*VALUE_SPRITE_DIGIT_NUM_SPACING/2.0
                +VALUE_SPRITE_INIT_OFFSET_X_TO_FIGHTER,
                this.m_view.m_fighterSprites[fighterId].getPositionY()+VALUE_SPRITE_INIT_OFFSET_Y_TO_FIGHTER)
        );

        this.m_view.addChild(valueSprite,VALUE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        valueSprite.runAction(cc.sequence(
            cc.callFunc(
                function(){

                    for(var i=0;i<digitSprites.length;i++){
                        digitSprites[i].runAction(cc.fadeOut(g_valueSpriteFadeOutDuration));
                    }
                }.bind(valueSprite)
            ),

            cc.moveBy(g_valueSpriteMoveUpDuration,cc.p(0,VALUE_SPRITE_MOVE_UP_DISTANCE)),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(valueSprite)
            )
        ));
    },
    //model逻辑处理角色恢复生命值时调用的回调函数
    fighterHealCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var healValue = eventData.healValue;
        var fighterSpeed = eventData.fighterSpeed;

        //调整血条长度
        this.m_view.m_fighterHpBarFillSprites[fighterId].setScaleX(
            this.m_fightModel.m_fightersVars[fighterId].hp/this.m_fightModel.m_fightersVars[fighterId].maxHp
        );

        //this.resetFighterSprite(fighterId);
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();

        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
        this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

        var healAnimation = cc.animationCache.getAnimation(FIGHTER_1_HEAL_ANIMATION_NAME);
        healAnimation.setDelayPerUnit(g_fighterHealDuration/healAnimation.getFrames().length / fighterSpeed);

        var healAction = cc.sequence(
            cc.animate(healAnimation),
            cc.callFunc(
                function(){
                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

                    this.runAction(repeatAnimateAlertAction);
                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );

        healAction.setTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].runAction(healAction);

        var healEffect = new cc.Sprite();

        healEffect.setAnchorPoint(0.5,0.0);
        healEffect.setPosition(this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().x
            +FIGHTER_HEAL_EFFECT_OFFSET_X_TO_FIGHTER,
            this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().y
            +FIGHTER_HEAL_EFFECT_OFFSET_Y_TO_FIGHTER);

        //this.addChild(healEffect,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);
        this.m_view.m_fighterSprites[fighterId].addChild(healEffect,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

        healEffect.runAction(cc.sequence(
            cc.delayTime(g_fighterHealDuration/3.0 /fighterSpeed),
            cc.callFunc(
                function(){
                    cc.audioEngine.playEffect(res.heal_wav);
                }.bind(this)
            ),
            cc.animate(cc.animationCache.getAnimation(HEAL_EFFECT_ANIMATION_NAME)),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(healEffect)
            )
        ));


        var valueSprite = getValueSprite(ValueSpriteType.heal,healValue);
        var digitSprites = valueSprite.getChildren();
       
        valueSprite.setPosition(
            cc.p(this.m_view.m_fighterSprites[fighterId].getPositionX()+(digitSprites.length-1)*VALUE_SPRITE_DIGIT_NUM_SPACING/2.0
                +VALUE_SPRITE_INIT_OFFSET_X_TO_FIGHTER,
                this.m_view.m_fighterSprites[fighterId].getPositionY()+VALUE_SPRITE_INIT_OFFSET_Y_TO_FIGHTER)
        );
        valueSprite.setVisible(false);
        this.m_view.addChild(valueSprite,VALUE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        valueSprite.runAction(cc.sequence(
            cc.delayTime(g_fighterHealDuration/2.0 / fighterSpeed),
            cc.callFunc(
                function(){
                    this.setVisible(true);
                    for(var i=0;i<digitSprites.length;i++){
                        digitSprites[i].runAction(cc.fadeOut(g_valueSpriteFadeOutDuration));
                    }
                }.bind(valueSprite)
            ),

            cc.moveBy(g_valueSpriteMoveUpDuration,cc.p(0,VALUE_SPRITE_MOVE_UP_DISTANCE)),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(valueSprite)
            )
        ));

    },
    //model逻辑处理角色提速时调用的回调函数
    fighterSpeedUpCallBack:function(event) {
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var fighterSpeed = eventData.fighterSpeed;
        var degree = eventData.degree;
        
        //根据战斗者的速度调整三消游戏的速度
        if(fighterId==0){
            this.m_eliminateModel.m_gameSpeed = FIGHTER_SPEED_UP_SPEED;
        }
        
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();

        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
        this.m_view.m_fighterSprites[fighterId].setOpacity(255);
        //this.resetFighterSprite(fighterId);

        var fighterSpeedUpAnimation = cc.animationCache.getAnimation(FIGHTER_1_HEAL_ANIMATION_NAME);
        fighterSpeedUpAnimation.setDelayPerUnit(g_fighterSpeedUpDuration/fighterSpeedUpAnimation.getFrames().length
        /fighterSpeed);

        var speedUpAction = cc.sequence(
            cc.animate(fighterSpeedUpAnimation),
            cc.callFunc(
                function () {
                    //this.stopAllActions();

                    this.setAnchorPoint(0.5, 0.0);
                    this.setOpacity(255);

                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)))
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

                    this.runAction(repeatAnimateAlertAction);
                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );

        speedUpAction.setTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].runAction(speedUpAction);

        var speedUpEffect = new cc.Sprite();

        speedUpEffect.setAnchorPoint(0.5,0.0);
        speedUpEffect.setPosition(this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().x
            +FIGHTER_SPEED_UP_EFFECT_OFFSET_X_TO_FIGHTER,
            this.m_view.m_fighterSprites[fighterId].getAnchorPointInPoints().y
            +FIGHTER_SPEED_UP_EFFECT_OFFSET_Y_TO_FIGHTER);

        this.m_view.m_fighterSprites[fighterId].addChild(speedUpEffect,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

        speedUpEffect.runAction(cc.sequence(
            cc.delayTime(g_fighterHealDuration/3.0/fighterSpeed),
            cc.animate(cc.animationCache.getAnimation(SPEED_UP_EFFECT_ANIMATION_NAME)),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(speedUpEffect)
            )
        ));

        this.addBuffOrDebuffMarkSprite(fighterId,SPEED_UP_BUFF_MARK_SPRITE_NODE_NAME,degree);
    },
    fighterSpeedUpBuffEndCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        if(fighterId==0){
            this.m_eliminateModel.m_gameSpeed = FIGHTER_INIT_SPEED;
        }
    },
    fighterFreezeCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var targetFighterId = eventData.targetFighterId;
        var fighterSpeed = eventData.fighterSpeed;

        //this.resetFighterSprite(fighterId);
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();

        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HURT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
        this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

        var fighterFreezeAnimation = cc.animationCache.getAnimation(FIGHTER_1_HEAL_ANIMATION_NAME);
        fighterFreezeAnimation.setDelayPerUnit(g_fighterFreezeDuration/fighterFreezeAnimation.getFrames().length
        /fighterSpeed);

        var freezeAction = cc.sequence(
            cc.animate(fighterFreezeAnimation),
            cc.callFunc(
                function () {
                    //this.stopAllActions();
                    //this.stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);

                    this.setAnchorPoint(0.5, 0.0);
                    this.setOpacity(255);

                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);

                    this.runAction(repeatAnimateAlertAction);
                    //this.runAction(repeatAnimateAlertAction);
                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );

        freezeAction.setTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].runAction(freezeAction);

        var freezeEffect = new cc.Sprite();
        freezeEffect.initWithSpriteFrameName(FREEZE_EFFECT_SPRITE_FRAME_NAME);
        freezeEffect.setAnchorPoint(0.5,0.0);

        var freezeEffectDestPosition;
        if(this.m_view.m_fighterSprites[fighterId].isFlippedX()==true){

            freezeEffect.setFlippedX(true);
            freezeEffect.setPosition(
                // this.m_view.m_fighterSprites[targetFighterId].getPositionX()-FIGHTER_FREEZE_EFFECT_INIT_OFFSET_X_TO_FIGHTER,
                // this.m_view.m_fighterSprites[targetFighterId].getPositionY()+FIGHTER_FREEZE_EFFECT_INIT_OFFSET_Y_TO_FIGHTER);
                COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X-FIGHTER_FREEZE_EFFECT_INIT_OFFSET_X_TO_FIGHTER,
                COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y+FIGHTER_FREEZE_EFFECT_INIT_OFFSET_Y_TO_FIGHTER);
            freezeEffectDestPosition = cc.p(COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X,COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y);
        }else{

            freezeEffect.setPosition(
                PLAYER_FIGHTER_SPRITE_INIT_POSITION_X+FIGHTER_FREEZE_EFFECT_INIT_OFFSET_X_TO_FIGHTER,
                PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y+FIGHTER_FREEZE_EFFECT_INIT_OFFSET_Y_TO_FIGHTER);
            freezeEffectDestPosition = cc.p(PLAYER_FIGHTER_SPRITE_INIT_POSITION_X,PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y);
        }
        freezeEffect.setVisible(false);
        this.m_view.addChild(freezeEffect,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

        freezeEffect.runAction(cc.sequence(
            cc.delayTime(g_fighterFreezeDuration/3.0/fighterSpeed),
            cc.callFunc(
                function(){
                    this.setVisible(true);
                }.bind(freezeEffect)
            ),
            cc.delayTime(g_fighterFreezeDuration/3.0/fighterSpeed),
            //cc.moveTo(g_moveFreezeIceDuration,this.m_view.m_fighterSprites[targetFighterId].getPosition()),
            cc.moveTo(g_moveFreezeIceDuration,freezeEffectDestPosition),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(freezeEffect)
            )
        ));
    },
    fighterGetFrozenCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;
        var degree = eventData.degree;
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();

        this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_HURT_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);

        var returnPos;
        if(fighterId == 0){
            returnPos = cc.p(PLAYER_FIGHTER_SPRITE_INIT_POSITION_X,PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y);
        }else{
            returnPos = cc.p(COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X,COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y);
        }

        var getFrozenAction = cc.sequence(
            cc.delayTime(g_frozenDebuffDurationPerDegree * degree),
            cc.callFunc(
                function(){
                    //this.stopAllActions();

                    cc.log("retore from frozen!");
                    this.setAnchorPoint(0.5, 0.0);
                    this.setOpacity(255);

                    this.setPosition(returnPos);

                    var heldArrow = this.getChildByName("arrow");
                    if(heldArrow!=null){
                        heldArrow.removeFromParent();
                    }

                    var repeatAnimateAlertAction = cc.repeatForever(cc.animate(cc.animationCache.getAnimation(FIGHTER_1_ALERT_ANIMATION_NAME)));
                    repeatAnimateAlertAction.setTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    this.runAction(repeatAnimateAlertAction);

                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );
        getFrozenAction.setTag(GET_FROZEN_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].runAction(getFrozenAction);

        var frozenEffect1 = new cc.Sprite();
        frozenEffect1.initWithSpriteFrameName(FROZEN_EFFECT_SPRITE_FRAME_NAME);
        frozenEffect1.setAnchorPoint(0.5,0.0);

        frozenEffect1.setPosition(
            this.m_view.m_fighterSprites[fighterId].getPositionX()
            +FIGHTER_FROZEN_EFFECT_INIT_OFFSET_X_TO_FIGHTER,
            this.m_view.m_fighterSprites[fighterId].getPositionY()
            +FIGHTER_FROZEN_EFFECT_INIT_OFFSET_Y_TO_FIGHTER);

        this.addChild(frozenEffect1,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

        frozenEffect1.runAction(cc.sequence(
            cc.delayTime(g_frozenDebuffDurationPerDegree*degree),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(frozenEffect1)
            )
        ));

        if(fighterId==0){
            var frozenEffect2 = new cc.Sprite();
            frozenEffect2.initWithSpriteFrameName(FROZEN_EFFECT_SPRITE_FRAME_NAME);
            frozenEffect2.setScale(FROZEN_EFFECT_2_SPRITE_SCALE);
            frozenEffect2.setPosition(cc.winSize.width/2,
                ((cc.winSize.height-this.m_eliminateModel.m_patternMatrixTopSpacing)
                +this.m_eliminateModel.m_patternMatrixBottomSpacing)/2);
            this.m_view.addChild(frozenEffect2,FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER);

            frozenEffect2.runAction(cc.sequence(
                cc.delayTime(g_frozenDebuffDurationPerDegree*degree),
                cc.callFunc(
                    function(){
                        this.removeFromParent(true);
                    }.bind(frozenEffect2)
                )
            ));
        }

        this.addBuffOrDebuffMarkSprite(fighterId,FROZEN_DEBUFF_MARK_SPRITE_NODE_NAME,degree);
    },
    addBuffOrDebuffMarkSprite:function(fighterId,buffOrDebuffNodeName,degree){
        var oldBuffAndDebuffNum = this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId].length;
        var i=0;
        for(;i<oldBuffAndDebuffNum;i++){
            if(this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][i].getName() == buffOrDebuffNodeName){

                var existBuffSprite = this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][i];
                for(var j=i;j<oldBuffAndDebuffNum-1;j++){
                    this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][j]=this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][j+1];
                }
                this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][oldBuffAndDebuffNum-1]=existBuffSprite;

                existBuffSprite.stopAllActions();
                var effectDuration;
                switch(buffOrDebuffNodeName){
                    case DEFEND_BUFF_MARK_SPRITE_NODE_NAME:
                        effectDuration =  g_defendBuffDurationPerDegree*degree;
                        break;
                    case SPEED_UP_BUFF_MARK_SPRITE_NODE_NAME:
                        effectDuration = g_speedUpBuffDurationPerDegree*degree;
                        break;
                    case FROZEN_DEBUFF_MARK_SPRITE_NODE_NAME:
                        effectDuration = g_frozenDebuffDurationPerDegree*degree;
                        break;
                }
                existBuffSprite.runAction(cc.sequence(
                    cc.delayTime(effectDuration),
                    cc.callFunc(
                        function(){
                            this.removeBuffOrDebuffMarkSprite(fighterId,buffOrDebuffNodeName);
                        }.bind(this)
                    )
                ));

                for(var j=i;j<oldBuffAndDebuffNum;j++){
                    this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][j].setPosition(
                        this.m_view.m_fighterSprites[fighterId].getPositionX()
                        +FIRST_BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_X_TO_FIGHTER
                        +j*BUFF_AND_DEBUFF_SPRITES_SPACING,
                        this.m_view.m_fighterSprites[fighterId].getPositionY()
                        +BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_Y_TO_FIGHTER);
                }
                break;
            }
        }

        if(i==oldBuffAndDebuffNum){
            //添加新buff
            cc.log("add new buff sprite");
            var newBuffSprite =  new cc.Sprite();
            var newBuffSpriteFrameName;
            switch(buffOrDebuffNodeName){
                case DEFEND_BUFF_MARK_SPRITE_NODE_NAME:
                    newBuffSpriteFrameName = PATTERN_DEFEND_SPRITE_FRAME_NAME;
                    break;
                case SPEED_UP_BUFF_MARK_SPRITE_NODE_NAME:
                    newBuffSpriteFrameName = PATTERN_SPEED_UP_SPRITE_FRAME_NAME;
                    break;
                case FROZEN_DEBUFF_MARK_SPRITE_NODE_NAME:
                    newBuffSpriteFrameName = PATTERN_FREEZE_SPRITE_FRAME_NAME;
                    break;
            }
            newBuffSprite.initWithSpriteFrameName(newBuffSpriteFrameName);

            newBuffSprite.setName(buffOrDebuffNodeName);

            newBuffSprite.setPosition(
                this.m_view.m_fighterSprites[fighterId].getPositionX()
                +FIRST_BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_X_TO_FIGHTER
                +i*BUFF_AND_DEBUFF_SPRITES_SPACING,
                this.m_view.m_fighterSprites[fighterId].getPositionY()
                +BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_Y_TO_FIGHTER);
            this.m_view.addChild(newBuffSprite,BUFF_AND_DEBUFF_SPRITE_GAME_SCENE_VIEW_Z_ORDER);
            this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId].push(newBuffSprite);

            var effectDuration;
            switch(buffOrDebuffNodeName){
                case DEFEND_BUFF_MARK_SPRITE_NODE_NAME:
                    effectDuration =  g_defendBuffDurationPerDegree*degree;
                    break;
                case SPEED_UP_BUFF_MARK_SPRITE_NODE_NAME:
                    effectDuration = g_speedUpBuffDurationPerDegree*degree;
                    break;
                case FROZEN_DEBUFF_MARK_SPRITE_NODE_NAME:
                    effectDuration = g_frozenDebuffDurationPerDegree*degree;
                    break;
            }
            newBuffSprite.runAction(cc.sequence(
                cc.delayTime(effectDuration),
                cc.callFunc(
                    function(){
                        this.removeBuffOrDebuffMarkSprite(fighterId,buffOrDebuffNodeName);
                    }.bind(this)
                )
            ));
        }
    },
    removeBuffOrDebuffMarkSprite:function(fighterId,buffOrDebuffNodeName){
        var oldBuffAndDebuffNum = this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId].length;

        for(var i = 0;i<oldBuffAndDebuffNum;i++){
            if(this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][i].getName() == buffOrDebuffNodeName){
                this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][i].removeFromParent(true);
                
                this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId].splice(i,1);

                for(var j=i;j<oldBuffAndDebuffNum-1;j++){
                    this.m_view.m_fighterBuffAndDebuffMarkSprites[fighterId][j].setPosition(
                        this.m_view.m_fighterSprites[fighterId].getPositionX()
                        +FIRST_BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_X_TO_FIGHTER
                        +j*BUFF_AND_DEBUFF_SPRITES_SPACING,
                        this.m_view.m_fighterSprites[fighterId].getPositionY()
                        +BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_Y_TO_FIGHTER);
                }
                break;
            }
        }
    },
    fighterGoDieCallBack:function(event){
        var eventData = event.getUserData();
        var fighterId = eventData.fighterId;

        //this.resetFighterSprite(fighterId);
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();
        //this.m_view.m_fighterSprites[fighterId].stopAllActions();
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_HURT_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GET_FROZEN_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
        this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
        //this.m_view.m_fighterSprites[fighterId].stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
        this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);

        var dyingAnimation = cc.animationCache.getAnimation(FIGHTER_1_DYING_ANIMATION_NAME);
        dyingAnimation.setDelayPerUnit(g_fighterDyingDuration/dyingAnimation.getFrames().length);

        var goDieAction = cc.sequence(
            cc.animate(dyingAnimation),
            cc.callFunc(
                function(){
                    this.stopActionByTag(SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(GET_HURT_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(HEAL_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(SPEED_UP_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(FREEZE_FIGHTER_SPRITE_ACTION_TAG);

                    this.stopActionByTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(GET_FROZEN_FIGHTER_SPRITE_ACTION_TAG);
                    this.stopActionByTag(REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG);
                    //this.stopActionByTag(REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG);

                    this.setSpriteFrame(FIGHTER_1_DEAD_SPRITE_FRAME_NAME);
                    //var deadAction = cc.repeatForever(cc.animate( cc.animationCache.getAnimation(FIGHTER_1_DEAD_ANIMATION_NAME)));
                    //deadAction.setTag(DEAD_FIGHTER_SPRITE_ACTION_TAG);
                    //this.runAction(deadAction);
                    
                }.bind(this.m_view.m_fighterSprites[fighterId])
            )
        );

        goDieAction.setTag(GO_DIE_FIGHTER_SPRITE_ACTION_TAG);

        this.m_view.m_fighterSprites[fighterId].runAction(goDieAction);

    },
    // resetFighterSprite:function(fighterId){
    //     this.m_view.m_fighterSprites[fighterId].stopAllActions();
    //     this.m_view.m_fighterSprites[fighterId].setAnchorPoint(0.5, 0.0);
    //     this.m_view.m_fighterSprites[fighterId].setOpacity(255.0);
    // },
    fightGameOverCallBack:function(event) {
        cc.log("game scene game over!");
        cc.audioEngine.stopMusic();
        this.m_gameState = GameState.gameOver;
        var eventData = event.getUserData();
        var isWin = eventData.isWin;

        var endTitleSprite = new cc.Sprite();
        if(isWin){
            endTitleSprite.initWithSpriteFrameName(WIN_TITLE_SPRITE_FRAME_NAME);

            cc.audioEngine.playEffect(res.win_wav);
        }else{
            endTitleSprite.initWithSpriteFrameName(LOSE_TITLE_SPRITE_FRAME_NAME);
            cc.audioEngine.playEffect(res.lose_wav);

        }
        endTitleSprite.setPosition(cc.winSize.width/2,
        cc.winSize.height/2);
        endTitleSprite.setOpacity(0);
        this.m_view.addChild(endTitleSprite,END_TITLE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);
        endTitleSprite.runAction(cc.sequence(
            cc.callFunc(
                function(){
                    this.runAction(cc.fadeIn(g_endTitleFadeInDuration));
                }.bind(endTitleSprite)
            ),
            cc.moveTo(g_endTitleFadeInDuration,cc.p(cc.winSize.width/2,cc.winSize.height/4.0*3)),
            cc.callFunc(
                function(){
                    var restartBtn = new cc.MenuItemImage(
                        cc.spriteFrameCache.getSpriteFrame(RESTART_BTN_1_SPRITE_FRAME_NAME),
                        cc.spriteFrameCache.getSpriteFrame(RESTART_BTN_2_SPRITE_FRAME_NAME),
                        function(){
                            cc.audioEngine.playMusic(res.button_wav);
                            var sceneTransition = new cc.TransitionFade(g_sceneTransitionDuration,new GameScene());
                            cc.director.runScene(sceneTransition);
                            
                        }
                    );
                    restartBtn.setScale(END_MENU_ITEM_SCALE);
                    restartBtn.setPosition(cc.winSize.width/2,
                        cc.winSize.height/2);

                    var returnBtn = new cc.MenuItemImage(
                        cc.spriteFrameCache.getSpriteFrame(RETURN_BTN_1_SPRITE_FRAME_NAME),
                        cc.spriteFrameCache.getSpriteFrame(RETURN_BTN_2_SPRITE_FRAME_NAME),
                        function(){

                            cc.audioEngine.playMusic(res.button_wav);
                            var sceneTransition = new cc.TransitionFade(g_sceneTransitionDuration,new StartScene());
                            cc.director.runScene(sceneTransition);

                        }
                    );
                    returnBtn.setScale(END_MENU_ITEM_SCALE);
                    returnBtn.setPosition(cc.winSize.width/2,
                        cc.winSize.height/2-restartBtn.getContentSize().height-END_MENU_ITEM_VERTICLE_SPACING);

                    var endMenu = new cc.Menu(restartBtn,returnBtn);
                    endMenu.setPosition(0,0);
                    this.m_view.addChild(endMenu,END_MENU_GAME_SCENE_VIEW_Z_ORDER);


                }.bind(this)
            )
        ));

    }

});