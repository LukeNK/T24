let SUBJECTS = {
    'h': 'Lịch Sử',
    'l': 'Ngữ văn',
    'p': 'Vật Lý'
}

const menu = document.getElementById('menu'),
    game = document.getElementById('game');

class Question {
    constructor(text) {
        this.text = text;
        this.type = 0; // 0 for multiple choice, 1 for true/false
        this.ans = {};

        return this;
    }
    add(answer, correct) {
        if (
            correct === undefined
            && this.type === 0
            && Object.keys(this.ans) == 0
        )
            correct = true; // default first answer as correct

        this.ans[answer] = correct || false;

        return this;
    }
}

/**
 * Parse result according to format
 * @param {String} data
 */
function parse(data) {
    let questions = [], meta = {},
        curQuestion;

    data = data + '\nEND-OF-INPUT, OVERFLOW FOR SAVING LAST QUESTION';
    data = data.split('\n');

    data.forEach((line, lineNumber) => {
        if (line == '')
            return; // skip empty lines
        else if (line[0] == '#')
            meta.name = line.substring(1).trim();
        else if (line.startsWith('    ') || line.startsWith('\t')) {
            line = line.trim();
            if (line.startsWith('+') || line.startsWith('-'))
                curQuestion.add(
                    line.substring(1).trim(),
                    line[0] == "+" ? true : false
                );
            else
                curQuestion.add(line);
        } else if (line.trim().length > 3) { // new question, check length just to be sure
            if (curQuestion)
                questions.push(curQuestion); // only push if there is an old question
            curQuestion = new Question(line);
        } else
            throw SyntaxError('Parser code failure at ' + lineNumber + '\n' + line);
    });

    return { meta, questions }
}

// iterate through data folder to download files
const INIT = async () => {
    for (const subject in SUBJECTS) {
        const trans = SUBJECTS[subject];
        SUBJECTS[subject] = {}; // clear for array in array

        for (let grade = 10; grade <= 10; grade++) {
            SUBJECTS[subject][grade] = [];
            let list = document.createElement('details');
            list.setAttribute('open', 'true');
            list.innerHTML = `<summary>${trans} ${grade}</summary>`;

            for (let id = 0; id < 100; id++) {
                let test = document.createElement('button');
                test.setAttribute(
                    'onclick',
                    `startGame("${subject}", ${grade}, ${id})`
                );

                let response =
                    await fetch(`data/${subject}${grade}/${id}.html`);
                if (!response.ok) break; // no more test
                response = await response.text();
                response = parse(response);
                test.innerText = response.meta.name;

                SUBJECTS[subject][grade].push(response);
                list.append(test);
            }

            // only append if there is a test
            if (list.childElementCount > 1) menu.append(list);
        }
    }

    startGame(); // init after data loaded
};
INIT();