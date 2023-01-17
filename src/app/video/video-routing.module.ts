import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'
import { OrdersComponent } from '../orders/orders.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  // {
  //   path: 'manage',
  //   component: ManageComponent,
  //   data: {
  //     authOnly: true,
  //     authGuardPipe: redirectUnauthorizedTo
  //   },
  //   canActivate: [AngularFireAuthGuard]
  // },
  // {
  //   path: 'upload',
  //   component: UploadComponent,
  //   data: {
  //     authOnly: true,
  //     authGuardPipe: redirectUnauthorizedTo
  //   },
  //   canActivate: [AngularFireAuthGuard]
  // },
  {
      path: 'orders',
      component: OrdersComponent,
      data: {
        authOnly: true,
        authGuardPipe: redirectUnauthorizedTo
      },
      canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
