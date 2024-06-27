const questions = [
    {
        question: "Who invented Java Programming?", 
        answers: [
            { text: "Guido van Rossum", correct: false }, 
            { text: "James Gosling", correct: true },
            { text: "Dennis Ritchie", correct: false }, 
            { text: "Bjarne Stroustrup", correct: false },
        ]
    },
    {
        question: "Which statement is true about Java?", 
        answers: [
            { text: "Java is a sequence-dependent programming language", correct: false }, 
            { text: "Java is a code dependent programming language", correct: false },
            { text: "Java is a platform-dependent programming language", correct: false }, 
            { text: "Java is a platform-independent programming language", correct: true },
        ]
    },
    {
        question: "Which component is used to compile, debug, and execute the Java programs?", 
        answers: [
            { text: "JRE", correct: false }, 
            { text: "JIT", correct: false },
            { text: "JDK", correct: true }, 
            { text: "JVM", correct: false },
        ]
    },
    {
        question: "Which one of the following is not a Java feature?", 
        answers: [
            { text: "Object-oriented", correct: true }, 
            { text: "Use of pointers", correct: false },
            { text: "Portable", correct: false }, 
            { text: "Dynamic and Extensible", correct: false },
        ]
    },
    {
        question: "Which of these cannot be used for a variable name in Java?", 
        answers: [
            { text: "identifier & keyword", correct: false }, 
            { text: "identifier", correct: false },
            { text: "keyword", correct: true }, 
            { text: "none of the mentioned", correct: false },
        ]
    },
    {
        question: "What is the extension of Java code files?", 
        answers: [
            { text: ".js", correct: false }, 
            { text: ".txt", correct: false },
            { text: ".class", correct: false }, 
            { text: ".java", correct: true },
        ]
    },
    {
        question: "What will be the output of the following Java code?\nclass increment {\npublic static void main(String args[]) {\nint g = 3;\nSystem.out.print(++g * 8);\n}\n}", 
        answers: [
            { text: "32", correct: true }, 
            { text: "33", correct: false },
            { text: "24", correct: false }, 
            { text: "25", correct: false },
        ]
    },
    {
        question: "Which environment variable is used to set the Java path?", 
        answers: [
            { text: "MAVEN_Path", correct: false }, 
            { text: "JavaPATH", correct: false },
            { text: "JAVA", correct: false }, 
            { text: "JAVA_HOME", correct: true },
        ]
    },
    {
        question: "What will be the output of the following Java program?\nclass output {\npublic static void main(String args[]) {\ndouble a, b, c;\na = 3.0/0;\nb = 0/4.0;\nc = 0/0.0;\nSystem.out.println(a);\nSystem.out.println(b);\nSystem.out.println(c);\n}\n}", 
        answers: [
            { text: "NaN", correct: false }, 
            { text: "Infinity", correct: false },
            { text: "0.0", correct: false }, 
            { text: "all of the mentioned", correct: true },
        ]
    },
    {
        question: "Which of the following is not an OOPS concept in Java?", 
        answers: [
            { text: "Polymorphism", correct: false }, 
            { text: "Inheritance", correct: false },
            { text: "Compilation", correct: true }, 
            { text: "Encapsulation", correct: false },
        ]
    },
    {
        question: "What is not the use of “this” keyword in Java?", 
        answers: [
            { text: "Referring to the instance variable when a local variable has the same name", correct: false }, 
            { text: "Passing itself to the method of the same class", correct: true },
            { text: "Passing itself to another method", correct: false }, 
            { text: "Calling another constructor in constructor chaining", correct: false },
        ]
    },
    {
        question: "What will be the output of the following Java program?\nclass variable_scope {\npublic static void main(String args[]) {\nint x;\nx = 5;\n{\nint y = 6;\nSystem.out.print(x + \" \" + y);\n}\nSystem.out.println(x + \" \" + y);\n}\n}", 
        answers: [
            { text: "Compilation error", correct: true }, 
            { text: "Runtime error", correct: false },
            { text: "5 6 5 6", correct: false }, 
            { text: "5 6 5", correct: false }
        ]
    },
    {
        question: "What will be the error in the following Java code?\nbyte b = 50;\nb = b * 50;",
        answers: [
            { text: "b cannot contain value 50", correct: false }, 
            { text: "b cannot contain value 100, limited by its range", correct: true },
            { text: "No error in this code", correct: false }, 
            { text: "* operator has converted b * 50 into int, which cannot be converted to byte without casting", correct: false },
        ]
    },
    {
        question: "Which of the following is a type of polymorphism in Java Programming?",
        answers: [
            { text: "Multiple polymorphism", correct: false }, 
            { text: "Compile time polymorphism", correct: true },
            { text: "Multilevel polymorphism", correct: false }, 
            { text: "Execution time polymorphism", correct: false },
        ]
    },
    {
        question: "What will be the output of the following Java program?\nclass leftshift_operator {\npublic static void main(String args[]) {\nbyte x = 64;\nint i;\nbyte y;\ni = x << 2;\ny = (byte) (x << 2);\nSystem.out.print(i + \" \" + y);\n}\n}",
        answers: [
            { text: "0 256", correct: false }, 
            { text: "0 64", correct: false },
            { text: "256 0", correct: true }, 
            { text: "64 0", correct: false },
        ]
    }
];




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