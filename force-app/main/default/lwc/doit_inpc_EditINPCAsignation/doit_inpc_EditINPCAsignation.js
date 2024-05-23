import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord  } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import ANNIVERSARYRECORD from '@salesforce/label/c.doit_inpc_anniversary_id';

import ID_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Id";
import INPCCONTROL_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC__c";
import INPCNEGOCIADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC_Negociado__c";
import INPCAPROBADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC_Aprobado__c";
import INPCNEGOCIADOCHECK_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC_Negociacion__c";
import INPCHEREDADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Objetivo_de_Inflacion__c";
import INPCPACTADO_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.INPC_Pactado__c";
import COMENTARIOS_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.Comentarios_INPC_Vendedor__c";
import MRCCON_FIELD from "@salesforce/schema/Asignacion_de_INPC__c.MRC_c_Inflacion__c";

export default class Doit_inpc_EditINPCAsignation extends NavigationMixin(LightningElement) {

    @api recordIdAsignacion;
    @api negociando;
    @api aceptado;

    check = false;

    firstrecord = ANNIVERSARYRECORD;
    firstyear = false;
    mrcupdated;

    inpcpactado;
    inpcoriginal;
    envionegociacion = false;
    comments;

    @wire(getRecord, { recordId:'$recordIdAsignacion', fields: [INPCHEREDADO_FIELD, INPCCONTROL_FIELD, MRCCON_FIELD]})
    inpcdata({error,data}){
            if(data){
                this.firstyear = data.fields.INPC__c.value == this.firstrecord ? true : false ;
                this.inpcoriginal = data.fields.Objetivo_de_Inflacion__c.value;
                this.mrcupdated = data.fields.MRC_c_Inflacion__c.value;
                if(!this.aceptado && !this.negociando){
                    this.inpcpactado = data.fields.Objetivo_de_Inflacion__c.value;
                }
            }
    }

    get nonegociable(){
        return (this.negociando || this.firstyear || this.aceptado) ? true : false;
    }

    handleChangeINPC(event){
        this.envionegociacion = false;
		this.inpcpactado = event.detail.value;
		if(this.inpcpactado != ''){
            if(this.inpcpactado < this.inpcoriginal){
                this.envionegociacion = true;
                this.showToastHelp('Anexar comentarios','Por favor agregar comentarios si se requiere enviar a negociación','info');
            }
		}    
	}

    handleChangeComments(event){
        this.comments = event.detail.value;
    }

    handleSubmit(){
        const fields = {};
            fields[ID_FIELD.fieldApiName] = this.recordIdAsignacion;
            fields[INPCNEGOCIADO_FIELD.fieldApiName] = this.inpcpactado;
            fields[INPCNEGOCIADOCHECK_FIELD.fieldApiName] = this.envionegociacion;
            if(this.inpcpactado < this.inpcoriginal){
                fields[COMENTARIOS_FIELD.fieldApiName] = this.comments;
            }
            if(this.inpcpactado >= this.inpcoriginal){
                console.log(this.mrcupdated + this.mrcupdated*this.inpcpactado/100);
                fields[INPCPACTADO_FIELD.fieldApiName] = this.inpcpactado;
                fields[MRCCON_FIELD.fieldApiName] = this.mrcupdated + this.mrcupdated*this.inpcpactado/100;
                fields[INPCAPROBADO_FIELD.fieldApiName] = true;
            }
      
        const recordInput = {
            fields
        };      
        
        updateRecord(recordInput)
            .then((result) => {
                this.check = false;
                if(this.inpcpactado < this.inpcoriginal){
                    this.showToastHelp('Se actualizo correctamente','Se actualizo correctamente el INPC y fue enviado a aprobación','success');
                }
                else{
                    this.showToastHelp('Se actualizo correctamente','Se actualizo correctamente el INPC y fue aprobado','success');
                }
            }); 
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