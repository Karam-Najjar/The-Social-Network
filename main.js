let currentPage = 1;
let lastPage;

window.addEventListener("scroll", function () {
  let distanceToBottom =
    document.documentElement.offsetHeight -
    (window.innerHeight + window.scrollY);

  let threshold = 1;
  if (distanceToBottom < threshold && currentPage < lastPage) {
    console.log("Reached the bottom of the page!");
    currentPage++;
    getAllPosts(false, currentPage);
  }
});

function userStatus(callRemoveButton = true, callAddButton = true) {
  let token = localStorage.getItem("token");

  if (!token) {
    document.getElementById("rightSideNavBar").innerHTML = `

                      <button
                class="btn btn-outline-success me-1"
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#logInModal"
              >
                Log In
              </button>
              <button
                class="btn btn-outline-success ms-1"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#registerModal"
              >
                Register
              </button>

    `;
    if (callRemoveButton) {
      removeAddButton();
    }
  } else {
    let user = localStorage.getItem("user");
    let userId = JSON.parse(user).id;
    let userName = JSON.parse(user).username;
    let userProfileImage = JSON.parse(user).profile_image;
    document.getElementById("rightSideNavBar").innerHTML = `
     <h6 style= "margin:8px 2px 0px 0px;">${userName}</h6>
     <img
                 style="max-width: 40px; max-height: 40px"
                 src="${userProfileImage}"
                 class="rounded-circle mx-1"
                 alt="..."
               />

              <button
                class="btn btn-outline-danger ms-1"
                type="button"
                onclick="logOut()"
                data-bs-toggle="modal"
                data-bs-target="#logOutModal"
               >
                 Logout
               </button>
             </div>`;
    if (callAddButton) {
      createAddButton();
    }
  }
}

function logIn(withCreateBtn) {
  let logInUserName = document.getElementById("logInUserName").value;
  let logInUserPassword = document.getElementById("logInUserPassword").value;
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: logInUserName,
      password: logInUserPassword,
    })
    .then(function (response) {
      let token = response.data.token;
      let user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      let logInModal = document.getElementById("logInModal");
      let modalInstance = bootstrap.Modal.getInstance(logInModal);
      modalInstance.hide();

      userStatus(!withCreateBtn, withCreateBtn);

      showAlert("Logged in successfully");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

function logInWithBtnCreate() {
  logIn(true);
}

function getAllPosts(empty = true, currentPage = 1) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=3&page=${currentPage}`)
    .then(function (response) {
      posts = response.data.data;
      lastPage = response.data.meta.last_page;
      let userFromLocal = JSON.parse(localStorage.getItem("user"));

      if (empty) {
        document.getElementById("cards").innerHTML = ``;
      }
      for (post of posts) {
        let userName = post.author.username;
        let userId = post.author.id;
        let postId = post.id;
        let postTitle = post.title;
        let postBody = post.body;
        let commentsCount = post.comments_count;
        let tags = post.tags;
        let image = post.image;
        let profileImage = post.author.profile_image;
        let createdAt = post.created_at;
        if (!postTitle) {
          postTitle = "Post title is missing";
        }

        let tagsHtml = "";
        for (tag of tags) {
          tagsHtml += `<span class="badge rounded-pill bg-secondary me-1">${tag.name}</span>`;
        }

        let updateBtn = ``;
        if (userFromLocal.id == userId) {
          updateBtn = `<button
                        id="updateButton"
                        onclick="updatePost('${postId}', '${postTitle}', '${postBody}')"
                        style="float: right; margin-top: 8px; margin-right: 9px"
                        type="button"
                        class="btn btn-outline-secondary">
                        Update
                      </button>`;
        }
        let deleteBtn = ``;
        if (userFromLocal.id == userId) {
          deleteBtn = `<button
                        id="deleteButton"
                        onclick="deletePost('${postId}')"
                        style="float: right; margin-top: 8px; margin-right: 9px"
                        type="button"
                        class="btn btn-outline-danger">
                        Delete
                      </button>`;
        }

        document.getElementById("cards").innerHTML += `

            <div id="card" class="card my-5 pb-2 shadow">
              <div class="card-body" style="padding-top: 5px; height: 75px">
                <!-- USER PHOTO -->
                    <img
                      style="min-width: 70px; min-height: 70px; max-width: 70px; max-height:70px"
                      src="${profileImage}"
                      class="rounded-circle p-2"
                      alt="..."
                    />
                <!--///// END OF USER PHOTO////// -->

                <!-- USER NAME -->

                  <b class="card-title"> ${userName}</b>
                  

                <!--///// END OF USER NAME////// -->

              ${updateBtn}
              ${deleteBtn}


              </div>

              <!-- POST PICTURE -->
              <img
                src="${image}"
                alt="Something went wrong!!!"
                class="card-img-bottom"
                style="height: 680px"
              />

              <!--/////END OF POST PICTURE////// -->

              <!-- CARD FOOTER -->
                  <div onclick="showPost(${postId})" style="padding: 5px 20px">
                    <span style="color: grey">${createdAt}</span>
                    <h5>${postTitle}</h5>
                    <p style="padding-top: 5px">${postBody}
                    </p>
                    <hr
                      style="
                        margin-left: 20px;
                        margin-right: 20px;
                        border: 1px solid black;
                      "
                    />
                    <i class="bi bi-pen"></i>
                    <span>(${commentsCount}) Comments</span>
                    ${tagsHtml}
                  </div>
              <!--/////END OF CARD FOOTER////// -->
            </div>            
        `;
        // index++;
      }
    });
}

function updatePost(postId, postTitle, postBody) {
  document.getElementById("post_id").value = postId;
  document.getElementById("exampleModalLabel.15").innerText = "Update post";
  document.getElementById("postTitle").value = postTitle;
  document.getElementById("floatingTextarea").value = postBody;
  document.getElementById("createNewPostButton").innerText = "Update";

  let updatePostModal = new bootstrap.Modal(
    document.getElementById("createNewPostModal"),
    {}
  );
  updatePostModal.toggle();
}

function createNewPost() {
  let post_id = document.getElementById("post_id").value;

  let isCreate = post_id == null || post_id == "";
  let token = localStorage.getItem("token");
  let title = document.getElementById("postTitle").value;
  let body = document.getElementById("floatingTextarea").value;
  let image = document.getElementById("postImage").files[0];

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 30000,
  };

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  let postUrl = ``;
  if (isCreate) {
    postUrl = "https://tarmeezacademy.com/api/v1/posts";
    axios
      .post(postUrl, formData, config)
      .then(function (response) {
        showAlert("Post was created successfully", "success");
        let createNewPostModal = document.getElementById("createNewPostModal");
        let modalInstance = bootstrap.Modal.getInstance(createNewPostModal);
        modalInstance.hide();
        getAllPosts();
      })
      .catch(function (error) {
        showAlert(error.response.data.message, "danger");
      });
  } else {
    postUrl = `https://tarmeezacademy.com/api/v1/posts/${post_id}`;

    formData.append("_method", "put");
    axios
      .post(postUrl, formData, config)
      .then(function (response) {
        showAlert("Post was updated successfully", "success");
        let createNewPostModal = document.getElementById("createNewPostModal");
        let modalInstance = bootstrap.Modal.getInstance(createNewPostModal);
        modalInstance.hide();
        getAllPosts();
      })
      .catch(function (error) {
        showAlert(error.response.data.message, "danger");
      });
  }
}

function logOut(logout) {
  let logOutModal = document.getElementById("logOutModal");
  let modalInstance = bootstrap.Modal.getInstance(logOutModal);
  modalInstance.hide();
  if (!logout) {
    return;
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  userStatus();
  showAlert("Logged out", "success");
}

function registerUser() {
  let registerName = document.getElementById("registerName").value;
  let registerUserName = document.getElementById("registerUserName").value;
  let registerPassword = document.getElementById("registerPassword").value;
  let image = document.getElementById("profileImage").files[0];

  let formData = new FormData();
  formData.append("name", registerName);
  formData.append("username", registerUserName);
  formData.append("password", registerPassword);
  formData.append("image", image);
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      let token = response.data.token;
      let user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      let registerModal = document.getElementById("registerModal");
      let modalInstance = bootstrap.Modal.getInstance(registerModal);
      modalInstance.hide();

      userStatus();
      showAlert("The user was registered successfully", "success");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

function createAddButton() {
  let addButton = document.createElement("button");
  addButton.classList.add("addButton");
  addButton.textContent = "+";
  addButton.id = "createNewPost";
  addButton.onclick = function () {
    document.getElementById("exampleModalLabel.15").innerText =
      "Create new post";
    document.getElementById("postTitle").value = ``;
    document.getElementById("floatingTextarea").value = ``;
    document.getElementById("createNewPostButton").innerText = "Crreate";

    let updatePostModal = new bootstrap.Modal(
      document.getElementById("createNewPostModal"),
      {}
    );
    updatePostModal.toggle();
  };
  document.body.appendChild(addButton);
}

function removeAddButton() {
  const createNewPostButton = document.getElementById("createNewPost");
  if (createNewPostButton) {
    document.body.removeChild(createNewPostButton);
  }
}

function showAlert(message = "Show Alert", type = "success") {
  const alertPlaceholder = document.body; // or wherever you want to append the alert

  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper", "alert", "fade", "show");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    wrapper.remove();
  }, 3500);
}

function showPost(id) {
  window.location = `showPost.html?id=${id}`;
}

function getPostFromUrl() {
  // Get the ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  // Make the API call
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then(function (response) {
      let token = localStorage.getItem("token");
      let responseData = response.data.data;
      let commentDetails = responseData.comments;
      let commentInfo = "";
      for (comment of commentDetails) {
        commentInfo += `   
        <div
          id="cardComments"
          class="cardComments"
          style="
            background-color: rgb(229, 250, 250);
            padding: 5px 20px;
            margin: 0;
          "
          >
            <img
              style="
                min-width: 58px;
                min-height: 58px;
                max-width: 58px;
                max-height: 58px;
              "
              src="${comment.author.profile_image}"
              class="rounded-circle p-2"
              alt="..."
            />
          <!-- END OF USER PHOTO -->

          <!-- USER NAME -->

          <b class="card-title">${comment.author.username}</b>
          <p style="display: inline; margin: 3px 0px 3px 5px">${comment.body}
          </p>
        </div>
        <!-- TO DO -->
        `;
      }
      document.getElementById("userPost").innerHTML = `

      <h3 class="mt-5">${responseData.author.username}'s post</h3>
      <div>
        <div id="cards" class="cards">
          <div id="card" class="card my-5 pb-2 shadow">
            <div class="card-body" style="padding-top: 5px; height: 75px">
              <!-- USER PHOTO -->
              <img
                style="
                  min-width: 75px;
                  min-height: 75px;
                  max-width: 75px;
                  max-height: 75px;
                "
                src="${responseData.author.profile_image}"
                class="rounded-circle p-2"
                alt="..."
              />
              <!-- END OF USER PHOTO -->

              <!-- USER NAME -->

              <b class="card-title">${responseData.author.username}</b>

              <!-- END OF USER NAME -->
            </div>

            <!-- POST PICTURE -->
            <img
              src="${responseData.image}"
              alt="Something went wrong!!!"
              class="card-img-bottom"
              style="height: 680px"
            />

            <!--END OF POST PICTURE -->

            <!-- CARD FOOTER -->
            <div>
              <div>
                <div style="padding: 5px 20px">
                  <span style="color: grey">${responseData.created_at}</span>
                  <h5>${responseData.title}</h5>
                  <p style="padding-top: 5px">${responseData.body}</p>
                  <hr
                    style="
                      margin-left: 20px;
                      margin-right: 20px;
                      border: 1px solid black;
                    "
                  />
                  <i class="bi bi-pen"></i>
                  <span>(${responseData.comments_count}) Comments</span>
                  <hr
                    style="
                      margin-left: 20px;
                      margin-right: 20px;
                      border: 1px solid black;
                    "
                  />
                </div>
                ${commentInfo}
                <div id="sendCommentDiv" class="input-group mt-2" style="padding: 0px 10px">
                  <input
                    id="sendCommentInput"
                    type="text"
                    class="form-control"
                    aria-label="Text input with segmented dropdown button"
                  />
                  <button  onclick="addNewComment()" type="button" class="btn btn-outline-primary">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--END OF CARD FOOTER -->

      `;
      if (!token) {
        let sendCommentDiv = document.getElementById("sendCommentDiv");
        sendCommentDiv.remove();
      }
    });
}

function addNewComment() {
  let commentContent = document.getElementById("sendCommentInput").value;
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  let token = localStorage.getItem("token");

  let params = {
    body: commentContent,
  };

  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
      params,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      showAlert("The comment was created successfully", "success");
      getPostFromUrl();
    })
    .catch((error) => {
      const errormessage = error.response.data.message;
      showAlert(errormessage, "danger");
    });
}

function deletePost(postId) {
  let check = confirm("Are you sure?");
  if (check) {
    let token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    };
    axios
      .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, config)
      .then(function (response) {
        getAllPosts();
        showAlert("Post was deleted successfully", "success");
      })
      .catch(function (error) {
        showAlert(error.response.data.message, "danger");
      });
  }
}
