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
        poster_root: 'https://image.tmdb.org/t/p/' + 'w185',
        flags_root: 'https://flagcdn.com/',
        userInput: '',
        userOutputMovies: [],
        userOutputTvShows: [],
        checkMovies: false,
        checkTvShows: false
    },
    mounted: function(){

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

            // movies
            let self = this;
            axios.get(self.api_root + '/search/movie', {
                params: {
                    api_key: self.api_key,
                    query: self.userInput
                }
            }).then(function(answerMovies){

                self.checkMovies = true;

                console.log(answerMovies.data.results);
                self.userOutputMovies = answerMovies.data.results
            });

            // tv shows
            axios.get(self.api_root + '/search/tv', {
                params: {
                    api_key: self.api_key,
                    query: self.userInput
                }
            }).then(function(answerTvShows){

                self.checkTvShows = true;

                console.log(answerTvShows.data.results);
                self.userOutputTvShows = answerTvShows.data.results
            });
        },
        starsCounter: function(item, j){
            // inserire qui la base attraverso la quale rappresentare il punteggio del film
            let baseOfScore = 5; //base 5

            // approssimazione del valore in base definita (baseOfScore) arrotondato al valore intro ad esso più vicino
            let scoreBaseFive = Math.round(item.vote_average * (baseOfScore * 0.1))
            // console.log(scoreBaseFive);

            if (scoreBaseFive >= j || scoreBaseFive == baseOfScore) {
                return 'fas fa-star'
            } else {
                return 'far fa-star'
            }
        }
    }
});
