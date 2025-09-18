// Task 3: Arrow Functions vs Normal Functions

const obj = {
    normalFunc: function () {
        console.log("Normal function, this = ", this);
    },
    arrowFunc: () => {
        console.log("Arrow function, this = ", this);
    }
};

obj.normalFunc();  // "this" refers to obj
obj.arrowFunc();   // "this" refers to outer scope (not obj)
