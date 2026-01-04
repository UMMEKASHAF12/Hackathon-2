import supabase from "./config.js";

let semail = document.getElementById("useremail");
let sname = document.getElementById("username");
let spassword = document.getElementById("userpassword");

async function signup(e) {
    e.preventDefault();

    try {
        if (!semail.value) {
            alert("Please enter your email");
            return;
        }

        if (!sname.value) {
            alert("Please enter your name");
            return;
        }

        if (!spassword.value) {
            alert("Please enter your password");
            return;
        }

        // ✅ Single signup call
        const { data, error } = await supabase.auth.signUp({
            email: semail.value,
            password: spassword.value,
            options: {
                data: {
                    username: sname.value  // Save username in user_metadata
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Signup successful!");
        console.log(data.user);

        window.location.href = "home.html";

    } catch (err) {
        console.log(err);
        alert("Something went wrong");
    }
}

document.querySelector("form").addEventListener("submit", signup);
