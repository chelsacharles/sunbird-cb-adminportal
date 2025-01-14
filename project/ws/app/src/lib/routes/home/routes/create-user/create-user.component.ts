import { CreateMDOService } from './../../services/create-mdo.services'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { DirectoryService } from '../../services/directory.services'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  rolesList: any = []
  departmentName = ''
  toastSuccess: any
  departmentoptions: any = []
  dropdownSettings = {}
  receivedDept: any
  selectedDept: any
  public userRoles: Set<string> = new Set()
  queryParam: any
  deptId: any
  selectedMulti = -1
  currentDept: any
  createdDepartment!: any
  selected!: string
  roles = []
  selectedRoles: string[] = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private directoryService: DirectoryService,
    private createMDOService: CreateMDOService,
    private usersSvc: UsersService) {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['id']
      this.deptId = params['id']
      this.currentDept = params['currentDept']
      if (this.currentDept === 'CBP Providers') {
        this.currentDept = 'CBP'
      }
      const dept = params['createDept']
      if (dept) {
        this.createdDepartment = JSON.parse(dept)
      }
      // tslint:disable-next-line:radix
      this.queryParam = parseInt(this.queryParam)
    })
    if (!this.currentDept) {
      if (this.route.snapshot.queryParams.createDept) {
        const deptObj = JSON.parse(this.route.snapshot.queryParams.createDept)
        this.currentDept = deptObj.depType
      } else {
        this.currentDept = 'SPV'
      }

    }

    if (this.createdDepartment) {
      this.createUserForm = new FormGroup({
        fname: new FormControl('', [Validators.required]),
        lname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', [Validators.required, Validators.required]),
        dept: new FormControl(this.createdDepartment.depName, [Validators.required]),
      })
    } else {
      this.createUserForm = new FormGroup({
        fname: new FormControl('', [Validators.required]),
        lname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', [Validators.required, Validators.required]),
        dept: new FormControl('Karmayogi Bharat', [Validators.required]),
      })
    }

  }

  ngOnInit() {
    // this.getAllDept()
    this.getAllDepartmentsHeaderAPI()

    // this.getAllDepartmentsKong()
    // this.getAllDepartmentSubType()

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'deptName',
      enableCheckAll: false,
      itemsShowLimit: 10000,
      allowSearchFilter: true,
    }
  }
  getAllDepartmentsHeaderAPI() {
    this.directoryService.getDepartmentTitles().subscribe(res => {
      const departmentHeaderArray = JSON.parse(res.result.response.value)
      departmentHeaderArray.orgTypeList.forEach((ele: { name: any, isHidden: any, roles: [] }) => {
        if (ele.name === this.currentDept) {
          this.roles = ele.roles
        }
      })
    })
  }
  // getAllDept() {
  //   this.usersSvc.getAllDepartments().subscribe(res => {
  //     this.departmentoptions = res

  //     if (this.queryParam) {
  //       this.departmentoptions.forEach((dept: any) => {
  //         if (dept.id === this.queryParam) {
  //           this.rolesList = dept.rolesInfo
  //           const item = {
  //             deptName: dept.deptName,
  //             id: dept.id,
  //           }
  //           this.receivedDept = item
  //           this.departmentName = this.receivedDept.deptName
  //         }
  //       })
  //     }
  //   })
  // }

  // getAllDepartmentsKong() {
  //   this.deptId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
  //   this.usersSvc.getAllDepartmentsKong(this.deptId).subscribe(res => {
  //     this.createUserForm.patchValue({
  //       deptType: res.result.response.channel,
  //       dept: this.currentDept,
  //     })
  //   })
  // }

  /** methods related to Dropdown */
  onItemSelect(item: any[]) {
    this.selectedDept = item
    this.departmentoptions.forEach((dept: any) => {
      if (dept.id === this.selectedDept.id) {
        this.rolesList = dept.rolesInfo
      }
    })
  }

  /**On unselecting the option */
  onItemDeSelect() {
    this.selectedDept = ''
    this.createUserForm.value.department = ''
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }
  // getAllDepartmentSubType() {
  //   this.directoryService.getDepartmentTitles().subscribe(res => {
  //     const departmentHeaderArray = JSON.parse(res.result.response.value)
  //     // console.log(departmentHeaderArray)
  //   })
  // }
  onSubmit(form: any) {
    // form.value.department = this.selectedDept ? this.selectedDept.deptName : this.receivedDept.deptName
    const userreq = {
      personalDetails: {
        email: form.value.email,
        firstName: form.value.fname,
        lastName: form.value.lname,
        channel: form.value.dept,
      },
    }
    this.usersSvc.createUser(userreq).subscribe(userdata => {
      if (userdata.userId) {
        if (this.createdDepartment && this.createdDepartment.id) {
          this.deptId = this.createdDepartment.id
        }
        if (!this.deptId) {
          this.deptId = this.route.snapshot.queryParams && this.route.snapshot.queryParams.id
        }
        if (!this.deptId) {
          this.deptId = _.get(this.route, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
        }
        this.createMDOService.assignAdminToDepartment(userdata.userId, this.deptId,
                                                      this.createUserForm.value.role)
          .subscribe(data => {

            this.openSnackbar(`${data.result.response}`)

            this.router.navigate(['/app/home/users'])
          },         err => {
            this.router.navigate([`/app/home/users`])
            this.openSnackbar(`Error in assign roles ${err}`)
          })
      }
    },                                          err => {
      this.openSnackbar(`User reation ${err}`)

    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
