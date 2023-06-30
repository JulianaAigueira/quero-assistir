const searchButton = document.getElementById('search-button');
const overlay = document.getElementById('modal-overlay');
const movieName = document.getElementById('movie-name');
const movieYear = document.getElementById('movie-year');
const movieListContainer = document.getElementById('movie-list');

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function searchButtonClickHandler(){
    try{
        let url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('data: ', data);
        if(data.Error){
            throw new Error('Filme não encontrado!')
        }
        createModal(data)
        overlay.classList.add('open');
    } catch (error) {
        notie.alert({ type: 'error', text: error.message });
    }
} 

function movieNameParameterGenerator(){
    if(movieName.value === ''){
        throw new Error('O nome do filme deve ser informado!');
    }
    return movieName.value.split(' ').join('+');
}

function movieYearParameterGenerator(){
    if(movieYear.value === ''){
        return '';
    }
    if(movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))){
        throw new Error('Ano do filme inválido!');
    }
    return `&y=${movieYear.value}`;
}

function addToList(data){
    if (isFilmAlreadyOnTheList(data.imdbID)){
        notie.alert({ type: 'error', text: 'Filme já está na sua lista!' });
        return;
    }
    movieList.push(data);
    updateLocalStorage();
    updateUI(data);
    overlay.classList.remove('open');
}

function updateUI(data){
    movieListContainer.innerHTML += `<article id='movie-card-${data.imdbID}'>
    <img
        src="${data.Poster}"
        alt="Poster do ${data.Title}.">
        <button class="remove-button" onclick='{removeFilmFromList("${data.imdbID}")}'>
        <i class="bi bi-trash"></i>Remover</button>
</article>`
}

function isFilmAlreadyOnTheList(imdbId){
    function isThisIdFromThisMovie(movie){
        return movie.imdbID === imdbId;
    }
    return movieList.find(isThisIdFromThisMovie);
}

function removeFilmFromList(imdbId){
    movieList = movieList.filter(movie => movie.imdbID !== imdbId);//para cada filme que vc tenha na lista pega ele e retorna essa informação pra mim
    document.getElementById(`movie-card-${imdbId}`).remove();
    updateLocalStorage();
}

function updateLocalStorage(){
    localStorage.setItem('movieList', JSON.stringify(movieList));

}

movieList.forEach(updateUI);

searchButton.addEventListener('click', searchButtonClickHandler);