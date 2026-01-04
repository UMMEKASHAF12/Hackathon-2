import supabase from "./config.js";

const form = document.querySelector("form");
const emailInput = document.getElementById("useremail");
const passwordInput = document.getElementById("userpassword");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;


    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    try {
        // Supabase login docs --- Sign in user
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Login successful!");
        console.log(data.user);

        window.location.href = "index.html";

    } catch (err) {
        console.log(err);
    }
});
