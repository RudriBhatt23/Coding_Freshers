const questions = [

        {
            question: "Who invented C++?", 
            answers: [
                { text: "Dennis Ritchie", correct: false }, 
                { text: "Ken Thompson", correct: false },
                { text: "Brian Kernighan", correct: false }, 
                { text: "Bjarne Stroustrup", correct: true },
            ]
        },
        {
            question: "What is C++?", 
            answers: [
                { text: "C++ is an object-oriented programming language", correct: false }, 
                { text: "C++ is a procedural programming language", correct: false },
                { text: "C++ supports both procedural and object-oriented programming language", correct: true }, 
                { text: "C++ is a functional programming language", correct: false },
            ]
        },
        {
            question: "Which of the following is the correct syntax of including a user-defined header files in C++?", 
            answers: [
                { text: "#include [userdefined]", correct: false }, 
                { text: "#include “userdefined”", correct: true },
                { text: "#include <userdefined.h>", correct: false }, 
                { text: "#include <userdefined>", correct: false },
            ]
        },
        {
            question: "Which of the following is used for comments in C++?", 
            answers: [
                { text: "/* comment */", correct: false }, 
                { text: "// comment */", correct: false },
                { text: "// comment", correct: true }, 
                { text: "both // comment or /* comment */", correct: false },
            ]
        },
        {
            question: "Which of the following user-defined header file extension used in C++?", 
            answers: [
                { text: "hg", correct: false }, 
                { text: "cpp", correct: false },
                { text: "h", correct: true }, 
                { text: "hf", correct: false },
            ]
        },
        {
            question: "Which of the following is a correct identifier in C++?", 
            answers: [
                { text: "VAR_1234", correct: true }, 
                { text: "$var_name", correct: false },
                { text: "7VARNAME", correct: false }, 
                { text: "7var_name", correct: false },
            ]
        },
        {
            question: "Which of the following is not a type of Constructor in C++?", 
            answers: [
                { text: "Default constructor", correct: false }, 
                { text: "Parameterized constructor", correct: false },
                { text: "Copy constructor", correct: false }, 
                { text: "Friend constructor", correct: true },
            ]
        },
        {
            question: "Which of the following approach is used by C++?", 
            answers: [
                { text: "Left-right", correct: false }, 
                { text: "Right-left", correct: false },
                { text: "Bottom-up", correct: true }, 
                { text: "Top-down", correct: false },
            ]
        },
        {
            question: "What is virtual inheritance in C++?", 
            answers: [
                { text: "C++ technique to enhance multiple inheritance", correct: false }, 
                { text: "C++ technique to ensure that a private member of the base class can be accessed somehow", correct: false },
                { text: "C++ technique to avoid multiple inheritances of classes", correct: false }, 
                { text: "C++ technique to avoid multiple copies of the base class into children/derived class", correct: true },
            ]
        },
        {
            question: "What happens if the following C++ statement is compiled and executed?\n\nint *ptr = NULL;\ndelete ptr;", 
            answers: [
                { text: "The program is not semantically correct", correct: false }, 
                { text: "The program is compiled and executed successfully", correct: true },
                { text: "The program gives a compile-time error", correct: false }, 
                { text: "The program compiled successfully but throws an error during run-time", correct: false },
            ]
        },
        {
            question: "What will be the output of the following C++ code?\n\n#include <iostream>\n#include <string>\nusing namespace std;\nint main(int argc, char const *argv[])\n{\n\tchar s1[6] = \"Hello\";\n\tchar s2[6] = \"World\";\n\tchar s3[12] = s1 + \" \" + s2;\n\tcout<<s3;\n\treturn 0;\n}",
            answers: [
                { text: "Hello", correct: false }, 
                { text: "World", correct: false },
                { text: "Error", correct: true }, 
                { text: "Hello World", correct: false },
            ]
        },
   
]
const questionElement = document.getElementById("question");
const answerButtons = document. getElementById("answer-buttons");
const nextButton = document. getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton. innerHTML = "Next";
    showQuestion();
}

function showQuestion(){

    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement. innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers. forEach(answer => {
        const button = document. createElement ("button");
        button. innerHTML = answer.text;
        button.classList.add ("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild)
    }
}

function selectAnswer(e){
    const selectedbtn = e.target;
    const isCorrect = selectedbtn.dataset. correct === "true";
    if(isCorrect){
        selectedbtn.classList.add("correct");
        score++;
    }
    else{
        selectedbtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block"
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

 
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
    showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})
startQuiz();