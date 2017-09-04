/*
    游戏场景MVC中对战部分的model类
    即存储与管理游戏场景中对战部分的数据信息与逻辑算法的类

    其通过事件回调的方式向GameSceneController传递信息
    而其不能直接获取GameSceneController 与 GameSceneView的信息
*/
var GameSceneFightModel = cc.Node.extend({
    m_fightGameState:FightGameState.uninitFight,

    m_counter:0,           //model的帧计数器

    m_fightersVars:null,   //战斗者信息字典的数组,每个战斗者的信息用一个字典记录
                           //编号为0的战斗者为玩家
    
    ctor:function () {
        this._super();

        this.m_fightersVars=[];
        for(var i=0;i<g_fighterNum;i++){
            this.m_fightersVars[i] = {
                state:FighterState.stop,
                type:0,
                level:0,
                maxHp:0,
                hp:0,
                atk:0,
                def:0,

                outOfPlace:false,  //角色是否在战斗位置,当角色采用剑攻击时,会暂离战斗位置,此时对手无论采取何种手段都攻击不到角色
                speed:1.0,
                buffState:{        //buff状态(有利增益效果)信息
                    defend:false,
                    speedUp:false
                },
                debuffState:{      //debuff状态(不利损益效果)信息
                    frozen:false
                },
                aiDelay:false
            };
        }

    },
    update:function(dt) {
        this.m_counter+=1;
        switch(this.m_fightGameState){
            case FightGameState.uninitFight:
                this.m_fightGameState = FightGameState.initFight;
                this.initFight();
                break;
            case FightGameState.initFight:
                break;
            case FightGameState.inTheFight:
                this.fighterAI(1);
                for(var id=0;id<g_fighterNum;id++){
                    if(this.m_fightersVars[id].hp <= 0){
                        this.m_fightersVars[id].hp=0;
                        this.fighterGoDie(id);
                    }
                }

                break;
        }
    },

    initFight:function(){

        for(var i=0;i<g_fighterNum;i++){
            this.m_fightersVars[i].state = FighterState.alert;
            this.m_fightersVars[i].type = 1;
            this.m_fightersVars[i].level = 1;
            this.m_fightersVars[i].maxHp = g_fightersMaxHp[i];
            this.m_fightersVars[i].hp = this.m_fightersVars[i].maxHp;
            this.m_fightersVars[i].atk = g_fightersAtk[i];
            this.m_fightersVars[i].def = g_fightersDef[i];
            this.m_fightersVars[i].outOfPlace = false;
            this.m_fightersVars[i].speed = 1.0;
            this.m_fightersVars[i].buffState.defend=false;
            this.m_fightersVars[i].buffState.speedUp=false;
            this.m_fightersVars[i].debuffState.frozen=false;
            
        }

        var event = new cc.EventCustom(NOTIFICATION_INIT_FIGHT);
        var eventData = {fightersVars:this.m_fightersVars};
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);

        this.runAction(cc.sequence(
           cc.delayTime(g_initFightCallBackDuration),
            cc.callFunc(
                function(){
                    this.m_fightGameState = FightGameState.inTheFight;
                }.bind(this)
            )
        ));

    },
    //使某战斗者进行攻击行为的函数
    fighterAttack:function(fighterId,attackType,degree){
        

        var fighterSpeed = this.m_fightersVars[fighterId].speed;
        var targetFighterId=0;
        if(fighterId==0){
            targetFighterId = 1;
        }else{
            targetFighterId = 0;
        }

        switch (attackType){
            case FighterAttackType.swordAttack:
                this.m_fightersVars[fighterId].state = FighterState.swordAttack;

                var swordAttackAction = cc.sequence(
                    cc.delayTime(g_fighterFadeOutDuration / fighterSpeed),
                    cc.callFunc(
                        function(){
                            this.m_fightersVars[fighterId].outOfPlace = true;
                        }.bind(this)
                    ),
                    cc.delayTime(g_swordAttackDuration*2.0/3.0 / fighterSpeed),
                    cc.callFunc(
                        function(){
                            if(this.m_fightersVars[targetFighterId].outOfPlace != true
                                && this.m_fightersVars[targetFighterId].state != FighterState.dying
                                && this.m_fightersVars[targetFighterId].state != FighterState.dead
                                //&& this.m_fightersVars[targetFighterId].buffState.defend != true
                            ){
                                cc.audioEngine.playEffect(res.swordAttack_wav);
                                
                                var hurtValue = Math.max(0,this.m_fightersVars[fighterId].atk*degree - this.m_fightersVars[targetFighterId].def);
                                this.fighterGetHurt(targetFighterId,hurtValue);
                            }
                        }.bind(this)
                    ),
                    cc.delayTime((g_swordAttackDuration/3.0+g_fighterFadeOutDuration+g_fighterFadeInDuration)/fighterSpeed),
                    cc.callFunc(
                        function(){

                            if(this.m_fightersVars[fighterId].state == FighterState.swordAttack){
                                this.m_fightersVars[fighterId].outOfPlace = false;
                                this.m_fightersVars[fighterId].state = FighterState.alert;
                            }
                        }.bind(this)
                    )
                );

                swordAttackAction.setTag(fighterId+SWORD_ATTACK_MODEL_ACTION_TAG);
                this.runAction(swordAttackAction);

                break;
            case FighterAttackType.arrowAttack:
                this.m_fightersVars[fighterId].state = FighterState.arrowAttack;

                var arrowAttackAction1 = cc.sequence(
                    cc.delayTime(g_arrowAttackDuration/3.0*2 / fighterSpeed),
                    cc.callFunc(
                        function(){
                            var arrowAttackAction2 = cc.sequence(
                                cc.delayTime(g_arrowFlyDuration),
                                cc.callFunc(
                                    function(){
                                        if(this.m_fightersVars[targetFighterId].outOfPlace != true
                                            && this.m_fightersVars[targetFighterId].buffState.defend != true
                                            && this.m_fightersVars[targetFighterId].state != FighterState.dying
                                            && this.m_fightersVars[targetFighterId].state != FighterState.dead){

                                            cc.audioEngine.playEffect(res.arrowAttack_wav);

                                            var hurtValue = Math.max(0,(this.m_fightersVars[fighterId].atk + g_arrowAtkPerDegree)*degree - this.m_fightersVars[targetFighterId].def);
                                            this.fighterGetHurt(targetFighterId,hurtValue);
                                        }
                                    }.bind(this)
                                )
                            );
                            arrowAttackAction2.setTag(fighterId+ARROW_ATTACK_MODEL_ACTION_2_TAG);
                            this.runAction(arrowAttackAction2);
                        }.bind(this)
                    ),
                    cc.delayTime(g_arrowAttackDuration/3.0/ fighterSpeed),
                    cc.callFunc(
                        function(){
                            if(this.m_fightersVars[fighterId].state == FighterState.arrowAttack){
                                this.m_fightersVars[fighterId].state = FighterState.alert;
                            }
                        }.bind(this)
                    )
                );
                arrowAttackAction1.setTag(fighterId+ARROW_ATTACK_MODEL_ACTION_1_TAG);
                this.runAction(arrowAttackAction1);

                break;
        }

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_ATTACK);
        event.setUserData({fighterId:fighterId,
            attackType:attackType,
            targetFighterId:targetFighterId,
        fighterSpeed:fighterSpeed});
        cc.eventManager.dispatchEvent(event);
        

    },
    //使某战斗者增加防御buff状态的函数
    fighterGetDefend:function(fighterId,degree){

        var fighterSpeed = this.m_fightersVars[fighterId].speed;
        
        this.m_fightersVars[fighterId].state = FighterState.getDefend;

        cc.audioEngine.playEffect(res.getDefend_wav);

        //使战斗者防御buff状态属性为true
        this.m_fightersVars[fighterId].buffState.defend = true;


        //监控战斗者动作变化的action
        var getDefendAction1 = cc.sequence(
            cc.delayTime(g_fighterGetDefendDuration/fighterSpeed),
            cc.callFunc(
                function(){
                    if(this.m_fightersVars[fighterId].state == FighterState.getDefend){
                        this.m_fightersVars[fighterId].state = FighterState.alert;
                    }
                }.bind(this)
            )
        );
        getDefendAction1.setTag(fighterId+GET_DEFEND_MODEL_ACTION_1_TAG);

        this.runAction(getDefendAction1);

        this.stopActionByTag(fighterId+GET_DEFEND_MODEL_ACTION_2_TAG);

        //监控防御buff时效的action
        var getDefendAction2 = cc.sequence(
            cc.delayTime(g_defendBuffDurationPerDegree*degree),
            cc.callFunc(
                function(){
                    this.m_fightersVars[fighterId].buffState.defend = false;
                }.bind(this)
            )
        );
        getDefendAction2.setTag(fighterId+GET_DEFEND_MODEL_ACTION_2_TAG);

        this.runAction(getDefendAction2);

        //发送战斗者增加防御buff的消息给controller
        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_GET_DEFEND);
        event.setUserData({fighterId:fighterId,fighterSpeed:fighterSpeed,degree:degree});
        cc.eventManager.dispatchEvent(event);
    },
    //处理战斗者受到伤害的函数
    fighterGetHurt:function(fighterId,hurtValue){

        var fighterSpeed = this.m_fightersVars[fighterId].speed;

        this.m_fightersVars[fighterId].hp = Math.max(0,this.m_fightersVars[fighterId].hp-hurtValue);

        var isFighterFrozen = this.m_fightersVars[fighterId].debuffState.frozen;

        if(isFighterFrozen != true){
            this.m_fightersVars[fighterId].state = FighterState.getHurt;

            this.stopActionByTag(fighterId+SWORD_ATTACK_MODEL_ACTION_TAG);
            this.stopActionByTag(fighterId+ARROW_ATTACK_MODEL_ACTION_1_TAG);
            this.stopActionByTag(fighterId+GET_DEFEND_MODEL_ACTION_1_TAG);
            this.stopActionByTag(fighterId+HEAL_MODEL_ACTION_TAG);
            this.stopActionByTag(fighterId+SPEED_UP_MODEL_ACTION_1_TAG);
            this.stopActionByTag(fighterId+FREEZE_MODEL_ACTION_1_TAG);
            this.stopActionByTag(fighterId+GET_HURT_MODEL_ACTION_TAG);

            var getHurtAction = cc.sequence(
                cc.delayTime(g_fighterHurtDuration*2 / fighterSpeed),
                cc.callFunc(
                    function(){
                        if(this.m_fightersVars[fighterId].state == FighterState.getHurt){
                            this.m_fightersVars[fighterId].state = FighterState.alert;
                        }
                    }.bind(this)
                )
            );

            getHurtAction.setTag(fighterId+GET_HURT_MODEL_ACTION_TAG);

            this.runAction(getHurtAction);
        }
        
        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_GET_HURT);
        event.setUserData({
            fighterId:fighterId,
            hurtValue:hurtValue,
            fighterSpeed:fighterSpeed,
            isFighterFrozen:isFighterFrozen});
        cc.eventManager.dispatchEvent(event);
    },
    //使战斗者恢复生命值的函数
    fighterHeal:function(fighterId,degree){
        this.m_fightersVars[fighterId].state = FighterState.heal;
        var fighterSpeed = this.m_fightersVars[fighterId].speed;

        var healValue = g_healValuePerDegree*degree;

        this.m_fightersVars[fighterId].hp = Math.min(this.m_fightersVars[fighterId].maxHp,
            this.m_fightersVars[fighterId].hp+healValue);

        var healAction = cc.sequence(
            cc.delayTime(g_fighterHealDuration / fighterSpeed),
            cc.callFunc(
                function(){
                    if(this.m_fightersVars[fighterId].state == FighterState.heal){
                        this.m_fightersVars[fighterId].state = FighterState.alert;
                    }
                }.bind(this)
            )
        );

        healAction.setTag(fighterId+HEAL_MODEL_ACTION_TAG);
        this.runAction(healAction);

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_HEAL);
        event.setUserData({fighterId:fighterId,healValue:healValue,fighterSpeed:fighterSpeed});
        cc.eventManager.dispatchEvent(event);
    },
    //使战斗者增加加速buff的函数
    fighterSpeedUp:function(fighterId,degree){
        var fighterSpeed = this.m_fightersVars[fighterId].speed;
        this.m_fightersVars[fighterId].state = FighterState.speedUp;
        this.m_fightersVars[fighterId].buffState.speedUp = true;
        this.m_fightersVars[fighterId].speed = FIGHTER_SPEED_UP_SPEED;

        cc.audioEngine.playEffect(res.speedUp_wav);

        var speedUpAction1 = cc.sequence(
            cc.delayTime(g_fighterSpeedUpDuration/fighterSpeed),
            cc.callFunc(
                function(){
                    if(this.m_fightersVars[fighterId].state == FighterState.speedUp){

                        this.m_fightersVars[fighterId].state = FighterState.alert;
                    }
                }.bind(this)
            )
        );

        speedUpAction1.setTag(fighterId+SPEED_UP_MODEL_ACTION_1_TAG);

        this.runAction(speedUpAction1);

        this.stopActionByTag(fighterId+SPEED_UP_MODEL_ACTION_2_TAG);
        var speedUpAction2 = cc.sequence(
            cc.delayTime(g_speedUpBuffDurationPerDegree*degree),
            cc.callFunc(
                function(){
                    this.m_fightersVars[fighterId].buffState.speedUp = false;
                    this.m_fightersVars[fighterId].speed = 1.0;

                    var event = new cc.EventCustom(NOTIFICATION_FIGHTER_SPEED_UP_BUFF_END);
                    event.setUserData({fighterId:fighterId});
                    cc.eventManager.dispatchEvent(event);
                }.bind(this)
            )
        );

        speedUpAction1.setTag(fighterId+SPEED_UP_MODEL_ACTION_2_TAG);
        this.runAction(speedUpAction2);

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_SPEED_UP);
        event.setUserData({fighterId:fighterId,fighterSpeed:fighterSpeed,degree:degree});
        cc.eventManager.dispatchEvent(event);
    },
    //使战斗者向对手施加冰冻法术的函数
    fighterFreeze:function(fighterId,degree){
        var fighterSpeed = this.m_fightersVars[fighterId].speed;
        this.m_fightersVars[fighterId].state = FighterState.freeze;
        
        var targetFighterId=0;
        if(fighterId==0){
            targetFighterId = 1;
        }else{
            targetFighterId = 0;
        }


        var freezeAction1 = cc.sequence(

            cc.delayTime(g_fighterFreezeDuration/fighterSpeed),
            cc.callFunc(
                function(){
                    //cc.log("fighterFreeze action end");
                    if(this.m_fightersVars[fighterId].state == FighterState.freeze){
                        //cc.log("fighterAlert action begin");
                        this.m_fightersVars[fighterId].state = FighterState.alert;
                    }
                }.bind(this)
            )
        );

        freezeAction1.setTag(fighterId+FREEZE_MODEL_ACTION_1_TAG);
        this.runAction(freezeAction1);

        freezeAction2 = cc.sequence(
            cc.delayTime(g_fighterFreezeDuration/3.0*2/fighterSpeed+g_moveFreezeIceDuration),
            cc.callFunc(
                function(){
                    //cc.log("fighterAttack action callFunc");
                    if(this.m_fightersVars[targetFighterId].outOfPlace == false
                        && this.m_fightersVars[targetFighterId].buffState.defend != true){
                        this.fighterGetFrozen(targetFighterId,degree);

                    }
                }.bind(this)
            )
        );
        freezeAction2.setTag(fighterId+FREEZE_MODEL_ACTION_2_TAG);
        this.runAction(freezeAction2);

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_FREEZE);
        event.setUserData({fighterId:fighterId,targetFighterId:targetFighterId,fighterSpeed:fighterSpeed});
        cc.eventManager.dispatchEvent(event);
    },

    //处理战斗者被冰冻法术冻住的函数 fighterId表示被冻住战斗者的编号或id
    fighterGetFrozen:function(fighterId,degree){
        this.m_fightersVars[fighterId].debuffState.frozen = true;

        cc.audioEngine.playEffect(res.frozen_wav);

        this.stopActionByTag(fighterId+SWORD_ATTACK_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+ARROW_ATTACK_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+HEAL_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+GET_DEFEND_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+GET_HURT_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+HEAL_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+SPEED_UP_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+FREEZE_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+GET_FROZEN_MODEL_ACTION_TAG);

        var getFrozenAction = cc.sequence(
            cc.delayTime(g_frozenDebuffDurationPerDegree*degree),
            cc.callFunc(
                function(){
                    this.m_fightersVars[fighterId].state = FighterState.alert;
                    this.m_fightersVars[fighterId].debuffState.frozen = false;
                }.bind(this)
            )
        );

        getFrozenAction.setTag(fighterId+GET_FROZEN_MODEL_ACTION_TAG)
        this.runAction(getFrozenAction);

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_GET_FROZEN);
        event.setUserData({fighterId:fighterId,degree:degree});
        cc.eventManager.dispatchEvent(event);
        
    },
    //战斗者AI的处理
    fighterAI:function(fighterId){
        if( this.m_fightersVars[fighterId].aiDelay == true){
            return;
        }
        if( this.m_fightersVars[fighterId].debuffState.frozen == true){
            return;
        }
        if(this.m_fightersVars[fighterId].state != FighterState.alert){
            return;
        }

        /*
         计算可能性权重时各动作的编号
         swordAttack 0
         arrowAttack 1
         getDefend 2
         heal 3
         speedUp 4
         freeze 5
         */
        var actionWeights = [];
        for(var i=0;i<g_patternTypeNum;i++){
            actionWeights[i]=2;
        }

        if(this.m_fightersVars[fighterId].buffState.defend == true){
            actionWeights[2] = 0;
        }
        if(this.m_fightersVars[fighterId].buffState.speedUp == true){
            actionWeights[4] = 0;
            actionWeights[1] = 5;
        }
        if(this.m_fightersVars[fighterId].hp < this.m_fightersVars[fighterId].maxHp/3){
            actionWeights[3] = 4;
        }else if(this.m_fightersVars[fighterId].hp < this.m_fightersVars[fighterId].maxHp/2){
            actionWeights[3] = 2;
        }else if(this.m_fightersVars[fighterId].hp == this.m_fightersVars[fighterId].maxHp){
            actionWeights[3] = 0;
        }
        if(this.m_fightersVars[0].buffState.defend == true){
            actionWeights[1] = 0;
            actionWeights[5] = 0;
        }
        if(this.m_fightersVars[0].buffState.speedUp == true){
            if(this.m_fightersVars[0].debuffState.frozen == false){
                actionWeights[5] = 4;
            }
        }
        if(this.m_fightersVars[0].debuffState.frozen == true){
            actionWeights[5] = 0;
            actionWeights[0] = 5;
            actionWeights[1] = 5;
        }
        if(this.m_fightersVars[0].state == FighterState.arrowAttack ||
            this.m_fightersVars[0].state == FighterState.freeze){
            if(this.m_fightersVars[fighterId].buffState.defend == false){
                actionWeights[0] = 4;
                actionWeights[2] = 8;
                actionWeights[5] = 0;
            }
        }
        if(this.m_fightersVars[0].state == FighterState.swordAttack){
                actionWeights[0] = 6;
        }

        var totalWeight = 0;
        for(var i=0;i<g_patternTypeNum;i++){
            totalWeight += actionWeights[i];
        }

        var rand = getRandBetween(1,totalWeight);
        for(var i=0;i<g_patternTypeNum;i++){
            rand -= actionWeights[i];
            if(rand<=0){
                switch(i){
                    case 0:
                        this.fighterAttack(fighterId,FighterAttackType.swordAttack,3);
                        break;
                    case 1:
                        this.fighterAttack(fighterId,FighterAttackType.arrowAttack,3);
                        break;
                    case 2:
                        this.fighterGetDefend(fighterId,3);
                        break;
                    case 3:
                        this.fighterHeal(fighterId,3);
                        break;
                    case 4:
                        this.fighterSpeedUp(fighterId,3);
                        break;
                    case 5:
                        this.fighterFreeze(fighterId,3);
                        break;
                }
                break;
            }
        }


        var fighterSpeed = this.m_fightersVars[fighterId].speed;
        var delayDuration = getRandBetween(g_fighterAIAverageDelay-g_fighterAIDelayVar,g_fighterAIAverageDelay+g_fighterAIDelayVar)
            /fighterSpeed;
        //cc.log("fighterAI, next delayDuration:"+delayDuration );

        this.m_fightersVars[fighterId].aiDelay = true;
        this.stopActionByTag(AI_DELAY_MODEL_ACTION_TAG);

        var fighterAIAction = cc.sequence(
          cc.delayTime(delayDuration) ,
          cc.callFunc(
              function() {
                  this.m_fightersVars[fighterId].aiDelay = false;
              }.bind(this)
          )
        );
        fighterAIAction.setTag(AI_DELAY_MODEL_ACTION_TAG);

        this.runAction(fighterAIAction);


    },
    fighterGoDie:function(fighterId){
        this.m_fightersVars[fighterId].state = FighterState.dying;

        // var SWORD_ATTACK_MODEL_ACTION_TAG = 100;
        // var ARROW_ATTACK_MODEL_ACTION_1_TAG = 200;
        // var ARROW_ATTACK_MODEL_ACTION_2_TAG = 300;
        // var GET_DEFEND_MODEL_ACTION_1_TAG = 400;
        // var GET_DEFEND_MODEL_ACTION_2_TAG = 500;
        // var GET_HURT_MODEL_ACTION_TAG = 600;
        // var HEAL_MODEL_ACTION_TAG = 700;
        // var SPEED_UP_MODEL_ACTION_1_TAG = 800;
        // var SPEED_UP_MODEL_ACTION_2_TAG = 900;
        // var FREEZE_MODEL_ACTION_1_TAG = 1000;
        // var FREEZE_MODEL_ACTION_2_TAG = 1100;
        // var GET_FROZEN_MODEL_ACTION_TAG = 1200;
        // var AI_DELAY_MODEL_ACTION_TAG = 1300;
        // var GO_DIE_MODEL_ACTION_TAG = 1400;
        this.stopActionByTag(fighterId+SWORD_ATTACK_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+ARROW_ATTACK_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+GET_DEFEND_MODEL_ACTION_1_TAG);
        //this.stopActionByTag(fighterId+GET_DEFEND_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+GET_HURT_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+HEAL_MODEL_ACTION_TAG);
        this.stopActionByTag(fighterId+SPEED_UP_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+FREEZE_MODEL_ACTION_1_TAG);
        this.stopActionByTag(fighterId+GO_DIE_MODEL_ACTION_TAG);

        var fighterGoDieAction = cc.sequence(
            cc.delayTime(g_fighterDyingDuration) ,
            cc.callFunc(
                function() {
                    this.m_fightersVars[fighterId].state = FighterState.dead;
                }.bind(this)
            )
        );

        fighterGoDieAction.setTag(GO_DIE_MODEL_ACTION_TAG);
        
        this.runAction(fighterGoDieAction);

        var event = new cc.EventCustom(NOTIFICATION_FIGHTER_GO_DIE);
        event.setUserData({fighterId:fighterId});
        cc.eventManager.dispatchEvent(event);

        var isWin;
        if(fighterId==0){
            isWin = false;
        }else{
            isWin = true;
        }
        this.fightGameOver(isWin);
    },
    fightGameOver:function(isWin){
        this.m_fightGameState = FightGameState.gameOver;
        //cc.log("fight  game over!");

        var event = new cc.EventCustom(NOTIFICATION_FIGHT_GAME_OVER);
        event.setUserData({isWin:isWin});
        cc.eventManager.dispatchEvent(event);
    }

})
