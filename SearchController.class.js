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
                                ${match.surah.number}:${match.numberInSurah} - ${match.surah.englishName}
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

    displayResults( resultHTML ) {
        $('#searchResults').html( resultHTML );
    }

}