// IF THE USER IS CLICKED
function userLogged() {
  let userLogged = false;

  if (!userLogged) {
    document.getElementById("justTest2").innerHTML = `
  <img
                style="max-width: 40px"
                src="./images/x-logo-twitter-elon-musk_dezeen_2364_col_0-1-852x479.jpg"
                class="rounded-circle mx-1"
                alt="..."
              />

              <button
                class="btn btn-outline-danger ms-1"
                type="button"
                id="logOut"
              >
                Logout
              </button>
            </div>`;
    userLogged = true;
  } else {
    document.getElementById("justTest2").innerHTML = `

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
    userLogged = false;
  }
}
// END OF IF THE USER IS CLICKED

function loggedOut(logout) {
  let logOutModal = document.getElementById("logOutModal");
  let modalInstance = bootstrap.Modal.getInstance(logOutModal);
  modalInstance.hide();
  if (!logout) {
    return;
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  userStatus();
}

function createNewPost() {
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
  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, config)
    .then(function (response) {
      console.log(response);
      showAlert("Post was created successfully", "success");
      let createNewPostModal = document.getElementById("createNewPostModal");
      let modalInstance = bootstrap.Modal.getInstance(createNewPostModal);
      modalInstance.hide();
      getAllPosts();
    })
    .catch(function (error) {
      showAlert(error.message, "danger");
    });
}

const default_image =
  "./images/x-logo-twitter-elon-musk_dezeen_2364_col_0-1-852x479.jpg";
function getAllPosts() {
  axios
    .get("https://tarmeezacademy.com/api/v1/posts")
    .then(function (response) {
      let responseData = response.data.data;
      console.log(responseData);
      document.getElementById("cards").innerHTML = ``;
      for (let i = 0; i < responseData.length; i++) {
        let userName = responseData[i].author.username;
        let userId = responseData[i].author.id;
        let postTitle = responseData[i].title;
        let postBody = responseData[i].body;
        let commentsCount = responseData[i].comments_count;
        let tags = responseData[i].tags;
        let image = responseData[i].image;
        // && typeof responseData[i].image === "string"
        //   ? responseData[i].image
        //   : default_image;
        let profileImage = responseData[i].author.profile_image;
        // &&
        // typeof responseData[i].author.profile_image === "string"
        //   ? responseData[i].author.profile_image
        //   : default_image;
        let createdAt = responseData[i].created_at;
        if (!postTitle) {
          postTitle = "Post title is missing";
        }

        let tagsHtml = "";
        for (tag of tags) {
          tagsHtml += `<span class="badge rounded-pill bg-secondary me-1">${tag.name}</span>`;
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
                <!-- END OF USER PHOTO -->

                <!-- USER NAME -->

                <b class="card-title"> ${userName}</b>

                <!-- END OF USER NAME -->
              </div>

              <!-- POST PICTURE -->
              <img
                src="${image}"
                alt="Something went wrong!!!"
                class="card-img-bottom"
                style="height: 680px"
              />

              <!--END OF POST PICTURE -->

              <!-- CARD FOOTER -->
              <div style="padding: 5px 20px">
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
              <!--END OF CARD FOOTER -->
            </div>
        `;
      }
    });
}

window.addEventListener("scroll", function () {
  // Calculate the distance between the bottom of the page and the current scroll position
  let distanceToBottom =
    document.documentElement.offsetHeight -
    (window.innerHeight + window.scrollY);

  // Define a threshold to determine when the user has reached the bottom (e.g., 100 pixels)
  let threshold = 1;

  // Check if the user has reached the bottom by comparing the distance to the threshold
  if (distanceToBottom < threshold && currentPage < lastPage) {
    // The user has reached the bottom, so you can trigger your desired action here
    console.log("Reached the bottom of the page!");
    currentPage++;
    getAllPosts(false, currentPage);

    // You might want to load more content or perform some other action here
  }
});

// THE OLD GET ALL POSTS

function getAllPosts(empty = true, currentPage = 1) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=3&page=${currentPage}`)
    .then(function (response) {
      let responseData = response.data.data;
      lastPage = response.data.meta.last_page;
      if (empty) {
        document.getElementById("cards").innerHTML = ``;
      }
      for (let i = 0; i < responseData.length; i++) {
        let userName = responseData[i].author.username;
        let userId = responseData[i].author.id;
        let id = responseData[i].id;
        let postTitle = responseData[i].title;
        let postBody = responseData[i].body;
        let commentsCount = responseData[i].comments_count;
        let tags = responseData[i].tags;
        let image = responseData[i].image;
        let profileImage = responseData[i].author.profile_image;
        let createdAt = responseData[i].created_at;
        if (!postTitle) {
          postTitle = "Post title is missing";
        }

        let tagsHtml = "";
        for (tag of tags) {
          tagsHtml += `<span class="badge rounded-pill bg-secondary me-1">${tag.name}</span>`;
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

                    <button onclick="updatePost()"
                            style="float: right; margin-top: 8px; margin-right: 9px"
                            type="button"
                            class="btn btn-outline-primary">Update
                    </button>
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
                  <div onclick="showPost(${id})" style="padding: 5px 20px">
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
      }
      console.log(responseData);
    });
}

function createAddButton() {
  let updateButton = document.createElement("button");
  let updateContainer = document.getElementById("updateContainer");
  addButton.classList.add("updateButton");
  addButton.textContent = "Update";
  addButton.id = "updateBtton";
  updateContainer.appendChild(updateButton);
}

// THE OLD UPDATE POST LOGIC
if (userId == userIdFromLocal) {
  let spanDiv = document.getElementById(`updateButtonContainer${id}`);
  let updateButton = document.createElement("button");
  updateButton.innerText = "Update";
  updateButton.id = `updateButton_${index}`;
  updateButton.classList.add("btn", "btn-outline-primary", "customeButton");
  spanDiv.appendChild(updateButton);
  updateButton.addEventListener("click", updatePost(index));
}

function updatePost(index) {
  console.log(index);
  // let thisPost = posts[parseInt(index)];
  // console.log("post => ", thisPost);
  // document.getElementById("exampleModalLabel.15").innerHTML = "Update post";
  // document.getElementById("postTitle").value = thisPost.title;
  // document.getElementById("floatingTextarea").value = thisPost.body;
  // let postModal = new bootstrap.Modal(
  //   document.getElementById("createNewPostModal"),
  //   {}
  // );
  // postModal.toggle();
}

let userFromLocal = JSON.parse(localStorage.getItem("user"));
let userIdFromLocal = userFromLocal.id;

// END OF THE OLD UPDATE POST LOGIC

function getAllTags() {
  let url = "https://tarmeezacademy.com/api/v1/tags";
  let headers = { "Content-Type": "application/json" };
  axios
    .get(url, headers)
    .then(function (response) {
      // handle success
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
