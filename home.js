document.addEventListener("DOMContentLoaded", async function () {
    let supabase;

async function fetchSupabaseCredentials() {
    try {
        const response = await fetch("http://127.0.0.1:5000/get_supabase_credentials"); // Mets ici ton IP locale si nécessaire
        const data = await response.json();
        supabase = supabase.createClient(data.supabaseUrl, data.supabaseKey);
        console.log("✅ Supabase connecté avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la connexion à Supabase :", error);
        alert("Failed to connect to Supabase.");
    }
}

    await fetchSupabaseCredentials();

    const usernameInput = document.getElementById("username");document.addEventListener("DOMContentLoaded", async function () {
    let supabase; // Déclaration globale de Supabase

    async function fetchSupabaseCredentials() {
        try {
            const response = await fetch("/get_supabase_credentials");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Vérifie que la réponse est bien du JSON
            supabase = window.supabase.createClient(data.supabase_url, data.supabase_key);
            console.log("✅ Supabase connecté !");
        } catch (error) {
            console.error("❌ Erreur lors de la connexion à Supabase :", error);
            alert("Failed to connect to Supabase.");
        }
    }

    await fetchSupabaseCredentials(); // Attends d'avoir les credentials avant d'utiliser Supabase

    // Sélection des éléments du DOM
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
        if (!supabase) {
            alert("❌ Supabase n'est pas connecté !");
            return;
        }

        const username = usernameInput.value.trim();
        const boobsFile = boobsImageInput.files[0];
        const buttFile = buttImageInput.files[0];

        if (!username || !boobsFile || !buttFile) {
            alert("❌ Remplis tous les champs et télécharge deux images.");
            return;
        }

        try {
            // Upload des images sur Supabase Storage
            const { data: boobsData, error: boobsError } = await supabase
                .storage
                .from("characters")
                .upload(`boobs_${username}`, boobsFile, { cacheControl: '3600', upsert: true });

            const { data: buttData, error: buttError } = await supabase
                .storage
                .from("characters")
                .upload(`butt_${username}`, buttFile, { cacheControl: '3600', upsert: true });

            if (boobsError || buttError) {
                throw new Error("Erreur lors de l'upload des images.");
            }

            // Récupération des URLs publiques
            const boobsUrl = supabase.storage.from("characters").getPublicUrl(`boobs_${username}`).publicUrl;
            const buttUrl = supabase.storage.from("characters").getPublicUrl(`butt_${username}`).publicUrl;

            // Sauvegarde des infos du joueur dans la BDD
            const { error } = await supabase
                .from("players")
                .upsert({ username, boobs_url: boobsUrl, butt_url: buttUrl });

            if (error) {
                throw new Error("Erreur lors de la sauvegarde du personnage.");
            }

            console.log("✅ Personnage enregistré !");
            displayCharacter(username, boobsUrl, buttUrl);
        } catch (error) {
            alert(error.message);
            console.error("❌ Erreur :", error);
        }
    }

    function displayCharacter(username, boobsUrl, buttUrl) {
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
