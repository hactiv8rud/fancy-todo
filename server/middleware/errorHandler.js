function errorHandler(err, req, res, next) {
    console.log(err);
    if (err.status) {
        res.status(err.status).json({ message: err.message });
    } else if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError" ) {
            let errors = [];
            let tempMessage;
            for (let i = 0; i < err.errors.length; i++) {
                if(err.errors[i].message === "Password must be at least 6 characters.") {
                    tempMessage = err.errors[i].message;
                } else if (err.errors[i].message === "Email is invalid.") {
                    if (!errors.includes("Email is required.")) {
                        errors.push(err.errors[i].message);
                    }
                } else if (err.errors[i].message === "Due date must be greater than today.") {
                    if (!errors.includes("Due date is required.")) {
                        errors.push(err.errors[i].message);
                    }
                } else {
                    if(!errors.includes(err.errors[i].message)) {
                        errors.push(err.errors[i].message);
                    }
                }
            }
            if (tempMessage) {
                errors.push(tempMessage);
            }
        res.status(400).json({ messages: errors });
    } else if (err.name === "TokenExpiredError") {
        res.status(419).json({ message: "Your session has expired." })
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = errorHandler;