/***********************************************************************************************************
	@Name				: Doit_inpc_statusINPC_Opp
	@Company			: DoIT Cloud Consulting
	@Author				: Alvaro Bello Rangel
	@Mail				: alvaro.bello@doitcloud.consulting
	@Description		: LWC to validate if account have accpeted or not INPC
	@RelatedObjects	    : Account, Opportunity, Asignacion_de_INPC__c
	@CreatedDate		: December-2023
	@LastModified		: December-2023
	@Version			: 1.0

************************************************************************************************************/

import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

import INPC_CLAUSULA_FIELD from "@salesforce/schema/Account.Status_Clausula_INPC__c";
import ACCOUNTID_FIELD from "@salesforce/schema/Opportunity.AccountId";
import OPMONTHS_FIELD from "@salesforce/schema/Opportunity.PlazoContratacion__c";
import RENEWAL_FIELD from "@salesforce/schema/Opportunity.Tipo_de_Negocio__c";

export default class Doit_inpc_statusINPC_Opp extends LightningElement {

    @api recordId;
    accID;
    plazo;
    renewal = false;

    clausula = false;
    asignacion = false;
    negociacion = false;
    aprobacion = false;
    inpcAsigList;
    asigID;
    length;
    lastMRCwith;

    get optionsClausula() {
        return [
            { label: 'Cláusula no aceptada en Cuenta', value: '1' },
            { label: 'Cláusula aceptada pero no se ha creado Asignacíon INPC', value: '2' },
            { label: 'Cláusula INPC creada en la oportunidad', value: '3' },
            { label: 'Cláusula INPC en Negociación', value: '4' },
            { label: 'Cláusula INPC Aceptada por Legal', value: '5' },
        ];
    }
    @wire(getRelatedListRecords, {  parentRecordId: '$recordId', 
                                    relatedListId: 'Asignacion_de_INPC__r', 
                                    fields:['Asignacion_de_INPC__c.Id','Asignacion_de_INPC__c.INPC_Negociacion__c',
                                            'Asignacion_de_INPC__c.Name','Asignacion_de_INPC__c.Periodo__c', 'Asignacion_de_INPC__c.INPC_Aprobado__c',
                                            'Asignacion_de_INPC__c.MRC_c_Inflacion__c','Asignacion_de_INPC__c.CreatedDate']})
    asigINPC({error,data}){
        if(data){
            this.inpcAsigList = data.records;
            this.length = this.inpcAsigList.length > 0 ? this.inpcAsigList.length : 0;
            this.asignacion = this.inpcAsigList.length > 0 ? true : false;
            if(this.inpcAsigList.length > 0){
                this.lastMRCwith = this.inpcAsigList[this.length-1].fields.MRC_c_Inflacion__c.value;
                }
            }
        }

        
    @wire(getRecord, { recordId:'$recordId', fields: [ACCOUNTID_FIELD,OPMONTHS_FIELD,RENEWAL_FIELD]})
    oppdata({error,data}){
        if(data){
            this.renewal = data.fields.Tipo_de_Negocio__c.value == "Renovación" ? true : false;
            this.accID = data.fields.AccountId.value;
            this.plazo = data.fields.PlazoContratacion__c.value/12;
            }
        }
    

    @wire(getRecord, { recordId: '$accID', fields: [INPC_CLAUSULA_FIELD]})
    accdata({error, data}){
        if(data){
            if(data.fields.Status_Clausula_INPC__c.value == 'Con Cláusula'){
                this.clausula = true;
            }
        }
    }

    get statusClausula(){
        return this.clausula == false ? '1' : this.asignacion == false ? '2' : this.negociacion == false ? '3' : this.aprobacion == false ? '4' : '5';
    }

    get lengthval(){
        return this.length >= 0 ? true : false ;
    }

    get inpcLeft(){
        return (this.plazo - this.length)&&(this.clausula) > 0 ? true : false ;
    }
}