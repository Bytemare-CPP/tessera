# Users API Documentation

**Base URL**  
`http://localhost:4000/api/users`

---

## 1. Get User Profile

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

## 2. Update User Profile

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

## Notes

- The `user_id` is required for both endpoints and must match an existing user in the database.
- The `GET /profile` endpoint is used for both self-profile and peer-profile retrieval.
- The `PUT /profile` endpoint currently allows unrestricted updates, but **will be restricted to the authenticated user's profile** once authentication is implemented.
