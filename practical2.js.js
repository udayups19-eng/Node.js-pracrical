// Task 1: Hoisting in Variables

console.log("Using var:");
try {
    console.log(a); // undefined (hoisted but not initialized)
    var a = 10;
    console.log(a); // 10
} catch (error) {
    console.log("Error:", error.message);
}

console.log("\nUsing let:");
try {
    console.log(b); // Error (Cannot access before initialization)
    let b = 20;
    console.log(b);
} catch (error) {
    console.log("Error:", error.message);
}

console.log("\nUsing const:");
try {
    console.log(c); // Error (Cannot access before initialization)
    const c = 30;
    console.log(c);
} catch (error) {
    console.log("Error:", error.message);
}
