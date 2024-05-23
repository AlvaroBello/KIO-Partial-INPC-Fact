/***********************************************************************************************************
	@Name				: doit_inpc_duplicateINPC
	@Company			: DoIT Cloud Consulting
	@Author				: Alvaro Bello Rangel
	@Mail				: alvaro.bello@doitcloud.consulting
	@Description		: Class to validate if there is and existing INPC record
	@TestClass			: doit_inpc_duplicateINPC_test
	@RelatedObjects	    : INPC__c
	@CreatedDate		: December-2023
	@LastModified		: December-2023
	@Version			: 1.0

************************************************************************************************************/
public with sharing class doit_inpc_duplicateINPC {

    @AuraEnabled
    public static boolean validateINPC( String year, String month) {
        LIST<INPC__c> fetchINPC = [
                                    SELECT Id, Name, Mes__c
                                    FROM INPC__c
                                    WHERE Year__c =: year AND Mes__c =: month
                                    ];
        return fetchINPC.size() == 0 ? false : true;
    }
}