# Users

## Create

- **URL**
  + `/users`
- **Method**
  + `POST`
- **Query Params**
  + None
- **Data Params**
  + Required
    * `username: [string]`
    * `password: [string]`
  + Optional
    * `firstName: [string]`
    * `lastName: [string]`
- **Success Response**
  + Code: `201 CREATED`
  + Content:

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "username": "jsmith",
  "token": "somegibberishstring"
}
```

- **Error Response**
  * Code: `400 BAD REQUEST`
  * Content: `{ "error": "Invalid data parameters." }`


## List

  - **URL**
    + `/users`
  - **Method**
    + `GET`
  - **Query Params**
    + None
  - **Data Params**
    + Required
      * `token: [string]`
  - **Success Response**
    + Code: `201 OK`
    + Content:

  ```json
  [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "username": "jsmith",
      "role": 1
    },
    {
      "id": 2,
      "firstName": "Peter",
      "lastName": "Piper",
      "username": "piper",
      "role": 2
    }
  ]
  ```

  - **Error Response**
    * Code: `400 BAD REQUEST`
    * Content: `{ "error": "Invalid data parameters." }`

    OR

    * Code: `401 UNAUTHORIZED`
    * Content: `{ "error": "You are unauthorized to make this request." }`

## Find

  - **URL**
    + `/users/:id`
  - **Method**
    + `GET`
  - **Query Params**
    + None
  - **Data Params**
    + Required
      * `token: [string]`
  - **Success Response**
    + Code: `201 OK`
    + Content:

  ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "username": "jsmith",
      "role": 1
    }
  ```

  - **Error Response**
    * Code: `404 NOT FOUND`
    * Content: `{ "error": "Project doesn't exist." }`

    OR

    * Code: `401 UNAUTHORIZED`
    * Content: `{ "error": "You are unauthorized to make this request." }`

## Update

  - **URL**
    + `/users/:id`
  - **Method**
    + `PUT`
  - **Query Params**
    + None
  - **Data Params**
    + Required
      * `token: [string]`
    + Optional
      * `username: [string]`
      * `firstName: [string]`
      * `lastName: [string]`
      * `role: [number]`
  - **Success Response**
    + Code: `201 OK`
    + Content:

  ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "username": "jsmith",
      "role": 1
    }
  ```

  - **Error Response**
    * Code: `400 BAD REQUEST`
    * Content: `{ "error": "Invalid data parameters." }`

    OR

    * Code: `401 UNAUTHORIZED`
    * Content: `{ "error": "You are unauthorized to make this request." }`

## Delete

  - **URL**
    + `/users/:id`
  - **Method**
    + `DELETE`
  - **Query Params**
    + None
  - **Data Params**
    + Required
      * `token: [string]`
  - **Success Response**
    + Code: `204 NO CONTENT`
    + Content:

  ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "username": "jsmith",
      "role": 1
    }
  ```

  - **Error Response**
    * Code: `404 NOT FOUND`
    * Content: `{ "error": "User doesn't exist." }`

    OR

    * Code: `401 UNAUTHORIZED`
    * Content: `{ "error": "You are unauthorized to make this request." }`
    
