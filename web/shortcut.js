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
            if (QUIZ.questions[QUESTID].type == 3) break;
        case 'Enter':
            check(QUESTID);
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