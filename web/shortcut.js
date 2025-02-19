document.addEventListener('keydown', ev => {
    if (
        !QUIZ
        || ev.repeat
        || ev.ctrlKey
        || ev.metaKey
        || ev.altKey
    ) return;

    switch(ev.key) {
        case 'ArrowRight': case ' ':
            // if it is flashcard, toggle flashcard
            // if it is short answer, don't register shortcut
            // else, check the answer
            if (QUIZ.questions[QUESTID].type == 2) {
                e_quest.querySelector('details').toggleAttribute('open');
                break;
            } else if (
                QUIZ.questions[QUESTID].type == 3
                || QUIZ.questions[QUESTID].type == 4
            )
                break;
        case 'Enter':
            if (QUIZ.questions[QUESTID].type == 4) break; // allow new line
            check();
            break;
        case 'Escape':
            startGame();
            break;
    }

    let ansItem = ev.key - 1;
    if (!Number.isInteger(ansItem)) return;

    switch (QUIZ.questions[QUESTID].type) {
        case 0: case 2:
            ansItem = e_ans.children.item(ev.key - 1);
            break;
        case 1:
            ansItem = e_ans.children.item(ev.key - 1).querySelector('button');
            break;
        default:
            return; // return to avoid clicking
    }

    ansItem.click();
})