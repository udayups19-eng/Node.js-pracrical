// Task 2: Function Declarations vs Expressions

// Function Declaration
function add(x, y) {
    return x + y;
}

// Function Expression
const multiply = function (x, y) {
    return x * y;
};

// Call before definition
console.log("Call add before definition:", add(2, 3)); // Works
try {
    console.log("Call multiply before definition:", multiply(2, 3)); // Error
} catch (error) {
    console.log("Error:", error.message);
}

// Call after definition
console.log("Call add after definition:", add(4, 5));
console.log("Call multiply after definition:", multiply(4, 5));
