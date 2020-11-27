// MILESTONE 1
// Creare un layout di base con una barra di ricerca composta da un input e un pulsante. Quando l'utente clicca sul pulsante, facciamo una chiamata all'API https://api.themoviedb.org/3/search/movie ricordandoci di passare la nostra API key e la query di ricerca, ossia il testo inserito dall'utente nell'input.
// Con i risultati che riceviamo, visualizziamo in pagina una card per ogni film, stampando per ciascuno:
// titolo
// titolo in lingua originale
// lingua originale
// voto
//
//
// MILESTONE 2
// La seconda milestone è a sua volta suddivisa in 3 punti:
// 1- sostituire il voto numerico su base 10 in un voto su base 5 e visualizzare in totale 5 stelline, di cui tante piene quanto è il voto arrotondato (non gestiamo stelline a metà). Ad esempio, se il voto è 8.2, dobbiamo visualizzare 4 stelline piene e 1 stellina vuota (in totale sempre 5)
// 2- sostituire la lingua con una bandierina che identifica il paese.
// Suggerimento: scarichiamo una manciata di bandierine relative alle lingue che vogliamo gestire (attenzione che la lingua è "en", non "us" o "uk" :wink: ). Quindi andremo ad inserire solamente le bandierine che sappiamo di avere, mentre per le altre lingue di cui non abbiamo previsto la bandierina, lasciamo il codice della lingua testuale
// 3- aggiungere ai risultati anche le serie tv. Attenzione che alcune chiavi per le serie tv sono diverse da quelle dei film, come ad esempio "title" per i film e "name" per le serie

var app = new Vue({
    el: '#root',
    data: {
        api_root: 'https://api.themoviedb.org/3',
        api_key: '321a2ab5febe4cd472acd62ae7fec177',
        poster_size: ['w92','w154','w185','w342','w500','w780','original'],
        poster_root: `https://image.tmdb.org/t/p/' + ${this.poster_root}`,
        flags_root: 'https://flagcdn.com/',
        userInput: '',
        userOutputString: '',
        userOutputMovies: [],
        userOutputTvShows: [],
        userOutputGenres: '',
        checkMovies: false,
        checkTvShows: false,
        checkGenresMovies: false,
        checkGenresTvShows: false,
        botHelper: null,
        toggleBtn: false,
        pop: false,
        popContainer: false,
        headerAnimation: false,
        activeSelection: {
            item: -1,
            container: []
        },
        genres: {
            movies: [],
            tvshows: [],
            allGenres: []
        },
        colorRate: ''
    },
    mounted: function(){
        this.headerOnScroll()
    },
    methods: {
        lang: function(language){

            var flag = language;

            // flag che cambiano tra language e baniderina
            if (language == 'en') {
                flag = 'gb';
            } else if (language == 'ja'){
                flag = 'jp';
            }

            return this.flags_root + flag + '.svg';
        },
        ajax: function(){
            // devo passare nella API sempre
            // - in questo caso la chiamata deve essere fatta in GET
            // - https://api.themoviedb.org/3 (dove 3 è la versione della API) +
            // - /search/movie (end point) +
            // [url iniziale]

            // - 321a2ab5febe4cd472acd62ae7fec177 (API KEY) +
            // - query di ricerca +
            // - parametri opzionali (es. lingua)
            // [parametri da concatenare]

            // N.B. Devo quindi prendere url iniziale ed andare a concatenere i paramtri cosi come è richiesto dalla API

            const array = ['#', '@', ';',  '  '];
            let check = false;

            for (var i = 0; i < array.length; i++) {
                if (this.userInput.includes(array[i])) {
                    check = true;
                }
            }

            if (check) {
                this.botHelper = true;
            } else {

                this.userOutputString = this.userInput;
                // this.userOutputString = this.$refs["toggle-search"].value;

                // movies
                let self = this;
                axios.get(self.api_root + '/search/movie', {
                    params: {
                        api_key: self.api_key,
                        query: self.userInput.trim()
                    }
                }).then(function(answerMovies){

                    self.checkMovies = true;

                    console.log(answerMovies.data.results);
                    self.userOutputMovies = answerMovies.data.results

                    self.userInput = '';

                });

                // tv shows
                axios.get(self.api_root + '/search/tv', {
                    params: {
                        api_key: self.api_key,
                        query: self.userInput.trim()
                    }
                }).then(function(answerTvShows){

                    self.checkTvShows = true;

                    console.log(answerTvShows.data.results);
                    self.userOutputTvShows = answerTvShows.data.results

                    self.userInput = '';
                });

                // movies genres list
                axios.get(self.api_root + '/genre/movie/list', {
                    params: {
                        api_key: self.api_key,
                        language: 'en'
                    }
                }).then(function(answerMoviesGenresList){

                    self.checkGenresMovies = true;

                    console.log(answerMoviesGenresList.data.genres);
                    self.genres.movies = answerMoviesGenresList.data.genres

                    self.genres.allGenres = self.genres.allGenres.concat(self.genres.movies)

                    self.userInput = '';
                });

                // tv shows genres list
                axios.get(self.api_root + '/genre/tv/list', {
                    params: {
                        api_key: self.api_key,
                        language: 'en'
                    }
                }).then(function(answerTvShosGenresList){

                    self.checkGenresTvShows = true;

                    console.log(answerTvShosGenresList.data.genres);
                    self.genres.tvshows = answerTvShosGenresList.data.genres

                    self.genres.allGenres = self.genres.allGenres.concat(self.genres.tvshows)

                    self.userInput = '';
                });
            }
        },
        starsCounter: function(item, j){
            // inserire qui la base attraverso la quale rappresentare il punteggio del film
            let baseOfScore = 5; //base 5

            // approssimazione del valore in base definita (baseOfScore) arrotondato al valore intro ad esso più vicino
            let scoreBaseFive = Math.round(item.vote_average * (baseOfScore * 0.1))
            // console.log(scoreBaseFive);

            let classStar = '';
            if (scoreBaseFive >= j || scoreBaseFive == baseOfScore) {
                classStar = 'fas fa-star'
            } else {
                classStar = 'far fa-star'
            }
            return classStar
        },
        closeBtn: function(){
            this.botHelper = null;
            this.userInput = '';
        },
        toggleSearch: function(){
            if (this.toggleBtn == false) {
                this.toggleBtn = true
            } else {
                this.toggleBtn = false
            }
        },
        togglePopUp: function(i, container){

            // console.log(i, container);
            this.activeSelection.item = i;
            this.activeSelection.container = container;

            let activeItem = this.activeSelection.container[this.activeSelection.item];

            let activeItemGenres = activeItem.genre_ids;
            // console.log(activeItemGenres);

            let genres = [];
            for (var i = 0; i < activeItemGenres.length; i++) {

                for (var j = 0; j < app.genres.allGenres.length; j++) {

                    if (activeItemGenres[i] == app.genres.allGenres[j].id && !genres.includes(app.genres.allGenres[j].name)) {
                        genres.push(app.genres.allGenres[j].name)
                    }
                }
            }

            this.userOutputGenres = genres.join(', ');

            if (this.popContainer == false) {
                this.popContainer = true
            } else {
                this.popContainer = false
            }
        },
        closePop: function(){

            if (window.event.target.classList.contains('pop-container') || window.event.target.classList.contains('close-icon')) {
                this.popContainer = false
                this.activeSelection.item = -1;
            }
        },
        headerOnScroll: function(){
            let lastScrollY = 0;

            let self = this;
            window.addEventListener("scroll", function(){
            let scrollUserY = window.scrollY;

            if (scrollUserY > lastScrollY){
               self.headerAnimation = true;
              // console.log('down');
            } else {
               self.headerAnimation = false;
              // console.log('up');
            }
               lastScrollY = scrollUserY <= 0 ? 0 : scrollUserY;
            });
        },
        circleRate: function(output, item){
            let scoreBase100 = output[item].vote_average * 10;

            /* 10% = 126deg = 90 + ( 360 * .1 ) */
            let deg = scoreBase100 * 0.01 * 360;

            let color = '';
            if (scoreBase100 >= 50) {
                color = `backgroundColor: green; backgroundImage: linear-gradient(${deg - 90}deg, transparent 50%, green 50%),linear-gradient(90deg, #081c22 50%, transparent 50%)`;
            } else {
                color = `backgroundColor: yellow; backgroundImage: linear-gradient(${deg + 90}deg, transparent 50%, #081c22 50%),linear-gradient(90deg, #081c22 50%, transparent 50%)`;
            }
            return color
        },
        customDate: function(output, item, keyObject){
            return moment(output[item].keyObject).format('DD MMMM, YYYY');
        }
    }
});
