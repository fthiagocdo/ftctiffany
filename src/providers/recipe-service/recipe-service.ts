import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable()
export class RecipeService {

  constructor(private database: AngularFireDatabase, private storage: AngularFireStorage) { }

  getFiles() {
    let ref = this.database.list('files');
 
    return ref.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
 
  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`;
 
    return this.storage.ref('files/${newName}').putString(information);
  }
 
  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.database.list('files').push(toSave);
  }
 
 
  deleteFile(file) {
    let key = file.key;
    let storagePath = file.fullPath;
 
    let ref = this.database.list('files');
 
    ref.remove(key);
    return this.storage.ref(storagePath).delete();
  }

}