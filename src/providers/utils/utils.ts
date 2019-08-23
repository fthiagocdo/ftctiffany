import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";
import { LoginPage } from "../../pages/login/login";
import * as _ from 'lodash';
import { CategoryProvider } from "../category/category";

@Injectable()
export class Utils {
  private categories: any;

  constructor(
    private ALERTCTRL: AlertController,
    private CATEGORY: CategoryProvider) { 
      this.CATEGORY.categories.subscribe((_categories)=>{
        this.categories = _categories;
      });
    }

  showMessage(message, messageType?) {
      if(message != null){
        if(messageType == 'error'){
          let alert = this.ALERTCTRL.create(  {
            title: 'Erro:',
            message: message,
            buttons: [{
              text: 'Ok',
              cssClass: 'ftc-error-color'
            }],
            cssClass: 'ftc-error-color'
          });
          alert.present();
        }else{
          let alert = this.ALERTCTRL.create({
            title: 'Mensagem:',
            message: message,
            buttons: [{
              text: 'Ok',
              cssClass: 'ftc-info-color'
            }],
            cssClass: 'ftc-info-color'
          });
          alert.present();
        }
      }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  isEmpty(value){
    if(value == null || value == 'null' || value == '' || value == ""){
      return true;
    }else{
      return false;
    }
  }

  isUserLogged(user, navCtrl) {
    if(user.isLogged){
      return true;
    }else{
      let alert = this.ALERTCTRL.create({
        title: 'Por favor, conecte-se à sua conta.',
        buttons: [{
          text: 'Cancelar',
          cssClass: 'ftc-info-color'
        }, {
          text: 'Conectar',
          cssClass: 'ftc-info-color',
          handler: () => {
            navCtrl.setRoot(LoginPage);
          },
        }],
        cssClass: 'ftc-info-color'
      });
      alert.present();
    }
  }

  removeItemArray(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
  }

  buildListIngredients(list: any[]) {
    let ingredientsList: any[] = [];
    list.forEach(ingredient => {
      ingredientsList.push(ingredient);
    });

    return ingredientsList;
  }

  buildStringIngredients(list: any[]) {
    let ingredientsString: string = ''
    list.forEach(ingredient => {
      ingredientsString += ingredient+'\n';
    });

    return ingredientsString;
  }

  buildListCategories(list: any[]) {
    let categoriesList: any[] = [];
    list.forEach(category => {
      categoriesList.push(category);
    });

    return categoriesList;
  }

  buildStringCategories(list: any[]) {
    let _class = this;
    let categoriesString: string = ''
    let cont: number = 0;
    //sort array by code
    _.sortBy(list, [function(item) { return item; }]).forEach(code => {
        //get category's name by the code
        let category = _.find(_class.categories.list, function(item) { return item.code == code; });
        categoriesString += category.name;
        if(cont < list.length - 1){
          categoriesString += ', ';
          cont++;
        }
    });

    return categoriesString;
  }

  getFieldTimeInMinutes(time: string[]) : number {
    let fieldValueTimeHour: number = 0;
    let fieldValueTimeMinute: number = 0;
    if(time.length == 5) {
      fieldValueTimeHour = parseInt(time[0]);
      fieldValueTimeMinute = parseInt(time[3]);
    } else if(time.length == 2) {
      if(time[1] == 'hora' || time[1] == 'horas') {
        fieldValueTimeHour = parseInt(time[0]);
        fieldValueTimeMinute = 0;
      } else{
        fieldValueTimeHour = 0;
        fieldValueTimeMinute = parseInt(time[0]);
      }
    }

    return (fieldValueTimeHour * 60) + fieldValueTimeMinute;
  }
}