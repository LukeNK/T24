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

let QUESTION_LIST = [];


/**
 * Parse result according to format
 * @param {String} data
 */
function parse(data) {
    let curQuestion;

    data = data + 'END-OF-INPUT, OVERFLOW FOR SAVING LAST QUESTION';
    data = data.split('\n');

    data.forEach((line, lineNumber) => {
        if (line == '')
            return; // skip empty lines
        else if (line.startsWith('    ') || line.startsWith('\t')) {
            line = line.trim();
            if (line.startsWith('+') || line.startsWith('-'))
                curQuestion.add(
                    line.substring(1),
                    line[0] == "+" ? true : false
                );
            else
                curQuestion.add(line);
        } else if (line.trim().length > 3) { // new question, check length just to be sure
            if (curQuestion)
                QUESTION_LIST.push(curQuestion); // only push if there is an old question
            curQuestion = new Question(line);
        } else
            throw SyntaxError('Parser code failure at ' + lineNumber + '\n' + line);
    });
}

parse(`



Đây là một câu hỏi trắc nghiệm
    Đây là một câu trả lời, được thụt vào trong bằng tab. Câu trả lời đầu tiên sẽ mặc định là câu trả lời đúng.
    Xuống dòng để tạo ra những đáp án khác.
    Không có giới hạn số lượng đáp án.
    Bạn nên cách một dòng trống giữa các câu hỏi, nhưng không bắt buộc.

Đi vào lề để tạo ra một câu hỏi mới. Đây là ví dụ cho câu hỏi đúng sai.
    + Mỗi dòng sẽ bắt đầu bằng việc thụt lề, sau đó để dấu cộng để đánh câu trả lời này là đúng.
    - Dấu trừ để đánh câu trả lời này là sai.
    + Trước khi viết câu hỏi đúng sai, mọi người nên thêm một khoảng trắng sau dấu cộng
`)