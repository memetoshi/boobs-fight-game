document.addEventListener("DOMContentLoaded", async () => {
    const characterForm = document.getElementById("characterForm");
    const characterDisplay = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("username");
    const boobsImageInput = document.getElementById("boobsImage");
    const buttImageInput = document.getElementById("buttImage");
    const displayUsername = document.getElementById("displayUsername");
    const displayBoobs = document.getElementById("displayBoobs");
    const displayButt = document.getElementById("displayButt");
    const saveButton = document.getElementById("saveCharacter");
    const editButton = document.getElementById("editCharacter");
    
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.id) {
        alert("You need to be logged in to create a character.");
        return;
    }

    // Fetch existing character data
    const { data: character, error } = await supabase
        .from("characters")
        .select("username, boobs_image, butt_image")
        .eq("user_id", user.id)
        .single();
    
    if (character) {
        displayUsername.textContent = character.username;
        displayBoobs.src = character.boobs_image;
        displayButt.src = character.butt_image;
        characterForm.classList.add("hidden");
        characterDisplay.classList.remove("hidden");
    }

    saveButton.addEventListener("click", saveCharacter);
    editButton.addEventListener("click", editCharacter);
});

async function saveCharacter() {
    const username = document.getElementById("username").value;
    const boobsImageFile = document.getElementById("boobsImage").files[0];
    const buttImageFile = document.getElementById("buttImage").files[0];

    if (!username || !boobsImageFile || !buttImageFile) {
        alert("Please fill in all fields.");
        return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.id) {
        alert("You need to be logged in to create a character.");
        return;
    }

    // Upload images
    const boobsImagePath = `characters/${user.id}_boobs.png`;
    const buttImagePath = `characters/${user.id}_butt.png`;
    await supabase.storage.from("images").upload(boobsImagePath, boobsImageFile);
    await supabase.storage.from("images").upload(buttImagePath, buttImageFile);
    
    const boobsImageUrl = supabase.storage.from("images").getPublicUrl(boobsImagePath).data.publicUrl;
    const buttImageUrl = supabase.storage.from("images").getPublicUrl(buttImagePath).data.publicUrl;

    // Insert character into DB
    const { error } = await supabase.from("characters").upsert({
        user_id: user.id,
        username,
        boobs_image: boobsImageUrl,
        butt_image: buttImageUrl
    });

    if (error) {
        alert("Error saving character: " + error.message);
    } else {
        alert("Character saved successfully!");
        location.reload();
    }
}

function editCharacter() {
    document.getElementById("characterForm").classList.remove("hidden");
    document.getElementById("characterDisplay").classList.add("hidden");
}
