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
