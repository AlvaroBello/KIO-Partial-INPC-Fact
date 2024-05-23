/***********************************************************************************************************
	@Name				: doit_inpc_duplicateINPC_test
	@Company			: DoIT Cloud Consulting
	@Author				: Alvaro Bello Rangel
	@Mail				: alvaro.bello@doitcloud.consulting
	@RelatedObjects	    : INPC__c
	@CreatedDate		: December-2023
	@LastModified		: December-2023
	@Version			: 1.0

************************************************************************************************************/
@isTest
public class doit_inpc_duplicateINPC_test {
    @isTest
    static void duplicateINPC_test() {
        
        INPC__c inpctest = new INPC__c();
        inpctest.Name ='Enero-2023';
        inpctest.Year__c = '2023';
        inpctest.Mes__c = 'Enero';
        inpctest.INPC_Mx__c = 2.8;
        inpctest.INPC_Dlrs__c = 1.2;

        insert inpctest;

        Test.startTest();
            doit_inpc_duplicateINPC.validateINPC('2023','Enero');
            Test.stopTest();
    }
}