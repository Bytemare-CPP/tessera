# Server API Documentation

## Users API Documentation

**Base URL**  
`http://localhost:4000/api/users`

---

### 1. Get User Profile

**Description:**  
Fetches the profile of a user by their `user_id`.

**Method:**  
`GET`

**Endpoint:**  
`/profile`

**Example:**  
`http://localhost:4000/api/users/profile?user_id=<user_id>`

**Query Parameters:**
- `user_id` (string, required): The ID of the user whose profile is being fetched.

**Response:**
- `200 OK`: Returns the user profile.
- `400 Bad Request`: Missing or invalid `user_id`.
- `404 Not Found`: No profile found for the given `user_id`.
- `500 Internal Server Error`: Unexpected server error.

---

### 2. Update User Profile

**Description:**  
Updates the profile of a user by their `user_id`.

**Method:**  
`PUT`

**Endpoint:**  
`/profile`

**Example:**  
`http://localhost:4000/api/users/profile`
```json
{
  "user_id": "<user_id>",
  "full_name": "Jane Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "website": "https://janedoe.com"
}
```

**Request Body:**
- `user_id` (string, required): The ID of the user whose profile is being updated.
- Other fields to update, e.g.:
  - `full_name` (string)
  - `avatar_url` (string)
  - `website` (string)

**Response:**
- `200 OK`: Profile updated successfully.
- `400 Bad Request`: Invalid input or missing fields.
- `500 Internal Server Error`: Unexpected server error.

---

### Notes

- The `user_id` is required for both endpoints and must match an existing user in the database.
- The `GET /profile` endpoint is used for both self-profile and peer-profile retrieval.
- The `PUT /profile` endpoint currently allows unrestricted updates, but **will be restricted to the authenticated user's profile** once authentication is implemented.

---

## Posts API Documentation

**Base URL**  
`http://localhost:4000/api/posts`

---

### 1. Create a Post

**Description:**  
Creates a new post for a user.

**Method:**  
`POST`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/posts/`
```json
{
  "user_id": "<user_id>",
  "text": "This is an example post content"
}
```

**Request Body:**
- `user_id` (string, required): The ID of the user creating the post.
- `text` (string, required): The content of the post (1-500 characters).

**Response:**
- `201 Created`: Post created successfully.
- `400 Bad Request`: Missing or invalid input.
- `500 Internal Server Error`: Unexpected server error.

---

### 2. Get a Single Post

**Description:**  
Fetches a single post by its `id`.

**Method:**  
`GET`

**Endpoint:**  
`/:id`

**Example:**  
`http://localhost:4000/api/posts/<post_id>`

**Path Parameters:**
- `id` (string, required): The ID of the post to fetch.

**Response:**
- `200 OK`: Returns the post details.
- `400 Bad Request`: Missing or invalid `id`.
- `404 Not Found`: No post found for the given `id`.
- `500 Internal Server Error`: Unexpected server error.

---

### 3. Get Posts for a User

**Description:**  
Fetches all posts created by a specific user.

**Method:**  
`GET`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/posts?user_id=<user_id>`

**Query Parameters:**
- `user_id` (string, required): The ID of the user whose posts are being fetched.

**Response:**
- `200 OK`: Returns a list of posts for the user.
- `400 Bad Request`: Missing or invalid `user_id`.
- `500 Internal Server Error`: Unexpected server error.

---

### 4. Update a Post

**Description:**  
Updates the content of an existing post.

**Method:**  
`PUT`

**Endpoint:**  
`/:id`

**Example:**  
`http://localhost:4000/api/posts/<post_id>`
```json
{
  "text": "Updated post content"
}
```

**Path Parameters:**
- `id` (string, required): The ID of the post to update.

**Request Body:**
- `text` (string, required): The updated content of the post (1-500 characters).

**Response:**
- `200 OK`: Post updated successfully.
- `400 Bad Request`: Missing or invalid input.
- `404 Not Found`: No post found for the given `id`.
- `500 Internal Server Error`: Unexpected server error.

---

### 5. Delete a Post

**Description:**  
Deletes a post by its `id` and `user_id`.

**Method:**  
`DELETE`

**Endpoint:**  
`/:id`

**Example:**  
`http://localhost:4000/api/posts/<post_id>`
```json
{
  "user_id": "<user_id>"
}
```

**Path Parameters:**
- `id` (string, required): The ID of the post to delete.

**Request Body:**
- `user_id` (string, required): The ID of the user who owns the post.

**Response:**
- `200 OK`: Post deleted successfully.
- `400 Bad Request`: Missing or invalid input.
- `404 Not Found`: No post found for the given `id` and `user_id`.
- `500 Internal Server Error`: Unexpected server error.

---

### Notes

- The `user_id` is required for creating, fetching (all posts), and deleting posts to ensure proper ownership validation.
- The `GET /:id` endpoint does not currently require `user_id` but will enforce ownership validation once authentication is implemented.
- The `text` field for posts is limited to 1-500 characters.

---

## Connections API Documentation

**Base URL**  
`http://localhost:4000/api/connections`

---

### 1. Create a Connection

**Description:**  
Creates a new connection between two users.

**Method:**  
`POST`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/connections/`
```json
{
  "user_1": "<user_id_1>",
  "user_2": "<user_id_2>"
}
```

**Request Body:**
- `user_1` (string, required): The ID of the first user in the connection.
- `user_2` (string, required): The ID of the second user in the connection.

**Response:**
- `201 Created`: Connection created successfully.
- `400 Bad Request`: Missing or invalid input.
- `500 Internal Server Error`: Unexpected server error.

---

### 2. Get a Connection

**Description:**  
Fetches a specific connection between two users.

**Method:**  
`GET`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/connections?user_1=<user_id_1>&user_2=<user_id_2>`

**Query Parameters:**
- `user_1` (string, required): The ID of the first user in the connection.
- `user_2` (string, required): The ID of the second user in the connection.

**Response:**
- `200 OK`: Returns the connection details.
- `400 Bad Request`: Missing or invalid input.
- `404 Not Found`: No connection found for the given users.
- `500 Internal Server Error`: Unexpected server error.

---

### 3. Get Connections for a User

**Description:**  
Fetches all connections for a specific user.

**Method:**  
`GET`

**Endpoint:**  
`/all`

**Example:**  
`http://localhost:4000/api/connections/all?user_id=<user_id>`

**Query Parameters:**
- `user_id` (string, required): The ID of the user whose connections are being fetched.

**Response:**
- `200 OK`: Returns a list of connections for the user.
- `400 Bad Request`: Missing or invalid `user_id`.
- `500 Internal Server Error`: Unexpected server error.

---

### 4. Update a Connection

**Description:**  
Updates the status of an existing connection.

**Method:**  
`PUT`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/connections/`
```json
{
  "user_1": "<user_id_1>",
  "user_2": "<user_id_2>",
  "status": "accepted"
}
```

**Request Body:**
- `user_1` (string, required): The ID of the first user in the connection.
- `user_2` (string, required): The ID of the second user in the connection.
- `status` (string, required): The new status of the connection. Must be one of:
  - `pending`
  - `accepted`
  - `rejected`

**Response:**
- `200 OK`: Connection updated successfully.
- `400 Bad Request`: Missing or invalid input.
- `404 Not Found`: No connection found for the given users.
- `500 Internal Server Error`: Unexpected server error.

---

### 5. Delete a Connection

**Description:**  
Deletes a connection between two users.

**Method:**  
`DELETE`

**Endpoint:**  
`/`

**Example:**  
`http://localhost:4000/api/connections/`
```json
{
  "user_1": "<user_id_1>",
  "user_2": "<user_id_2>"
}
```

**Request Body:**
- `user_1` (string, required): The ID of the first user in the connection.
- `user_2` (string, required): The ID of the second user in the connection.

**Response:**
- `200 OK`: Connection deleted successfully.
- `400 Bad Request`: Missing or invalid input.
- `404 Not Found`: No connection found for the given users.
- `500 Internal Server Error`: Unexpected server error.

---

### Notes

- The `user_1` and `user_2` fields are required for all endpoints to identify the connection.
- The `status` field is required for updating a connection and must be one of the predefined values (`pending`, `accepted`, `rejected`).
- The `GET /all` endpoint fetches all connections for a specific user, regardless of their role in the connection (i.e., whether they are `user_1` or `user_2`).
