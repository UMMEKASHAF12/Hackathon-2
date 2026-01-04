import supabase from "./config.js";

const productsBody = document.getElementById("productsBody");

async function loadProducts() {
  // 1️⃣ Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert("Please login to view your posts");
    return;
  }

  const user_id = user.id;

  // 2️⃣ Fetch only this user's posts
  const { data: posts, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  productsBody.innerHTML = "";

  // 3️⃣ Render posts
  posts.forEach((post) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <img src="${post.img_url}" class="product-img" width="100" />
      </td>
      <td>${post.title}</td>
      <td>${post.description}</td>
      <td>
        <button onclick="editPost('${post.id}')">Edit</button>
        <button onclick="deletePost('${post.id}')">Delete</button>
      </td>
    `;

    productsBody.appendChild(tr);
  });
}

// 4️⃣ Edit post function
window.editPost = async function(post_id) {
  const newTitle = prompt("Enter new title:");
  const newDesc = prompt("Enter new description:");

  if (!newTitle || !newDesc) return;

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("Posts")
    .update({ title: newTitle, description: newDesc })
    .eq("id", post_id)
    .eq("user_id", user.id); // only owner can edit

  if (error) {
    alert("Error updating post: " + error.message);
    return;
  }

  alert("Post updated successfully!");
  loadProducts(); // refresh posts
};

// 5️⃣ Delete post function
window.deletePost = async function(post_id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("Posts")
    .delete()
    .eq("id", post_id)
    .eq("user_id", user.id); // only owner can delete

  if (error) {
    alert("Error deleting post: " + error.message);
    return;
  }

  alert("Post deleted successfully!");
  loadProducts(); // refresh posts
};

// 6️⃣ Load posts on page load
loadProducts();
