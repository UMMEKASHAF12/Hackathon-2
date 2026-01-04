import supabase from "./config.js";

const productsBody = document.getElementById("productsBody");

// Modal elements
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editImage = document.getElementById("editImage"); 
const saveEdit = document.getElementById("saveEdit");

let currentEditId = null;
let currentPost = null;

// Load posts
async function loadProducts() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return;

  const user_id = user.id;

  const { data: posts, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  productsBody.innerHTML = "";

  posts.forEach((post) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${post.img_url}" class="product-img" width="100" /></td>
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

// Open edit modal
window.editPost = async function(post_id) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("id", post_id)
    .eq("user_id", user.id)
    .single();

  if (error || !post) return alert("Cannot edit this post.");

  currentEditId = post_id;
  currentPost = post;

  editTitle.value = post.title;
  editDescription.value = post.description;
  editImage.value = ""; // reset input

  // Show modal
  editModal.style.display = "block";
};

// Close modal
closeModal.onclick = () => editModal.style.display = "none";
window.onclick = (event) => { if (event.target === editModal) editModal.style.display = "none"; };

// Save edits
saveEdit.onclick = async function() {
  const newTitle = editTitle.value.trim();
  const newDesc = editDescription.value.trim();
  const newImgFile = editImage.files[0];

  if (!newTitle || !newDesc) return alert("Fill all fields");

  const { data: { user } } = await supabase.auth.getUser();

  let updatedData = { title: newTitle, description: newDesc };

  // ✅ If new image is selected
  if (newImgFile) {
    const uniqueName = `posts/${Date.now()}-${Math.floor(Math.random()*1000)}-${newImgFile.name}`;
    
    // Upload
    const { error: uploadError } = await supabase.storage
      .from("Posts")
      .upload(uniqueName, newImgFile);

    if (uploadError) return alert("Image upload failed: " + uploadError.message);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("Posts")
      .getPublicUrl(uniqueName);

    updatedData.img_url = urlData.publicUrl;
  }

  // Update post
  const { error } = await supabase
    .from("Posts")
    .update(updatedData)
    .eq("id", currentEditId)
    .eq("user_id", user.id);

  if (error) return alert("Update failed: " + error.message);

  alert("Post updated!");
  editModal.style.display = "none";
  loadProducts();
};

// Delete
window.deletePost = async function(post_id) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("Posts")
    .delete()
    .eq("id", post_id)
    .eq("user_id", user.id);

  if (error) return alert("Delete failed: " + error.message);

  alert("Deleted successfully!");
  loadProducts();
};

// Initial load
loadProducts();

