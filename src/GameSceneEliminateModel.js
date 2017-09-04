/*
    游戏场景MVC中三消部分的model类
    即存储与管理游戏场景中三消部分的数据信息与逻辑算法的类

    其通过事件回调的方式向GameSceneController传递信息
    而其不能直接获取GameSceneController 与 GameSceneView的信息
 */
var GameSceneEliminateModel = cc.Node.extend({

    m_eliminateGameState:EliminateGameState.uninitPatterns,

    m_patternsVars:null,

    m_patternsPos:null,
    m_patternRects:null,

    m_counter:0,

    m_rowSpacing:0,
    m_colSpacing:0,
    m_rowHeight:0,
    m_colWidth:0,
    m_patternMatrixRowNum:6,    //三消图案矩阵行数
    m_patternMatrixColNum:6,    //三消图案矩阵列数
    m_patternMatrixTopSpacing:PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y - 32,  //三消矩阵距窗口顶边的距离
    m_patternMatrixBottomSpacing:32,
    m_patternMatrixLeftSpacing:12,
    m_patternMatrixRightSpacing:12,
    m_firstSelectedPatternIndex:null,  //第一个按下的图案编号(按矩阵行优先的顺序编号)
    m_secondSelectedPatternIndex:null,

    m_gameSpeed:1.0,   //三消游戏的整体速度  当玩家的战斗者进行提速时,会影响这个值变大从而也加快三消游戏的速度
    ctor:function () {
        this._super();

        this.m_patternMatrixTopSpacing = cc.winSize.height - (PLAYER_FIGHTER_SPRITE_INIT_POSITION_Y - PATTERN_MATRIX_TOP_OFFSET_Y_TO_FIGHTERS);

        this.m_patternMatrixLeftSpacing = (cc.winSize.width -
            (cc.winSize.height-this.m_patternMatrixTopSpacing-this.m_patternMatrixBottomSpacing))/2;
        this.m_patternMatrixRightSpacing = this.m_patternMatrixLeftSpacing;

        this.m_patternsVars = [];
        for(var row = 0;row<this.m_patternMatrixRowNum;row++){
            this.m_patternsVars[row] = [];
            for(var col = 0;col<this.m_patternMatrixColNum;col++){
                this.m_patternsVars[row][col] = null;
            }
        }

        var size = cc.winSize;
        var patternBg = new cc.Sprite();
        patternBg.initWithSpriteFrameName(PATTERN_BG_SPRITE_FRAME_NAME);
        var patternBgW = patternBg.getContentSize().width*PATTERN_SCALE;
        var patternBgH = patternBg.getContentSize().height*PATTERN_SCALE;

        this.m_colSpacing = (size.width - this.m_patternMatrixLeftSpacing - this.m_patternMatrixRightSpacing - patternBgW*this.m_patternMatrixColNum)/(this.m_patternMatrixColNum-1);
        this.m_rowSpacing = (size.height - this.m_patternMatrixTopSpacing - this.m_patternMatrixBottomSpacing - patternBgH*this.m_patternMatrixRowNum)/(this.m_patternMatrixRowNum-1);

        this.m_patternsPos = [];
        for(var row=0;row<this.m_patternMatrixRowNum;row++){
            this.m_patternsPos[row] = [];
            for(var col=0;col<this.m_patternMatrixColNum;col++){
                this.m_patternsPos[row][col] = cc.p(this.m_patternMatrixLeftSpacing+(col-0)*(patternBgW+this.m_colSpacing)+patternBgW/2,
                    this.m_patternMatrixBottomSpacing+(row-0)*(patternBgH+this.m_rowSpacing)+patternBgH/2 );
            }
        }
        this.m_rowHeight = patternBgH+this.m_rowSpacing;
        this.m_colWidth = patternBgW+this.m_colSpacing;
        
        this.m_patternRects = [];
        for(var row = 0;row<this.m_patternMatrixRowNum;row++){
            this.m_patternRects[row] = [];
            for(var col = 0;col<this.m_patternMatrixColNum;col++){
                this.m_patternRects[row][col] = cc.rect(this.m_patternsPos[row][col].x-patternBgW/2,this.m_patternsPos[row][col].y-patternBgH/2,patternBgW,patternBgH);
            }
        }

        return true;
    },
    update:function (dt) {
        this.m_counter+=1;
        switch(this.m_eliminateGameState){
            case EliminateGameState.uninitPatterns:
                if(this.m_counter == 1){
                    this.m_eliminateGameState = EliminateGameState.initPatterns;
                    this.m_counter = 0;
                    this.initPatterns();
                }
                break;
            default:
                break;
        }
    },
    initPatterns:function(){

        var gameSpeed = this.m_gameSpeed;
        for(var row = 0;row<this.m_patternMatrixRowNum;row++){
            for(var col = 0;col<this.m_patternMatrixColNum;col++) {
                this.createPatternAt(row,col);
            }
        }

        var event = new cc.EventCustom(NOTIFICATION_INIT_PATTERNS);
        var eventData = {patternsVars:this.m_patternsVars,gameSpeed:gameSpeed};
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);

        var initDuration = (PATTERN_SPRITE_DROP_HEIGHT / g_patternDropSpeed + 0.1)/gameSpeed;
        //cc.log("init Duration is "+initDuration);
        this.runAction(cc.sequence(
            cc.delayTime(initDuration),
            cc.callFunc(this.ensurePatternMatrixSwapEliminable.bind(this))
        ));

    },
    //在每次图案矩阵发生变化(消除旧图案、补充新图案)后都会进行的检查矩阵是否还有可通过两两交换实现的三消
    //若没有就会重新生成矩阵,并会检测新生成矩阵是否存在两两交换可达成的三消,若还没有会继续刷新矩阵,直到出现可通过交换实现的三消
    ensurePatternMatrixSwapEliminable:function(){

        var gameSpeed = this.m_gameSpeed;
        this.m_eliminateGameState = EliminateGameState.checkPatternMatrixSwapEliminable;
        var checkResult = this.checkPatternMatrixSwapEliminable();
        if (checkResult == true) {

            this.m_eliminateGameState = EliminateGameState.waitForInput;
        } else {
    
            this.m_eliminateGameState = EliminateGameState.removeAllPatterns;
            this.removeAllPatterns(gameSpeed);

            this.runAction(cc.sequence(
                cc.delayTime((g_patternEliminateDuration+0.1)/gameSpeed),
                cc.callFunc(
                    function(){
                        this.m_eliminateGameState = EliminateGameState.initPatterns;
                        this.initPatterns();
                    }.bind(this)
                )));
        }
    },
    removeAllPatterns:function(gameSpeed){
        for(var row=0;row<this.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_patternMatrixColNum;col++){
                this.m_patternsVars[row][col]=null;
            }
        }
        var event = new cc.EventCustom(NOTIFICATION_REMOVE_ALL_PATTERNS);
        event.setUserData({gameSpeed:gameSpeed});
        cc.eventManager.dispatchEvent(event);
    },
    createPatternAt:function(row,col){
        
        var patternTypeNo = getIntRandBetween(1,g_patternTypeNum);
        this.m_patternsVars[row][col] = {
            type:patternTypeNo
        };

    },
    getPatternMatrixIndex:function(position){
        
        for(var row=0;row<this.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_patternMatrixColNum;col++){
                if(cc.rectContainsPoint(this.m_patternRects[row][col],position)){
                    return {row:row,col:col};
                }

            }
        }
        return null;
    },
    selectPattern:function(index){
        //cc.log("select pattern at ["+index.row+","+index.col+"]");
        if(this.m_firstSelectedPatternIndex === null){
            //cc.log("first select: "+index.row+","+index.col);
            this.m_firstSelectedPatternIndex = index;

            var event = new cc.EventCustom(NOTIFICATION_SELECT_PATTERN);
            var eventData = {selectedPatternIndex:index};
            event.setUserData(eventData);
            cc.eventManager.dispatchEvent(event);
            
            return;

        }else{
            this.m_secondSelectedPatternIndex = index;
            if(this.m_firstSelectedPatternIndex.row == this.m_secondSelectedPatternIndex.row &&
                this.m_firstSelectedPatternIndex.col == this.m_secondSelectedPatternIndex.col){
                //cc.log("same to first select: "+index.row+","+index.col);
                this.m_secondSelectedPatternIndex = null;

                return;
            }else{
                //cc.log("second select: "+index.row+","+index.col);
                var isAdjacent = false;
                if(this.m_firstSelectedPatternIndex.row == this.m_secondSelectedPatternIndex.row){
                    if(this.m_firstSelectedPatternIndex.col>0 &&
                        this.m_firstSelectedPatternIndex.col - 1 == this.m_secondSelectedPatternIndex.col){
                        isAdjacent = true;
                    }else if(this.m_firstSelectedPatternIndex.col<this.m_patternMatrixColNum &&
                        this.m_firstSelectedPatternIndex.col + 1 == this.m_secondSelectedPatternIndex.col){
                        isAdjacent = true;
                    }
                }
                else if(this.m_firstSelectedPatternIndex.col == this.m_secondSelectedPatternIndex.col){
                    if(this.m_firstSelectedPatternIndex.row>0 &&
                        this.m_firstSelectedPatternIndex.row - 1 == this.m_secondSelectedPatternIndex.row){
                        isAdjacent = true;
                    }else if(this.m_firstSelectedPatternIndex.row < this.m_patternMatrixRowNum &&
                        this.m_firstSelectedPatternIndex.row + 1 == this.m_secondSelectedPatternIndex.row){
                        isAdjacent = true;
                    }
                }

                if(isAdjacent){
                    //cc.log("is Adjacent");
                    this.m_eliminateGameState = EliminateGameState.swapPatternsForth;
                    this.swapPatterns(this.m_firstSelectedPatternIndex,this.m_secondSelectedPatternIndex);

                    this.m_firstSelectedPatternIndex = null;
                    this.m_secondSelectedPatternIndex = null;

                    
                }else{
                    //cc.log("not Adjacent");
                    this.m_firstSelectedPatternIndex = this.m_secondSelectedPatternIndex;
                    this.m_secondSelectedPatternIndex = null;

                    // var event = new cc.EventCustom(NOTIFICATION_MOVE_SELECT_CURSOR_SPRITE);
                    // var eventData = {position:this.m_patternsPos[this.m_firstSelectedPatternIndex.row][this.m_firstSelectedPatternIndex.col]};
                    // event.setUserData(eventData);
                    // cc.eventManager.dispatchEvent(event);

                    var event = new cc.EventCustom(NOTIFICATION_SELECT_PATTERN);
                    var eventData = {selectedPatternIndex:index};
                    event.setUserData(eventData);
                    cc.eventManager.dispatchEvent(event);
                }
            }
        }
    },
    swapPatterns:function(firstPatternIndex,secondPatternIndex){
        cc.log("swapPatterns");
        var gameSpeed = this.m_gameSpeed;
        var firstPatternVars = this.m_patternsVars[firstPatternIndex.row][firstPatternIndex.col];
        this.m_patternsVars[firstPatternIndex.row][firstPatternIndex.col] = this.m_patternsVars[secondPatternIndex.row][secondPatternIndex.col];
        this.m_patternsVars[secondPatternIndex.row][secondPatternIndex.col] = firstPatternVars;

        var event = new cc.EventCustom(NOTIFICATION_SWAP_PATTERNS);
        var eventData = {
            firstPatternIndex:firstPatternIndex,
            secondPatternIndex:secondPatternIndex,
            gameSpeed:gameSpeed};
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);

        // this.runAction(cc.sequence(cc.delayTime(g_patternSwapDuration/gameSpeed),
        //     cc.callFunc(this.swapPatternsDidFinish.bind(this),this,{firstPatternIndex:firstPatternIndex,secondPatternIndex:secondPatternIndex})));

        this.scheduleOnce(function temp(){
            this.swapPatternsDidFinish(this,{firstPatternIndex:firstPatternIndex,secondPatternIndex:secondPatternIndex});
        },g_patternSwapDuration/gameSpeed)
    },
    swapPatternsDidFinish:function(pNode,data){
        cc.log("swapPatternsDidFinish");
        if(this.m_eliminateGameState == EliminateGameState.swapPatternsForth){

            var firstPatternIndex = data.firstPatternIndex;
            var secondPatternIndex = data.secondPatternIndex;

            var eliminablePatternsVars = create2dArray(this.m_patternMatrixRowNum,this.m_patternMatrixColNum,null);

            this.m_eliminateGameState = EliminateGameState.checkSwapPatternsEliminable;
            var checkResult1 = this.checkPatternEliminable(firstPatternIndex,eliminablePatternsVars);
            var checkResult2 = this.checkPatternEliminable(secondPatternIndex,eliminablePatternsVars);
          
            if(checkResult1.hasEliminable||checkResult2.hasEliminable)
            {
               // var eliminablePatternTypes = [];
              //  var eliminablePatternNum = [];

                // if(checkResult1.hasEliminable == true){
                //    // eliminablePatternTypes[0]=this.m_patternsVars[firstPatternIndex.row][firstPatternIndex.col].type;
                //    // eliminablePatternNum[0]=checkResult1.eliminableNum;
                //     if(checkResult2.hasEliminable == true &&
                //         this.m_patternsVars[firstPatternIndex.row][firstPatternIndex.col].type
                //         == this.m_patternsVars[secondPatternIndex.row][secondPatternIndex.col].type){
                //         eliminablePatternNum[0] += checkResult2.eliminableNum;
                //     }else{
                //         eliminablePatternTypes[1]=this.m_patternsVars[secondPatternIndex.row][secondPatternIndex.col].type;
                //         eliminablePatternNum[1]=checkResult2.eliminableNum;
                //     }
                // }
                // else{
                //     eliminablePatternTypes[0]=this.m_patternsVars[secondPatternIndex.row][secondPatternIndex.col].type;
                //     eliminablePatternNum[0] = checkResult2.eliminableNum;
                // }
                //cc.log("eliminable");
                this.m_eliminateGameState = EliminateGameState.eliminatePatterns;
               // this.eliminatePatterns(eliminablePatternsVars,eliminablePatternTypes,eliminablePatternNum);
                this.eliminatePatterns(eliminablePatternsVars);
            }else{
                //cc.log("not eliminable");
                this.m_eliminateGameState = EliminateGameState.swapPatternsBack;
                this.swapPatterns(firstPatternIndex,secondPatternIndex);
            }
        }else if(this.m_eliminateGameState == EliminateGameState.swapPatternsBack){
            this.m_eliminateGameState = EliminateGameState.waitForInput;
        }
    },
    checkPatternMatrixSwapEliminable:function(){
 
        var eliminableMarkMatrix = create2dArray(this.m_patternMatrixRowNum,this.m_patternMatrixColNum,0);
        for(var row=0;row<this.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_patternMatrixColNum;col++){
                //现成的三连
                var checkResult = this.checkPatternEliminable({row:row,col:col},eliminableMarkMatrix);
                if(checkResult==true){
                    return true;
                }

                /*upward*/
                //   x x
                // x

                // x   x
                //   x

                // x x
                //     x

                // x
                // x
                //
                // x
                if(row<this.m_patternMatrixRowNum-1){
                    if(col<this.m_patternMatrixColNum-2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col+1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col+2].type){
                        return true;
                    }else if(col>1 &&
                        col<this.m_patternMatrixColNum-1 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col-1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col+1].type){
                        return true;
                    }else if(col>2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col-2].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col-1].type){
                        return true;
                    }
                }
                if(row<this.m_patternMatrixRowNum-3 &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row+2][col].type &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row+3][col].type){
                    return true;
                }

                /*downward*/
                // x
                //   x x

                //   x
                // x   x

                //     x
                // x x

                // x
                //
                // x
                // x

                if(row>1){
                    if(col<this.m_patternMatrixColNum-2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col+1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col+2].type){
                        return true;
                    }else if(col>1 &&
                        col<this.m_patternMatrixColNum-1 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col-1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col+1].type){
                        return true;
                    }else if(col>2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col-2].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col-1].type){
                        return true;
                    }
                }
                if(row>3 &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row-2][col].type &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row-3][col].type){
                    return true;
                }

                /*leftward*/
                // x
                // x
                //   x

                // x
                //   x
                // x

                //   x
                // x
                // x

                // x x   x

                if(col>1){
                    if(row<this.m_patternMatrixRowNum-2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col-1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+2][col-1].type){
                        return true;
                    }else if(row<this.m_patternMatrixRowNum-1 &&
                        row>1 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col-1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col-1].type){
                        return true;
                    }else if(row>2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col-1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-2][col-1].type){
                        return true;
                    }
                }
                if(col>3 &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row][col-2].type &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row][col-3].type){
                    return true;
                }

                /*rightward*/
                //   x
                //   x
                // x

                //   x
                // x
                //   x

                // x
                //   x
                //   x

                // x   x x
                if(col<this.m_patternMatrixColNum-1){
                    if(row<this.m_patternMatrixRowNum-2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col+1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+2][col+1].type){
                        return true;
                    }else if(row<this.m_patternMatrixRowNum-1 &&
                        row>1 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row+1][col+1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col+1].type){
                        return true;
                    }else if(row>2 &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-1][col+1].type &&
                        this.m_patternsVars[row][col].type == this.m_patternsVars[row-2][col+1].type){
                        return true;
                    }
                }
                if(col<this.m_patternMatrixColNum-3 &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row][col+2].type &&
                    this.m_patternsVars[row][col].type == this.m_patternsVars[row][col+3].type){
                    return true;
                }

            }
        }


        return false;
    },
    checkPatternEliminable:function(focusedPatternIndex,eliminablePatternsVars){
        //cc.log("checkEliminable focusIndex: "+focusedPatternIndex.row+","+focusedPatternIndex.col);
        var focusedRow = focusedPatternIndex.row;
        var focusedCol = focusedPatternIndex.col;
        var hasEliminable = false;
        //var eliminableNum = 0;

        //check horizontally
        var eliminableColCount = 1;
        var eliminableColStart = focusedCol;
        var eliminableColEnd = focusedCol;

        for(var col=focusedCol-1;col>=0;col--){
            if(this.m_patternsVars[focusedRow][col].type == this.m_patternsVars[focusedRow][focusedCol].type){
                //cc.log("["+focusedRow+","+col+"] type is "+this.m_patternsVars[focusedRow][col].type);
                eliminableColCount++;

                eliminableColStart = col;
            }else{
                break;
            }
        }
        for(var col=focusedCol+1;col<this.m_patternMatrixColNum;col++){
            if(this.m_patternsVars[focusedRow][col].type == this.m_patternsVars[focusedRow][focusedCol].type){
                //cc.log("["+focusedRow+","+col+"] type is "+this.m_patternsVars[focusedRow][col].type);
                eliminableColCount++;

                eliminableColEnd = col;
            }else{
                break;
            }
        }
        if(eliminableColCount >= g_minEliminablePatternNum){
            hasEliminable = true;
            for(var col=eliminableColStart;col<=eliminableColEnd;col++){
                //cc.log("eliminate ["+focusedRow+","+col+"]");
                eliminablePatternsVars[focusedRow][col] = this.m_patternsVars[focusedRow][col];

            }
            //eliminableNum += eliminableColCount;
        }
        
        //check vertically
        var eliminableRowCount = 1;
        var eliminableRowStart = focusedRow;
        var eliminableRowEnd = focusedRow;

        for(var row=focusedRow-1;row>=0;row--){
            if(this.m_patternsVars[row][focusedCol].type == this.m_patternsVars[focusedRow][focusedCol].type){
                //cc.log("["+row+","+focusedCol+"] type is "+this.m_patternsVars[row][focusedCol].type);
                eliminableRowCount++;

                eliminableRowStart = row;
            }else{
                break;
            }
        }
        for(var row=focusedRow+1;row<this.m_patternMatrixRowNum;row++){
            if(this.m_patternsVars[row][focusedCol].type == this.m_patternsVars[focusedRow][focusedCol].type){
                //cc.log("["+row+","+focusedCol+"] type is "+this.m_patternsVars[row][focusedCol].type);
                eliminableRowCount++;

                eliminableRowEnd = row;
            }else{
                break;
            }
        }
        if(eliminableRowCount >= g_minEliminablePatternNum){
            hasEliminable = true;
            for(var row=eliminableRowStart;row<=eliminableRowEnd;row++){
                //cc.log("eliminate ["+row+","+focusedCol+"]");
                //eliminableMarkMatrix[row][focusedCol]=1;
                eliminablePatternsVars[row][focusedCol] = this.m_patternsVars[row][focusedCol];
            }
           // eliminableNum += eliminableRowCount;
        }
        return {
            hasEliminable:hasEliminable};

    },
    eliminatePatterns:function(eliminablePatternsVars){

        var gameSpeed = this.m_gameSpeed;
        for(var row=0;row<this.m_patternMatrixRowNum;row++){
            for(var col=0;col<this.m_patternMatrixColNum;col++){
                if(eliminablePatternsVars[row][col] != null){
                    //cc.log("eliminableMarkMatrix["+row+"]["+col+"] is not null");

                    this.m_patternsVars[row][col] = null;
                }
            }
        }
        
        var event = new cc.EventCustom(NOTIFICATION_ELIMINATE_PATTERNS);
        var eventData = {eliminablePatternsVars:eliminablePatternsVars,
            gameSpeed:gameSpeed};
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);

        this.runAction(cc.sequence(cc.delayTime((g_patternEliminateDuration+0.1)/gameSpeed),
            cc.callFunc(this.eliminatePatternsDidFinish.bind(this),this,eliminablePatternsVars)));
    },
    eliminatePatternsDidFinish:function(pNode,data){
        this.m_eliminateGameState = EliminateGameState.fillPatternMatrixVacancies;
        this.fillPatternMatrixVacancies();
    },
    fillPatternMatrixVacancies:function(){
        var gameSpeed = this.m_gameSpeed;
        var newPatternsVars = create2dArray(this.m_patternMatrixRowNum,this.m_patternMatrixColNum,null);
        var oldPatternsIndexChanges = create2dArray(this.m_patternMatrixRowNum,this.m_patternMatrixColNum,null);

        for(var col=0;col<this.m_patternMatrixColNum;col++){
            var eliminatedRowCount = 0;
            //drop exist patterns
            for(var row=0;row<this.m_patternMatrixRowNum;row++){
                if(this.m_patternsVars[row][col] == null){
                    eliminatedRowCount+=1;
                }else{
                    if(eliminatedRowCount>0){
                        var newRow = row - eliminatedRowCount;
                        this.m_patternsVars[newRow][col] = this.m_patternsVars[row][col];
                        this.m_patternsVars[row][col] = null;

                        //var event = new cc.EventCustom(NOTIFICATION_MOVE_PATTERN_SPRITE);
                        var oldPatternIndex = {row:row,col:col};
                        var newPatternIndex = {row:newRow,col:col};
                        // var eventData = {oldPatternIndex:oldPatternIndex,newPatternIndex:newPatternIndex};
                        // event.setUserData(eventData);
                        // cc.eventManager.dispatchEvent(event);

                        oldPatternsIndexChanges[row][col] = {oldPatternIndex:oldPatternIndex,newPatternIndex:newPatternIndex};
                    }
                }
            }
            for(var row = this.m_patternMatrixRowNum-eliminatedRowCount;row<this.m_patternMatrixRowNum;row++){
                this.createPatternAt(row,col);
                newPatternsVars[row][col] = this.m_patternsVars[row][col];
            }
        }
        
        var event = new cc.EventCustom(NOTIFICATION_FILL_PATTERN_MATRIX_VACANCIES);
        event.setUserData({oldPatternsIndexChanges:oldPatternsIndexChanges,
            newPatternsVars:newPatternsVars,gameSpeed:gameSpeed});
        cc.eventManager.dispatchEvent(event);

        this.runAction(cc.sequence(cc.delayTime((PATTERN_SPRITE_DROP_HEIGHT/g_patternDropSpeed+0.1)/gameSpeed),
            cc.callFunc(this.ensurePatternMatrixSwapEliminable.bind(this))));
    },

});