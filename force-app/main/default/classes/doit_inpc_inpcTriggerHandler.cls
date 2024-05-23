public with sharing class doit_inpc_inpcTriggerHandler {
    public static void calculateAnualINPC(INPC__c inpc) {
       /* Double inpcSum = 0;
        LIST<INPC__c> fetchINPC = [
                                    SELECT Id, INPC__c 
                                    FROM INPC__c
                                    WHERE Year__c =: inpc.year__c AND Mes__c != null
                                    ];
    
        for( INPC__c a : fetchINPC){
            inpcSum += a.INPC__c;
        }
        INPC__c inpctoUpdate = new INPC__c(id = inpc.id, INPC_Anual__c = inpcSum / fetchINPC.size());
        update inpctoUpdate;*/
    }
}