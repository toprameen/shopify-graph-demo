// Main JavaScript functionality for the Flask GraphQL app

document.addEventListener("DOMContentLoaded", function () {
  const loadUsersBtn = document.getElementById("loadUsers");
  const usersListDiv = document.getElementById("usersList");

  if (loadUsersBtn) {
    loadUsersBtn.addEventListener("click", loadUsers);
  }
});

// GraphQL helper function
async function graphqlRequest(query, variables = {}) {
  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw error;
  }
}

async function loadUsers() {
  const loadUsersBtn = document.getElementById("loadUsers");
  const usersListDiv = document.getElementById("usersList");

  // Show loading state
  loadUsersBtn.innerHTML = '<span class="loading"></span> Loading...';
  loadUsersBtn.disabled = true;

  const USERS_QUERY = `
        query {
            users {
                id
                username
                email
                createdAt
            }
        }
    `;

  try {
    const data = await graphqlRequest(USERS_QUERY);
    const users = data.users;

    if (users.length === 0) {
      usersListDiv.innerHTML = `
                <div class="alert alert-info">
                    <h5>No users found</h5>
                    <p>Try creating a user first using GraphQL:</p>
                    <code>mutation { createUser(username: "john_doe", email: "john@example.com") { user { username email } success } }</code>
                    <p class="mt-2"><a href="/graphql" class="btn btn-sm btn-outline-primary" target="_blank">Open GraphiQL</a></p>
                </div>
            `;
    } else {
      const usersHtml = users
        .map(
          (user) => `
                <div class="col-md-4 user-card">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title">${user.username}</h6>
                            <p class="card-text">${user.email}</p>
                            <small class="text-muted">Created: ${new Date(
                              user.createdAt
                            ).toLocaleDateString()}</small>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-danger" onclick="deleteUser('${
                                  user.id
                                }')">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");

      usersListDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4>Users (${users.length})</h4>
                    <button class="btn btn-primary" onclick="showCreateUserForm()">Add User</button>
                </div>
                <div class="row">${usersHtml}</div>
            `;
    }
  } catch (error) {
    usersListDiv.innerHTML = `
            <div class="alert alert-danger">
                <h5>Error loading users</h5>
                <p>Could not connect to GraphQL API. Make sure the server is running.</p>
                <p class="mb-0">Error: ${error.message}</p>
            </div>
        `;
    console.error("Error loading users:", error);
  } finally {
    // Reset button state
    loadUsersBtn.innerHTML = "Load Users";
    loadUsersBtn.disabled = false;
  }
}

// Create user function
async function createUser(username, email) {
  const CREATE_USER_MUTATION = `
        mutation CreateUser($username: String!, $email: String!) {
            createUser(username: $username, email: $email) {
                user {
                    id
                    username
                    email
                    createdAt
                }
                success
                error
            }
        }
    `;

  try {
    const data = await graphqlRequest(CREATE_USER_MUTATION, {
      username,
      email,
    });
    const result = data.createUser;

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Delete user function
async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) {
    return;
  }

  const DELETE_USER_MUTATION = `
        mutation DeleteUser($id: String!) {
            deleteUser(id: $id) {
                success
                error
            }
        }
    `;

  try {
    const data = await graphqlRequest(DELETE_USER_MUTATION, { id: userId });
    const result = data.deleteUser;

    if (result.error) {
      throw new Error(result.error);
    }

    // Reload users after successful deletion
    loadUsers();
    alert("User deleted successfully!");
  } catch (error) {
    alert("Error deleting user: " + error.message);
    console.error("Error deleting user:", error);
  }
}

// Show create user form
function showCreateUserForm() {
  const usersListDiv = document.getElementById("usersList");

  const currentContent = usersListDiv.innerHTML;

  usersListDiv.innerHTML = `
        <div class="row">
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-header">
                        <h5>Create New User</h5>
                    </div>
                    <div class="card-body">
                        <form id="createUserForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-success">Create User</button>
                                <button type="button" class="btn btn-secondary" onclick="cancelCreateUser()">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Store current content for cancellation
  window.currentUsersContent = currentContent;

  // Handle form submission
  document
    .getElementById("createUserForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;

      try {
        await createUser(username, email);
        loadUsers(); // Reload users list
        alert("User created successfully!");
      } catch (error) {
        alert("Error creating user: " + error.message);
      }
    });
}

// Cancel create user form
function cancelCreateUser() {
  const usersListDiv = document.getElementById("usersList");
  usersListDiv.innerHTML = window.currentUsersContent || "";
}
