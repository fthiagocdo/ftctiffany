import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Utils } from '../../providers/utils/utils';
import { ImageProvider } from '../../providers/image/image';
import { DatabaseProvider } from '../../providers/database/database';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import * as _ from 'lodash';
import { CategoryProvider } from '../../providers/category/category';

@IonicPage()
@Component({
  selector: 'page-edit-field',
  templateUrl: 'edit-field.html',
})
export class EditFieldPage {
  private fieldName: string = '';
  private fieldValue: any;
  private requiredField: boolean = true;
  private fieldType: string = '';
  private fieldValueTimeHour: number = 0;
  private fieldValueTimeMinute: number = 0;
  private fieldValueIngredient: string = '';
  private categories: any;
  
  constructor(
    private NAVPARAMS: NavParams,
    private VIEWCTRL: ViewController,
    private ALERTCTRL: AlertController,
    private UTILS: Utils,
    private IMG: ImageProvider,
    private DB: DatabaseProvider,
    private LOADER: PreloaderProvider,
    private CATEGORY: CategoryProvider,) {
      this.CATEGORY.categories.subscribe((_categories)=>{
        this.categories = _categories.list;
      });
  }

  ionViewDidLoad() {
    this.fieldName = this.NAVPARAMS.get('fieldName');
    this.fieldValue = this.NAVPARAMS.get('fieldValue');
    this.requiredField = this.NAVPARAMS.get('requiredField');

    if(
      this.fieldName.trim().toUpperCase() == 'nome'.trim().toUpperCase() ||
      this.fieldName.trim().toUpperCase() == 'descrição'.trim().toUpperCase() ||
      this.fieldName.trim().toUpperCase() == 'rendimento'.trim().toUpperCase()) {
        this.fieldType = 'input-text'
    } else if(this.fieldName.trim().toUpperCase() == 'Instruções de preparo'.trim().toUpperCase()) {
        this.fieldType = 'input-textarea';
    } else if(
      this.fieldName.trim().toUpperCase() == 'tempo de preparo'.trim().toUpperCase() ||
      this.fieldName.trim().toUpperCase() == 'tempo máximo de preparo'.trim().toUpperCase()) {
        this.fieldType = 'input-time';
        this.getFieldTime(this.fieldValue.split(' '));
    } else if(this.fieldName.trim().toUpperCase() == 'ingredientes'.trim().toUpperCase()) {
        this.fieldType = 'input-ingredient';
    } else if(this.fieldName.trim().toUpperCase() == 'categorias'.trim().toUpperCase()) {
      if(this.UTILS.isEmpty(this.fieldValue)) {
        this.fieldValue = [];
      }
      this.fieldType = 'input-category';
    } else if(this.fieldName.trim().toUpperCase() == 'imagem'.trim().toUpperCase()) {
      this.fieldType = 'image';
    }
  }

  getFieldTime(time: string[]) {
    if(time.length == 5) {
      this.fieldValueTimeHour = parseInt(time[0]);
      this.fieldValueTimeMinute = parseInt(time[3]);
    } else if(time.length == 2) {
      if(time[1] == 'hora' || time[1] == 'horas') {
        this.fieldValueTimeHour = parseInt(time[0]);
        this.fieldValueTimeMinute = 0;
      } else{
        this.fieldValueTimeHour = 0;
        this.fieldValueTimeMinute = parseInt(time[0]);
      }
    }
  }

  setFieldTime() {
    this.fieldValue = '';
    if(this.fieldValueTimeHour > 0) {
      this.fieldValue += this.fieldValueTimeHour;
      if(this.fieldValueTimeHour > 1) {
        this.fieldValue += ' horas';
      } else {
        this.fieldValue += ' hora';
      }

      if(this.fieldValueTimeMinute > 0) {
        this.fieldValue += ' e '+this.fieldValueTimeMinute;
        if(this.fieldValueTimeMinute > 1) {
          this.fieldValue += ' minutos';
        } else {
          this.fieldValue += ' minuto';
        }
      }
    } else {
      if(this.fieldValueTimeMinute > 0) {
        this.fieldValue += this.fieldValueTimeMinute;
        if(this.fieldValueTimeMinute > 1) {
          this.fieldValue += ' minutos';
        } else {
          this.fieldValue += ' minuto';
        }
      }
    }
  }

  addIngredient() {
    if(this.fieldValue == null){
      this.fieldValue = [];
    }

    if(!this.UTILS.isEmpty(this.fieldValueIngredient)) {
      this.fieldValue.push(this.fieldValueIngredient);
      this.fieldValueIngredient = '';
    }
  }

  addCategory(category) {
    if(this.fieldValue == null){
      this.fieldValue = [];
    }

    //Verifies if the category exists in the array
    if(_.findIndex(this.fieldValue, function(item) { return item == category; }) < 0) {
      this.fieldValue.push(category);
    } else {
      _.pull(this.fieldValue, category);
    }
  }

  checkCategory(category) {
    //Verifies if the category exists in the array
    if(_.findIndex(this.fieldValue, function(item) { return item == category; }) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  openConfirmDelete(ingredient) {
    let _class = this;

    let alert = this.ALERTCTRL.create({
      title: 'Remover ingrediente?',
      buttons: [{
        text: 'Sim',
        cssClass: 'ftc-primary-color',
        handler: () => {
          _class.fieldValue = _class.UTILS.removeItemArray(_class.fieldValue, ingredient);
        }
      }, {
        text: 'Não',
        cssClass: 'ftc-primary-color'
      }],
      cssClass: 'ftc-primary-color'
    });
    alert.present();
  }

  selectImage() {
    let _class = this;
    this.LOADER.displayPreloader();

    this.IMG.selectImage()
      .then((data) => {
        this.DB.uploadImage(data)
         .then((snapshot : any) => {
            _class.fieldValue = snapshot.downloadURL;
            _class.LOADER.hidePreloader();
         }, err => {
            console.log(err);
            _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
            _class.LOADER.hidePreloader();
         });
      });
   }

  cancel(){
    this.VIEWCTRL.dismiss(null);
  }

  confirm(){
    if(this.fieldType == 'input-time') {
      this.setFieldTime();
    }

    this.VIEWCTRL.dismiss(this.fieldValue);
  }

}
