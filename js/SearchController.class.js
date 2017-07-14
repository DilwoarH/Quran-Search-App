class SearchController
{

    constructor() {

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
        
        quranApi.search( searchText )
        .then( 
            ( results ) => {
                console.info('success');
                
                if ( !results )
                {
                    this.displayResults( `<div>No Results Found</div>` );
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

                this.displayResults( resultHTML );

            },
            ( err ) => {
                console.info('error');
                console.error(err);
            
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


    displayResults( resultHTML ) {
        $('#searchResults').html( resultHTML );
        $('.searchResults').show();
        this.hideLoading();
    }

}