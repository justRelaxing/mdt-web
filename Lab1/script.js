const numberOfFilms = prompt('Сколько фильмов вы уже посмотрели?', '');

const personalMovieDB = {
  count: numberOfFilms,
  movies: {}
};

for (let i = 0; i < 2; i++) {
  let movie = prompt('Один из последних просмотренных фильмов?', '');
  let rating = prompt('На сколько оцените его?', '');

  if (
    movie !== null && rating !== null &&
    movie.trim() !== '' && rating.trim() !== '' &&
    movie.trim().length <= 50
  ) {
    personalMovieDB.movies[movie.trim()] = rating.trim();
  } else {
    i--;
  }
}

console.log(personalMovieDB);

function displayMoviesTable(movies) {
  const table = document.createElement('table');

  const headerRow = document.createElement('tr');

  const headerMovie = document.createElement('th');
  headerMovie.textContent = 'Название фильма';
  headerRow.appendChild(headerMovie);

  const headerRating = document.createElement('th');
  headerRating.textContent = 'Оценка';
  headerRow.appendChild(headerRating);

  table.appendChild(headerRow);

  for (let movie in movies) {
    if (movies.hasOwnProperty(movie)) {
      const row = document.createElement('tr');

      const movieCell = document.createElement('td');
      movieCell.textContent = movie;
      row.appendChild(movieCell);

      const ratingCell = document.createElement('td');
      ratingCell.textContent = movies[movie];
      row.appendChild(ratingCell);

      table.appendChild(row);
    }
  }

  document.body.appendChild(table);
}

displayMoviesTable(personalMovieDB.movies);
