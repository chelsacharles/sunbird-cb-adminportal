import { ConfigResolveService } from './resolvers/config-resolver.service'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { InitResolver } from './resol./routes/profile-v2/discuss-all.component'
import { HomeResolve } from './resolvers/home-resolve'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { DirectoryViewComponent } from './routes/directory/directroy.component'
import { CreateMdoComponent } from './routes/create-mdo/create-mdo.component'
import { CreateUserComponent } from './routes/create-user/create-user.component'
import { DepartmentResolve } from './resolvers/department-resolve'
import { RolesResolver } from './resolvers/roles-resolver.service'
// import { PageResolve } from '@sunbird-cb/utils'
import { ModerationViewComponent } from './routes/moderation/moderation.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      department: DepartmentResolve,
      configService: ConfigResolveService,
    },
    data: {
      pageId: 'app/directory',
      module: 'Directory',
      pageType: 'feature',
      pageKey: 'directory',
    },
    children: [
      {
        path: 'users',
        component: UsersViewComponent,
        children: [],
        data: {
          pageId: 'app/users',
          module: 'user',
          pageType: 'feature',
          pageKey: 'Users',
        },
      },
      {
        path: 'roles-access',
        component: RolesAccessComponent,
        resolve: {
          rolesList: RolesResolver,
        },
        data: {
          pageId: 'app/roles-access',
          module: 'roles-access',
          pageType: 'feature',
          pageKey: 'RolesAndAccess',
        },
      },
      {
        path: 'directory',
        component: DirectoryViewComponent,
        data: {
          pageId: 'app/directory',
          module: 'directory',
          pageType: 'feature',
          pageKey: 'Directory',
        },
      },
      {
        path: 'moderation',
        component: ModerationViewComponent,
        // data: {
        //   pageId: 'app/moderation',
        //   module: 'diremoderationctory',
        //   pageType: 'feature',
        //   pageKey: 'Moderation',
        // },
        // resolve: {
        //   rolesList: RolesResolver,
        // },
      },
      {
        path: ':department/create-department',
        component: CreateMdoComponent,
        data: {
          pageId: 'app/create-department',
          module: 'create-department',
          pageType: 'feature',
          pageKey: 'createDepartment',
        },
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        children: [],
        data: {
          pageId: 'app/create-user',
          module: 'create-user',
          pageType: 'feature',
          pageKey: 'createUser',
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    HomeResolve,
    DepartmentResolve,
    ConfigResolveService,
    RolesResolver,
  ],
})
export class HomeRoutingModule { }
