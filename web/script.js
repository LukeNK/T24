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
            `<p>🎉Hoàn thành ${DONE.length} câu trong ${floor(temp / 60)}m ${floor(temp % 60)}s</p>`
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

    e_ans.setAttribute('type', curQuest.type);
    e_ans.innerHTML = ''; // clear answers
    if (curQuest.type == 0 || curQuest.type == 2) {
        // multiple choices or flashcard (2 choices)
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
    } else if (curQuest.type == 1) {
        // true false
        e_quest.innerHTML = curQuest.text;
        for (const ans in curQuest.ans) {
            let li = document.createElement('li');
            li.innerHTML =
                ans + '<button onclick="swap(this)">-</button>'; // empty
            li.style.order = floor(random() * -100); // negative to show after check button
            e_ans.append(li);
        }

        e_ans.innerHTML +=
            `<button onclick="check(${id})">Kiểm tra kết quả</button>`;
    }

    e_quest.scrollIntoView();

    // set progress bar and hide hints
    if (AGAIN.includes(id))
        document.getElementById('pro' + id).innerHTML = '◉';
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
    else if (QUIZ.questions[id].type == 0 || QUIZ.questions[id].type == 2) {
        if (QUIZ.questions[id].ans[result]) report(id, true);
        else {
            report(id)
            if (elm) elm.classList.add('w');
        }
    } else if (QUIZ.questions[id].type == 1) {
        let wrongAns = Object.keys(QUIZ.questions[id].ans).length;
        [...e_ans.children].forEach(elm => {
            if (elm.tagName == 'BUTTON')
                return; // check button
            result = elm.innerHTML.split('<button')[0];
            if (
                QUIZ.questions[id].ans[result]
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

let TESTLOAD = 0, TESTFIRST = true;
/**
 * Track if all tests are loaded
 * @param {Boolean} loaded If the test is loaded
 * @returns {Boolean} Returns true if all tests are loaded
 */
function loadTracker(loaded) {
    TESTFIRST = false;
    TESTLOAD += (loaded)? -1 : 1;
    return !(TESTLOAD || TESTFIRST);
}

// iterate through data folder to download files
for (const subject in SUBJECTS) {
    const trans = SUBJECTS[subject];
    SUBJECTS[subject] = {}; // clear for array in array

    for (let grade = 10; grade <= 10; grade++) {
        SUBJECTS[subject][grade] = [];
        let list = document.createElement('details');
        list.setAttribute('open', 'true');
        list.innerHTML = `<summary>${trans} ${grade}</summary>`;

        loadTracker(); // track loading progress

        (async () => {
            for (let id = 0; id < 100; id++) {
                let test = document.createElement('button');
                test.setAttribute(
                    'onclick',
                    `startGame("${subject}", ${grade}, ${id})`
                );

                let response =
                    await fetch(`data/${subject}${grade}/${id}.html`);

                if (!response.ok) {
                    if (loadTracker(true)) {
                        let hash = window.location.hash;
                        try {
                            console.info('Starting ' + hash)
                            startGame(
                                hash[1],
                                hash.substring(2).split('-')[0],
                                hash.substring(2).split('-')[1],
                            )
                        } catch (err) {
                            // just clear the display screen
                            console.info('Just clear the screen')
                            startGame();
                        }
                    };
                    break; // no more test
                };
                response = await response.text();
                response = parse(response);
                test.innerText = response.meta.name;

                // set config
                document.getElementById('quizLimit').max =
                    Math.max(
                        document.getElementById('quizLimit').max,
                        response.questions.length
                    );
                document.getElementById('quizLimit').value =
                    document.getElementById('quizLimit').max;

                // loading bar
                document.getElementById('progress').innerHTML += '●';
                SUBJECTS[subject][grade].push(response);
                list.prepend(test); // reverse sort
            }

            // only append if there is a test
            if (list.childElementCount > 1) menu.prepend(list);
        })();
    }
}