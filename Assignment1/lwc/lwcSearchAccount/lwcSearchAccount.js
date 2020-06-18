import { LightningElement,track } from 'lwc';
import findAccounts from '@salesforce/apex/SearchAccounts.findAccounts';
export default class LwcSearchAccount extends LightningElement {
    @track AccountList = []; //using track decor
    fullAccountList = []; //records fetched from Apex call
    searchTerm = '';
    limit = 0;
    @track message = '';
    validForm = true;
    @track filterValue = '';
    showLoading = false;
    //function used to check whether the form is valid or not
    validateFields() {
        //using arrow function
        this.template.querySelectorAll('lightning-input').forEach(element => {
            
            if(!element.reportValidity())
            {
                console.log('Not valid?'+!element.reportValidity());
                this.validForm = false;
            }
            else 
            {
                if(element.name=="Term")
                {
                    console.log('Search Term'+element.value);
                    this.searchTerm =element.value;
                }
                if(element.name=="Limit")
                this.limit=element.value

            }
        });
    }


    fetchAccounts() {
        //initialize values for below variables on button click 
        this.validForm = true;
        

        //checking whether the function is valid before calling the server method
        this.validateFields()
        
        if(this.validForm){
            this.AccountList = [];
            this.fullAccountList = [];
            this.showLoading = true;
            this.message ='';
            this.filterValue = '';
            console.log('going to fetch Account from server');
        //imperative method call
         findAccounts({searchTerm:this.searchTerm,recLimit:this.limit})
            .then(result => {
                console.log(result.length)
                if(result.length > 0){
                    this.fullAccountList = result;
                    this.AccountList = this.fullAccountList;
                    this.showLoading = false;
                }
                else{
                    this.showLoading = false;
                    this.message = 'No records to show';
                }
                
            })
            .catch(error => {
                this.showLoading = false;
                this.message = error;
            });
        }
       
    }

    applyFilter(){
       console.log('filter method called');
       this.message = '';
       this.AccountList = this.fullAccountList.filter( (acc) => {
       
       return acc.Name.toLowerCase().includes(this.filterValue.toLowerCase()); 
      }) 
      if(this.AccountList<=0){
        this.message = 'No records to show';
      }
    }
    
    //fetching input form form without using queryselecter()
    filterVal(event)
    {
        this.filterValue = event.target.value;
    }

    //getter function
    get AccountListLength()
    {
        return this.AccountList.length>0?true:false;
    }

    //getter function.
    get displayMessage()
    {
        return this.message.length>0?true:false;
    }

}