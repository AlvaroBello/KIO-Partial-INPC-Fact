/***********************************************************************************************************
	@Name				: doit_inpc_CreateINPC
	@Company			: DoIT Cloud Consulting
	@Author				: Alvaro Bello Rangel
	@Mail				: alvaro.bello@doitcloud.consulting
	@Description		: LWC to create a new INPC record
	@RelatedObjects	    : INPC__c
	@CreatedDate		: December-2023
	@LastModified		: December-2023
	@Version			: 1.0

************************************************************************************************************/
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import isDuplicated from '@salesforce/apex/doit_inpc_duplicateINPC.validateINPC';

import INPC_OBJECT from "@salesforce/schema/INPC__C";
import NAME_FIELD from "@salesforce/schema/INPC__C.Name";
import YEAR_FIELD from "@salesforce/schema/INPC__C.Year__c";
import MONTH_FIELD from "@salesforce/schema/INPC__C.Mes__c";
import INPCMX_FIELD from "@salesforce/schema/INPC__C.INPC_Mx__c";
import INPCUSA_FIELD from "@salesforce/schema/INPC__C.INPC_Dlrs__c";

export default class Doit_inpc_CreateINPC extends NavigationMixin(LightningElement) {

    year = '2023';
    month = 'Enero';
    inpcmx ="";
    inpcdlrs ="";
    isMX = false;
    isDlrs = false;
    ischecked = false;
    check = false;

    handleChangemx(event) {
        this.inpcmx = event.detail.value;
        this.isMX = false;
        if(this.inpcmx != '')
        {
            this.isMX=true;
        }
    }

    handleChangemonth(event){
        this.month = event.detail.value;
    }

    handleChangeyear(event){
        this.year = event.detail.value;
    }

    handleChange(){
        this.check = !this.check;
        if(this.check){
            this.showToastHelp('Se acaba de confirmar el envío de datos','Favor de corroborar los datos. Una vez enviados no es posible modificar el INPC','info');
        }
    }

    get fullInfo(){
        return !(this.isDlrs && this.isMX);
    }

    handleChangedlrs(event) {
        this.inpcdlrs = event.detail.value;
        this.isDlrs = false;
        if(this.inpcdlrs != '')
        {
            this.isDlrs=true;
        }
    }

    handleSubmit(){

        let isVal = true;

        if(!this.check){
            this.showToastHelp('Se debe confirmar la casilla','Se debe marcar la casilla final como confirmación para poder enviar los archivos','info');
            isVal=false;
        }
        if (isVal) {
            this.validateINPC();
        }
    }

    createINPC(){

        const fields = {};
 
            fields[NAME_FIELD.fieldApiName] = this.month+'-'+this.year;
            fields[YEAR_FIELD.fieldApiName] = this.year;
            fields[MONTH_FIELD.fieldApiName] = this.month;
            fields[INPCMX_FIELD.fieldApiName] = this.inpcmx;
            fields[INPCUSA_FIELD.fieldApiName] = this.inpcdlrs;
      
        const recordInput = {
            apiName: INPC_OBJECT.objectApiName,
            fields
        };      

        createRecord(recordInput)
            .then((result) => {
                this.showToastHelp('Se creo correctamente','El INPC se creo correctamente','success');
                this.navigateToRecord(result.id);
            });
            
    }
    navigateToRecord(idToNav){
        console.log(idToNav);
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

    validateINPC(){
        isDuplicated({
            year  : this.year,
            month : this.month
            })
            .then(result => {
                if(result == false)
                {
                    this.createINPC();
                }
                else{
                    this.showToastHelp('Ya existe un INPC','Ya existe un registro de INPC con los valores seleccionados ','error');
                }
            })
            .catch(error => {
                console.error('error:: \n ',error)
            });
    }

    showToastHelp(toastTittle, toastMessage, toastVar) {
        const event = new ShowToastEvent({
        title: toastTittle,
        message: toastMessage,
        variant: toastVar,
        });
        this.dispatchEvent(event);
  }
}