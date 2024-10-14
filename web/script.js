let QUEST,
    DONE = [];

const floor = Math.floor,
    random = Math.random,
    e_quest = document.getElementById('question'),
    e_ans = document.getElementById('answers'),
    e_con = document.getElementById('controls');

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

    // display
    document.getElementById('total').innerHTML = QUEST.questions.length;
    document.getElementById('progress').innerHTML = ''; //clear
    for (let l0 = 0; l0 < QUEST.questions.length; l0++)
        document.getElementById('progress').innerHTML +=
            `<p id="pro${l0}"></p>`;

    ask();
}

/**
 * Start a question.
 * ◉○◍●✕
 */
function ask() {
    if (DONE.length >= QUEST.questions.length) {
        startGame();
        return false;
    };

    // select random question
    let id = 0;
    do {
        id = floor(random() * QUEST.questions.length);
    } while (DONE.includes(id));

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
                `check(${id}, '${ans.replaceAll("'", "\\'")}')`
            )
            e_ans.append(li);
        }
    }

    // set progress bar and hide hints
    document.getElementById('pro' + id).innerHTML = '';
    game.classList.remove('hint');
}

/**
 * Check the answer of the user
 * @param {Number} id Question ID
 * @param {String} result The key of the answer
 */
function check(id, result) {
    if (game.classList.contains('hint')) ask(); // skip to next question
    else if (QUEST.questions[id].type == 0) {
        if (QUEST.questions[id].ans[result]) {
            DONE.push(id);
            document.getElementById('pro' + id).innerHTML = '';
            e_con.className = 'r';
            ask();
        } else {
            document.getElementById('pro' + id).innerHTML = '✕';
            e_con.className = 'w';
            game.classList.add('hint');
        }
    }

    document.getElementById('done').innerHTML = DONE.length;
}