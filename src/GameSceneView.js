/*
    游戏场景MVC的view类
    即内容需要被渲染的节点类

    其不能获取GameSceneController或任一model的信息
    其将操作在其身上的触摸等用户操作的反馈处理代理给GameSceneController去做
*/
var GameSceneView = cc.Node.extend({
    delegate:null,               //GameSceneView的代理对象指针,应该指向其controller,不过事实上view并不通过该指针直接向controller通信
    //m_patternBatchNode:null,
    m_patternSprites:[],
    m_selectCursor:null,

    m_fighterSprites:[],
    m_fighterHpBarBgSprites:[],
    m_fighterHpBarFillSprites:[],

    m_fighterBuffAndDebuffMarkSprites:[],
    m_testLabel1:null,
    m_testLabel2:null,
    m_testLabel3:null,
    ctor:function (rowNum,colNum) {
        this._super();
        
        var bgSprite = new cc.Sprite(res.gameSceneBg_png);
        bgSprite.setAnchorPoint(0.5,0.5);
        bgSprite.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bgSprite,BG_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        this.m_patternSprites = create2dArray(rowNum,colNum,null);
        
        for(var id=0;id<g_fighterNum;id++){
            this.m_fighterBuffAndDebuffMarkSprites[id] = [];
        }

        //不知是否因为plist文件包含的图片太少,这里用spriteBatchNode达不到理想目的
        //this.m_patternBatchNode = new cc.SpriteBatchNode(res.patterns_plist,rowNum*colNum*2);
        //this.addChild(this.m_patternBatchNode,PATTERN_BATCH_NODE_GAME_SCENE_VIEW_Z_ORDER);

        this.m_selectCursor = new cc.Sprite();
        this.m_selectCursor.initWithSpriteFrameName(SELECT_CURSOR_SPRITE_FRAME_NAME);

        this.m_selectCursor.setScale(SELECT_CURSOR_SPRITE_SCALE);
        this.m_selectCursor.setPosition(SELECT_CURSOR_SPRITE_HIDE_POSITION);
        this.addChild(this.m_selectCursor,SELECT_CURSOR_GAME_SCENE_VIEW_Z_ORDER);
        
        return true;
    },
    update:function(dt){
        //cc.log("GameSceneView update");
    }
});