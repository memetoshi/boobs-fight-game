document.addEventListener("DOMContentLoaded", async function () {
    let supabase;

    async function fetchSupabaseCredentials() {
        try {
            const response = await fetch("/get_supabase_credentials");
            const data = await response.json();
            supabase = supabase.createClient(data.supabaseUrl, data.supabaseKey);
        } catch (error) {
            console.error("Error fetching Supabase credentials:", error);
            alert("Failed to connect to Supabase.");
        }
    }

    await fetchSupabaseCredentials();

    const usernameInput = document.getElementById("username");
    const boobsImageInput = document.getElementById("boobsImage");
    const buttImageInput = document.getElementById("buttImage");
    const saveCharacterButton = document.getElementById("saveCharacter");
    const editCharacterButton = document.getElementById("editCharacter");
    const goToLobbyButton = document.getElementById("goToLobby");
    const characterForm = document.getElementById("characterForm");
    const characterDisplay = document.getElementById("characterDisplay");
    const displayUsername = document.getElementById("displayUsername");
    const displayBoobs = document.getElementById("displayBoobs");
    const displayButt = document.getElementById("displayButt");

    async function saveCharacter() {
        const username = usernameInput.value;
        const boobsFile = boobsImageInput.files[0];
        const buttFile = buttImageInput.files[0];

        if (!username || !boobsFile || !buttFile) {
            alert("Please fill all fields and upload both images.");
            return;
        }

        const { data: boobsData, error: boobsError } = await supabase.storage.from("characters").upload(`boobs_${username}`, boobsFile);
        const { data: buttData, error: buttError } = await supabase.storage.from("characters").upload(`butt_${username}`, buttFile);

        if (boobsError || buttError) {
            alert("Error uploading images. Try again.");
            return;
        }

        const boobsUrl = supabase.storage.from("characters").getPublicUrl(`boobs_${username}`).publicUrl;
        const buttUrl = supabase.storage.from("characters").getPublicUrl(`butt_${username}`).publicUrl;

        const { error } = await supabase.from("players").upsert({ username, boobs_url: boobsUrl, butt_url: buttUrl });
        if (error) {
            alert("Error saving character. Try again.");
            return;
        }

        displayCharacter(username, boobsUrl, buttUrl);
    }

    async function displayCharacter(username, boobsUrl, buttUrl) {
        displayUsername.textContent = username;
        displayBoobs.src = boobsUrl;
        displayButt.src = buttUrl;

        characterForm.classList.add("hidden");
        characterDisplay.classList.remove("hidden");
        goToLobbyButton.classList.remove("hidden");
    }

    function editCharacter() {
        characterForm.classList.remove("hidden");
        characterDisplay.classList.add("hidden");
        goToLobbyButton.classList.add("hidden");
    }

    saveCharacterButton.addEventListener("click", saveCharacter);
    editCharacterButton.addEventListener("click", editCharacter);
});
