![Logo which looks like a light bulb with a question marking going through the center](web/logo.svg)

# T24
I honestly don't know how to name this app, so I guess I will settle with the year marker of my class then. T24 is a Russian tank but this has nothing to do with that.

## Gameplay
After starting a quiz, the user will ask to answer 1 question at a time. If they answer the question incorrectly or skip it, the answer hints will show and they will need to answer the question later. The quiz will be finished once all of the questions are answered correctly. For flashcards, it works in a similar manner but in this case, the "correct" answer is marking the question as "memorized".

If user adjusted `quizLimit`, then the quiz will only end once the user has answered correctly the set amount. If there are still wrong questions to be answer, the user must also answer all of them in order to end the quiz.

## Data structure
The general format of quiz filename in `data/` is:
```xml
data/<subject><grade>/<id>.html
```
Where:
- `<subject>` and its translation is defined in `web/data.js`
- `<grade>` is currectly default at 10 right now
- `<id>` is the unique ID of the question list

When refering to "quiz ID", simply replace the slash with a hyphen.

## Quiz file syntax
```html
# The title of the quiz is after a hash

This is a multiple choice question
    The answer will be indented with tab or 4 spaces, the first answer will be marked as the correct one
    Add a newline for a new answer. There is no answer upper limit but there should be at least one answer.
    The answers will be randomized when showing to the user.
    Empty lines will be ignored

Remove indentation to add a new question. This is a true-false question. <blockquote>This question has answer hints</blockquote>
    <!-- If an answer line starts with a less-than sign (symbolize for a HTML tag) then it will be inserted to the question's text instead of being a separate answer. -->
    <p>You can insert as many extra text as you'd like
        <br>You can indent too, as long as it starts with the answer indent rule (4 spaces or a tab at the very start of the line)
        <br>And as long as the text starts with a less-than sign
    </p>
    + Start with a plus to mark this sub-question's answer as true.
    - The user should mark this as false because this sub-question starts with a minus.
    + You should add a space after the plus/minus for readability.
    + You can add hints, which will be show if the user answer wrong. <blockquote>You can put them anywhere AFTER the main display element</blockquote>

This is a test flashcard, which will be displayed with details tag.
    <i>For flashcard specifically, a line starts with a less-than sign will be insert to the summary tag</i>
    > A line starts with a greater-than sign is the content. User can open/close the flashcard, and there will be buttons to mark as remembered or not.
    <!-- But if a HTML tag appear after the greater sign (symbolize for flashcard content) then it will be insered into the flashcard body -->

This is a short-answer question.
    = The result starts with an equal sign
    = There can be multiple answers
    = You can also add the number of lines for users to write when printing the quiz
    _ 100

A written response that expects no answer, in which case there will be space to answer but no automatic grading.
    _ 10

39
    ? You can also add question number to the questions
    Simply put the question number without indent
    Then the indented line starts with a question mark will be the question
```

## Quiz-printing
With the correct quiz ID, you can print the quiz at [print.html](https://lukenk.github.io/T24/print.html). Features includes
- Date + data checksum + answer checksum to make sure you have the most up-to-date quiz.
- Seeded random-shuffled answers (which you can load the seed to have an answer key)
- Space to answer on the right, so you can simply cover it whenever you want to test yourself.
- Option to show/hide wrong options or hints
- Inspirational quotes provided by [LukeNK](https://lukenk.github.io/)

## Tools
- [Table to HTML](https://tableconvert.com/excel-to-html)

# Removed introduction
I was trying to find an alternative against all of the popular quizzing apps, when I decided to program this app because why not.
| App | Main drawback |
| - | - |
| Kahoot | Question length limit |
| Quizizz | No images |
| Other apps (user) | No one-click solution to send to my classmates without having to instruct them how to use the app |
| Other apps (creator) | No collaboration (or at least a simply way and mobile-friendly) |

Regarding the user side, this app can simply fix it by simply making the process of starting a quiz as simply as clicking a button. This also allow me to optimize loading time and reduce the cellular data usage. Mobile-friendliness is also another factor that made me do this project

Collaboration is a bit harder, which I attempted to do a server-less approach (from my side at least). My suggestions are (from the least to the most work for me):
- showing people the quiz file syntax and having them to type out the question
- having people to type out the question in a Google Form
- having them type out the question in file syntax in a Google Docs

The reason the last one is not preferred is because most of the people in my class only have cellphones and are very relunctant to install Google.

*Unfortunately, it turned out there aren't that many people who actually want to study in my school. However, I still keep this project alive for my own usage (for example, the print layout). That is why I switched the UI language to French as I am learning it and at the same time, I am notating the questions in English as that is the language I am most comfortable with. Of course, the questions are given to me in Vietnamese by my teachers, so essentially there are three languages in this app.*