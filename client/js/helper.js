function showLoginPage() {
    $("#login-page").show();
    $("#register-page").hide();
    $("#navbar").hide();
    $("#notification-container").empty();
    $("#main-page").hide();
    $('.body-container').addClass("center-viewport");
    if (!isInfoShown) {
        showInfo();
        isInfoShown = true;
    }
}

function showRegisterPage() {
    $("#login-page").hide();
    $("#register-page").show();
    $("#navbar").hide();
    $("#notification-container").empty();
    $("#main-page").hide();
    $('.body-container').addClass("center-viewport");
}

function showMainPage(accesstoken, csrftoken, fullName) {
    $('html, body').removeClass("no-vertical-scroll");
    $('.body-container').removeClass("center-viewport");
    getCurrentWeather(accesstoken, csrftoken);
    getQuote(accesstoken, csrftoken);
    $("#user-name").text("");
    $("#user-name").text(fullName);
    $("#login-page").hide();
    $("#register-page").hide();
    $("#navbar").show();
    $("#notification-container").empty();
    $("#main-page").show();
    $("#quote-text").text("");
    $("#quote-author").text("");
    //     $("#quote-author").text("");
    // if(localStorage.getItem("quoteText") !== "") {
    //     $("#quote-text").text("");
    //     $("#quote-author").text("");
    // }
    // $("#quote-text").text(localStorage.getItem("quoteText"));
    // $("#quote-author").text(`- ${localStorage.getItem("quoteAuthor")} -`);
    fetchTodos(accesstoken, csrftoken);
}

function showInfo() {
    const techStack = ["HTML5", "CSS3", "jQuery", "Bootstrap", "Express", "Sequelize", "Node.js", "PostgresSQL", "JavaScript"];
    $('#tech-stack-deck').empty();
    for(let i = 0; i < techStack.length; i++) {
        $('#tech-stack-deck').append(`
             <div class="col-4">
                <div class="card">
                    <img class="card-img-top" src="./images/${techStack[i]}.svg" alt="${techStack[i]}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${techStack[i]}</h5>
                    </div>
                </div>
            </div>
        `);
    }
    $('#info-modal').modal('show');
}

function login(){
    const email = $("#login-email").val();
    const password = $("#login-password").val();

    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: {
            email,
            password
        }
    })
        .done(response => {
            // localStorage.setItem("accesstoken", response.accesstoken);
            // localStorage.setItem("fullName", response.fullName);
            // getQuote();
            accesstoken = response.accessToken;
            csrftoken = response.csrfToken;
            fullName = response.fullName;
            showMainPage(accesstoken, csrftoken, fullName);
            Swal.fire(
                'Logged In!',
                "Welcome!",
                'success'
                )
        })
        .fail((err) => {
            console.log(err);
            printError(err);
        })
        .always(() => {
            $("#login-email").val("");
            $("#login-password").val("");
        })
}

function reauth(cb, id, event) {
    $.ajax({
        url: "http://localhost:3000/reauth",
        method: "POST",
        xhrFields: {
            withCredentials: true
         },
        data: {}
    })
        .done(response => {
            // localStorage.setItem("accesstoken", response.accesstoken);
            // localStorage.setItem("fullName", response.fullName);
            // getQuote();
            accesstoken = response.accessToken;
            csrftoken = response.csrfToken;
            fullName = response.fullName;
            // $("#user-name").text(fullName);
            if (!isAuthenticated) {
                showMainPage(accesstoken, csrftoken, fullName);
                isAuthenticated = true;
            } else if (id && event) {
                cb(accesstoken, csrftoken, id, event);
            } else if (id) {
                cb(accesstoken, csrftoken, id)
            } else {
                cb(accesstoken, csrftoken)
            }
        })
        .fail((err) => {
            isAuthenticated = false;
            showLoginPage();
            // console.log(err);
            // printError(err);
        })
}

function register(){
    const first_name = $("#register-first_name").val();
    const last_name = $("#register-last_name").val();
    const email = $("#register-email").val();
    const password = $("#register-password").val();
    $.ajax({
        url: "http://localhost:3000/register",
        method: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: {
            first_name,
            last_name,
            email,
            password
        }
    })
        .done((response) => {
            showLoginPage();
            Swal.fire(
                'Registered!',
                "Please sign in!",
                'success'
                )
        })
        .fail((err) => {
            console.log(err);
            printError(err);
        })
        .always(() => {
            $("#register-form").trigger("reset");
        })
}

function logout(accesstoken, csrftoken) {
    // localStorage.clear();
    showLoginPage();
    $.ajax({
        url: "http://localhost:3000/logout",
        method: "POST",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        }
    })
    .done((response) => {
        isAuthenticated = false;
        showLoginPage();  
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(logout);
        } else {
            console.log(err);
            printError(err);
        }
    })
    // var auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function() {
    //   console.log('User signed out.');
    // })
}

function handleCredentialResponse(response) {
    var googleToken = response.credential;
    $.ajax({
        url: "http://localhost:3000/googleLogin",
        method: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: {
            googleToken
        }
    })
    .done((response) => {
        // localStorage.setItem("accesstoken", response.accesstoken);
        // localStorage.setItem("fullName", response.fullName);
        // getQuote();
        accesstoken = response.accessToken;
        csrftoken = response.csrfToken;
        fullName = response.fullName;
        showMainPage(accesstoken, csrftoken, fullName);
        Swal.fire(
            'Logged In!',
            "Welcome!",
            'success'
            )
    })
    .fail((err) => {
        console.log(err);
        printeError(err);
    })
}

function fetchTodos(accesstoken, csrftoken){
    $("#notification-container").empty();
    $("#edit-form-notification-container").empty();
    $.ajax({
        method: "POST",
        url : "http://localhost:3000/todos",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        }
    })
    .done((response) => {
        $("#main-uncompleted-content").empty();
        $("#main-completed-content").empty();
        $("#main-expired-content").empty();
        const today = new Date;
        response.forEach((result) => {
            const due_date = formatDueDate(result.due_date);
            if(result.status === "uncompleted") {
                if(new Date(result.due_date) < today) {
                    $("#main-expired-content").append(`
                    <div class="card" style="width:100%">
                        <div class="card-body expired">
                            <h5 class="card-title" style="background-color:#ff6666">${result.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${due_date}</h6>
                            <p class="card-text">${result.description}</p>
                            <div class="task-btn-container">
                                <button type="button" class="btn mt-2 btn-sm" onclick="completeTask('${accesstoken}', '${csrftoken}', ${result.id})"><img src="./images/mark_as_done.svg" class="mark_as_done-task-icon" width="30" height="30">Mark as Done</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="editForm('${accesstoken}', '${csrftoken}', ${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="./images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="./images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
                            </div>
                        </div>
                    </div>`);
                } else {
                    $("#main-uncompleted-content").append(`
                    <div class="card" style="width:100%">
                        <div class="card-body uncompleted">
                            <h5 class="card-title" style="background-color:#ffd280">${result.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${due_date}</h6>
                            <p class="card-text">${result.description}</p>
                            <div class="task-btn-container">
                                <button type="button" class="btn mt-2 btn-sm" onclick="completeTask('${accesstoken}', '${csrftoken}', ${result.id})"><img src="./images/mark_as_done.svg" class="mark_as_done-task-icon" width="30" height="30">Mark as Done</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="editForm('${accesstoken}', '${csrftoken}', ${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="./images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="./images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
                            </div>
                        </div>
                    </div>`);
                }
            } else if (result.status === "completed") {
                $("#main-completed-content").append(`
                <div class="card" style="width:100%">
                    <div class="card-body completed">
                        <h5 class="card-title" style="background-color:#80ff80">${result.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${due_date}</h6>
                        <p class="card-text">${result.description}</p>
                        <div class="task-btn-container">
                            <button type="button" class="btn mt-2 btn-sm" onclick="uncompleteTask('${accesstoken}', '${csrftoken}', ${result.id})"><img src="./images/mark_as_undone.svg" class="mark_as_undone-task-icon" width="30" height="30">Mark as Undone</button>
                            <button type="button" class="btn mt-2 btn-sm" onclick="editForm('${accesstoken}', '${csrftoken}', ${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="./images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                            <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="./images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
                        </div>
                    </div>
                </div>`);
            }
        })
        const uncompletedCount = $("#main-uncompleted-content > div").length;
        const completedCount = $("#main-completed-content > div").length;
        const expiredCount = $("#main-expired-content > div").length;
        if (uncompletedCount === 0) {
            $("#main-uncompleted-content").append(
                `<div class="card" style="width:100%">
                    <div class="card-body">
                        <h5 class="card-title">No Task</h5>
                    </div>
                </div>`);
        }

        if (completedCount === 0) {
            $("#main-completed-content").append(
                `<div class="card" style="width:100%">
                    <div class="card-body">
                        <h5 class="card-title">No Task</h5>
                    </div>
                </div>`);
        }

        if (expiredCount === 0) {
            $("#main-expired-content").append(
                `<div class="card" style="width:100%">
                    <div class="card-body">
                        <h5 class="card-title">No Task</h5>
                    </div>
                </div>`);
        }
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(fetchTodos);
        } else {
            console.log(err);
            printError(err);
        }
    })
}

function createTask(accesstoken, csrftoken) {
    const title = $("#add-task-title").val();
    const description = $("#add-task-description").val();
    const due_date = $("#add-task-due_date").val();

    $.ajax({
        method: "POST",
        url : "http://localhost:3000/todos/add",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        },
        data: {
            title,
            description,
            due_date
        }
    })
    .done((response) => {
        $("#add-task-form").trigger("reset");
        fetchTodos(accesstoken, csrftoken);
        Swal.fire(
            "Created!",
            "The task has been created.",
            'success'
            )
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(createTask);
        } else {
            console.log(err);
            printError(err);
        }
    })
    // .always(() => {
    //     $("#add-task-form").trigger("reset");
    // })
}

function completeTask(accesstoken, csrftoken, id) {
    $.ajax({
        method: "PATCH",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            accesstoken,
            csrftoken
        },
        xhrFields: {
            withCredentials: true
        },
        data: {
            status: "completed"
        }
    })
    .done((response) => {
        fetchTodos(accesstoken, csrftoken);
        Swal.fire(
            'Edited!',
            "The task has been marked as done.",
            'success'
            )
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(completeTask, id);
        } else {
            console.log(err);
            printError(err);
        }
    })
}

function uncompleteTask(accesstoken, csrftoken, id) {
    $.ajax({
        method: "PATCH",
        url: `http://localhost:3000/todos/${id}`,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        },
        data: {
            status: "uncompleted"
        }
    })
    .done((response) => {
        fetchTodos(accesstoken, csrftoken);
        Swal.fire(
            'Edited!',
            "The task has been marked as undone.",
            'success'
            )
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(uncompleteTask, id);
        } else {
            console.log(err);
            printError(err);
        }
    })
}

function editForm(accesstoken, csrftoken, id) {
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/todos/${id}`,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        }
    })
    .done((response) => {
        $("#edit-task-title").val(response.title);
        $("#edit-task-description").val(response.description);
        $("#edit-task-due_date").val(response.due_date);
        $("#edit-task-btn").attr("onclick", `editTask('${accesstoken}', '${csrftoken}', ${id}, event)`)
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(editForm, id);
        } else {
            console.log(err);
            printError(err);
        }
    })
}

function editTask(accesstoken, csrftoken, id, event) {
    event.preventDefault();
    const title = $("#edit-task-title").val();
    const description = $("#edit-task-description").val();
    const due_date = $("#edit-task-due_date").val();
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${id}`,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        },
        data: {
            title,
            description,
            due_date
        } 
    })
    .done((response) => {
        fetchTodos(accesstoken, csrftoken);
        $("#edit-task-modal").modal("hide");
        Swal.fire(
            'Edited!',
            "The task has been edited.",
            'success'
            )
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(editTask, id, event);
        } else {
            console.log(err);
            printError(err);
        }
    })
}  
  
function deleteConfirm(id) {
    $("#delete-confirm-btn").attr("onclick", `deleteTask('${accesstoken}', '${csrftoken}', ${id})`)
}

function deleteTask(accesstoken, csrftoken, id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            accesstoken,
            csrftoken
        }
    })
    .done((response) => {
        fetchTodos(accesstoken, csrftoken);
        Swal.fire(
            'Deleted!',
            response.message,
            'success'
            )
    })
    .fail((err) => {
        if (err.status === 419) {
            reauth(deleteTask, id);
        } else {
            console.log(err);
            printError(err);
        }
    })
}

// function getCityName(timezone) {
//     let slicedWords = timezone.split("/").slice(1);
//     let words = slicedWords[0];
//     let separateWord = words.toLowerCase().split('_');
//     for (var i = 0; i < separateWord.length; i++) {
//        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
//        separateWord[i].substring(1);
//     }
//     return separateWord.join(' ');
// }

// function getHourlyForecast() {
//     function success(position) {
//         const latitude  = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         console.log(latitude, longitude)
//         $.ajax({
//             url: "http://localhost:3000/weather",
//             method: "POST",
//             headers: {
//                 accesstoken: localStorage.getItem("accesstoken")
//             },
//             data: {
//                 latitude,
//                 longitude
//             }
//         })
//         .done((response) => {
//             $("#hourly-forecast-content").empty();
//             const city = getCityName(response.timezone);

//             for(let i = 0; i < response.hourly.length; i++) {
//                 const data = response.hourly[i];
//                 const date = unixToLocal(data.dt)[0];
//                 const time = unixToLocal(data.dt)[1];
//                 const description = firstLetterUpperCase(data.weather[0].description);
//                 const temperature = `${Math.round(data.temp)} \xB0C`;
//                 const wind = `${Math.round(data.wind_speed)} m/s`;
        
//                 $("#hourly-forecast-content").append(`
//                 <div class="weather-content custom-border">
//                     <h1>${city}</h1>
//                     <p>${date}</p>
//                     <p>Time: ${time}</p>
//                     <div style="display:flex;">
//                         <div>
//                             <img class="custom-border" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
//                                 style="background-color:white;position:relative;top:0.5rem">
//                         </div>
//                         <div class="ml-4">
//                             <h3>${description}</h3>
//                             <p>Temperature: ${temperature}</p>
//                             <p>Wind: ${wind}</p>
//                         </div>
//                     </div>
//                 </div>
//                 `);
//             }
//         })
//         .fail((err) => {
//             console.log(err);
//         })
//     }

//     function error() {
//         console.log("ERROR")
//         // $("#location-status").text('Unable to retrieve your location');
//     }

//     if(!navigator.geolocation) {
//         console.log("ERROR")
//         // $("#location-status").text("Geolocation is not supported by your browser");
//     } else {
//         // $("#location-status").text("Locating ...");
//         navigator.geolocation.getCurrentPosition(success, error);
//     }
// }

// function getDailyForecast() {
//     function success(position) {
//         const latitude  = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         console.log(latitude, longitude)
//         $.ajax({
//             url: "http://localhost:3000/weather",
//             method: "POST",
//             headers: {
//                 accesstoken: localStorage.getItem("accesstoken")
//             },
//             data: {
//                 latitude,
//                 longitude
//             }
//         })
//         .done((response) => {
//             $("#daily-forecast-content").empty();
//             const city = getCityName(response.timezone);

//             for(let i = 0; i < response.daily.length; i++) {
//                 const data = response.daily[i];
//                 const date = unixToLocal(data.dt)[0];
//                 const time = unixToLocal(data.dt)[1];
//                 const description = firstLetterUpperCase(data.weather[0].description);
//                 const morningTemp = `${Math.round(data.temp.morn)} \xB0C`;
//                 const dayTemp = `${Math.round(data.temp.day)} \xB0C`;
//                 const nightTemp = `${Math.round(data.temp.night)} \xB0C`;
//                 const wind = `${Math.round(data.wind_speed)} m/s`;
        
//                 $("#daily-forecast-content").append(`
//                 <div class="weather-content custom-border">
//                     <h1>${city}</h1>
//                     <p>${date}</p>
//                     <div style="display:flex;">
//                         <div>
//                             <img class="custom-border" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
//                                     style="background-color:white;position:relative;top:0.5rem">
//                         </div>
//                         <div class="ml-4">
//                             <h3><h3>${description}</h3></h3>
//                             <p>Morning: ${morningTemp}</p>
//                             <p>Day: ${dayTemp}</p>
//                             <p>Night: ${nightTemp}</p>
//                             <p>Wind: ${wind}</p>
//                         </div>
//                     </div>
//                 </div>
//                 `);
//             }
//         })
//         .fail((err) => {
//             console.log(err);
//         })
//     }

//     function error() {
//         console.log("ERROR")
//         // $("#location-status").text('Unable to retrieve your location');
//     }

//     if(!navigator.geolocation) {
//         console.log("ERROR")
//         // $("#location-status").text("Geolocation is not supported by your browser");
//     } else {
//         // $("#location-status").text("Locating ...");
//         navigator.geolocation.getCurrentPosition(success, error);
//     }
// }

function getCurrentWeather(accesstoken, csrftoken) {
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        $.ajax({
            url: "http://localhost:3000/current-weather",
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                accesstoken,
                csrftoken
            },
            data: {
                latitude,
                longitude
            }
        })
        .done((response) => {
            const city = response.name;
            // const date = unixToLocal(response.current.dt)[0];
            const date = unixToLocal(response.dt)[0];
            const time = unixToLocal(response.dt)[1];
            const dateTime = `${date}, ${time}`;
            // const description = firstLetterUpperCase(response.current.weather[0].description);
            const description = firstLetterUpperCase(response.weather[0].description);
            // const temperature = `${Math.round(response.current.temp)} \xB0C`;
            const temperature = `${Math.round(response.main.temp)} \xB0C`;
            const feelsLike = `${Math.round(response.main.feels_like)} \xB0C`;
            const wind = `${Math.round(response.wind.speed)} m/s`;
            const icon_url = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        
            $("#city").text(city);
            $("#current-weather-date").text(dateTime);
            $("#current-weather-icon").attr("src", icon_url);
            $("#current-weather-desc").text(description);
            $("#current-weather-temp").text(`Temperature: ${temperature}`);
            $("#current-weather-feels-like").text(`Feels Like: ${feelsLike}`);
            $("#current-weather-wind").text(`Wind Speed: ${wind}`);
        })
        .fail((err) => {
            if (err.status === 419) {
                reauth(getCurrentWeather);
            } else {
                console.log(err);
                printError(err);
            }
        })
    }

    function error() {
        console.log("ERROR")
        // $("#location-status").text('Unable to retrieve your location');
    }

    if(!navigator.geolocation) {
        console.log("ERROR")
        // $("#location-status").text("Geolocation is not supported by your browser");
    } else {
        // $("#location-status").text("Locating ...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getForecast(accesstoken, csrftoken) {
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        $.ajax({
            url: "http://localhost:3000/weather",
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                accesstoken,
                csrftoken
            },
            data: {
                latitude,
                longitude
            }
        })
        .done((response) => {
            $("#forecast-content").empty();
            const city = response.city.name;

            for(let i = 0; i < response.list.length; i++) {
                const data = response.list[i];
                const date = unixToLocal(data.dt)[0];
                const time = unixToLocal(data.dt)[1];
                const dateTime = `${date}, ${time}`;
                const description = firstLetterUpperCase(data.weather[0].description);
                const mainTemp = `${Math.round(data.main.temp)} \xB0C`;
                const feelsLike = `${Math.round(data.main.feels_like)} \xB0C`;
                const minTemp = `${Math.round(data.main.temp_min)} \xB0C`;
                const maxTemp = `${Math.round(data.main.temp_max)} \xB0C`;
                const wind = `${Math.round(data.wind.speed)} m/s`;
        
                $("#forecast-content").append(`
                <div class="weather-content custom-border">
                    <h1>${city}</h1>
                    <p style="color: blue; font-weight: bold">${dateTime}</p>
                    <div style="display:flex;">
                        <div>
                            <img class="custom-border" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                                    style="background-color:white;position:relative;top:0.5rem">
                        </div>
                        <div class="ml-4">
                            <h3><h3>${description}</h3></h3>
                            <p>Temp: ${mainTemp}</p>
                            <p>Feels Like: ${feelsLike}</p>
                            <p>Min Temp: ${minTemp}</p>
                            <p>Max Temp: ${maxTemp}</p>
                            <p>Wind: ${wind}</p>
                        </div>
                    </div>
                </div>
                `);
            }
        })
        .fail((err) => {
            if (err.status === 419) {
                reauth(getForecast);
            } else {
                console.log(err);
                printError(err);
            }
        })
    }

    function error() {
        console.log("ERROR")
        // $("#location-status").text('Unable to retrieve your location');
    }

    if(!navigator.geolocation) {
        console.log("ERROR")
        // $("#location-status").text("Geolocation is not supported by your browser");
    } else {
        // $("#location-status").text("Locating ...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getQuote(accesstoken, csrftoken) {
        $.ajax({
            url: "http://localhost:3000/quotes",
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                accesstoken,
                csrftoken
            }
        })
        .done((response) => { 
            // localStorage.setItem("quoteText", response[0].q);
            // localStorage.setItem("quoteAuthor", response[0].a);
            if (response[0].q === "Too many requests. Obtain an auth key for unlimited access.") {
                $("#quote-text").text("Too many requests. Please try again later.");
            } else {
                $("#quote-text").text(response[0].q);
            }
            
            $("#quote-author").text(response[0].a);
            // showMainPage();
        })
        .fail((err) => {
            if (err.status === 419) {
                reauth(getQuote);
            } else {
                console.log(err);
                printError(err);
            }
        })

}

function firstLetterUpperCase(words) {
    let separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}

function printError(error){
    $("#notification-container").empty();
    if (error.responseJSON) {
        if (error.responseJSON.messages) {
            const messages = error.responseJSON.messages;
            messages.forEach((message) => {
                $("#notification-container").append(`
                    <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `);
            })
        } else if (error.responseJSON.message) {
            const message = error.responseJSON.message; 
            $("#notification-container").append(`
            <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `);
        }
    } else {
        $("#notification-container").append(`
        <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">Something is wrong, please try again later.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `);
    }
}

function printErrorEditForm(error){
    $("#edit-form-notification-container").empty();
    
    if (error.responseJSON.messages) {
        const messages = error.responseJSON.messages;
        messages.forEach((message) => {
            $("#edit-form-notification-container").append(`
                <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `);
        })
    } else if (error.responseJSON.message) {
        const message = error.responseJSON.message; 
        $("#edit-form-notification-container").append(`
        <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `);
    }
}

function unixToLocal(timestamp) {
    let months = new Array();
        months[1] = "January";
        months[2] = "February";
        months[3] = "March";
        months[4] = "April";
        months[5] = "May";
        months[6] = "June";
        months[7] = "July";
        months[8] = "August";
        months[9] = "September";
        months[10] = "October";
        months[11] = "November";
        months[12] = "December";
    
let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    let d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
    ampm = 'AM',
    time,
    date,
    day = d.getDay();
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
    let monthName = months[Number(mm)];
    let dayName = weekday[day];
    date= `${dayName}, ${dd} ${monthName} ${yyyy}`;
	time = h + ':' + min + ' ' + ampm;
    
    return [date, time];
}

function formatDueDate(due_date) {
    let months = new Array();
        months[1] = "January";
        months[2] = "February";
        months[3] = "March";
        months[4] = "April";
        months[5] = "May";
        months[6] = "June";
        months[7] = "July";
        months[8] = "August";
        months[9] = "September";
        months[10] = "October";
        months[11] = "November";
        months[12] = "December";
    
let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    let d = new Date(due_date),	// Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
    date,
    day = d.getDay();
	
    let monthName = months[Number(mm)];
    let dayName = weekday[day];
    date= `${dayName}, ${dd} ${monthName} ${yyyy}`;
	
    return date;
}