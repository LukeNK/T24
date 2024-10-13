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

    }
    QUEST = SUBJECTS[s][g][i];
}

/**
 * Start a question.
 */
function ask() {
    if (DONE.length >= QUEST.length) return false;

    let n = 0;
    do {
        n = floor(random() * QUEST.questions.length);
    } while (DONE.includes(n));

    n = QUEST.questions[n]; // the question class
    e_quest.innerHTML = n.text;
    e_ans.innerHTML = ''; // clear answers
    for (const ans in n.ans) {
        let li = document.createElement('li');
        li.innerHTML = ans;
        e_ans.append(li);
    }
}

