import supabase from "./config.js";

const productsBody = document.getElementById("productsBody");

async function loadProducts() {
  const { data: posts, error } = await supabase
    .from("Posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  productsBody.innerHTML = "";

  posts.forEach((post) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <img src="${post.img_url}" class="product-img" />
      </td>
      <td>${post.title}</td>
      <td>${post.description}</td>
    `;

    productsBody.appendChild(tr);
  });
}

loadProducts();
console.log(post.img_url);