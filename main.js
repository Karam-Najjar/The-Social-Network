userStatus();
getAllPosts();

const default_image =
  "./images/x-logo-twitter-elon-musk_dezeen_2364_col_0-1-852x479.jpg";
function getAllPosts() {
  axios
    .get("https://tarmeezacademy.com/api/v1/posts")
    .then(function (response) {
      let responseData = response.data.data;
      for (let i = 0; i < responseData.length; i++) {
        let userName = responseData[i].author.username;
        let userId = responseData[i].author.id;
        let postTitle = responseData[i].title;
        let postBody = responseData[i].body;
        let commentsCount = responseData[i].comments_count;
        let tags = responseData[i].tags;
        let image =
          responseData[i].image && typeof responseData[i].image === "string"
            ? responseData[i].image
            : default_image;
        let profileImage =
          responseData[i].author.profile_image &&
          typeof responseData[i].author.profile_image === "string"
            ? responseData[i].author.profile_image
            : default_image;
        let createdAt = responseData[i].created_at;
        if (!postTitle) {
          postTitle = "Post title is missing";
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
                <span class="badge rounded-pill bg-secondary">Some Tag</span>
              </div>
              <!--END OF CARD FOOTER -->
            </div>
        `;
      }
    });
}

function logIn() {
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

      userStatus();
    })
    .catch(function (error) {
      console.log(error.response.data.message);
    });
}

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

function getAllTags() {
  let url = "https://tarmeezacademy.com/api/v1/tags";
  let headers = { "Content-Type": "application/json" };
  axios
    .get(url, headers)
    .then(function (response) {
      // handle success
      console.log("Tags", response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function userStatus() {
  let token = localStorage.getItem("token");

  if (!token) {
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
    let addButton = document.getElementById("createNewPost");
    document.body.removeChild(addButton);
  } else {
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
                onclick="loggedOut()"
                data-bs-toggle="modal"
                data-bs-target="#logOutModal"
               >
                 Logout
               </button>
             </div>`;
  }
  createAddButton();
}

function createAddButton() {
  let addButton = document.createElement("button");
  addButton.classList.add("addButton");
  addButton.textContent = "+";
  addButton.id = "createNewPost";
  document.body.appendChild(addButton);
}
