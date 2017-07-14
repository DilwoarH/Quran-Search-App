class QuranApi 
{
    
    constructor() {

        this.activeApiVersion = 'alquran.cloud';

        switch( this.activeApiVersion )
        {
            case "quran.com":
                this.host = 'http://quran.com';
                this.searchPath = '/api/api/v3/search?q={{ query }}&size=20&page=0&language=en';
                break;

            case "alquran.cloud":
            default:
                this.host = 'http://api.alquran.cloud';
                this.searchPath = '/search/{{ query }}/all/en';
                break;
        }

    }

    search( query='' ) {

        return new Promise(
            (resolve, reject) => {

                if ( query === '' || query === null )  
                    return resolve();
                
                var searchPath = this.searchPath.replace('{{ query }}',query);
                
                var url = `${this.host}${searchPath}`;

                $.getJSON( url )
                .done((json) => resolve(json))
                .fail((xhr, status, err) => reject(status + err.message));
                
            }
        );
        
    }

}