// ◉○◍●✕▶✔✘□ symbol hot bar

// define global data so there won't be load conflict

let QUEST, QUESTID
    DONE = [];

const floor = Math.floor,
    random = Math.random,
    CHECKMARK = '✔',
    XMARK = '✘',
    menu = document.getElementById('menu'),
    game = document.getElementById('game'),
    e_quest = document.getElementById('question'),
    e_ans = document.getElementById('answers'),
    e_con = document.getElementById('controls');