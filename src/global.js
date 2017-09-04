/*
    为一些需要为全局领域所公用的数据或函数提供接口
    类型有全局变量、全局常变量、枚举变量、全局公用的函数等
*/

//notification model类传给controller事件的标志
//from eliminate model
var WIN_WIDTH = 480;
var WIN_HEIGHT = 720;
var SHOW_TEST_LABEL =  false;
var NOTIFICATION_INIT_PATTERNS = "initPatterns";
var NOTIFICATION_REMOVE_ALL_PATTERNS = "removeAllPatterns";
var NOTIFICATION_SELECT_PATTERN = "selectPattern";
var NOTIFICATION_SWAP_PATTERNS = "swapPatterns";
var NOTIFICATION_ELIMINATE_PATTERNS = "eliminatePatterns";
var NOTIFICATION_FILL_PATTERN_MATRIX_VACANCIES = "fillPatternMatrixVacancies";
var NOTIFICATION_FIGHTER_GO_DIE = "fighterGoDie";
var NOTIFICATION_FIGHT_GAME_OVER = "fightGameOver";

//from fight model
var NOTIFICATION_INIT_FIGHT = "initFight";
var NOTIFICATION_FIGHTER_ATTACK = "fighterAttack";
var NOTIFICATION_FIGHTER_GET_DEFEND = "fighterGetDefend";
var NOTIFICATION_FIGHTER_GET_HURT = "fighterGetHurt";
var NOTIFICATION_FIGHTER_HEAL = "fighterHeal";
var NOTIFICATION_FIGHTER_SPEED_UP = "fighterSpeedUp";
var NOTIFICATION_FIGHTER_SPEED_UP_BUFF_END = "fighterSpeedUpBuffEnd";
var NOTIFICATION_FIGHTER_FREEZE = "fighterFreeze";
var NOTIFICATION_FIGHTER_GET_FROZEN = "fighterGetFrozen";

//resource name
var SELECT_CURSOR_SPRITE_FRAME_NAME = "pattern_select_cursor.png";

var DEFEND_EFFECT_SPRITE_FRAME_NAME = "defend_effect.png";
var FREEZE_EFFECT_SPRITE_FRAME_NAME = "freeze_effect.png";
var FROZEN_EFFECT_SPRITE_FRAME_NAME = "frozen_effect.png";

var FIGHTER_1_DEFEND_SPRITE_FRAME_NAME = "fighter_01_alert_01.png";
var FIGHTER_1_HURT_SPRITE_FRAME_NAME = "fighter_01_hurt_01.png";
var FIGHTER_1_DEAD_SPRITE_FRAME_NAME = "fighter_01_dying_03.png";


var START_BTN_1_SPRITE_FRAME_NAME = "start_btn_01.png";
var START_BTN_2_SPRITE_FRAME_NAME = "start_btn_02.png";
var RESTART_BTN_1_SPRITE_FRAME_NAME = "restart_btn_01.png";
var RESTART_BTN_2_SPRITE_FRAME_NAME = "restart_btn_02.png";

var RETURN_BTN_1_SPRITE_FRAME_NAME = "return_btn_01.png";
var RETURN_BTN_2_SPRITE_FRAME_NAME = "return_btn_02.png";

var PATTERN_BG_SPRITE_FRAME_NAME = "pattern_bg.png";
var WIN_TITLE_SPRITE_FRAME_NAME = "win_title.png";
var LOSE_TITLE_SPRITE_FRAME_NAME = "lose_title.png";

var START_SCENE_TITLE_SPRITE_FRAME_NAME = "start_scene_title.png";
var PLAYER_TITLE_SPRITE_FRAME_NAME = "player_title.png";
var COMPUTER_TITLE_SPRITE_FRAME_NAME = "computer_title.png";

//pattern sprite frame name
var PATTERN_SWORD_SPRITE_FRAME_NAME = "pattern_sword.png";
var PATTERN_ARROW_SPRITE_FRAME_NAME = "pattern_arrow.png";
var PATTERN_DEFEND_SPRITE_FRAME_NAME = "pattern_defend.png";
var PATTERN_HEAL_SPRITE_FRAME_NAME = "pattern_heal.png";
var PATTERN_SPEED_UP_SPRITE_FRAME_NAME = "pattern_speed_up.png";
var PATTERN_FREEZE_SPRITE_FRAME_NAME = "pattern_freeze.png";

//fighter animation name
var FIGHTER_1_ALERT_ANIMATION_NAME = "fighter_01_alert";
var FIGHTER_1_ARROW_ATTACK_ANIMATION_NAME = "fighter_01_arrow_attack";
var FIGHTER_1_SWORD_ATTACK_ANIMATION_NAME = "fighter_01_sword_attack";
var FIGHTER_1_HURT_ANIMATION_NAME = "fighter_01_hurt";
var FIGHTER_1_HEAL_ANIMATION_NAME = "fighter_01_heal";
var FIGHTER_1_DYING_ANIMATION_NAME = "fighter_01_dying";
var FIGHTER_1_DEAD_ANIMATION_NAME = "fighter_01_dead";

var HEAL_EFFECT_ANIMATION_NAME = "heal_effect";
var SPEED_UP_EFFECT_ANIMATION_NAME = "speed_up_effect";
var ELIMINATE_PATTERN_EFFECT_ANIMATION_NAME = "eliminate_pattern_effect";

//var value
var PATTERN_MATRIX_TOP_OFFSET_Y_TO_FIGHTERS = 64;
var PATTERN_SPRITE_DROP_HEIGHT = WIN_HEIGHT/4;
var SELECT_CURSOR_SPRITE_HIDE_POSITION = cc.p(-100,-100);


var PLAYER_FIGHTER_SPRITE_INIT_POSITION_X = WIN_WIDTH/4;;
var PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y = WIN_HEIGHT*3/5;

var COMPUTER_FIGHTER_SPRITE_INIT_POSITION_X = WIN_WIDTH*3/4;
var COMPUTER_FIGHTER_SPRITE_INIT_POSITION_Y = PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y;

var FIGHTER_SWORD_ATTACK_DISTANCE = 64;

var FIGHTER_HURT_MOVE_UP_HEIGHT = 24;

var ARROW_SPRITE_INIT_OFFSET_X_TO_INVENTOR = 4;
var ARROW_SPRITE_INIT_OFFSET_Y_TO_INVENTOR = 28;
var ARROW_SPRITE_DEST_OFFSET_X_TO_TARGET = 12;

var VALUE_SPRITE_INIT_OFFSET_X_TO_FIGHTER = 0;
var VALUE_SPRITE_INIT_OFFSET_Y_TO_FIGHTER = 32;

var END_MENU_ITEM_OFFSET_Y_TO_WIN_CENTER = 64;
var END_MENU_ITEM_VERTICLE_SPACING = 16;
var END_MENU_ITEM_SCALE = 0.75;

var START_MENU_START_BTN_SCALE = 1.0;

var SELECT_CURSOR_SPRITE_SCALE = 1.2;
var PATTERN_SCALE = 1.5;


// var FIGHTER_DEFEND_EFFECT_OFFSET_X_TO_FIGHTER = 0;
var FIGHTER_DEFEND_EFFECT_OFFSET_Y_TO_FIGHTER_CENTER_HEIGHT = -4;

var FIGHTER_HEAL_EFFECT_OFFSET_X_TO_FIGHTER = 0;
var FIGHTER_HEAL_EFFECT_OFFSET_Y_TO_FIGHTER = -3;

var FIGHTER_SPEED_UP_EFFECT_OFFSET_X_TO_FIGHTER = 0;
var FIGHTER_SPEED_UP_EFFECT_OFFSET_Y_TO_FIGHTER = 0;

var FIGHTER_FREEZE_EFFECT_INIT_OFFSET_X_TO_FIGHTER = 39*2;
var FIGHTER_FREEZE_EFFECT_INIT_OFFSET_Y_TO_FIGHTER = 65*2;

var FIGHTER_FROZEN_EFFECT_INIT_OFFSET_X_TO_FIGHTER = 0;
var FIGHTER_FROZEN_EFFECT_INIT_OFFSET_Y_TO_FIGHTER = 0;

var VALUE_SPRITE_MOVE_UP_DISTANCE = 36;

var VALUE_SPRITE_DIGIT_NUM_SPACING = 28;

var FIRST_BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_X_TO_FIGHTER = -32;
var BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_Y_TO_FIGHTER = 96;

var HPBAR_SPRITE_OFFSET_Y_TO_FIGHTER = BUFF_AND_DEBUFF_MARK_SPRITE_OFFSET_Y_TO_FIGHTER + 32;
var PLAYER_TITLE_SPRITE_OFFSET_Y_TO_FIGHTER = HPBAR_SPRITE_OFFSET_Y_TO_FIGHTER + 32;

var BUFF_AND_DEBUFF_SPRITES_SPACING = 32;

var START_SCENE_WATCHROLE_OFFSET_X_TO_WIN_CENTER = 128;
var START_SCENE_WATCHROLE_OFFSET_Y_TO_WIN_CENTER = (-108);

var FROZEN_EFFECT_2_SPRITE_SCALE = 3.0;

var FIGHTER_INIT_SPEED = 1.0;
var FIGHTER_SPEED_UP_SPEED = 2.0;

//node name
var DEFEND_BUFF_MARK_SPRITE_NODE_NAME = "defend_buff";
var SPEED_UP_BUFF_MARK_SPRITE_NODE_NAME = "speed_up_buff";
var FROZEN_DEBUFF_MARK_SPRITE_NODE_NAME= "frozen_debuff";

//model action tag
var SWORD_ATTACK_MODEL_ACTION_TAG = 100;
var ARROW_ATTACK_MODEL_ACTION_1_TAG = 200;
var ARROW_ATTACK_MODEL_ACTION_2_TAG = 300;
var GET_DEFEND_MODEL_ACTION_1_TAG = 400;
var GET_DEFEND_MODEL_ACTION_2_TAG = 500;
var GET_HURT_MODEL_ACTION_TAG = 600;
var HEAL_MODEL_ACTION_TAG = 700;
var SPEED_UP_MODEL_ACTION_1_TAG = 800;
var SPEED_UP_MODEL_ACTION_2_TAG = 900;
var FREEZE_MODEL_ACTION_1_TAG = 1000;
var FREEZE_MODEL_ACTION_2_TAG = 1100;
var GET_FROZEN_MODEL_ACTION_TAG = 1200;
var AI_DELAY_MODEL_ACTION_TAG = 1300;
var GO_DIE_MODEL_ACTION_TAG = 1400;

var SWORD_ATTACK_FIGHTER_SPRITE_ACTION_TAG = 10;
var ARROW_ATTACK_FIGHTER_SPRITE_ACTION_TAG = 20;
var GET_DEFEND_FIGHTER_SPRITE_ACTION_TAG = 30;
var GET_HURT_FIGHTER_SPRITE_ACTION_TAG = 40;
var REPEAT_ANIMATE_HURT_FIGHTER_SPRITE_ACTION_TAG = 45;
var HEAL_FIGHTER_SPRITE_ACTION_TAG = 50;
var SPEED_UP_FIGHTER_SPRITE_ACTION_TAG = 60;
var FREEZE_FIGHTER_SPRITE_ACTION_TAG = 70;
var GO_DIE_FIGHTER_SPRITE_ACTION_TAG = 80;
var REPEAT_ANIMATE_ALERT_FIGHTER_SPRITE_ACTION_TAG = 90;
var DEAD_FIGHTER_SPRITE_ACTION_TAG = 100;
var GET_FROZEN_FIGHTER_SPRITE_ACTION_TAG = 110;

//z order
var BG_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 0;
//var PATTERN_BATCH_NODE_GAME_SCENE_VIEW_Z_ORDER = 2;
var PATTERN_GAME_SCENE_VIEW_Z_ORDER = 1;
var SELECT_CURSOR_GAME_SCENE_VIEW_Z_ORDER = 2;
var ELIMINATE_EFFECT_GAME_SCENE_VIEW_Z_ORDER = 3;
var PLAYER_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 5;
var ENEMY_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 4;

var HPBAR_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 6;
var PLAYER_TITLE_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 6;

var FIGHT_EFFECT_GAME_SCENE_VIEW_Z_ORDER = 7;
var ARROW_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 8;

var VALUE_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 9;
var BUFF_AND_DEBUFF_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 8;
var END_TITLE_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 10;
var END_MENU_GAME_SCENE_VIEW_Z_ORDER = 11;

//enum
var GameState = {
    pause:0,
    init:1,
    inTheGame:2,
    gameOver:3
};

var EliminateGameState = {
    uninitPatterns:0,
    initPatterns:1,
    removeAllPatterns:2,
    checkPatternMatrixSwapEliminable:3,
    waitForInput:4,
    swapPatternsForth:5,
    swapPatternsBack:6,
    checkSwapPatternsEliminable:7,
    eliminatePatterns:8,
    fillPatternMatrixVacancies:9
};

var FightGameState = {
    uninitFight:0,
    initFight:1,
    inTheFight:2,
    gameOver:3
};

var PatternType = {
    sword:1,
    arrow:2,
    defend:3,
    heal:4,
    speedUp:5,
    freeze:6
};

var FighterState = {
    alert:0,

    arrowAttack:1,
    swordAttack:2,
    getDefend:3,
    getHurt:4,
    heal:5,
    speedUp:6,
    freeze:7,

    dying:8,
    dead:9
};

var FighterAttackType = {
    swordAttack:0,
    arrowAttack:1,
}

var ValueSpriteType = {
    hurt:0,
    heal:1,
}

//global var
var g_patternTypeNum = 6;
var g_minEliminablePatternNum = 3;
var g_fighterNum = 2;

var g_fightersMaxHp = [100,100];

var g_fightersAtk = [5,5];
var g_fightersDef = [3,3];

var g_arrowAtkPerDegree = 2;
var g_healValuePerDegree = 5;


//duration
var g_patternDropSpeed = (WIN_HEIGHT/0.4);
var g_patternSwapDuration = 0.4;
var g_patternEliminateDuration = 0.4;

var g_fighterFadeInDuration = 0.5;
var g_fighterFadeOutDuration = 0.5;

var g_fighterHurtDuration = 0.2;

var g_swordAttackDuration = 0.6;
var g_arrowAttackDuration = 1.2;
var g_arrowFlyDuration = 1.0;

var g_fighterGetDefendDuration = 0.6;
var g_defendBuffDurationPerDegree = 1.0;
var g_fighterDefendEffectScaleBigDuration = 0.4;
var g_fighterDefendEffectScaleSmallDuration = 0.4;

var g_fighterDefendEffectBigScale = 2.4;
var g_fighterDefendEffectSmallScale = 1.6;
var g_fighterDefendEffectMinOpacity = 100;
var g_fighterDefendEffectMaxOpacity = 200;

var g_fighterHealDuration = 0.6;

var g_fighterSpeedUpDuration = g_fighterHealDuration;

var g_fighterFreezeDuration = 0.6;

var g_speedUpBuffDurationPerDegree = 1.0;

var g_moveFreezeIceDuration = 0.5;

var g_frozenDebuffDurationPerDegree = 1.0;

var g_valueSpriteMoveUpDuration = 1.5;
var g_valueSpriteFadeOutDuration = g_valueSpriteMoveUpDuration;

var g_fighterDyingDuration = 0.6;

var g_fighterAIAverageDelay = 3.0;
var g_fighterAIDelayVar = 1.0;

var g_endTitleFadeInDuration = 2.0;
var g_initFightCallBackDuration = 1.0;

var g_sceneTransitionDuration = 1.0;

//global func
create2dArray=function(rowNum,colNum,initValue){
    var array = [];
    for(var row=0;row<rowNum;row++){
        array[row] = [];
        for(var col=0;col<colNum;col++){
            array[row][col] = initValue;
        }
    }
    return array;
}

getValueSprite=function(type,value){
    var valueSprite = new cc.Sprite();
    var digitNum = 0;
    var remain = value;
    var digitValueSpriteFrameNamePrefix;
    var digitValueSpriteFrameNamePostfix=".png";
    switch(type){
        case ValueSpriteType.hurt:
            digitValueSpriteFrameNamePrefix = "hurt_value_";
            break;
        case ValueSpriteType.heal:
            digitValueSpriteFrameNamePrefix = "heal_value_";
            break;

    }
    if(value==0){
        var digitValueSprite = new cc.Sprite();
        digitValueSprite.setAnchorPoint(0.5,0);
        digitValueSprite.initWithSpriteFrameName(digitValueSpriteFrameNamePrefix+0+digitValueSpriteFrameNamePostfix);
        digitValueSprite.setPosition(-digitNum*VALUE_SPRITE_DIGIT_NUM_SPACING,0);
        valueSprite.addChild(digitValueSprite);
        digitNum++;
        //return valueSprite;
    }else{
        while(remain != 0 ){
            var digitValue =  remain % 10;
            var digitValueSprite = new cc.Sprite();
            digitValueSprite.setAnchorPoint(0.5,0);
            digitValueSprite.initWithSpriteFrameName(digitValueSpriteFrameNamePrefix+digitValue+digitValueSpriteFrameNamePostfix);
            digitValueSprite.setPosition(-digitNum*VALUE_SPRITE_DIGIT_NUM_SPACING,0);
            valueSprite.addChild(digitValueSprite);
            digitNum++;
            remain = Math.floor(remain/10);
        }

    }
    return valueSprite;
}

getIntRandBetween=function(a,b){
    var rand = 0 | Math.random()*10000;

        return (a + rand % (b-a+1));

}

getRandBetween=function(a,b){
    return (a + Math.random()*(b-a));
}

// var g_patternMatrixRowNum = 8;
// var g_patternMatrixColNum = 8;

