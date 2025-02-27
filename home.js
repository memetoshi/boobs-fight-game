document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const boobsImageInput = document.getElementById("boobsImage");
    const buttImageInput = document.getElementById("buttImage");
    const saveCharacterButton = document.getElementById("saveCharacter");
    const editCharacterButton = document.getElementById("editCharacter");
    const characterForm = document.getElementById("characterForm");
    const characterDisplay = document.getElementById("characterDisplay");
    const boobsPreview = document.getElementById("boobsPreview");
    const buttPreview = document.getElementById("buttPreview");

    function saveCharacter() {
        const username = usernameInput.value;
        const boobsImage = boobsImageInput.files[0];
        const buttImage = buttImageInput.files[0];

        if (!username || !boobsImage || !buttImage) {
            alert("Please fill all fields and upload both images.");
            return;
        }

        const boobsURL = URL.createObjectURL(boobsImage);
        const buttURL = URL.createObjectURL(buttImage);

        localStorage.setItem("username", username);
        localStorage.setItem("boobsImage", boobsURL);
        localStorage.setItem("buttImage", buttURL);

        displayCharacter();
    }

    function displayCharacter() {
        const savedUsername = localStorage.getItem("username");
        const savedBoobsImage = localStorage.getItem("boobsImage");
        const savedButtImage = localStorage.getItem("buttImage");

        if (savedUsername && savedBoobsImage && savedButtImage) {
            usernameInput.value = savedUsername;
            boobsPreview.src = savedBoobsImage;
            buttPreview.src = savedButtImage;

            characterForm.classList.add("hidden");
            characterDisplay.classList.remove("hidden");
        }
    }

    function editCharacter() {
        characterForm.classList.remove("hidden");
        characterDisplay.classList.add("hidden");
    }

    saveCharacterButton.addEventListener("click", saveCharacter);
    editCharacterButton.addEventListener("click", editCharacter);

    displayCharacter();
});
