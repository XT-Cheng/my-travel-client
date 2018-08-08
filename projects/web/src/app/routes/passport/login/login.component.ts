import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResult } from 'auth';
import { AuthService } from 'auth';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  count = 0;
  interval$: any;
  REDIRECT_DELAY = 1000;

  constructor(
    fb: FormBuilder,
    protected service: AuthService,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    this.modalSrv.closeAll();
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    this.loading = true;

    this.service
      .authenticate({
        username: this.userName.value,
        password: this.password.value,
      })
      .subscribe((result: AuthResult) => {
        // if (result.isSuccess()) {
        //   this.messages = result.getMessages();
        // } else {
        //   this.errors = result.getErrors();
        // }
        this.loading = false;

        if (result.isFailure()) {
          this.error = result.getErrors()[0];
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.REDIRECT_DELAY);
        }
      });

    // setTimeout(() => {
    //   this.loading = false;
    //   if (this.type === 0) {
    //     if (
    //       this.userName.value !== 'admin' ||
    //       this.password.value !== '888888'
    //     ) {
    //       this.error = `账户或密码错误`;
    //       return;
    //     }
    //   }

    //   // 清空路由复用信息
    //   this.reuseTabService.clear();
    //   // 设置Token信息
    //   this.tokenService.set({
    //     token: '123456789',
    //     name: this.userName.value,
    //     email: `cipchk@qq.com`,
    //     id: 10000,
    //     time: +new Date(),
    //   });
    //   // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
    //   // this.startupSrv.load().then(() => this.router.navigate(['/']));
    //   // 否则直接跳转
    //   this.router.navigate(['/']);
    // }, 1000);
  }

  // region: social

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
