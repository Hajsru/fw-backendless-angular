import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule, FirebaseAppConfig, FirebaseOptions } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class HaJsCoreModule {
  static initializeApp(
    options: FirebaseOptions,
    nameOrConfig?: string | FirebaseAppConfig,
  ): ModuleWithProviders {
    return {
      ngModule: HaJsCoreModule,
      providers: [
        AngularFireModule.initializeApp(options, nameOrConfig).providers,
        AngularFirestoreModule.enablePersistence().providers,
        AngularFirestore,
      ],
    };
  }
}
