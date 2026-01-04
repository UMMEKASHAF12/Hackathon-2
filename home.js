import supabase from "./config.js";

const { data: { user } } = await supabase.auth.getUser();

if (!user) {
    window.location.href = "login.html";
}

const userName = user.user_metadata.name;
const firstLetter = userName.charAt(0).toUpperCase();

document.getElementById("profileLetter").innerText = firstLetter;
document.getElementById("profileName").innerText = userName;

// logout
window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};

//post display

const postsGrid = document.getElementById("postsGrid");

async function loadPosts() {
  const { data: posts, error } = await supabase
    .from("Posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return;
  }

  postsGrid.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <img src="${post.img_url}" alt="${post.title}">
      <div class="post-content">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <br>
        <p>${post.username}</p>
      </div>
    `;

    postsGrid.appendChild(card);
  });
}

loadPosts();