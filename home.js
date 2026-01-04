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
