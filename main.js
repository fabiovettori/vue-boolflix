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

const api_root = 'http://api.themoviedb.org/3';
const api_key = '321a2ab5febe4cd472acd62ae7fec177';
const poster_size = ['w92','w154','w185','w342','w500','w780','original'];
const poster_root = 'https://image.tmdb.org/t/p/' + poster_size[2];

var app = new Vue({
    el: '#root',
    data: {
        userInput: '',
        userOutputMovies: [],
        userOutputTvShows: [],
        flags: [
            {
                lang: 'it',
                url: 'https://flagcdn.com/it.svg',//italy
            },
            {
                lang: 'de',
                url: 'https://flagcdn.com/de.svg',//Germany
            },
            {
                lang: 'es',
                url: 'https://flagcdn.com/es.svg',//Spain
            },
            {
                lang: 'en',
                url: 'https://flagcdn.com/gb.svg',//UK
            },
            {
                lang: 'fr',
                url: 'https://flagcdn.com/fr.svg',//France
            },
            {
                lang: 'usa',
                url: 'https://flagcdn.com/us.svg',//USA
            }
        ]
    },
    mounted: function(){
        // this.ajax()
    },
    methods: {
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

            // movies
            let self = this;
            axios.get(api_root + '/search/movie', {
                params: {
                    api_key: api_key,
                    query: self.userInput
                }
            }).then(function(answerMovies){

                console.log(answerMovies.data.results);
                self.userOutputMovies = answerMovies.data.results
            });

            // tv shows
            axios.get(api_root + '/search/tv', {
                params: {
                    api_key: api_key,
                    query: self.userInput
                }
            }).then(function(answerTvShows){

                console.log(answerTvShows.data.results);
                self.userOutputTvShows = answerTvShows.data.results
            });
        },
        starsMovie: function(i, j){
            let container = this.userOutputMovies;
            this.starsCounter(i, j, container);
        },
        flagsMovie: function(i, j){
            let container = this.userOutputMovies;
            this.flagsCounter(i, j, container);
        },

        starsTvShow: function(i, j){
            let container = this.userOutputTvShows;
            this.starsCounter(i, j, container);
        },
        flagsTvShow: function(i, j){
            let container = this.userOutputTvShows;
            this.flagsCounter(i, j, container);
        },

        starsCounter: function(i, j, container){
            // inserire qui la base attraverso la quale rappresentare il punteggio del film
            let baseOfScore = 5; //base 5

            // approssimazione del valore in base definita (baseOfScore) arrotondato al valore intro ad esso più vicino
            let scoreBaseFive = Math.round(container[i].vote_average * (baseOfScore * 0.1))
            // console.log(scoreBaseFive);

            if (scoreBaseFive >= j || scoreBaseFive == baseOfScore) {
                return 'fas fa-star'
            } else {
                return 'far fa-star'
            }
        },
        flagsCounter: function(i, j, container){
            let langMovie = container[i].original_language
            // console.log(langMovie);

            if (this.flags[j].lang.includes(langMovie)) {
                return true
            }
        },
    }
});
