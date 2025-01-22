# Fancy Todo Documentation

Fancy Todo is an application to manage your task with third API integration that shows weather and quotes.
This app has : 
* RESTful endpoint for todo's CRUD operation
* JSON formatted response

## Environment-specific variables
ACCESS_TOKEN_SECRET=\
REFRESH_TOKEN_SECRET=\
SALT=\
OWM_KEY=\
GOOGLE_CLIENT_ID=\
GOOGLE_PASSWORD=\
REFRESH_TOKEN_EXPIRY_MILLISECONDS=\
REFRESH_TOKEN_EXPIRY=\
ACCESS_TOKEN_EXPIRY=\
DB_USER_DEV=\
DB_PASS_DEV=\
DB_DATABASE_DEV=\
DB_HOST_DEV=\
DB_USER_PROD=\
DB_PASS_PROD=\
DB_DATABASE_PROD=\
DB_HOST_PROD=



## RESTful endpoints
### POST /login

_Request Params_
```
Not needed
```
_Request Header_
```
Not needed
```

_Request Body_
```
{
  "email": "<your email>",
  "password": "<your password>"
}
```

_Response (200 - OK)_
```
{
  "access_token": "<your access token>",
  "fullName": "<your full name>"
}
```

_Response (401 - Unauthorized)_
```
{
  "message": "Email or password is invalid."
}
```
---
### POST /register

> Create new user

_Request Params_
```
Not needed
```
_Request Header_
```
Not needed
```

_Request Body_
```
{
  "first_name": "<first name to get insert into>",
  "last_name": "<last name to get insert into>",
  "email": "<email to get insert into>",
  "password": "<password to get insert into>"
}
```

_Response (201 - Created)_
```
{
  "id": <given id by system>,
  "email": "<posted email>"
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Email is required.",
    ]
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Email is required.",
        "Password is required."
    ]
}
```
---
### POST /todos

> Create a new todo task

_Request Params_
```
Not needed
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
{
  "title": "<title to get insert into>",
  "description": "<description to get insert into>",
  "due_date": "<due_date to get insert into>",
}
```
_Response (201 - Created)_
```
{
  "id": <todo id>,
  "title": "<todo title>",
  "description": "<todo description>",
  "due_date": "<todo due_date>",
  "UserId": <user id>,
  "updatedAt": "2020-11-28T09:57:17.359Z",
  "createdAt": "2020-11-28T09:57:17.359Z",
  "status": "<todo status>"
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Title is required."
    ]
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Title is required.",
        "Due date must be greater than today."
    ]
}
```
---
### GET /todos

> Get all todo tasks

_Request Params_
```
Not needed
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
Not needed
```
_Response (200 - OK)_
```
[
  {
    "id": "<todo id>",
    "title": "<todo title>",
    "description": "<todo description>",
    "status": "<todo status>",
    "due_date": "<todo due_date>",
    "UserId": "<user id>,"
    "createdAt": "2020-11-25T00:09:34.514Z",
    "updatedAt": "2020-11-25T00:09:34.514Z"
  }
]
```
_Response (401 - Unauthorized)_
```
{
  "message": "Unauthorised Access!"
}
```
---
### GET /todos/:id

> Get a todo task with specific id

_Request Params_
```
id=[integer]
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
Not needed
```
_Response (200 - OK)_
```
[
  {
    "id": <todo id by request>,
    "title": "<todo title>",
    "description": "<todo description>",
    "due_date": "<todo due_date>",
    "UserId": <user id>,
    "updatedAt": "2020-11-28T09:57:17.359Z",
    "createdAt": "2020-11-28T09:57:17.359Z",
    "status": "<todo status>"
  }
]
```
_Response (401 - Unuthorized)_
```
{
   "message": "Unauthorized Access!"
}
```
_Response (404 - Not Found)_
```
{
   "message": "Data is not found."
}
```
---
### PUT /todos/:id

> Update all editable properties of a todo task with specific id

_Request Params_
```
id=[integer]
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
{
  "title": "<todo previous title>",
  "description": "<todo previous description>",
  "due_date": "<todo previous due_date>",
}
```
_Response (200 - OK)_
```
{
  "id": <todo id>,
  "title": "<todo updated title>",
  "description": "<todo updated description>",
  "due_date": "<todo updated due_date>",
  "UserId": <user id>,
  "updatedAt": "2020-11-28T09:57:17.359Z",
  "createdAt": "2020-11-28T09:57:17.359Z",
  "status": "<todo status>"
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Title is required."
    ]
}
```
_Response (400 - Bad Request)_
```
{
  "messages": [
        "Title is required.",
        "Due date must be greater than today."
    ]
}
```
_Response (401 - Unuthorized)_
```
{
   "message": "Unauthorized Access!"
}
```
_Response (404 - Not Found)_
```
{
  "message": "Data is not found."
}
```
---
### PATCH/todos/:id

> Update a property of a todo task with specific id 

_Request Params_
```
id=[integer]
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
{
  "status": "<todo previous status>",
}
```
_Response (200 - OK)_
```
{
  "id": <todo id>,
  "title": "<todo title>",
  "description": "<todo description>",
  "due_date": "<todo due_date>",
  "UserId": <user id>,
  "updatedAt": "2020-11-28T09:57:17.359Z",
  "createdAt": "2020-11-28T09:57:17.359Z",
  "status": "<todo updated status>"
}
```
_Response (401 - Unuthorized)_
```
{
   "message": "Unauthorized Access!"
}
```
_Response (404 - Not Found)_
```
{
  "message": "Data is not found."
}
```
---
### DELETE /todos/:id

> Delete a todo task with specific id

_Request Params_
```
id=[integer]
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
Not needed
```
_Response (200 - OK)_
```
{
  "message": "The todo has been successfully deleted."
}
```
_Response (404 - Not Found)_
```
{
  "message": "Data is not found."
}
```
---
### POST /weather

> Get weather based on user's location

_Request Params_
```
{
  "lat": "<user's latitude",
  "lon": "<user's longitude"
  "appid": <API key to access OpenWeatherMap>
}
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
{
  "lat": "<user's latitude",
  "lon": "<user's longitude"
}
```
_Response (200 - OK)_
```
{
    "lat": -0.03,
    "lon": 109.34,
    "timezone": "Asia/Pontianak",
    "timezone_offset": 25200,
    "current": {
        "dt": 1606559799,
        "sunrise": 1606516032,
        "sunset": 1606559666,
        "temp": 26.55,
        "feels_like": 30.36,
        "pressure": 1007,
        "humidity": 81,
        "dew_point": 23.02,
        "uvi": 0,
        "clouds": 100,
        "visibility": 10000,
        "wind_speed": 2.06,
        "wind_deg": 302,
        "weather": [
            {
                "id": 502,
                "main": "Rain",
                "description": "heavy intensity rain",
                "icon": "10n"
            }
        ],
        "rain": {
            "1h": 8.647
        }
    },
    "hourly": [
        {
            "dt": 1606557600,
            "temp": 26.55,
            "feels_like": 30.36,
            "pressure": 1007,
            "humidity": 81,
            "dew_point": 23.02,
            "uvi": 0.28,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.06,
            "wind_deg": 302,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.41
        },
        {
            "dt": 1606561200,
            "temp": 26.01,
            "feels_like": 29.9,
            "pressure": 1007,
            "humidity": 83,
            "dew_point": 22.9,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.85,
            "wind_deg": 300,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.41,
            "rain": {
                "1h": 3.16
            }
        },
        {
            "dt": 1606564800,
            "temp": 25.51,
            "feels_like": 29.54,
            "pressure": 1009,
            "humidity": 85,
            "dew_point": 22.8,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.57,
            "wind_deg": 294,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.37
        },
        {
            "dt": 1606568400,
            "temp": 25.25,
            "feels_like": 29.33,
            "pressure": 1010,
            "humidity": 85,
            "dew_point": 22.55,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.3,
            "wind_deg": 302,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.02
        },
        {
            "dt": 1606572000,
            "temp": 25.1,
            "feels_like": 29.1,
            "pressure": 1010,
            "humidity": 85,
            "dew_point": 22.4,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.3,
            "wind_deg": 303,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.03
        },
        {
            "dt": 1606575600,
            "temp": 25.04,
            "feels_like": 29.02,
            "pressure": 1010,
            "humidity": 85,
            "dew_point": 22.34,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.28,
            "wind_deg": 293,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.03
        },
        {
            "dt": 1606579200,
            "temp": 24.97,
            "feels_like": 28.95,
            "pressure": 1010,
            "humidity": 84,
            "dew_point": 22.26,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.08,
            "wind_deg": 291,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.01
        },
        {
            "dt": 1606582800,
            "temp": 24.73,
            "feels_like": 28.75,
            "pressure": 1010,
            "humidity": 85,
            "dew_point": 22.11,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.99,
            "wind_deg": 311,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.02
        },
        {
            "dt": 1606586400,
            "temp": 24.82,
            "feels_like": 29,
            "pressure": 1009,
            "humidity": 84,
            "dew_point": 22.07,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.69,
            "wind_deg": 333,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.02
        },
        {
            "dt": 1606590000,
            "temp": 24.74,
            "feels_like": 28.99,
            "pressure": 1008,
            "humidity": 84,
            "dew_point": 22,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.53,
            "wind_deg": 10,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1606593600,
            "temp": 24.54,
            "feels_like": 28.91,
            "pressure": 1007,
            "humidity": 85,
            "dew_point": 21.97,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.35,
            "wind_deg": 353,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1606597200,
            "temp": 24.38,
            "feels_like": 28.75,
            "pressure": 1008,
            "humidity": 86,
            "dew_point": 21.97,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.38,
            "wind_deg": 341,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1606600800,
            "temp": 24.52,
            "feels_like": 28.85,
            "pressure": 1008,
            "humidity": 86,
            "dew_point": 22.06,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.55,
            "wind_deg": 335,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.1
        },
        {
            "dt": 1606604400,
            "temp": 24.57,
            "feels_like": 29,
            "pressure": 1009,
            "humidity": 86,
            "dew_point": 22.24,
            "uvi": 0,
            "clouds": 95,
            "visibility": 10000,
            "wind_speed": 0.44,
            "wind_deg": 353,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.26
        },
        {
            "dt": 1606608000,
            "temp": 25.74,
            "feels_like": 30.61,
            "pressure": 1010,
            "humidity": 86,
            "dew_point": 23.25,
            "uvi": 0.66,
            "clouds": 87,
            "visibility": 8253,
            "wind_speed": 0.71,
            "wind_deg": 267,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.5,
            "rain": {
                "1h": 1.12
            }
        },
        {
            "dt": 1606611600,
            "temp": 26.72,
            "feels_like": 30.02,
            "pressure": 1011,
            "humidity": 85,
            "dew_point": 24.16,
            "uvi": 2.55,
            "clouds": 100,
            "visibility": 6421,
            "wind_speed": 3.58,
            "wind_deg": 256,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.94,
            "rain": {
                "1h": 1.78
            }
        },
        {
            "dt": 1606615200,
            "temp": 26.97,
            "feels_like": 29.79,
            "pressure": 1011,
            "humidity": 85,
            "dew_point": 24.23,
            "uvi": 5.34,
            "clouds": 100,
            "visibility": 6625,
            "wind_speed": 4.47,
            "wind_deg": 257,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 1.92
            }
        },
        {
            "dt": 1606618800,
            "temp": 27.12,
            "feels_like": 30.23,
            "pressure": 1011,
            "humidity": 84,
            "dew_point": 24.24,
            "uvi": 8.31,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 4.02,
            "wind_deg": 254,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 1.31
            }
        },
        {
            "dt": 1606622400,
            "temp": 27.61,
            "feels_like": 30.59,
            "pressure": 1010,
            "humidity": 81,
            "dew_point": 24.24,
            "uvi": 8.67,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 4.09,
            "wind_deg": 247,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 0.65
            }
        },
        {
            "dt": 1606626000,
            "temp": 27.81,
            "feels_like": 31.16,
            "pressure": 1010,
            "humidity": 82,
            "dew_point": 24.61,
            "uvi": 9.02,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.9,
            "wind_deg": 234,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 1.42
            }
        },
        {
            "dt": 1606629600,
            "temp": 28.01,
            "feels_like": 31.35,
            "pressure": 1009,
            "humidity": 80,
            "dew_point": 24.31,
            "uvi": 7.87,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.73,
            "wind_deg": 239,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 0.88
            }
        },
        {
            "dt": 1606633200,
            "temp": 28.26,
            "feels_like": 31.21,
            "pressure": 1008,
            "humidity": 76,
            "dew_point": 23.82,
            "uvi": 5.67,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.78,
            "wind_deg": 248,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.63,
            "rain": {
                "1h": 0.27
            }
        },
        {
            "dt": 1606636800,
            "temp": 27.92,
            "feels_like": 30.52,
            "pressure": 1007,
            "humidity": 77,
            "dew_point": 23.58,
            "uvi": 3.16,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 4.18,
            "wind_deg": 252,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.86,
            "rain": {
                "1h": 0.24
            }
        },
        {
            "dt": 1606640400,
            "temp": 27.17,
            "feels_like": 29.75,
            "pressure": 1007,
            "humidity": 80,
            "dew_point": 23.59,
            "uvi": 1.21,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 4.14,
            "wind_deg": 253,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.95,
            "rain": {
                "1h": 0.32
            }
        },
        {
            "dt": 1606644000,
            "temp": 26.11,
            "feels_like": 28.94,
            "pressure": 1008,
            "humidity": 86,
            "dew_point": 23.64,
            "uvi": 0.24,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.92,
            "wind_deg": 258,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.97,
            "rain": {
                "1h": 0.68
            }
        },
        {
            "dt": 1606647600,
            "temp": 25.34,
            "feels_like": 28.44,
            "pressure": 1009,
            "humidity": 89,
            "dew_point": 23.41,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.38,
            "wind_deg": 260,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 0.52
            }
        },
        {
            "dt": 1606651200,
            "temp": 25.19,
            "feels_like": 28.49,
            "pressure": 1010,
            "humidity": 90,
            "dew_point": 23.49,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.13,
            "wind_deg": 264,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 1,
            "rain": {
                "1h": 0.21
            }
        },
        {
            "dt": 1606654800,
            "temp": 25.33,
            "feels_like": 28.7,
            "pressure": 1011,
            "humidity": 89,
            "dew_point": 23.56,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.98,
            "wind_deg": 270,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.44,
            "rain": {
                "1h": 0.13
            }
        },
        {
            "dt": 1606658400,
            "temp": 25.25,
            "feels_like": 28.82,
            "pressure": 1011,
            "humidity": 90,
            "dew_point": 23.58,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.78,
            "wind_deg": 278,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.47
        },
        {
            "dt": 1606662000,
            "temp": 25.37,
            "feels_like": 29.22,
            "pressure": 1011,
            "humidity": 90,
            "dew_point": 23.62,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.48,
            "wind_deg": 283,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.42
        },
        {
            "dt": 1606665600,
            "temp": 25.41,
            "feels_like": 29.07,
            "pressure": 1011,
            "humidity": 89,
            "dew_point": 23.64,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.63,
            "wind_deg": 283,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.45
        },
        {
            "dt": 1606669200,
            "temp": 25.44,
            "feels_like": 28.95,
            "pressure": 1010,
            "humidity": 89,
            "dew_point": 23.64,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.87,
            "wind_deg": 292,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.49,
            "rain": {
                "1h": 0.33
            }
        },
        {
            "dt": 1606672800,
            "temp": 25.31,
            "feels_like": 28.99,
            "pressure": 1009,
            "humidity": 90,
            "dew_point": 23.66,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.68,
            "wind_deg": 307,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.6,
            "rain": {
                "1h": 0.4
            }
        },
        {
            "dt": 1606676400,
            "temp": 25.24,
            "feels_like": 28.78,
            "pressure": 1008,
            "humidity": 91,
            "dew_point": 23.7,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.97,
            "wind_deg": 317,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.44,
            "rain": {
                "1h": 0.63
            }
        },
        {
            "dt": 1606680000,
            "temp": 25.09,
            "feels_like": 28.62,
            "pressure": 1008,
            "humidity": 91,
            "dew_point": 23.61,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.87,
            "wind_deg": 321,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.48,
            "rain": {
                "1h": 0.7
            }
        },
        {
            "dt": 1606683600,
            "temp": 24.83,
            "feels_like": 28.43,
            "pressure": 1008,
            "humidity": 91,
            "dew_point": 23.44,
            "uvi": 0,
            "clouds": 100,
            "visibility": 9747,
            "wind_speed": 2.55,
            "wind_deg": 332,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.64,
            "rain": {
                "1h": 1.16
            }
        },
        {
            "dt": 1606687200,
            "temp": 24.43,
            "feels_like": 28.41,
            "pressure": 1008,
            "humidity": 93,
            "dew_point": 23.23,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.98,
            "wind_deg": 349,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.64,
            "rain": {
                "1h": 0.88
            }
        },
        {
            "dt": 1606690800,
            "temp": 24.44,
            "feels_like": 29.02,
            "pressure": 1009,
            "humidity": 93,
            "dew_point": 23.29,
            "uvi": 0,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.13,
            "wind_deg": 355,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.64,
            "rain": {
                "1h": 0.21
            }
        },
        {
            "dt": 1606694400,
            "temp": 25.13,
            "feels_like": 30.41,
            "pressure": 1010,
            "humidity": 91,
            "dew_point": 23.6,
            "uvi": 0.22,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.39,
            "wind_deg": 108,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.64,
            "rain": {
                "1h": 0.11
            }
        },
        {
            "dt": 1606698000,
            "temp": 25.65,
            "feels_like": 30.87,
            "pressure": 1011,
            "humidity": 89,
            "dew_point": 23.85,
            "uvi": 1.78,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.6,
            "wind_deg": 132,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.06
        },
        {
            "dt": 1606701600,
            "temp": 26.76,
            "feels_like": 32.48,
            "pressure": 1011,
            "humidity": 85,
            "dew_point": 24.13,
            "uvi": 3.72,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 0.16,
            "wind_deg": 152,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.29
        },
        {
            "dt": 1606705200,
            "temp": 29.01,
            "feels_like": 33.95,
            "pressure": 1010,
            "humidity": 74,
            "dew_point": 23.95,
            "uvi": 5.78,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.16,
            "wind_deg": 249,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.48,
            "rain": {
                "1h": 0.14
            }
        },
        {
            "dt": 1606708800,
            "temp": 29.69,
            "feels_like": 33.39,
            "pressure": 1009,
            "humidity": 70,
            "dew_point": 23.76,
            "uvi": 10.37,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.71,
            "wind_deg": 247,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.68,
            "rain": {
                "1h": 0.71
            }
        },
        {
            "dt": 1606712400,
            "temp": 29.27,
            "feels_like": 32.92,
            "pressure": 1009,
            "humidity": 73,
            "dew_point": 23.97,
            "uvi": 10.79,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.03,
            "wind_deg": 250,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.73,
            "rain": {
                "1h": 0.8
            }
        },
        {
            "dt": 1606716000,
            "temp": 28.62,
            "feels_like": 32.49,
            "pressure": 1008,
            "humidity": 77,
            "dew_point": 24.31,
            "uvi": 9.42,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.93,
            "wind_deg": 256,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.84,
            "rain": {
                "1h": 0.97
            }
        },
        {
            "dt": 1606719600,
            "temp": 28.09,
            "feels_like": 32.06,
            "pressure": 1007,
            "humidity": 80,
            "dew_point": 24.32,
            "uvi": 6.44,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.9,
            "wind_deg": 242,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.84,
            "rain": {
                "1h": 0.9
            }
        },
        {
            "dt": 1606723200,
            "temp": 27.44,
            "feels_like": 31.62,
            "pressure": 1007,
            "humidity": 83,
            "dew_point": 24.33,
            "uvi": 3.59,
            "clouds": 100,
            "visibility": 9792,
            "wind_speed": 2.59,
            "wind_deg": 229,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.88,
            "rain": {
                "1h": 0.82
            }
        },
        {
            "dt": 1606726800,
            "temp": 26.84,
            "feels_like": 31.38,
            "pressure": 1007,
            "humidity": 86,
            "dew_point": 24.45,
            "uvi": 1.37,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.08,
            "wind_deg": 235,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.94,
            "rain": {
                "1h": 0.91
            }
        }
    ],
    "daily": [
        {
            "dt": 1606536000,
            "sunrise": 1606516032,
            "sunset": 1606559666,
            "temp": {
                "day": 27.15,
                "min": 22.89,
                "max": 28.24,
                "night": 24.97,
                "eve": 26.55,
                "morn": 22.89
            },
            "feels_like": {
                "day": 31.46,
                "night": 28.95,
                "eve": 30.36,
                "morn": 26.65
            },
            "pressure": 1011,
            "humidity": 84,
            "dew_point": 24.39,
            "wind_speed": 2.32,
            "wind_deg": 306,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "clouds": 99,
            "pop": 1,
            "rain": 11.96,
            "uvi": 9.27
        },
        {
            "dt": 1606622400,
            "sunrise": 1606602453,
            "sunset": 1606646087,
            "temp": {
                "day": 27.61,
                "min": 24.38,
                "max": 28.26,
                "night": 25.41,
                "eve": 26.11,
                "morn": 24.52
            },
            "feels_like": {
                "day": 30.59,
                "night": 29.07,
                "eve": 28.94,
                "morn": 28.85
            },
            "pressure": 1010,
            "humidity": 81,
            "dew_point": 24.24,
            "wind_speed": 4.09,
            "wind_deg": 247,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 1,
            "rain": 11.45,
            "uvi": 9.02
        },
        {
            "dt": 1606708800,
            "sunrise": 1606688874,
            "sunset": 1606732509,
            "temp": {
                "day": 29.69,
                "min": 24.43,
                "max": 29.69,
                "night": 24.45,
                "eve": 26.19,
                "morn": 24.43
            },
            "feels_like": {
                "day": 33.39,
                "night": 29.02,
                "eve": 30.68,
                "morn": 28.41
            },
            "pressure": 1009,
            "humidity": 70,
            "dew_point": 23.76,
            "wind_speed": 2.71,
            "wind_deg": 247,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 1,
            "rain": 12.81,
            "uvi": 10.79
        },
        {
            "dt": 1606795200,
            "sunrise": 1606775296,
            "sunset": 1606818931,
            "temp": {
                "day": 31.33,
                "min": 23.39,
                "max": 31.33,
                "night": 25.03,
                "eve": 27.6,
                "morn": 23.39
            },
            "feels_like": {
                "day": 36.79,
                "night": 30.2,
                "eve": 32.36,
                "morn": 27.63
            },
            "pressure": 1011,
            "humidity": 64,
            "dew_point": 23.79,
            "wind_speed": 0.25,
            "wind_deg": 39,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 93,
            "pop": 1,
            "rain": 5.5,
            "uvi": 11.71
        },
        {
            "dt": 1606881600,
            "sunrise": 1606861718,
            "sunset": 1606905354,
            "temp": {
                "day": 32.43,
                "min": 23.75,
                "max": 32.43,
                "night": 25.15,
                "eve": 29.53,
                "morn": 23.75
            },
            "feels_like": {
                "day": 37.26,
                "night": 29.16,
                "eve": 32.26,
                "morn": 28.12
            },
            "pressure": 1010,
            "humidity": 57,
            "dew_point": 23.1,
            "wind_speed": 0.43,
            "wind_deg": 45,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 1,
            "pop": 0.55,
            "rain": 1.15,
            "uvi": 11.34
        },
        {
            "dt": 1606968000,
            "sunrise": 1606948141,
            "sunset": 1606991777,
            "temp": {
                "day": 31.01,
                "min": 23.87,
                "max": 31.35,
                "night": 25.32,
                "eve": 29.17,
                "morn": 23.87
            },
            "feels_like": {
                "day": 34.62,
                "night": 29.06,
                "eve": 31.95,
                "morn": 27.84
            },
            "pressure": 1010,
            "humidity": 58,
            "dew_point": 22.02,
            "wind_speed": 1.37,
            "wind_deg": 309,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 89,
            "pop": 0.48,
            "rain": 0.34,
            "uvi": 12
        },
        {
            "dt": 1607054400,
            "sunrise": 1607034565,
            "sunset": 1607078201,
            "temp": {
                "day": 30.28,
                "min": 24.07,
                "max": 30.95,
                "night": 25.43,
                "eve": 29.33,
                "morn": 24.07
            },
            "feels_like": {
                "day": 33.68,
                "night": 29.13,
                "eve": 31.69,
                "morn": 27.9
            },
            "pressure": 1010,
            "humidity": 64,
            "dew_point": 22.75,
            "wind_speed": 2.4,
            "wind_deg": 292,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 51,
            "pop": 0.79,
            "rain": 1.58,
            "uvi": 12
        },
        {
            "dt": 1607140800,
            "sunrise": 1607120989,
            "sunset": 1607164626,
            "temp": {
                "day": 30.94,
                "min": 24.19,
                "max": 32.58,
                "night": 24.53,
                "eve": 29.46,
                "morn": 24.19
            },
            "feels_like": {
                "day": 34.33,
                "night": 28.5,
                "eve": 33.04,
                "morn": 27.75
            },
            "pressure": 1010,
            "humidity": 62,
            "dew_point": 22.82,
            "wind_speed": 2.49,
            "wind_deg": 343,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "clouds": 64,
            "pop": 0.81,
            "rain": 7.19,
            "uvi": 12
        }
    ]
}
```
_Response (401 - Unauthorized)_
```
{
  "cod": 401,
  "message": "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info."
}
```
---
### GET /quotes

> Get random quotes

_Request Params_
```
Not needed
```
_Request Header_
```
{
  "access_token": "<your access token>"
}
```
_Request Body_
```
Not needed
```
_Response (200 - OK)_
```
{
  "statusCode": 200,
  "quote": {
      "_id": "5eb17ab3b69dc744b4e81ac5",
      "quoteText": "Creative people don't behave very well generally. If you're looking for examples of good relationships in show business, you're gonna be depressed real fast. I don't have time for anything else right now but work and my daughter. She's my first priority.",
      "quoteAuthor": "Jim Carrey",
      "quoteGenre": "time",
      "__v": 0
  }
}
```
---