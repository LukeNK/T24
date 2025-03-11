// ◉○◍●✕▶✔✘□ symbol hot bar

let QUIZ,
    QUIZTIME, // quiz start time
    QUIZLIM,
    QUESTID,
    DONE = [], // completed question to never show again
    AGAIN = []; // wrong questions to try again

const floor = Math.floor,
    random = Math.random,
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
        QUIZ = undefined;
        DONE = []; AGAIN = [];
        return
    }

    menu.style.display = 'none';
    game.style.display = '';

    QUIZ = SUBJECTS[s][g][i];
    QUIZTIME = Date.now();
    QUIZLIM = Math.min(
        QUIZ.questions.length,
        document.getElementById('quizLimit').value
    );

    // display
    document.getElementById('total').innerHTML = QUIZLIM;
    document.getElementById('progress').innerHTML = ''; //clear
    for (let l0 = 0; l0 < QUIZ.questions.length; l0++)
        document.getElementById('progress').innerHTML +=
            `<p id="pro${l0}"></p>`;

    ask();
}

/**
 * Start a question.
 */
function ask() {
    if (DONE.length >= QUIZLIM && AGAIN.length <= 0) {
        let temp = (Date.now() - QUIZTIME) / 1000;
        menu.innerHTML =
            `<p>🎉Vous avez répondu à ${DONE.length} questions en ${floor(temp / 60)}m ${floor(temp % 60)}s</p>`
            + menu.innerHTML;
        startGame();
        return false;
    };

    // select random question
    let id = 0;
    do {
        id = floor(random() * QUIZ.questions.length);
        // bias wrong question
        if (
            (DONE.includes(id) && AGAIN.length > 0)
            || DONE.length >= QUIZLIM
        )
            id = AGAIN[id % AGAIN.length];
    } while (DONE.includes(id));

    QUESTID = id;
    let curQuest = QUIZ.questions[id]; // the question class

    e_quest.innerHTML = curQuest.text;
    e_ans.setAttribute('type', curQuest.type);
    e_ans.innerHTML = ''; // clear answers
    if (curQuest.type == 0 || curQuest.type == 2) {
        // multiple choices or flashcard (2 choices)
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML = ans;
            li.setAttribute(
                'onclick',
                `check('${ans.replaceAll("'", "\\'")}', this)`
            )

            // shuffle answer order or set flashcard
            if (random() < 0.5 || curQuest.type == 2)
                e_ans.append(li);
            else
                e_ans.prepend(li);
        }
    } else if (curQuest.type == 1) {
        // true false
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML =
                `<div>${ans}</div><button onclick="swap(this)">-</button>`; // empty
            if (random() < 0.5) e_ans.append(li);
            else e_ans.prepend(li);
        }

        e_ans.innerHTML +=
            `<button onclick="check()">${CHECKMARK}</button>`;
    } else if (curQuest.type == 3) {
        // short answer
        e_ans.innerHTML += `
            <input id="ansInp" placeholder=" ">
            <button onclick="check()">${CHECKMARK}</button>`;
    } else if (curQuest.type == 4) {
        // written response
        e_ans.innerHTML += `
            <textarea rows="${curQuest.writeLine}"></textarea>
            <button onclick="check()">${CHECKMARK}</button>`;
    }

    e_quest.scrollIntoView();

    // set progress bar and hide hints
    if (AGAIN.includes(id))
        document.getElementById('pro' + id).innerHTML = '◉';
    game.classList.remove('hint');
}

/**
 * Check the answer of the user
 * @param {String} result The key of the answer
 * @param {HTMLElement} elm The answer that was clicked on
 */
function check(result, elm) {
    let id = QUESTID;

    if (game.classList.contains('hint')) ask(); // skip to next question
    else switch (QUIZ.questions[id].type) {
        case 0:
        case 2:
            if (QUIZ.questions[id].ans[result]) report(true);
            else {
                report(false);
                if (elm) elm.classList.add('w');
            }
            break;
        case 1:
            let wrongAns = Object.keys(QUIZ.questions[id].ans).length;
            [...e_ans.querySelectorAll('div')]
            .forEach(elm => {
                if (
                    QUIZ.questions[id].ans[elm.innerHTML]
                    == ((elm.nextElementSibling.innerHTML == CHECKMARK)? 1 : 0)
                ) wrongAns--;
            });

            report(wrongAns <= 0);
            break;
        case 3:
            // check if the answer exist in the allowed answer
            report(QUIZ.questions[id].ans[
                document.getElementById('ansInp').value
            ]);
            break;
        case 4:
            // written response, always correct
            report(true);
            break;
    }

    document.getElementById('done').innerHTML = DONE.length;
}

/**
 * Report to user the correctness of their answer
 * @param {Boolean} correct Validated result
 */
function report(correct) {
    let id = QUESTID;

    if (correct) {
        DONE.push(id);
        AGAIN = AGAIN.filter(v => v != id); // remove from again
        document.getElementById('pro' + id).innerHTML = '';
        e_con.className = 'r';
        ask();
    } else {
        AGAIN.push(id);
        document.getElementById('pro' + id).innerHTML = WMARK;
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

// clear display
startGame()

// hash to load the game as soon as there is a match
let hash = window.location.hash;
hash = [
    hash[1],
    ...hash.substring(2).split('-')
];

try {
    storage = window['localStorage'];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
} catch (e) {
    console.log(e)
    alert(`Redirect to legacy app\nRedirection vers l'application héritée\nĐiều hướng đến phiên bản cũ`);
    window.location.href = 'legacy.html';
}

let curDate = new Date().valueOf(),
    oldDate = new Date(
        parseInt(localStorage.getItem('version'))
    ).valueOf();
// if version is outdated for 12 hours
if (oldDate + 12 * 60 * 60 * 1000 < curDate) {
    localStorage.setItem('version', curDate);
    window.location.href = 'load.html';
}

(() => {
    // iterate through data folder to download files
    for (const subject of Object.keys(SUBJECTS)) {
        const trans = SUBJECTS[subject];
        SUBJECTS[subject] = {}; // clear for array in array

        let list = document.createElement('details');
        list.innerHTML = `<summary class="loading">${trans}</summary>`;
        menu.querySelector('div').append(list);

        for (let grade = 10; grade <= 12; grade++) {
            SUBJECTS[subject][grade] = [];

            for (let id = 0; id < 100; id++) {
                let test = document.createElement('button');
                test.setAttribute(
                    'onclick',
                    `startGame("${subject}", ${grade}, ${id})`
                );
                test.addEventListener('contextmenu', (ev) => {
                    document.getElementById('setting').setAttribute('open', 'true');
                    document.getElementById('setting').scrollIntoView();
                    document.querySelector('#setting summary span').innerHTML =
                        `${subject}${grade}-${id}`;
                    document.getElementById('setStart').onclick = () => test.click();
                    document.getElementById('setPrint').setAttribute(
                        'onclick',
                        `window.location.href = '${window.location.href}print.html#${subject}${grade}-${id}'`
                    );
                    ev.preventDefault();
                })

                // else, load the quiz
                let response = localStorage.getItem(`${subject}${grade}-${id}`);
                if (!response) break;
                response = parse(response);
                test.innerHTML = grade + '. ' + response.meta.name;

                // set config
                document.getElementById('quizLimit').max =
                    Math.max(
                        document.getElementById('quizLimit').max,
                        response.questions.length
                    );
                document.getElementById('quizLimit').value =
                    document.getElementById('quizLimit').max;

                SUBJECTS[subject][grade].push(response);
                list.prepend(test); // reverse sort

                // start game the moment it is available
                if (
                    hash[0] == subject
                    && hash[1] == grade
                    && hash[2] == id
                )
                    startGame(hash[0], hash[1], hash[2]);
            }
        }

        list.querySelector('summary').classList.remove('loading');
    }
})();