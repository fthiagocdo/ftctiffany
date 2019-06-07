import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RecipeService } from '../../providers/recipe-service/recipe-service';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the AddRecipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html',
})
export class AddRecipePage {
  recipeName: string;
  recipeKey: string;
  imgPath: string;
  fileToUpload: any;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private recipeService: RecipeService,
    private imagePicker: ImagePicker) {

    this.recipeKey = null;
    this.recipeName = '';

    if (this.navParams.data.recipe) {
      this.recipeName = this.navParams.data.recipe.name;
      this.recipeKey = this.navParams.data.recipe.$key;
    }
  }

  save() {
    this.recipeService.uploadAndSave({
      name: this.recipeName,
      key: this.recipeKey,
      fileToUpload: this.fileToUpload
    });
    this.navCtrl.pop();
  }

  escolherFoto() {
    this.imagePicker.hasReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.pegarImagem();
        } else {
          this.solicitarPermissao();
        }
      }).catch(error => {
        console.error('Erro ao verificar permissão', error);
      });
  }

  solicitarPermissao() {
    this.imagePicker.requestReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.pegarImagem();
        } else {
          console.error('Permissão negada');
        }
      }).catch(error => {
        console.error('Erro ao solicitar permissão', error);
      });
  }

  pegarImagem() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1, //Apenas uma imagem
      outputType: 1 //BASE 64
    })
      .then(results => {
        if (results.length > 0) {
          this.imgPath = 'data:image/png;base64,' + results[0];
          this.fileToUpload = results[0];
        } else {
          this.imgPath = '';
          this.fileToUpload = null;
        }
      })
      .catch(error => {
        console.error('Erro ao recuperar a imagem', error);
      });
  }

}
