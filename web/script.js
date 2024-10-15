// ◉○◍●✕▶✔✘□ symbol hot bar

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

    QUESTID = id;
    let curQuest = QUEST.questions[id]; // the question class

    e_ans.setAttribute('type', curQuest.type);
    e_ans.innerHTML = ''; // clear answers
    if (curQuest.type == 0) {
        // multiple choices
        e_quest.innerHTML = curQuest.text;
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML = ans;
            li.style.order = floor(random() * 100); // random question order
            li.setAttribute(
                'onclick',
                `check(${id}, '${ans.replaceAll("'", "\\'")}', this)`
            )
            e_ans.append(li);
        }
    } if (curQuest.type == 1) {
        // true false
        e_quest.innerHTML = curQuest.text;
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML = ans + '<button onclick="swap(this)">✘</button>';
            li.style.order = floor(random() * -100); // negative to show after check button
            e_ans.append(li);
        }

        e_ans.innerHTML +=
            `<button onclick="check(${id})">Kiểm tra kết quả</button>`;
    }

    e_quest.scrollIntoView();

    // set progress bar and hide hints
    document.getElementById('pro' + id).innerHTML = '';
    game.classList.remove('hint');
}

/**
 * Check the answer of the user
 * @param {Number} id Question ID
 * @param {String} result The key of the answer
 * @param {HTMLElement} elm The answer that was clicked on
 */
function check(id, result, elm) {
    if (game.classList.contains('hint')) ask(); // skip to next question
    else if (QUEST.questions[id].type == 0) {
        if (QUEST.questions[id].ans[result]) report(id, true);
        else {
            report(id)
            if (elm) elm.classList.add('w');
        }
    } else if (QUEST.questions[id].type == 1) {
        let wrongAns = Object.keys(QUEST.questions[id].ans).length;
        [...e_ans.children].forEach(elm => {
            if (elm.tagName == 'BUTTON')
                return; // check button
            result = elm.innerHTML.split('<button')[0];
            if (
                QUEST.questions[id].ans[result]
                == ((elm.querySelector('button').innerHTML == CHECKMARK)? 1 : 0)
            ) wrongAns--;
        });

        report(id, wrongAns <= 0);
    }

    document.getElementById('done').innerHTML = DONE.length;
}

/**
 * Report to user the correctness of their answer
 * @param {Number} id Question ID
 * @param {Boolean} correct Validated result
 */
function report(id, correct) {
    if (correct) {
        DONE.push(id);
        document.getElementById('pro' + id).innerHTML = '';
        e_con.className = 'r';
        ask();
    } else {
        document.getElementById('pro' + id).innerHTML = '●';
        e_con.className = 'w';
        game.classList.add('hint');
    }
}

/**
 * Switch true false of a question
 * @param {HTMLButtonElement} btn Button to switch
 */
function swap(btn) {
    if (btn.innerHTML == CHECKMARK) btn.innerHTML = XMARK;
    else btn.innerHTML = CHECKMARK;
}