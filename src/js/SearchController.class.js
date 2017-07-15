class SearchController
{

    constructor() {
        this.aboutMeListenerInit();
        this.topBtnListenerInit();
        this.searchBtnListenerInit();
        this.showQueryFromUrl();   
    }

    showQueryFromUrl() {

        var _query = this.getParameterByName('q');
        if ( _query ) {
            $('#search').val( _query );
            this.searchBtnAction( _query );
        }
        
        return;
    }

    topBtnListenerInit() {
        $('#top').on('click', (e) => {
            $('.app-scrollable').scrollTop(0);
        });
    }

    aboutMeListenerInit() {
        $('#about').on('click', (e) => {

            App.dialog({
                title        : 'About Us',
                text         : 'This is a Open Source Project. If you wish to contibute please see our GitHub Page.',
                okButton     : 'Go to GitHub',
                cancelButton : 'Cancel'
            }, function (goToGithub) {
                if (goToGithub) {
                    window.location.href = 'https://github.com/DilwoarH/Quran-Search-App';
                }
            });

        });
    }


    searchBtnListenerInit() {
        $('#searchBtn').on('click', (e) => {
            var _search = $('#search').val();
            this.searchBtnAction( _search );
        });
    }

    searchBtnAction( _search ) {
        this.displayLoading();
        //update query string
        this.updateQueryString( _search );

        var searchText = _search;
        var quranApi = new QuranApi();

        if ( searchText.length < 3 )
        {
            this.displayResults( `<div class="text red">Search text must be 3 or more letters.</div>` );
            return;
        }

        quranApi.search( searchText )
        .then( 
            ( results ) => {
                //console.info('success');
                
                if ( !results )
                {
                    this.displayResults( `<div class="text">No Verses Found.</div>` );
                    return;
                }

                var resultHTML = '';
                var matches = results.data.matches;

                var i, len;
                for (i = 0, len = matches.length; i < len; i++) 
                {
                    var match = matches[i];
                    resultHTML += `
                        <div class="match panel panel-default">
                            <div class="panel-body">
                                ${match.text}
                            </div>
                            <div class="panel-footer">
                                ${match.surah.number}:${match.numberInSurah} - ${match.surah.englishName} - <a href="https://quran.com/${match.surah.number}/${match.numberInSurah}" target="_blank">See more</a>
                            </div>
                        </div>
                    `;
                }

                this.displayResults( resultHTML, len );

            },
            ( err ) => {
                //console.info('error');
                //console.error(err);
                App.dialog({
                    title        : 'Network Error',
                    text         : 'There was an error while searching. Try again in a bit.',
                    okButton     : 'Try Again',
                    //cancelButton : 'Cancel'
                }, function (tryAgain) {
                    if (tryAgain) {
                        window.location.reload();
                    }
                });
            }
        );
        
        return;
    }

    displayLoading() {
        $('.loader').show();
    }

    hideLoading() {
        $('.loader').hide();
    }


    displayResults( resultHTML, len = 0 ) {
        $('#searchResults').html( resultHTML );
        $('#resultCount').html(`${len}`);
        $('.searchResults').show();
        this.hideLoading();
    }

    updateQueryString( newSearch ) {
        if (history.pushState) {
            var newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?q=${newSearch}`;
            window.history.pushState({path:newurl},'',newurl);
        }
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}