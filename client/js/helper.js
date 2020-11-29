function showLoginPage() {
    $("#login-page").show();
    $("#register-page").hide();
    $("#navbar").hide();
    $("#notification-container").empty();
    $("#main-page").hide();
    $("#project-list").hide();
    $("#project-page").hide();
}

function showRegisterPage() {
    $("#login-page").hide();
    $("#register-page").show();
    $("#navbar").hide();
    $("#notification-container").empty();
    $("#main-page").hide();
    $("#project-list").hide();
    $("#project-page").hide();
}

function showMainPage() {
    getCurrentWeather();
    $("#user-name").text("");
    $("#user-name").text(localStorage.getItem("fullName"));
    $("#login-page").hide();
    $("#register-page").hide();
    $("#navbar").show();
    $("#notification-container").empty();
    $("#main-page").show();
    $("#project-list").hide();
    $("#project-page").hide();
    if(localStorage.getItem("quoteText") !== "") {
        $("#quote-text").text("");
        $("#quote-author").text("");
    }
    $("#quote-text").text(localStorage.getItem("quoteText"));
    $("#quote-author").text(`- ${localStorage.getItem("quoteAuthor")} -`);
    fetchTodos();
}

function showProjectList() {

}

function showProjectPage() {
    getCurrentWeather();
    $("#user-name").text("");
    $("#user-name").text(localStorage.getItem("fullName"));
    $("#login-page").hide();
    $("#register-page").hide();
    $("#navbar").show();
    $("#notification-container").empty();
    $("#main-page").hide();
    $("#project-list").hide();
    $("#project-page").show();
    if(localStorage.getItem("quoteText") !== "") {
        $("#quote-text").text("");
        $("#quote-author").text("");
    }
    $("#quote-text").text(localStorage.getItem("quoteText"));
    $("#quote-author").text(`- ${localStorage.getItem("quoteAuthor")} -`);
    fetchTodos();
}




function login(){
    const email = $("#login-email").val();
    const password = $("#login-password").val();

    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        data: {
            email,
            password
        }
    })
        .done(response => {
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("fullName", response.fullName);
            getQuote();
            showMainPage();
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

function getCurrentWeather() {
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude)
        $.ajax({
            url: "http://localhost:3000/weather",
            method: "POST",
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                latitude,
                longitude
            }
        })
        .done((response) => {
            console.log(response);
            const city = getCityName(response.timezone);
            const date = unixToLocal(response.current.dt)[0];
            const description = firstLetterUpperCase(response.current.weather[0].description);
            const temperature = `${Math.round(response.current.temp)} \xB0C`;
            const wind = `${Math.round(response.current.wind_speed)} m/s`;
            const icon_url = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`;
        
            $("#city").text(city);
            $("#current-weather-date").text(date);
            $("#current-weather-icon").attr("src", icon_url);
            $("#current-weather-desc").text(description);
            $("#current-weather-temp").text(`Temperature: ${temperature}`);
            $("#current-weather-wind").text(`Wind Speed: ${wind}`);
        })
        .fail((err) => {
            console.log(err);
        })
    }

    function error() {
        concsole.log("ERROR")
        // $("#location-status").text('Unable to retrieve your location');
    }

    if(!navigator.geolocation) {
        concsole.log("ERROR")
        // $("#location-status").text("Geolocation is not supported by your browser");
    } else {
        // $("#location-status").text("Locating ...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function register(){
    const first_name = $("#register-first_name").val();
    const last_name = $("#register-last_name").val();
    const email = $("#register-email").val();
    const password = $("#register-password").val();
    $.ajax({
        url: "http://localhost:3000/register",
        method: "POST",
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

function logout() {
    localStorage.clear();
    showLoginPage();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log('User signed out.');
    })
}

function onSignIn(googleUser) {
    var googleToken = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: "http://localhost:3000/googleLogin",
        method: "POST",
        data: {
            googleToken
        }
    })
    .done((response) => {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("fullName", response.fullName);
        getQuote();
        showMainPage();
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

function printError(error){
    $("#notification-container").empty();
    
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

function fetchTodos(){
    $("#notification-container").empty();
    $("#edit-form-notification-container").empty();
    $.ajax({
        method: "GET",
        url : "http://localhost:3000/todos",
        headers: {
            access_token: localStorage.getItem("access_token")
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
                                <button type="button" class="btn mt-2 btn-sm" onclick="completeTask(${result.id})"><img src="/images/mark_as_done.svg" class="mark_as_done-task-icon" width="30" height="30">Mark as Done</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="editForm(${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="/images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="/images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
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
                                <button type="button" class="btn mt-2 btn-sm" onclick="completeTask(${result.id})"><img src="/images/mark_as_done.svg" class="mark_as_done-task-icon" width="30" height="30">Mark as Done</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="editForm(${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="/images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                                <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="/images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
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
                            <button type="button" class="btn mt-2 btn-sm" onclick="uncompleteTask(${result.id})"><img src="/images/mark_as_undone.svg" class="mark_as_undone-task-icon" width="30" height="30">Mark as Undone</button>
                            <button type="button" class="btn mt-2 btn-sm" onclick="editForm(${result.id})" data-toggle="modal" data-target="#edit-task-modal"><img src="/images/edit.svg" class="edit-task-icon" width="30" height="30">Edit</button>
                            <button type="button" class="btn mt-2 btn-sm" onclick="deleteConfirm(${result.id})" data-toggle="modal" data-target="#delete-confirm"><img src="/images/delete.svg" class="delete-task-icon" width="30" height="30">Delete</button>
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
        console.log(err);
        printError(err);
    })
}

function createTask() {
    const title = $("#add-task-title").val();
    const description = $("#add-task-description").val();
    const due_date = $("#add-task-due_date").val();

    $.ajax({
        method: "POST",
        url : "http://localhost:3000/todos",
        headers: {
            access_token: localStorage.getItem("access_token")
        },
        data: {
            title,
            description,
            due_date
        }
    })
    .done((response) => {
        fetchTodos();
        Swal.fire(
            "Created!",
            "The task has been created.",
            'success'
            )
    })
    .fail((err) => {
        console.log(err);
        printError(err);
    })
    .always(() => {
        $("#add-task-form").trigger("reset");
    })
}

function completeTask(id) {
    $.ajax({
        method: "PATCH",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        },
        data: {
            status: "completed"
        }
    })
    .done((response) => {
      showMainPage();
      Swal.fire(
        'Edited!',
        "The task has been marked as done.",
        'success'
        )
    })
    .fail((err) => {
        console.log(err);
        printError(err);
    })
}

function uncompleteTask(id) {
    $.ajax({
        method: "PATCH",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        },
        data: {
            status: "uncompleted"
        }
    })
    .done((response) => {
        Swal.fire(
            'Edited!',
            "The task has been marked as undone.",
            'success'
            )
        fetchTodos();
    })
    .fail((err) => {
        console.log(err);
        printError(err);
    })
}

function editForm(id) {
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done((response) => {
        $("#edit-task-title").val(response.title);
        $("#edit-task-description").val(response.description);
        $("#edit-task-due_date").val(response.due_date);
        $("#edit-task-btn").attr("onclick", `editTask(event,${id})`)
    })
    .fail((err) => {
        console.log(err);
        printError(err);
    })
}

function editTask(event, id) {
    event.preventDefault();
    const title = $("#edit-task-title").val();
    const description = $("#edit-task-description").val();
    const due_date = $("#edit-task-due_date").val();
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        },
        data: {
            title,
            description,
            due_date
        } 
    })
    .done((response) => {
        fetchTodos();
        $("#edit-task-modal").modal("hide");
        Swal.fire(
            'Edited!',
            "The task has been edited.",
            'success'
            )
    })
    .fail((err) => {
        console.log(err);
        printErrorEditForm(err);
    })
}  
  
function deleteConfirm(id) {
    $("#delete-confirm-btn").attr("onclick", `deleteTask(${id})`)
}

function deleteTask(id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done((response) => {
        fetchTodos();
        Swal.fire(
            'Deleted!',
            response.message,
            'success'
            )
    })
    .fail((err) => {
        console.log(err);
        printError(err);
    })
}

function getCityName(timezone) {
    let slicedWords = timezone.split("/").slice(1);
    let words = slicedWords[0];
    let separateWord = words.toLowerCase().split('_');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}

function firstLetterUpperCase(words) {
    let separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
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

function getHourlyForecast() {
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude)
        $.ajax({
            url: "http://localhost:3000/weather",
            method: "POST",
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                latitude,
                longitude
            }
        })
        .done((response) => {
            $("#hourly-forecast-content").empty();
            const city = getCityName(response.timezone);

            for(let i = 0; i < response.hourly.length; i++) {
                const data = response.hourly[i];
                const date = unixToLocal(data.dt)[0];
                const time = unixToLocal(data.dt)[1];
                const description = firstLetterUpperCase(data.weather[0].description);
                const temperature = `${Math.round(data.temp)} \xB0C`;
                const wind = `${Math.round(data.wind_speed)} m/s`;
        
                $("#hourly-forecast-content").append(`
                <div class="weather-content custom-border">
                    <h1>${city}</h1>
                    <p>${date}</p>
                    <p>Time: ${time}</p>
                    <div style="display:flex;">
                        <div>
                            <img class="custom-border" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                                style="background-color:white;position:relative;top:0.5rem">
                        </div>
                        <div class="ml-4">
                            <h3>${description}</h3>
                            <p>Temperature: ${temperature}</p>
                            <p>Wind: ${wind}</p>
                        </div>
                    </div>
                </div>
                `);
            }
        })
        .fail((err) => {
            console.log(err);
        })
    }

    function error() {
        concsole.log("ERROR")
        // $("#location-status").text('Unable to retrieve your location');
    }

    if(!navigator.geolocation) {
        concsole.log("ERROR")
        // $("#location-status").text("Geolocation is not supported by your browser");
    } else {
        // $("#location-status").text("Locating ...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getDailyForecast() {
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude)
        $.ajax({
            url: "http://localhost:3000/weather",
            method: "POST",
            headers: {
                access_token: localStorage.getItem("access_token")
            },
            data: {
                latitude,
                longitude
            }
        })
        .done((response) => {
            $("#daily-forecast-content").empty();
            const city = getCityName(response.timezone);

            for(let i = 0; i < response.daily.length; i++) {
                const data = response.daily[i];
                const date = unixToLocal(data.dt)[0];
                const time = unixToLocal(data.dt)[1];
                const description = firstLetterUpperCase(data.weather[0].description);
                const morningTemp = `${Math.round(data.temp.morn)} \xB0C`;
                const dayTemp = `${Math.round(data.temp.day)} \xB0C`;
                const nightTemp = `${Math.round(data.temp.night)} \xB0C`;
                const wind = `${Math.round(data.wind_speed)} m/s`;
        
                $("#daily-forecast-content").append(`
                <div class="weather-content custom-border">
                    <h1>${city}</h1>
                    <p>${date}</p>
                    <div style="display:flex;">
                        <div>
                            <img class="custom-border" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                                    style="background-color:white;position:relative;top:0.5rem">
                        </div>
                        <div class="ml-4">
                            <h3>Light Rain</h3>
                            <p>Morning: ${morningTemp}</p>
                            <p>Day: ${dayTemp}</p>
                            <p>Night: ${nightTemp}</p>
                            <p>Wind: ${wind}</p>
                        </div>
                    </div>
                </div>
                `);
            }
        })
        .fail((err) => {
            console.log(err);
        })
    }

    function error() {
        concsole.log("ERROR")
        // $("#location-status").text('Unable to retrieve your location');
    }

    if(!navigator.geolocation) {
        concsole.log("ERROR")
        // $("#location-status").text("Geolocation is not supported by your browser");
    } else {
        // $("#location-status").text("Locating ...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getQuote() {
        $.ajax({
            url: "http://localhost:3000/quotes",
            method: "GET",
            headers: {
                access_token: localStorage.getItem("access_token")
            },
        })
        .done((response) => {
            localStorage.setItem("quoteText", response.quote.quoteText);
            localStorage.setItem("quoteAuthor", response.quote.quoteAuthor);
            showMainPage();
        })
        .fail((err) => {
            console.log(err);
        })

}

