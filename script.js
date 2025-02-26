document.getElementById("fightButton").addEventListener("click", startDuel);

function startDuel() {
  document.getElementById("duelSection").classList.remove("hidden");

  // Remplace ces liens par les images réelles plus tard
  document.getElementById("image1").src = "https://via.placeholder.com/400x400?text=Seins+1";
  document.getElementById("image2").src = "https://via.placeholder.com/400x400?text=Seins+2";
}

function vote(imageId) {
  alert(`You voted for ${imageId}!`);
}
