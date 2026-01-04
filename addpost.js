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
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("Posts") 
      .upload(fileName, imageFile);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    
    const { data } = supabase.storage
      .from("Posts")
      .getPublicUrl(fileName);

    const img_url = data.publicUrl;

   
    const { error } = await supabase.from("Posts").insert([
      {
        title: title,
        description: description,
        img_url: img_url,
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
