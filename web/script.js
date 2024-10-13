let QUEST,
    DONE = [];

const floor = Math.floor,
    random = Math.random,
    e_quest = document.getElementById('question'),
    e_ans = document.getElementById('answers');

/**
 * Start a game process. Omit parameters to exit game
 * @param {String} s Subject
 * @param {Number} g Grade
 * @param {Number} i ID
 */
function startGame(s, g, i) {
    if (!s) {
        // exit game
        menu.style.display = '';
        game.style.display = 'none';
        DONE = [];
        return
    }

    menu.style.display = 'none';
    game.style.display = '';

    QUEST = SUBJECTS[s][g][i];

    // set progress bar
    document.getElementById('progress').innerHTML = ''; //clear
    for (let l0 = 0; l0 < QUEST.questions.length; l0++)
        document.getElementById('progress').innerHTML +=
            `<p id="pro${l0}">○</p>`;

    ask();
}

/**
 * Start a question.
 */
function ask() {
    if (DONE.length >= QUEST.questions.length) {
        startGame();
        return false;
    };

    let id = 0;
    do {
        id = floor(random() * QUEST.questions.length);
    } while (DONE.includes(id));

    // set progress bar
    document.getElementById('pro' + id).innerHTML = '◍';

    let curQuest = QUEST.questions[id]; // the question class

    if (curQuest.type == 0) {
        // multiple choices
        e_quest.innerHTML = curQuest.text;
        e_ans.innerHTML = ''; // clear answers
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML = ans;
            li.style.order = floor(random() * 100); // random question order
            li.setAttribute(
                'onclick',
                `check(${id}, "${ans}")`
            )
            e_ans.append(li);
        }
    }
}

function check(id, result) {
    if (QUEST.questions[id].ans[result]) {
        DONE.push(id);
        document.getElementById('pro' + id).innerHTML = '●';
    } else {
        document.getElementById('pro' + id).innerHTML = '◉';
    }

    ask();
}