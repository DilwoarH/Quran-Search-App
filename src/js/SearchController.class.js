class SearchController
{

    constructor() {
        this.searchBtnListenerInit();
    }

    searchBtnListenerInit() {
        $('#searchBtn').on('click', (e) => {
            this.searchBtnAction();
        });
    }

    searchBtnAction() {
        this.displayLoading();
        var searchText = $('#search').val();
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

}