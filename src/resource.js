//需要被预加载而登记的游戏资源(图片、动画、声音)
var res = {
    fightersFrames_plist : "res/fighters_frames.plist",
    fightersAnimations_plist: "res/fighters_animations.plist",
    effectsFrames_plist: "res/effects_frames.plist",
    effectsAnimations_plist: "res/effects_animations.plist",
    arrow_png: "res/arrow.png",
    values_plist: "res/values.plist",
    hpbarBg_png: "res/hpbar_bg.png",
    hpbarFill_png: "res/hpbar_fill.png",
    patterns_plist:  "res/patterns.plist",
    titles_plist: "res/titles.plist",
    btns_plist: "res/btns.plist",
    gameSceneBg_png : "res/game_scene_bg.png",
    startSceneScrollBg_png : "res/start_scene_scroll_bg.png",
    arrowAttack_wav :"res/sounds/arrow_attack.wav",
    swordAttack_wav :"res/sounds/sword_attack.wav",
    win_wav :"res/sounds/win.wav",
    lose_wav :"res/sounds/lose.wav",
    gameSceneBGM_wav : "res/sounds/game_bgm_3.mp3",
    startSceneBGM_wav : "res/sounds/game_bgm_2.mp3",
    button_wav:"res/sounds/button.wav",
    cursor_wav:"res/sounds/cursor.wav",
    explosion_wav:"res/sounds/explosion.wav",
    heal_wav:"res/sounds/heal.wav",
    speedUp_wav:"res/sounds/speed_up.wav",
    frozen_wav:"res/sounds/frozen.wav",
    getDefend_wav:"res/sounds/get_defend.wav",
    disable_wav:"res/sounds/disable.wav"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
