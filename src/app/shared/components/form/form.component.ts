import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  
  form = new FormGroup({});
  models = {};
  @Input() fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.fields = [{
      key: 'first_name',
      type: 'input',
      props: {
        label: 'First Name',
        placeholder: 'Enter First Name',
        required: true,
      },
    }, {
      key: 'last_name',
      type: 'input',
      props: {
        label: 'Last Name',
        placeholder: 'Enter last Name',
        required: true,
      },
    }, {
      key: 'email',
      type: 'input',
      props: {
        label: 'Email',
        placeholder: 'Enter email',
        required: true,
      },
    }, {
      key: 'phone',
      type: 'input',
      props: {
        label: 'Phone',
        placeholder: 'Enter Phone number',
        required: true,
      },
    },
  ...this.fields]
  }
  // fields: FormlyFieldConfig[] =[
  //   {
  //     key: 'first_name',
  //     type: 'input',
  //     props: {
  //       label: 'First Name',
  //       placeholder: 'Enter First Name',
  //       required: true,
  //     },
  //   }, {
  //     key: 'last_name',
  //     type: 'input',
  //     props: {
  //       label: 'Last Name',
  //       placeholder: 'Enter last Name',
  //       required: true,
  //     },
  //   }, {
  //     key: 'email',
  //     type: 'input',
  //     props: {
  //       label: 'Email',
  //       placeholder: 'Enter email',
  //       required: true,
  //     },
  //   }, {
  //     key: 'phone',
  //     type: 'input',
  //     props: {
  //       label: 'Phone',
  //       placeholder: 'Enter Phone number',
  //       required: true,
  //     },
  //   },
  // ]

  onSubmit() {
    if (this.form.valid) {
      console.log(this.models);
      
    }
  }

}
