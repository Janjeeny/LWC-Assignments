public class SearchAccounts {
	 @AuraEnabled(cacheable=true)
    public static List<Account> findAccounts(String searchTerm, Integer recLimit) {
        String key = '%' + searchTerm + '%';
        return [
            SELECT Id, Name, Phone, Industry
            FROM Account
            WHERE Name LIKE :key 
            LIMIT :recLimit
        ];
    }
    
   }