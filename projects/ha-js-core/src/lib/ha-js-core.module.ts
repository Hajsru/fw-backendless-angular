import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule, FirebaseAppConfig, FirebaseOptions } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [],
  imports: [AngularFirestoreModule.enablePersistence(), AngularFireStorageModule],
  exports: [],
})
export class HaJsCoreModule {
  static initializeApp(
    options: FirebaseOptions,
    nameOrConfig?: string | FirebaseAppConfig,
  ): ModuleWithProviders {
    return {
      ngModule: HaJsCoreModule,
      providers: [AngularFireModule.initializeApp(options, nameOrConfig).providers],
    };
  }
}
