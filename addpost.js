import supabase from "./config.js";

const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!title || !description || !imageFile) {
    alert("Please fill all required fields");
    return;
  }

  try {
    //  Get current logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("Please login first to add a post");
      return;
    }

    const user_id = user.id;
    const username = user.user_metadata?.username;
    
    if (!username) {
      alert("Your account does not have a username. Please update your profile.");
      return;
    }

    // Upload image
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("Posts")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert("Image upload failed: " + uploadError.message);
      return;
    }

    //  Get public URL of uploaded image
    const { data: urlData, error: urlError } = supabase.storage
      .from("Posts")
      .getPublicUrl(fileName);

    if (urlError || !urlData.publicUrl) {
      alert("Failed to get image URL");
      return;
    }

    const img_url = urlData.publicUrl;

    // Insert post into database
    const { error: insertError } = await supabase.from("Posts").insert([
      {
        title,
        description,
        img_url,
        user_id,
        username
      },
    ]);

    if (insertError) {
      alert("Failed to add post: " + insertError.message);
      return;
    }

    alert("Post added successfully!");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check console for details.");
  }
});


