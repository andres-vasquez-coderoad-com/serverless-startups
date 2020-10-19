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
        obj.id = document.id;
        return of(obj);
      }),
      toArray(),
    );
  }

  getById(path: string, id: string): Observable<any> {
    return from(this.firebaseApp.firestore().collection(path).doc(id).get()).pipe(
      map((document) => {
        const obj = document.data();
        if (!obj) {
          return null;
        }

        obj.id = document.id;
        return obj;
      }),
    );
  }

  create(path: string, obj: any): Observable<string> {
    return from(this.firebaseApp.firestore().collection(path).add(obj)).pipe(
      map((document) => document.id),
    );
  }

  update(path: string, id: string, obj: any): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(id).update(obj)).pipe(
      map(() => true),
    );


  }

  updateAll(path: string, id: string, obj: any): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(id).set(obj, { merge: false })).pipe(
      map(() => true),
    );
  }

  delete(path: string, id: string): Observable<boolean> {
    return from(this.firebaseApp.firestore().collection(path).doc(id).delete()).pipe(
      map(() => true),
    );
  }
}
