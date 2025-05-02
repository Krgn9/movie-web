const form = document.getElementById("movie-form");
const list = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let movies = JSON.parse(localStorage.getItem("movies")) || [];

function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

function renderMovies() {
  list.innerHTML = "";

  let filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortSelect.value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  filtered.forEach((movie, index) => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = movie.poster || "";
    img.className = "poster";

    const details = document.createElement("div");
    details.className = "movie-details";
    details.innerHTML = `<strong>${movie.title}</strong> (${movie.genre})<br/>⭐ ${movie.rating}/10`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => editMovie(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      movies.splice(index, 1);
      saveMovies();
      renderMovies();
    };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(img);
    li.appendChild(details);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

function editMovie(index) {
  const movie = movies[index];
  const title = prompt("New title:", movie.title);
  const rating = prompt("New rating (1-10):", movie.rating);
  const genre = prompt("New genre:", movie.genre);
  if (title && rating && genre) {
    movies[index] = { ...movie, title, rating, genre };
    saveMovies();
    renderMovies();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const rating = document.getElementById("rating").value;
  const genre = document.getElementById("genre").value;
  const posterFile = document.getElementById("poster").files[0];

  if (posterFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      movies.push({
        title,
        rating,
        genre,
        poster: reader.result
      });
      saveMovies();
      renderMovies();
      form.reset();
    };
    reader.readAsDataURL(posterFile);
  } else {
    movies.push({ title, rating, genre, poster: "" });
    saveMovies();
    renderMovies();
    form.reset();
  }
});

searchInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);

renderMovies();
