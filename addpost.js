import supabase from "./config.js";

const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image").files[0];

  if (!title || !description || !imageFile) {
    alert("Please fill all required fields");
    return;
  }

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      alert(userError.message);
      return;
    }

    const user_id = user.id;
    const username = user.user_metadata?.username || "Anonymous"; // username fetch

    const fileName = `${Date.now()}-${imageFile.name}`;

    // Upload image
    const { error: uploadError } = await supabase.storage
      .from("Posts")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    // Get public URL
    const { data: urlData, error: urlError } = supabase.storage
      .from("Posts")
      .getPublicUrl(fileName);

    if (urlError) {
      alert(urlError.message);
      return;
    }

    const img_url = urlData.publicUrl;

    // Insert post
    const { error } = await supabase.from("Posts").insert([
      {
        title,
        description,
        img_url,
        user_id,
        username
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Post added successfully!");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});

