import supabase from "./config.js";

// Check if user is logged in
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    window.location.href = "login.html";
}

// Display user info
const userName = user.user_metadata.name || "Anonymous";
const firstLetter = userName.charAt(0).toUpperCase();
document.getElementById("profileLetter").innerText = firstLetter;
document.getElementById("profileName").innerText = userName;

// Logout function
window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};

// Posts display
const postsGrid = document.getElementById("postsGrid");

async function loadPosts() {
    const { data: posts, error } = await supabase
        .from("Posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error.message);
        postsGrid.innerHTML = `<p style="color:red; text-align:center;">Failed to load posts</p>`;
        return;
    }

    postsGrid.innerHTML = "";

    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";

        card.innerHTML = `
            <img src="${post.img_url}" alt="${post.title}" class="post-card-img">
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <p class="post-username">Posted by: ${post.username}</p>
            </div>
        `;

        // Click event → open details page
        card.addEventListener("click", () => {
            window.location.href = `postdetails.html?id=${post.id}`;
        });

        postsGrid.appendChild(card);
    });
}

// Initial load
loadPosts();
