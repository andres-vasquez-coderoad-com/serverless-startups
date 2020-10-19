import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { from, Observable, of, zip } from 'rxjs';
import { concatMap, flatMap, map, toArray } from 'rxjs/operators';

@Injectable()
export class RepositoryService {
  firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    const firebaseServiceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT');
    const firebaseDatabaseUrl = this.configService.get<string>('FIREBASE_DATABASE_URL');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(firebaseServiceAccount);
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseDatabaseUrl,
    });
  }

  getAll(path: string): Observable<Array<any>> {
    return from(this.firebaseApp.firestore().collection(path).get()).pipe(
      flatMap(documents => documents.docs),
      concatMap((document) => {
        const obj = document.data();
        obj.uuid = document.id;
        return of(obj);
      }),
      toArray(),
    );
  }

  getByUuid(path: string, uuid: string): Observable<any> {
    return from(this.firebaseApp.firestore().collection(path).doc(uuid).get()).pipe(
      map((document) => {
        const obj = document.data();
        if (!obj) {
          return null;
        }

        obj.uuid = document.id;
        return obj;
      }),
    );
  }

  create(path: string, obj: any): Observable<string> {
    return from(this.firebaseApp.firestore().collection(path).add(obj)).pipe(
      map((document) => document.id),
    );
  }

  update(path: string, uuid: string, obj: any): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(uuid).update(obj)).pipe(
      map(() => true),
    );


  }

  updateAll(path: string, uuid: string, obj: any): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(uuid).set(obj, { merge: false })).pipe(
      map(() => true),
    );
  }

  delete(path: string, uuid: string): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(uuid).delete()).pipe(
      map(() => true),
    );
  }
}
