/***********************************************************************************************************
	@Name				: doit_inpc_CreateINPCAsignation
	@Company			: DoIT Cloud Consulting
	@Author				: Alvaro Bello Rangel
	@Mail				: alvaro.bello@doitcloud.consulting
	@Description		: LWC to create a new "Asignacion INPC" record to relate INPC to Opportunity
	@RelatedObjects	    : Asignacion_de_INPC__c
	@CreatedDate		: December-2023
	@LastModified		: December-2023
	@Version			: 1.0

************************************************************************************************************/
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord, getFieldValue , getRecord, createRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import RT from '@salesforce/label/c.doit_inpc_rt_inpc';
import ANNIVERSARYRECORD from '@salesforce/label/c.doit_inpc_anniversary_id';

//Asignacion INPC
import INPCASIG_OBJECT from "@salesforce/schema/Asignacion_de_INPC__c";

import NAME_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Name";
import CONTROLINPC_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC__c";
import INPCHEREDADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Objetivo_de_Inflacion__c";
import INPCPACTADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC_Pactado__c";
import ACCOUNTINPC_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Account__c";
import OPPORTUNITYINPC_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Opportunity__c";
import PERIODO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Periodo__c";
import VIGENCIAINICIO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Vigencia_de_Inicio__c";
import VIGENCIAFIN_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Vigencia_de_Fin__c";
import MRCSSIN_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.MRC__c";
import MRCCON_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.MRC_c_Inflacion__c";
import MESAPLICO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Mes_que_aplico__c";
import MESQUEDEBICOAPLICAR_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Mes_que_debio_aplicar__c";
import RECORDTYPEID_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.RecordTypeId";


//Control INPC
import INPCMX_FIELD from "@salesforce/schema/INPC__C.INPC_Mx__c";
import INPCUSA_FIELD from "@salesforce/schema/INPC__C.INPC_Dlrs__c";
import YEAR_FIELD from "@salesforce/schema/INPC__C.Year__c";
import MONTH_FIELD from "@salesforce/schema/INPC__C.Mes__c";

//Oportunidad

import DIVISAOPP_FIELD from "@salesforce/schema/Opportunity.CurrencyIsoCode";
import CUENTAIDOPP_FIELD from "@salesforce/schema/Opportunity.AccountId";
import MRCTOTALOPP_FIELD from "@salesforce/schema/Opportunity.MRCTotal__c";


export default class Doit_inpc_CreateINPCAsignation extends NavigationMixin(LightningElement) {
    
    @api oppId;
    @api lengthINPC;
    @api mrc;
    @api renewal;

    fechaVal = true;
    firstyear = false;
    rtid = RT;

	check = false;
    createdINPC = false;

	inpcAsign;
    vigenciainicio ='';
    vigenciafin ='';
    mesqueaplico ='';
    mesquedebidoaplicar ='';
    cuentaid;
    mrctotal;
    divisaopp;
    month;
    year;

	inpcMXcontrol;
	inpcDLRScontrol;

    connectedCallback(){
        /*console.log('Renovacion si o no??  ' + this.renewal);
        this.renewal = true;*/
        if(this.lengthINPC == 0 && this.renewal == false){
            this.firstyear = true;
            this.inpcAsign = ANNIVERSARYRECORD;
        }
    }

    get inpcOpp(){
        return this.divisaopp == 'MXN' ? this.inpcMXcontrol : this.inpcDLRScontrol;
    }

    get mrcINPC(){
        return this.mrctotal + this.mrctotal*this.inpcOpp/100;
    }

    @wire(getRecord, { recordId:'$oppId', fields: [CUENTAIDOPP_FIELD,MRCTOTALOPP_FIELD,DIVISAOPP_FIELD]})
    accdata({error,data}){
            if(data){
                  this.cuentaid = data.fields.AccountId.value;
                  this.mrctotal = this.mrc != undefined ? this.mrc : data.fields.MRCTotal__c.value;
                  this.divisaopp = data.fields.CurrencyIsoCode.value;
            }
    }

    @wire(getRecord, { recordId:'$inpcAsign', fields: [INPCMX_FIELD,INPCUSA_FIELD,YEAR_FIELD,MONTH_FIELD]})
    inpcdata({error,data}){
            if(data){
                this.inpcMXcontrol = data.fields.INPC_Mx__c.value;
                this.inpcDLRScontrol = data.fields.INPC_Dlrs__c.value;
                this.year = data.fields.Year__c.value;
                this.month = data.fields.Mes__c.value;
            }
    }

	handleSubmit(){
        
        const fields = {};
 
            fields[NAME_FIELD.fieldApiName] = this.year + '-' + this.month + '-' + this.oppId;
            fields[CONTROLINPC_FIELD.fieldApiName] = this.inpcAsign;
            fields[INPCHEREDADO_FIELD.fieldApiName] = this.inpcOpp;
            fields[INPCPACTADO_FIELD.fieldApiName] = this.inpcOpp;
            fields[PERIODO_FIELD.fieldApiName] = 'Aniversario ' + this.lengthINPC;
			fields[ACCOUNTINPC_FIELD.fieldApiName] = this.cuentaid;
            fields[OPPORTUNITYINPC_FIELD.fieldApiName] = this.oppId;
            fields[VIGENCIAINICIO_FIELD.fieldApiName] = this.vigenciainicio;
			fields[VIGENCIAFIN_FIELD.fieldApiName] = this.vigenciafin;
            fields[MRCSSIN_FIELD.fieldApiName] = this.mrctotal;
            fields[MRCCON_FIELD.fieldApiName] = this.mrcINPC;
            fields[MESAPLICO_FIELD.fieldApiName] = this.mesqueaplico;
			fields[MESQUEDEBICOAPLICAR_FIELD.fieldApiName] = this.mesquedebidoaplicar;
            fields[RECORDTYPEID_FIELD.fieldApiName] = this.rtid;

      
        const recordInput = {
            apiName: INPCASIG_OBJECT.objectApiName,
            fields
        };      
        
        createRecord(recordInput)
            .then((result) => {
                this.showToastHelp('Se creo correctamente','Se asigno correctamente el INPC','success');
                const inputFields = this.template.querySelectorAll('lightning-input-field');
                inputFields.forEach( field => {
                field.reset();
                });
                this.navigateToRecord(result.id);
            });       
    }

    get fullInfo(){
        let isVal = true;
        let Val = false;
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            Val = isVal && element.reportValidity();
        });
        return Val && this.fechaVal;
    }

	handleChangeINPC(event){
		this.inpcAsign = event.detail.value[0];
	}

    handleChangeVI(event){
		this.vigenciainicio = event.detail.value;
        this.fechaInvalida();
	}

    handleChangeVF(event){
		this.vigenciafin = event.detail.value;
        this.fechaInvalida();
	}

    fechaInvalida(){
        this.fechaVal = true;
        if(this.vigenciafin < this.vigenciainicio && this.vigenciafin != ''){
            this.showToastHelp('Error en vigencia de fin','La vigencia de fin no puede ser anterior a la vigencia de inicio ','error'); 
            this.fechaVal = false;  
        }
          
    }

    handleChangeMes(event){
		this.mesqueaplico = event.detail.value;
	}

    handleChangeMesAplico(event){
		this.mesquedebidoaplicar = event.detail.value;
	}
    
	handleChange(){
        this.check = !this.check;
        if(this.check){
            this.showToastHelp('Se acaba de confirmar el registro INPC','Favor de corroborar los datos. Una vez enviados no es posible modificar el INPC asignado a la oportunidad','info');
        }
    }

	showToastHelp(toastTittle, toastMessage, toastVar) {
        const event = new ShowToastEvent({
        title: toastTittle,
        message: toastMessage,
        variant: toastVar,
        });
        this.dispatchEvent(event);
  	}

      navigateToRecord(idToNav){
        setTimeout(() => {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: idToNav,
                    actionName: 'view',
                },
            });
        }, 1000);
    }
    
}